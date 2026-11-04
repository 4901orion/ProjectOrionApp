"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Asks a signed-in user (aal1) for the code from their authenticator app
// and upgrades the session to aal2.
export function MfaChallengeForm({
  next,
  className,
  ...props
}: { next: string } & React.ComponentPropsWithoutRef<"div">) {
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        setError(error.message);
        return;
      }
      const totp = data.totp[0];
      if (!totp) {
        // No authenticator app yet, so set one up first.
        router.replace("/auth/mfa/setup");
        return;
      }
      setFactorId(totp.id);
    })();
  }, [next, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
      });
      if (error) throw error;
        window.location.assign(next);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  // Lost authenticator: email a sign-in link. Clicking it proves they own the
  // email, and app/auth/mfa/reset/route.ts then removes the old factor.
  const handleLostDevice = async () => {
    const supabase = createClient();
    setError(null);

    const { data } = await supabase.auth.getUser();
    const email = data.user?.email;
    if (!email) {
      setError("This account has no email address.");
      return;
    }

    /*
      The sign-in link will redirect to /auth/callback, which will sign the user in
      and then redirect to /auth/mfa/reset, which will remove the old factor.
      The user will then be redirected to /auth/mfa/setup to set up a new factor.
    */
    setIsLoading(true);
    setResetSent(false);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/mfa/reset`,
      },
    });
    if (error) {
      setError(error.message);
      return;
    }
    setResetSent(true);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Two-factor authentication</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !factorId}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSignOut}
              >
                Sign out
              </Button>

              {resetSent ? (
                <p className="text-sm text-muted-foreground">
                  Check your email for a sign-in link to reset your authenticator. <b>Open it in this browser.</b>
                </p>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full underline underline-offset-4"
                  onClick={handleLostDevice}
                >
                  Lost your authenticator?
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
