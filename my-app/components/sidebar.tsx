"use client";

import { FileText, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/protected", label: "Dashboard", icon: LayoutDashboard },
  { href: "/protected/fileUpload", label: "All Applications", icon: FileText },
  { href: "/admin", label: "Form Builder", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="orion-sidebar">
      <nav className="nav flex-column orion-nav" aria-label="Dashboard">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/protected" && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              className={`nav-link d-flex align-items-center gap-3 ${active ? "active" : ""}`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
