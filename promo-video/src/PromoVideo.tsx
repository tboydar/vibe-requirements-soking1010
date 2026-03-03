import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { HeroScene } from "./scenes/HeroScene";
import { FeatureScene } from "./scenes/FeatureScene";
import { WorkshopScene } from "./scenes/WorkshopScene";
import { CtaScene } from "./scenes/CtaScene";

// 30fps × 30s = 900 frames total
// Scene breakdown:
//   Intro:    0-90    (3s)  — Animated title
//   Problem:  90-180  (3s)  — Pain points
//   Hero:     180-270 (3s)  — Website hero reveal
//   Features: 270-540 (9s)  — CARNET, Complexity, Layers
//   Workshop: 540-750 (7s)  — Interactive workshop demo
//   CTA:      750-900 (5s)  — Try it + Star on GitHub

export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f1a" }}>
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <ProblemScene />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <HeroScene />
      </Sequence>
      <Sequence from={270} durationInFrames={270}>
        <FeatureScene />
      </Sequence>
      <Sequence from={540} durationInFrames={210}>
        <WorkshopScene />
      </Sequence>
      <Sequence from={750} durationInFrames={150}>
        <CtaScene />
      </Sequence>
    </AbsoluteFill>
  );
};
