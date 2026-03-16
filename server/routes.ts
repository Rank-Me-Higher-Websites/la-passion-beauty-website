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

router.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const staff = await storage.getStaffByEmail(email);
  if (!staff) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, staff.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  (req.session as any).staffId = staff.id;
  res.json({
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    staffDataId: staff.staffDataId,
  });
});

router.post("/api/auth/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {});
  res.json({ ok: true });
});

router.get("/api/auth/me", async (req: Request, res: Response) => {
  const staffId = (req.session as any)?.staffId;
  if (!staffId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const staff = await storage.getStaffById(staffId);
  if (!staff) {
    return res.status(401).json({ error: "Not authenticated" });
  }
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
    return res.status(401).json({ error: "Not authenticated" });
  }
  const staff = await storage.getStaffById(staffId);
  if (!staff) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  let bookingsList;
  if (staff.role === "admin") {
    bookingsList = await storage.getAllBookings();
  } else {
    bookingsList = await storage.getBookingsByStaffId(staff.staffDataId);
  }
  res.json(bookingsList);
});

router.post("/api/bookings", async (req: Request, res: Response) => {
  try {
    const data = insertBookingSchema.parse(req.body);
    const booking = await storage.createBooking(data);
    res.status(201).json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Invalid booking data" });
  }
});

router.patch("/api/bookings/:id", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const id = parseInt(req.params.id);
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status required" });
  }

  const existing = await storage.getBookingById(id);
  if (!existing) {
    return res.status(404).json({ error: "Booking not found" });
  }

  if (staff.role !== "admin" && existing.staffId !== staff.staffDataId) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const booking = await storage.updateBookingStatus(id, status);
  res.json(booking);
});

router.patch("/api/bookings/:id/notes", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const id = parseInt(req.params.id);
  const { notes } = req.body;

  const existing = await storage.getBookingById(id);
  if (!existing) {
    return res.status(404).json({ error: "Booking not found" });
  }

  if (staff.role !== "admin" && existing.staffId !== staff.staffDataId) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const booking = await storage.updateBookingNotes(id, notes || null);
  res.json(booking);
});

router.delete("/api/bookings/:id", async (req: Request, res: Response) => {
  const sessionStaffId = (req.session as any)?.staffId;
  if (!sessionStaffId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const staff = await storage.getStaffById(sessionStaffId);
  if (!staff) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const id = parseInt(req.params.id);
  const existing = await storage.getBookingById(id);
  if (!existing) {
    return res.status(404).json({ error: "Booking not found" });
  }

  if (staff.role !== "admin" && existing.staffId !== staff.staffDataId) {
    return res.status(403).json({ error: "Not authorized" });
  }

  await storage.deleteBooking(id);
  res.json({ ok: true });
});

export default router;
