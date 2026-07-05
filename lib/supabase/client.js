import { createBrowserClient } from "@supabase/ssr";

// Singleton — multiple independent client instances in the same tab can
// each cache their own stale snapshot of the auth session, going out of
// sync until a hard refresh. Every caller shares this one instance.
let client;

export function createClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return client;
}
