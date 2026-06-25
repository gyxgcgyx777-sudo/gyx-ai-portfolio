import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const smoothEase = "power4.out";

export default function usePortfolioMotion(scopeRef) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = document.body;

    if (prefersReducedMotion) {
      gsap.set(scope.querySelector(".opening-screen"), { display: "none" });
      return undefined;
    }

    body.classList.add("is-opening");
    ScrollTrigger.config({ limitCallbacks: true });

    const context = gsap.context(() => {
      const openingTimeline = gsap.timeline({
        defaults: { ease: smoothEase },
        onComplete: () => {
          body.classList.remove("is-opening");
          gsap.set(".opening-screen", { display: "none" });
          ScrollTrigger.refresh();
        },
      });

      gsap.set(".opening-line-half", { scaleX: 0, autoAlpha: 1 });
      gsap.set(".opening-line-half--left", { transformOrigin: "right center" });
      gsap.set(".opening-line-half--right", { transformOrigin: "left center" });
      gsap.set(".hero-media", { scale: 1.13, transformOrigin: "center" });
      gsap.set(".hero-title-mask h1", { yPercent: 118, scaleX: 0.68, transformOrigin: "left center" });
      gsap.set([
        ".site-header",
        ".hero-topline",
        ".hero-taxonomy",
        ".hero-subtitle",
        ".hero-summary",
        ".hero-project-link",
        ".hero-scroll",
      ], { autoAlpha: 0 });
      gsap.set([".hero-taxonomy", ".hero-subtitle", ".hero-summary", ".hero-project-link", ".hero-scroll"], { y: 34 });

      openingTimeline
        .to(".opening-line-half", { scaleX: 1, duration: 0.9, ease: "power3.inOut" })
        .to(
          ".opening-line-half--left",
          { scaleX: 0, transformOrigin: "left center", duration: 0.82, ease: "power3.inOut" },
          1.04,
        )
        .to(
          ".opening-line-half--right",
          { scaleX: 0, transformOrigin: "right center", duration: 0.82, ease: "power3.inOut" },
          1.04,
        )
        .to(".opening-panel--top", { yPercent: -102, duration: 1.5, ease: "power4.inOut" }, 1.04)
        .to(".opening-panel--bottom", { yPercent: 102, duration: 1.5, ease: "power4.inOut" }, 1.04)
        .to(".hero-media", { scale: 1, duration: 2.7, ease: "power3.out" }, 1.04)
        .to(".hero-title-mask h1", { yPercent: 0, scaleX: 1, duration: 1.7, ease: "expo.out" }, 1.34)
        .to(".hero-taxonomy", { autoAlpha: 1, y: 0, duration: 1.15 }, 1.67)
        .to(".hero-subtitle", { autoAlpha: 1, y: 0, duration: 1.15 }, 1.76)
        .to(".hero-summary", { autoAlpha: 1, y: 0, duration: 1.2 }, 1.92)
        .to(".hero-project-link", { autoAlpha: 1, y: 0, duration: 1.2 }, 2.08)
        .to(".hero-scroll", { autoAlpha: 1, y: 0, duration: 1 }, 2.2)
        .to([".site-header", ".hero-topline"], { autoAlpha: 1, duration: 1.1 }, 1.9)
        .to(".opening-screen", { autoAlpha: 0, duration: 0.3 }, 2.5);

      gsap.utils.toArray(".about-heading, .services-head, .projects-head, .advantages-head").forEach((heading) => {
        const kicker = heading.querySelector(".section-kicker");
        const title = heading.querySelector(".section-title");
        const intro = heading.querySelector(".section-intro");
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heading,
            start: "top 82%",
            once: true,
          },
        });

        if (kicker) timeline.from(kicker, { x: -72, autoAlpha: 0, duration: 1.15, ease: smoothEase });
        if (title) {
          timeline.from(title, {
            y: 120,
            scaleX: 0.82,
            autoAlpha: 0,
            clipPath: "inset(0 0 100% 0)",
            transformOrigin: "left bottom",
            duration: 1.65,
            ease: "expo.out",
          }, 0.1);
        }
        if (intro) timeline.from(intro, { y: 54, autoAlpha: 0, duration: 1.2, ease: smoothEase }, 0.62);
      });

      const aboutTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-layout",
          start: "top 80%",
          once: true,
        },
      });

      aboutTimeline
        .from(".about-glow", {
          y: 130,
          scale: 0.95,
          autoAlpha: 0,
          stagger: 0.22,
          duration: 1.55,
          ease: "power4.out",
        })
        .from(".identity-portrait", {
          scale: 1.06,
          clipPath: "inset(100% 0 0 0)",
          duration: 1.65,
          ease: "power4.inOut",
        }, 0.16)
        .from(".about-story > *", {
          y: 52,
          autoAlpha: 0,
          stagger: 0.14,
          duration: 1.05,
          ease: smoothEase,
        }, 0.48)
        .from(".detail-row", {
          x: 48,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.95,
          ease: smoothEase,
        }, 0.72)
        .from(".about-summary", { y: 42, autoAlpha: 0, duration: 1.1, ease: smoothEase }, 0.98);

      gsap.from(".service-card", {
        y: 120,
        autoAlpha: 0,
        stagger: 0.14,
        duration: 1.35,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".service-grid",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".project-swap-stage", {
        y: 120,
        autoAlpha: 0,
        clipPath: "inset(16% 0 10% 0)",
        duration: 1.65,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".project-swap-stage",
          start: "top 84%",
          once: true,
        },
      });

      gsap.from(".advantage-card", {
        y: 130,
        autoAlpha: 0,
        stagger: 0.16,
        duration: 1.45,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".advantage-grid",
          start: "top 82%",
          once: true,
        },
      });

      const contactTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".contact",
          start: "top 72%",
          once: true,
        },
      });

      contactTimeline
        .from(".contact .section-kicker", { x: -70, autoAlpha: 0, duration: 1.1, ease: smoothEase })
        .from(".contact-title", {
          y: 140,
          scaleX: 0.78,
          autoAlpha: 0,
          clipPath: "inset(0 0 100% 0)",
          transformOrigin: "left bottom",
          duration: 1.75,
          ease: "expo.out",
        }, 0.12)
        .from(".contact-action > *", { y: 70, autoAlpha: 0, stagger: 0.18, duration: 1.25, ease: smoothEase }, 0.72)
        .from(".contact-footer > *", { y: 28, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: smoothEase }, 1.02);
    }, scope);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    const refreshFrame = requestAnimationFrame(refresh);

    return () => {
      cancelAnimationFrame(refreshFrame);
      window.removeEventListener("load", refresh);
      body.classList.remove("is-opening");
      context.revert();
    };
  }, [scopeRef]);
}
