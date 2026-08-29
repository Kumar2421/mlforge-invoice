import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#131313",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#d6fd70",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#131313",
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            m
          </div>
          <div style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>{SITE.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: "#fff", fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            Get paid faster, automatically.
          </div>
          <div style={{ color: "#b7b7b7", fontSize: 30, maxWidth: 880, lineHeight: 1.3 }}>
            Escalating reminder emails for overdue invoices. Read-only Stripe. Flat fee, no percentage cut.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {["Day 3", "Day 7", "Day 14", "Paid → stops"].map((t) => (
            <div
              key={t}
              style={{
                border: "2px solid #3a3a3a",
                borderRadius: 999,
                padding: "10px 22px",
                color: "#d6fd70",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
