import bcrypt from "bcryptjs";
import { storage } from "./storage";

const staffData = [
  { name: "Laima", email: "laima@lapassion.com", password: "laima123", role: "admin", staffDataId: "st1" },
  { name: "Kasia", email: "kasia@lapassion.com", password: "kasia123", role: "stylist", staffDataId: "st2" },
  { name: "Kamila Janik", email: "kamila.j@lapassion.com", password: "kamila123", role: "stylist", staffDataId: "st3" },
  { name: "Karolina", email: "karolina@lapassion.com", password: "karolina123", role: "stylist", staffDataId: "st4" },
  { name: "Veronika Dadek", email: "veronika@lapassion.com", password: "veronika123", role: "stylist", staffDataId: "st5" },
  { name: "Zofia", email: "zofia@lapassion.com", password: "zofia123", role: "stylist", staffDataId: "st6" },
  { name: "Kamila G.", email: "kamila.g@lapassion.com", password: "kamilag123", role: "stylist", staffDataId: "st7" },
  { name: "Birute Francis", email: "birute@lapassion.com", password: "birute123", role: "stylist", staffDataId: "st8" },
];

const seedBookings = [
  { clientName: "Sofija Brundel", clientPhone: "44133413", clientEmail: "sofija@gmail.com", serviceId: "s3", staffId: "st4", date: "2026-03-20", time: "12:00 PM", status: "completed", notes: "VIP client, always on time" },
  { clientName: "Dzordana Test", clientPhone: "41233413", clientEmail: "dzordana@gmail.com", serviceId: "s1", staffId: "st4", date: "2026-03-18", time: "12:00 PM", status: "completed", notes: "Good lady, short nails" },
  { clientName: "Jelena Schwartz", clientPhone: "444112345", clientEmail: "jelena@gmail.com", serviceId: "s1", staffId: "st2", date: "2026-03-25", time: "12:00 PM", status: "confirmed", notes: "Short hair-cut only the ends" },
  { clientName: "Anna Kowalski", clientPhone: "6305551001", clientEmail: "anna.k@gmail.com", serviceId: "s1", staffId: "st1", date: "2026-03-19", time: "10:00 AM", status: "pending", notes: null },
  { clientName: "Maria Nowak", clientPhone: "6305551002", clientEmail: "maria.n@gmail.com", serviceId: "s3", staffId: "st1", date: "2026-03-25", time: "2:00 PM", status: "pending", notes: null },
  { clientName: "Ewa Jankowska", clientPhone: "6305551003", clientEmail: "ewa.j@gmail.com", serviceId: "s1", staffId: "st2", date: "2026-03-25", time: "11:00 AM", status: "pending", notes: null },
  { clientName: "Patrycja Mazur", clientPhone: "6305551004", clientEmail: "patrycja.m@gmail.com", serviceId: "s7", staffId: "st2", date: "2026-03-27", time: "10:00 AM", status: "pending", notes: null },
  { clientName: "Dorota Lewandowska", clientPhone: "6305551005", clientEmail: "dorota.l@gmail.com", serviceId: "s8", staffId: "st3", date: "2026-03-18", time: "1:00 PM", status: "pending", notes: null },
  { clientName: "Agnieszka Wójcik", clientPhone: "6305551006", clientEmail: "agnieszka.w@gmail.com", serviceId: "s1", staffId: "st3", date: "2026-03-24", time: "11:00 AM", status: "pending", notes: null },
  { clientName: "Renata Sikora", clientPhone: "6305551007", clientEmail: "renata.s@gmail.com", serviceId: "s6", staffId: "st4", date: "2026-03-19", time: "10:30 AM", status: "pending", notes: null },
  { clientName: "Beata Pawlak", clientPhone: "6305551008", clientEmail: "beata.p@gmail.com", serviceId: "s1", staffId: "st4", date: "2026-03-24", time: "11:00 AM", status: "pending", notes: null },
  { clientName: "Jolanta Krawczyk", clientPhone: "6305551009", clientEmail: "jolanta.k@gmail.com", serviceId: "s8", staffId: "st5", date: "2026-03-20", time: "10:00 AM", status: "pending", notes: null },
  { clientName: "Monika Grabowska", clientPhone: "6305551010", clientEmail: "monika.g@gmail.com", serviceId: "s1", staffId: "st5", date: "2026-03-25", time: "11:00 AM", status: "pending", notes: null },
  { clientName: "Katarzyna Dudek", clientPhone: "6305551011", clientEmail: "katarzyna.d@gmail.com", serviceId: "s1", staffId: "st6", date: "2026-03-18", time: "12:00 PM", status: "pending", notes: null },
  { clientName: "Izabela Stępień", clientPhone: "6305551012", clientEmail: "izabela.s@gmail.com", serviceId: "s7", staffId: "st6", date: "2026-03-21", time: "10:00 AM", status: "pending", notes: null },
  { clientName: "Teresa Michalska", clientPhone: "6305551013", clientEmail: "teresa.m@gmail.com", serviceId: "s6", staffId: "st7", date: "2026-03-19", time: "1:30 PM", status: "pending", notes: null },
  { clientName: "Sylwia Adamczyk", clientPhone: "6305551014", clientEmail: "sylwia.a@gmail.com", serviceId: "s1", staffId: "st7", date: "2026-03-24", time: "2:00 PM", status: "pending", notes: null },
  { clientName: "Natalia Zawadzka", clientPhone: "6305551015", clientEmail: "natalia.z@gmail.com", serviceId: "s3", staffId: "st1", date: "2026-03-25", time: "11:00 AM", status: "pending", notes: null },
  { clientName: "Justyna Pietrzak", clientPhone: "6305551016", clientEmail: "justyna.p@gmail.com", serviceId: "s1", staffId: "st1", date: "2026-03-24", time: "3:30 PM", status: "pending", notes: null },
  { clientName: "Simas", clientPhone: "1231231241", clientEmail: "simas@cdlagency.com", serviceId: "s3", staffId: "st3", date: "2026-03-31", time: "3:00 PM", status: "pending", notes: "123123" },
  { clientName: "Simas Test", clientPhone: "1231251351", clientEmail: "simas@gmail.com", serviceId: "s4", staffId: "st1", date: "2026-03-25", time: "12:00 PM", status: "pending", notes: "413341" },
  { clientName: "Simas Test", clientPhone: "14135135135", clientEmail: "test@gmail.com", serviceId: "s4", staffId: "st1", date: "2026-03-26", time: "12:00 PM", status: "pending", notes: "Test" },
  { clientName: "Simas Test", clientPhone: "41341341", clientEmail: "simas@test.com", serviceId: "s5", staffId: "st2", date: "2026-03-25", time: "1:00 PM", status: "completed", notes: "Test message" },
  { clientName: "Simas Test", clientPhone: "12341341", clientEmail: "kamila@gmail.com", serviceId: "s5", staffId: "st3", date: "2026-03-25", time: "12:00 PM", status: "pending", notes: "Test" },
  { clientName: "Simas Test", clientPhone: "412124134", clientEmail: "karolina@gmail.com", serviceId: "s6", staffId: "st4", date: "2026-03-26", time: "12:00 PM", status: "pending", notes: "Message" },
  { clientName: "Simas Test", clientPhone: "141351351", clientEmail: "veronika@gmail.com", serviceId: "s5", staffId: "st5", date: "2026-03-25", time: "12:00 PM", status: "pending", notes: "test message" },
  { clientName: "Simas Test", clientPhone: "1231513513", clientEmail: "zofia@gmail.com", serviceId: "s4", staffId: "st6", date: "2026-03-25", time: "12:00 PM", status: "pending", notes: "Test message" },
  { clientName: "Simas Test", clientPhone: "414134134", clientEmail: "kamilag@gmail.com", serviceId: "s6", staffId: "st7", date: "2026-03-28", time: "11:00 AM", status: "pending", notes: null },
  { clientName: "Simas", clientPhone: "4134134134", clientEmail: "simas@test.com", serviceId: "s5", staffId: "st1", date: "2026-03-26", time: "10:00 AM", status: "pending", notes: "Only the ends" },
];

export async function seedStaffAccounts() {
  for (const s of staffData) {
    const existing = await storage.getStaffByEmail(s.email);
    if (!existing) {
      const passwordHash = await bcrypt.hash(s.password, 10);
      await storage.createStaff({
        name: s.name,
        email: s.email,
        passwordHash,
        role: s.role,
        staffDataId: s.staffDataId,
      });
      console.log(`Created staff account: ${s.name} (${s.email})`);
    } else {
      console.log(`Staff account already exists: ${s.name}`);
    }
  }

  const existingBookings = await storage.getAllBookings();
  if (existingBookings.length === 0) {
    console.log("Seeding bookings...");
    for (const b of seedBookings) {
      await storage.createBooking({
        clientName: b.clientName,
        clientPhone: b.clientPhone,
        clientEmail: b.clientEmail,
        serviceId: b.serviceId,
        staffId: b.staffId,
        date: b.date,
        time: b.time,
        status: b.status,
        notes: b.notes,
      });
    }
    console.log(`Seeded ${seedBookings.length} bookings`);
  } else {
    console.log(`Bookings already exist (${existingBookings.length}), skipping seed`);
  }
}
