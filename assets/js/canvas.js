/**
 * CANVAS BACKGROUND ANIMATION
 * Interactive particle network with mouse interaction
 */

class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn("Canvas element not found");
      return;
    }

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.particleCount = 80;
    this.maxDistance = 120;
    this.speed = 0.5;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new Particle(this.canvas.width, this.canvas.height));
    }
  }

  setupEventListeners() {
    window.addEventListener("resize", () => {
      this.resize();
      this.createParticles();
    });

    this.canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Touch support
    this.canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
      }
    });

    this.canvas.addEventListener("touchend", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach((particle) => {
      particle.update(this.canvas.width, this.canvas.height, this.mouse);
      particle.draw(this.ctx);
    });

    // Connect particles
    this.connectParticles();

    requestAnimationFrame(() => this.animate());
  }

  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.maxDistance) {
          const opacity = 1 - distance / this.maxDistance;

          // Use theme-aware colors
          const isDarkMode = document.body.classList.contains("dark-mode");
          const color = isDarkMode ? "255, 255, 255" : "54, 133, 251";

          this.ctx.strokeStyle = `rgba(${color}, ${opacity * 0.3})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
}

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 3 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
  }

  update(canvasWidth, canvasHeight, mouse) {
    // Mouse interaction
    if (mouse.x != null && mouse.y != null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const maxDistance = mouse.radius;
      const force = (maxDistance - distance) / maxDistance;
      const directionX = forceDirectionX * force * this.density;
      const directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          const dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    } else {
      // Return to base position
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 20;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 20;
      }
    }

    // Move particles
    this.baseX += this.speedX;
    this.baseY += this.speedY;

    // Bounce off walls
    if (this.baseX < 0 || this.baseX > canvasWidth) {
      this.speedX *= -1;
    }
    if (this.baseY < 0 || this.baseY > canvasHeight) {
      this.speedY *= -1;
    }

    // Keep particles in bounds
    this.baseX = Math.max(0, Math.min(canvasWidth, this.baseX));
    this.baseY = Math.max(0, Math.min(canvasHeight, this.baseY));
  }

  draw(ctx) {
    const isDarkMode = document.body.classList.contains("dark-mode");
    const color = isDarkMode
      ? "rgba(255, 255, 255, 0.8)"
      : "rgba(54, 133, 251, 0.8)";

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    // Add glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ========== GEOMETRIC SHAPES ANIMATION ==========
class GeometricBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.shapes = [];
    this.shapeCount = 15;

    this.init();
  }

  init() {
    this.resize();
    this.createShapes();
    this.animate();

    window.addEventListener("resize", () => {
      this.resize();
      this.createShapes();
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createShapes() {
    this.shapes = [];
    for (let i = 0; i < this.shapeCount; i++) {
      this.shapes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 100 + 50,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        type: Math.floor(Math.random() * 3), // 0: triangle, 1: square, 2: hexagon
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
  }

  drawShape(shape) {
    this.ctx.save();
    this.ctx.translate(shape.x, shape.y);
    this.ctx.rotate(shape.rotation);

    const isDarkMode = document.body.classList.contains("dark-mode");
    const color = isDarkMode
      ? `rgba(255, 255, 255, ${shape.opacity})`
      : `rgba(54, 133, 251, ${shape.opacity})`;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    switch (shape.type) {
      case 0: // Triangle
        this.ctx.moveTo(0, -shape.size / 2);
        this.ctx.lineTo(shape.size / 2, shape.size / 2);
        this.ctx.lineTo(-shape.size / 2, shape.size / 2);
        break;
      case 1: // Square
        this.ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        break;
      case 2: // Hexagon
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = (Math.cos(angle) * shape.size) / 2;
          const y = (Math.sin(angle) * shape.size) / 2;
          if (i === 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }
        }
        break;
    }

    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.shapes.forEach((shape) => {
      shape.x += shape.speedX;
      shape.y += shape.speedY;
      shape.rotation += shape.rotationSpeed;

      // Wrap around screen
      if (shape.x < -shape.size) shape.x = this.canvas.width + shape.size;
      if (shape.x > this.canvas.width + shape.size) shape.x = -shape.size;
      if (shape.y < -shape.size) shape.y = this.canvas.height + shape.size;
      if (shape.y > this.canvas.height + shape.size) shape.y = -shape.size;

      this.drawShape(shape);
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ========== INITIALIZE ON PAGE LOAD ==========
window.addEventListener("DOMContentLoaded", () => {
  // Check if canvas exists
  let canvas = document.getElementById("backgroundCanvas");

  // Create canvas if it doesn't exist
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "backgroundCanvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";
    document.body.prepend(canvas);
  }

  // Choose animation style based on preference
  // Use particle network by default (more modern)
  const useParticles = true;

  if (useParticles) {
    new ParticleNetwork("backgroundCanvas");
  } else {
    new GeometricBackground("backgroundCanvas");
  }

  // Add instruction text if element exists
  const instruction = document.querySelector(".canvas-instruction");
  if (instruction) {
    instruction.textContent = "Move your mouse to interact with particles";
    instruction.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border-radius: 20px;
      font-size: 0.85rem;
      z-index: 1000;
      opacity: 0;
      animation: fadeInOut 4s ease-in-out;
    `;

    // Add fade animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        10%, 90% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
});

// ========== PERFORMANCE OPTIMIZATION ==========
// Pause animation when tab is not visible
document.addEventListener("visibilitychange", () => {
  const canvas = document.getElementById("backgroundCanvas");
  if (canvas) {
    canvas.style.opacity = document.hidden ? "0" : "1";
  }
});

// Reduce particle count on mobile
if (window.innerWidth < 768) {
  ParticleNetwork.prototype.particleCount = 40;
  GeometricBackground.prototype.shapeCount = 8;
}
