import Link from "next/link";
import { getGalleryImages } from "@/lib/images";
import { prints } from "@/lib/prints";
import HomeSketchTeaser from "@/components/HomeSketchTeaser";

export default function Home() {
  const images = getGalleryImages();
  const spotlight = images[0];
  const featuredPrint = prints[0];

  return (
    <>
      <section className="px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pt-20">
        <h1 className="max-w-3xl text-6xl font-medium leading-[0.95] tracking-tight sm:text-8xl">
          Images,
          <br />
          curated and
          <br />
          made.
        </h1>
        <p className="mt-8 max-w-md text-white/50">
          A personal lab for photography, curated fan art, and small web
          experiments — built and maintained by one person.
        </p>
      </section>

      {spotlight && (
        <section className="grid gap-6 border-t border-white/10 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:items-end lg:px-14">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-white/40">
              Currently pinned
            </p>
            <p className="mt-3 text-white/60">
              One piece from the curated wall — fan art and finds worth
              sitting with for a minute.
            </p>
            <Link
              href="/gallery"
              className="mt-4 inline-block text-sm text-white/70 underline underline-offset-4 hover:text-white"
            >
              Walk through the gallery →
            </Link>
          </div>
          <div className="lg:col-span-8">
            <div className="aspect-[16/10] overflow-hidden rounded-sm bg-neutral-900">
              <img
                src={spotlight.src}
                alt={spotlight.alt}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 border-t border-white/10 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:items-start lg:px-14">
        <div className="lg:col-span-4">
          <p className="font-mono text-xs uppercase tracking-widest text-white/40">
            Prints
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
      </section>

      <section className="grid gap-6 border-t border-white/10 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:items-start lg:px-14">
        <div className="lg:col-span-4">
          <p className="font-mono text-xs uppercase tracking-widest text-white/40">
            Experiments
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">
            Small things, built to learn.
          </h2>
          <Link
            href="/experiments"
            className="mt-4 inline-block text-sm text-white/70 underline underline-offset-4 hover:text-white"
          >
            See all experiments →
          </Link>
        </div>
        <div className="lg:col-span-8">
          <HomeSketchTeaser />
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-14">
        <p className="max-w-md text-sm text-white/40">
          Built and kept by one person. Come back — there's usually
          something new.
        </p>
      </section>
    </>
  );
}
