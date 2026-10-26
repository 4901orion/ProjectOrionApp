import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-dvh min-h-screen flex flex-col items-center overflow-y-auto">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-between border-b border-b-foreground/10">
          <div className="w-full max-w-1xl flex justify-between items-center p-3 px-10 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Orion - Protected Page</Link>
            </div>
            <div className="flex items-center gap-2">
              <DeployButton />
              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
            </div>
          </div>
        </nav>
        <div className="min-h-0 flex-1 flex w-full flex-col gap-2">
          {children}
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-2">
          <p>
            Project Orion
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
