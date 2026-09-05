import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Build a URL for a Sanity image.
 *
 * Always go through this rather than using an asset URL directly — it is what
 * resizes and reformats on the fly, and it is the reason the 364 MB asset
 * problem does not come back the first time a student uploads a phone photo.
 */
export function urlFor(source: Image, width: number, height?: number) {
  const img = builder.image(source).width(width).auto("format").fit("max");
  return (height ? img.height(height) : img).url();
}

export const imageUrl = (source: Image) => builder.image(source).auto("format").url();
