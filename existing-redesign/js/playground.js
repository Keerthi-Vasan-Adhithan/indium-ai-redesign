function initTheLifterPlayground() {
  const tabs = document.querySelectorAll('.editor-tab-btn');
  const fileLabel = document.getElementById('editor-file-label');
  const inputPane = document.getElementById('editor-input-pane');
  const outputPane = document.getElementById('editor-output-pane');
  const runBtn = document.getElementById('run-migration-btn');
  const metricLines = document.getElementById('metric-lines');
  const metricFixes = document.getElementById('metric-fixes');
  const visualArea = document.getElementById('dependency-visual-area');
  
  if (!runBtn || !inputPane || !outputPane) return;
  
  let currentLang = 'sas';
  const dataTemplates = window.appData.codeTemplates || {};
  
  // Set initial content
  function setContent(lang) {
    currentLang = lang;
    const item = dataTemplates[lang];
    if (!item) return;
    fileLabel.innerText = item.fileName;
    inputPane.innerText = item.input;
    outputPane.innerText = '';
    
    // Clear metrics
    metricLines.innerText = '0 lines';
    metricFixes.innerText = '0';
    
    // Draw initial node map
    drawDependencyMap(false);
  }
  
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setContent(btn.dataset.lang);
    });
  });
  
  // Initial draw
  setContent('sas');
  
  // Dependency Map Draw function
  function drawDependencyMap(active = false) {
    if (!visualArea) return;
    visualArea.innerHTML = '';
    
    const count = active ? 12 : 5;
    const width = visualArea.clientWidth;
    const height = visualArea.clientHeight;
    
    const nodes = [];
    
    // Create random nodes
    for (let i = 0; i < count; i++) {
      const node = document.createElement('div');
      node.className = 'dep-node-mock';
      
      const x = Math.random() * (width - 20) + 10;
      const y = Math.random() * (height - 20) + 10;
      
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      
      // Color coding based on status
      if (active) {
        node.style.background = i % 2 === 0 ? 'var(--accent-orange)' : 'var(--accent-cyan)';
        node.style.boxShadow = `0 0 10px ${i % 2 === 0 ? 'var(--accent-orange-glow)' : 'var(--accent-cyan-glow)'}`;
      } else {
        node.style.background = 'var(--text-muted)';
      }
      
      visualArea.appendChild(node);
      nodes.push({ x, y, el: node });
    }
  }
  
  // Run button handler
  runBtn.addEventListener('click', () => {
    runBtn.style.pointerEvents = 'none';
    runBtn.style.opacity = '0.5';
    outputPane.innerText = 'Initializing Agentic Parser...\nAnalyzing dependency chains...\nScanning for compiler anomalies...';
    
    // Animate map
    drawDependencyMap(true);
    let fixes = Math.floor(Math.random() * 3) + 1;
    
    setTimeout(() => {
      outputPane.innerText = 'Connecting components...\nApplying syntax mappings...\nAuto-fixing deprecated patterns...\n\n';
      metricFixes.innerText = fixes;
    }, 1000);
    
    setTimeout(() => {
      const correctCode = dataTemplates[currentLang].output;
      outputPane.innerText = correctCode;
      
      const lines = correctCode.split('\n').length;
      metricLines.innerText = `${lines} lines`;
      
      runBtn.style.pointerEvents = 'all';
      runBtn.style.opacity = '1';
    }, 2200);
  });
}
