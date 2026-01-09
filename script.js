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

function setPositionByIndex() {
  currentTranslate = currentIndex * -(cardWidth + gap);
  track.style.transform = `translateX(${currentTranslate}px)`;
}

function handleInfiniteScroll() {
  // Wrap around to beginning
  if (currentIndex >= totalCards) {
    currentIndex = 0;
  }
  // Wrap around to end
  if (currentIndex < 0) {
    currentIndex = totalCards - 1;
  }
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  handleInfiniteScroll();
  setPositionByIndex();
  prevTranslate = currentTranslate;
});

prevBtn.addEventListener('click', () => {
  currentIndex--;
  handleInfiniteScroll();
  setPositionByIndex();
  prevTranslate = currentTranslate;
});

// Touch events
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
  
  if (movedBy < -100) {
    currentIndex++;
  } else if (movedBy > 100) {
    currentIndex--;
  }
  
  handleInfiniteScroll();
  setPositionByIndex();
  prevTranslate = currentTranslate;
  track.style.cursor = 'grab';
});

// Mouse events
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
  
  if (movedBy < -100) {
    currentIndex++;
  } else if (movedBy > 100) {
    currentIndex--;
  }
  
  handleInfiniteScroll();
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

// Prevent default drag behavior
track.addEventListener('dragstart', (e) => e.preventDefault());

// Resize handler
window.addEventListener('resize', () => {
  setPositionByIndex();
});