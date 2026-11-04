import type { ContactInput } from "./contact-schema";
import { site } from "./site";

/**
 * The pre-filled WhatsApp enquiry. Every value comes from the visitor's
 * form entries; nothing is hard-coded.
 */

type Details = Partial<ContactInput>;

const clean = (s: string | undefined) => (s ?? "").trim();
const budgetOf = (d: Details) => clean(d.budget) || "Not specified";

/** The pre-filled WhatsApp message (line breaks preserved). */
export function whatsappMessage(d: Details): string {
  const name = clean(d.name);
  return [
    "Hello Homestead Interiors!",
    "",
    "I would like to enquire about an interior design project.",
    "",
    "*CUSTOMER DETAILS*",
    "",
    `Full Name: ${name}`,
    `Email: ${clean(d.email)}`,
    `Phone Number: ${clean(d.phone)}`,
    "",
    "*PROJECT DETAILS*",
    "",
    `Project Type: ${clean(d.projectType)}`,
    `Project Location: ${clean(d.location)}`,
    `Approximate Budget: ${budgetOf(d)}`,
    "",
    "*ABOUT THE PROJECT*",
    "",
    clean(d.message),
    "",
    "I look forward to discussing my project with your team.",
    "",
    "Thank you!",
    name,
  ].join("\n");
}

/** wa.me link with the whole message URL-encoded. */
export function whatsappEnquiryUrl(d: Details): string {
  return `${site.whatsapp.url}?text=${encodeURIComponent(whatsappMessage(d))}`;
}
