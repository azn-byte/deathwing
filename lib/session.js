// Client-side only visitor session, stored in localStorage. There is no
// backend yet — this just remembers a handle + path on this device.
// Replace with real auth (Supabase) once that's wired up.

const KEY = "lab-session";

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  window.localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(KEY);
}

// A per-session identifier, not a global visitor count — there's no
// backend to count visitors yet, so this is just this browser's ID.
export function generateSessionId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
