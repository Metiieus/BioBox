import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Conditionally enable admin route only when Supabase env vars are present
  const hasSupabaseAdmin =
    Boolean(process.env.SUPABASE_SERVICE_ROLE) &&
    Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);

  if (hasSupabaseAdmin) {
    // Lazy import to avoid initializing Supabase client when not configured
    import("./routes/admin")
      .then(({ createUserAdmin }) => {
        app.post("/api/admin/create-user", createUserAdmin);
      })
      .catch((err) => {
        console.warn(
          "Admin routes disabled due to import error:",
          (err as Error)?.message,
        );
      });
  } else {
    console.warn(
      "Admin routes disabled: missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE.",
    );
  }

  return app;
}
