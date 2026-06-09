import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ShipOrSkip founder decision intelligence report preview";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#ffffff",
          color: "#111827",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter, Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: 64,
          width: "100%"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div style={{ fontSize: 30, fontWeight: 700 }}>ShipOrSkip</div>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 999,
              color: "#6b7280",
              fontSize: 22,
              padding: "10px 18px"
            }}
          >
            Founder Decision Intelligence
          </div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
            Startup Due Diligence for Builders
          </div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.02, maxWidth: 880 }}>
            Stop building products nobody wants.
          </div>
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 20,
            display: "flex",
            gap: 24,
            padding: 24
          }}
        >
          {["Market Demand", "Competition", "Monetization", "Execution", "Distribution"].map((label) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{ color: "#6b7280", fontSize: 20, marginBottom: 12 }}>{label}</div>
              <div style={{ background: "#111827", borderRadius: 999, height: 10, width: "74%" }} />
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
