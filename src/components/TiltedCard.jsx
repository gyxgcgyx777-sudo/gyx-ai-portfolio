import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import "./TiltedCard.css";

const springConfig = {
  damping: 30,
  stiffness: 115,
  mass: 1.8,
};

export default function TiltedCard({
  children,
  className = "",
  rotateAmplitude = 4,
  scaleOnHover = 1.008,
}) {
  const cardRef = useRef(null);
  const rotateXTarget = useMotionValue(0);
  const rotateYTarget = useMotionValue(0);
  const scaleTarget = useMotionValue(1);
  const rotateX = useSpring(rotateXTarget, springConfig);
  const rotateY = useSpring(rotateYTarget, springConfig);
  const scale = useSpring(scaleTarget, springConfig);

  const canTilt = () => (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );

  useEffect(() => {
    if (!canTilt()) return undefined;

    const handleMouseMove = (event) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const isInside = (
        event.clientX >= rect.left
        && event.clientX <= rect.right
        && event.clientY >= rect.top
        && event.clientY <= rect.bottom
      );

      if (!isInside) {
        rotateXTarget.set(0);
        rotateYTarget.set(0);
        scaleTarget.set(1);
        return;
      }

      const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
      rotateXTarget.set(normalizedY * rotateAmplitude * -2);
      rotateYTarget.set(normalizedX * rotateAmplitude * 2);
      scaleTarget.set(scaleOnHover);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rotateAmplitude, rotateXTarget, rotateYTarget, scaleOnHover, scaleTarget]);

  return (
    <figure
      ref={cardRef}
      className={`tilted-card-figure ${className}`.trim()}
    >
      <motion.div
        className="tilted-card-inner"
        style={{ rotateX, rotateY, scale }}
      >
        {children}
      </motion.div>
    </figure>
  );
}
