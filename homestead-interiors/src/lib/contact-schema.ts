import { z } from "zod";

export const projectTypes = [
  "Architectural planning",
  "Interior designing",
  "Villa project",
  "Residential — complete home",
  "Living space",
  "Bedroom",
  "Kitchen & dining",
  "Commercial",
  "Consultation",
  "Something else",
] as const;

/** Enquiry form validation (used before opening WhatsApp). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a phone number we can reach you on.")
    .max(30)
    .regex(/^[+()\d\s.-]+$/, "Use digits, spaces and + ( ) - only.")
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length;
      return digits >= 7 && digits <= 15;
    }, "Please enter a valid phone number (7–15 digits)."),
  projectType: z.enum(projectTypes, { errorMap: () => ({ message: "Please choose a project type." }) }),
  location: z.string().trim().min(2, "Where is the project located?").max(160),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(1, "Please tell us a little about your project.")
    .min(20, "A few more details would help — at least 20 characters.")
    .max(4000, "Please keep it under 4,000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
