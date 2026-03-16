import express from "express";
import session from "express-session";
import { createServer } from "http";
import routes from "./routes";
import { seedStaffAccounts } from "./seed";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "la-passion-secret-key-2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(routes);

const PORT = parseInt(process.env.API_PORT || "3001");

async function start() {
  await seedStaffAccounts();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API server running on port ${PORT}`);
  });
}

start().catch(console.error);
