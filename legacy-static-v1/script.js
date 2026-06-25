(() => {
  const BACKGROUND_VIDEO_SRC = "./assets/hero-scroll.mp4";
  const START_TIME = 0.2;
  let END_TIME = 14.7;

  const body = document.body;
  const video = document.querySelector("#background-video");
  const finalFrame = document.querySelector("#final-frame");
  const progressBar = document.querySelector("#scroll-progress");
  const autoButton = document.querySelector("#autoplay-toggle");
  const autoLabel = autoButton.querySelector(".toggle-label");
  const modal = document.querySelector("#project-modal");
  const modalVideo = document.querySelector("#modal-video");
  const modalClose = document.querySelector("#modal-close");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let lenis = null;
  let isAutoPlaying = false;
  let autoFrame = 0;
  let lastAutoTime = 0;
  let hoverPreview = null;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

  function updateVideo(progress) {
    const safeProgress = clamp(progress);
    const targetTime = START_TIME + safeProgress * (END_TIME - START_TIME);

    if (Number.isFinite(targetTime) && video.readyState >= 1 && Math.abs(video.currentTime - targetTime) > 0.035) {
      try {
        video.currentTime = targetTime;
      } catch (error) {
        body.classList.add("video-failed");
      }
    }

    progressBar.style.height = `${safeProgress * 100}%`;
    body.classList.toggle("at-end", safeProgress > 0.985);
  }

  function nativeScrollProgress() {
    return clamp(window.scrollY / maxScroll());
  }

  function setupVideo() {
    video.src = BACKGROUND_VIDEO_SRC;
    video.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(video.duration) && video.duration > 2) {
        END_TIME = Math.max(START_TIME + 1, video.duration - 0.35);
      }
      video.currentTime = START_TIME;
      body.classList.add("video-ready");
      updateVideo(nativeScrollProgress());
    });

    video.addEventListener("error", () => {
      body.classList.add("video-failed");
      finalFrame.style.opacity = "1";
    });

    video.load();
  }

  function setupSmoothScroll() {
    if (!window.Lenis || prefersReducedMotion) {
      window.addEventListener("scroll", () => updateVideo(nativeScrollProgress()), { passive: true });
      return;
    }

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.86,
      touchMultiplier: 1.12
    });

    if (window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    if (window.gsap) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  function setupAnimations() {
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) {
      document.querySelectorAll(".reveal").forEach((item) => {
        item.style.opacity = "1";
        item.style.filter = "none";
        item.style.transform = "none";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => updateVideo(self.progress)
    });

    gsap.utils.toArray(".reveal").forEach((item) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 82%",
          end: "top 48%",
          scrub: 0.8
        }
      });
    });
  }

  function setScrollTop(value) {
    if (lenis) {
      lenis.scrollTo(value, { immediate: true });
    } else {
      window.scrollTo(0, value);
    }
    updateVideo(clamp(value / maxScroll()));
  }

  function stopAutoPlay() {
    if (!isAutoPlaying) return;
    isAutoPlaying = false;
    cancelAnimationFrame(autoFrame);
    autoFrame = 0;
    lastAutoTime = 0;
    autoButton.classList.remove("is-playing");
    autoButton.setAttribute("aria-pressed", "false");
    autoLabel.textContent = "Auto Play";
  }

  function autoStep(timestamp) {
    if (!isAutoPlaying) return;

    if (!lastAutoTime) lastAutoTime = timestamp;
    const delta = timestamp - lastAutoTime;
    lastAutoTime = timestamp;

    const end = maxScroll();
    const speed = Math.max(52, Math.min(96, window.innerHeight * 0.085));
    const next = Math.min(end, window.scrollY + delta * speed / 1000);
    setScrollTop(next);

    if (next >= end - 2) {
      stopAutoPlay();
      setScrollTop(end);
      return;
    }

    autoFrame = requestAnimationFrame(autoStep);
  }

  function startAutoPlay() {
    if (prefersReducedMotion) return;
    isAutoPlaying = true;
    autoButton.classList.add("is-playing");
    autoButton.setAttribute("aria-pressed", "true");
    autoLabel.textContent = "Pause";
    autoFrame = requestAnimationFrame(autoStep);
  }

  function setupAutoPlay() {
    autoButton.addEventListener("click", () => {
      if (isAutoPlaying) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });

    ["wheel", "touchstart"].forEach((eventName) => {
      window.addEventListener(eventName, () => stopAutoPlay(), { passive: true });
    });

    window.addEventListener("keydown", (event) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        stopAutoPlay();
      }
    });
  }

  function setupProjectPreviews() {
    document.querySelectorAll(".project-card").forEach((card) => {
      const src = card.dataset.video;

      card.addEventListener("mouseenter", () => {
        if (window.innerWidth < 900 || prefersReducedMotion) return;
        if (!hoverPreview) {
          hoverPreview = document.createElement("video");
          hoverPreview.className = "hover-video";
          hoverPreview.muted = true;
          hoverPreview.loop = true;
          hoverPreview.playsInline = true;
          hoverPreview.preload = "metadata";
        }

        if (hoverPreview.parentElement !== card) {
          hoverPreview.pause();
          hoverPreview.remove();
          card.appendChild(hoverPreview);
        }

        card.classList.add("previewing");
        hoverPreview.src = src;
        hoverPreview.currentTime = 1.2;
        hoverPreview.play().catch(() => {
          card.classList.remove("previewing");
        });
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("previewing");
        if (hoverPreview) hoverPreview.pause();
      });

      card.addEventListener("click", () => {
        stopAutoPlay();
        modalVideo.src = src;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        modalVideo.play().catch(() => {});
      });
    });
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
  }

  function setupModal() {
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  function setupAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        stopAutoPlay();
        const top = target.getBoundingClientRect().top + window.scrollY;
        if (lenis) {
          lenis.scrollTo(top);
        } else {
          window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
        }
      });
    });
  }

  setupVideo();
  setupSmoothScroll();
  setupAnimations();
  setupAutoPlay();
  setupProjectPreviews();
  setupModal();
  setupAnchorLinks();
  updateVideo(nativeScrollProgress());
})();
