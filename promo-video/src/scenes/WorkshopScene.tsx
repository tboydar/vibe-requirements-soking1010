import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Img,
  staticFile,
  Easing,
} from "remotion";

const stages = [
  { num: 1, label: "CARNET 訪談", color: "#ff6b35" },
  { num: 2, label: "複雜度評估", color: "#f7418c" },
  { num: 3, label: "產品5層", color: "#6c5ce7" },
  { num: 4, label: "User Story", color: "#00b894" },
  { num: 5, label: "EARS 需求", color: "#0984e3" },
];

export const WorkshopScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Title entrance
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 15], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Screenshot entrance
  const imgScale = interpolate(frame, [20, 45], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const imgOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Highlight which stage (cycles through)
  const activeStage = Math.floor(
    interpolate(frame, [50, 190], [0, 5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Exit
  const exitOpacity = interpolate(frame, [190, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f1a, #16213e)",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontFamily: "Noto Sans TC, sans-serif",
            fontWeight: 800,
            color: "#fff",
          }}
        >
          🧪 互動式工作坊
        </div>
        <div
          style={{
            fontSize: 24,
            fontFamily: "Noto Sans TC, sans-serif",
            fontWeight: 300,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          5 個階段，從訪談到完整需求文件
        </div>
      </div>

      {/* Stage tabs */}
      <div
        style={{
          position: "absolute",
          top: 180,
          display: "flex",
          gap: 12,
        }}
      >
        {stages.map((s, i) => {
          const tabOpacity = interpolate(frame, [25 + i * 5, 35 + i * 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const isActive = i === activeStage;

          return (
            <div
              key={s.num}
              style={{
                opacity: tabOpacity,
                padding: "12px 28px",
                borderRadius: 12,
                background: isActive ? s.color : "rgba(255,255,255,0.08)",
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: 20,
                fontFamily: "Noto Sans TC, sans-serif",
                fontWeight: isActive ? 700 : 400,
                transition: "all 0.3s",
                boxShadow: isActive ? `0 4px 20px ${s.color}44` : "none",
              }}
            >
              Stage {s.num}: {s.label}
            </div>
          );
        })}
      </div>

      {/* Workshop screenshot */}
      <div
        style={{
          marginTop: 80,
          width: 1200,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 16px 64px rgba(0,0,0,0.5)",
          opacity: imgOpacity,
          transform: `scale(${imgScale})`,
        }}
      >
        <Img
          src={staticFile("screenshots/vibe-promo-workshop.png")}
          style={{ width: "100%", display: "block" }}
        />
      </div>

      {/* Save indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: interpolate(frame, [120, 140], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#00b894",
          }}
        />
        <span
          style={{
            fontSize: 22,
            fontFamily: "Noto Sans TC, sans-serif",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          自動存檔至 localStorage — 隨時回來繼續
        </span>
      </div>
    </AbsoluteFill>
  );
};
