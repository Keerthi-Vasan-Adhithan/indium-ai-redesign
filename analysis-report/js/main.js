/* ── CENTRAL PRESENTATION ENGINE & DATA BINDINGS ── */

// Central state tracking
let globalData = null;
let currentSlideIndex = 0;
const SLIDES = [
  { id: 'hero-slide', file: 'sections/hero.html', label: 'Executive Assessment Portal' },
  { id: 'company-slide', file: 'sections/company.html', label: 'Company Overview' },
  { id: 'homepage-slide', file: 'sections/homepage.html', label: 'Homepage Experience' },
  { id: 'ux-slide', file: 'sections/ux.html', label: 'User Experience Audits' },
  { id: 'content-slide', file: 'sections/content.html', label: 'Information Architecture' },
  { id: 'ai-maturity-slide', file: 'sections/ai-maturity.html', label: 'AI Maturity Radar' },
  { id: 'competitors-slide', file: 'sections/competitors.html', label: 'Competitive Landscape' },
  { id: 'gap-slide', file: 'sections/gap.html', label: 'Strategic Gap Matrix' },
  { id: 'opportunities-slide', file: 'sections/opportunities.html', label: 'AI Opportunities Roadmap' },
  { id: 'proposed-slide', file: 'sections/proposed.html', label: 'Proposed Modernization' },
  { id: 'summary-slide', file: 'sections/summary.html', label: 'Strategic Recommendation' }
];

document.addEventListener('DOMContentLoaded', async () => {
  initParticles();
  await loadPresentationData();
  await injectSlides();
  setupNavigation();
  setupIntersectionObserver();
  
  // Dispatch custom event to notify chart.js and presentation.js that slides are ready
  document.dispatchEvent(new CustomEvent('slidesLoaded'));
});

/* ── 1. FUTURISTIC BACKGROUND PARTICLES SYSTEM ── */
function initParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 25000));
  const connectionDistance = 120;
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.75 
        ? 'rgba(249, 115, 22, 0.3)' // Orange glow
        : 'rgba(99, 102, 241, 0.2)'; // Indigo glow
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw subtle grid overlay first
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    
    // Draw links
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.12;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  animate();
}

/* ── 2. DATA LOADING & INJECTION ── */
async function loadPresentationData() {
  try {
    const res = await fetch('data/analysis-data.json');
    globalData = await res.json();
  } catch (err) {
    console.error('Failed to load assessment data:', err);
  }
}

async function injectSlides() {
  const container = document.getElementById('presentation-viewport');
  if (!container) return;
  
  const slidePromises = SLIDES.map(async (slide) => {
    const slideDiv = document.getElementById(slide.id);
    if (!slideDiv) return;
    
    try {
      const response = await fetch(slide.file);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const htmlText = await response.text();
      slideDiv.innerHTML = htmlText;
      
      // Post-injection bindings
      bindSlideData(slide.id);
    } catch (err) {
      slideDiv.innerHTML = `
        <section class="slide-section active">
          <div class="slide-container">
            <h2 style="color:var(--accent-orange)">Error Loading Slide</h2>
            <p>Could not fetch template file: <code>${slide.file}</code></p>
          </div>
        </section>
      `;
      console.error(`Error loading slide ${slide.id}:`, err);
    }
  });
  
  await Promise.all(slidePromises);
}

/* ── 3. DYNAMIC SLIDE DATA BINDING ── */
function bindSlideData(slideId) {
  if (!globalData) return;
  
  switch (slideId) {
    case 'hero-slide':
      bindHeroSlide();
      break;
    case 'company-slide':
      bindCompanySlide();
      break;
    case 'homepage-slide':
      bindHomepageSlide();
      break;
    case 'ux-slide':
      bindUxSlide();
      break;
    case 'content-slide':
      bindContentSlide();
      break;
    case 'ai-maturity-slide':
      bindAiMaturitySlide();
      break;
    case 'competitors-slide':
      bindCompetitorsSlide();
      break;
    case 'gap-slide':
      bindGapSlide();
      break;
    case 'opportunities-slide':
      bindOpportunitiesSlide();
      break;
    case 'proposed-slide':
      // Static placeholders and visual layouts link to prototypes
      break;
    case 'summary-slide':
      bindSummarySlide();
      break;
  }
}

function bindHeroSlide() {
  const data = globalData.heroData;
  const slide = document.getElementById('hero-slide');
  if (!slide || !data) return;
  
  // Set titles
  const titleEl = slide.querySelector('.hero-title');
  if (titleEl) titleEl.textContent = data.title;
  
  const subEl = slide.querySelector('.hero-subtitle');
  if (subEl) subEl.textContent = data.subtitle;
  
  const metaEl = slide.querySelector('.hero-meta-box');
  if (metaEl) {
    metaEl.innerHTML = `
      <div class="hero-meta-item">Analyst: <strong>${data.analyst}</strong></div>
      <div class="hero-meta-item">Date: <strong>${data.date}</strong></div>
    `;
  }
  
  // Set Stats Cards
  const statsGrid = slide.querySelector('.hero-stats-grid');
  if (statsGrid && data.stats) {
    statsGrid.innerHTML = data.stats.map(s => `
      <div class="stat-card">
        <div class="stat-val">${s.val}</div>
        <div class="stat-lbl">${s.lbl}</div>
      </div>
    `).join('');
  }
}

function bindCompanySlide() {
  const data = globalData.companyData;
  const slide = document.getElementById('company-slide');
  if (!slide || !data) return;
  
  // Bind services
  const servicesGrid = slide.querySelector('#company-services-grid');
  if (servicesGrid && data.services) {
    servicesGrid.innerHTML = data.services.map(s => `
      <div class="company-card">
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          ${s.title}
        </h4>
        <p>${s.desc}</p>
      </div>
    `).join('');
  }
  
  // Bind industries
  const indGrid = slide.querySelector('#company-industries-grid');
  if (indGrid && data.industries) {
    indGrid.innerHTML = data.industries.map(i => `
      <div class="company-card">
        <h4>${i.name}</h4>
        <p>${i.desc}</p>
      </div>
    `).join('');
  }

  // Bind differentiators
  const diffsGrid = slide.querySelector('#company-differentiators-grid');
  if (diffsGrid && data.differentiators) {
    diffsGrid.innerHTML = data.differentiators.map(d => `
      <div class="company-card diff-card">
        <h4>
          <span class="differentiator-tag">■</span> ${d.title}
        </h4>
        <p>${d.desc}</p>
      </div>
    `).join('');
  }
}

function bindHomepageSlide() {
  const data = globalData.homepageData;
  const slide = document.getElementById('homepage-slide');
  if (!slide || !data) return;
  
  // Bind scorecard
  const scorecardPane = slide.querySelector('.homepage-scorecard-pane');
  if (scorecardPane && data.scores) {
    scorecardPane.innerHTML = `
      <h3 class="panel-title" style="color:var(--accent-indigo); margin-bottom:1rem;">HOMEPAGE EXPERIENCE MATRIX</h3>
    ` + data.scores.map(s => `
      <div class="scorecard-item">
        <div class="scorecard-meta">
          <span class="scorecard-title">${s.cat}</span>
          <span class="scorecard-status">Audit Status: ${s.class.toUpperCase()}</span>
        </div>
        <div class="scorecard-bar-wrap">
          <div class="scorecard-bar">
            <div class="scorecard-fill ${s.class}" style="width: ${s.score}"></div>
          </div>
          <span class="scorecard-val">${s.score}</span>
        </div>
      </div>
    `).join('');
  }
  
  // Bind Pros
  const prosList = slide.querySelector('#homepage-pros-list');
  if (prosList && data.strengths) {
    prosList.innerHTML = data.strengths.map(item => `
      <li>
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <div>
          <strong>${item.title}</strong>
          <p style="font-size:0.75rem; margin-top:2px;">${item.desc}</p>
        </div>
      </li>
    `).join('');
  }
  
  // Bind Cons
  const consList = slide.querySelector('#homepage-cons-list');
  if (consList && data.weaknesses) {
    consList.innerHTML = data.weaknesses.map(item => `
      <li>
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <div>
          <strong>${item.title}</strong>
          <p style="font-size:0.75rem; margin-top:2px;">${item.desc}</p>
        </div>
      </li>
    `).join('');
  }
}

function bindUxSlide() {
  const data = globalData.uxData;
  const slide = document.getElementById('ux-slide');
  if (!slide || !data) return;
  
  // Bind Pain Points
  const painGrid = slide.querySelector('.ux-pain-points');
  if (painGrid && data.painPoints) {
    painGrid.innerHTML = data.painPoints.map((p, idx) => `
      <div class="ux-point-card">
        <div class="point-number">0${idx+1}</div>
        <div class="point-content">
          <div class="point-title">${p.title}</div>
          <div class="point-desc">${p.desc}</div>
        </div>
      </div>
    `).join('');
  }
  
  // Bind Scores
  const scorePane = slide.querySelector('.ux-score-visuals');
  if (scorePane && data.scores) {
    scorePane.innerHTML = `
      <div class="ux-score-title">USER EXPERIENCE INDEX SCORECARD</div>
    ` + data.scores.map(s => `
      <div class="ux-score-row">
        <span class="ux-score-label">${s.metric}</span>
        <div style="display:flex; align-items:center; gap:1rem;">
          <div class="ux-score-gauge-track">
            <div class="ux-score-gauge-fill" style="width: ${s.score * 10}%"></div>
          </div>
          <span class="ux-score-num">${s.score.toFixed(1)}/10</span>
        </div>
      </div>
    `).join('');
  }
}

function bindContentSlide() {
  const data = globalData.contentData;
  const slide = document.getElementById('content-slide');
  if (!slide || !data) return;
  
  // Bind Table Rows
  const tableBody = slide.querySelector('#content-table-body');
  if (tableBody && data.reviewedPages) {
    tableBody.innerHTML = data.reviewedPages.map(r => {
      let badgeClass = 'badge-hub';
      if (r.type === 'Corporate') badgeClass = 'badge-corp';
      else if (r.type === 'Solutions') badgeClass = 'badge-sol';
      else if (r.type === 'Services') badgeClass = 'badge-serv';
      
      return `
        <tr>
          <td><strong>${r.page}</strong></td>
          <td><span class="content-badge ${badgeClass}">${r.type}</span></td>
          <td>${r.density}</td>
          <td>
            <span style="color:${r.engagement === 'Low' ? '#ef4444' : '#f59e0b'}">${r.engagement}</span>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  // Bind Insights Card
  const insightsCard = slide.querySelector('.content-insights-card');
  if (insightsCard && data.findings) {
    insightsCard.innerHTML = `
      <h3 style="font-family:var(--font-display); font-size:1rem; margin-bottom:1rem; color:var(--accent-orange)">INFORMATION DENSITY INSIGHTS</h3>
      <div style="display:flex; flex-direction:column; gap:1.2rem;">
        <div>
          <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:#10b981; font-weight:700; display:block; margin-bottom:4px;">Strengths</span>
          <p style="font-size:0.8rem; line-height:1.5">${data.findings.strengths}</p>
        </div>
        <div>
          <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:#ef4444; font-weight:700; display:block; margin-bottom:4px;">Gaps Identified</span>
          <p style="font-size:0.8rem; line-height:1.5">${data.findings.weaknesses}</p>
        </div>
      </div>
    `;
  }
}

function bindAiMaturitySlide() {
  const data = globalData.aiMaturity;
  const slide = document.getElementById('ai-maturity-slide');
  if (!slide || !data) return;
  
  const headerSection = slide.querySelector('.ai-maturity-comparison');
  if (headerSection && data.overview) {
    headerSection.innerHTML = `
      <div class="maturity-panel panel-says">
        <div class="maturity-panel-title">Positioning claims: GenAI Integrator</div>
        <p class="maturity-panel-desc">Indium promotes autonomous swarm architectures, deep agent integration, and legacy migration pipelines in their thought leadership documents.</p>
      </div>
      <div class="maturity-panel panel-delivers">
        <div class="maturity-panel-title">Actual user experience delivered</div>
        <p class="maturity-panel-desc">${data.overview.desc}</p>
      </div>
    `;
  }
}

function bindCompetitorsSlide() {
  const data = globalData.competitorData;
  const slide = document.getElementById('competitors-slide');
  if (!slide || !data) return;
  
  const tableBody = slide.querySelector('#competitors-table-body');
  if (tableBody && data.companies) {
    tableBody.innerHTML = data.companies.map(c => {
      let badgeClass = 'comp-persistent';
      if (c.name.toLowerCase() === 'indium') badgeClass = 'comp-indium';
      else if (c.name.toLowerCase() === 'tcs') badgeClass = 'comp-tcs';
      else if (c.name.toLowerCase() === 'infosys') badgeClass = 'comp-infosys';
      else if (c.name.toLowerCase() === 'accenture') badgeClass = 'comp-accenture';
      else if (c.name.toLowerCase() === 'cognizant') badgeClass = 'comp-cognizant';
      
      let scoreColorClass = 'comp-score-fair';
      if (c.score >= 80) scoreColorClass = 'comp-score-excellent';
      else if (c.score >= 65) scoreColorClass = 'comp-score-good';
      
      return `
        <tr>
          <td>
            <div class="competitor-name">
              <span class="competitor-badge-dot ${badgeClass}"></span>
              ${c.name}
            </div>
          </td>
          <td>${c.position}</td>
          <td>${c.ux}</td>
          <td>${c.interactivity}</td>
          <td>${c.diff}</td>
          <td>
            <div class="comp-score-container ${scoreColorClass}">
              <div class="comp-score-bar-track">
                <div class="comp-score-bar-fill" style="width: ${c.score}%"></div>
              </div>
              <span class="comp-score-num">${c.score}</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
}

function bindGapSlide() {
  const data = globalData.gapData;
  const slide = document.getElementById('gap-slide');
  if (!slide || !data) return;
  
  const cardsContainer = slide.querySelector('.gap-cards-container');
  if (cardsContainer && data.gaps) {
    cardsContainer.innerHTML = data.gaps.map(g => `
      <div class="gap-card" data-gap-num="${g.num}">
        <div class="gap-num">0${g.num}</div>
        <div class="gap-info">
          <div class="gap-title">${g.title}</div>
          <div class="gap-desc">${g.desc}</div>
          <div class="gap-action">Proposed Action: ${g.action}</div>
        </div>
      </div>
    `).join('');
    
    // Bind interaction logic for gap card selection to display in impact card
    const cards = cardsContainer.querySelectorAll('.gap-card');
    const impactVal = slide.querySelector('#gap-detail-impact');
    const actionVal = slide.querySelector('#gap-detail-action');
    const gapSelectionTitle = slide.querySelector('#gap-selection-title');
    
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.style.borderColor = 'var(--border-glass)');
        card.style.borderColor = 'var(--accent-orange)';
        
        const gapInfo = data.gaps[idx];
        if (gapSelectionTitle) gapSelectionTitle.textContent = `GAP 0${gapInfo.num}: ${gapInfo.title.toUpperCase()}`;
        if (impactVal) {
          impactVal.textContent = gapInfo.impact;
          impactVal.className = 'val-glow ' + gapInfo.impact.toLowerCase();
        }
        if (actionVal) actionVal.textContent = gapInfo.action;
      });
    });
    
    // Select first card by default
    if (cards[0]) cards[0].click();
  }
}

function bindOpportunitiesSlide() {
  const data = globalData.opportunities;
  const slide = document.getElementById('opportunities-slide');
  if (!slide || !data) return;
  
  const grid = slide.querySelector('.opportunities-grid');
  if (grid) {
    grid.innerHTML = data.map(o => {
      let impactClass = 'high';
      if (o.impact.toLowerCase().includes('critical')) impactClass = 'critical';
      
      return `
        <div class="opportunity-card">
          <span class="opp-badge ${impactClass}">${o.impact}</span>
          <div class="opp-title">${o.name}</div>
          <div class="opp-points">
            <div class="opp-point problem">
              <strong>Pain Point Audited</strong>
              ${o.prob}
            </div>
            <div class="opp-point business">
              <strong>Strategic Business Value</strong>
              ${o.bVal}
            </div>
            <div class="opp-point user">
              <strong>User Experience Enrichment</strong>
              ${o.uVal}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function bindSummarySlide() {
  const slide = document.getElementById('summary-slide');
  if (!slide || !globalData) return;
  
  // Bullets lists (Pros, Cons, Opportunities roadmap recap)
  const prosRecap = slide.querySelector('#summary-pros-recap');
  const consRecap = slide.querySelector('#summary-cons-recap');
  const oppsRecap = slide.querySelector('#summary-opps-recap');
  
  if (prosRecap && globalData.homepageData.strengths) {
    prosRecap.innerHTML = globalData.homepageData.strengths.slice(0, 3).map(s => `
      <li class="summary-bullet-item">
        <div class="summary-bullet-title">${s.title}</div>
        <div class="summary-bullet-desc">${s.desc}</div>
      </li>
    `).join('');
  }
  
  if (consRecap && globalData.homepageData.weaknesses) {
    consRecap.innerHTML = globalData.homepageData.weaknesses.slice(0, 3).map(w => `
      <li class="summary-bullet-item">
        <div class="summary-bullet-title">${w.title}</div>
        <div class="summary-bullet-desc">${w.desc}</div>
      </li>
    `).join('');
  }
  
  if (oppsRecap && globalData.opportunities) {
    oppsRecap.innerHTML = globalData.opportunities.slice(0, 3).map(o => `
      <li class="summary-bullet-item">
        <div class="summary-bullet-title">${o.name}</div>
        <div class="summary-bullet-desc">${o.bVal}</div>
      </li>
    `).join('');
  }
}

/* ── 4. PRESENTER HUD NAVIGATION CONTROLS ── */
function setupNavigation() {
  const dotNav = document.getElementById('slide-nav-dots');
  const prevBtn = document.getElementById('btn-prev-slide');
  const nextBtn = document.getElementById('btn-next-slide');
  
  // Render dot items
  if (dotNav) {
    dotNav.innerHTML = SLIDES.map((slide, idx) => `
      <div class="hud-dot-wrap" data-slide-index="${idx}">
        <span class="hud-dot-label">Slide 0${idx+1}: ${slide.label}</span>
        <button class="hud-dot" aria-label="Go to Slide ${idx+1}"></button>
      </div>
    `).join('');
    
    // Dot click triggers navigation
    const dots = dotNav.querySelectorAll('.hud-dot-wrap');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-slide-index'));
        scrollToSlide(idx);
      });
    });
  }
  
  // Footer navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlideIndex > 0) {
        scrollToSlide(currentSlideIndex - 1);
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlideIndex < SLIDES.length - 1) {
        scrollToSlide(currentSlideIndex + 1);
      }
    });
  }
}

function scrollToSlide(index) {
  if (index < 0 || index >= SLIDES.length) return;
  const slideElement = document.getElementById(SLIDES[index].id);
  if (slideElement) {
    slideElement.scrollIntoView({ behavior: 'smooth' });
    currentSlideIndex = index;
  }
}

/* ── 5. SCROLL INTERSECTION OBSERVER ── */
function setupIntersectionObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px', // Trigger when section takes up significant viewport space
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const slideId = entry.target.id;
        const slideIdx = SLIDES.findIndex(s => s.id === slideId);
        
        if (slideIdx !== -1) {
          updateActiveSlideState(slideIdx);
        }
      }
    });
  }, observerOptions);
  
  SLIDES.forEach(slide => {
    const el = document.getElementById(slide.id);
    if (el) observer.observe(el);
  });
}

function updateActiveSlideState(index) {
  currentSlideIndex = index;
  
  // 1. Add active class to corresponding section (animates content entries)
  SLIDES.forEach((slide, idx) => {
    const el = document.getElementById(slide.id);
    if (el) {
      const section = el.querySelector('.slide-section');
      if (section) {
        if (idx === index) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      }
    }
  });
  
  // 2. Highlight dot nav item
  const dotWrappers = document.querySelectorAll('.hud-dot-wrap');
  dotWrappers.forEach((w, idx) => {
    if (idx === index) {
      w.classList.add('active');
    } else {
      w.classList.remove('active');
    }
  });
  
  // 3. Update footer elements
  const currentNumEl = document.getElementById('current-slide-num');
  const totalNumEl = document.getElementById('total-slide-num');
  const progressFill = document.getElementById('slide-progress-fill');
  const sectionLabel = document.getElementById('current-section-label');
  const prevBtn = document.getElementById('btn-prev-slide');
  const nextBtn = document.getElementById('btn-next-slide');
  
  if (currentNumEl) currentNumEl.textContent = String(index + 1).padStart(2, '0');
  if (totalNumEl) totalNumEl.textContent = String(SLIDES.length).padStart(2, '0');
  if (sectionLabel) sectionLabel.textContent = SLIDES[index].label;
  
  if (progressFill) {
    const progressPercent = ((index + 1) / SLIDES.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }
  
  if (prevBtn) prevBtn.disabled = index === 0;
  if (nextBtn) nextBtn.disabled = index === SLIDES.length - 1;
}
