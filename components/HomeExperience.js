"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useProfile } from "@/lib/useProfile";
import HomeSketchTeaser from "@/components/HomeSketchTeaser";

const GLITCH_LIGHT = "#e5e5e5";
const GLITCH_DARK = "#3a3a3a";

function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function CustomCursor() {
  const ref = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-50 hidden h-5 w-5 rounded-full border border-white/50 transition-transform duration-100 ease-out sm:block"
    />
  );
}

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

function GlitchHeading({ children }) {
  return (
    <h1 className="glitch-heading relative max-w-2xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
      <span className="relative z-10">{children}</span>
      <span aria-hidden className="glitch-layer glitch-layer-a">
        {children}
      </span>
      <span aria-hidden className="glitch-layer glitch-layer-b">
        {children}
      </span>
      <style jsx>{`
        .glitch-heading {
          display: inline-block;
        }
        .glitch-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .glitch-layer-a {
          color: ${GLITCH_LIGHT};
          clip-path: inset(0 0 62% 0);
          animation: glitch-a 5.5s steps(1) infinite;
        }
        .glitch-layer-b {
          color: ${GLITCH_DARK};
          clip-path: inset(68% 0 0 0);
          animation: glitch-b 4.7s steps(1) infinite;
        }
        @keyframes glitch-a {
          0%, 91%, 100% { transform: translate(0, 0); opacity: 0; }
          92% { transform: translate(-6px, -1px); opacity: 0.9; }
          94% { transform: translate(5px, 1px); opacity: 0.5; }
          96% { transform: translate(-2px, 0); opacity: 0; }
        }
        @keyframes glitch-b {
          0%, 87%, 100% { transform: translate(0, 0); opacity: 0; }
          88% { transform: translate(6px, 1px); opacity: 0.8; }
          90% { transform: translate(-5px, -1px); opacity: 0.4; }
          92% { transform: translate(2px, 0); opacity: 0; }
        }
      `}</style>
    </h1>
  );
}

function Counter({ to, label }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let frame;
    const duration = 900;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.floor(progress * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, to]);

  return (
    <div ref={ref} className="flex items-baseline gap-1.5 font-mono">
      <span className="text-sm tabular-nums text-white/80">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-white/40">{label}</span>
    </div>
  );
}

function Marquee() {
  const text = "PHOTOGRAPHY — CURATED ART — EXPERIMENTS — CONNECT — ";
  return (
    <div className="fixed inset-x-0 top-0 z-40 overflow-hidden border-b border-white/10 bg-black/90 py-2 backdrop-blur">
      <div className="marquee-track flex whitespace-nowrap text-xs uppercase tracking-widest text-white/40">
        <span className="pr-8">{text.repeat(4)}</span>
        <span className="pr-8">{text.repeat(4)}</span>
      </div>
      <style jsx>{`
        .marquee-track {
          width: max-content;
          animation: marquee 22s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function SpotlightImage({ src, alt }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className="group relative mb-2 w-full overflow-hidden rounded-sm bg-neutral-900 break-inside-avoid"
      style={{ "--x": "50%", "--y": "50%" }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full grayscale-[30%] transition-all duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at var(--x) var(--y), rgba(255,255,255,0.18), transparent 70%)`,
        }}
      />
    </div>
  );
}

export default function HomeExperience({ galleryCount, pinnedImages, featuredPrint }) {
  const { loading, profile } = useProfile();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <CustomCursor />
      <Grain />
      <Marquee />

      <section className="px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pt-20">
        {loading ? null : (
          <div
            className={`transition-all duration-700 ease-out ${
              loaded ? "translate-y-0 opacity-100 blur-none" : "translate-y-4 opacity-0 blur-md"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
              01 — {profile ? "Session restored" : "Connection verified"}
            </p>
            <GlitchHeading>
              {profile ? (
                <>Welcome back, {profile.handle}.</>
              ) : (
                <>
                  Images,
                  <br />
                  curated and
                  <br />
                  made.
                </>
              )}
            </GlitchHeading>
            <p className="mt-6 max-w-md text-white/50">
              A personal lab for photography, curated fan art, and small web
              experiments — built and maintained by one person.
            </p>

            <div className="mt-10 max-w-sm rounded-sm border border-white/10 bg-white/[0.02] p-4 font-mono text-xs text-white/50 backdrop-blur">
              <p>gallery.dat ..... loaded</p>
              <p>prints.dat ....... loaded</p>
              {profile ? (
                <>
                  <p>session_id ...... {profile.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-white/80">user_status ..... recognized</p>
                </>
              ) : (
                <>
                  <p>session_id ...... none</p>
                  <p className="text-white/80">user_status ..... unregistered</p>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {pinnedImages.length > 0 && (
        <Reveal className="grid gap-6 border-t border-white/10 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:items-start lg:px-14">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
              02 — Currently pinned
            </p>
            <p className="mt-3 text-white/60">
              A few pieces from the curated wall — move your cursor over them.
            </p>
            <Link
              href="/gallery"
              className="mt-4 inline-block text-sm text-white/70 underline underline-offset-4 hover:text-white"
            >
              Walk through the gallery →
            </Link>
          </div>
          <div className="max-w-xs columns-2 gap-2 lg:col-span-6">
            {pinnedImages.map((image) => (
              <SpotlightImage key={image.src} src={image.src} alt={image.alt} />
            ))}
          </div>
        </Reveal>
      )}

      <Reveal className="grid gap-6 border-t border-white/10 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:items-start lg:px-14">
        <div className="lg:col-span-4">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
            03 — Prints
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">
            My own photography, licensed digitally.
          </h2>
        </div>
        <div className="lg:col-span-8">
          {featuredPrint ? (
            <div className="flex gap-6">
              <div className="w-48 shrink-0 overflow-hidden rounded-sm bg-neutral-900">
                <img
                  src={`/images/prints/${featuredPrint.file}`}
                  alt={featuredPrint.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-white/60">{featuredPrint.description}</p>
            </div>
          ) : (
            <p className="text-white/50">
              The shop is still being built — personal-use and
              commercial-use licenses, nothing listed for sale yet.
            </p>
          )}
          <Link
            href="/prints"
            className="mt-4 inline-block text-sm text-white/70 underline underline-offset-4 hover:text-white"
          >
            See the shop →
          </Link>
        </div>
      </Reveal>

      <Reveal className="grid gap-6 border-t border-white/10 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:items-start lg:px-14">
        <div className="lg:col-span-4">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
            04 — Connect
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">
            Small things, built to learn.
          </h2>
          <Link
            href="/connect"
            className="mt-4 inline-block text-sm text-white/70 underline underline-offset-4 hover:text-white"
          >
            See what's there →
          </Link>
        </div>
        <div className="lg:col-span-8">
          <HomeSketchTeaser />
        </div>
      </Reveal>

      <section className="border-t border-white/10 px-6 py-16 pb-20 sm:px-10 lg:px-14">
        <p className="max-w-md text-sm text-white/40">
          Built and kept by one person. Come back — there's usually
          something new.
        </p>
      </section>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 px-6 py-2 backdrop-blur transition-opacity duration-700 ease-out sm:px-10 lg:px-14 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <Counter to={galleryCount} label="pieces archived" />
          <Counter to={1} label="experiments live" />
          <Counter to={3} label="connections tracked" />
          <Counter to={1} label="person behind it" />
        </div>
      </div>
    </div>
  );
}
