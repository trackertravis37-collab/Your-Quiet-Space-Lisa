import { useSyncExternalStore } from "react";
import type { Path } from "wouter";

// A safer variant of wouter's useHashLocation.
//
// Why: In some environments (certain file:// contexts, embedded webviews,
// privacy modes), `history.pushState/replaceState` can throw and crash the app.
//
// This hook falls back to setting `location.hash` directly if the History API
// rejects the update.

// array of callbacks subscribed to hash updates
const listeners: { v: Array<() => void> } = { v: [] };

const onHashChange = () => listeners.v.forEach((cb) => cb());

const subscribeToHashUpdates = (callback: () => void) => {
  if (listeners.v.push(callback) === 1) addEventListener("hashchange", onHashChange);

  return () => {
    listeners.v = listeners.v.filter((i) => i !== callback);
    if (!listeners.v.length) removeEventListener("hashchange", onHashChange);
  };
};

// leading '#' is ignored, leading '/' is optional
const currentHashLocation = () => "/" + location.hash.replace(/^#?\/?/, "");

export const safeHashNavigate = (to: Path, { replace = false } = {}) => {
  const oldURL = location.href;

  const [hash, search] = String(to).replace(/^#?\/?/, "").split("?");
  const newHash = `/${hash}${search ? `?${search}` : ""}`;

  // First try the History API (keeps back/forward nice)
  try {
    const url = new URL(location.href);
    url.hash = `/${hash}`;
    if (search) url.search = search;
    const newURL = url.href;

    if (replace) {
      history.replaceState(null, "", newURL);
    } else {
      history.pushState(null, "", newURL);
    }

    // Ensure subscribers are notified even if browser doesn't fire hashchange.
    const event =
      typeof HashChangeEvent !== "undefined"
        ? new HashChangeEvent("hashchange", { oldURL, newURL })
        : new Event("hashchange", { detail: { oldURL, newURL } } as any);

    dispatchEvent(event);
    return;
  } catch {
    // Fallback: set hash directly
    location.replace(`#${newHash}`);
  }
};

export function useSafeHashLocation({ ssrPath = "/" }: { ssrPath?: Path } = {}) {
  return [
    useSyncExternalStore(subscribeToHashUpdates, currentHashLocation, () => ssrPath),
    safeHashNavigate,
  ] as [Path, typeof safeHashNavigate];
}

useSafeHashLocation.hrefs = (href: string) => "#" + href;
