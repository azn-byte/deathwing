"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CONNECTIONS } from "@/lib/connections";

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
    tagline: "You're just here to poke at what's there.",
  },
];

const emptyConnections = () =>
  Object.fromEntries(CONNECTIONS.map((c) => [c.key, ""]));

export default function EnterClient() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [handle, setHandle] = useState("");
  const [path, setPath] = useState(null);
  const [connections, setConnections] = useState(emptyConnections);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) setStatus("signed-out");
        return;
      }

      setUser(user);
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      if (existingProfile) {
        setProfile(existingProfile);
        setStatus("ready");
      } else {
        setStatus("needs-profile");
      }
    }

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => load());

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithDiscord = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        scopes: "guilds.join",
        redirectTo: `${window.location.origin}/auth/callback?next=/enter`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setStatus("signed-out");
  };

  const canSubmit = handle.trim().length > 0 && path;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || !user) return;
    const trimmedConnections = Object.fromEntries(
      Object.entries(connections).map(([k, v]) => [k, v.trim()])
    );
    const { data, error } = await supabase
      .from("profiles")
      .insert({ id: user.id, handle: handle.trim(), path, connections: trimmedConnections })
      .select()
      .single();

    if (!error) {
      setProfile(data);
      setStatus("ready");
      router.push("/");
    }
  };

  if (status === "loading") return null;

  if (status === "signed-out") {
    return (
      <section className="mx-auto max-w-lg px-6 py-24 text-center sm:px-10">
        <p className="font-mono text-sm text-white/40">
          TERMINAL 01 <span className="animate-pulse">_</span>
        </p>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">
          Sign in to enter the lab.
        </h1>
        <p className="mt-2 text-white/50">
          A real account now, not just this browser — your profile follows
          you to any device you sign in from.
        </p>
        <button
          onClick={signInWithDiscord}
          className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
        >
          Sign in with Discord
        </button>
      </section>
    );
  }

  if (status === "ready" && profile) {
    const pathLabel = PATHS.find((p) => p.id === profile.path)?.label ?? profile.path;
    const filledConnections = CONNECTIONS.filter((c) => profile.connections?.[c.key]);

    return (
      <section className="mx-auto max-w-lg px-6 py-24 text-center sm:px-10">
        <p className="font-mono text-sm text-white/40">
          TERMINAL 01 <span className="animate-pulse">_</span>
        </p>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">
          Welcome back, {profile.handle}.
        </h1>
        <p className="mt-2 text-white/50">Logged in as the {pathLabel}.</p>
        <p className="mt-1 font-mono text-xs text-white/30">
          ID {profile.id.slice(0, 8).toUpperCase()}
        </p>

        <div className="mt-8 text-left">
          <p className="font-mono text-xs uppercase tracking-widest text-white/40">
            Connections
          </p>
          {filledConnections.length === 0 ? (
            <p className="mt-2 text-sm text-white/40">None added yet.</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {filledConnections.map((c) => (
                <li key={c.key} className="flex justify-between border-b border-white/10 py-2 text-sm">
                  <span className="text-white/50">{c.label}</span>
                  <span>{profile.connections[c.key]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={signOut}
          className="mt-8 rounded-full border border-white/20 px-6 py-3 text-sm font-medium hover:border-white/40"
        >
          Sign out
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
        Signed in with Discord as {user?.user_metadata?.full_name || user?.email}.
        One more step.
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

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-white/40">
            03 — Connections (optional)
          </label>
          <p className="mt-2 text-xs text-white/40">
            Self-reported, not verified. Leave anything blank.
          </p>
          <div className="mt-3 space-y-4">
            {CONNECTIONS.map((c) => (
              <div key={c.key}>
                <label className="text-xs text-white/50">{c.label}</label>
                <input
                  value={connections[c.key]}
                  onChange={(e) =>
                    setConnections((prev) => ({ ...prev, [c.key]: e.target.value }))
                  }
                  placeholder={c.placeholder}
                  className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-mono text-sm outline-none focus:border-white"
                />
              </div>
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
