import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

const problems = [
  { emoji: "😩", text: "需求不明確，開發一改再改？" },
  { emoji: "⏰", text: "專案總是延期、超出預算？" },
  { emoji: "🤷", text: "利害關係人各說各話？" },
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 10], [0, 1], {
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
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        justifyContent: "center",
        alignItems: "center",
        opacity: bgOpacity * exitOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          alignItems: "center",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 42,
            fontFamily: "Noto Sans TC, sans-serif",
            fontWeight: 700,
            color: "#ff6b6b",
            opacity: interpolate(frame, [5, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            marginBottom: 20,
          }}
        >
          你是否遇過這些問題？
        </div>

        {problems.map((item, i) => {
          const startFrame = 15 + i * 15;
          const opacity = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(frame, [startFrame, startFrame + 12], [-80, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                opacity,
                transform: `translateX(${x}px)`,
              }}
            >
              <span style={{ fontSize: 52 }}>{item.emoji}</span>
              <span
                style={{
                  fontSize: 38,
                  fontFamily: "Noto Sans TC, sans-serif",
                  color: "#e0e0e0",
                  fontWeight: 400,
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
