import { getGalleryImages } from "@/lib/images";

export const metadata = { title: "Gallery · the lab" };

export default function GalleryPage() {
  const images = getGalleryImages();

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:px-14">
      <h1 className="mb-2 text-4xl font-medium tracking-tight">Gallery</h1>
      <p className="mb-8 text-white/50">
        Drop image files into{" "}
        <code className="rounded bg-neutral-800 px-1.5 py-0.5">
          public/images/gallery
        </code>{" "}
        and they’ll show up here automatically.
      </p>

      {images.length === 0 ? (
        <p className="text-white/50">No images yet — add some to get started.</p>
      ) : (
        <div className="columns-2 gap-4 sm:columns-3">
          {images.map((image) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="mb-4 w-full break-inside-avoid rounded-sm bg-neutral-900"
            />
          ))}
        </div>
      )}
    </section>
  );
}
