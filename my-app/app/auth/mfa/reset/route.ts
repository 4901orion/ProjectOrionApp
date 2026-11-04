import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse, type NextRequest } from "next/server";

// The emailed link must have been used in the last 10 minutes.
const MAX_AGE_SECONDS = 10 * 60;

// Lost authenticator: the user asked for a link on /auth/mfa, clicked it in
// their email, and /auth/callback signed them in and sent them here.
// Proving they own the email lets us remove their old 2FA factor so they
// can set up a new one.
export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  // Only allow this right after signing in from the emailed link, not with a password.
  const now = Math.floor(Date.now() / 1000);
  const fromEmailLink = (claims.amr ?? []).some(
    (entry) =>
      typeof entry !== "string" &&
      (entry.method === "otp" || entry.method === "magiclink") &&
      now - entry.timestamp < MAX_AGE_SECONDS,
  );
  if (!fromEmailLink) {
    return NextResponse.redirect(
      new URL("/auth/error?error=Reset%20link%20expired.%20Request%20a%20new%20one.", origin),
    );
  }

  const admin = createAdminClient();
  const { data: factors, error } = await admin.auth.admin.mfa.listFactors({
    userId: claims.sub,
  });
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/error?error=${encodeURIComponent(error.message)}`, origin),
    );
  }

  for (const factor of factors.factors) {
    await admin.auth.admin.mfa.deleteFactor({
      userId: claims.sub,
      id: factor.id,
    });
  }

  return NextResponse.redirect(new URL("/auth/mfa/setup", origin));
}