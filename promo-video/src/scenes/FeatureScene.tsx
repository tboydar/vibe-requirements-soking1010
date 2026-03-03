import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Img,
  staticFile,
  Easing,
  Sequence,
} from "remotion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  screenshot: string;
  reverse?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  screenshot,
  reverse,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideX = interpolate(frame, [0, 20], [reverse ? 60 : -60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const imgSlide = interpolate(frame, [10, 30], [reverse ? -40 : 40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const imgOpacity = interpolate(frame, [10, 25], [0, 1], {
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
        background: "linear-gradient(135deg, #0f0f1a, #1a1a2e)",
        flexDirection: reverse ? "row-reverse" : "row",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        padding: "0 100px",
        opacity: exitOpacity,
      }}
    >
      {/* Text side */}
      <div
        style={{
          flex: 1,
          opacity,
          transform: `translateX(${slideX}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ fontSize: 64 }}>{icon}</div>
        <div
          style={{
            fontSize: 48,
            fontFamily: "Noto Sans TC, sans-serif",
            fontWeight: 800,
            color: "#fff",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 26,
            fontFamily: "Noto Sans TC, sans-serif",
            fontWeight: 300,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.6,
          }}
        >
          {description}
        </div>
      </div>

      {/* Screenshot side */}
      <div
        style={{
          flex: 1,
          opacity: imgOpacity,
          transform: `translateX(${imgSlide}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 12px 48px rgba(255,107,53,0.2)",
          }}
        >
          <Img
            src={staticFile(`screenshots/${screenshot}`)}
            style={{ width: "100%", display: "block" }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FeatureScene: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Feature 1: CARNET Interview */}
      <Sequence from={0} durationInFrames={90}>
        <FeatureCard
          icon="🎤"
          title="CARNET 訪談框架"
          description="用 6 大維度（Context / Actors / Requirements / Non-functional / Edge cases / Timeline）系統化地挖掘需求"
          screenshot="vibe-promo-carnet.png"
        />
      </Sequence>

      {/* Feature 2: Complexity Assessment */}
      <Sequence from={90} durationInFrames={90}>
        <FeatureCard
          icon="📊"
          title="5 級複雜度評估"
          description="從「烤吐司」到「蓋太空站」，5 道題目快速判斷專案複雜度，匹配適當的需求深度"
          screenshot="vibe-promo-stage2.png"
          reverse
        />
      </Sequence>

      {/* Feature 3: User Story & EARS */}
      <Sequence from={180} durationInFrames={90}>
        <FeatureCard
          icon="📝"
          title="User Story + EARS"
          description="用標準化模板撰寫使用者故事與 EARS 需求句型，搭配 MoSCoW 優先排序"
          screenshot="vibe-promo-stage4.png"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
