const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('header, section');
const radios = document.querySelectorAll('input[name="tab"]');
const glider = document.querySelector('.glider');

// Function to scroll smoothly when tab is clicked
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    let targetSection = index === 0 ? document.querySelector('#header') : document.querySelector(`#section${index}`);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// Fade-in sections
const fadeSections = document.querySelectorAll('header, section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.05 });
fadeSections.forEach(section => observer.observe(section));
document.querySelector('header').classList.add('visible');

// Auto-update glider and active tab on scroll
window.addEventListener('scroll', () => {
  let currentIndex = 0;
  sections.forEach((section, index) => {
    const top = section.getBoundingClientRect().top;
    if (top - 60 <= window.innerHeight / 2) currentIndex = index;
  });

  radios.forEach(r => r.checked = false);
  radios[currentIndex].checked = true;

  // Correct glider position
  const activeTab = tabs[currentIndex];
  const tabRect = activeTab.getBoundingClientRect();
  const containerRect = activeTab.parentElement.getBoundingClientRect();
  const offset = tabRect.left - containerRect.left;
  glider.style.width = `${tabRect.width}px`;
  glider.style.transform = `translateX(${offset}px)`;
});

// Initial glider setup
window.dispatchEvent(new Event('scroll'));
