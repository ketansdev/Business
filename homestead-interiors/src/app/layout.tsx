import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/footer/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollAnimations } from "@/animations/scroll/ScrollAnimations";

// Fraunces: a contemporary editorial serif. Variable weight + optical sizing,
// so large headings stay crisp and confident while smaller ones stay readable.
const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["interior design", "interior designer", "residential interiors", "home interiors", "commercial interior design", "architectural planning", "villa projects"],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: site.name,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "InteriorDesigner",
  name: site.name,
  description: site.description,
  url: site.url,
  slogan: site.tagline,
  ...(site.contact.email ? { email: site.contact.email } : {}),
  ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
  ...(site.contact.address ? { address: site.contact.address } : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll>
          <Header />
          <ScrollAnimations>
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
          </ScrollAnimations>
        </SmoothScroll>
        <WhatsAppButton />
      </body>
    </html>
  );
}
