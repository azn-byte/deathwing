"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import { CONNECTIONS } from "@/lib/connections";

const PATH_LABELS = {
  collector: "Collector",
  creator: "Creator",
  wanderer: "Wanderer",
};

export default function ProfileCard() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    setSession(getSession());
  }, []);

  if (session === undefined) return null;

  if (!session) {
    return (
      <div className="mb-12 rounded-sm border border-white/10 p-6">
        <p className="text-sm text-white/50">
          No profile yet — create one to show up here as you move through
          the site.
        </p>
        <Link
          href="/enter"
          className="mt-3 inline-block text-sm text-white/70 underline underline-offset-4 hover:text-white"
        >
          Create your profile →
        </Link>
      </div>
    );
  }

  const pathLabel = PATH_LABELS[session.path] ?? session.path;
  const filledConnections = CONNECTIONS.filter((c) => session.connections?.[c.key]);

  return (
    <div className="mb-12 rounded-sm border border-white/10 p-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/40">
            Tracked as
          </p>
          <h2 className="mt-1 text-xl font-medium tracking-tight">
            {session.handle} <span className="text-white/40">· {pathLabel}</span>
          </h2>
        </div>
        {session.id && (
          <span className="font-mono text-xs text-white/30">ID {session.id}</span>
        )}
      </div>

      {filledConnections.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {filledConnections.map((c) => (
            <li key={c.key} className="text-white/50">
              {c.label}: <span className="text-white">{session.connections[c.key]}</span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/enter"
        className="mt-4 inline-block text-sm text-white/70 underline underline-offset-4 hover:text-white"
      >
        Edit profile →
      </Link>
    </div>
  );
}
