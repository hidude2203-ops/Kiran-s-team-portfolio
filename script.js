function initApp() {
  // Always start at top/first section on reload
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // ----------------------------------------------------
  // 0. GLOBAL DOM DECLARATIONS
  // ----------------------------------------------------
  const themes = ['lime', 'black', 'white', 'rose', 'pink'];
  let currentThemeIndex = 0;

  const navCapsule = document.getElementById('nav-capsule');
  const navIndicator = document.getElementById('nav-indicator');
  const navItems = document.querySelectorAll('.nav-item');
  const heroCard = document.getElementById('hero-card');
  let activeNavItem = (navItems && navItems.length > 0) ? navItems[0] : null;

  const prevThemeBtn = document.getElementById('prev-theme-btn');
  const nextThemeBtn = document.getElementById('next-theme-btn');

  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderStatus = document.getElementById('preloader-status');
  const preloaderPercent = document.getElementById('preloader-percent');

  const contactDrawer = document.getElementById('contact-drawer');
  const caseStudyDrawer = document.getElementById('case-study-drawer');
  const approachDrawer = document.getElementById('approach-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  const welcomeBackdrop = document.getElementById('welcome-modal-backdrop');
  const welcomeCloseBtn = document.getElementById('welcome-modal-close-btn');
  const welcomeContinueBtn = document.getElementById('welcome-continue-btn');
  const welcomeThemeCircles = document.querySelectorAll('.welcome-theme-circle');

  // ----------------------------------------------------
  // 1. FAST & FAILSAFE PRELOADER HIDING
  // ----------------------------------------------------
  const hidePreloader = () => {
    if (preloader) {
      preloader.classList.add('is-hidden');
    }
    document.body.classList.add('hero-animated');
  };

  if (preloader) {
    let startTime = null;
    const duration = 1000; // 1 second total fill duration

    function animatePreloader(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);

      if (preloaderBar) preloaderBar.style.width = `${progress}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${Math.floor(progress)}%`;

      if (progress < 100) {
        requestAnimationFrame(animatePreloader);
      } else {
        if (preloaderBar) preloaderBar.style.width = '100%';
        if (preloaderPercent) preloaderPercent.textContent = '100%';
        if (preloaderStatus) preloaderStatus.textContent = 'SYSTEM READY!';
        setTimeout(hidePreloader, 200);
      }
    }

    requestAnimationFrame(animatePreloader);
  }

  // ----------------------------------------------------
  // 2. THEME SWITCHER (WHITE, ROSE, BLACK, LIME, PINK)
  // ----------------------------------------------------
  function applyTheme(index) {
    currentThemeIndex = (index + themes.length) % themes.length;
    const activeTheme = themes[currentThemeIndex];
    document.body.setAttribute('data-theme', activeTheme);

    if (welcomeThemeCircles) {
      welcomeThemeCircles.forEach(circle => {
        if (circle.dataset.theme === activeTheme) {
          circle.classList.add('is-selected');
        } else {
          circle.classList.remove('is-selected');
        }
      });
    }

    if (activeNavItem) {
      setTimeout(() => moveIndicatorTo(activeNavItem), 50);
    }
  }

  if (prevThemeBtn) {
    prevThemeBtn.addEventListener('click', () => {
      applyTheme(currentThemeIndex - 1);
    });
  }

  if (nextThemeBtn) {
    nextThemeBtn.addEventListener('click', () => {
      applyTheme(currentThemeIndex + 1);
    });
  }

  // ----------------------------------------------------
  // 3. DYNAMIC SLIDING NAV PILL INDICATOR
  // ----------------------------------------------------
  let indicatorRaf = null;
  function moveIndicatorTo(item) {
    if (!item || !navIndicator || !navCapsule) return;
    if (indicatorRaf) cancelAnimationFrame(indicatorRaf);
    indicatorRaf = requestAnimationFrame(() => {
      const capsuleRect = navCapsule.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      if (!capsuleRect || !itemRect) return;

      const leftOffset = itemRect.left - capsuleRect.left;
      const itemWidth = itemRect.width;

      navIndicator.style.left = `${leftOffset}px`;
      navIndicator.style.width = `${itemWidth}px`;

      navItems.forEach(nav => {
        if (nav === item) {
          nav.classList.add('is-active-highlight');
        } else {
          nav.classList.remove('is-active-highlight');
        }
      });
    });
  }

  setTimeout(() => {
    if (activeNavItem) moveIndicatorTo(activeNavItem);
  }, 60);

  const heroAiHubCol = document.querySelector('.hero-ai-hub-col');
  function handleAiCoreVisibility() {
    if (!heroAiHubCol) return;
    if (window.innerWidth <= 1120) {
      heroAiHubCol.style.display = 'none';
    } else {
      heroAiHubCol.style.display = '';
    }
  }
  handleAiCoreVisibility();

  window.addEventListener('resize', () => {
    if (activeNavItem) moveIndicatorTo(activeNavItem);
    handleAiCoreVisibility();
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      if (activeNavItem) moveIndicatorTo(activeNavItem);
      handleAiCoreVisibility();
    }, 150);
  });

  if (navItems) {
    navItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        moveIndicatorTo(item);
      });

      item.addEventListener('click', (e) => {
        e.preventDefault();
        activeNavItem = item;
        moveIndicatorTo(item);

        const targetId = item.getAttribute('href')?.replace('#', '');

        // Special Behavior for ABOUT US: Nudge bounce to indicate you are on About section
        if (targetId === 'about') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (heroCard) {
            heroCard.classList.remove('nudge-bounce');
            void heroCard.offsetWidth; // Trigger reflow
            heroCard.classList.add('nudge-bounce');
            setTimeout(() => heroCard.classList.remove('nudge-bounce'), 500);
          }
        }
        // Scroll down when SKILLS or other valid sections are clicked
        else if (targetId && targetId !== 'contact') {
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  // Handle 'About Automation' button click in Skills section
  const aboutAutoBtn = document.getElementById('about-automation-btn');
  if (aboutAutoBtn) {
    aboutAutoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const autoSection = document.getElementById('automation');
      if (autoSection) {
        autoSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (navCapsule) {
    navCapsule.addEventListener('mouseleave', () => {
      if (activeNavItem) moveIndicatorTo(activeNavItem);
    });
  }

  // Scroll Sync with Navigation Indicator
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const matchingNavItem = document.querySelector(`.nav-item[href="#${id}"]`);
        if (matchingNavItem) {
          activeNavItem = matchingNavItem;
          moveIndicatorTo(matchingNavItem);
        }
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });

  // ----------------------------------------------------
  // 4. CONTACT & FIND US RIGHT SIDE DRAWER
  // ----------------------------------------------------
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const contactNavItem = document.getElementById('contact-nav-item');
  const findUsBtn = document.getElementById('find-us-btn');

  function openDrawer() {
    if (contactDrawer && drawerBackdrop) {
      contactDrawer.classList.add('is-open');
      drawerBackdrop.classList.add('is-open');
    }
  }

  function closeDrawer() {
    if (contactDrawer) contactDrawer.classList.remove('is-open');
    if (drawerBackdrop && 
        (!caseStudyDrawer || !caseStudyDrawer.classList.contains('is-open')) && 
        (!approachDrawer || !approachDrawer.classList.contains('is-open'))) {
      drawerBackdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  // 0.5-second (500ms) hover delay for CONTACT navigation item
  let contactHoverTimer = null;

  if (contactNavItem) {
    contactNavItem.addEventListener('mouseenter', () => {
      if (contactHoverTimer) clearTimeout(contactHoverTimer);
      contactHoverTimer = setTimeout(() => {
        openDrawer();
      }, 500);
    });

    contactNavItem.addEventListener('mouseleave', () => {
      if (contactHoverTimer) {
        clearTimeout(contactHoverTimer);
        contactHoverTimer = null;
      }
    });

    contactNavItem.addEventListener('click', (e) => {
      e.preventDefault();
      if (contactHoverTimer) clearTimeout(contactHoverTimer);
      openDrawer();
    });
  }

  // Open drawer instantly when clicking 'Find us'
  if (findUsBtn) {
    findUsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (contactHoverTimer) clearTimeout(contactHoverTimer);
      openDrawer();
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  // ----------------------------------------------------
  // 5. INTERACTIVE BRAND MATRIX & PHILOSOPHY TABS
  // ----------------------------------------------------
  const brandTabs = document.querySelectorAll('.brand-tab');
  const brandTabContents = document.querySelectorAll('.brand-tab-content');

  if (brandTabs.length > 0) {
    brandTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTabId = `tab-${tab.getAttribute('data-tab')}`;

        // Deactivate all tabs & contents
        brandTabs.forEach(t => t.classList.remove('active'));
        brandTabContents.forEach(c => c.classList.remove('active'));

        // Activate selected tab & content
        tab.classList.add('active');
        const targetContent = document.getElementById(targetTabId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  // ----------------------------------------------------
  // 6. INSTANT OPTIMIZED CUSTOM CURSOR & EYE TRACKER
  // ----------------------------------------------------
  const cursorDot = document.getElementById('cursor-dot');
  const navEyesBtn = document.getElementById('nav-eyes-btn');
  const eyeSockets = document.querySelectorAll('.eye-socket');

  let eyeSocketCache = [];
  let isSection1Active = true;
  let mouseX = -100;
  let mouseY = -100;
  let cursorPending = false;
  let isTabActive = true;

  function updateEyeSocketCache() {
    eyeSocketCache = [];
    eyeSockets.forEach(socket => {
      const pupil = socket.querySelector('.eye-pupil');
      if (pupil) {
        const rect = socket.getBoundingClientRect();
        eyeSocketCache.push({
          pupil: pupil,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2
        });
      }
    });
  }

  function updateFaceState() {
    isSection1Active = window.scrollY < (window.innerHeight * 0.75);

    if (navEyesBtn) {
      if (isSection1Active) {
        navEyesBtn.classList.remove('is-sleeping');
        updateEyeSocketCache();
      } else {
        navEyesBtn.classList.add('is-sleeping');
        eyeSocketCache.forEach(item => {
          item.pupil.style.transform = 'translate3d(0px, 0px, 0)';
        });
      }
    }
  }

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(updateFaceState);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (isSection1Active) updateEyeSocketCache();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive && isSection1Active) {
      updateEyeSocketCache();
    }
  });

  function renderCursorAndEyes() {
    cursorPending = false;
    if (!isTabActive) return;

    // 1. Move Custom Cursor Dot
    if (cursorDot) {
      cursorDot.classList.remove('hidden');
      cursorDot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
    }

    // 2. Track Pupils (Only when in Section 1)
    if (isSection1Active && eyeSocketCache.length > 0) {
      for (let i = 0; i < eyeSocketCache.length; i++) {
        const item = eyeSocketCache[i];
        const deltaX = mouseX - item.centerX;
        const deltaY = mouseY - item.centerY;
        const angle = Math.atan2(deltaY, deltaX);

        const maxDistance = 4.8;
        const distance = Math.min(maxDistance, Math.hypot(deltaX, deltaY) / 8);

        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        item.pupil.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
      }
    }
  }

  if (cursorDot || eyeSockets.length > 0) {
    updateEyeSocketCache();

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorPending) {
        cursorPending = true;
        requestAnimationFrame(renderCursorAndEyes);
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      if (cursorDot) cursorDot.classList.add('hidden');
    });

    document.addEventListener('mouseenter', () => {
      if (cursorDot) cursorDot.classList.remove('hidden');
    });
  }

  // ----------------------------------------------------
  // 7. EXPAND / COLLAPSE TOOLS Capsules (+ More / - Less)
  // ----------------------------------------------------
  const toggleMoreToolsBtn = document.getElementById('toggle-more-tools-btn');
  const toggleLessToolsBtn = document.getElementById('toggle-less-tools-btn');
  const extraToolsContainer = document.getElementById('extra-tools-container');

  if (extraToolsContainer) {
    if (toggleMoreToolsBtn) {
      toggleMoreToolsBtn.addEventListener('click', () => {
        extraToolsContainer.classList.remove('is-hidden');
        toggleMoreToolsBtn.classList.add('is-hidden');
        toggleMoreToolsBtn.style.display = 'none';
      });
    }
    if (toggleLessToolsBtn) {
      toggleLessToolsBtn.addEventListener('click', () => {
        extraToolsContainer.classList.add('is-hidden');
        if (toggleMoreToolsBtn) {
          toggleMoreToolsBtn.classList.remove('is-hidden');
          toggleMoreToolsBtn.style.display = 'inline-flex';
        }
      });
    }
  }

  // ----------------------------------------------------
  // ----------------------------------------------------
  // 8. SYSTEMS I'VE BUILT (PROJECTS SHOWCASE SWITCHER - 4 PROJECTS)
  // ----------------------------------------------------
  const darkCards = document.querySelectorAll('.project-dark-card');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const mainPanel = document.getElementById('projects-main-panel');

  const projectsData = [
    {
      id: 0,
      title: "Synapse: Ultimate Personal Assistant",
      desc: "Synapse: An autonomous multi-agent Slack assistant built with n8n and Gemini 1.5 Flash that eliminates context-switching by seamlessly routing schedule and email workflows to specialized sub-agents.",
      hasFullData: true,
      imgSrc: "▶️ Slack Challenge Verified Code Fix - n8n[DEV] and 1 more page - Personal - Microsoft​ Edge 9_30_2026 2_24_43 PM.png",
      imgAlt: "Slack Challenge Verified Code Fix Scenario",
      nodes: [
        { title: "1. Command", desc: "New command received.", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="13" y2="12"/><circle cx="8" cy="16" r="1"/></svg>' },
        { title: "2. Separation", desc: "Separates voice and text.", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3"/><path d="M21 3l-7 7"/><path d="M3 3l7 7"/></svg>' },
        { title: "3. Transcribing", desc: "Turns voice to text.", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>' },
        { title: "4. Interpreting", desc: "AI selects sub-workflow.", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
        { title: "5. Auto Respond", desc: "Automated response sent.", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' }
      ],
      tools: ["Slack", "Gemini", "Gmail", "Calendar", "Discord"],
      results: [
        { stat: "99%", label: "Task routing accuracy" },
        { stat: "Sub-2s", label: "Response latency" },
        { stat: "Zero", label: "Context switches required" }
      ],
      caseStudy: {
        title: "Autonomous Multi-Agent Personal Assistant: Orchestrating Zero-Context-Switching Productivity via n8n, Slack, and Google Gemini",
        subtitle: "Supervisor-router architecture with specialized sub-agents for Slack, Gmail, and Google Calendar.",
        execSummary: "To eliminate productivity loss from constant app-switching between communication and scheduling platforms, I engineered an autonomous, multi-agent personal assistant integrated into Slack using self-hosted n8n and Google Gemini 1.5 Flash. The system is architected around a supervisor-router design pattern that ingests unstructured messages through a secure Cloudflare tunnel and Slack trigger, normalizes conversational metadata, and uses an intent-classification router to deterministically delegate tasks to domain-isolated expert agents—such as dedicated Calendar and Gmail units equipped exclusively with their respective authenticated OAuth2 API tools. By replacing monolithic prompting with modular, domain-specific execution branches and persistent channel-based memory, the assistant achieves sub-two-second response latencies while eliminating tool hallucinations during schedule queries, event creations, and inbox triage, ultimately delivering a seamless, single-interface automation pipeline directly within the Slack thread.",
        metricLabel: "Response Latency:",
        metricTag: "Sub-2 Seconds ⚡"
      }
    },
    {
      id: 1,
      title: "Customer Support - Ingestion & Triage: Scaling High-Volume Ticket Resolution",
      desc: "Automated n8n workflow linking inbound customer webhooks with Airtable and Google Gemini to classify intent, query real-time order data, and draft grounded support replies.",
      hasFullData: true,
      imgSrc: "▶️ Customer Support - Ingestion & Triage - n8n[DEV] and 2 more pages - Personal - Microsoft​ Edge 9_5_2026 3_03_32 PM.png",
      imgAlt: "Customer Support - Ingestion & Triage Scenario",
      nodes: [
        { title: "1. Ingestion", desc: "Captures customer payload via an incoming HTTP Webhook", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
        { title: "2. Intent Classification", desc: "Classify & Extract + Google Gemini Chat Model", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 0-5 5c0 2.5 1.5 4.5 3 6v2a2 2 0 0 0 4 0v-2c1.5-1.5 3-3.5 3-6a5 5 0 0 0-5-5z"/><line x1="10" y1="22" x2="14" y2="22"/></svg>' },
        { title: "3. Ticket Logging", desc: "Uses extracted entities to fetch relevant real-time order history and corresponding shipping/fulfillment policy guidelines directly from Airtable", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>' },
        { title: "4. Draft Generation", desc: "Prompts Gemini with customer intent, fetched order details", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' }
      ],
      tools: ["Webhooks", "Gemini", "Airtable", "n8n"],
      results: [
        { stat: "72%", label: "First Response Time reduction" },
        { stat: "60%", label: "Surge in volume absorbed" },
        { stat: "Zero", label: "AI policy hallucinations" }
      ],
      caseStudy: {
        title: "Customer Support - Ingestion & Triage: Scaling High-Volume Ticket Resolution",
        subtitle: "Automated LLM ticket triage, Airtable context grounding, and reply drafting.",
        execSummary: "To eliminate manual lookup overhead and reduce severe tier-1 ticket backlogs, a fast-growing Direct-to-Consumer retail brand deployed the Customer Support - Ingestion & Triage workflow in n8n, directly linking inbound customer messaging with Airtable and Google Gemini. When incoming queries trigger the Webhook, the pipeline validates customer identity via an initial record search and safely diverts unverified requests, while legitimate inquiries are routed through Google Gemini to classify customer intent and extract critical entities such as order IDs. The system immediately logs a new ticket in Airtable, queries the database to enrich the prompt with live order details and shipping policies, and feeds this verified context into a second Gemini model to generate an accurate, grounded reply draft that is written directly back to the database for human review. By automating context retrieval and message drafting, the company cut its First Response Time by 72%, prevented AI policy hallucinations through strict data grounding, and enabled support agents to absorb a 60% surge in order volume during peak retail seasons without expanding headcount.",
        metricLabel: "Response Time:",
        metricTag: "-72% Reduction ⚡"
      }
    },
    {
      id: 2,
      title: "AI Speed-to-Lead Qualification",
      desc: "An autonomous Speed-to-Lead pipeline built in Make.com that ingests inbound Tally Form inquiries, scores & categorizes them via Google Gemini AI into structured JSON, and routes high-priority prospects to Airtable, HTTP webhooks, and Gmail outreach in seconds.",
      hasFullData: true,
      imgSrc: "scenario.png",
      imgAlt: "AI Speed-to-Lead Qualification Scenario",
      nodes: [
        { title: "1. Ingestion", desc: "Trigger (Tally): Real-time form submission capture.", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="13" y2="12"/><circle cx="8" cy="16" r="1"/></svg>' },
        { title: "2. Evaluation", desc: "Analysis (Gemini): Evaluates & formats to JSON.", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 0-5 5c0 2.5 1.5 4.5 3 6v2a2 2 0 0 0 4 0v-2c1.5-1.5 3-3.5 3-6a5 5 0 0 0-5-5z"/><line x1="10" y1="22" x2="14" y2="22"/></svg>' },
        { title: "3. Parsing", desc: "Transformation: Parses JSON to key-values.", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
        { title: "4. Routing", desc: "Logic (Router): Checks qualification status.", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3"/><path d="M21 3l-7 7"/><path d="M3 3l7 7"/></svg>' },
        { title: "5. Outreach", desc: "Action: Logs Airtable record & fires Gmail.", icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' }
      ],
      tools: ["Tally Forms", "Gemini", "Make", "Airtable", "Gmail"],
      results: [
        { stat: "< 30s", label: "Sub-minute response time" },
        { stat: "100%", label: "Data consistency in Airtable" },
        { stat: "Zero", label: "Manual triaging workload" }
      ],
      caseStudy: {
        title: "AI Speed-to-Lead Qualification Pipeline",
        subtitle: "Real-time Tally ingestion, Gemini AI scoring, Airtable logging & Gmail outreach.",
        execSummary: "Manual lead qualification introduces delays that drastically reduce conversion rates. This project implements an autonomous 'Speed-to-Lead' pipeline built in Make.com that ingests inbound inquiries, scores and categorizes them via Google Gemini AI, and routes high-priority prospects to storage and notification systems within seconds.\n\nWorkflow Overview (5-Stage Breakdown):\n• Trigger — Form Ingestion (Tally): Watches for incoming submissions in real time.\n• Analysis — Intelligent Evaluation (Google Gemini AI): Receives raw form payload and formats output into structured JSON.\n• Transformation — Data Parsing (JSON Parser): Converts Gemini's raw string output into structured key-value pairs.\n• Logic — Conditional Routing (Router & Qualification Filter): Checks qualification status.\n• Action — Storage & Outreach (Airtable, HTTP, Gmail):\n  - Route 1: Automatically creates a structured record in Airtable & downstream tools.\n  - Route 2: Triggers an automated personalized email via Gmail.",
        metricLabel: "Speed-to-Lead:",
        metricTag: "< 30 Seconds ⚡"
      }
    },
    {
      id: 3,
      title: "About More Projects",
      desc: "The three projects you have just seen are our best time-saving projects ever made. We just showcased a few, but we have made over 40+ successful builds and we are building more workflows!"
    }
  ];

  // Save Project 0 HTML for dynamic restoration
  const project0HTML = mainPanel ? mainPanel.innerHTML : '';

  function selectProject(index) {
    if (index < 0 || index >= projectsData.length) return;
    const data = projectsData[index];

    // 1. Update Dark Cards active class
    darkCards.forEach(card => {
      const pIdx = parseInt(card.dataset.project, 10);
      if (pIdx === index) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });

    // 2. Update Left Timeline Col
    timelineItems.forEach(item => {
      const pIdx = parseInt(item.dataset.project, 10);
      if (pIdx === index) {
        item.classList.add('is-active');
        let body = item.querySelector('.timeline-content-body');
        if (!body) {
          body = document.createElement('div');
          body.className = 'timeline-content-body';
          item.appendChild(body);
        }
        const caseStudyBtnHTML = index === 3 ? '' : `
          <a href="#contact" class="case-study-link" data-project="${index}">
            <span>View case study</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        `;
        body.innerHTML = `
          <h3 class="timeline-title">${data.title}</h3>
          <p class="timeline-desc">${data.desc}</p>
          ${caseStudyBtnHTML}
        `;
      } else {
        item.classList.remove('is-active');
        const body = item.querySelector('.timeline-content-body');
        if (body) body.remove();
      }
    });

    // 3. Update Main Panel Content
    if (mainPanel) {
      if (index === 3) {
        // Strip screenshot, workflow overview, tools used, and right results panel for "About More Projects"
        mainPanel.innerHTML = `
          <div class="about-more-projects-panel" style="width: 100%; height: 100%; min-height: 420px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 48px 36px; background: var(--card-bg, rgba(255,255,255,0.02)); border-radius: 24px; border: 1px solid var(--icon-btn-border, rgba(255,255,255,0.08)); position: relative; overflow: hidden; box-shadow: var(--card-shadow, none);">
            <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 18px; border-radius: 20px; background: var(--btn-bg, rgba(255,255,255,0.08)); color: var(--text-main, #ffffff); font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 22px; border: 1px solid var(--icon-btn-border, rgba(255,255,255,0.15));">
              <span>⚡ 40+ SUCCESSFUL BUILDS</span>
            </div>
            <h3 style="font-size: 28px; font-weight: 800; line-height: 1.35; margin-bottom: 18px; color: var(--text-main, #ffffff); max-width: 680px;">
              The three projects you have just seen are our best time-saving projects ever made.
            </h3>
            <p style="font-size: 15px; font-weight: 500; line-height: 1.65; color: var(--text-muted, rgba(255,255,255,0.7)); max-width: 620px; margin: 0 auto 32px auto;">
              We have showcased just a few key highlights, but we have made over 40+ successful builds and we are continuously building more workflows!
            </p>
            <div style="display: flex; gap: 20px; align-items: center; justify-content: center; flex-wrap: wrap;">
              <div style="padding: 16px 28px; background: var(--nav-capsule-bg, rgba(0,0,0,0.25)); border-radius: 16px; border: 1px solid var(--icon-btn-border, rgba(255,255,255,0.1)); min-width: 170px;">
                <span style="display: block; font-size: 26px; font-weight: 800; color: var(--text-main, #ffffff);">40+</span>
                <span style="font-size: 10px; font-weight: 700; color: var(--text-muted, #888888); text-transform: uppercase; letter-spacing: 0.6px;">Successful Builds</span>
              </div>
              <div style="padding: 16px 28px; background: var(--nav-capsule-bg, rgba(0,0,0,0.25)); border-radius: 16px; border: 1px solid var(--icon-btn-border, rgba(255,255,255,0.1)); min-width: 170px;">
                <span style="display: block; font-size: 26px; font-weight: 800; color: var(--text-main, #ffffff);">Continuous</span>
                <span style="font-size: 10px; font-weight: 700; color: var(--text-muted, #888888); text-transform: uppercase; letter-spacing: 0.6px;">Workflows Building</span>
              </div>
            </div>
          </div>
        `;
      } else {
        // Restore standard layout structure if returning from project 3
        if (!mainPanel.querySelector('.projects-center-panel')) {
          mainPanel.innerHTML = project0HTML;
        }

        // Update screenshot
        const screenshotImg = mainPanel.querySelector('.screenshot-img-placeholder img');
        if (screenshotImg && data.imgSrc) {
          screenshotImg.src = data.imgSrc;
          if (data.imgAlt) screenshotImg.alt = data.imgAlt;
        }

        // Update Workflow Diagram Track Nodes
        const workflowTrack = mainPanel.querySelector('.workflow-diagram-track');
        if (workflowTrack && data.nodes) {
          let nodesHTML = '';
          data.nodes.forEach((node, i) => {
            if (i > 0) {
              nodesHTML += `<div class="workflow-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>`;
            }
            nodesHTML += `
              <div class="workflow-node">
                <div class="node-icon-box">
                  ${node.icon}
                </div>
                <h4 class="node-step-title">${node.title}</h4>
                <p class="node-step-desc">${node.desc}</p>
              </div>
            `;
          });
          workflowTrack.innerHTML = nodesHTML;
        }

        // Update Tools Used
        const toolsGrid = mainPanel.querySelector('.tools-used-grid');
        if (toolsGrid && data.tools) {
          toolsGrid.innerHTML = data.tools.map(tool => `
            <div class="tool-capsule-mini">
              <span>${tool}</span>
            </div>
          `).join('');
        }

        // Update Key Results
        const resultsList = mainPanel.querySelector('.results-list');
        if (resultsList && data.results) {
          resultsList.innerHTML = data.results.map(r => `
            <div class="result-item">
              <div class="result-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div class="result-text">
                <span class="result-stat-num">${r.stat}</span>
                <span class="result-stat-label">${r.label}</span>
              </div>
            </div>
          `).join('');
        }
      }
    }
  }

  darkCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.project, 10);
      selectProject(idx);
    });
  });

  timelineItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.project, 10);
      selectProject(idx);
    });
  });

  // ----------------------------------------------------
  // 9. CASE STUDY SLIDING SIDE DRAWER
  // ----------------------------------------------------
  function openCaseStudyDrawer(projectIndex) {
    if (!caseStudyDrawer || !drawerBackdrop) return;
    const pIdx = (projectIndex !== undefined && !isNaN(projectIndex) && projectsData[projectIndex]) ? projectIndex : 0;
    const project = projectsData[pIdx];
    const cs = project.caseStudy || projectsData[0].caseStudy;

    const titleEl = document.getElementById('case-study-drawer-title');
    if (titleEl) titleEl.textContent = cs.title;

    const subEl = document.getElementById('case-study-drawer-subtitle');
    if (subEl) subEl.textContent = cs.subtitle;

    const execEl = document.getElementById('case-study-exec-text');
    if (execEl) execEl.textContent = cs.execSummary;

    const metricLabelEl = document.getElementById('case-study-metric-label');
    if (metricLabelEl) metricLabelEl.textContent = cs.metricLabel || 'Response Latency:';

    const metricTagEl = document.getElementById('case-study-latency-tag');
    if (metricTagEl) metricTagEl.textContent = cs.metricTag || 'Sub-2 Seconds ⚡';

    caseStudyDrawer.classList.add('is-open');
    drawerBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudyDrawer() {
    if (caseStudyDrawer) caseStudyDrawer.classList.remove('is-open');
    if (drawerBackdrop && 
        (!contactDrawer || !contactDrawer.classList.contains('is-open')) && 
        (!approachDrawer || !approachDrawer.classList.contains('is-open'))) {
      drawerBackdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  const caseStudyCloseBtn = document.getElementById('case-study-close-btn');
  if (caseStudyCloseBtn) {
    caseStudyCloseBtn.addEventListener('click', closeCaseStudyDrawer);
  }

  // Event Delegation for "View case study" links anywhere
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.case-study-link');
    if (link) {
      e.preventDefault();
      const pIdxAttr = link.getAttribute('data-project');
      let pIdx = pIdxAttr !== null ? parseInt(pIdxAttr, 10) : NaN;
      if (isNaN(pIdx)) {
        const activeTimeline = document.querySelector('.timeline-item.is-active');
        pIdx = activeTimeline ? parseInt(activeTimeline.dataset.project, 10) : 0;
      }
      openCaseStudyDrawer(pIdx);
    }
  });

  // ----------------------------------------------------
  // 10. MY APPROACH LEFT-SLIDING SIDE DRAWER (SECTION 4)
  // ----------------------------------------------------
  function openApproachDrawer() {
    if (!approachDrawer || !drawerBackdrop) return;
    approachDrawer.classList.add('is-open');
    drawerBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeApproachDrawer() {
    if (approachDrawer) approachDrawer.classList.remove('is-open');
    if (drawerBackdrop && 
        (!contactDrawer || !contactDrawer.classList.contains('is-open')) && 
        (!caseStudyDrawer || !caseStudyDrawer.classList.contains('is-open'))) {
      drawerBackdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  const approachCloseBtn = document.getElementById('approach-close-btn');
  if (approachCloseBtn) {
    approachCloseBtn.addEventListener('click', closeApproachDrawer);
  }

  // Event Delegation for clicking 'My Approach' card in section 4
  document.addEventListener('click', (e) => {
    const approachBox = e.target.closest('.auto-approach-box');
    if (approachBox) {
      e.preventDefault();
      openApproachDrawer();
    }
  });

  // Universal Backdrop Close Handler
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', () => {
      closeDrawer();
      closeCaseStudyDrawer();
      closeApproachDrawer();
    });
  }

  // ----------------------------------------------------
  // 11. WELCOME POP-UP MODAL & THEME PREVIEW SELECTOR
  // ----------------------------------------------------
  function triggerHeroAnimation() {
    document.body.classList.remove('hero-animated');
    void document.body.offsetWidth; // Reflow for smooth entrance transition
    document.body.classList.add('hero-animated');
  }

  function openWelcomeModal() {
    if (welcomeBackdrop) {
      welcomeBackdrop.classList.add('is-open');
    }
    document.body.classList.add('welcome-modal-open');
  }

  function closeWelcomeModal() {
    if (welcomeBackdrop) {
      welcomeBackdrop.classList.remove('is-open');
    }
    document.body.classList.remove('welcome-modal-open');
    triggerHeroAnimation();
  }

  // Auto-open Welcome Modal on page load
  setTimeout(openWelcomeModal, 250);

  if (welcomeCloseBtn) {
    welcomeCloseBtn.addEventListener('click', closeWelcomeModal);
  }
  if (welcomeContinueBtn) {
    welcomeContinueBtn.addEventListener('click', closeWelcomeModal);
  }
  if (welcomeBackdrop) {
    welcomeBackdrop.addEventListener('click', (e) => {
      if (e.target === welcomeBackdrop) {
        closeWelcomeModal();
      }
    });
  }

  if (welcomeThemeCircles) {
    welcomeThemeCircles.forEach(circle => {
      circle.addEventListener('click', () => {
        const themeName = circle.dataset.theme;
        const themeIdx = themes.indexOf(themeName);
        if (themeIdx !== -1) {
          applyTheme(themeIdx);
        }
        welcomeThemeCircles.forEach(c => c.classList.remove('is-selected'));
        circle.classList.add('is-selected');
        triggerHeroAnimation();
      });
    });
  }
  // ----------------------------------------------------
  // 12. SECTION 5 CONTACT BUTTON CONTROLLER
  // ----------------------------------------------------
  const sec5OpenContactBtn = document.getElementById('sec5-open-contact-btn');
  if (sec5OpenContactBtn && contactDrawer && drawerBackdrop) {
    sec5OpenContactBtn.addEventListener('click', () => {
      contactDrawer.classList.add('is-open');
      drawerBackdrop.classList.add('is-open');
    });
  }

  // ----------------------------------------------------
  // 13. ESCAPE KEY MODAL CLOSER
  // ----------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const imgModal = document.getElementById('image-modal-lightbox');
      if (imgModal) {
        imgModal.style.display = 'none';
        document.body.classList.remove('image-lightbox-open');
      }
      const upworkModal = document.getElementById('upwork-modal-backdrop');
      if (upworkModal) {
        upworkModal.classList.remove('is-open');
      }
    }
  });

  // ----------------------------------------------------
  // 14. UPWORK PARTNER PROFILE NOTICE MODAL HANDLER
  // ----------------------------------------------------
  const upworkCapsuleBtn = document.getElementById('upwork-capsule-btn');
  const upworkModalBackdrop = document.getElementById('upwork-modal-backdrop');
  const upworkModalCloseBtn = document.getElementById('upwork-modal-close-btn');
  const upworkContinueBtn = document.getElementById('upwork-continue-btn');

  if (upworkCapsuleBtn && upworkModalBackdrop) {
    upworkCapsuleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      upworkModalBackdrop.classList.add('is-open');
    });
  }

  if (upworkModalCloseBtn && upworkModalBackdrop) {
    upworkModalCloseBtn.addEventListener('click', () => {
      upworkModalBackdrop.classList.remove('is-open');
    });
  }

  if (upworkModalBackdrop) {
    upworkModalBackdrop.addEventListener('click', (e) => {
      if (e.target === upworkModalBackdrop) {
        upworkModalBackdrop.classList.remove('is-open');
      }
    });
  }

  if (upworkContinueBtn && upworkModalBackdrop) {
    upworkContinueBtn.addEventListener('click', () => {
      upworkModalBackdrop.classList.remove('is-open');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
