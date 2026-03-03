import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Img,
  staticFile,
  Easing,
} from "remotion";

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Screenshot scale-in
  const scale = interpolate(frame, [0, 25], [1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const imgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Browser frame
  const frameOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label
  const labelOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit
  const exitOpacity = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f1a, #1a1a2e)",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      {/* Browser mockup */}
      <div
        style={{
          width: 1400,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 20px 80px rgba(255,107,53,0.3)",
          opacity: frameOpacity,
        }}
      >
        {/* Browser toolbar */}
        <div
          style={{
            height: 44,
            background: "#2a2a3a",
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <div
            style={{
              marginLeft: 20,
              background: "#1a1a2e",
              borderRadius: 8,
              padding: "6px 20px",
              color: "#888",
              fontSize: 14,
              fontFamily: "monospace",
            }}
          >
            vibe-requirements-soking1010.vercel.app
          </div>
        </div>

        {/* Screenshot */}
        <div style={{ overflow: "hidden", height: 700 }}>
          <Img
            src={staticFile("screenshots/vibe-promo-hero.png")}
            style={{
              width: "100%",
              transform: `scale(${scale})`,
              opacity: imgOpacity,
            }}
          />
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          opacity: labelOpacity,
          fontSize: 28,
          fontFamily: "Noto Sans TC, sans-serif",
          color: "rgba(255,255,255,0.7)",
          fontWeight: 300,
        }}
      >
        免費線上工具 — 直接在瀏覽器中使用
      </div>
    </AbsoluteFill>
  );
};
