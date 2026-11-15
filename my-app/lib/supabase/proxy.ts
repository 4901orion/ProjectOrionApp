import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip proxy check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
  
  // 2FA code start 
  //---------------------
  // 2FA is mandatory. Reads the session cookie only, no network call.
  // - aal1 -> aal2: has an authenticator app but hasn't entered a code yet.
  // - next level aal1: no authenticator app set up yet.

  // user.all comes form verified login token(getClaims) and users who already passes 2FA aal2 can be trusted
  // for everyone else, must ask supabase auth server(getUser) wheather the user has passed 2FA or not. 
  // This is because the user can have multiple sessions and one of them may have passed 2FA while the other hasn't.
  if (
    user && 
    user.aal !== "aal2" &&
    !request.nextUrl.pathname.startsWith("/auth")) 
    {
    const { data: userData } = await supabase.auth.getUser();
    const verifiedUser = userData?.user;

    let mfaPath: string | null = null;

    if(!verifiedUser)
    {
      mfaPath = "/auth/login";
    }
    else if ( (verifiedUser.factors ?? []).some((factor) => factor.status === "verified"))
      {
      mfaPath = "/auth/mfa";
    } 
    else {
      mfaPath = "/auth/mfa/setup";
    }
    
    if (mfaPath) {
      const url = request.nextUrl.clone();
      url.pathname = mfaPath;
      url.search = `?next=${encodeURIComponent(
        request.nextUrl.pathname + request.nextUrl.search,
      )}`;
      const redirect = NextResponse.redirect(url);
      // Keep any refreshed session cookies (see the note below).
      supabaseResponse.cookies
        .getAll()
        .forEach((cookie) => redirect.cookies.set(cookie));
      return redirect;
    }
  }
  // 2FA code end
  //-----------------------

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
