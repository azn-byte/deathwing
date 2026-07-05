import { getGalleryImages } from "@/lib/images";
import { prints } from "@/lib/prints";
import HomeExperience from "@/components/HomeExperience";

// Shows a session-aware "Welcome back" greeting — must never be served
// from a stale static cache.
export const dynamic = "force-dynamic";

export default function Home() {
  const images = getGalleryImages();
  const pinnedImages = images.slice(0, 3);
  const featuredPrint = prints[0];

  return (
    <HomeExperience
      galleryCount={images.length}
      pinnedImages={pinnedImages}
      featuredPrint={featuredPrint}
    />
  );
}
