import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims, null, 2);
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      
      <div className="flex justify-center gap-2 items-start">
        
        {/*Testing- navigation to new page */}
        <Button asChild className="gap-19">
          <a href="/protected/form">Submission Form</a>
        </Button>

        <Button asChild className="mx-4">
          <a href="/protected/page3Nav">nav test Page</a>
        </Button>

        <Button asChild className="mx-4">
          <a href="/apply/[formId]">nextlyForm</a>
        </Button>

        <Button asChild className="mx-4">
          <a href="/admin" target="_blank">
            admin
          </a>
        </Button>
      </div>
    </div>
  );
}
