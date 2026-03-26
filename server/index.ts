import express from "express";
import session from "express-session";
import path from "path";
import routes from "./routes";
import { seedStaffAccounts } from "./seed";
import { registerTeamupWebhook, syncExistingBookingsToTeamup } from "./teamup";

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

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  const distPath = path.resolve(process.cwd(), "dist/public");
  app.use(express.static(distPath));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const PORT = parseInt(process.env.PORT || process.env.API_PORT || "3001");

async function start() {
  await seedStaffAccounts();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);

    if (isProd && process.env.REPLIT_DOMAINS) {
      const domain = process.env.REPLIT_DOMAINS.split(",")[0];
      const appUrl = `https://${domain}`;
      registerTeamupWebhook(appUrl).catch(console.error);
    }
    syncExistingBookingsToTeamup().catch(console.error);
  });
}

start().catch(console.error);
