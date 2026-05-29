function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);
  
  window.addEventListener('resize', () => {
    w = (canvas.width = window.innerWidth);
    h = (canvas.height = window.innerHeight);
  });
  
  const dots = [];
  const dotQty = 55;
  const connectionRadius = 135;
  
  class Dot {
    constructor() {
      this.reset();
      this.x = Math.random() * w;
      this.y = Math.random() * h;
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r = Math.random() * 2 + 0.8;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.fill();
    }
  }
  
  for (let i = 0; i < dotQty; i++) {
    dots.push(new Dot());
  }
  
  function loop() {
    ctx.clearRect(0, 0, w, h);
    
    dots.forEach(d => {
      d.update();
      d.draw();
    });
    
    // Draw links between points
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        
        if (d < connectionRadius) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          const opacity = (1 - d / connectionRadius) * 0.15;
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}
