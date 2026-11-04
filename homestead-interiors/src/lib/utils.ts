/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Two-digit index label: 1 → "01". */
export function pad(n: number) {
  return String(n).padStart(2, "0");
}
