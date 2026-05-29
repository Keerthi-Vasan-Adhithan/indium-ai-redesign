function initConsultationWizard() {
  const container = document.getElementById('consultation-wizard');
  if (!container) return;
  
  const steps = window.appData.wizardSteps || [];
  
  let currentStepIndex = 0;
  let answers = { goal: '', industry: '', name: '', email: '' };
  
  function renderStep() {
    if (steps.length === 0) return;
    const step = steps[currentStepIndex];
    container.innerHTML = '';
    
    // Draw step dots
    const progress = document.createElement('div');
    progress.className = 'wizard-step-indicator';
    for (let i = 0; i < steps.length; i++) {
      const dot = document.createElement('div');
      dot.className = `wizard-dot ${i <= currentStepIndex ? 'active' : ''}`;
      progress.appendChild(dot);
    }
    container.appendChild(progress);
    
    // Draw question title
    const qEl = document.createElement('h3');
    qEl.className = 'wizard-question';
    qEl.innerText = step.question;
    container.appendChild(qEl);
    
    if (step.isForm) {
      // Draw form step
      const formEl = document.createElement('div');
      formEl.className = 'wizard-options';
      formEl.innerHTML = `
        <input type="text" id="wiz-name" class="footer-input" placeholder="Your Name" style="margin-bottom: 0.8rem;" required>
        <input type="email" id="wiz-email" class="footer-input" placeholder="Work Email" required>
      `;
      container.appendChild(formEl);
      
      const navs = document.createElement('div');
      navs.className = 'wizard-navs';
      navs.innerHTML = `
        <button class="btn-futuristic btn-glass" id="wiz-prev-btn" style="padding: 0.6rem 1.2rem;">Back</button>
        <button class="btn-futuristic btn-orange" id="wiz-submit-btn" style="padding: 0.6rem 1.8rem;">Request Custom Blueprint</button>
      `;
      container.appendChild(navs);
      
      document.getElementById('wiz-prev-btn').addEventListener('click', () => {
        currentStepIndex--;
        renderStep();
      });
      
      document.getElementById('wiz-submit-btn').addEventListener('click', () => {
        const nameVal = document.getElementById('wiz-name').value.trim();
        const emailVal = document.getElementById('wiz-email').value.trim();
        
        if (!nameVal || !emailVal) {
          alert('Please provide work contact details.');
          return;
        }
        
        answers.name = nameVal;
        answers.email = emailVal;
        
        // Show success blueprint recommendation
        renderSuccessBlueprint();
      });
      
    } else {
      // Draw options buttons
      const optionsEl = document.createElement('div');
      optionsEl.className = 'wizard-options';
      
      step.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'wizard-opt-btn';
        btn.innerHTML = `
          <span>${opt.text}</span>
          <svg class="wizard-opt-arrow" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
        
        btn.addEventListener('click', () => {
          if (currentStepIndex === 0) answers.goal = opt.value;
          if (currentStepIndex === 1) answers.industry = opt.value;
          
          currentStepIndex++;
          renderStep();
        });
        
        optionsEl.appendChild(btn);
      });
      
      container.appendChild(optionsEl);
      
      if (currentStepIndex > 0) {
        const navs = document.createElement('div');
        navs.className = 'wizard-navs';
        navs.innerHTML = `<button class="btn-futuristic btn-glass" id="wiz-prev-btn" style="padding: 0.6rem 1.2rem;">Back</button>`;
        container.appendChild(navs);
        
        document.getElementById('wiz-prev-btn').addEventListener('click', () => {
          currentStepIndex--;
          renderStep();
        });
      }
    }
  }
  
  function renderSuccessBlueprint() {
    container.innerHTML = `
      <div class="cs-card-detail" style="text-align: center; display: flex; flex-direction: column; gap: 1.2rem; align-items: center; justify-content: center; height: 100%;">
        <div class="copilot-avatar" style="width: 50px; height: 50px; background: #10b981; margin-bottom: 0.5rem;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 style="font-size: 1.8rem; color: var(--accent-orange);">Consultation Blueprint Ready!</h3>
        <p>Thank you ${answers.name}. Our AI coordinator has matched your goal (<strong>${answers.goal}</strong>) for <strong>${answers.industry}</strong>. We have dispatched a tailored solution brief to <strong>${answers.email}</strong>.</p>
        <button class="btn-futuristic btn-glass" id="wiz-reset-btn" style="margin-top: 1rem;">Reset Wizard</button>
      </div>
    `;
    
    document.getElementById('wiz-reset-btn').addEventListener('click', () => {
      currentStepIndex = 0;
      answers = { goal: '', industry: '', name: '', email: '' };
      renderStep();
    });
  }
  
  renderStep();
}
