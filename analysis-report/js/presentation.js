/* ── PRESENTER HUD INTERACTION & KEYBOARD SHORTCUTS ── */

let presenterModeActive = false;
let toastTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
  setupPresenterMode();
  setupKeyboardListeners();
});

function setupPresenterMode() {
  const btnToggle = document.getElementById('btn-toggle-presenter');
  const toast = document.getElementById('presenter-hud-toast');
  
  if (!btnToggle) return;
  
  // Inject style block dynamically to configure snap scrolling in presenter mode
  let snapStyle = document.getElementById('snap-style-rules');
  if (!snapStyle) {
    snapStyle = document.createElement('style');
    snapStyle.id = 'snap-style-rules';
    snapStyle.textContent = `
      body.presenter-mode-active {
        scroll-snap-type: y mandatory;
        overflow-y: auto;
        height: 100vh;
      }
      body.presenter-mode-active .slide-section {
        scroll-snap-align: start;
        scroll-snap-stop: always;
        height: 100vh;
        overflow: hidden;
      }
    `;
    document.head.appendChild(snapStyle);
  }
  
  btnToggle.addEventListener('click', () => {
    presenterModeActive = !presenterModeActive;
    
    if (presenterModeActive) {
      btnToggle.classList.add('active');
      document.body.classList.add('presenter-mode-active');
      
      // Show toast message
      if (toast) {
        toast.classList.add('active');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
          toast.classList.remove('active');
        }, 5000); // Hide after 5 seconds
      }
      
      // Snap to current slide index instantly to lock alignment
      if (typeof scrollToSlide === 'function' && typeof currentSlideIndex !== 'undefined') {
        scrollToSlide(currentSlideIndex);
      }
    } else {
      btnToggle.classList.remove('active');
      document.body.classList.remove('presenter-mode-active');
      if (toast) toast.classList.remove('active');
    }
  });
}

function setupKeyboardListeners() {
  window.addEventListener('keydown', (e) => {
    // Avoid interfering if typing in forms
    if (document.activeElement.tagName === 'INPUT' || 
        document.activeElement.tagName === 'TEXTAREA' || 
        document.activeElement.isContentEditable) {
      return;
    }
    
    // Check keycodes
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        navigateNext();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        navigatePrev();
        break;
      case ' ': // Spacebar
        // Check that space is not clicked on an interactive element like a button
        if (document.activeElement.tagName !== 'BUTTON' && document.activeElement.tagName !== 'A') {
          e.preventDefault();
          if (e.shiftKey) {
            navigatePrev();
          } else {
            navigateNext();
          }
        }
        break;
      case 'Home':
        e.preventDefault();
        if (typeof scrollToSlide === 'function') scrollToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        if (typeof scrollToSlide === 'function' && typeof SLIDES !== 'undefined') {
          scrollToSlide(SLIDES.length - 1);
        }
        break;
      default:
        break;
    }
  });
}

function navigateNext() {
  if (typeof scrollToSlide === 'function' && typeof currentSlideIndex !== 'undefined' && typeof SLIDES !== 'undefined') {
    if (currentSlideIndex < SLIDES.length - 1) {
      scrollToSlide(currentSlideIndex + 1);
    }
  }
}

function navigatePrev() {
  if (typeof scrollToSlide === 'function' && typeof currentSlideIndex !== 'undefined') {
    if (currentSlideIndex > 0) {
      scrollToSlide(currentSlideIndex - 1);
    }
  }
}
