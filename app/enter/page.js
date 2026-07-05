import EnterClient from "./EnterClient";

// Auth-dependent — must never be served from a stale static cache (a
// cached pre-login shell after the OAuth redirect looked "broken" until
// a manual refresh, before this was added). The dynamic export only
// takes effect from a Server Component file, which is why this is a
// thin wrapper around the actual client logic in EnterClient.js.
export const dynamic = "force-dynamic";

export default function EnterPage() {
  return <EnterClient />;
}
