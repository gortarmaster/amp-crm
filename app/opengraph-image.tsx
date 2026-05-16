import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Happy Birthday, Andres!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const interBold = await fetch(
    "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZJhiJ-Ek-_EeA.woff"
  ).then((res) => res.arrayBuffer());

  const interRegular = await fetch(
    "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhiJ-Ek-_EeA.woff"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0) 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Cake */}
          <div style={{ fontSize: "80px", lineHeight: 1 }}>🎂</div>

          {/* Happy Birthday label */}
          <div
            style={{
              fontSize: "18px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#a8a29e",
              fontWeight: 400,
            }}
          >
            Happy Birthday
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: "108px",
              fontWeight: 700,
              color: "#c9a96e",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Andres.
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "24px",
              color: "#57534e",
              fontWeight: 400,
              marginTop: "8px",
              letterSpacing: "0.01em",
            }}
          >
            There&apos;s a gift waiting for you.
          </div>
        </div>

        {/* Bottom border accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent 0%, #c9a96e 50%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
      ],
    }
  );
}
