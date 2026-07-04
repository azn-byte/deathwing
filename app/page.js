import Link from "next/link";
import { getGalleryImages } from "@/lib/images";

export default function Home() {
  const images = getGalleryImages().slice(0, 3);

  return (
    <>
      <section className="grid gap-8 px-6 pb-12 pt-6 sm:px-10 lg:grid-cols-12 lg:px-14 lg:pt-10">
        <div className="lg:col-span-8">
          <h1 className="text-6xl font-medium leading-[0.95] tracking-tight sm:text-8xl">
            Images,
            <br />
            curated and
            <br />
            made.
          </h1>
        </div>
        <div className="flex flex-col justify-end gap-6 text-sm text-white/50 lg:col-span-4">
          <p>
            A personal lab for photography, curated fan art, and small web
            experiments — built and maintained by one person.
          </p>
          <div className="flex gap-5 text-sm font-medium">
            <Link href="/gallery" className="text-white underline underline-offset-4">
              View gallery
            </Link>
            <Link href="/experiments" className="text-white/50 underline underline-offset-4 hover:text-white">
              See experiments
            </Link>
          </div>
        </div>
      </section>

      {images[0] && (
        <section className="px-6 pb-8 sm:px-10 lg:px-14">
          <div className="aspect-[16/8] w-full overflow-hidden rounded-sm bg-neutral-900">
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      )}

      {images.length > 1 && (
        <section className="grid grid-cols-2 gap-3 px-6 pb-24 sm:px-10 lg:grid-cols-12 lg:px-14">
          {images.slice(1, 3).map((image, i) => (
            <div key={image.src} className={`col-span-2 ${i === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}>
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-neutral-900">
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
