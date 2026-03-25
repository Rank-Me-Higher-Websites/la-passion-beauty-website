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
}
