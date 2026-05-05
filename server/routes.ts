import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertBookingSchema, insertTimeBlockSchema, insertWebhookSchema } from "../shared/schema";
import { fireWebhooks } from "./webhooks";
import { pushBookingToTeamup, cancelTeamupEvent, deleteTeamupEvent, handleTeamupWebhook, getTeamupEventsForStaffDate } from "./teamup";

declare module "express-serve-static-core" {
  interface Request {
    staffAccount?: {
      id: number;
      name: string;
      email: string;
      role: string;
      staffDataId: string;
    };
  }
}

const router = Router();

function parseTimeTo24(t: string): number {
  const [time, period] = t.split(" ");
  let [h] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h;
}

const SERVICE_DURATIONS: Record<string, number> = {
  s1: 60, s2: 120, s3: 120, s4: 180, s5: 150, s6: 240, s7: 300, s8: 300,
  s9: 180, s10: 180, s11: 120, s12: 60,
};

function timeToMinutes(t: string): number {
  const [time, period] = t.split(" ");
  const [hStr, mStr] = time.split(":");
  let h = parseInt(hStr);
  const m = parseInt(mStr);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function minutesToHourSlot(mins: number): string {
  const hour = Math.floor(mins / 60);
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${h}:00 ${ampm}`;
}

/** Given a start time string and duration in minutes, return all 1-hour slot strings the booking overlaps */
function getCoveredHourSlots(startTime: string, durationMin: number): string[] {
  const startMin = timeToMinutes(startTime);
  const endMin = startMin + durationMin;
  const firstHour = Math.floor(startMin / 60);
  const lastHour = Math.ceil(endMin / 60);
  const slots: string[] = [];
  for (let h = firstHour; h < lastHour; h++) {
    slots.push(minutesToHourSlot(h * 60));
  }
  return slots;
}

function bookingsOverlap(startA: number, durA: number, startB: number, durB: number): boolean {
  return startA < startB + durB && startB < startA + durA;
}

function isTimeBlocked(bookingTime: string, blocks: { startTime: string; endTime: string }[], durationMin: number = 60): boolean {
  const startMin = timeToMinutes(bookingTime);
  const endMin = startMin + durationMin;
  return blocks.some((b) => {
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);
    return startMin < bEnd && bStart < endMin;
  });
}

function log(action: string, details: string) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${action}: ${details}`);
}

const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;
const ATTEMPT_WINDOW = 15 * 60 * 1000;

function cleanupAttempts() {
  const now = Date.now();
  for (const [key, val] of loginAttempts) {
    if (val.lockedUntil && now > val.lockedUntil) loginAttempts.delete(key);
  }
}
setInterval(cleanupAttempts, 60 * 1000);

router.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    log("LOGIN_FAIL", `Missing credentials from ${req.ip}`);
    return res.status(400).json({ error: "Email and password required" });
  }

  const key = `${(email || "").toLowerCase().trim()}::${req.ip}`;
  const attempts = loginAttempts.get(key);
  const now = Date.now();

  if (attempts && attempts.lockedUntil > now) {
    const remainMin = Math.ceil((attempts.lockedUntil - now) / 60000);
    log("LOGIN_LOCKED", `Account locked for "${email}" from ${req.ip}, ${remainMin}min remaining`);
    return res.status(429).json({ error: `Too many failed attempts. Try again in ${remainMin} minutes.` });
  }

  const staff = await storage.getStaffByEmail(email);
  if (!staff) {
    log("LOGIN_FAIL", `Unknown email "${email}" from ${req.ip}`);
    const current = loginAttempts.get(key) || { count: 0, lockedUntil: 0 };
    current.count++;
    if (current.count >= MAX_LOGIN_ATTEMPTS) {
      current.lockedUntil = now + LOCKOUT_DURATION;
      log("LOGIN_LOCKOUT", `Locked out "${email}" from ${req.ip} after ${current.count} failed attempts`);
    }
    loginAttempts.set(key, current);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, staff.passwordHash);
  if (!valid) {
    log("LOGIN_FAIL", `Wrong password for "${email}" from ${req.ip}`);
    const current = loginAttempts.get(key) || { count: 0, lockedUntil: 0 };
    current.count++;
    if (current.count >= MAX_LOGIN_ATTEMPTS) {
      current.lockedUntil = now + LOCKOUT_DURATION;
      log("LOGIN_LOCKOUT", `Locked out "${email}" from ${req.ip} after ${current.count} failed attempts`);
    }
    loginAttempts.set(key, current);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  loginAttempts.delete(key);
  (req.session as any).staffId = staff.id;
  log("LOGIN_OK", `${staff.name} (${staff.email}) logged in, role=${staff.role}, ip=${req.ip}`);
  res.json({
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    staffDataId: staff.staffDataId,
  });
});

router.post("/api/auth/logout", (req: Request, res: Response) => {
  const staffId = (req.session as any)?.staffId;
  log("LOGOUT", `staffId=${staffId || "unknown"}, ip=${req.ip}`);
  req.session.destroy(() => {});
  res.json({ ok: true });
});

router.patch("/api/auth/change-password", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) {
    log("AUTH_DENIED", `Unauthenticated PATCH /api/auth/change-password from ${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }

  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) {
    log("AUTH_DENIED", `Invalid session staffId=${sessionStaffId} PATCH /api/auth/change-password from ${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { targetStaffId, currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    log("PASSWORD_CHANGE_FAIL", `${staff.name} provided password too short`);
    return res.status(400).json({ error: "New password must be at least 6 characters" });
  }

  const targetId = targetStaffId ? parseInt(targetStaffId) : staff.id;

  if (targetId !== staff.id && staff.role !== "admin") {
    log("AUTH_DENIED", `${staff.name} tried to change password for staffId=${targetId}`);
    return res.status(403).json({ error: "Only admin can change other staff passwords" });
  }

  if (targetId === staff.id) {
    if (!currentPassword) {
      return res.status(400).json({ error: "Current password is required" });
    }
    const valid = await bcrypt.compare(currentPassword, staff.passwordHash);
    if (!valid) {
      log("PASSWORD_CHANGE_FAIL", `${staff.name} provided wrong current password`);
      return res.status(401).json({ error: "Current password is incorrect" });
    }
  }

  const targetStaff = targetId === staff.id ? staff : await storage.getStaffById(targetId);
  if (!targetStaff) {
    log("PASSWORD_CHANGE_FAIL", `${staff.name} target staffId=${targetId} not found`);
    return res.status(404).json({ error: "Staff member not found" });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await storage.updateStaffPassword(targetId, hash);
  log("PASSWORD_CHANGED", `${staff.name} changed password for ${targetStaff.name} (id=${targetId})`);
  res.json({ ok: true });
});

router.get("/api/staff", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) {
    log("AUTH_DENIED", `Unauthenticated GET /api/staff from ${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }
  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  if (staff.role !== "admin") {
    log("AUTH_DENIED", `${staff.name} tried to access GET /api/staff`);
    return res.status(403).json({ error: "Admin only" });
  }

  const allStaff = await storage.getAllStaff();
  const safeStaff = allStaff.map(({ id, name, email, role, staffDataId }) => ({ id, name, email, role, staffDataId }));
  log("STAFF_READ", `${staff.name} fetched staff list (${safeStaff.length} members)`);
  res.json(safeStaff);
});

router.get("/api/bookings/availability", async (req: Request, res: Response) => {
  const { staffId, date } = req.query;
  if (!staffId || !date) {
    return res.status(400).json({ error: "staffId and date are required" });
  }

  const existing = await storage.getBookingsByStaffAndDate(String(staffId), String(date));
  const activeBookings = existing.filter((b) => b.status !== "cancelled");

  const bookedSlotMap = new Map<string, string>();
  for (const b of activeBookings) {
    const dur = SERVICE_DURATIONS[b.serviceId] || 60;
    for (const slot of getCoveredHourSlots(b.time, dur)) {
      if (!bookedSlotMap.has(slot)) bookedSlotMap.set(slot, b.serviceId);
    }
  }

  const teamupEvents = await getTeamupEventsForStaffDate(String(staffId), String(date));
  for (const te of teamupEvents) {
    const startMin = timeToMinutes(te.time);
    const endMin = timeToMinutes(te.endTime);
    const dur = Math.max(60, endMin - startMin);
    for (const slot of getCoveredHourSlots(te.time, dur)) {
      if (!bookedSlotMap.has(slot)) bookedSlotMap.set(slot, "teamup");
    }
  }

  const blocks = await storage.getTimeBlocksByStaffAndDate(String(staffId), String(date));
  for (const b of blocks) {
    const startMin = timeToMinutes(b.startTime);
    const endMin = timeToMinutes(b.endTime);
    const dur = Math.max(60, endMin - startMin);
    for (const slot of getCoveredHourSlots(b.startTime, dur)) {
      if (!bookedSlotMap.has(slot)) bookedSlotMap.set(slot, "blocked");
    }
  }

  const booked = Array.from(bookedSlotMap.entries()).map(([time, serviceId]) => ({ time, serviceId }));
  const blocked = blocks.map((b) => ({ startTime: b.startTime, endTime: b.endTime, reason: b.reason }));

  log("AVAILABILITY_CHECK", `staffId=${staffId} date=${date} → ${booked.length} booked (${teamupEvents.length} from teamup), ${blocked.length} blocked, ip=${req.ip}`);
  res.json({ booked, blocked });
});

router.get("/api/auth/me", async (req: Request, res: Response) => {
  const staffId = (req.session as any)?.staffId;
  if (!staffId) {
    log("AUTH_CHECK", `No session, ip=${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }
  const staff = await storage.getStaffById(staffId);
  if (!staff) {
    log("AUTH_CHECK", `Invalid session staffId=${staffId}, ip=${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }
  log("AUTH_CHECK", `${staff.name} (${staff.role}) session valid`);
  res.json({
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    staffDataId: staff.staffDataId,
  });
});

router.get("/api/bookings", async (req: Request, res: Response) => {
  const staffId = (req.session as any)?.staffId;
  if (!staffId) {
    log("AUTH_DENIED", `Unauthenticated GET /api/bookings from ${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }
  const staff = await storage.getStaffById(staffId);
  if (!staff) {
    log("AUTH_DENIED", `Invalid session staffId=${staffId} GET /api/bookings from ${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }

  let bookingsList;
  if (staff.role === "admin") {
    bookingsList = await storage.getAllBookings();
    log("BOOKINGS_READ", `${staff.name} (admin) fetched all ${bookingsList.length} bookings`);
  } else {
    bookingsList = await storage.getBookingsByStaffId(staff.staffDataId);
    log("BOOKINGS_READ", `${staff.name} fetched ${bookingsList.length} own bookings`);
  }
  bookingsList = bookingsList.filter((b: any) => !/^off$/i.test(b.clientName));
  res.json(bookingsList);
});

router.post("/api/bookings", async (req: Request, res: Response) => {
  try {
    const data = insertBookingSchema.parse(req.body);

    data.status = "pending";

    const newDur = SERVICE_DURATIONS[data.serviceId] || 60;
    const newStart = timeToMinutes(data.time);

    const existing = await storage.getBookingsByStaffAndDate(data.staffId, data.date);
    const activeBookings = existing.filter((b) => b.status !== "cancelled");
    const conflict = activeBookings.find((b) => {
      const bDur = SERVICE_DURATIONS[b.serviceId] || 60;
      const bStart = timeToMinutes(b.time);
      return bookingsOverlap(newStart, newDur, bStart, bDur);
    });
    if (conflict) {
      log("BOOKING_CONFLICT", `Double-booking blocked: staff=${data.staffId} date=${data.date} time=${data.time} dur=${newDur}min conflicts with existing ${conflict.time} client="${data.clientName}" ip=${req.ip}`);
      return res.status(409).json({ error: "This time slot is already booked. Please choose a different time." });
    }

    const teamupEvents = await getTeamupEventsForStaffDate(data.staffId, data.date);
    const teamupConflict = teamupEvents.find((e) => {
      const eStart = timeToMinutes(e.time);
      const eEnd = timeToMinutes(e.endTime);
      const eDur = Math.max(60, eEnd - eStart);
      return bookingsOverlap(newStart, newDur, eStart, eDur);
    });
    if (teamupConflict) {
      log("BOOKING_CONFLICT_TEAMUP", `Teamup double-booking blocked: staff=${data.staffId} date=${data.date} time=${data.time} client="${data.clientName}" teamup="${teamupConflict.title}" ip=${req.ip}`);
      return res.status(409).json({ error: "This time slot is already booked. Please choose a different time." });
    }

    const blocks = await storage.getTimeBlocksByStaffAndDate(data.staffId, data.date);
    if (isTimeBlocked(data.time, blocks, newDur)) {
      log("BOOKING_BLOCKED", `Time-block prevented booking: staff=${data.staffId} date=${data.date} time=${data.time} client="${data.clientName}" ip=${req.ip}`);
      return res.status(409).json({ error: "This time slot is blocked. Please choose a different time." });
    }

    let booking;
    try {
      booking = await storage.createBooking(data);
    } catch (dbErr: any) {
      if (dbErr.code === "23505") {
        log("BOOKING_CONFLICT", `DB unique constraint blocked: staff=${data.staffId} date=${data.date} time=${data.time} client="${data.clientName}" ip=${req.ip}`);
        return res.status(409).json({ error: "This time slot is already booked. Please choose a different time." });
      }
      throw dbErr;
    }
    const sessionStaffId = (req.session as any)?.staffId;
    const staffAccount = sessionStaffId ? await storage.getStaffById(sessionStaffId) : null;
    const who = staffAccount ? `${staffAccount.name} (staff)` : `public client`;
    log("BOOKING_CREATED", `${who} created booking id=${booking.id} client="${booking.clientName}" service=${booking.serviceId} staff=${booking.staffId} date=${booking.date} time=${booking.time} ip=${req.ip}`);
    fireWebhooks(booking.staffId, "booking.created", booking).catch(() => {});
    pushBookingToTeamup(booking).catch(() => {});
    res.status(201).json(booking);
  } catch (err: any) {
    log("BOOKING_CREATE_FAIL", `Error from ${req.ip}: ${err.message}`);
    res.status(400).json({ error: err.message || "Invalid booking data" });
  }
});

router.patch("/api/bookings/:id", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) {
    log("AUTH_DENIED", `Unauthenticated PATCH /api/bookings/${req.params.id} from ${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }

  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) {
    log("AUTH_DENIED", `Invalid session staffId=${sessionStaffId} PATCH /api/bookings/${req.params.id} from ${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }

  const id = parseInt(req.params.id);
  const { status, date, time, serviceId } = req.body;

  const existing = await storage.getBookingById(id);
  if (!existing) {
    log("BOOKING_UPDATE_FAIL", `${staff.name} PATCH booking ${id} not found`);
    return res.status(404).json({ error: "Booking not found" });
  }

  if (staff.role !== "admin" && existing.staffId !== staff.staffDataId) {
    log("AUTH_DENIED", `${staff.name} tried to update booking ${id} owned by staff ${existing.staffId}`);
    return res.status(403).json({ error: "Not authorized" });
  }

  if (status && !date && !time && !serviceId) {
    const booking = await storage.updateBookingStatus(id, status);
    log("BOOKING_STATUS", `${staff.name} changed booking ${id} ("${existing.clientName}") status: ${existing.status} → ${status}`);
    if (status === "cancelled" && existing.teamupEventId) {
      cancelTeamupEvent({ id, clientName: existing.clientName, serviceId: existing.serviceId, teamupEventId: existing.teamupEventId }).catch(() => {});
    } else if (booking) {
      pushBookingToTeamup(booking).catch(() => {});
    }
    return res.json(booking);
  }

  const updateData: any = {};
  if (status) updateData.status = status;
  if (date) updateData.date = date;
  if (time) updateData.time = time;
  if (serviceId) updateData.serviceId = serviceId;

  if ((date || time || serviceId) && existing.status !== "cancelled") {
    const checkDate = date || existing.date;
    const checkTime = time || existing.time;
    const checkServiceId = serviceId || existing.serviceId;
    const checkDur = SERVICE_DURATIONS[checkServiceId] || 60;
    const checkStart = timeToMinutes(checkTime);
    const existingBookings = await storage.getBookingsByStaffAndDate(existing.staffId, checkDate);
    const conflict = existingBookings.find((b) => {
      if (b.id === id || b.status === "cancelled") return false;
      const bDur = SERVICE_DURATIONS[b.serviceId] || 60;
      const bStart = timeToMinutes(b.time);
      return bookingsOverlap(checkStart, checkDur, bStart, bDur);
    });
    if (conflict) {
      log("BOOKING_CONFLICT", `${staff.name} tried to move booking ${id} to ${checkDate} ${checkTime} but slot taken`);
      return res.status(409).json({ error: "This time slot is already booked." });
    }
    const blocks = await storage.getTimeBlocksByStaffAndDate(existing.staffId, checkDate);
    if (isTimeBlocked(checkTime, blocks, checkDur)) {
      log("BOOKING_BLOCKED", `${staff.name} tried to move booking ${id} to blocked time ${checkDate} ${checkTime}`);
      return res.status(409).json({ error: "This time slot is blocked." });
    }
  }

  const booking = await storage.updateBooking(id, updateData);
  const changes = Object.entries(updateData).map(([k, v]) => `${k}=${v}`).join(", ");
  log("BOOKING_UPDATED", `${staff.name} updated booking ${id} ("${existing.clientName}"): ${changes}`);
  if (booking) {
    pushBookingToTeamup({ ...booking, teamupEventId: existing.teamupEventId }).catch(() => {});
  }
  res.json(booking);
});

router.patch("/api/bookings/:id/notes", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) {
    log("AUTH_DENIED", `Unauthenticated PATCH /api/bookings/${req.params.id}/notes from ${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }

  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) {
    log("AUTH_DENIED", `Invalid session staffId=${sessionStaffId} PATCH /api/bookings/${req.params.id}/notes from ${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }

  const id = parseInt(req.params.id);
  const { notes } = req.body;

  const existing = await storage.getBookingById(id);
  if (!existing) {
    log("BOOKING_NOTES_FAIL", `${staff.name} PATCH notes booking ${id} not found`);
    return res.status(404).json({ error: "Booking not found" });
  }

  if (staff.role !== "admin" && existing.staffId !== staff.staffDataId) {
    log("AUTH_DENIED", `${staff.name} tried to update notes on booking ${id} owned by staff ${existing.staffId}`);
    return res.status(403).json({ error: "Not authorized" });
  }

  const booking = await storage.updateBookingNotes(id, notes || null);
  log("BOOKING_NOTES", `${staff.name} updated notes on booking ${id} ("${existing.clientName}")`);
  res.json(booking);
});

router.delete("/api/bookings/:id", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) {
    log("AUTH_DENIED", `Unauthenticated DELETE /api/bookings/${req.params.id} from ${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }

  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) {
    log("AUTH_DENIED", `Invalid session staffId=${sessionStaffId} DELETE /api/bookings/${req.params.id} from ${req.ip}`);
    return res.status(401).json({ error: "Not authenticated" });
  }

  const id = parseInt(req.params.id);
  const existing = await storage.getBookingById(id);
  if (!existing) {
    log("BOOKING_DELETE_FAIL", `${staff.name} DELETE booking ${id} not found`);
    return res.status(404).json({ error: "Booking not found" });
  }

  if (staff.role !== "admin" && existing.staffId !== staff.staffDataId) {
    log("AUTH_DENIED", `${staff.name} tried to delete booking ${id} owned by staff ${existing.staffId}`);
    return res.status(403).json({ error: "Not authorized" });
  }

  if (existing.teamupEventId) {
    deleteTeamupEvent(existing.teamupEventId).catch(() => {});
  }
  await storage.softDeleteBooking(id, staff.name);
  log("BOOKING_DELETED", `${staff.name} deleted booking ${id} ("${existing.clientName}" - ${existing.date} ${existing.time})`);
  res.json({ ok: true });
});

router.get("/api/bookings/deleted", async (req: Request, res: Response) => {
  const staffId = (req.session as any)?.staffId;
  if (!staffId) return res.status(401).json({ error: "Not authenticated" });
  const staff = await storage.getStaffById(staffId);
  if (!staff) return res.status(401).json({ error: "Not authenticated" });

  let deleted;
  if (staff.role === "admin") {
    deleted = await storage.getDeletedBookings();
  } else {
    deleted = await storage.getDeletedBookingsByStaffId(staff.staffDataId);
  }
  deleted = deleted.filter((b: any) => !/^off$/i.test(b.clientName));
  res.json(deleted);
});

router.post("/api/bookings/:id/restore", async (req: Request, res: Response) => {
  const staffId = (req.session as any)?.staffId;
  if (!staffId) return res.status(401).json({ error: "Not authenticated" });
  const staff = await storage.getStaffById(staffId);
  if (!staff) return res.status(401).json({ error: "Not authenticated" });
  if (staff.role !== "admin") return res.status(403).json({ error: "Admin only" });

  const id = parseInt(req.params.id);
  const restored = await storage.restoreBooking(id);
  if (!restored) return res.status(404).json({ error: "Booking not found" });

  log("BOOKING_RESTORED", `${staff.name} restored booking ${id} ("${restored.clientName}" - ${restored.date} ${restored.time})`);
  res.json(restored);
});

router.get("/api/time-blocks", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  let blocks;
  if (staff.role === "admin") {
    blocks = await storage.getAllTimeBlocks();
  } else {
    blocks = await storage.getTimeBlocksByStaffId(staff.staffDataId);
  }
  res.json(blocks);
});

router.get("/api/time-blocks/availability", async (req: Request, res: Response) => {
  const { staffId, date } = req.query;
  if (!staffId || !date) {
    return res.status(400).json({ error: "staffId and date are required" });
  }
  const blocks = await storage.getTimeBlocksByStaffAndDate(String(staffId), String(date));
  res.json(blocks);
});

router.post("/api/time-blocks", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const data = insertTimeBlockSchema.parse(req.body);
    if (staff.role !== "admin" && data.staffId !== staff.staffDataId) {
      return res.status(403).json({ error: "Not authorized" });
    }
    const block = await storage.createTimeBlock(data);
    log("TIME_BLOCK_CREATED", `${staff.name} blocked ${data.date} ${data.startTime}-${data.endTime} for staff ${data.staffId}`);
    res.status(201).json(block);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Invalid data" });
  }
});

router.delete("/api/time-blocks/:id", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const id = parseInt(req.params.id);
  const block = await storage.getTimeBlockById(id);
  if (!block) {
    return res.status(404).json({ error: "Time block not found" });
  }
  if (staff.role !== "admin" && block.staffId !== staff.staffDataId) {
    log("AUTH_DENIED", `${staff.name} tried to delete time block ${id} owned by ${block.staffId}`);
    return res.status(403).json({ error: "Not authorized" });
  }

  await storage.deleteTimeBlock(id);
  log("TIME_BLOCK_DELETED", `${staff.name} removed time block ${id}`);
  res.json({ ok: true });
});

router.get("/api/webhooks", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) return res.status(401).json({ error: "Not authenticated" });
  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) return res.status(401).json({ error: "Not authenticated" });

  if (staff.role === "admin") {
    const all = await storage.getAllWebhooks();
    return res.json(all);
  }
  const own = await storage.getWebhooksByStaffId(staff.staffDataId);
  res.json(own);
});

router.post("/api/webhooks", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) return res.status(401).json({ error: "Not authenticated" });
  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) return res.status(401).json({ error: "Not authenticated" });

  if (staff.role !== "admin") {
    return res.status(403).json({ error: "Only admin can manage webhooks" });
  }

  try {
    const { staffId, url, events, enabled } = req.body;
    if (!staffId || !url || !events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: "staffId, url, and events[] are required" });
    }
    const webhook = await storage.createWebhook({ staffId, url, events, enabled: enabled ?? 1 });
    log("WEBHOOK_CREATED", `${staff.name} created webhook id=${webhook.id} for staff=${staffId} url=${url}`);
    res.status(201).json(webhook);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Invalid data" });
  }
});

router.patch("/api/webhooks/:id", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) return res.status(401).json({ error: "Not authenticated" });
  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) return res.status(401).json({ error: "Not authenticated" });
  if (staff.role !== "admin") return res.status(403).json({ error: "Only admin can manage webhooks" });

  const id = parseInt(req.params.id);
  const { url, events, enabled, staffId } = req.body;
  const data: any = {};
  if (url !== undefined) data.url = url;
  if (events !== undefined) data.events = events;
  if (enabled !== undefined) data.enabled = enabled;
  if (staffId !== undefined) data.staffId = staffId;

  const webhook = await storage.updateWebhook(id, data);
  if (!webhook) return res.status(404).json({ error: "Webhook not found" });
  log("WEBHOOK_UPDATED", `${staff.name} updated webhook ${id}`);
  res.json(webhook);
});

router.delete("/api/webhooks/:id", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) return res.status(401).json({ error: "Not authenticated" });
  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) return res.status(401).json({ error: "Not authenticated" });
  if (staff.role !== "admin") return res.status(403).json({ error: "Only admin can manage webhooks" });

  const id = parseInt(req.params.id);
  await storage.deleteWebhook(id);
  log("WEBHOOK_DELETED", `${staff.name} deleted webhook ${id}`);
  res.json({ ok: true });
});

router.post("/api/webhooks/test", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) return res.status(401).json({ error: "Not authenticated" });
  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) return res.status(401).json({ error: "Not authenticated" });
  if (staff.role !== "admin") return res.status(403).json({ error: "Only admin can manage webhooks" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

  const { buildPayload } = await import("./webhooks");
  const testBooking = {
    id: 0,
    clientName: "Test Client",
    clientPhone: "(555) 123-4567",
    clientEmail: "test@example.com",
    serviceId: "s1",
    staffId: staff.staffDataId,
    date: new Date().toISOString().slice(0, 10),
    time: "10:00 AM",
    status: "pending",
    notes: "This is a test webhook",
    createdAt: new Date(),
  };

  const payload = buildPayload("booking.created", testBooking as any);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    log("WEBHOOK_TEST", `${staff.name} tested webhook → ${url} (status ${r.status})`);
    res.json({ ok: true, status: r.status, payload });
  } catch (err: any) {
    log("WEBHOOK_TEST_FAIL", `${staff.name} tested webhook → ${url} error="${err.message}"`);
    res.json({ ok: false, error: err.message, payload });
  }
});

router.post("/api/teamup-webhook", async (req: Request, res: Response) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] TEAMUP_WEBHOOK_RECEIVED: ${JSON.stringify(req.body).slice(0, 500)}`);

  try {
    await handleTeamupWebhook(req.body);
    res.json({ ok: true });
  } catch (err: any) {
    console.log(`[${ts}] TEAMUP_WEBHOOK_ERROR: ${err.message}`);
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
