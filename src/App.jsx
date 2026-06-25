import { forwardRef, useEffect, useRef, useState } from "react";
import BorderGlow from "./components/BorderGlow.jsx";
import CardSwap, { Card } from "./components/CardSwap.jsx";
import TiltedCard from "./components/TiltedCard.jsx";
import usePortfolioMotion from "./hooks/usePortfolioMotion.js";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\.\//, "")}`;

const navItems = [
  { label: "About", target: "about" },
  { label: "Services", target: "services" },
  { label: "Work", target: "projects" },
  { label: "Strengths", target: "strengths" },
  { label: "Contact", target: "contact" },
];

const projects = [
  {
    title: "DEMO REEL",
    type: "AIGC / Motion / Direction",
    description: "汇总 AIGC 视觉生成、AE 合成、剪辑包装与商业视觉片段，展示从创意测试到成片输出的综合制作能力。",
    cover: assetPath("assets/covers/project-demo-reel.jpg"),
    video: assetPath("assets/videos/demo-reel.mp4"),
  },
  {
    title: "《下一位》",
    type: "Original Animation / AIGC",
    description: "使用 AIGC 完成角色、场景搭建与氛围镜头探索，并结合剪辑节奏与声音设计，完成原创动画短片概念表达。",
    cover: assetPath("assets/covers/project-next-princess.jpg"),
    video: assetPath("assets/videos/next-princess.mp4"),
  },
  {
    title: "自在营养 TVC",
    type: "Commercial / Product Visual",
    description: "面向消费品牌的产品广告案例，围绕产品卖点、视觉质感与商业传播需求完成镜头设计、剪辑包装与成片输出。",
    cover: assetPath("assets/covers/project-nutrition-tvc.jpg"),
    video: assetPath("assets/videos/nutrition-tvc.mp4"),
  },
  {
    title: "漫剧特效案例",
    type: "Drama / Visual Effects",
    description: "根据剧情节奏完成画面特效、镜头强化、动态元素与合成处理，提升漫剧内容的视觉冲击和观看节奏。",
    cover: assetPath("assets/covers/project-drama-fx.jpg"),
    video: assetPath("assets/videos/drama-fx.mp4"),
  },
  {
    title: "游戏 CG 演示",
    type: "Character / Concept Look",
    description: "基于角色设定与世界观方向进行概念视觉开发，完成角色氛围、镜头节奏与 CG 风格展示。",
    cover: assetPath("assets/covers/project-game-cg.jpg"),
    video: assetPath("assets/videos/game-cg.mp4"),
  },
  {
    title: "原创 IP 潮流盲盒",
    type: "IP Design / Product Concept",
    description: "从 IP 角色设定、产品概念到展示视频，探索 AIGC 在潮玩、盲盒和品牌衍生品视觉开发中的应用。",
    cover: assetPath("assets/covers/project-ip-blindbox.jpg"),
    video: assetPath("assets/videos/ip-blindbox.mp4"),
  },
  {
    title: "实景 AI 合成",
    type: "Live Action / AI Composite",
    description: "将实拍素材与 AI 生成元素结合，通过 AE 合成、调色、跟踪与镜头包装，完成更接近商业项目的混合影像效果。",
    cover: assetPath("assets/covers/project-live-composite.jpg"),
    video: assetPath("assets/videos/live-composite.mp4"),
  },
];

const services = [
  {
    title: "AIGC 产品广告",
    description: "适合护肤、美妆、食品、香氛、生活方式品牌，用 AI 生成产品场景和氛围镜头，并通过 AE / PR 完成商业广告成片。",
    tags: "产品广告 / 电商视频 / 小红书 / 抖音",
  },
  {
    title: "品牌短片 / 活动视觉",
    description: "适合品牌发布、展会、年会、音乐视觉、开场片等项目，提供视觉风格设定、镜头设计、合成包装与最终输出。",
    tags: "品牌短片 / 发布会 / 活动开场 / 视觉包装",
  },
  {
    title: "短视频包装 / 信息流素材",
    description: "适合抖音、小红书、视频号内容，提供广告短片、口播包装、字幕动效、卖点视觉化和多版本适配。",
    tags: "短视频 / 信息流广告 / 字幕包装 / 口播包装",
  },
  {
    title: "IP / 角色 / 概念视觉",
    description: "适合原创 IP、游戏概念、潮玩盲盒、动画项目前期视觉探索，提供角色氛围、场景风格和概念视频展示。",
    tags: "原创 IP / 角色视觉 / 游戏概念 / 潮玩视觉",
  },
];

const strengths = [
  {
    title: "传统后期制作能力",
    description: "熟悉 AE 合成、PR 剪辑、动效包装、字幕节奏、调色与成片输出，能够按照商业项目要求完成稳定交付。",
    tools: "AE / Premiere / Photoshop / Motion Design",
  },
  {
    title: "AIGC 视频生产能力",
    description: "能将 Midjourney、可灵、Runway、即梦等工具接入制作流程，用于概念探索、镜头生成、风格测试、产品视觉和素材扩展。",
    tools: "AIGC Workflow / Prompt / Image-to-Video",
  },
  {
    title: "商业视觉理解能力",
    description: "能从品牌调性、受众、卖点和传播场景出发设计画面，而不是只追求好看，让视觉服务于项目目标。",
    tools: "Brand Tone / Commercial Visual / Storytelling",
  },
  {
    title: "从创意到交付的完整流程",
    description: "具备从需求沟通、脚本理解、分镜规划、素材生成、剪辑合成到多平台输出的完整项目意识，适合团队协作与独立项目交付。",
    tools: "Brief / Pipeline / Delivery",
  },
];

const contactTags = [
  "全职岗位",
  "项目外包",
  "品牌商单",
  "AIGC 视频制作",
  "产品广告",
  "短视频包装",
  "远程协作",
];

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
}

function Header({ activeSection, scrolled }) {
  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="shell nav-shell">
        <a
          className="brand"
          href="#hero"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("hero");
          }}
        >
          <span className="brand-mark">GYX</span>
          <span className="brand-role">Motion / AIGC / Commercial Video</span>
        </a>

        <nav className="nav-links" aria-label="主导航">
          {navItems.map((item) => (
            <a
              className={activeSection === item.target ? "is-active" : ""}
              href={`#${item.target}`}
              key={item.target}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(item.target);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-contact" href="mailto:gyxgcgyx@outlook.com">
          联系合作
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const attemptPlay = () => {
      if (document.visibilityState === "hidden") return;
      video.play().catch(() => {});
    };

    const handleVisibility = () => attemptPlay();
    const playTimer = window.setTimeout(attemptPlay, 350);

    video.addEventListener("loadeddata", attemptPlay);
    video.addEventListener("canplay", attemptPlay);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("touchstart", attemptPlay, { once: true, passive: true });
    window.addEventListener("pointerdown", attemptPlay, { once: true, passive: true });
    attemptPlay();

    return () => {
      window.clearTimeout(playTimer);
      video.removeEventListener("loadeddata", attemptPlay);
      video.removeEventListener("canplay", attemptPlay);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <section className="hero" id="hero" data-section="hero">
      <video
        ref={videoRef}
        className="hero-media"
        autoPlay
        loop
        muted
        defaultMuted
        playsInline
        preload="auto"
        poster={assetPath("assets/fallback/hero-poster.jpg")}
      >
        <source src={assetPath("assets/hero-scroll-mobile.mp4")} media="(max-width: 760px)" type="video/mp4" />
        <source src={assetPath("assets/hero-scroll.mp4")} type="video/mp4" />
      </video>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-noise" aria-hidden="true" />

      <div className="shell hero-shell">
        <div className="hero-topline reveal">
          <span>Portfolio / 2026</span>
        </div>

        <div className="hero-copy reveal">
          <p className="hero-taxonomy">Motion Designer&nbsp;&nbsp; / &nbsp;&nbsp;AIGC Visual Designer&nbsp;&nbsp; / &nbsp;&nbsp;Commercial Visual Designer</p>
          <div className="hero-title-mask">
            <h1>高煜翔</h1>
          </div>
          <p className="hero-subtitle">动态视觉设计师 · AIGC 视频创作者</p>
          <p className="hero-summary">
            拥有多年 AE 合成、剪辑包装、二维动画与商业短片制作经验，现将 AIGC 融入视频生产流程，为品牌广告、产品视觉、IP 内容与短视频项目提供从创意、分镜、生成、合成到成片交付的完整视觉方案。
          </p>
        </div>

        <a className="hero-project-link reveal" href="#projects" onClick={(event) => {
          event.preventDefault();
          scrollToSection("projects");
        }}>
          <span>查看作品</span>
          <i className="icon-arrow icon-arrow--down" aria-hidden="true" />
        </a>

        <p className="hero-scroll" aria-hidden="true">Scroll to explore <span className="down-arrow" /></p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about" id="about" data-section="about">
      <div className="shell">
        <div className="about-heading reveal">
          <div>
            <p className="section-kicker">About / 个人经历</p>
            <h2 className="section-title">从传统后期制作，<br />到 AIGC 商业影像创作</h2>
          </div>
          <p className="section-intro">用成熟的制作经验控制质量，用 AI 工具提升视觉探索与内容生产效率。</p>
        </div>

        <div className="about-layout">
          <TiltedCard
            className="about-glow about-profile-tilt reveal"
            rotateAmplitude={4}
            scaleOnHover={1.008}
          >
            <BorderGlow
              className="about-profile-glow"
              animated
              edgeSensitivity={9}
              glowColor="22 100 58"
              glowRadius={52}
              glowIntensity={1.45}
              coneSpread={34}
              fillOpacity={0.34}
            >
              <div className="identity-panel">
                <img
                  className="identity-portrait"
                  src={assetPath("assets/profile/gyx-character-card.png")}
                  alt="高煜翔 GYX 角色人物卡"
                />
              </div>
            </BorderGlow>
          </TiltedCard>

          <BorderGlow className="about-glow about-copy-glow reveal" animated>
            <div className="about-copy">
              <div className="about-story">
                <h3>AE 动态设计师 · AIGC 视频创作者</h3>
                <p>
                  长期参与二维动画、AE 合成、剪辑包装、课程动画、商业定制短片等项目，熟悉从脚本理解、画面设计、节奏剪辑、动效包装到最终输出的完整流程。
                </p>
                <p>
                  目前我将 AIGC 工具接入传统后期流程，用于概念视觉、产品镜头、角色氛围、场景生成和视频素材扩展，并通过 AE / PR 完成合成、包装、节奏与商业交付。
                </p>
                <p>
                  我希望寻找与动态设计、视频后期、AIGC 视觉、品牌广告内容相关的工作机会，也开放品牌短片、产品广告、IP 视觉、短视频包装等商业合作。
                </p>
              </div>

              <div>
                <div className="about-details">
                  <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <a className="detail-value" href="mailto:gyxgcgyx@outlook.com">gyxgcgyx@outlook.com</a>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone</span>
                    <a className="detail-value" href="tel:18519665717">185 **** 5717</a>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Focus</span>
                    <span className="detail-value">AE 动效包装 / AIGC 视频制作 / 商业短片 / 产品广告</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Open To</span>
                    <span className="detail-value">全职机会 / 项目合作 / 品牌商单 / 远程协作</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Tools</span>
                    <span className="detail-value">After Effects / Premiere Pro / Photoshop / Midjourney / Kling / Runway / 即梦 / 可灵</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Experience</span>
                    <span className="detail-value">后期制作 / 动画合成 / 剪辑包装 / 商业视频交付</span>
                  </div>
                </div>
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="services" id="services" data-section="services">
      <div className="shell">
        <div className="services-head reveal">
          <div>
            <p className="section-kicker">Services / 可合作方向</p>
            <h2 className="section-title">从 AIGC 视觉生成，<br />到 AE / PR 成片包装。</h2>
          </div>
          <p className="section-intro">面向品牌、电商、内容团队与创意项目，提供从 AIGC 视觉生成到 AE / PR 成片包装的商业视频制作服务。</p>
        </div>

        <div className="service-grid reveal">
          {services.map((item, index) => (
            <article className="service-card" key={item.title}>
              <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="service-tags">{item.tags}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const ProjectSwapCard = forwardRef(({ project, index, ...cardProps }, cardRef) => {
  const previewRef = useRef(null);

  const startPreview = () => {
    if (!previewRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    previewRef.current.play().catch(() => {});
  };

  const stopPreview = () => {
    if (!previewRef.current) return;
    previewRef.current.pause();
    previewRef.current.currentTime = 0;
  };

  return (
    <Card
      ref={cardRef}
      customClass="project-swap-card"
      aria-label={`${project.title} 项目`}
      {...cardProps}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      <div className="project-card-bar">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{project.type}</span>
      </div>
      <div className="project-media">
        <img src={project.cover} alt={`${project.title} 项目封面`} />
        <video ref={previewRef} src={project.video} muted loop playsInline preload="none" aria-hidden="true" />
      </div>
      <div className="project-info">
        <div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
        <span className="project-open">Play project <i className="icon-arrow icon-arrow--up" aria-hidden="true" /></span>
      </div>
    </Card>
  );
});

ProjectSwapCard.displayName = "ProjectSwapCard";

function Projects({ onOpen }) {
  const swapRef = useRef(null);
  const [activeProject, setActiveProject] = useState(0);

  return (
    <section className="projects" id="projects" data-section="projects">
      <div className="shell">
        <div className="projects-head reveal">
          <div>
            <p className="section-kicker">Selected Work / 商业与 AIGC 视频案例</p>
            <h2 className="section-title">商业与 AIGC<br />视频案例</h2>
          </div>
          <p className="section-intro">覆盖品牌广告、产品视觉、原创动画、IP 概念、实景合成与动态包装，展示从 AI 生成到成片交付的完整能力。</p>
        </div>

        <div className="project-swap-stage reveal">
          <CardSwap
            ref={swapRef}
            width="clamp(290px, 62vw, 940px)"
            height="clamp(390px, 38vw, 590px)"
            cardDistance={112}
            verticalDistance={8}
            delay={0}
            onActiveChange={setActiveProject}
            onCardClick={(index, isFront) => {
              if (isFront) onOpen(index);
            }}
          >
            {projects.map((project, index) => (
              <ProjectSwapCard key={project.title} project={project} index={index} />
            ))}
          </CardSwap>

          <div className="project-carousel-controls" aria-label="项目切换">
            <button type="button" aria-label="上一个项目" onClick={() => swapRef.current?.previous()}>
              <span className="carousel-arrow carousel-arrow--prev" aria-hidden="true" />
            </button>
            <div className="project-carousel-count" aria-live="polite">
              <span>{String(activeProject + 1).padStart(2, "0")}</span>
              <span>/</span>
              <span>{String(projects.length).padStart(2, "0")}</span>
            </div>
            <button type="button" aria-label="下一个项目" onClick={() => swapRef.current?.next()}>
              <span className="carousel-arrow carousel-arrow--next" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section className="advantages" id="strengths" data-section="strengths">
      <div className="shell">
        <div className="advantages-head reveal">
          <div>
            <p className="section-kicker">Strengths / 个人优势</p>
            <h2 className="section-title">不止生成画面，<br />更关心它如何成为可交付的商业成片。</h2>
          </div>
          <p className="section-intro">把 AI 当作视觉生产的一部分，用设计判断、后期经验和商业意识控制最终结果。</p>
        </div>

        <div className="advantage-grid reveal">
          {strengths.map((item) => (
            <article className="advantage-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="advantage-tools">{item.tools}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer className="contact" id="contact" data-section="contact">
      <div className="shell contact-shell reveal">
        <p className="section-kicker">Contact / 联系合作</p>
        <h2 className="contact-title">Let’s create<br />what’s next.</h2>
        <div className="contact-action">
          <div>
            <p className="contact-copy">正在寻找视频设计师、AE 动效师、AIGC 视觉创作者，或需要品牌广告、产品短片、IP 视觉、短视频包装等项目合作，欢迎联系我。</p>
            <div className="contact-tags">
              {contactTags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
          <div className="contact-panel">
            <div className="contact-primary-group">
              <a className="contact-primary contact-primary--email" href="mailto:gyxgcgyx@outlook.com">
                gyxgcgyx@outlook.com
              </a>
              <a className="contact-primary contact-primary--phone" href="tel:18519665717">
                +86 185 **** 5717
              </a>
            </div>
            <div className="contact-buttons">
              <a className="contact-button contact-button--primary" href="mailto:gyxgcgyx@outlook.com">发送邮件</a>
              <a className="contact-button" href="#projects" onClick={(event) => {
                event.preventDefault();
                scrollToSection("projects");
              }}>查看作品集</a>
            </div>
          </div>
        </div>
        <div className="contact-footer">
          <span>高煜翔 / AE Motion Designer · AIGC Video Creator</span>
          <span>© 2026 Portfolio</span>
        </div>
      </div>
    </footer>
  );
}

function VideoModal({ projectIndex, onClose, onNavigate }) {
  const project = Number.isInteger(projectIndex) ? projects[projectIndex] : null;
  const touchStartRef = useRef(null);

  useEffect(() => {
    if (!project) return undefined;
    document.body.classList.add("modal-open");
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate(-1);
      if (event.key === "ArrowRight") onNavigate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNavigate, project]);

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > 52 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) {
      onNavigate(deltaX < 0 ? 1 : -1);
    }
  };

  return (
    <div
      className={`video-modal${project ? " is-open" : ""}`}
      aria-hidden={!project}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog" role="dialog" aria-modal="true" aria-label={project?.title || "项目视频"}>
        <div className="modal-bar">
          <span className="modal-title">{project?.title}</span>
          <button className="modal-close" type="button" aria-label="关闭视频" onClick={onClose}>×</button>
        </div>
        {project && <video className="modal-video" src={project.video} controls autoPlay playsInline />}
        {project && (
          <div className="modal-project-controls" aria-label="切换项目视频">
            <button type="button" aria-label="上一个项目视频" onClick={() => onNavigate(-1)}>
              <span className="carousel-arrow carousel-arrow--prev" aria-hidden="true" />
            </button>
            <span>{String(projectIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
            <button type="button" aria-label="下一个项目视频" onClick={() => onNavigate(1)}>
              <span className="carousel-arrow carousel-arrow--next" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const appRef = useRef(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);

  usePortfolioMotion(appRef);

  useEffect(() => {
    const updateScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 30);
      setProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.dataset.section);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    document.querySelectorAll("[data-section]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={appRef} className="site-root">
      <div className="opening-screen" aria-hidden="true">
        <div className="opening-panel opening-panel--top" />
        <div className="opening-panel opening-panel--bottom" />
        <span className="opening-line">
          <span className="opening-line-half opening-line-half--left" />
          <span className="opening-line-half opening-line-half--right" />
        </span>
      </div>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <Header activeSection={activeSection} scrolled={scrolled} />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects onOpen={setSelectedProjectIndex} />
        <Strengths />
      </main>
      <Contact />
      <VideoModal
        projectIndex={selectedProjectIndex}
        onClose={() => setSelectedProjectIndex(null)}
        onNavigate={(direction) => {
          setSelectedProjectIndex((current) => {
            if (!Number.isInteger(current)) return current;
            return (current + direction + projects.length) % projects.length;
          });
        }}
      />
    </div>
  );
}

export default App;
