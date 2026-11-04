import type { ReactNode } from "react";
import { PageTransition } from "@/animations/transitions/PageTransition";

/** Templates remount on navigation — perfect for per-route entrance motion. */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
