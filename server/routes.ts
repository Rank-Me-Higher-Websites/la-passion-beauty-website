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

    const booking = await storage.createBooking(data);
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
