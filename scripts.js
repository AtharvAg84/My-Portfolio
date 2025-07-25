document.addEventListener('DOMContentLoaded', () => {
  // Timeline Dragging
  const timeline = document.querySelector('.timeline');
  let isDown = false;
  let startX;
  let scrollLeft;

  timeline.addEventListener('mousedown', (e) => {
    isDown = true;
    timeline.classList.add('active');
    startX = e.pageX - timeline.offsetLeft;
    scrollLeft = timeline.scrollLeft;
    e.preventDefault();
  });

  timeline.addEventListener('mouseleave', () => {
    isDown = false;
    timeline.classList.remove('active');
  });

  timeline.addEventListener('mouseup', () => {
    isDown = false;
    timeline.classList.remove('active');
  });

  timeline.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const x = e.pageX - timeline.offsetLeft;
    const walk = (x - startX) * 2;
    timeline.scrollLeft = scrollLeft - walk;
  });

  const images = timeline.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // Projects Dragging
  const projectsGrid = document.querySelector('.projects__grid');
  let isDownProjects = false;
  let startXProjects;
  let scrollLeftProjects;

  projectsGrid.addEventListener('mousedown', (e) => {
    isDownProjects = true;
    projectsGrid.classList.add('active');
    startXProjects = e.pageX - projectsGrid.offsetLeft;
    scrollLeftProjects = projectsGrid.scrollLeft;
    e.preventDefault();
  });

  projectsGrid.addEventListener('mouseleave', () => {
    isDownProjects = false;
    projectsGrid.classList.remove('active');
  });

  projectsGrid.addEventListener('mouseup', () => {
    isDownProjects = false;
    projectsGrid.classList.remove('active');
  });

  projectsGrid.addEventListener('mousemove', (e) => {
    if (!isDownProjects) return;
    const x = e.pageX - projectsGrid.offsetLeft;
    const walk = (x - startXProjects) * 2;
    projectsGrid.scrollLeft = scrollLeftProjects - walk;
  });

  const projectsImages = projectsGrid.querySelectorAll('img');
  projectsImages.forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // Toggle Theme
  const themeToggle = document.querySelector("#theme-toggle");
  const body = document.body;

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    
    // Save preference
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      themeToggle.textContent = "🌙"; // Sun icon for light mode
    } else {
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "☀️"; // Moon icon for dark mode
    }
  });
});