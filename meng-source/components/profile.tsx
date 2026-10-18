"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile, tabs, type Photo, type Post } from "@/lib/profile";

export function Profile() {
  const [tab, setTab] = useState(tabs[0].id);
  const [followed, setFollowed] = useState(false);
  const [clock, setClock] = useState("--:--");
  const [toast, setToast] = useState("");
  const [viewer, setViewer] = useState<{ photos: Photo[]; index: number } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [songError, setSongError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const active = tabs.find((item) => item.id === tab) ?? tabs[0];

  useEffect(() => {
    const saved = window.localStorage.getItem("meng-followed");
    setFollowed(saved === "1");
    const tick = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const toggleFollow = useCallback(() => {
    setFollowed((current) => {
      const next = !current;
      window.localStorage.setItem("meng-followed", next ? "1" : "0");
      return next;
    });
  }, []);

  const copyLink = useCallback(async () => {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "轩 · 梦", text: profile.subtitle, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setToast("链接已复制");
    } catch {
      setToast("复制没有成功，请手动复制地址");
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => setSongError(true);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    audio.play().catch(() => {});

    const kick = (event: PointerEvent) => {
      window.removeEventListener("pointerdown", kick);
      const target = event.target;
      if (target instanceof Element && target.closest("[data-song-toggle]")) return;
      if (audio.paused) audio.play().catch(() => {});
    };
    window.addEventListener("pointerdown", kick);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      window.removeEventListener("pointerdown", kick);
    };
  }, []);

  const toggleSong = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => setSongError(true));
      return;
    }
    audio.pause();
  }, []);

  const closeViewer = useCallback(() => setViewer(null), []);
  const moveViewer = useCallback((index: number) => {
    setViewer((current) => (current ? { photos: current.photos, index } : current));
  }, []);

  return (
    <div className="min-h-dvh">
      <main className="mx-auto min-h-dvh w-full bg-white pb-[env(safe-area-inset-bottom)] md:max-w-[760px] md:border-x md:border-[var(--line)]">
        <audio ref={audioRef} src="/api/song" loop preload="auto" className="sr-only" />
        <header className="sticky top-0 z-20 bg-white pt-[env(safe-area-inset-top)]">
        <div className="flex h-12 items-center gap-1 px-2 sm:gap-2 sm:px-3">
          <button
            type="button"
            aria-label="回到顶部"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full active:bg-black/5"
          >
            <ArrowLeft />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[17px] font-extrabold leading-5">{profile.name}</div>
            <div className="truncate text-[13px] text-[var(--muted)]">{profile.subtitle}</div>
          </div>
          <div className="shrink-0 tabular-nums text-[13px] text-[var(--muted)] sm:text-[15px]">{clock}</div>
          <button
            type="button"
            data-song-toggle
            onClick={toggleSong}
            aria-label={playing ? `暂停 ${profile.song.title}` : `播放 ${profile.song.title}`}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full active:bg-black/5"
          >
            {playing ? <PauseIcon /> : <MusicIcon />}
          </button>
          <button
            type="button"
            aria-label="分享本页"
            onClick={copyLink}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full active:bg-black/5"
          >
            <ShareIcon />
          </button>
        </div>
        </header>

        <button
          type="button"
          className="relative z-0 block w-full"
          onClick={() => setViewer({ photos: [profile.banner], index: 0 })}
          aria-label="查看封面"
        >
          <Image
            src={profile.banner.src}
            alt={profile.banner.alt}
            width={profile.banner.width}
            height={profile.banner.height}
            priority
            className="h-[42vw] max-h-[280px] min-h-[168px] w-full object-cover object-[center_70%] brightness-[.82] md:h-[240px]"
          />
        </button>

        <div className="relative z-10 px-4 md:px-6">
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              className="relative z-10 -mt-12 h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white md:-mt-16 md:h-[124px] md:w-[124px]"
              onClick={() => setViewer({ photos: [profile.avatar], index: 0 })}
              aria-label="查看头像"
            >
              <Image
                src={profile.avatar.src}
                alt={profile.avatar.alt}
                width={profile.avatar.width}
                height={profile.avatar.height}
                priority
                className="h-full w-full object-cover object-center"
              />
            </button>
            <button
              type="button"
              onClick={toggleFollow}
              className={`mt-3 min-h-11 min-w-[96px] shrink-0 rounded-full px-5 py-2 text-[15px] font-bold ${
                followed
                  ? "border border-[#cfd9de] bg-white text-[var(--text)] hover:border-[#f4212e] hover:text-[#f4212e]"
                  : "bg-[var(--text)] text-white hover:bg-black/80"
              }`}
            >
              {followed ? "已牵上" : "牵上我"}
            </button>
          </div>

          <h1 className="mt-2 text-[22px] font-extrabold leading-7">{profile.name}</h1>
          <div className="text-[15px] text-[var(--muted)]">{profile.handle}</div>

          <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
            {profile.facts.map((fact) => (
              <div key={fact.k} className="flex gap-1.5">
                <dt className="text-[var(--muted)]">{fact.k}</dt>
                <dd className="font-bold">{fact.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5">
              <PinIcon />
              {profile.places.join(" · ")}
            </span>
            <span>{profile.marks.join(" · ")}</span>
          </div>

          <p className="poem mt-3 text-[17px] leading-7">
            {profile.poem.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <button
            type="button"
            data-song-toggle
            onClick={toggleSong}
            className="mt-4 flex min-h-14 w-full items-center gap-3 rounded-2xl border border-[var(--line)] px-3 py-2.5 text-left active:bg-[var(--hover)]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0f1419] text-white">
              <MusicIcon />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-bold">{profile.song.title}</span>
              <span className="block truncate text-[13px] text-[var(--muted)]">
                {songError ? "暂时放不了" : playing ? "正在播放" : profile.song.artist}
              </span>
            </span>
            <span className="text-[13px] font-semibold text-[var(--blue)]">{playing ? "暂停" : "播放"}</span>
          </button>
        </div>

        <nav className="sticky top-[calc(3rem+env(safe-area-inset-top))] z-10 mt-4 flex border-b border-[var(--line)] bg-white">
          {tabs.map((item) => {
            const on = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`relative min-h-12 flex-1 px-2 py-3.5 text-[15px] ${
                  on ? "font-bold text-[var(--text)]" : "text-[var(--muted)] active:bg-black/[0.04]"
                }`}
                aria-current={on ? "page" : undefined}
              >
                {item.label}
                {on && (
                  <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-[var(--blue)]" />
                )}
              </button>
            );
          })}
        </nav>

        <a
          href={profile.schedule.href}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-12 items-center gap-3 border-b border-[var(--line)] px-4 py-3.5 active:bg-[rgba(29,155,240,0.06)] md:px-6"
        >
          <span className="grid w-10 place-items-center text-[var(--muted)]">
            <PinIcon />
          </span>
          <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{profile.schedule.label}</span>
          <span className="text-[var(--muted)]">↗</span>
        </a>

        <section>
          {active.posts.map((post) => (
            <PostCard key={post.id} post={post} onOpen={(photos, index) => setViewer({ photos, index })} />
          ))}
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-40 max-w-[90vw] -translate-x-1/2 rounded-full bg-[#0f1419] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      {viewer && (
        <Lightbox
          photos={viewer.photos}
          index={viewer.index}
          onClose={closeViewer}
          onIndex={moveViewer}
        />
      )}
    </div>
  );
}

function PostCard({
  post,
  onOpen,
}: {
  post: Post;
  onOpen: (photos: Photo[], index: number) => void;
}) {
  const photos = post.photos ?? [];
  const single = photos.length === 1;
  return (
    <article className="border-b border-[var(--line)] px-4 py-4 md:px-6">
      <div className="flex gap-3">
        <Image
          src={profile.avatar.src}
          alt={profile.avatar.alt}
          width={profile.avatar.width}
          height={profile.avatar.height}
          className="h-10 w-10 shrink-0 rounded-full object-cover object-center"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-bold">{profile.name}</span>
            <span className="text-[15px] text-[var(--muted)]">{profile.handle}</span>
            {post.kicker && <span className="text-[13px] text-[var(--muted)]">· {post.kicker}</span>}
          </div>
          {post.text && (
            <div className={`mt-1.5 space-y-1 break-words text-[16px] leading-7 ${post.poem ? "poem" : ""}`}>
              {post.text.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          )}
          {post.chips && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {post.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-[#f7f9f9] px-3 py-1 text-[13px] font-medium text-[#0f1419]"
                >
                  {chip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {photos.length > 0 && (
        <div className={`mt-3 ${single ? "" : "grid grid-cols-2 gap-0.5"} md:pl-[52px]`}>
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => onOpen(photos, index)}
              className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[#f7f9f9] text-left"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 768px) 100vw, 680px"
                className="h-auto w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {post.link && (
        <a
          href={post.link.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-1 text-[15px] font-semibold text-[var(--blue)] active:underline md:ml-[52px]"
        >
          {post.link.label}
          <span aria-hidden>↗</span>
        </a>
      )}
    </article>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndex: (index: number) => void;
}) {
  const photo = photos[index];
  const many = photos.length > 1;
  const startX = useRef(0);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && many) onIndex((index + 1) % photos.length);
      if (event.key === "ArrowLeft" && many) onIndex((index - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [index, many, onClose, onIndex, photos.length]);

  const label = useMemo(() => `${index + 1} / ${photos.length}`, [index, photos.length]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(3.5rem,env(safe-area-inset-top))]"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
      onTouchStart={(event) => {
        startX.current = event.changedTouches[0]?.clientX ?? 0;
      }}
      onTouchEnd={(event) => {
        if (!many) return;
        const delta = (event.changedTouches[0]?.clientX ?? 0) - startX.current;
        if (Math.abs(delta) < 40) return;
        event.stopPropagation();
        onIndex((index + (delta < 0 ? 1 : -1) + photos.length) % photos.length);
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] grid h-11 w-11 place-items-center rounded-full bg-white/15 text-2xl text-white"
        aria-label="关闭"
      >
        ×
      </button>
      <p className="absolute left-1/2 top-[max(1.15rem,env(safe-area-inset-top))] hidden -translate-x-1/2 text-xs text-white/60 sm:block">
        Esc 关闭{many ? " · 方向键切换" : ""}
      </p>
      {many && (
        <>
          <button
            type="button"
            aria-label="上一张"
            className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-xl text-white sm:grid"
            onClick={(event) => {
              event.stopPropagation();
              onIndex((index - 1 + photos.length) % photos.length);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="下一张"
            className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-xl text-white sm:grid"
            onClick={(event) => {
              event.stopPropagation();
              onIndex((index + 1) % photos.length);
            }}
          >
            ›
          </button>
        </>
      )}
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="100vw"
        className="h-auto max-h-full w-auto max-w-full rounded-md object-contain"
        onClick={(event) => event.stopPropagation()}
      />
      <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/15 px-4 py-1.5 text-sm text-white">
        <span className="text-white/70 sm:hidden">{many ? "滑动切换" : "轻点空白关闭"}</span>
        <span>{label}</span>
      </div>
    </div>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M7.4 11H20v2H7.4l5.3 5.3-1.4 1.4L3.6 12l7.7-7.7 1.4 1.4z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M12 3l4 4h-3v7h-2V7H8l4-4zm-7 10h2v6h10v-6h2v8H5v-8z" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden>
      <path d="M9 17.5a2.5 2.5 0 1 1-2-2.45V6.8l10-2v8.25a2.5 2.5 0 1 1-2-2.45V7.2l-6 1.2v9.1z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden>
      <path d="M7 5h3.2v14H7V5zm6.8 0H17v14h-3.2V5z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
    </svg>
  );
}
