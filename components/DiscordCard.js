"use client";

import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/useProfile";

const INVITE_URL = "https://discord.gg/xSQQCFHBcB";

export default function DiscordCard() {
  const { loading, profile } = useProfile();

  const signInWithDiscord = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        scopes: "guilds.join",
        redirectTo: `${window.location.origin}/auth/callback?next=/connect`,
      },
    });
  };

  if (loading) return null;

  return (
    <div className="mb-12 rounded-sm border border-white/10 p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-white/40">
        Discord
      </p>

      {profile ? (
        <>
          <h2 className="mt-1 text-xl font-medium tracking-tight">
            You should already be in.
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Signing in with Discord adds you to the server automatically.
            Not seeing yourself there? The auto-join can fail quietly (left
            since, a permissions hiccup) — use this invite instead.
          </p>
          <a
            href={INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-white/70 underline underline-offset-4 hover:text-white"
          >
            Use invite link →
          </a>
        </>
      ) : (
        <>
          <h2 className="mt-1 text-xl font-medium tracking-tight">
            Join the server.
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Sign in with Discord to create a profile and join the server in
            one step — or just use the invite link if you'd rather not sign
            in here at all.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={signInWithDiscord}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90"
            >
              Sign in with Discord
            </button>
            <a
              href={INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 underline underline-offset-4 hover:text-white"
            >
              Just use the invite link →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
