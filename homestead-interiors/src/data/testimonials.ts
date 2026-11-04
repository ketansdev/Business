/**
 * TESTIMONIALS — genuine, client-approved reviews only.
 * ------------------------------------------------------------------
 * The list is empty until real reviews are provided. While it's empty the
 * section shows "Our Commitment to Every Space" (the studio's own brand
 * statements) instead of review cards — nothing is invented or labelled.
 *
 * Adding a review (with the client's permission):
 *   {
 *     quote: "The review exactly as the client wrote it.",
 *     name: "Client name",            // only if the client approved showing it
 *     location: "Pune, Maharashtra",  // only if approved
 *     rating: 4.5,                    // only if the client gave a rating (0–5, decimals OK)
 *     projectSlug: "grey-marble-residence", // optional link to a project
 *   },
 *
 * - Leave `name` out to show the review as "Homestead Interiors client".
 * - Leave `rating` out if none was given — no stars are shown for that card.
 * - The overall average above the carousel is calculated only from reviews
 *   that include a rating, and is hidden when none do.
 * - Never add photos, job titles or companies the client didn't provide.
 */

export type Testimonial = {
  /** The client's own words, without quotation marks. */
  quote: string;
  /** Shown only if provided (i.e. approved by the client). */
  name?: string;
  /** City / area — shown only if provided. */
  location?: string;
  /** The client's own rating out of 5 (decimals allowed, e.g. 4.7). */
  rating?: number;
  /** Optional: slug of a project in projects.ts to link to. */
  projectSlug?: string;
};

export const testimonials: Testimonial[] = [];

/** Reviews ready to display (non-empty text). */
export function getTestimonials(): Testimonial[] {
  return testimonials.filter((t) => t.quote.trim().length > 0);
}

/** Average of the ratings actually given, rounded to one decimal — or null. */
export function getRatingSummary(list: Testimonial[] = getTestimonials()) {
  const rated = list.filter((t) => typeof t.rating === "number" && t.rating >= 0 && t.rating <= 5);
  if (rated.length === 0) return null;
  const avg = rated.reduce((sum, t) => sum + (t.rating as number), 0) / rated.length;
  return { average: Math.round(avg * 10) / 10, count: rated.length };
}
