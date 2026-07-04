"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/prints", label: "Prints" },
  { href: "/experiments", label: "Experiments" },
];

export default function Nav() {
  const pathname = usePathname();
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

  return (
    <header className="flex items-center justify-between px-6 py-8 sm:px-10 lg:px-14">
      <Link href="/" className="text-sm font-medium tracking-tight">
        the lab
      </Link>
      <nav className="flex items-center gap-8 text-sm">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? "text-white" : "text-white/50 hover:text-white"}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/enter"
          className={pathname === "/enter" ? "text-white" : "text-white/50 hover:text-white"}
        >
          {session ? session.handle : "Enter"}
        </Link>
      </nav>
    </header>
  );
}
