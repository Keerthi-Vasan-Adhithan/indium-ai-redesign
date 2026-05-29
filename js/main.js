window.appData = {};

async function loadMockData() {
  try {
    const res = await fetch('data/mock-data.json');
    if (!res.ok) throw new Error("Failed to load data/mock-data.json");
    window.appData = await res.json();
  } catch (error) {
    console.error("Error loading JSON dataset:", error);
  }
}

async function loadSection(id, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (error) {
    console.error("Error loading HTML template:", error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fetch JSON data config
  await loadMockData();
  
  // 2. Fetch and inject HTML components asynchronously
  await Promise.all([
    loadSection('navbar-container', 'sections/navbar.html'),
    loadSection('hero-container', 'sections/hero.html'),
    loadSection('playground-container', 'sections/lifter-demo.html'),
    loadSection('roi-container', 'sections/dashboard.html'),
    loadSection('recommender-container', 'sections/solutions.html'),
    loadSection('consultation-container', 'sections/consultation.html'),
    loadSection('copilot-container', 'sections/chatbot.html'),
    loadSection('footer-container', 'sections/footer.html')
  ]);
  
  // 3. Initialize JS behaviors
  initNavbarScroll();
  initBackgroundCanvas();
  initTheLifterPlayground();
  initROICalculator();
  initRecommendations();
  initConsultationWizard();
  initAICopilotPanel();
  
  // 4. Configure visual micro-animations (e.g. Swarm logs terminal in Hero visual)
  initHeroSwarmAnimations();
});

// Swarm dynamic text feed animations inside Hero Visual
function initHeroSwarmAnimations() {
  const logFeed = document.getElementById('hero-log-feed');
  const swarmCount = document.getElementById('hero-swarm-count');
  if (!logFeed) return;
  
  const logMessages = [
    "[SYSTEM] Swarm-Alpha mapping dependency tree.",
    "[LIFTER] Auto-correcting PICK BASIC array indexing.",
    "[SYSTEM] Swarm-Gamma optimizing Spark SQL mappings.",
    "[MIGRATION] Refactoring COBOL dataset linkages.",
    "[COMPILER] Verified functional equivalence on 45 modules.",
    "[SYSTEM] Swarm-Beta generating Snowflake DDL commands.",
    "[LIFTER] Converted 1,200 lines of Fortran arithmetic equations."
  ];
  
  let currentLogIdx = 2;
  
  setInterval(() => {
    // Randomize logs
    const div = document.createElement('div');
    div.style.animation = 'fade-in-up 0.4s ease-out';
    if (Math.random() > 0.5) {
      div.style.color = '#10b981'; // Green
      div.innerText = logMessages[currentLogIdx % logMessages.length];
    } else {
      div.style.color = 'var(--text-secondary)';
      div.innerText = logMessages[(currentLogIdx + 1) % logMessages.length];
    }
    
    logFeed.appendChild(div);
    if (logFeed.children.length > 3) {
      logFeed.children[0].remove();
    }
    
    currentLogIdx++;
    
    // Randomize active swarm count slightly for real-time feel
    if (swarmCount && Math.random() > 0.6) {
      const currentSwarms = 14 + Math.floor(Math.random() * 5);
      swarmCount.innerText = `${currentSwarms} Swarms`;
    }
  }, 2800);
}
