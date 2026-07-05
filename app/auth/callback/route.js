import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function joinDiscordGuild(session) {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  const accessToken = session?.provider_token;
  const discordUserId = session?.user?.identities?.find(
    (i) => i.provider === "discord"
  )?.id;

  if (!botToken || !guildId || !accessToken || !discordUserId) return;

  try {
    await fetch(`https://discord.com/api/guilds/${guildId}/members/${discordUserId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: accessToken }),
    });
  } catch {
    // Best-effort — don't block sign-in if this fails (already a member,
    // bot missing permissions, Discord API hiccup, etc.)
  }
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/connect";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await joinDiscordGuild(data.session);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/enter?error=auth`);
}
