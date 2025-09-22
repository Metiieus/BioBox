import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || "";

if (!SUPABASE_URL) {
  console.warn(
    "SUPABASE_URL/VITE_SUPABASE_URL is not set. Admin operations will be disabled.",
  );
}
if (!SUPABASE_SERVICE_ROLE) {
  console.warn(
    "SUPABASE_SERVICE_ROLE is not set. Admin operations will be disabled.",
  );
}

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});
