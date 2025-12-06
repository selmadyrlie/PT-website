// Dark mode toggle
const toggle = document.getElementById("theme-toggle");
const root = document.documentElement;

if (localStorage.theme === "dark" || (!localStorage.theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  root.classList.add("dark");
}

toggle.addEventListener("click", () => {
  root.classList.toggle("dark");
  localStorage.theme = root.classList.contains("dark") ? "dark" : "light";
});

// Carousel
const track = document.querySelector('.testimonial-track');
const cards = Array.from(document.querySelectorAll('.testimonial-card'));
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

cards.forEach(card => track.appendChild(card.cloneNode(true)));

let index = 0;
const totalCards = cards.length;
const cardWidth = cards[0].offsetWidth + 40;

function updateCarousel() {
  track.style.transform = `translateX(${-index * cardWidth}px)`;
}

nextBtn.addEventListener('click', () => {
  index++;
  updateCarousel();
  if (index >= totalCards) {
    setTimeout(() => {
      track.style.transition = 'none';
      index = 0;
      track.style.transform = 'translateX(0)';
      requestAnimationFrame(() => track.style.transition = 'transform 0.5s ease');
    }, 500);
  }
});

prevBtn.addEventListener('click', () => {
  if (index <= 0) {
    index = totalCards;
    track.style.transition = 'none';
    track.style.transform = `translateX(${-index * cardWidth}px)`;
    requestAnimationFrame(() => {
      track.style.transition = 'transform 0.5s ease';
      index--;
      updateCarousel();
    });
  } else {
    index--;
    updateCarousel();
  }
});

let startX = 0;
track.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive:true});
track.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) nextBtn.click();
  if (endX - startX > 50) prevBtn.click();
});