import { db } from "./db";
import { staffAccounts, bookings } from "../shared/schema";
import type { StaffAccount, InsertStaffAccount, Booking, InsertBooking } from "../shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getStaffByEmail(email: string): Promise<StaffAccount | undefined>;
  getStaffById(id: number): Promise<StaffAccount | undefined>;
  getAllStaff(): Promise<StaffAccount[]>;
  createStaff(staff: InsertStaffAccount): Promise<StaffAccount>;

  getAllBookings(): Promise<Booking[]>;
  getBookingsByStaffId(staffId: string): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getStaffByEmail(email: string): Promise<StaffAccount | undefined> {
    const [staff] = await db.select().from(staffAccounts).where(eq(staffAccounts.email, email));
    return staff;
  }

  async getStaffById(id: number): Promise<StaffAccount | undefined> {
    const [staff] = await db.select().from(staffAccounts).where(eq(staffAccounts.id, id));
    return staff;
  }

  async getAllStaff(): Promise<StaffAccount[]> {
    return db.select().from(staffAccounts);
  }

  async createStaff(staff: InsertStaffAccount): Promise<StaffAccount> {
    const [created] = await db.insert(staffAccounts).values(staff).returning();
    return created;
  }

  async getAllBookings(): Promise<Booking[]> {
    return db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBookingsByStaffId(staffId: string): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.staffId, staffId)).orderBy(desc(bookings.createdAt));
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [created] = await db.insert(bookings).values(booking).returning();
    return created;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [updated] = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
    return updated;
  }

  async updateBookingNotes(id: number, notes: string | null): Promise<Booking | undefined> {
    const [updated] = await db.update(bookings).set({ notes }).where(eq(bookings.id, id)).returning();
    return updated;
  }

  async deleteBooking(id: number): Promise<void> {
    await db.delete(bookings).where(eq(bookings.id, id));
  }

  async getBookingsByStaffAndDate(staffId: string, date: string): Promise<Booking[]> {
    return db.select().from(bookings)
      .where(and(eq(bookings.staffId, staffId), eq(bookings.date, date)));
  }

  async updateStaffPassword(id: number, passwordHash: string): Promise<void> {
    await db.update(staffAccounts).set({ passwordHash }).where(eq(staffAccounts.id, id));
  }
}

export const storage = new DatabaseStorage();
