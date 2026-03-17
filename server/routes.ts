import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertBookingSchema } from "../shared/schema";

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

function log(action: string, details: string) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${action}: ${details}`);
}

router.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    log("LOGIN_FAIL", `Missing credentials from ${req.ip}`);
    return res.status(400).json({ error: "Email and password required" });
  }

  const staff = await storage.getStaffByEmail(email);
  if (!staff) {
    log("LOGIN_FAIL", `Unknown email "${email}" from ${req.ip}`);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, staff.passwordHash);
  if (!valid) {
    log("LOGIN_FAIL", `Wrong password for "${email}" from ${req.ip}`);
    return res.status(401).json({ error: "Invalid credentials" });
  }

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
  const booked = existing
    .filter((b) => b.status !== "cancelled")
    .map((b) => ({ time: b.time, serviceId: b.serviceId }));

  log("AVAILABILITY_CHECK", `staffId=${staffId} date=${date} → ${booked.length} booked slots, ip=${req.ip}`);
  res.json({ booked });
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
  res.json(bookingsList);
});

router.post("/api/bookings", async (req: Request, res: Response) => {
  try {
    const data = insertBookingSchema.parse(req.body);

    data.status = "pending";

    const existing = await storage.getBookingsByStaffAndDate(data.staffId, data.date);
    const activeBookings = existing.filter((b) => b.status !== "cancelled");
    const conflict = activeBookings.find((b) => b.time === data.time);
    if (conflict) {
      log("BOOKING_CONFLICT", `Double-booking blocked: staff=${data.staffId} date=${data.date} time=${data.time} client="${data.clientName}" ip=${req.ip}`);
      return res.status(409).json({ error: "This time slot is already booked. Please choose a different time." });
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
  const { status } = req.body;
  if (!status) {
    log("BOOKING_UPDATE_FAIL", `${staff.name} PATCH booking ${id} missing status`);
    return res.status(400).json({ error: "Status required" });
  }

  const existing = await storage.getBookingById(id);
  if (!existing) {
    log("BOOKING_UPDATE_FAIL", `${staff.name} PATCH booking ${id} not found`);
    return res.status(404).json({ error: "Booking not found" });
  }

  if (staff.role !== "admin" && existing.staffId !== staff.staffDataId) {
    log("AUTH_DENIED", `${staff.name} tried to update booking ${id} owned by staff ${existing.staffId}`);
    return res.status(403).json({ error: "Not authorized" });
  }

  const booking = await storage.updateBookingStatus(id, status);
  log("BOOKING_STATUS", `${staff.name} changed booking ${id} ("${existing.clientName}") status: ${existing.status} → ${status}`);
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

  await storage.deleteBooking(id);
  log("BOOKING_DELETED", `${staff.name} deleted booking ${id} ("${existing.clientName}" - ${existing.date} ${existing.time})`);
  res.json({ ok: true });
});

export default router;
