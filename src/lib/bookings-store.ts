// localStorage-based bookings store - will be replaced with Replit API calls
import { type Booking } from "./booking-data";

const STORAGE_KEY = "lp_bookings";

export function getBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getUserBookings(userEmail: string): Booking[] {
  return getBookings().filter((b) => b.clientEmail === userEmail);
}

export function addBooking(booking: Booking): void {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function cancelBooking(bookingId: string): void {
  const bookings = getBookings();
  const updated = bookings.map((b) =>
    b.id === bookingId ? { ...b, status: "cancelled" as const } : b
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
