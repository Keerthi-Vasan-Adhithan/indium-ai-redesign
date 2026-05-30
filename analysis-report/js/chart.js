/* ── CUSTOM DYNAMIC SVG CHART GENERATOR ── */

document.addEventListener('DOMContentLoaded', () => {
  // If slides load fast or are already cached
  if (document.getElementById('radar-svg-wrapper')) {
    renderRadarChart();
  }
});

document.addEventListener('slidesLoaded', () => {
  renderRadarChart();
  renderContentCharts();
});

function renderRadarChart() {
  const container = document.getElementById('radar-svg-wrapper');
  if (!container) return;
  
  // Clear any existing content
  container.innerHTML = '';
  
  const width = 360;
  const height = 360;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = 120;
  
  const categories = [
    { name: "AI Search", key: "AI Search", score: 15, target: 85 },
    { name: "AI Personalization", key: "AI Personalization", score: 10, target: 90 },
    { name: "AI Assistant", key: "AI Assistant", score: 20, target: 85 },
    { name: "AI Recommendations", key: "AI Recommendations", score: 25, target: 80 },
    { name: "Interactive Demos", key: "Interactive Demos", score: 10, target: 95 },
    { name: "AI Lead Capture", key: "AI-powered Lead Capture", score: 18, target: 90 }
  ];
  
  const numAxes = categories.length;
  
  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("style", "overflow: visible;");
  
  // Define Filters for Neon Glowing Effects
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  
  // Cyan target glow
  const filterCyan = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filterCyan.setAttribute("id", "glow-cyan");
  filterCyan.innerHTML = `
    <feGaussianBlur stdDeviation="4" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  `;
  defs.appendChild(filterCyan);
  
  // Orange current glow
  const filterOrange = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filterOrange.setAttribute("id", "glow-orange");
  filterOrange.innerHTML = `
    <feGaussianBlur stdDeviation="3" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  `;
  defs.appendChild(filterOrange);
  
  svg.appendChild(defs);
  
  // ── 1. DRAW CONCENTRIC POLYGONS (GRID) ──
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  levels.forEach(level => {
    const points = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const r = maxRadius * level;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", points.join(" "));
    polygon.setAttribute("fill", "none");
    polygon.setAttribute("stroke", "rgba(255, 255, 255, 0.05)");
    polygon.setAttribute("stroke-width", "1");
    svg.appendChild(polygon);
    
    // Add grid percentage text labels on the vertical axis (angle = -PI/2)
    const labelY = cy - (maxRadius * level) + 4;
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", cx + 8);
    labelText.setAttribute("y", labelY);
    labelText.setAttribute("fill", "rgba(255, 255, 255, 0.15)");
    labelText.setAttribute("font-size", "8px");
    labelText.setAttribute("font-family", "Space Grotesk");
    labelText.textContent = `${level * 100}%`;
    svg.appendChild(labelText);
  });
  
  // ── 2. DRAW AXIS LINES & CATEGORY LABELS ──
  categories.forEach((cat, i) => {
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    const endX = cx + maxRadius * Math.cos(angle);
    const endY = cy + maxRadius * Math.sin(angle);
    
    // Draw Axis line
    const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisLine.setAttribute("x1", cx);
    axisLine.setAttribute("y1", cy);
    axisLine.setAttribute("x2", endX);
    axisLine.setAttribute("y2", endY);
    axisLine.setAttribute("stroke", "rgba(255, 255, 255, 0.08)");
    axisLine.setAttribute("stroke-width", "1");
    svg.appendChild(axisLine);
    
    // Draw Category Label
    const labelRadius = maxRadius + 22;
    const labelX = cx + labelRadius * Math.cos(angle);
    const labelY = cy + labelRadius * Math.sin(angle) + 4; // micro offset
    
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", labelX);
    labelText.setAttribute("y", labelY);
    labelText.setAttribute("fill", "var(--text-secondary)");
    labelText.setAttribute("font-size", "10px");
    labelText.setAttribute("font-weight", "600");
    labelText.setAttribute("font-family", "Space Grotesk");
    
    // Adjust text alignment based on position
    if (Math.abs(labelX - cx) < 10) {
      labelText.setAttribute("text-anchor", "middle");
    } else if (labelX > cx) {
      labelText.setAttribute("text-anchor", "start");
    } else {
      labelText.setAttribute("text-anchor", "end");
    }
    
    labelText.textContent = cat.name;
    svg.appendChild(labelText);
  });
  
  // ── 3. PLOT TARGET WEB PERFORMANCE (CYAN SHAPE) ──
  const targetPoints = [];
  categories.forEach((cat, i) => {
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    const r = maxRadius * (cat.target / 100);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    targetPoints.push(`${x},${y}`);
  });
  
  const targetPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  targetPolygon.setAttribute("points", targetPoints.join(" "));
  targetPolygon.setAttribute("fill", "rgba(6, 182, 212, 0.05)");
  targetPolygon.setAttribute("stroke", "var(--accent-cyan)");
  targetPolygon.setAttribute("stroke-width", "2");
  targetPolygon.setAttribute("filter", "url(#glow-cyan)");
  targetPolygon.setAttribute("style", "opacity: 0.85;");
  svg.appendChild(targetPolygon);
  
  // ── 4. PLOT CURRENT WEB PERFORMANCE (ORANGE SHAPE) ──
  const currentPoints = [];
  categories.forEach((cat, i) => {
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    const r = maxRadius * (cat.score / 100);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    currentPoints.push(`${x},${y}`);
  });
  
  const currentPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  currentPolygon.setAttribute("points", currentPoints.join(" "));
  currentPolygon.setAttribute("fill", "rgba(249, 115, 22, 0.15)");
  currentPolygon.setAttribute("stroke", "var(--accent-orange)");
  currentPolygon.setAttribute("stroke-width", "2.5");
  currentPolygon.setAttribute("filter", "url(#glow-orange)");
  svg.appendChild(currentPolygon);
  
  // ── 5. DRAW CIRCLE DATA-POINTS FOR CURRENT SCORING ──
  categories.forEach((cat, i) => {
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    const r = maxRadius * (cat.score / 100);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    
    // Draw vertex circle dot
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
    dot.setAttribute("r", "4");
    dot.setAttribute("fill", "var(--accent-orange)");
    dot.setAttribute("stroke", "#fff");
    dot.setAttribute("stroke-width", "1");
    
    // Simple SVG hover tooltip title
    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = `Current Score: ${cat.score}%`;
    dot.appendChild(title);
    
    svg.appendChild(dot);
  });
  
  // Append SVG to wrapper
  container.appendChild(svg);
}

/* ── ADDITIONAL STATS / COMPARISON CHART INJECTIONS ── */
function renderContentCharts() {
  const container = document.getElementById('content-bar-chart');
  if (!container) return;
  
  // Clear container
  container.innerHTML = '';
  
  // Render a mini bar list comparing information density / page structure loads
  const chartData = [
    { label: 'Corporate Text Density', value: 88, color: 'var(--accent-orange)' },
    { label: 'Interactive Feature Elements', value: 20, color: 'var(--accent-indigo)' },
    { label: 'Media & Rich Graphic Proofs', value: 35, color: 'var(--accent-cyan)' },
    { label: 'Conversion & Capture Friction', value: 92, color: 'var(--accent-purple)' }
  ];
  
  chartData.forEach(d => {
    const barWrap = document.createElement('div');
    barWrap.style.marginBottom = '1.2rem';
    barWrap.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:5px; font-family:var(--font-heading); font-weight:600;">
        <span style="color:var(--text-secondary)">${d.label}</span>
        <span style="color:${d.color}">${d.value}%</span>
      </div>
      <div style="height:5px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
        <div style="height:100%; width:${d.value}%; background:${d.color}; border-radius:3px; transition:width 1s ease;"></div>
      </div>
    `;
    container.appendChild(barWrap);
  });
}
