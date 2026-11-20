import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";
import { UniversityOfWinnipegLogo } from "@/components/university-of-winnipeg-logo";


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="orion-shell">
      <header className="orion-header">
        <Link href="/protected" className="orion-brand">
          <UniversityOfWinnipegLogo width={150} className="orion-logo" />
          <span>Orion Ethics Review System</span>
        </Link>
        <div className="orion-user-controls">
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
        </div>
      </header>

      <div className="orion-body">
        <Sidebar />
        <section className="orion-content">{children}</section>
      </div>
    </main>
  );
}
