import { encodeUrlForPath } from "./url";

const HOST_TO_PROVIDER: Record<string, string> = {
  "bsky.app": "bluesky",
  "deviantart.com": "deviantart",
  "dribbble.com": "dribbble",
  "github.com": "github",
  "gitlab.com": "gitlab",
  "instagram.com": "instagram",
  "open.spotify.com": "spotify",
  "patreon.com": "patreon",
  "reddit.com": "reddit",
  "soundcloud.com": "soundcloud",
  "spotify.com": "spotify",
  "substack.com": "substack",
  "t.me": "telegram",
  "telegram.org": "telegram",
  "tiktok.com": "tiktok",
  "twitch.tv": "twitch",
  "twitter.com": "x",
  "vimeo.com": "vimeo",
  "www.deviantart.com": "deviantart",
  "www.dribbble.com": "dribbble",
  "www.github.com": "github",
  "www.gitlab.com": "gitlab",
  "www.instagram.com": "instagram",
  "www.patreon.com": "patreon",
  "www.reddit.com": "reddit",
  "www.soundcloud.com": "soundcloud",
  "www.substack.com": "substack",
  "www.tiktok.com": "tiktok",
  "www.twitch.tv": "twitch",
  "www.twitter.com": "x",
  "www.vimeo.com": "vimeo",
  "www.x.com": "x",
  "www.youtube.com": "youtube",
  "x.com": "x",
  "youtube.com": "youtube",
};

const UNAVATAR_BASE = "https://unavatar.io";

/**
 * Returns the unavatar.io avatar URL for the given profile URL if the host
 * is supported by unavatar; otherwise returns null.
 * @see https://unavatar.io/
 */
export const getUnavatarUrl = (profileUrl: string): string | null => {
  try {
    const url = new URL(profileUrl);
    const host = url.hostname.toLowerCase();
    const provider = HOST_TO_PROVIDER[host];
    if (!provider) {
      return null;
    }
    const [pathname] = url.pathname.replace(/^\/+/, "").split("/");
    if (!pathname) {
      return null;
    }
    const key = encodeUrlForPath(pathname);
    return `${UNAVATAR_BASE}/${provider}/${key}`;
  } catch {
    return null;
  }
};
