import { createClient } from "@/lib/supabase/server";

// Who may open applicants' uploaded files.
//
// A Supabase user may download when they have passed 2FA (aal2) and their
// app_metadata.role is one of ALLOWED_ROLES. app_metadata can only be set by
// you (dashboard SQL or the service-role key), never by the user themselves.
//
// To make someone a reviewer, run this in Supabase → SQL Editor:
//   update auth.users
//   set raw_app_meta_data = raw_app_meta_data || '{"role":"reviewer"}'
//   where email = 'person@example.com';
// They need to log out and back in for it to take effect.

export const ALLOWED_ROLES = ["reviewer", "admin"];

export type DownloadCheck =
  | { ok: true; userId: string }
  | { ok: false; status: 401 | 403; reason: string };

export async function canDownloadFiles(): Promise<DownloadCheck> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims) {
    return { ok: false, status: 401, reason: "Please log in." };
  }
  if (claims.aal !== "aal2") {
    return { ok: false, status: 401, reason: "Please finish two-factor login." };
  }
  const role = (claims.app_metadata as { role?: string } | undefined)?.role;
  if (!role || !ALLOWED_ROLES.includes(role)) {
    return { ok: false, status: 403, reason: "You don't have access to applicant files." };
  }
  return { ok: true, userId: String(claims.sub) };
}
