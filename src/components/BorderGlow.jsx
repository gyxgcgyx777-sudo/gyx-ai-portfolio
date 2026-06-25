import { useCallback, useEffect, useRef } from "react";
import "./BorderGlow.css";

function parseHSL(hslString) {
  const match = hslString.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 22, s: 100, l: 58 };
  return { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];

  return Object.fromEntries(
    opacities.map((opacity, index) => [
      `--glow-color${keys[index]}`,
      `hsl(${base} / ${Math.min(opacity * intensity, 100)}%)`,
    ]),
  );
}

const gradientPositions = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const gradientKeys = ["--gradient-one", "--gradient-two", "--gradient-three", "--gradient-four", "--gradient-five", "--gradient-six", "--gradient-seven"];
const colorMap = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const variables = {};
  gradientPositions.forEach((position, index) => {
    const color = colors[Math.min(colorMap[index], colors.length - 1)];
    variables[gradientKeys[index]] = `radial-gradient(at ${position}, ${color} 0px, transparent 50%)`;
  });
  variables["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return variables;
}

const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
const easeInCubic = (value) => value * value * value;

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const startTime = performance.now() + delay;
  let frameId = 0;
  let timeoutId = 0;

  const tick = () => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(Math.max(elapsed / duration, 0), 1);
    onUpdate(start + (end - start) * ease(progress));
    if (progress < 1) frameId = requestAnimationFrame(tick);
    else onEnd?.();
  };

  timeoutId = window.setTimeout(() => {
    frameId = requestAnimationFrame(tick);
  }, delay);

  return () => {
    window.clearTimeout(timeoutId);
    cancelAnimationFrame(frameId);
  };
}

export default function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "22 100 58",
  backgroundColor = "rgba(9, 15, 19, 0.62)",
  borderRadius = 8,
  glowRadius = 28,
  glowIntensity = 0.8,
  coneSpread = 22,
  animated = false,
  colors = ["#ff5a00", "#8bcfff", "#ff8a3d"],
  fillOpacity = 0.18,
}) {
  const cardRef = useRef(null);

  const getCenter = useCallback((element) => {
    const { width, height } = element.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const [centerX, centerY] = getCenter(card);
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const scaleX = deltaX === 0 ? Infinity : centerX / Math.abs(deltaX);
    const scaleY = deltaY === 0 ? Infinity : centerY / Math.abs(deltaY);
    const edge = Math.min(Math.max(1 / Math.min(scaleX, scaleY), 0), 1);
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, [getCenter]);

  useEffect(() => {
    const card = cardRef.current;
    if (!animated || !card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add("sweep-active");
    card.style.setProperty("--cursor-angle", `${angleStart}deg`);

    const cleanups = [
      animateValue({ duration: 500, onUpdate: (value) => card.style.setProperty("--edge-proximity", value) }),
      animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: (value) => card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`) }),
      animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: (value) => card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`) }),
      animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0, onUpdate: (value) => card.style.setProperty("--edge-proximity", value), onEnd: () => card.classList.remove("sweep-active") }),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      card.classList.remove("sweep-active");
    };
  }, [animated]);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`}
      style={{
        "--card-bg": backgroundColor,
        "--edge-sensitivity": edgeSensitivity,
        "--border-radius": `${borderRadius}px`,
        "--glow-padding": `${glowRadius}px`,
        "--cone-spread": coneSpread,
        "--fill-opacity": fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" aria-hidden="true" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
