import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <>
      <h1 className="font-bold text-2xl mb-4">
        Orion Dashboard. Logged In= {data.claims.email}
      </h1>

      <h2 className="font-bold text-2xl mb-4">Your user details</h2>
      <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
        {JSON.stringify(data.claims, null, 2)}
      </pre>
    </>
  );
}

export default async function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <Suspense fallback={<p>Loading user details...</p>}>
          <UserDetails />
        </Suspense>
      </div>
           <div>
        
        {/*Testing- navigation to new page */}
        <Button asChild>
          <a href="/protected/page2">next (testing navigation button)</a>
        </Button>
      </div>
    </div>
  );
}
