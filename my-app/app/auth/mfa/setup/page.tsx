"use client";

import EnrollMFA from "@/components/auth/EnrollMFA";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Page() {
  const router = useRouter();

  const onEnrolled = useCallback(() => {
    router.push("/protected");
    router.refresh();
  }, [router]);

  const onCancelled = async () => {
    await createClient().auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <EnrollMFA onEnrolled={onEnrolled} onCancelled={onCancelled} />
    </div>
  );
}