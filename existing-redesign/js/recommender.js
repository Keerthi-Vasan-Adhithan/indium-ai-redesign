function initRecommendations() {
  const industryBtns = document.querySelectorAll('#industry-selector .option-btn');
  const challengeBtns = document.querySelectorAll('#challenge-selector .option-btn');
  const recOutput = document.getElementById('recommendation-output');
  
  if (!recOutput) return;
  
  const recData = window.appData.recommendationDB || {};
  
  let selectedIndustry = 'bfsi';
  let selectedChallenge = 'tech-debt';
  
  function updateRecommendation() {
    const data = recData[selectedIndustry]?.[selectedChallenge];
    const indName = recData[selectedIndustry]?.name;
    if (!data) return;
    
    // Animate transition
    recOutput.style.opacity = '0';
    setTimeout(() => {
      recOutput.innerHTML = `
        <div class="rec-header">
          <div class="rec-title-wrap">
            <span class="rec-subtitle">${indName} Roadmap</span>
            <h3 class="rec-title-main">${data.title}</h3>
          </div>
          <span class="rec-badge-pct">${data.savings}</span>
        </div>
        
        <div class="rec-content-grid">
          <div>
            <div class="rec-services-section">
              <h4>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Core Services Recommended
              </h4>
              <div class="rec-services-list">
                ${data.services.map(s => `
                  <div class="rec-service-item">
                    <strong>${s.title}</strong>
                    <p>${s.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="rec-lifter-section">
              <h4>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-indigo)" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                The Lifter Modernization Role
              </h4>
              <p class="rec-lifter-desc">${data.lifter}</p>
            </div>
          </div>
          
          <div>
            <div class="rec-case-section">
              <h4>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Success Case Study
              </h4>
              <div class="rec-case-card">
                <div class="rec-case-title">${data.case.title}</div>
                <div class="rec-case-metrics">
                  ${data.case.metrics.map(m => `
                    <div class="rec-case-metric">
                      <span class="num">${m.val}</span>
                      <span class="lbl">${m.lbl}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
            
            <div class="rec-arch-section">
              <h4>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" stroke-width="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="10" x2="6" y2="14"></line>
                  <line x1="18" y1="10" x2="18" y2="14"></line>
                </svg>
                Target Solution Topology
              </h4>
              <div class="rec-arch-box">
                <div class="rec-arch-graph">
                  ${data.topology.map((t, idx) => `
                    <div class="arch-node ${idx === 1 ? 'highlight' : ''}">${t}</div>
                    ${idx < data.topology.length - 1 ? '<div class="arch-arrow">↓</div>' : ''}
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      recOutput.style.opacity = '1';
    }, 200);
  }
  
  industryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      industryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedIndustry = btn.dataset.value;
      updateRecommendation();
    });
  });
  
  challengeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      challengeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedChallenge = btn.dataset.value;
      updateRecommendation();
    });
  });
  
  updateRecommendation();
}
