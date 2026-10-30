import { MfaChallengeForm } from "@/components/auth/mfa-challenge";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: requestedNext } = await searchParams;
  // Only allow same-site paths, like app/auth/callback/route.ts does.
  const next =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/protected";
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <MfaChallengeForm next={next} />
      </div>
    </div>
  );
}