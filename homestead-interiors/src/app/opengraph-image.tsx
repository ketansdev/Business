import { ImageResponse } from "next/og";

export const alt = "Homestead Interiors — Spaces that inspire. Interiors that feel like home.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social card, generated at build time (no external assets). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#FFFFFF",
          color: "#252A30",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 40, letterSpacing: 14 }}>HOMESTEAD</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
            <div style={{ width: 40, height: 2, background: "#91A58B" }} />
            <div style={{ fontSize: 16, letterSpacing: 10, fontFamily: "sans-serif" }}>INTERIORS</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 78, lineHeight: 1.02 }}>
          <div>Spaces that inspire.</div>
          <div style={{ color: "#56704F", fontStyle: "italic" }}>Interiors that feel like home.</div>
        </div>
        <div style={{ fontSize: 22, color: "#68717A", fontFamily: "sans-serif" }}>
          Thoughtfully designed spaces, crafted around the way you live.
        </div>
      </div>
    ),
    size,
  );
}
