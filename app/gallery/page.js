import Image from "next/image";
import { getGalleryImages } from "@/lib/images";

export const metadata = { title: "Gallery · the lab" };

export default function GalleryPage() {
  const images = getGalleryImages();

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2">Gallery</h1>
      <p className="mb-8 text-neutral-500">
        Drop image files into{" "}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
          public/images/gallery
        </code>{" "}
        and they’ll show up here automatically.
      </p>

      {images.length === 0 ? (
        <p className="text-neutral-500">No images yet — add some to get started.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.src}
              className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
