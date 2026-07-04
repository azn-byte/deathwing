import fs from "fs";
import path from "path";

const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery");
const VALID_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);

export function getGalleryImages() {
  if (!fs.existsSync(GALLERY_DIR)) return [];

  return fs
    .readdirSync(GALLERY_DIR)
    .filter((file) => VALID_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => ({
      src: `/images/gallery/${file}`,
      alt: path.parse(file).name.replace(/[-_]/g, " "),
    }));
}
