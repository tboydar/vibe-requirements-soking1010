import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Gradient background rotation
  const gradientAngle = interpolate(frame, [0, 90], [135, 180]);

  // Title animation
  const titleY = interpolate(frame, [10, 35], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle animation
  const subOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [30, 50], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Decorative particles
  const particleOpacity = interpolate(frame, [20, 45], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit fade
  const exitOpacity = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, #ff6b35, #f7418c, #fc5c7d)`,
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          top: -100,
          right: -50,
          opacity: particleOpacity,
          transform: `scale(${interpolate(frame, [0, 90], [0.8, 1.2])})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          bottom: -80,
          left: 100,
          opacity: particleOpacity,
          transform: `scale(${interpolate(frame, [0, 90], [1, 0.9])})`,
        }}
      />

      {/* Main title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontFamily: "Noto Sans TC, sans-serif",
            color: "rgba(255,255,255,0.85)",
            letterSpacing: 8,
            fontWeight: 400,
          }}
        >
          VIBE REQUIREMENTS
        </div>
        <div
          style={{
            fontSize: 88,
            fontFamily: "Noto Sans TC, sans-serif",
            fontWeight: 900,
            color: "#fff",
            textShadow: "0 4px 30px rgba(0,0,0,0.3)",
          }}
        >
          需求探索助手
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          fontSize: 32,
          fontFamily: "Noto Sans TC, sans-serif",
          color: "rgba(255,255,255,0.9)",
          fontWeight: 300,
        }}
      >
        用框架化方法，把模糊的想法變成清晰的需求
      </div>
    </AbsoluteFill>
  );
};
