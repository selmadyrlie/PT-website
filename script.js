// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.classList.toggle('dark', currentTheme === 'dark');

themeToggle.addEventListener('click', () => {
  html.classList.toggle('dark');
  const theme = html.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

// Testimonial carousel with infinite scroll
const track = document.querySelector('.testimonial-track');
const cards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let currentIndex = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

const cardWidth = cards[0].offsetWidth;
const gap = 40; // 2.5rem = 40px
const totalCards = cards.length;

// Set carousel position based on current index
function setPositionByIndex() {
  // Jump to start when reaching the end
  if (currentIndex >= totalCards) {
    track.style.transition = 'none';
    currentIndex = 0;
    currentTranslate = 0;
    track.style.transform = `translateX(0px)`;
    
    // Re-enable transition after one frame
    setTimeout(() => {
      track.style.transition = 'transform 0.5s ease';
    }, 50);
    return;
  }
  
  // Jump to end when going back from start
  if (currentIndex < 0) {
    track.style.transition = 'none';
    currentIndex = totalCards - 1;
    currentTranslate = currentIndex * -(cardWidth + gap);
    track.style.transform = `translateX(${currentTranslate}px)`;
    
    setTimeout(() => {
      track.style.transition = 'transform 0.5s ease';
    }, 50);
    return;
  }
  
  // Normal transition
  currentTranslate = currentIndex * -(cardWidth + gap);
  track.style.transform = `translateX(${currentTranslate}px)`;
}

// Navigation buttons
nextBtn.addEventListener('click', () => {
  currentIndex++;
  setPositionByIndex();
  prevTranslate = currentTranslate;
});

prevBtn.addEventListener('click', () => {
  currentIndex--;
  setPositionByIndex();
  prevTranslate = currentTranslate;
});

// Touch events for mobile
track.addEventListener('touchstart', (e) => {
  isDragging = true;
  startPos = e.touches[0].clientX;
  track.style.cursor = 'grabbing';
});

track.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const currentPosition = e.touches[0].clientX;
  const diff = currentPosition - startPos;
  track.style.transform = `translateX(${prevTranslate + diff}px)`;
});

track.addEventListener('touchend', (e) => {
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;
  
  // Determine direction based on swipe distance
  if (movedBy < -100) {
    currentIndex++;
  } else if (movedBy > 100) {
    currentIndex--;
  }
  
  setPositionByIndex();
  prevTranslate = currentTranslate;
  track.style.cursor = 'grab';
});

// Mouse events for desktop
track.addEventListener('mousedown', (e) => {
  isDragging = true;
  startPos = e.clientX;
  track.style.cursor = 'grabbing';
});

track.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const currentPosition = e.clientX;
  const diff = currentPosition - startPos;
  track.style.transform = `translateX(${prevTranslate + diff}px)`;
});

track.addEventListener('mouseup', () => {
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;
  
  // Determine direction based on drag distance
  if (movedBy < -100) {
    currentIndex++;
  } else if (movedBy > 100) {
    currentIndex--;
  }
  
  setPositionByIndex();
  prevTranslate = currentTranslate;
  track.style.cursor = 'grab';
});

track.addEventListener('mouseleave', () => {
  if (isDragging) {
    isDragging = false;
    setPositionByIndex();
    prevTranslate = currentTranslate;
    track.style.cursor = 'grab';
  }
});

// Prevent default drag behavior on images
track.addEventListener('dragstart', (e) => e.preventDefault());

// Recalculate positions on window resize
window.addEventListener('resize', () => {
  setPositionByIndex();
});