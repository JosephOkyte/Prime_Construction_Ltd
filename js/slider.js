/* ==========================================================================
   PRIME CONSTRUCTION — MULTI-STREAM CINEMATIC SLIDER
   Auto-rotation, Category Filtering & Progress Synchronization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const sliderViewport = document.getElementById('cinematicSlider');
  if (!sliderViewport) return;

  const slides = Array.from(sliderViewport.querySelectorAll('.slide-item'));
  const prevBtn = document.getElementById('slidePrevBtn');
  const nextBtn = document.getElementById('slideNextBtn');
  const tabBtns = Array.from(document.querySelectorAll('.slider-tab-btn'));
  const progressFill = document.getElementById('sliderProgressFill');

  let currentIndex = 0;
  let autoPlayTimer = null;
  const slideDuration = 5500; // 5.5 seconds per slide

  function updateSlider(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update active tab button if matching category
    const currentCategory = slides[currentIndex].getAttribute('data-category');
    tabBtns.forEach(btn => {
      const btnCat = btn.getAttribute('data-category');
      if (btnCat === currentCategory) {
        btn.classList.add('active');
      } else if (btnCat !== 'all') {
        btn.classList.remove('active');
      }
    });

    // Update progress bar
    if (progressFill) {
      const progressPercent = ((currentIndex + 1) / slides.length) * 100;
      progressFill.style.width = `${progressPercent}%`;
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      updateSlider(currentIndex + 1);
    }, slideDuration);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Prev / Next Controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlider(currentIndex - 1);
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlider(currentIndex + 1);
      startAutoPlay();
    });
  }

  // Category Tab Filters
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-category');
      if (selectedCategory === 'all') {
        updateSlider(0);
      } else {
        const targetIndex = slides.findIndex(s => s.getAttribute('data-category') === selectedCategory);
        if (targetIndex !== -1) {
          updateSlider(targetIndex);
        }
      }
      startAutoPlay();
    });
  });

  // Pause on hover
  sliderViewport.addEventListener('mouseenter', stopAutoPlay);
  sliderViewport.addEventListener('mouseleave', startAutoPlay);

  // Mobile Touch Swipe Handling
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  sliderViewport.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      stopAutoPlay();
    }
  }, { passive: true });

  sliderViewport.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      handleSwipe();
      startAutoPlay();
    }
  }, { passive: true });

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    // Horizontal swipe threshold: at least 40px and more horizontal than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        // Swiped Left -> Next Slide
        updateSlider(currentIndex + 1);
      } else {
        // Swiped Right -> Prev Slide
        updateSlider(currentIndex - 1);
      }
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      updateSlider(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateSlider(currentIndex + 1);
    }
  });

  // Initialize
  updateSlider(0);
  startAutoPlay();
});
