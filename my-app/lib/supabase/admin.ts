import { createClient } from "@supabase/supabase-js";

/**
 * Admin client with the service-role key. 
 * It bypasses RLS and can change any user, so only use it in server code (route handlers, server actions) and
 * never import it from a "use client" file.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}