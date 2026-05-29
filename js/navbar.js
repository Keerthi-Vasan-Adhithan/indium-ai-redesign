function initNavbarScroll() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-menu a');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Auto active tab based on scroll position
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });
}
