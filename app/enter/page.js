"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, saveSession } from "@/lib/session";

const PATHS = [
  {
    id: "collector",
    label: "Collector",
    tagline: "You come for the curated finds.",
  },
  {
    id: "creator",
    label: "Creator",
    tagline: "You make things, and you're here to see what's possible.",
  },
  {
    id: "wanderer",
    label: "Wanderer",
    tagline: "You're just here to poke at the experiments.",
  },
];

export default function EnterPage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [path, setPath] = useState(null);
  const [existing, setExisting] = useState(undefined);

  useEffect(() => {
    setExisting(getSession());
  }, []);

  const canSubmit = handle.trim().length > 0 && path;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    saveSession({ handle: handle.trim(), path, startedAt: new Date().toISOString() });
    router.push("/");
  };

  if (existing === undefined) return null;

  if (existing) {
    const pathLabel = PATHS.find((p) => p.id === existing.path)?.label ?? existing.path;
    return (
      <section className="mx-auto max-w-lg px-6 py-24 text-center sm:px-10">
        <p className="font-mono text-sm text-white/40">
          TERMINAL 01 <span className="animate-pulse">_</span>
        </p>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">
          Welcome back, {existing.handle}.
        </h1>
        <p className="mt-2 text-white/50">Logged in as the {pathLabel}.</p>
        <button
          onClick={() => setExisting(null)}
          className="mt-8 rounded-full border border-white/20 px-6 py-3 text-sm font-medium hover:border-white/40"
        >
          Start a new session
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-6 py-20 sm:px-10">
      <p className="font-mono text-sm text-white/40">
        TERMINAL 01 <span className="animate-pulse">_</span>
      </p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight">
        Create your visitor profile.
      </h1>
      <p className="mt-2 text-white/50">
        No account needed yet — this just remembers you on this device.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-white/40">
            01 — Choose your handle
          </label>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="e.g. night-owl"
            maxLength={24}
            className="mt-3 w-full border-b border-white/20 bg-transparent py-2 font-mono text-lg outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-white/40">
            02 — Pick your path
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {PATHS.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setPath(p.id)}
                className={`rounded-sm border p-4 text-left transition ${
                  path === p.id
                    ? "border-white bg-white/5"
                    : "border-white/15 hover:border-white/30"
                }`}
              >
                <span className="font-medium">{p.label}</span>
                <p className="mt-1 text-xs text-white/40">{p.tagline}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-full bg-white py-3 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
        >
          Enter the lab
        </button>
      </form>
    </section>
  );
}
