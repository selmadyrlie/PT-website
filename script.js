/* =================================================================
   THEME TOGGLE
   ================================================================= */

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
  const theme = html.getAttribute('data-theme');
  const newTheme = theme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

/* =================================================================
   TESTIMONIALS CAROUSEL
   ================================================================= */

function initTestimonialsCarousel() {
  const testimonialTrack = document.querySelector('.testimonial-track');
  const prevBtn = document.querySelector('.carousel-container .carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-container .carousel-btn.next');
  const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));

  if (!testimonialTrack || testimonialCards.length === 0) {
    console.log('Testimonials carousel elements not found');
    return;
  }

  let currentTestimonialIndex = 0;

  function scrollToTestimonial(index) {
    const card = testimonialCards[index];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      currentTestimonialIndex = index;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
      scrollToTestimonial(currentTestimonialIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
      scrollToTestimonial(currentTestimonialIndex);
    });
  }

  // Touch/swipe support for testimonials
  let testimonialTouchStartX = 0;
  let testimonialTouchEndX = 0;

  testimonialTrack.addEventListener('touchstart', (e) => {
    testimonialTouchStartX = e.touches[0].clientX;
  });

  testimonialTrack.addEventListener('touchend', (e) => {
    testimonialTouchEndX = e.changedTouches[0].clientX;
    handleTestimonialSwipe();
  });

  function handleTestimonialSwipe() {
    const swipeThreshold = 50;
    const diff = testimonialTouchStartX - testimonialTouchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
      } else {
        // Swipe right - prev
        currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
      }
      scrollToTestimonial(currentTestimonialIndex);
    }
  }

  console.log('Testimonials carousel initialized with', testimonialCards.length, 'cards');
}

/* =================================================================
   ABOUT SECTION IMAGE CAROUSEL
   ================================================================= */

function initAboutCarousel() {
  const container = document.querySelector('.about-carousel-container');
  
  if (!container) {
    console.log('About carousel container not found');
    return;
  }

  const track = container.querySelector('.about-carousel-track');
  const slides = Array.from(container.querySelectorAll('.about-carousel-slide'));
  const prevBtn = container.querySelector('.about-carousel-btn.prev');
  const nextBtn = container.querySelector('.about-carousel-btn.next');
  const dotsContainer = container.querySelector('.about-carousel-dots');

  if (slides.length === 0) {
    console.log('No carousel slides found');
    return;
  }

  console.log('About carousel found with', slides.length, 'slides');

  let currentIndex = 0;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Gå til bilde ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      console.log('Next clicked, now at slide', currentIndex);
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      console.log('Prev clicked, now at slide', currentIndex);
    });
  }

  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Auto-play
  let autoplayInterval;
  
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  }

  // Start autoplay
  startAutoplay();

  // Pause on hover
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  console.log('About carousel initialized successfully');
}

/* =================================================================
   FORM VALIDATION
   ================================================================= */

function initFormValidation() {
  const contactForm = document.querySelector('form[name="contact"]');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      let isValid = true;

      // Clear previous errors
      document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

      // Validate name
      const navnInput = document.getElementById('navn');
      const navnPattern = /^[A-Za-zÆØÅæøå\s]{2,}(\s[A-Za-zÆØÅæøå\s]{2,})?$/;
      if (navnInput && !navnPattern.test(navnInput.value.trim())) {
        const errorEl = document.getElementById('navn-error');
        if (errorEl) errorEl.textContent = 'Vennligst skriv minst fornavn (2+ bokstaver)';
        isValid = false;
      }

      // Validate email
      const epostInput = document.getElementById('epost');
      const epostPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (epostInput && !epostPattern.test(epostInput.value.trim())) {
        const errorEl = document.getElementById('epost-error');
        if (errorEl) errorEl.textContent = 'Vennligst skriv en gyldig e-postadresse';
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
      }
    });
  }
}

/* =================================================================
   SMOOTH SCROLL FOR NAVIGATION LINKS
   ================================================================= */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* =================================================================
   INITIALIZE ALL
   ================================================================= */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  initTestimonialsCarousel();
  initAboutCarousel();
  initFormValidation();
  initSmoothScroll();
  console.log('All initializations complete');
});

// Also try to initialize on window load (backup)
window.addEventListener('load', () => {
  console.log('Window loaded');
});