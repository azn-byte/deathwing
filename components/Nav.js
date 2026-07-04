"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/prints", label: "Prints" },
  { href: "/experiments", label: "Experiments" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          the lab
        </Link>
        <div className="flex gap-4 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "text-black dark:text-white"
                    : "text-neutral-500 hover:text-black dark:hover:text-white"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
