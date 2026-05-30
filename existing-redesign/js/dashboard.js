function initROICalculator() {
  const codeSlider = document.getElementById('roi-code-slider');
  const volSlider = document.getElementById('roi-volume-slider');
  
  const codeDisplay = document.getElementById('roi-code-size-display');
  const volDisplay = document.getElementById('roi-dev-volume-display');
  
  const calcTime = document.getElementById('calc-time-saved');
  const calcCost = document.getElementById('calc-cost-saved');
  
  const csData = window.appData.caseStudiesData || {};
  
  function runCalculation() {
    if (!codeSlider || !volSlider) return;
    const loc = parseInt(codeSlider.value);
    const annualCost = parseInt(volSlider.value);
    
    // Formatting numbers
    codeDisplay.innerText = `${loc.toLocaleString()} LOC`;
    volDisplay.innerText = `$${annualCost.toLocaleString()} / year`;
    
    // Compute ROI Metrics
    const timeSaved = Math.round(loc / 28000) + 2; // e.g. 5 LOC -> 2 + 2 = 4 months
    const costSaved = Math.round(annualCost * 0.70); // 70% automated efficiency savings
    const pctSavings = Math.min(85, Math.max(50, Math.round(55 + (loc / 200000) + (annualCost / 300000))));
    
    calcTime.innerText = `${timeSaved} Months`;
    calcCost.innerText = `$${costSaved.toLocaleString()}`;
    
    const pctSavingsEl = document.getElementById('roi-pct-savings');
    if (pctSavingsEl) {
      pctSavingsEl.innerText = `${pctSavings}%`;
    }
  }
  
  if (codeSlider && volSlider) {
    codeSlider.addEventListener('input', runCalculation);
    volSlider.addEventListener('input', runCalculation);
    runCalculation();
  }
  
  // Case Study Selector
  const csButtons = document.querySelectorAll('.cs-tab-btn');
  const csContent = document.getElementById('case-study-content');
  
  function updateCaseStudy(key) {
    const data = csData[key];
    if (!data || !csContent) return;
    
    csContent.innerHTML = `
      <div class="cs-card-detail">
        <span class="cs-tag">${data.tag}</span>
        <h3 style="font-size: 1.8rem; margin: 0.5rem 0;">${data.title}</h3>
        <p>${data.desc}</p>
        <div class="cs-before-after">
          <div class="ba-box">
            <div class="ba-box-title">Before State</div>
            <div class="ba-box-desc">${data.before}</div>
          </div>
          <div class="ba-box">
            <div class="ba-box-title">After State</div>
            <div class="ba-box-desc">${data.after}</div>
          </div>
        </div>
        <div style="margin-top: 1rem; border-top: 1px solid var(--border-glass); padding-top: 1rem; color: var(--accent-orange); font-weight: 600;">
          Achieved: ${data.roi}
        </div>
      </div>
    `;
  }
  
  csButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      csButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateCaseStudy(btn.dataset.cs);
    });
  });
  
  updateCaseStudy('credit');
}
