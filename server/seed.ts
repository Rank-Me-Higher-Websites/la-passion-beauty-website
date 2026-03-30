import bcrypt from "bcryptjs";
import { storage } from "./storage";

const BCRYPT_ROUNDS = 12;

const staffData = [
  { name: "Laima", email: "laima@lapassion.com", password: "%@KwHmLazdZMBE", role: "admin", staffDataId: "st1" },
  { name: "Kasia", email: "kasia@lapassion.com", password: "RjrYGCCrSfZ44S", role: "stylist", staffDataId: "st2" },
  { name: "Kamila Janik", email: "kamila.j@lapassion.com", password: "NGj9qCUh#KA*Wy", role: "stylist", staffDataId: "st3" },
  { name: "Karolina", email: "karolina@lapassion.com", password: "bBK&k*Xw6ZaKYk", role: "stylist", staffDataId: "st4" },
  { name: "Veronika Dadek", email: "veronika@lapassion.com", password: "Kh2Ng#c$hu%CM7", role: "stylist", staffDataId: "st5" },
  { name: "Zofia", email: "zofia@lapassion.com", password: "n6BBdq&aytZCpa", role: "stylist", staffDataId: "st6" },
  { name: "Kamila G.", email: "kamila.g@lapassion.com", password: "t$qYf9Q7gq&Qe*", role: "stylist", staffDataId: "st7" },
  { name: "Birute Francis", email: "birute@lapassion.com", password: "sq7!cHrYm$zzeE", role: "stylist", staffDataId: "st8" },
];

const webhookData = [
  { staffId: "st1", url: "https://cdlagency.app.n8n.cloud/webhook/6c52daf8-6159-46a9-b907-0bafee6c6344" },
  { staffId: "st2", url: "https://cdlagency.app.n8n.cloud/webhook/64271b68-19ac-441d-ac97-f2f5d5d4ef0c" },
  { staffId: "st3", url: "https://cdlagency.app.n8n.cloud/webhook/c5d3a771-5e24-4e3a-9286-8c7e8917aba7" },
  { staffId: "st4", url: "https://cdlagency.app.n8n.cloud/webhook/1f00c278-6026-4094-8d1b-78a8aec47fc0" },
  { staffId: "st5", url: "https://cdlagency.app.n8n.cloud/webhook/86b22402-0853-4362-9b52-3ae63e65c9b9" },
  { staffId: "st6", url: "https://cdlagency.app.n8n.cloud/webhook/492cd4a0-64a1-4195-8b83-2eb9c938adb7" },
  { staffId: "st7", url: "https://cdlagency.app.n8n.cloud/webhook/a0d61c3f-9d9d-4ba8-b72b-e195feeca0cf" },
];

export async function seedStaffAccounts() {
  for (const s of staffData) {
    const existing = await storage.getStaffByEmail(s.email);
    if (!existing) {
      const passwordHash = await bcrypt.hash(s.password, BCRYPT_ROUNDS);
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

  const existingWebhooks = await storage.getAllWebhooks();
  if (existingWebhooks.length === 0) {
    console.log("Seeding webhooks...");
    for (const w of webhookData) {
      await storage.createWebhook({
        staffId: w.staffId,
        url: w.url,
        events: ["booking.created"],
        enabled: 1,
      });
    }
    console.log(`Seeded ${webhookData.length} webhooks`);
  } else {
    console.log(`Webhooks already exist (${existingWebhooks.length}), skipping seed`);
  }
}

export async function resetAllPasswords() {
  console.log("Resetting all staff passwords...");
  for (const s of staffData) {
    const existing = await storage.getStaffByEmail(s.email);
    if (existing) {
      const passwordHash = await bcrypt.hash(s.password, BCRYPT_ROUNDS);
      await storage.updateStaffPassword(existing.id, passwordHash);
      console.log(`Password reset: ${s.name}`);
    }
  }
  console.log("All passwords reset successfully");
}
