const NOTE_URL = document.body.dataset.noteUrl || "#note";
document.documentElement.classList.add("js");

// Set this to true while checking the intro on every refresh.
// Keep false for production so sessionStorage skips it after the first view.
const FORCE_INTRO_EVERY_LOAD = false;
const INTRO_SESSION_KEY = "meisaWorldIntroSeen";

document.querySelectorAll("[data-note-link]").forEach((link) => {
  link.setAttribute("href", NOTE_URL);
});

const THEME_ICONS = {
  chat: `
    <path d="M7 16.5 4.8 19v-4.2A7.3 7.3 0 0 1 4 11.4C4 7.3 7.8 4 12.5 4S21 7.3 21 11.4s-3.8 7.4-8.5 7.4a9.8 9.8 0 0 1-5.5-1.7Z"/>
    <path d="m16.8 3.6.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5.5-1.4Z"/>
  `,
  image: `
    <rect x="4" y="6" width="16" height="12" rx="2"/>
    <path d="m7 15 3.4-3.6 3.1 3.1 1.7-1.8L18 15.8"/>
    <circle cx="15.8" cy="9.4" r="1.1"/>
    <path d="m19.5 3.7.4 1.2 1.2.4-1.2.4-.4 1.2-.4-1.2-1.2-.4 1.2-.4.4-1.2Z"/>
  `,
  grid: `
    <rect x="4" y="5" width="16" height="14" rx="2"/>
    <path d="M9.4 5v14M14.6 5v14M4 10.2h16M4 14.8h16"/>
  `,
  page: `
    <path d="M8 3.8h6.8L19 8v12.2H8z"/>
    <path d="M14.8 3.8V8H19M10.8 11h5.4M10.8 14.4h5.4M10.8 17.8h3.6"/>
  `,
  post: `
    <rect x="5" y="5" width="14" height="14" rx="2"/>
    <path d="M8 9h8M8 12h5M8 15h8"/>
    <circle cx="15.7" cy="12" r=".9"/>
  `,
  logo: `
    <path d="M12 4.5 15 9l5 .8-3.6 3.5.8 5-5.2-2.4-5.2 2.4.8-5L4 9.8 9 9z"/>
    <circle cx="12" cy="12" r="2.2"/>
  `,
  card: `
    <rect x="4.5" y="8" width="11.5" height="7.5" rx="1.4"/>
    <rect x="8" y="10.5" width="11.5" height="7.5" rx="1.4"/>
    <path d="M10.4 13.2h5M10.4 15.3h3.4"/>
  `,
  world: `
    <path d="M5 16.8c3.8-1.7 6.2-1.7 10 0 1.4-3 1.4-6.5 0-9.5-3.8 1.7-6.2 1.7-10 0-1.4 3-1.4 6.5 0 9.5Z"/>
    <path d="M9.2 7.8c.8 1.3.8 5.1 0 6.4M10.8 12h6.6M18 6.8l.4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4.4-1.1Z"/>
  `,
  sprout: `
    <path d="M12 19V9.8"/>
    <path d="M12 12.5c-3.4-.4-5.4-2-6-5 3.4.3 5.5 1.9 6 5Z"/>
    <path d="M12 10.8c2.9-.2 4.8-1.7 5.6-4.4-2.9.2-4.8 1.7-5.6 4.4Z"/>
    <path d="M9 19h6"/>
  `,
  map: `
    <path d="M8.3 5.2 4 7.1v12l4.3-1.9 7.4 1.9L20 17.2v-12l-4.3 1.9z"/>
    <path d="M8.3 5.2v12M15.7 7.1v12"/>
    <circle cx="13.2" cy="11.6" r="2.2"/>
    <path d="m14.8 13.2 2.3 2.3"/>
  `,
  menu: `
    <rect x="5" y="4.8" width="14" height="14.4" rx="2"/>
    <path d="M8.2 9h7.6M8.2 12h7.6M8.2 15h4.8"/>
    <path d="M7.6 8.8h.1M7.6 11.8h.1M7.6 14.8h.1"/>
  `
};

const THEMES = [
  { label: "ChatGPT活用", icon: "chat" },
  { label: "画像生成AI", icon: "image" },
  { label: "Canva制作", icon: "grid" },
  { label: "LP制作", icon: "page" },
  { label: "投稿画像制作", icon: "post" },
  { label: "ロゴ制作", icon: "logo" },
  { label: "名刺制作", icon: "card" },
  { label: "世界観設計", icon: "world" },
  { label: "初案件づくり", icon: "sprout" },
  { label: "オフライン需要の見つけ方", icon: "map" },
  { label: "小さな制作メニュー設計", icon: "menu" }
];

const themeGrid = document.querySelector("[data-theme-grid]");
if (themeGrid) {
  themeGrid.innerHTML = THEMES.map(({ label, icon }, index) => `
    <article class="theme-card reveal" style="--reveal-delay: ${index * 70}ms;">
      <span class="theme-card__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          ${THEME_ICONS[icon]}
        </svg>
      </span>
      <h3>${label}</h3>
    </article>
  `).join("");
}

const CONCEPT_ICONS = {
  useful: `
    <path d="M8.2 13.2 11 16c.9.9 2.3.9 3.2 0l4.5-4.5a2.2 2.2 0 0 0-3.1-3.1l-3 3"/>
    <path d="M8.8 13.8 7 12a2.2 2.2 0 0 0-3.1 3.1l3.3 3.3c1.6 1.6 4.2 1.6 5.8 0"/>
    <path d="m18 3.8.4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4.4-1.1Z"/>
  `,
  demand: `
    <circle cx="10.8" cy="10.8" r="4.3"/>
    <path d="m14 14 4.2 4.2"/>
    <path d="M5.2 18.4c1.5-1.3 3.3-1.9 5.4-1.9 1.2 0 2.3.2 3.3.6"/>
    <path d="M18.2 5.4c.9.9 1.4 2.1 1.4 3.4"/>
  `,
  consult: `
    <path d="M6.8 14.5 4.8 17v-3.9A5.1 5.1 0 0 1 4 10.4C4 7.4 6.7 5 10.1 5s6.1 2.4 6.1 5.4-2.7 5.4-6.1 5.4a7 7 0 0 1-3.3-.8Z"/>
    <path d="M14 14.8c.8.3 1.7.4 2.6.4.5 0 1-.1 1.5-.2l1.1 1.5v-2.4A4.5 4.5 0 0 0 20 11.7c0-1.5-.8-2.9-2.1-3.7"/>
  `,
  menu: `
    <rect x="6" y="4.8" width="12" height="14.4" rx="2"/>
    <path d="M9 9h6M9 12h6M9 15h3.6"/>
    <path d="M7.8 8.9h.1M7.8 11.9h.1M7.8 14.9h.1"/>
  `,
  start: `
    <path d="M12 19V9.8"/>
    <path d="M12 12.5c-3.2-.3-5.2-1.9-5.8-4.8 3.2.3 5.2 1.9 5.8 4.8Z"/>
    <path d="M12 10.7c2.8-.2 4.6-1.6 5.4-4.2-2.8.2-4.6 1.6-5.4 4.2Z"/>
    <path d="M8.5 19h7"/>
  `
};

const CONCEPT_TAGS = [
  { label: "できることを、役に立つことへ", icon: "useful" },
  { label: "フォロワーの外にある需要", icon: "demand" },
  { label: "売り込みではなく、相談から始める", icon: "consult" },
  { label: "小さな制作メニュー", icon: "menu" },
  { label: "実績0でも動ける設計", icon: "start" }
];

const conceptTags = document.querySelector("[data-concept-tags]");
if (conceptTags) {
  conceptTags.innerHTML = CONCEPT_TAGS.map(({ label, icon }, index) => `
    <span class="themeTag themeTag--${icon}" style="--reveal-delay: ${index * 55}ms;">
      <span class="themeIcon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          ${CONCEPT_ICONS[icon]}
        </svg>
      </span>
      <span>${label}</span>
    </span>
  `).join("");
}

const QUESTION_ICONS = {
  menu: `
    <rect x="6" y="4.8" width="12" height="14.4" rx="2"/>
    <path d="M9 9h6M9 12h5M9 15h3.4"/>
    <path d="M7.8 8.9h.1M7.8 11.9h.1M7.8 14.9h.1"/>
  `,
  voice: `
    <path d="M7.2 14.6 5 17v-4.1A5.4 5.4 0 0 1 4.2 10c0-3 2.8-5.4 6.4-5.4S17 7 17 10s-2.8 5.4-6.4 5.4a7.5 7.5 0 0 1-3.4-.8Z"/>
    <path d="M16 14.2c1 .1 1.9.4 2.7.9l1.3 1.1v-3.4c.5-.6.8-1.4.8-2.2 0-1.4-.8-2.7-2.2-3.4"/>
  `,
  sprout: `
    <path d="M12 19V9.8"/>
    <path d="M12 12.4c-3.1-.3-5-1.9-5.7-4.6 3.1.3 5 1.8 5.7 4.6Z"/>
    <path d="M12 10.6c2.7-.2 4.5-1.6 5.2-4.1-2.7.2-4.5 1.6-5.2 4.1Z"/>
    <path d="M8.4 19h7.2"/>
  `,
  phone: `
    <rect x="8" y="4" width="8" height="16" rx="2"/>
    <path d="M11 17.2h2"/>
    <path d="M16.8 7.2c1.4.8 2.2 2 2.5 3.6"/>
    <path d="M5.2 10.8c.3-1.6 1.1-2.8 2.5-3.6"/>
  `,
  consult: `
    <path d="M7.2 14.8 5 17v-3.8A5.1 5.1 0 0 1 4 10.3C4 7.3 6.7 5 10.1 5s6.1 2.3 6.1 5.3-2.7 5.3-6.1 5.3a7.1 7.1 0 0 1-2.9-.8Z"/>
    <path d="M13.8 15.1c.8.3 1.8.5 2.8.5.6 0 1.1-.1 1.6-.2l1 1.3v-2.4c.5-.6.8-1.3.8-2.1 0-1.2-.6-2.3-1.6-3"/>
  `,
  bridge: `
    <path d="M5 18.5h14"/>
    <path d="M6.5 15.5c1.3-3.8 3.1-5.7 5.5-5.7s4.2 1.9 5.5 5.7"/>
    <path d="M8.2 13.1h7.6M12 9.8v5.7"/>
    <path d="M8 5.2h5.5a2.5 2.5 0 0 1 2.5 2.5v.4"/>
  `
};

const QUESTIONS = [
  { number: "01", label: "何をメニューにすればいいか分からない", icon: "menu" },
  { number: "02", label: "誰に声をかければいいか分からない", icon: "voice" },
  { number: "03", label: "実績がないから自信がない", icon: "sprout" },
  { number: "04", label: "フォロワーが少ないと需要がない気がする", icon: "phone" },
  { number: "05", label: "売り込みっぽくなるのが怖い", icon: "consult" },
  { number: "06", label: "学んでいるのに、案件につながらない", icon: "bridge" }
];

const questionGrid = document.querySelector("[data-question-grid]");
if (questionGrid) {
  questionGrid.innerHTML = QUESTIONS.map(({ number, label, icon }, index) => `
    <article class="questionCard reveal" style="--reveal-delay: ${index * 80}ms;">
      <div class="questionCard__top">
        <span class="questionNumber">${number}</span>
        <span class="questionIcon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            ${QUESTION_ICONS[icon]}
          </svg>
        </span>
      </div>
      <h3 class="questionText">${label}</h3>
    </article>
  `).join("");
}

const RESULT_ICONS = {
  start: `
    <circle cx="12" cy="12" r="7.2"/>
    <path d="M12 8.4v3.9l2.5 1.6"/>
    <path d="M7.2 4.9 5.6 3.4M16.8 4.9l1.6-1.5"/>
  `,
  flag: `
    <path d="M7 20V5"/>
    <path d="M7 5c2.7-1.2 5.1 1.2 8 0 1-.4 1.8-.7 2.5-.8v8.2c-2.9.2-5.2 2.1-8 .7-.8-.4-1.6-.6-2.5-.7"/>
    <path d="M7 16h7"/>
  `,
  page: `
    <path d="M7.5 3.8h7L19 8.3v11.9H7.5z"/>
    <path d="M14.5 3.8v4.5H19M10.3 11.1h5.5M10.3 14.3h5.5M10.3 17.5h3.7"/>
  `,
  symbol: `
    <path d="M12 4.8c3.8 0 6.8 3 6.8 6.8s-3 6.8-6.8 6.8-6.8-3-6.8-6.8"/>
    <path d="M12 4.8v6.8l4.8 4.8"/>
    <path d="M6.3 6.4 4.6 4.7"/>
  `,
  cards: `
    <rect x="4.6" y="8.1" width="11.3" height="7.4" rx="1.3"/>
    <rect x="8.1" y="10.6" width="11.3" height="7.4" rx="1.3"/>
    <path d="M10.6 13.2h4.8M10.6 15.4h3.2"/>
  `,
  growth: `
    <path d="M5 18.5h14"/>
    <path d="M7 16.2v-3.1M12 16.2v-6.4M17 16.2V7.1"/>
    <path d="m14.4 7.4 2.6-2.6 2.6 2.6"/>
    <path d="M17 4.8v5.4"/>
  `
};

const RESULTS = [
  { label: "6ヶ月成果0", icon: "start" },
  { label: "初案件獲得", icon: "flag", emphasis: true },
  { label: "LP制作", icon: "page" },
  { label: "ロゴ制作", icon: "symbol" },
  { label: "名刺制作", icon: "cards" },
  { label: "2ヶ月10万円", icon: "growth", emphasis: true }
];

const resultsRoadmap = document.querySelector("[data-results-roadmap]");
if (resultsRoadmap) {
  resultsRoadmap.innerHTML = RESULTS.map(({ label, icon, emphasis }, index) => `
    <article class="resultStep reveal${emphasis ? " is-emphasis" : ""}" style="--reveal-delay: ${index * 90}ms;">
      <span class="resultLine" aria-hidden="true"></span>
      <span class="resultNode" aria-hidden="true">
        <svg class="resultIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          ${RESULT_ICONS[icon]}
        </svg>
      </span>
      <h3>${label}</h3>
    </article>
  `).join("");
}

const header = document.querySelector("[data-header]");
const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const menuToggle = document.querySelector("[data-menu-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "メニューを開く" : "メニューを閉じる");
  mobilePanel?.classList.toggle("is-open", !isOpen);
});

mobilePanel?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "メニューを開く");
    mobilePanel.classList.remove("is-open");
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const intro = document.querySelector(".intro");

const safeSession = {
  get(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // If storage is unavailable, the page should still be fully readable.
    }
  }
};

const hasSeenIntro = safeSession.get(INTRO_SESSION_KEY) === "true";

if (intro) {
  if (prefersReducedMotion || (hasSeenIntro && !FORCE_INTRO_EVERY_LOAD)) {
    intro.remove();
  } else {
    intro.classList.add("play");
    window.setTimeout(() => {
      intro.classList.add("is-hidden");
      safeSession.set(INTRO_SESSION_KEY, "true");
    }, 3600);
    window.setTimeout(() => intro.remove(), 4400);
  }
}

const revealItems = document.querySelectorAll(".reveal");
if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealItems.forEach((item) => observer.observe(item));
}

const parallaxItems = document.querySelectorAll(".desk-scene .mock");
let ticking = false;

const updateParallax = () => {
  ticking = false;
  if (prefersReducedMotion || !parallaxItems.length) return;

  const hero = document.querySelector(".hero");
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  const viewport = window.innerHeight || 1;
  const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
  const base = (progress - 0.5) * 34;

  parallaxItems.forEach((item, index) => {
    const depth = [0.55, -0.4, 0.7, -0.25][index] || 0.35;
    item.style.setProperty("--parallax-y", `${base * depth}px`);
  });
};

const requestParallax = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateParallax);
};

if (!prefersReducedMotion) {
  updateParallax();
  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener("resize", requestParallax);
}
