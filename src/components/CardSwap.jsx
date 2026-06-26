import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useImperativeHandle,
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

const CardSwap = forwardRef(function CardSwap({
  width = 820,
  height = 520,
  cardDistance = 104,
  verticalDistance = 8,
  delay = 0,
  pauseOnHover = true,
  onCardClick,
  onActiveChange,
  children,
}, ref) {
  const childArray = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(() => childArray.map(() => ({ current: null })), [childArray.length]);
  const orderRef = useRef(Array.from({ length: childArray.length }, (_, index) => index));
  const timelineRef = useRef(null);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const pointerStartRef = useRef(null);
  const ignoreClickRef = useRef(false);
  const isAnimatingRef = useRef(false);
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

  const animateToOrder = useCallback((nextOrder, automatic = false, clickedIndex = null) => {
    if (isAnimatingRef.current) return;

    const selectedIndex = nextOrder[0];
    const selected = refs[selectedIndex]?.current;
    if (!selected) return;

    timelineRef.current?.kill();
    isAnimatingRef.current = true;
    const distance = resolveDistance();
    const timeline = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: () => {
        isAnimatingRef.current = false;
        orderRef.current = nextOrder;
        setFrontIndex(selectedIndex);
        onActiveChange?.(selectedIndex);
        if (!automatic && clickedIndex !== null) onCardClick?.(selectedIndex, false);
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
  }, [onActiveChange, onCardClick, refs, resolveDistance, verticalDistance]);

  const promoteCard = useCallback((cardIndex, automatic = false) => {
    const currentOrder = orderRef.current;
    const currentFront = currentOrder[0];

    if (cardIndex === currentFront) {
      if (!automatic) onCardClick?.(cardIndex, true);
      return;
    }

    animateToOrder(
      [cardIndex, ...currentOrder.filter((index) => index !== cardIndex)],
      automatic,
      automatic ? null : cardIndex,
    );
  }, [animateToOrder, onCardClick]);

  const rotateCards = useCallback((direction = 1, automatic = false) => {
    const currentOrder = orderRef.current;
    if (currentOrder.length < 2) return;

    const nextOrder = direction > 0
      ? [...currentOrder.slice(1), currentOrder[0]]
      : [currentOrder[currentOrder.length - 1], ...currentOrder.slice(0, -1)];

    animateToOrder(nextOrder, automatic);
  }, [animateToOrder]);

  const showNext = useCallback(() => {
    rotateCards(1);
  }, [rotateCards]);

  const showPrevious = useCallback(() => {
    rotateCards(-1);
  }, [rotateCards]);

  useImperativeHandle(ref, () => ({
    next: showNext,
    previous: showPrevious,
    goTo: (index) => {
      if (Number.isInteger(index) && index >= 0 && index < refs.length) promoteCard(index);
    },
  }), [promoteCard, refs.length, showNext, showPrevious]);

  useLayoutEffect(() => {
    orderRef.current = Array.from({ length: refs.length }, (_, index) => index);
    setFrontIndex(0);
    onActiveChange?.(0);
    positionCards();

    const resizeObserver = new ResizeObserver(positionCards);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      isAnimatingRef.current = false;
      timelineRef.current?.kill();
    };
  }, [onActiveChange, positionCards, refs.length]);

  useEffect(() => {
    if (!delay || refs.length < 2) return undefined;

    const start = () => {
      window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        rotateCards(1, true);
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
  }, [delay, pauseOnHover, refs.length, rotateCards]);

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse") return;
    pointerStartRef.current = {
      id: event.pointerId,
      type: event.pointerType,
      x: event.clientX,
      y: event.clientY,
    };
    ignoreClickRef.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    const start = pointerStartRef.current;
    if (!start || start.id !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    pointerStartRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (Math.abs(deltaX) > 46 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) {
      ignoreClickRef.current = true;
      if (deltaX < 0) showNext();
      else showPrevious();
      window.setTimeout(() => {
        ignoreClickRef.current = false;
      }, 180);
    }
  };

  const resolveCardFromPoint = (x, y) => {
    const order = orderRef.current;
    const frontCard = refs[order[0]]?.current;
    const frontRect = frontCard?.getBoundingClientRect();
    const hits = order
      .map((cardIndex) => {
        const card = refs[cardIndex]?.current;
        if (!card) return null;
        const rect = card.getBoundingClientRect();
        const contains = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        return contains ? { cardIndex, rect } : null;
      })
      .filter(Boolean);

    if (!hits.length) return null;
    if (
      frontRect
      && x >= frontRect.left
      && x <= frontRect.right - Math.max(resolveDistance() * 0.5, 36)
      && y >= frontRect.top
      && y <= frontRect.bottom
    ) {
      return order[0];
    }

    return hits.reduce((selected, hit) => (
      hit.rect.left > selected.rect.left ? hit : selected
    ), hits[0]).cardIndex;
  };

  const handleClickCapture = (event) => {
    if (ignoreClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const cardIndex = resolveCardFromPoint(event.clientX, event.clientY);
    if (cardIndex === null) return;

    event.preventDefault();
    event.stopPropagation();
    promoteCard(cardIndex);
  };

  return (
    <div
      ref={containerRef}
      className="card-swap-container"
      style={{ height }}
      onClickCapture={handleClickCapture}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartRef.current = null;
      }}
    >
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
            "data-swap-index": index,
            "aria-current": frontIndex === index ? "true" : undefined,
            onClick: (event) => {
              if (ignoreClickRef.current) {
                event.preventDefault();
                event.stopPropagation();
                return;
              }
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
});

export default CardSwap;
