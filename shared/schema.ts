import { pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const staffAccounts = pgTable("staff_accounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("stylist"),
  staffDataId: varchar("staff_data_id", { length: 20 }).notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientPhone: varchar("client_phone", { length: 30 }).notNull(),
  clientEmail: varchar("client_email", { length: 255 }).notNull(),
  serviceId: varchar("service_id", { length: 20 }).notNull(),
  staffId: varchar("staff_id", { length: 20 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  time: varchar("time", { length: 10 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const timeBlocks = pgTable("time_blocks", {
  id: serial("id").primaryKey(),
  staffId: varchar("staff_id", { length: 20 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  startTime: varchar("start_time", { length: 10 }).notNull(),
  endTime: varchar("end_time", { length: 10 }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  staffId: varchar("staff_id", { length: 20 }).notNull(),
  url: text("url").notNull(),
  events: text("events").array().notNull(),
  enabled: integer("enabled").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStaffAccountSchema = createInsertSchema(staffAccounts).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertTimeBlockSchema = createInsertSchema(timeBlocks).omit({ id: true, createdAt: true });
export const insertWebhookSchema = createInsertSchema(webhooks).omit({ id: true, createdAt: true });

export type StaffAccount = typeof staffAccounts.$inferSelect;
export type InsertStaffAccount = z.infer<typeof insertStaffAccountSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type TimeBlock = typeof timeBlocks.$inferSelect;
export type InsertTimeBlock = z.infer<typeof insertTimeBlockSchema>;
export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
