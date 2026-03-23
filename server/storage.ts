import { db } from "./db";
import { staffAccounts, bookings, timeBlocks, webhooks } from "../shared/schema";
import type { StaffAccount, InsertStaffAccount, Booking, InsertBooking, TimeBlock, InsertTimeBlock, Webhook, InsertWebhook } from "../shared/schema";
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
  updateBooking(id: number, data: Partial<InsertBooking>): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<void>;

  getTimeBlocksByStaffAndDate(staffId: string, date: string): Promise<TimeBlock[]>;
  getTimeBlocksByStaffId(staffId: string): Promise<TimeBlock[]>;
  getTimeBlockById(id: number): Promise<TimeBlock | undefined>;
  getAllTimeBlocks(): Promise<TimeBlock[]>;
  createTimeBlock(block: InsertTimeBlock): Promise<TimeBlock>;
  deleteTimeBlock(id: number): Promise<void>;

  getWebhooksByStaffId(staffId: string): Promise<Webhook[]>;
  getAllWebhooks(): Promise<Webhook[]>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  updateWebhook(id: number, data: Partial<InsertWebhook>): Promise<Webhook | undefined>;
  deleteWebhook(id: number): Promise<void>;
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

  async updateBooking(id: number, data: Partial<InsertBooking>): Promise<Booking | undefined> {
    const [updated] = await db.update(bookings).set(data).where(eq(bookings.id, id)).returning();
    return updated;
  }

  async getBookingsByStaffAndDate(staffId: string, date: string): Promise<Booking[]> {
    return db.select().from(bookings)
      .where(and(eq(bookings.staffId, staffId), eq(bookings.date, date)));
  }

  async updateStaffPassword(id: number, passwordHash: string): Promise<void> {
    await db.update(staffAccounts).set({ passwordHash }).where(eq(staffAccounts.id, id));
  }

  async getTimeBlocksByStaffAndDate(staffId: string, date: string): Promise<TimeBlock[]> {
    return db.select().from(timeBlocks)
      .where(and(eq(timeBlocks.staffId, staffId), eq(timeBlocks.date, date)));
  }

  async getTimeBlockById(id: number): Promise<TimeBlock | undefined> {
    const [block] = await db.select().from(timeBlocks).where(eq(timeBlocks.id, id));
    return block;
  }

  async getTimeBlocksByStaffId(staffId: string): Promise<TimeBlock[]> {
    return db.select().from(timeBlocks).where(eq(timeBlocks.staffId, staffId)).orderBy(desc(timeBlocks.createdAt));
  }

  async getAllTimeBlocks(): Promise<TimeBlock[]> {
    return db.select().from(timeBlocks).orderBy(desc(timeBlocks.createdAt));
  }

  async createTimeBlock(block: InsertTimeBlock): Promise<TimeBlock> {
    const [created] = await db.insert(timeBlocks).values(block).returning();
    return created;
  }

  async deleteTimeBlock(id: number): Promise<void> {
    await db.delete(timeBlocks).where(eq(timeBlocks.id, id));
  }

  async getWebhooksByStaffId(staffId: string): Promise<Webhook[]> {
    return db.select().from(webhooks).where(eq(webhooks.staffId, staffId)).orderBy(desc(webhooks.createdAt));
  }

  async getAllWebhooks(): Promise<Webhook[]> {
    return db.select().from(webhooks).orderBy(desc(webhooks.createdAt));
  }

  async createWebhook(webhook: InsertWebhook): Promise<Webhook> {
    const [created] = await db.insert(webhooks).values(webhook).returning();
    return created;
  }

  async updateWebhook(id: number, data: Partial<InsertWebhook>): Promise<Webhook | undefined> {
    const [updated] = await db.update(webhooks).set(data).where(eq(webhooks.id, id)).returning();
    return updated;
  }

  async deleteWebhook(id: number): Promise<void> {
    await db.delete(webhooks).where(eq(webhooks.id, id));
  }
}

export const storage = new DatabaseStorage();
