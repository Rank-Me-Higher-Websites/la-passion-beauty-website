import { type Booking } from "./booking-data";

const STORAGE_KEY = "lp_bookings";

export function getBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBookings(bookings: Booking[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function getUserBookings(userEmail: string): Booking[] {
  return getBookings().filter((b) => b.clientEmail === userEmail);
}

export function addBooking(booking: Booking): void {
  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);
}

export function updateBookingStatus(bookingId: string, status: Booking["status"]): void {
  const bookings = getBookings();
  const updated = bookings.map((b) =>
    b.id === bookingId ? { ...b, status } : b
  );
  saveBookings(updated);
}

export function deleteBooking(bookingId: string): void {
  const bookings = getBookings();
  saveBookings(bookings.filter((b) => b.id !== bookingId));
}

export function cancelBooking(bookingId: string): void {
  updateBookingStatus(bookingId, "cancelled");
}
