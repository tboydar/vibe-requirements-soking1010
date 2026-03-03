import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Gradient animation
  const angle = interpolate(frame, [0, 150], [135, 225]);

  // Main CTA entrance
  const ctaOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaScale = interpolate(frame, [0, 20], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // URL entrance
  const urlOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const urlY = interpolate(frame, [20, 40], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // GitHub star entrance
  const starOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const starY = interpolate(frame, [40, 60], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Star pulse
  const starPulse = interpolate(frame, [60, 80, 100, 120, 140], [1, 1.15, 1, 1.1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // QR / badge area
  const badgeOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, #ff6b35, #f7418c, #6c5ce7)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          top: -200,
          left: -100,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          bottom: -150,
          right: -50,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
        }}
      >
        {/* Heading */}
        <div
          style={{
            fontSize: 72,
            fontFamily: "Noto Sans TC, sans-serif",
            fontWeight: 900,
            color: "#fff",
            textShadow: "0 4px 30px rgba(0,0,0,0.25)",
          }}
        >
          立即免費試用
        </div>

        {/* URL */}
        <div
          style={{
            opacity: urlOpacity,
            transform: `translateY(${urlY}px)`,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: 16,
            padding: "18px 48px",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontFamily: "monospace",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            vibe-requirements-soking1010.vercel.app
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 2,
            background: "rgba(255,255,255,0.3)",
            margin: "8px 0",
            opacity: starOpacity,
          }}
        />

        {/* GitHub Star CTA */}
        <div
          style={{
            opacity: starOpacity,
            transform: `translateY(${starY}px) scale(${starPulse})`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 52 }}>⭐</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 36,
                fontFamily: "Noto Sans TC, sans-serif",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              給個 Star 支持我們！
            </span>
            <span
              style={{
                fontSize: 24,
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              github.com/soking1010/vibe-requirements
            </span>
          </div>
        </div>

        {/* Badges */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 16,
            opacity: badgeOpacity,
          }}
        >
          {["🆓 免費使用", "🔒 資料存本地", "📱 支援手機", "🌐 繁體中文"].map(
            (badge, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: "10px 24px",
                  color: "#fff",
                  fontSize: 22,
                  fontFamily: "Noto Sans TC, sans-serif",
                  fontWeight: 500,
                }}
              >
                {badge}
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom credit */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontSize: 18,
          fontFamily: "Noto Sans TC, sans-serif",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        Built with Vibe Requirements Framework — by soking1010
      </div>
    </AbsoluteFill>
  );
};
