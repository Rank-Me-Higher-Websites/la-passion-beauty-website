import { db } from "./db";
import { bookings, timeBlocks } from "../shared/schema";
import { eq, and } from "drizzle-orm";

const TEAMUP_API_KEY = process.env.TEAMUP_API_KEY || "";
const CALENDAR_KEY = "ks20db078d08133796";
const BASE_URL = `https://api.teamup.com/${CALENDAR_KEY}`;

const STAFF_TO_SUBCALENDAR: Record<string, number> = {
  st1: 2608423,
  st2: 1845588,
  st3: 4505234,
  st4: 1845589,
  st5: 1773714,
  st6: 12458481,
  st7: 1773715,
  st8: 14609252,
};

const SUBCALENDAR_TO_STAFF: Record<number, string> = {};
for (const [staffId, subCalId] of Object.entries(STAFF_TO_SUBCALENDAR)) {
  SUBCALENDAR_TO_STAFF[subCalId] = staffId;
}

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

const SERVICE_NAME_TO_ID: Record<string, string> = {};
for (const [id, svc] of Object.entries(SERVICE_MAP)) {
  SERVICE_NAME_TO_ID[svc.name.toLowerCase()] = id;
}

let skipWebhookFor = new Set<string>();

function log(action: string, details: string) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] TEAMUP_${action}: ${details}`);
}

function headers() {
  return {
    "Teamup-Token": TEAMUP_API_KEY,
    "Content-Type": "application/json",
  };
}

function timeTo24(t: string): { hours: number; minutes: number } {
  const [time, period] = t.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (!m) m = 0;
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return { hours: h, minutes: m };
}

function toISO(date: string, time: string): string {
  const { hours, minutes } = timeTo24(time);
  return `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

function addMinutes(iso: string, mins: number): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + mins);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

function from24ToDisplay(hours: number, minutes: number): string {
  const period = hours >= 12 ? "PM" : "AM";
  let h = hours % 12;
  if (h === 0) h = 12;
  return `${h}:${String(minutes).padStart(2, "0")} ${period}`;
}

export async function pushBookingToTeamup(booking: {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  status: string;
  notes: string | null;
  teamupEventId?: string | null;
}) {
  if (!TEAMUP_API_KEY) {
    log("SKIP", "No API key configured");
    return;
  }

  const subCalId = STAFF_TO_SUBCALENDAR[booking.staffId];
  if (!subCalId) {
    log("SKIP", `No subcalendar for staff ${booking.staffId}`);
    return;
  }

  const service = SERVICE_MAP[booking.serviceId] || { name: booking.serviceId, duration: 60, price: "—" };
  const startDt = toISO(booking.date, booking.time);
  const endDt = addMinutes(startDt, service.duration);

  const body = {
    subcalendar_id: subCalId,
    title: `${booking.clientName} — ${service.name}`,
    start_dt: startDt,
    end_dt: endDt,
    notes: `Phone: ${booking.clientPhone}\nEmail: ${booking.clientEmail}\nPrice: ${service.price}${booking.notes ? `\nNotes: ${booking.notes}` : ""}`,
  };

  try {
    if (booking.teamupEventId) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`${BASE_URL}/events/${booking.teamupEventId}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();

      skipWebhookFor.add(booking.teamupEventId);
      setTimeout(() => skipWebhookFor.delete(booking.teamupEventId!), 30000);

      log("UPDATED", `Event ${booking.teamupEventId} updated (status ${res.status}) for booking ${booking.id}`);
    } else {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`${BASE_URL}/events`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();

      if (data.event?.id) {
        const eventId = String(data.event.id);
        await db.update(bookings).set({ teamupEventId: eventId }).where(eq(bookings.id, booking.id));

        skipWebhookFor.add(eventId);
        setTimeout(() => skipWebhookFor.delete(eventId), 30000);

        log("CREATED", `Event ${eventId} created for booking ${booking.id}`);
      } else {
        log("ERROR", `Unexpected response creating event: ${JSON.stringify(data)}`);
      }
    }
  } catch (err: any) {
    log("ERROR", `Failed to push booking ${booking.id}: ${err.message}`);
  }
}

export async function deleteTeamupEvent(teamupEventId: string) {
  if (!TEAMUP_API_KEY || !teamupEventId) return;

  try {
    skipWebhookFor.add(teamupEventId);
    setTimeout(() => skipWebhookFor.delete(teamupEventId), 30000);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    await fetch(`${BASE_URL}/events/${teamupEventId}`, {
      method: "DELETE",
      headers: headers(),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    log("DELETED", `Event ${teamupEventId} deleted from Teamup`);
  } catch (err: any) {
    log("ERROR", `Failed to delete event ${teamupEventId}: ${err.message}`);
  }
}

export async function cancelTeamupEvent(booking: {
  id: number;
  clientName: string;
  serviceId: string;
  teamupEventId?: string | null;
}) {
  if (!TEAMUP_API_KEY || !booking.teamupEventId) return;

  try {
    const service = SERVICE_MAP[booking.serviceId] || { name: booking.serviceId };

    skipWebhookFor.add(booking.teamupEventId);
    setTimeout(() => skipWebhookFor.delete(booking.teamupEventId!), 30000);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    await fetch(`${BASE_URL}/events/${booking.teamupEventId}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({
        title: `[CANCELLED] ${booking.clientName} — ${service.name}`,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    log("CANCELLED", `Event ${booking.teamupEventId} marked cancelled for booking ${booking.id}`);
  } catch (err: any) {
    log("ERROR", `Failed to cancel event ${booking.teamupEventId}: ${err.message}`);
  }
}

function parseTeamupTitle(title: string): { clientName: string; serviceName: string } {
  const parts = title.replace("[CANCELLED] ", "").split(" — ");
  return {
    clientName: (parts[0] || "Unknown").trim(),
    serviceName: (parts[1] || "").trim(),
  };
}

function parseTeamupNotes(notes: string | null): { phone: string; email: string; price: string; extraNotes: string } {
  const result = { phone: "", email: "", price: "", extraNotes: "" };
  if (!notes) return result;

  for (const line of notes.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("Phone:")) result.phone = trimmed.replace("Phone:", "").trim();
    else if (trimmed.startsWith("Email:")) result.email = trimmed.replace("Email:", "").trim();
    else if (trimmed.startsWith("Price:")) result.price = trimmed.replace("Price:", "").trim();
    else if (trimmed.startsWith("Notes:")) result.extraNotes = trimmed.replace("Notes:", "").trim();
  }
  return result;
}

function isoToDate(iso: string): string {
  return iso.slice(0, 10);
}

function isoToTime(iso: string): string {
  const timePart = iso.slice(11, 16);
  const [h, m] = timePart.split(":").map(Number);
  return from24ToDisplay(h, m);
}

export function shouldSkipWebhook(eventId: string): boolean {
  return skipWebhookFor.has(eventId);
}

export async function handleTeamupWebhook(payload: any) {
  if (!payload || !payload.event) {
    log("WEBHOOK_SKIP", "No event in payload");
    return;
  }

  const triggerEvent = payload.trigger_event || payload.event_type || "";
  const event = payload.event;
  const eventId = String(event.id);

  if (shouldSkipWebhook(eventId)) {
    log("WEBHOOK_SKIP", `Skipping event ${eventId} (originated from our push)`);
    return;
  }

  const subCalIds: number[] = Array.isArray(event.subcalendar_ids)
    ? event.subcalendar_ids
    : event.subcalendar_id
    ? [event.subcalendar_id]
    : [];

  const staffId = subCalIds.map((id) => SUBCALENDAR_TO_STAFF[id]).find(Boolean) || "";

  if (triggerEvent === "event.deleted" || triggerEvent === "event_deleted") {
    const [existing] = await db.select().from(bookings).where(eq(bookings.teamupEventId, eventId));
    if (existing) {
      await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, existing.id));
      log("WEBHOOK_DELETE", `Booking ${existing.id} cancelled from Teamup event ${eventId}`);
    } else {
      log("WEBHOOK_DELETE", `No matching booking for Teamup event ${eventId}`);
    }
    return;
  }

  const { clientName, serviceName } = parseTeamupTitle(event.title || "");
  const { phone, email, extraNotes } = parseTeamupNotes(event.notes || null);
  const serviceId = SERVICE_NAME_TO_ID[serviceName.toLowerCase()] || "s1";
  const date = event.start_dt ? isoToDate(event.start_dt) : "";
  const time = event.start_dt ? isoToTime(event.start_dt) : "";

  if (!date || !time || !staffId) {
    log("WEBHOOK_SKIP", `Missing data: date=${date} time=${time} staffId=${staffId}`);
    return;
  }

  if (triggerEvent === "event.created" || triggerEvent === "event_created") {
    const [existing] = await db.select().from(bookings).where(eq(bookings.teamupEventId, eventId));
    if (existing) {
      log("WEBHOOK_SKIP", `Booking already exists for Teamup event ${eventId}`);
      return;
    }

    const [created] = await db.insert(bookings).values({
      clientName,
      clientPhone: phone || "N/A",
      clientEmail: email || "N/A",
      serviceId,
      staffId,
      date,
      time,
      status: "confirmed",
      notes: extraNotes || null,
      teamupEventId: eventId,
    }).returning();

    log("WEBHOOK_CREATE", `Booking ${created.id} created from Teamup event ${eventId}`);
    return;
  }

  if (triggerEvent === "event.updated" || triggerEvent === "event_updated") {
    const [existing] = await db.select().from(bookings).where(eq(bookings.teamupEventId, eventId));
    if (existing) {
      await db.update(bookings).set({
        clientName,
        clientPhone: phone || existing.clientPhone,
        clientEmail: email || existing.clientEmail,
        serviceId,
        staffId,
        date,
        time,
        notes: extraNotes || existing.notes,
      }).where(eq(bookings.id, existing.id));
      log("WEBHOOK_UPDATE", `Booking ${existing.id} updated from Teamup event ${eventId}`);
    } else {
      const [created] = await db.insert(bookings).values({
        clientName,
        clientPhone: phone || "N/A",
        clientEmail: email || "N/A",
        serviceId,
        staffId,
        date,
        time,
        status: "confirmed",
        notes: extraNotes || null,
        teamupEventId: eventId,
      }).returning();
      log("WEBHOOK_UPDATE_NEW", `Booking ${created.id} created (update for unknown event ${eventId})`);
    }
    return;
  }

  log("WEBHOOK_UNKNOWN", `Unknown trigger: ${triggerEvent}`);
}

let lastPollTimestamp: string | null = null;
let pollInterval: ReturnType<typeof setInterval> | null = null;

const POLL_INTERVAL_MS = 30 * 1000;

async function pollTeamupChanges() {
  if (!TEAMUP_API_KEY) return;

  try {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 90);

    const params = new URLSearchParams({
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
    });

    if (lastPollTimestamp) {
      params.set("modifiedSince", lastPollTimestamp);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${BASE_URL}/events?${params.toString()}`, {
      headers: headers(),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      log("POLL_ERROR", `Teamup API returned status ${res.status}`);
      return;
    }

    const data = await res.json();
    const events = data.events || [];

    lastPollTimestamp = now.toISOString();

    if (events.length === 0) return;

    log("POLL", `Found ${events.length} events to check`);

    for (const event of events) {
      const eventId = String(event.id);

      if (skipWebhookFor.has(eventId)) {
        continue;
      }

      const subCalIds: number[] = Array.isArray(event.subcalendar_ids)
        ? event.subcalendar_ids
        : event.subcalendar_id
        ? [event.subcalendar_id]
        : [];

      const staffId = subCalIds.map((id: number) => SUBCALENDAR_TO_STAFF[id]).find(Boolean) || "";
      if (!staffId) continue;

      const title = (event.title || "").trim();
      const isOff = /^off$/i.test(title);
      const date = event.start_dt ? isoToDate(event.start_dt) : "";
      const startTime = event.start_dt ? isoToTime(event.start_dt) : "";
      const endTime = event.end_dt ? isoToTime(event.end_dt) : "";

      if (!date) continue;

      if (isOff) {
        if (event.delete_dt) {
          const existingBlocks = await db.select().from(timeBlocks)
            .where(and(
              eq(timeBlocks.staffId, staffId),
              eq(timeBlocks.date, date),
              eq(timeBlocks.reason, `teamup:${eventId}`)
            ));
          for (const block of existingBlocks) {
            await db.delete(timeBlocks).where(eq(timeBlocks.id, block.id));
            log("POLL_BLOCK_DELETE", `Time block ${block.id} removed (Teamup Off event ${eventId} deleted)`);
          }
          continue;
        }

        const [existingBlock] = await db.select().from(timeBlocks)
          .where(eq(timeBlocks.reason, `teamup:${eventId}`));

        if (existingBlock) {
          if (existingBlock.date !== date || existingBlock.startTime !== startTime || existingBlock.endTime !== endTime || existingBlock.staffId !== staffId) {
            await db.update(timeBlocks).set({
              staffId,
              date,
              startTime,
              endTime,
            }).where(eq(timeBlocks.id, existingBlock.id));
            log("POLL_BLOCK_UPDATE", `Time block ${existingBlock.id} updated from Teamup Off event ${eventId}`);
          }
        } else {
          const [created] = await db.insert(timeBlocks).values({
            staffId,
            date,
            startTime,
            endTime,
            reason: `teamup:${eventId}`,
          }).returning();
          log("POLL_BLOCK_CREATE", `Time block ${created.id} created from Teamup Off event ${eventId} (${staffId} ${date} ${startTime}-${endTime})`);
        }
        continue;
      }

      if (!startTime) continue;

      const { clientName, serviceName } = parseTeamupTitle(title);
      const { phone, email, extraNotes } = parseTeamupNotes(event.notes || null);
      const serviceId = SERVICE_NAME_TO_ID[serviceName.toLowerCase()] || "s1";

      if (event.delete_dt) {
        const [existing] = await db.select().from(bookings).where(eq(bookings.teamupEventId, eventId));
        if (existing && existing.status !== "cancelled") {
          await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, existing.id));
          log("POLL_DELETE", `Booking ${existing.id} cancelled (Teamup event ${eventId} deleted)`);
        }
        continue;
      }

      const [existing] = await db.select().from(bookings).where(eq(bookings.teamupEventId, eventId));

      if (existing) {
        const needsUpdate =
          existing.clientName !== clientName ||
          existing.date !== date ||
          existing.time !== startTime ||
          existing.serviceId !== serviceId ||
          existing.staffId !== staffId;

        if (needsUpdate) {
          await db.update(bookings).set({
            clientName,
            clientPhone: phone || existing.clientPhone,
            clientEmail: email || existing.clientEmail,
            serviceId,
            staffId,
            date,
            time: startTime,
            notes: extraNotes || existing.notes,
          }).where(eq(bookings.id, existing.id));
          log("POLL_UPDATE", `Booking ${existing.id} updated from Teamup event ${eventId}`);
        }
      } else {
        const [created] = await db.insert(bookings).values({
          clientName,
          clientPhone: phone || "N/A",
          clientEmail: email || "N/A",
          serviceId,
          staffId,
          date,
          time: startTime,
          status: "confirmed",
          notes: extraNotes || null,
          teamupEventId: eventId,
        }).returning();
        log("POLL_CREATE", `Booking ${created.id} created from Teamup event ${eventId}`);
      }
    }
  } catch (err: any) {
    log("POLL_ERROR", `Polling failed: ${err.message}`);
  }
}

export function startTeamupPolling() {
  if (!TEAMUP_API_KEY) {
    log("SKIP", "No API key, skipping Teamup polling");
    return;
  }

  log("POLL_START", `Polling Teamup every ${POLL_INTERVAL_MS / 1000}s for changes`);

  setTimeout(() => {
    pollTeamupChanges().catch(console.error);
  }, 5000);

  pollInterval = setInterval(() => {
    pollTeamupChanges().catch(console.error);
  }, POLL_INTERVAL_MS);
}

export function stopTeamupPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

export async function syncExistingBookingsToTeamup() {
  if (!TEAMUP_API_KEY) return;

  const unsyncedBookings = await db.select().from(bookings)
    .where(eq(bookings.status, "pending"));

  const toSync = unsyncedBookings.filter(b => !b.teamupEventId);

  if (toSync.length === 0) {
    log("SYNC", "No unsynced bookings to push");
    return;
  }

  log("SYNC", `Pushing ${toSync.length} unsynced bookings to Teamup...`);
  for (const booking of toSync) {
    await pushBookingToTeamup(booking);
    await new Promise(r => setTimeout(r, 500));
  }
  log("SYNC", "Initial sync complete");
}
