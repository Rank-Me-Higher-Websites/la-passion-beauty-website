# La Passion Beauty Salon

## Overview
A React/Vite frontend with Express/PostgreSQL backend for La Passion Beauty Salon in Lemont, IL.

## Tech Stack
- **Frontend**: React 18 + TypeScript, Vite 5, Tailwind CSS, shadcn/ui, React Router v6, Framer Motion, TanStack Query
- **Backend**: Express.js, PostgreSQL, Drizzle ORM, bcryptjs, express-session
- **Build Tool**: Vite 5 (frontend) + tsx (backend)

## Project Structure
- `src/pages/` - Page components (Home, Booking, Services, Pricing, Contact, Admin, Login, etc.)
- `src/components/` - Reusable UI components and layout components
- `src/lib/` - Utilities, booking data, and local bookings store (legacy fallback)
- `src/contexts/` - React contexts (AuthContext for client users)
- `src/hooks/` - Custom hooks
- `src/assets/` - Images and static assets
- `server/` - Express backend (index.ts, routes.ts, storage.ts, db.ts, seed.ts)
- `shared/` - Shared schema (schema.ts with Drizzle ORM tables)
- `drizzle.config.ts` - Drizzle Kit config for DB migrations

## Database
- PostgreSQL with Drizzle ORM
- Tables: `staff_accounts` (id, name, email, password_hash, role, staff_data_id), `bookings` (id, client info, service/staff/date/time, status, notes, created_at)
- Schema push: `npx drizzle-kit push --force`

## Authentication
- Staff login via `/api/auth/login` with bcrypt password hashing + express-session
- Laima = admin role (sees all bookings/calendars)
- Other 7 stylists = stylist role (see only their own bookings)
- Client auth still handled client-side via AuthContext (legacy)

## Staff Accounts (seeded on startup)
| Name | Email | Password | Role | Staff ID |
|------|-------|----------|------|----------|
| Laima | laima@lapassion.com | laima123 | admin | st1 |
| Kasia | kasia@lapassion.com | kasia123 | stylist | st2 |
| Kamila Janik | kamila.j@lapassion.com | kamila123 | stylist | st3 |
| Karolina | karolina@lapassion.com | karolina123 | stylist | st4 |
| Veronika Dadek | veronika@lapassion.com | veronika123 | stylist | st5 |
| Zofia | zofia@lapassion.com | zofia123 | stylist | st6 |
| Kamila G. | kamila.g@lapassion.com | kamilag123 | stylist | st7 |
| Birute Francis | birute@lapassion.com | birute123 | stylist | st8 |

## API Routes
- `POST /api/auth/login` - Staff login
- `POST /api/auth/logout` - Staff logout
- `GET /api/auth/me` - Get current staff user
- `GET /api/bookings` - Get bookings (filtered by role, auth required)
- `POST /api/bookings` - Create booking (public for client booking form, forces status=pending)
- `PATCH /api/bookings/:id` - Update booking status (auth + IDOR protection)
- `PATCH /api/bookings/:id/notes` - Update booking notes (auth + IDOR protection)
- `DELETE /api/bookings/:id` - Delete booking (auth + IDOR protection)
- `PATCH /api/auth/change-password` - Change password (self: requires current password; admin: can reset any stylist)
- `GET /api/staff` - Get staff list (admin only, no password hashes returned)

## Server Logging
All API actions are logged with timestamps, including:
- Login attempts (success/failure with email and IP)
- Logout events
- Auth checks (session validation)
- Booking reads (who fetched, count)
- Booking creates (by whom, client name, service, date)
- Booking status changes (old → new status)
- Booking notes updates
- Booking deletions (client name, date, time)
- Auth denials (unauthenticated access, IDOR attempts)

## Running the App
- `npm run dev` starts both the Express API (port 3001) and Vite dev server (port 5000)
- Vite proxies `/api/*` requests to the Express server
- Frontend accessible on port 5000

## Key Notes
- Booking page has NO header/footer — just "Back to Home" link (intentional for future embeddable widget)
- Only Kamila Janik (st3) and Veronika Dadek (st5) do extensions; Kamila G. does NOT
- Laima is "Senior Stylist"; all others are "Stylist"
- Booking creation tries API first, falls back to localStorage if API unavailable
