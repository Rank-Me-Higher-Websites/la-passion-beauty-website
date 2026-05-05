// Shared booking data - will be replaced with API calls to Replit backend later

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number; // minutes
  price: string;
}

export interface DaySchedule {
  day: number; // 0=Sun,1=Mon,...6=Sat
  startHour: number;
  endHour: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  services: string[]; // service category IDs
  schedule: DaySchedule[]; // days they work with hours
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
}

export const services: Service[] = [
  { id: "s1", name: "Haircut", category: "hair", duration: 60, price: "$45+" },
  { id: "s2", name: "Root Touch-Up", category: "coloring", duration: 120, price: "$85+" },
  { id: "s3", name: "Full Color", category: "coloring", duration: 120, price: "$110+" },
  { id: "s4", name: "Full Color + Cut", category: "coloring", duration: 180, price: "$140+" },
  { id: "s5", name: "Partial Highlights", category: "coloring", duration: 150, price: "$120+" },
  { id: "s6", name: "Full Highlights", category: "coloring", duration: 240, price: "$160+" },
  { id: "s7", name: "Highlights + Cut + Toner", category: "coloring", duration: 300, price: "$190+" },
  { id: "s8", name: "Extensions", category: "extensions", duration: 300, price: "Quote" },
  { id: "s9", name: "SPMU Brows", category: "spmu", duration: 120, price: "$400+" },
  { id: "s10", name: "SPMU Eyeliner", category: "spmu", duration: 120, price: "$350+" },
  { id: "s11", name: "SPMU Lips / Lip Blushing", category: "spmu", duration: 120, price: "$450+" },
  { id: "s12", name: "BrowXenna Powder", category: "spmu", duration: 60, price: "$40" },
];

export const staffMembers: StaffMember[] = [
  {
    id: "st1",
    name: "Laima",
    role: "Stylist",
    avatar: "L",
    services: ["hair", "coloring"],
    schedule: [
      { day: 2, startHour: 10, endHour: 17 }, // Tue
      { day: 3, startHour: 10, endHour: 17 }, // Wed
      { day: 4, startHour: 10, endHour: 17 }, // Thu
    ],
  },
  {
    id: "st2",
    name: "Kasia",
    role: "Stylist",
    avatar: "K",
    services: ["hair", "coloring"],
    schedule: [
      { day: 2, startHour: 10, endHour: 17 }, // Tue
      { day: 3, startHour: 10, endHour: 17 }, // Wed
      { day: 5, startHour: 10, endHour: 17 }, // Fri
      { day: 6, startHour: 9, endHour: 14 },  // Sat
    ],
  },
  {
    id: "st3",
    name: "Kamila Janik",
    role: "Stylist",
    avatar: "KJ",
    services: ["hair", "coloring", "extensions"],
    schedule: [
      { day: 2, startHour: 10, endHour: 17 }, // Tue
      { day: 3, startHour: 10, endHour: 17 }, // Wed
      { day: 4, startHour: 10, endHour: 17 }, // Thu
      { day: 5, startHour: 10, endHour: 16 }, // Fri
      { day: 6, startHour: 9, endHour: 14 },  // Sat
    ],
  },
  {
    id: "st4",
    name: "Karolina",
    role: "Stylist",
    avatar: "K",
    services: ["hair", "coloring"],
    schedule: [
      { day: 2, startHour: 10, endHour: 13 }, // Tue
      { day: 3, startHour: 10, endHour: 17 }, // Wed
      { day: 4, startHour: 10, endHour: 17 }, // Thu
      { day: 5, startHour: 10, endHour: 13 }, // Fri
      { day: 6, startHour: 9, endHour: 13 },  // Sat
    ],
  },
  {
    id: "st5",
    name: "Veronika",
    role: "Stylist",
    avatar: "V",
    services: ["hair", "coloring", "extensions"],
    schedule: [
      { day: 2, startHour: 10, endHour: 13 }, // Tue
      { day: 3, startHour: 10, endHour: 13 }, // Wed
      { day: 4, startHour: 10, endHour: 13 }, // Thu
      { day: 5, startHour: 10, endHour: 17 }, // Fri
      { day: 6, startHour: 9, endHour: 14 },  // Sat
    ],
  },
  {
    id: "st6",
    name: "Zofia",
    role: "Stylist",
    avatar: "Z",
    services: ["hair", "coloring"],
    schedule: [
      { day: 2, startHour: 10, endHour: 14 }, // Tue
      { day: 3, startHour: 10, endHour: 14 }, // Wed
      { day: 4, startHour: 10, endHour: 14 }, // Thu
      { day: 5, startHour: 10, endHour: 14 }, // Fri
      { day: 6, startHour: 9, endHour: 14 },  // Sat
    ],
  },
  {
    id: "st7",
    name: "Kamila G.",
    role: "Stylist",
    avatar: "KG",
    services: ["hair", "coloring"],
    schedule: [
      { day: 2, startHour: 10, endHour: 18 }, // Tue
      { day: 3, startHour: 10, endHour: 18 }, // Wed
      { day: 4, startHour: 10, endHour: 18 }, // Thu
      { day: 5, startHour: 10, endHour: 18 }, // Fri
      { day: 6, startHour: 10, endHour: 18 }, // Sat
    ],
  },
  {
    id: "st8",
    name: "Birute Francis",
    role: "SPMU Artist",
    avatar: "BF",
    services: ["spmu"],
    schedule: [
      { day: 2, startHour: 10, endHour: 17 }, // Tue
      { day: 3, startHour: 10, endHour: 17 }, // Wed
      { day: 4, startHour: 10, endHour: 17 }, // Thu
      { day: 5, startHour: 10, endHour: 17 }, // Fri
      { day: 6, startHour: 10, endHour: 17 }, // Sat
    ],
  },
];

export const serviceCategories = [
  { id: "hair", label: "Hair Services" },
  { id: "coloring", label: "Hair Coloring" },
  { id: "extensions", label: "Extensions" },
  { id: "spmu", label: "Semi-Permanent Makeup" },
];

export function generateTimeSlots(date: Date): TimeSlot[] {
  const day = date.getDay();
  if (day === 0) return [];
  
  const slots: TimeSlot[] = [];
  const start = 9;
  const end = day === 6 ? 17 : 19;
  
  for (let hour = start; hour < end; hour++) {
    for (const min of [0, 30]) {
      const h = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      const time = `${h}:${min === 0 ? "00" : "30"} ${ampm}`;
      slots.push({ time, available: Math.random() > 0.3 });
    }
  }
  return slots;
}

/** Get 1-hour time slots for a specific staff member on a given date */
export function getStaffTimeSlots(staff: StaffMember, date: Date): string[] {
  const day = date.getDay();
  const daySchedule = staff.schedule.find((s) => s.day === day);
  if (!daySchedule) return [];

  const slots: string[] = [];
  for (let hour = daySchedule.startHour; hour < daySchedule.endHour; hour++) {
    const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const ampm = hour >= 12 ? "PM" : "AM";
    slots.push(`${h}:00 ${ampm}`);
  }
  return slots;
}

/** Check if a staff member works on a given date */
export function staffWorksOnDate(staff: StaffMember, date: Date): boolean {
  return staff.schedule.some((s) => s.day === date.getDay());
}

// Mock bookings for admin panel
export const mockBookings: Booking[] = [
  {
    id: "b1",
    clientName: "Jessica Smith",
    clientPhone: "(312) 555-0101",
    clientEmail: "jessica@email.com",
    serviceId: "s6",
    staffId: "st1",
    date: "2026-02-16",
    time: "10:00 AM",
    status: "confirmed",
    createdAt: "2026-02-14T10:00:00Z",
  },
  {
    id: "b2",
    clientName: "Amanda Johnson",
    clientPhone: "(312) 555-0102",
    clientEmail: "amanda@email.com",
    serviceId: "s1",
    staffId: "st1",
    date: "2026-02-16",
    time: "1:00 PM",
    status: "pending",
    createdAt: "2026-02-15T14:00:00Z",
  },
  {
    id: "b3",
    clientName: "Rachel Lee",
    clientPhone: "(312) 555-0103",
    clientEmail: "rachel@email.com",
    serviceId: "s5",
    staffId: "st3",
    date: "2026-02-17",
    time: "11:00 AM",
    status: "confirmed",
    createdAt: "2026-02-13T09:00:00Z",
  },
  {
    id: "b4",
    clientName: "Emily Davis",
    clientPhone: "(312) 555-0104",
    clientEmail: "emily@email.com",
    serviceId: "s3",
    staffId: "st2",
    date: "2026-02-17",
    time: "2:00 PM",
    status: "pending",
    createdAt: "2026-02-15T16:00:00Z",
  },
  {
    id: "b5",
    clientName: "Sarah Wilson",
    clientPhone: "(312) 555-0105",
    clientEmail: "sarah@email.com",
    serviceId: "s7",
    staffId: "st2",
    date: "2026-02-18",
    time: "10:30 AM",
    status: "confirmed",
    createdAt: "2026-02-14T11:00:00Z",
  },
];
