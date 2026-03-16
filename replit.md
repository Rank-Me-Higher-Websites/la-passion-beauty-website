# La Passion Beauty Salon

## Overview
A React/Vite frontend application for La Passion Beauty Salon in Lemont, IL. Built with React 18, TypeScript, Tailwind CSS, and shadcn/ui components.

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **State**: TanStack Query

## Project Structure
- `src/pages/` - Page components (Home, Booking, Services, Pricing, Contact, Admin, Login, etc.)
- `src/components/` - Reusable UI components and layout components
- `src/lib/` - Utilities, booking data, and local bookings store
- `src/contexts/` - React contexts (AuthContext)
- `src/hooks/` - Custom hooks
- `src/assets/` - Images and static assets

## Running the App
The dev server runs on port 5000 via `npm run dev`.

## Key Notes
- Migrated from Lovable to Replit — `lovable-tagger` plugin removed from vite.config.ts
- `vite.config.ts` configured with `host: "0.0.0.0"` and `allowedHosts: true` for Replit proxy compatibility
- Bookings are stored in-memory via `src/lib/bookings-store.ts` (no backend/database)
- Admin and user login is handled client-side via `src/contexts/AuthContext.tsx`
