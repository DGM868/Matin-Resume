/**
 * Matin Hatami Portfolio — JavaScript Interactions
 * Theme: Clean White & Blue Minimal Apple Style (IRANYekan ExtraBold for Persian)
 * Features: Interactive Loader, Scrolled Header, Journey Progression Tabs, Reveal Observer,
 * Floating Particles, Projects Management (localStorage), Admin Panel, Connect Modal & Forms.
 */

document.addEventListener("DOMContentLoaded", function () {
  renderUnifiedHeader();
  setupLoader();
  setupScrolledHeader();
  setupRevealAnimations();
  setupJourneyTabs();
  initializeParticles();
  setupMobileNav();
  setActiveNavLink();
  setupConnectModal();
  setupContactForm();
  setupVideoPlayer();
  initializeProjectsPage();
  setupAdminProjectForm();
  setupAdminAuthentication();
});

/* ===== One shared site header ===== */
function renderUnifiedHeader() {
  if (document.body.classList.contains("admin-page")) return;

  const header = document.querySelector(".site-header");
  if (!header) return;

  const persian = isPersianPage();
  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const pages = persian
    ? [
        ["index.html", "خانه"], ["about.html", "درباره من"], ["skills.html", "مهارت‌ها"],
        ["projects.html", "نمونه‌کارها"], ["contact.html", "تماس با من"],
      ]
    : [
        ["index.html", "Home"], ["about.html", "About"], ["skills.html", "Skills"],
        ["projects.html", "Projects"], ["contact.html", "Contact"],
      ];
  const prefix = persian ? "../" : "";
  const otherLanguage = persian ? `../${page}` : `fa/${page}`;
  const navLinks = pages
    .map(([href, label]) => `<a href="${href}"${href === page ? ' class="active" aria-current="page"' : ""}>${label}</a>`)
    .join("");
  const language = persian
    ? `<a href="${otherLanguage}" class="lang-opt" lang="en">EN</a><span class="lang-sep" aria-hidden="true">/</span><span class="lang-opt active" aria-current="true">FA</span>`
    : `<span class="lang-opt active" aria-current="true">EN</span><span class="lang-sep" aria-hidden="true">/</span><a href="${otherLanguage}" class="lang-opt" lang="fa">FA</a>`;

  header.id = "top";
  header.innerHTML = `
    <nav class="nav container" aria-label="${persian ? "ناوبری اصلی" : "Primary navigation"}">
      <a class="brand" href="index.html" aria-label="${persian ? "صفحه اصلی متین حاتمی" : "Matin Hatami home"}">
        <span class="brand-logo"><img src="${prefix}images/logo.png" alt="${persian ? "لوگوی متین حاتمی" : "Matin Hatami logo"}" /></span>
      </a>
      <button class="menu-toggle" aria-label="${persian ? "باز کردن منو" : "Open navigation menu"}" aria-expanded="false" aria-controls="nav-links"><span></span><span></span></button>
      <div class="nav-links" id="nav-links">
        ${navLinks}
        <div class="nav-actions">
          <div class="lang-switch-group" aria-label="${persian ? "انتخاب زبان" : "Language selector"}">${language}</div>
          <button class="button button-secondary open-modal">${persian ? "ارتباط با من" : "Connect Me"}</button>
        </div>
      </div>
    </nav>`;
}

/* ===== Interactive Preloader (Auto dismiss after 1.55s) ===== */
function setupLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const dismiss = () => {
    setTimeout(() => {
      loader.classList.add("done");
    }, 1550);
  };

  if (document.readyState === "complete") {
    dismiss();
  } else {
    window.addEventListener("load", dismiss);
  }
}

/* ===== Scrolled Site Header ===== */
function setupScrolledHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 15);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ===== Scroll Reveal Animations ===== */
function setupRevealAnimations() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }
}

/* ===== Journey Progression Tabs ===== */
function setupJourneyTabs() {
  const tabs = [...document.querySelectorAll("[data-journey-stage]")];
  const panels = [...document.querySelectorAll(".journey-panel")];
  if (!tabs.length) return;

  function activateStage(stage) {
    const panelId = stage.getAttribute("aria-controls");
    tabs.forEach((tab) => {
      const isActive = tab === stage;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive);
      tab.tabIndex = isActive ? 0 : -1;
    });
    panels.forEach((panel) => {
      const isActive = panel.id === panelId;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  }

  // Activate first stage by default
  activateStage(tabs[0]);

  tabs.forEach((stage, index) => {
    stage.addEventListener("click", () => activateStage(stage));
    stage.addEventListener("keydown", (e) => {
      const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      let nextIndex = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") nextIndex = 0;
      if (e.key === "End") nextIndex = tabs.length - 1;
      const nextStage = tabs[nextIndex];
      activateStage(nextStage);
      nextStage.focus();
    });
  });
}

/* Helper to detect asset path prefix (../ for /fa/ or /admin/) */
function getAssetPrefix() {
  const path = window.location.pathname.replace(/\\/g, "/");
  if (path.includes("/fa/") || path.includes("/admin/") || path.endsWith("/fa") || path.endsWith("/admin")) {
    return "../";
  }
  return "";
}

/* Helper to check if current page is Persian */
function isPersianPage() {
  return (
    document.documentElement.lang === "fa" ||
    window.location.pathname.replace(/\\/g, "/").includes("/fa/")
  );
}

/* ===== Floating Particles (Rise from bottom and fade out at top) ===== */
function initializeParticles() {
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;

  particlesContainer.innerHTML = "";
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 15 + "s";
    particle.style.animationDuration = 12 + Math.random() * 10 + "s";

    // Vary size for natural depth
    const size = Math.random() > 0.5 ? "4px" : "2.5px";
    particle.style.width = size;
    particle.style.height = size;
    particle.style.background = "rgba(0, 118, 223, 0.45)";
    particle.style.boxShadow = "0 0 6px rgba(0, 118, 223, 0.35)";

    particlesContainer.appendChild(particle);
  }
}

/* ===== Video Player Handler ===== */
function setupVideoPlayer() {
  const playButton = document.getElementById("playVideoBtn");
  const videoShell = document.getElementById("videoContainer");
  const videoElement = document.getElementById("introVideo");

  if (!playButton || !videoShell) return;

  playButton.addEventListener("click", () => {
    videoShell.classList.add("playing");
    if (videoElement) {
      if (videoElement.src && !videoElement.src.endsWith("#")) {
        videoElement.play();
      } else {
        playButton.style.display = "none";
        const caption = videoShell.querySelector(".video-caption");
        if (caption) {
          const isFa = isPersianPage();
          caption.innerHTML = isFa
            ? "<h3>پخش ویدیو معرفی</h3><p>برای بارگذاری ویدیوی اختصاصی، مسیر فایل ویدیو را در تگ video قرار دهید.</p>"
            : "<h3>Introduction Video Playing</h3><p>To load your custom video file, specify the video source path in the video tag.</p>";
        }
      }
    }
  });
}

/* ===== Mobile Navigation Toggle ===== */
function setupMobileNav() {
  const mobileToggle = document.getElementById("mobileToggle") || document.querySelector(".menu-toggle");
  const headerNav = document.getElementById("headerNav") || document.querySelector(".nav-links");

  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = headerNav.classList.toggle("open");
      headerNav.classList.toggle("active", isOpen);
      mobileToggle.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", (e) => {
      if (!headerNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        headerNav.classList.remove("active");
        headerNav.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });

    const navLinks = headerNav.querySelectorAll("a, .nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        headerNav.classList.remove("active");
        headerNav.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
}

/* ===== Active Nav Link ===== */
function setActiveNavLink() {
  const currentPath = window.location.pathname.replace(/\\/g, "/");
  const navLinks = document.querySelectorAll(".header-nav .nav-link, .nav-links a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    const currentPage = currentPath.split("/").pop() || "index.html";
    const linkPage = href.split("/").pop();

    if (currentPage === linkPage || (currentPage === "" && linkPage === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* ===== Connect Modal (Accessible Popup) ===== */
function setupConnectModal() {
  const modal = document.getElementById("connectModal") || document.getElementById("connect-modal");
  const openButtons = document.querySelectorAll(".open-modal");
  const closeButton = modal ? modal.querySelector(".modal-close") : null;
  let lastFocusedElement = null;

  if (!modal) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    lastFocusedElement = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (closeButton) closeButton.focus();
  };

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  openButtons.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();

    if (e.key === "Tab") {
      const focusables = [...modal.querySelectorAll("button, a[href]")];
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* ===== Contact Form Client-side Submission ===== */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const feedbackMsg = document.getElementById("formFeedbackMsg");

  if (!form || !submitBtn) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.querySelector("[name='name']").value.trim();
    const email = form.querySelector("[name='email']").value.trim();
    const message = form.querySelector("[name='message']").value.trim();

    const isFa = isPersianPage();

    if (!name || !email || !message) {
      alert(isFa ? "لطفاً فیلدهای الزامی را پر کنید." : "Please fill in all required fields.");
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      form.reset();

      if (feedbackMsg) {
        feedbackMsg.classList.add("success");
        feedbackMsg.textContent = isFa
          ? "پیام شما با موفقیت ثبت شد! به زودی با شما تماس خواهم گرفت."
          : "Thank you! Your message has been sent successfully. I will get back to you shortly.";

        setTimeout(() => {
          feedbackMsg.classList.remove("success");
        }, 5000);
      } else {
        alert(
          isFa
            ? "پیام شما با موفقیت ثبت شد!"
            : "Thank you! Your message has been sent successfully."
        );
      }
    }, 1000);
  });
}

/* ==========================================================================
   Projects Management & Dynamic Rendering (3 items per row on desktop)
   Requirement: Links strictly open in new tab with rel="nofollow noopener noreferrer"
   ========================================================================== */

const DEFAULT_PROJECTS_FA = [];

const DEFAULT_PROJECTS_EN = [];

function getStoredProjects() {
  try {
    const raw = localStorage.getItem("matin_portfolio_projects");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Error reading projects from localStorage:", err);
    return [];
  }
}

function saveStoredProjects(projects) {
  try {
    localStorage.setItem("matin_portfolio_projects", JSON.stringify(projects));
  } catch (err) {
    console.error("Error writing projects to localStorage:", err);
  }
}

function resolveImagePath(rawPath) {
  if (!rawPath) rawPath = "images/project-routing.svg";
  if (rawPath.startsWith("data:") || rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }
  const prefix = getAssetPrefix();
  const cleanName = rawPath.replace(/^(\.\.\/)+/, "").replace(/^images\//, "");
  return prefix + "images/" + cleanName;
}

function initializeProjectsPage() {
  const container = document.getElementById("projectsGrid");
  if (!container) return;

  const isFa = isPersianPage();
  const defaults = isFa ? DEFAULT_PROJECTS_FA : DEFAULT_PROJECTS_EN;
  const userProjects = getStoredProjects();

  // Combine user projects first, then default projects
  const allProjects = [...userProjects, ...defaults];

  container.innerHTML = "";

  if (allProjects.length === 0) {
    container.innerHTML = `
      <div class="coming-soon-card">
        <div class="coming-soon-icon"><i class="fas fa-hammer"></i></div>
        <h2>${isFa ? "نمونه‌کارها در حال آماده‌سازی و به‌روزرسانی" : "Projects are Being Prepared & Updated"}</h2>
        <p>${isFa ? "به زودی پروژه‌ها و نمونه‌کارهای منتخب در این بخش قرار خواهند گرفت." : "Selected engineering projects and portfolio works will be showcased here soon."}</p>
      </div>
    `;
    return;
  }

  allProjects.forEach((proj) => {
    const card = document.createElement("div");
    card.className = "project-card";

    let tagsHtml = "";
    if (Array.isArray(proj.tags)) {
      tagsHtml = proj.tags
        .map((t) => `<span class="project-tag">${escapeHtml(t)}</span>`)
        .join("");
    } else if (typeof proj.tags === "string") {
      tagsHtml = proj.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => `<span class="project-tag">${escapeHtml(t)}</span>`)
        .join("");
    }

    const projectTitle = isFa ? (proj.titleFa || proj.title || proj.titleEn) : (proj.titleEn || proj.title || proj.titleFa);
    const projectDesc = isFa ? (proj.descFa || proj.desc || proj.descEn) : (proj.descEn || proj.desc || proj.descFa);
    const imgSrc = resolveImagePath(proj.image);
    const fallbackSrc = resolveImagePath("images/about-banner.jpg");
    const btnText = isFa ? "مشاهده پروژه" : "View Project";

    // Strictly open in new tab with rel="nofollow noopener noreferrer"
    card.innerHTML = `
      <div class="project-img-wrap">
        <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(projectTitle)}" loading="lazy" onerror="this.src='${fallbackSrc}'" />
      </div>
      <div class="project-body">
        <div>
          <div class="project-tags">
            ${tagsHtml}
          </div>
          <h3 class="project-title">${escapeHtml(projectTitle)}</h3>
          <p class="project-desc">${escapeHtml(projectDesc)}</p>
        </div>
        <a href="${escapeHtml(proj.url)}" target="_blank" rel="nofollow noopener noreferrer" class="project-link-btn">
          <span>${btnText}</span>
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ==========================================================================
   Admin Panel Logic (Add, List & Delete Projects via localStorage)
   Accessible via /admin
   ========================================================================== */

function setupAdminProjectForm() {
  const adminForm = document.getElementById("adminProjectForm");
  const previewImg = document.getElementById("imagePreview");
  const previewPlaceholder = document.getElementById("previewPlaceholder");
  const fileInput = document.getElementById("projectImageFile");
  const urlInput = document.getElementById("projectImageUrl");
  const projectListContainer = document.getElementById("adminProjectsList");

  if (!adminForm) return;

  const isFa = isPersianPage();

  // File upload preview
  if (fileInput && previewImg) {
    fileInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImg.src = e.target.result;
          previewImg.style.display = "block";
          if (previewPlaceholder) previewPlaceholder.style.display = "none";
          if (urlInput) urlInput.value = "";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // URL input preview
  if (urlInput && previewImg) {
    urlInput.addEventListener("input", function () {
      if (this.value.trim().length > 5) {
        previewImg.src = this.value.trim();
        previewImg.style.display = "block";
        if (previewPlaceholder) previewPlaceholder.style.display = "none";
        if (fileInput) fileInput.value = "";
      }
    });
  }

  // Render existing user projects in admin
  function renderAdminProjectList() {
    if (!projectListContainer) return;

    const stored = getStoredProjects();
    if (stored.length === 0) {
      projectListContainer.innerHTML = isFa
        ? `<p style="text-align: center; color: var(--text-muted); padding: 25px 0;">هیچ نمونه کار سفارشی ثبت نشده است. نمونه‌های پیش‌فرض در صفحه نمونه کارها فعال هستند.</p>`
        : `<p style="text-align: center; color: var(--text-muted); padding: 25px 0;">No custom projects added yet. Default projects are active in the portfolio.</p>`;
      return;
    }

    projectListContainer.innerHTML = "";
    stored.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "admin-project-item";
      row.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding: 14px 18px;
        background: #ffffff;
        border: 1px solid var(--border-color);
        border-radius: 10px;
        margin-bottom: 12px;
      `;

      let tagsStr = Array.isArray(item.tags) ? item.tags.join(", ") : item.tags;
      const listImgSrc = resolveImagePath(item.image);

      row.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0;">
          <img src="${escapeHtml(listImgSrc)}" alt="" style="width: 52px; height: 52px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-color);" onerror="this.style.display='none'">
          <div style="min-width: 0;">
            <h4 style="font-size: 1rem; color: var(--text-main); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(isFa ? (item.titleFa || item.title || item.titleEn) : (item.titleEn || item.title || item.titleFa))}</h4>
            <div style="font-size: 0.82rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(tagsStr || "—")} • <a href="${escapeHtml(item.url)}" target="_blank" rel="nofollow noopener noreferrer" style="color: var(--accent-blue);">${escapeHtml(item.url)}</a></div>
          </div>
        </div>
        <div>
          <button class="delete-proj-btn" data-index="${index}" style="background: rgba(255, 59, 48, 0.1); color: #ff3b30; border: 1px solid rgba(255, 59, 48, 0.2); padding: 7px 14px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
            <i class="fas fa-trash-alt"></i> ${isFa ? "حذف" : "Delete"}
          </button>
        </div>
      `;

      projectListContainer.appendChild(row);
    });

    // Attach delete listeners
    const deleteButtons = projectListContainer.querySelectorAll(".delete-proj-btn");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-index"), 10);
        const confirmMsg = isFa
          ? "آیا از حذف این نمونه کار اطمینان دارید؟"
          : "Are you sure you want to delete this project?";
        if (confirm(confirmMsg)) {
          const list = getStoredProjects();
          list.splice(idx, 1);
          saveStoredProjects(list);
          renderAdminProjectList();
        }
      });
    });
  }

  renderAdminProjectList();

  // Handle Form Submission
  adminForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const titleEn = document.getElementById("projectTitleEn").value.trim();
    const titleFa = document.getElementById("projectTitleFa").value.trim();
    const descEn = document.getElementById("projectDescEn").value.trim();
    const descFa = document.getElementById("projectDescFa").value.trim();
    let url = document.getElementById("projectUrl").value.trim();
    const tags = document.getElementById("projectTags").value.trim();

    if (!titleEn || !titleFa || !descEn || !descFa || !url) {
      alert(
        isFa
          ? "لطفاً عنوان، توضیحات و آدرس اینترنتی پروژه را وارد کنید."
          : "Please provide the project title, description, and link URL."
      );
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // Determine image
    let image = "";
    if (previewImg && previewImg.src && previewImg.style.display !== "none") {
      image = previewImg.src;
    } else if (urlInput && urlInput.value.trim()) {
      image = urlInput.value.trim();
    } else {
      image = "images/project-routing.svg";
    }

    const newProject = {
      id: "proj-" + Date.now(),
      title: titleEn,
      desc: descEn,
      titleEn: titleEn,
      titleFa: titleFa,
      descEn: descEn,
      descFa: descFa,
      url: url,
      image: image,
      tags: tags ? tags.split(",").map((t) => t.trim()) : ["Matin Hatami"],
      createdAt: new Date().toISOString(),
    };

    const currentList = getStoredProjects();
    currentList.unshift(newProject); // add to beginning
    saveStoredProjects(currentList);

    adminForm.reset();
    if (previewImg) {
      previewImg.src = "";
      previewImg.style.display = "none";
    }
    if (previewPlaceholder) {
      previewPlaceholder.style.display = "block";
    }

    renderAdminProjectList();

    const feedback = document.getElementById("adminFeedback");
    const projPageHref = isFa ? "../fa/projects.html" : "../projects.html";
    if (feedback) {
      feedback.style.display = "block";
      feedback.innerHTML = isFa
        ? `<i class="fas fa-check-circle"></i> نمونه کار جدید با موفقیت اضافه شد و با لینک nofollow در صفحه <a href="${projPageHref}" style="text-decoration: underline; color: inherit; font-weight: 700;">نمونه کارها</a> قرار گرفت.`
        : `<i class="fas fa-check-circle"></i> Project added successfully with nofollow link! View it in the <a href="${projPageHref}" style="text-decoration: underline; color: inherit; font-weight: 700;">Projects Page</a>.`;

      setTimeout(() => {
        feedback.style.display = "none";
      }, 6000);
    } else {
      alert(
        isFa
          ? "نمونه کار جدید با موفقیت ذخیره شد!"
          : "Project saved successfully!"
      );
    }
  });
}

/* ===== Admin client-side sign-in =====
   A static site cannot enforce server-side access control. This gate prevents
   casual access in the browser; deploy behind server authentication for real protection. */
function setupAdminAuthentication() {
  const login = document.getElementById("adminLogin");
  const app = document.getElementById("adminApp");
  if (!login || !app) return;

  const sessionKey = "matin_admin_signed_in";
  const credentialHash = "eabbb57c3ac7bcbd79d3d94f77b54929554fda4ff143801615fe0ca240f21911";
  const unlock = () => {
    login.hidden = true;
    app.hidden = false;
    document.body.classList.add("admin-authorized");
  };

  if (sessionStorage.getItem(sessionKey) === "1") {
    unlock();
    return;
  }

  login.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value;
    const feedback = document.getElementById("adminLoginFeedback");
    const hash = await sha256(username === password ? username : "");

    if (hash === credentialHash) {
      sessionStorage.setItem(sessionKey, "1");
      unlock();
      return;
    }
    feedback.textContent = "نام کاربری یا رمز عبور نادرست است. / Username or password is incorrect.";
    feedback.hidden = false;
  });
}

async function sha256(value) {
  if (!window.crypto || !window.crypto.subtle) return "";
  const bytes = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/* Helper to escape HTML characters */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
