import { forwardRef, useEffect, useRef, useState } from "react";
import BorderGlow from "./components/BorderGlow.jsx";
import CardSwap, { Card } from "./components/CardSwap.jsx";
import TiltedCard from "./components/TiltedCard.jsx";
import usePortfolioMotion from "./hooks/usePortfolioMotion.js";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\.\//, "")}`;

const navItems = [
  { label: "About", target: "about" },
  { label: "Projects", target: "projects" },
  { label: "Strengths", target: "strengths" },
  { label: "Contact", target: "contact" },
];

const projects = [
  {
    title: "Demo Reel",
    type: "AIGC / Motion / Direction",
    description: "AIGC 视觉作品与动态设计精选",
    cover: assetPath("assets/covers/project-demo-reel.jpg"),
    video: assetPath("assets/videos/demo-reel.mp4"),
  },
  {
    title: "《下一位》",
    type: "Original Animation / AIGC",
    description: "原创角色、世界观与电影化叙事探索",
    cover: assetPath("assets/covers/project-next-princess.jpg"),
    video: assetPath("assets/videos/next-princess.mp4"),
  },
  {
    title: "自在营养 TVC",
    type: "Commercial / Product Visual",
    description: "面向消费品牌的产品视觉与广告表达",
    cover: assetPath("assets/covers/project-nutrition-tvc.jpg"),
    video: assetPath("assets/videos/nutrition-tvc.mp4"),
  },
  {
    title: "漫剧特效案例",
    type: "Drama / Visual Effects",
    description: "围绕剧情节奏设计的动态特效与合成",
    cover: assetPath("assets/covers/project-drama-fx.jpg"),
    video: assetPath("assets/videos/drama-fx.mp4"),
  },
  {
    title: "游戏 CG 演示",
    type: "Character / Concept Look",
    description: "角色氛围、镜头语言与概念视觉实验",
    cover: assetPath("assets/covers/project-game-cg.jpg"),
    video: assetPath("assets/videos/game-cg.mp4"),
  },
  {
    title: "原创 IP 潮流盲盒",
    type: "IP Design / Product Concept",
    description: "从原创形象到产品展示的完整视觉概念",
    cover: assetPath("assets/covers/project-ip-blindbox.jpg"),
    video: assetPath("assets/videos/ip-blindbox.mp4"),
  },
  {
    title: "实景 AI 合成",
    type: "Live Action / AI Composite",
    description: "连接实拍素材与 AI 生成内容的合成实验",
    cover: assetPath("assets/covers/project-live-composite.jpg"),
    video: assetPath("assets/videos/live-composite.mp4"),
  },
];

const strengths = [
  {
    title: "视觉方向与审美判断",
    description: "从品牌语境出发拆解风格、色彩和镜头表达，让生成结果服务于清晰的视觉目标。",
    tools: "Visual Direction / Brand Tone",
  },
  {
    title: "成熟的动态制作经验",
    description: "多年动画、剪辑与合成经验，熟悉从脚本理解、节奏设计到成片交付的完整链路。",
    tools: "AE / Premiere / Motion Craft",
  },
  {
    title: "AI 视觉生产工作流",
    description: "将提示词、参考图、角色一致性和镜头控制组织成可迭代、可复用的项目流程。",
    tools: "Midjourney / Kling / Image2",
  },
  {
    title: "创意到落地的连接力",
    description: "理解项目目标与制作边界，在创意探索、效率和最终品质之间做有效判断。",
    tools: "Concept / Pipeline / Delivery",
  },
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
          <span className="brand-role">Visual & AI Designer</span>
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
  return (
    <section className="hero" id="hero" data-section="hero">
      <video
        className="hero-media"
        autoPlay
        loop
        muted
        playsInline
        poster={assetPath("assets/fallback/hero-poster.jpg")}
        src={assetPath("assets/hero-scroll.mp4")}
      />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-noise" aria-hidden="true" />

      <div className="shell hero-shell">
        <div className="hero-topline reveal">
          <span>Portfolio / 2026</span>
        </div>

        <div className="hero-copy reveal">
          <p className="hero-taxonomy">Visual Designer&nbsp;&nbsp; / &nbsp;&nbsp;AI Designer&nbsp;&nbsp; / &nbsp;&nbsp;Brand Designer</p>
          <div className="hero-title-mask">
            <h1>高煜翔</h1>
          </div>
          <p className="hero-summary">
            将传统后期、动画合成与 AIGC 工作流融合，为品牌、内容与原创 IP 构建具有叙事感的视觉表达。
          </p>
        </div>

        <a className="hero-project-link reveal" href="#projects" onClick={(event) => {
          event.preventDefault();
          scrollToSection("projects");
        }}>
          <span>查看精选项目</span>
          <i aria-hidden="true">↘</i>
        </a>

        <p className="hero-scroll" aria-hidden="true">Scroll to explore <span>↓</span></p>
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
            <h2 className="section-title">从后期制作<br />到 AI 视觉导演</h2>
          </div>
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
                <h3>以制作经验建立秩序，<br />以 AI 拓展视觉的边界。</h3>
                <p>
                  长期负责二维动画、AE 合成、剪辑包装、课程动画与商业定制短片，熟悉从脚本理解、视觉设计到成片输出的完整流程。
                </p>
                <p>
                  目前专注 AIGC 视觉内容生产，擅长将生成工具接入实际制作，通过提示词优化与可复用工作流提升效率，并结合成熟的后期能力完成最终交付。
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
                    <span className="detail-value">品牌视觉 / AIGC 影像 / 动态设计</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">寻求合作中</span>
                  </div>
                </div>

                <p className="about-summary">
                  多年动态内容制作经验，持续探索视觉设计、品牌表达与生成式 AI 之间更有效的连接方式。
                </p>
              </div>
            </div>
          </BorderGlow>
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
        <span className="project-open">Play project <i aria-hidden="true">↗</i></span>
      </div>
    </Card>
  );
});

ProjectSwapCard.displayName = "ProjectSwapCard";

function Projects({ onOpen }) {
  return (
    <section className="projects" id="projects" data-section="projects">
      <div className="shell">
        <div className="projects-head reveal">
          <div>
            <p className="section-kicker">Selected Work / 精选项目</p>
            <h2 className="section-title">Moving ideas<br />into images.</h2>
          </div>
          <p className="section-intro">横跨 AIGC 原创动画、品牌广告、游戏概念、IP 设计与实景合成。</p>
        </div>

        <div className="project-swap-stage reveal">
          <CardSwap
            width="clamp(290px, 62vw, 940px)"
            height="clamp(390px, 38vw, 590px)"
            cardDistance={112}
            verticalDistance={8}
            delay={0}
            onCardClick={(index, isFront) => {
              if (isFront) onOpen(projects[index]);
            }}
          >
            {projects.map((project, index) => (
              <ProjectSwapCard key={project.title} project={project} index={index} />
            ))}
          </CardSwap>
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
            <h2 className="section-title">不止生成画面，<br />更关心它为何成立。</h2>
          </div>
          <p className="section-intro">把 AI 当作视觉生产的一部分，用设计判断和制作经验控制最终结果。</p>
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
          <p className="contact-copy">如果你正在寻找一位同时理解传统制作流程与 AIGC 视觉生成的设计师，可以从一封邮件开始。</p>
          <div className="contact-primary-group">
            <a className="contact-primary contact-primary--email" href="mailto:gyxgcgyx@outlook.com">
              gyxgcgyx@outlook.com
            </a>
            <a className="contact-primary contact-primary--phone" href="tel:18519665717">
              +86 185 **** 5717
            </a>
          </div>
        </div>
        <div className="contact-footer">
          <span>高煜翔 / Visual & AI Designer</span>
          <span>© 2026 Portfolio</span>
        </div>
      </div>
    </footer>
  );
}

function VideoModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;
    document.body.classList.add("modal-open");
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <div
      className={`video-modal${project ? " is-open" : ""}`}
      aria-hidden={!project}
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
      </div>
    </div>
  );
}

function App() {
  const appRef = useRef(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

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
        <Projects onOpen={setSelectedProject} />
        <Strengths />
      </main>
      <Contact />
      <VideoModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

export default App;
