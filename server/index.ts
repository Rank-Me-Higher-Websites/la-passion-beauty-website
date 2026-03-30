import express from "express";
import session from "express-session";
import path from "path";
import routes from "./routes";
import { seedStaffAccounts, resetAllPasswords } from "./seed";
import { startTeamupPolling, syncExistingBookingsToTeamup } from "./teamup";

const app = express();
const isProd = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT || (isProd ? "5000" : "3001"));

app.use(express.json({ limit: "1mb" }));

if (isProd) {
  app.set("trust proxy", 1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "la-passion-secret-key-2026",
    name: "lp.sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 8 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
    },
  })
);

app.get("/health", (_req, res) => res.status(200).send("ok"));

if (isProd) {
  const distPath = path.resolve(process.cwd(), "dist/public");
  app.use(express.static(distPath));
}

app.use(routes);

if (isProd) {
  const distPath = path.resolve(process.cwd(), "dist/public");
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} (isProd: ${isProd})`);
});

seedStaffAccounts()
  .then(() => resetAllPasswords())
  .then(() => {
    setTimeout(() => {
      syncExistingBookingsToTeamup().catch(console.error);
      startTeamupPolling();
    }, 10000);
  })
  .catch(console.error);
