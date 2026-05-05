import { db } from "./db";
import { webhooks, type Webhook, type Booking } from "../shared/schema";
import { eq, and } from "drizzle-orm";

const SERVICE_MAP: Record<string, { name: string; duration: number; price: string }> = {
  s1: { name: "Haircut", duration: 60, price: "$45+" },
  s2: { name: "Root Touch-Up", duration: 120, price: "$85+" },
  s3: { name: "Full Color", duration: 120, price: "$110+" },
  s4: { name: "Full Color + Cut", duration: 180, price: "$140+" },
  s5: { name: "Partial Highlights", duration: 150, price: "$120+" },
  s6: { name: "Full Highlights", duration: 240, price: "$160+" },
  s7: { name: "Highlights + Cut + Toner", duration: 300, price: "$190+" },
  s8: { name: "Extensions", duration: 300, price: "Quote" },
};

const STAFF_MAP: Record<string, string> = {
  st1: "Laima",
  st2: "Kasia",
  st3: "Kamila Janik",
  st4: "Karolina",
  st5: "Veronika",
  st6: "Zofia",
  st7: "Kamila G.",
  st8: "Birute Francis",
};

export type WebhookEvent = "booking.created";

interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  booking: {
    id: number;
    client_name: string;
    client_phone: string;
    client_email: string;
    service_id: string;
    service_name: string;
    service_duration_minutes: number;
    service_price: string;
    staff_id: string;
    staff_name: string;
    date: string;
    time: string;
    status: string;
    notes: string | null;
    created_at: string;
  };
  changes?: Record<string, { from: string; to: string }>;
}

function buildPayload(event: WebhookEvent, booking: Booking, changes?: Record<string, { from: string; to: string }>): WebhookPayload {
  const service = SERVICE_MAP[booking.serviceId] || { name: booking.serviceId, duration: 0, price: "—" };
  const staffName = STAFF_MAP[booking.staffId] || booking.staffId;

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    booking: {
      id: booking.id,
      client_name: booking.clientName,
      client_phone: booking.clientPhone,
      client_email: booking.clientEmail,
      service_id: booking.serviceId,
      service_name: service.name,
      service_duration_minutes: service.duration,
      service_price: service.price,
      staff_id: booking.staffId,
      staff_name: staffName,
      date: booking.date,
      time: booking.time,
      status: booking.status,
      notes: booking.notes,
      created_at: booking.createdAt.toISOString(),
    },
  };

  if (changes) payload.changes = changes;
  return payload;
}

async function getMatchingWebhooks(staffId: string, event: WebhookEvent): Promise<Webhook[]> {
  const allWebhooks = await db.select().from(webhooks)
    .where(eq(webhooks.enabled, 1));

  return allWebhooks.filter((w) =>
    (w.staffId === staffId || w.staffId === "all") &&
    w.events.includes(event)
  );
}

async function fireWebhooks(staffId: string, event: WebhookEvent, booking: Booking, changes?: Record<string, { from: string; to: string }>) {
  const matching = await getMatchingWebhooks(staffId, event);
  if (matching.length === 0) return;

  const payload = buildPayload(event, booking, changes);
  const ts = new Date().toISOString();

  for (const wh of matching) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(wh.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      console.log(`[${ts}] WEBHOOK_SENT: ${event} → ${wh.url} (status ${res.status}) for booking ${booking.id}`);
    } catch (err: any) {
      console.log(`[${ts}] WEBHOOK_FAIL: ${event} → ${wh.url} error="${err.message}" for booking ${booking.id}`);
    }
  }
}

export { fireWebhooks, buildPayload, type WebhookPayload };
