import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import "./CardSwap.css";

export const Card = forwardRef(({ customClass = "", className = "", ...rest }, ref) => (
  <article ref={ref} {...rest} className={`swap-card ${customClass} ${className}`.trim()} />
));

Card.displayName = "Card";

function makeSlot(index, distanceX, distanceY, total) {
  return {
    x: index * distanceX,
    y: index * distanceY,
    z: (total - index) * 24,
    zIndex: total - index,
  };
}

function placeCard(element, slot) {
  gsap.set(element, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    zIndex: slot.zIndex,
    force3D: true,
    transformOrigin: "center center",
  });
}

export default function CardSwap({
  width = 820,
  height = 520,
  cardDistance = 104,
  verticalDistance = 8,
  delay = 0,
  pauseOnHover = true,
  onCardClick,
  children,
}) {
  const childArray = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(() => childArray.map(() => ({ current: null })), [childArray.length]);
  const orderRef = useRef(Array.from({ length: childArray.length }, (_, index) => index));
  const timelineRef = useRef(null);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const [frontIndex, setFrontIndex] = useState(0);

  const resolveDistance = useCallback(() => {
    const container = containerRef.current;
    const firstCard = refs[0]?.current;
    if (!container || !firstCard || refs.length < 2) return cardDistance;

    const available = Math.max(container.clientWidth - firstCard.offsetWidth, 0);
    return Math.min(cardDistance, available / (refs.length - 1));
  }, [cardDistance, refs]);

  const positionCards = useCallback(() => {
    const distance = resolveDistance();
    orderRef.current.forEach((cardIndex, slotIndex) => {
      const card = refs[cardIndex]?.current;
      if (card) placeCard(card, makeSlot(slotIndex, distance, verticalDistance, refs.length));
    });
  }, [refs, resolveDistance, verticalDistance]);

  const promoteCard = useCallback((cardIndex, automatic = false) => {
    const currentOrder = orderRef.current;
    const currentFront = currentOrder[0];

    if (cardIndex === currentFront) {
      if (!automatic) onCardClick?.(cardIndex, true);
      return;
    }

    const selected = refs[cardIndex]?.current;
    if (!selected) return;

    timelineRef.current?.kill();
    const nextOrder = [cardIndex, ...currentOrder.filter((index) => index !== cardIndex)];
    const distance = resolveDistance();
    const timeline = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: () => {
        orderRef.current = nextOrder;
        setFrontIndex(cardIndex);
        if (!automatic) onCardClick?.(cardIndex, false);
      },
    });

    timelineRef.current = timeline;
    timeline.set(selected, { zIndex: refs.length + 2 });
    timeline.to(selected, { y: "-=34", z: 90, scale: 1.018, duration: 0.42 });

    nextOrder.slice(1).forEach((index, slotOffset) => {
      const card = refs[index]?.current;
      const slot = makeSlot(slotOffset + 1, distance, verticalDistance, refs.length);
      timeline.to(
        card,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          zIndex: slot.zIndex,
          scale: 1,
          duration: 1.05,
        },
        0.14 + slotOffset * 0.035,
      );
    });

    timeline.to(
      selected,
      {
        x: 0,
        y: 0,
        z: makeSlot(0, distance, verticalDistance, refs.length).z,
        scale: 1,
        zIndex: refs.length,
        duration: 1.12,
      },
      0.18,
    );
  }, [onCardClick, refs, resolveDistance, verticalDistance]);

  useLayoutEffect(() => {
    orderRef.current = Array.from({ length: refs.length }, (_, index) => index);
    setFrontIndex(0);
    positionCards();

    const resizeObserver = new ResizeObserver(positionCards);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      timelineRef.current?.kill();
    };
  }, [positionCards, refs.length]);

  useEffect(() => {
    if (!delay || refs.length < 2) return undefined;

    const start = () => {
      window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        const nextIndex = orderRef.current[1];
        promoteCard(nextIndex, true);
      }, delay);
    };
    const stop = () => window.clearInterval(intervalRef.current);
    const container = containerRef.current;

    start();
    if (pauseOnHover && container) {
      container.addEventListener("mouseenter", stop);
      container.addEventListener("mouseleave", start);
    }

    return () => {
      stop();
      if (container) {
        container.removeEventListener("mouseenter", stop);
        container.removeEventListener("mouseleave", start);
      }
    };
  }, [delay, pauseOnHover, promoteCard, refs.length]);

  return (
    <div ref={containerRef} className="card-swap-container" style={{ height }}>
      {childArray.map((child, index) => (
        isValidElement(child)
          ? cloneElement(child, {
            key: child.key ?? index,
            ref: (node) => {
              refs[index].current = node;
            },
            className: `${child.props.className ?? ""}${frontIndex === index ? " is-front" : ""}`.trim(),
            style: { width, height, ...(child.props.style ?? {}) },
            role: "button",
            tabIndex: 0,
            "aria-current": frontIndex === index ? "true" : undefined,
            onClick: (event) => {
              child.props.onClick?.(event);
              promoteCard(index);
            },
            onKeyDown: (event) => {
              child.props.onKeyDown?.(event);
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                promoteCard(index);
              }
            },
          })
          : child
      ))}
    </div>
  );
}
