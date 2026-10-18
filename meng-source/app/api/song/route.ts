import { profile } from "@/lib/profile";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const id = profile.song.id;
  const info = await fetch(
    `https://music.163.com/api/song/enhance/player/url?id=${id}&ids=${encodeURIComponent(`[${id}]`)}&br=320000`,
    {
      headers: {
        Referer: "https://music.163.com/",
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    },
  );
  if (!info.ok) {
    return new Response("找不到音频", { status: 502 });
  }

  const payload = (await info.json()) as { data?: { url?: string | null }[] };
  const url = payload.data?.[0]?.url;
  if (!url) {
    return new Response("这首暂时放不了", { status: 404 });
  }

  const headers = new Headers({
    Referer: "https://music.163.com/",
    "User-Agent": "Mozilla/5.0",
  });
  const range = request.headers.get("range");
  if (range) headers.set("Range", range);

  const audio = await fetch(url, { headers, cache: "no-store" });
  const out = new Headers();
  for (const key of ["content-type", "content-length", "content-range", "accept-ranges"]) {
    const value = audio.headers.get(key);
    if (value) out.set(key, value);
  }
  if (!out.has("content-type")) out.set("content-type", "audio/mpeg");
  out.set("cache-control", "no-store");

  return new Response(audio.body, { status: audio.status, headers: out });
}
