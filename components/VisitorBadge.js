"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProfile } from "@/lib/useProfile";

const PATH_LABELS = {
  collector: "Collector",
  creator: "Creator",
  wanderer: "Wanderer",
};

export default function VisitorBadge() {
  const pathname = usePathname();
  const { profile } = useProfile();

  if (!profile) return null;

  const pathLabel = PATH_LABELS[profile.path] ?? profile.path;
  const isHome = pathname === "/";

  return (
    <Link
      href="/connect"
      className={`fixed right-6 z-50 rounded-full border border-white/15 bg-black/80 px-4 py-2 font-mono text-xs text-white/60 backdrop-blur transition hover:border-white/30 hover:text-white ${
        isHome ? "bottom-14" : "bottom-6"
      }`}
    >
      {profile.handle} · {pathLabel}
      <span className="text-white/30"> · {profile.id.slice(0, 8).toUpperCase()}</span>
    </Link>
  );
}
