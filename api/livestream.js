/* ============================================================
   /api/livestream  —  Vercel Serverless Function
   ------------------------------------------------------------
   Tells the Watch Live page which YouTube state to show, WITHOUT
   anyone editing a video ID every week.

   Streaming workflow:  OBS -> Restream Standard -> YouTube + Facebook.
   Restream Standard has no dependable website embed, so the site
   reads YouTube's public broadcast state directly via the YouTube
   Data API v3 and embeds the YouTube player.

   It checks, in priority order, and returns the first match:
     1) live      — a broadcast is live RIGHT NOW
     2) upcoming   — a scheduled broadcast exists (shows YouTube countdown)
     3) replay     — the most recent completed broadcast (watch later)
     4) none       — nothing found / not configured / API error
                     (the page shows a branded fallback, never an error)

   ENVIRONMENT VARIABLES (Vercel -> this project -> Settings ->
   Environment Variables — never commit these):
     YOUTUBE_API_KEY      YouTube Data API v3 key (server-side only).
     YOUTUBE_CHANNEL_ID   the church channel ID (starts "UC...").

   Quota: results are cached at the edge (s-maxage) AND in a warm
   in-memory cache, so the Data API is touched at most about once
   per CACHE_TTL regardless of how many visitors load the page.
   ============================================================ */

var API = "https://www.googleapis.com/youtube/v3/";
var CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Warm in-memory cache (shared while the serverless instance stays warm).
var _cache = { at: 0, payload: null };

function ok(res, payload) {
  // Cache at Vercel's edge/CDN so repeat visitors don't spend quota.
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=300, stale-while-revalidate=600"
  );
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(200).json(payload);
}

async function ytSearch(key, channelId, eventType) {
  var url =
    API +
    "search?part=snippet&type=video&maxResults=1&order=date" +
    "&eventType=" + encodeURIComponent(eventType) +
    "&channelId=" + encodeURIComponent(channelId) +
    "&key=" + encodeURIComponent(key);
  var r = await fetch(url);
  if (!r.ok) throw new Error("search " + eventType + " " + r.status);
  var data = await r.json();
  var item = data.items && data.items[0];
  if (!item || !item.id || !item.id.videoId) return null;
  return {
    videoId: item.id.videoId,
    title: (item.snippet && item.snippet.title) || "",
  };
}

// Fetch the scheduled start time for an upcoming broadcast (cheap: 1 unit).
async function ytScheduledStart(key, videoId) {
  try {
    var url =
      API +
      "videos?part=liveStreamingDetails&id=" + encodeURIComponent(videoId) +
      "&key=" + encodeURIComponent(key);
    var r = await fetch(url);
    if (!r.ok) return "";
    var data = await r.json();
    var item = data.items && data.items[0];
    return (
      (item && item.liveStreamingDetails &&
        item.liveStreamingDetails.scheduledStartTime) || ""
    );
  } catch (e) {
    return "";
  }
}

module.exports = async function handler(req, res) {
  var key = process.env.YOUTUBE_API_KEY;
  var channelId = process.env.YOUTUBE_CHANNEL_ID;

  // Not configured yet — page shows its branded fallback (no error to visitors).
  if (!key || !channelId) {
    return ok(res, { state: "none", reason: "unconfigured" });
  }

  // Serve warm cache if fresh.
  if (_cache.payload && Date.now() - _cache.at < CACHE_TTL_MS) {
    return ok(res, _cache.payload);
  }

  try {
    var payload;

    // 1) Live now?
    var live = await ytSearch(key, channelId, "live");
    if (live) {
      payload = { state: "live", videoId: live.videoId, title: live.title };
    } else {
      // 2) Upcoming scheduled?
      var upcoming = await ytSearch(key, channelId, "upcoming");
      if (upcoming) {
        var when = await ytScheduledStart(key, upcoming.videoId);
        payload = {
          state: "upcoming",
          videoId: upcoming.videoId,
          title: upcoming.title,
          scheduledStartTime: when,
        };
      } else {
        // 3) Most recent completed broadcast (replay)?
        var replay = await ytSearch(key, channelId, "completed");
        if (replay) {
          payload = { state: "replay", videoId: replay.videoId, title: replay.title };
        } else {
          // 4) Nothing found.
          payload = { state: "none", reason: "no-broadcasts" };
        }
      }
    }

    _cache = { at: Date.now(), payload: payload };
    return ok(res, payload);
  } catch (err) {
    console.error("livestream lookup failed:", err && err.message);
    // Never surface an API error to visitors — fall back gracefully.
    // Serve slightly stale cache if we have any; otherwise a clean "none".
    if (_cache.payload) return ok(res, _cache.payload);
    return ok(res, { state: "none", reason: "error" });
  }
};
