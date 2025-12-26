/**
 * Hero Canvas Fluid Simulation
 * High-performance particle system with spatial hashing and mouse interaction.
 */

const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d', { alpha: true });

let width, height;
let particles = [];
const PARTICLE_COUNT = 3000;
const GRID_SIZE = 40; // Spatial grid cell size
let grid = {};

// Mouse interaction state
const mouse = {
    x: -1000,
    y: -1000,
    isActive: false,
    isClicking: false
};

// Configuration
const config = {
    baseSpeed: 0.5,
    maxSpeed: 8,
    friction: 0.96,
    colorSpeed: 0.05, // Speed of color hue change
    mouseForce: 1.5,
    clickForce: 15,   // Blackhole force
    particleSize: 1.8
};

// Resize handling
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.querySelector('.hero').clientHeight || window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Mouse Event Listeners
document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isActive = true;
});

document.querySelector('.hero').addEventListener('mouseleave', () => {
    mouse.isActive = false;
    mouse.x = -1000;
    mouse.y = -1000;
});

document.querySelector('.hero').addEventListener('mousedown', () => {
    mouse.isClicking = true;
});

document.querySelector('.hero').addEventListener('mouseup', () => {
    mouse.isClicking = false;
});

// Spatial Hash Helper
function getGridKey(x, y) {
    const gx = Math.floor(x / GRID_SIZE);
    const gy = Math.floor(y / GRID_SIZE);
    return `${gx},${gy}`;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * config.baseSpeed;
        this.vy = (Math.random() - 0.5) * config.baseSpeed;
        this.hue = Math.random() * 60 + 120; // Greens to Cyans (initial)
        this.size = Math.random() * config.particleSize + 0.5;
        this.density = 0;
    }

    update() {
        // Apply Physics
        this.x += this.vx;
        this.y += this.vy;

        // Friction
        this.vx *= config.friction;
        this.vy *= config.friction;

        // Base movement
        if (!mouse.isClicking) {
             // Gentle ambient drift if not clicking
             const time = Date.now() * 0.001;
             this.vx += Math.sin(time + this.y * 0.01) * 0.02;
             this.vy += Math.cos(time + this.x * 0.01) * 0.02;
        }

        // Mouse Interaction
        if (mouse.isActive) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            if (mouse.isClicking) {
                // Blackhole effect (Suck in)
                if (dist > 10) { // Avoid singularity
                    const force = config.clickForce / dist;
                    this.vx += dx * force * 0.01;
                    this.vy += dy * force * 0.01;
                }
            } else {
                // Repulsion / Flow effect
                const interactionRadius = 200;
                if (dist < interactionRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (interactionRadius - dist) / interactionRadius;
                    
                    // Push away slightly perpendicular to create swirl/fluid feel
                    this.vx -= Math.cos(angle) * force * config.mouseForce;
                    this.vy -= Math.sin(angle) * force * config.mouseForce;
                }
            }
        }

        // Speed limit
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > config.maxSpeed) {
            this.vx = (this.vx / speed) * config.maxSpeed;
            this.vy = (this.vy / speed) * config.maxSpeed;
        }

        // Screen wrapping
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Color update based on speed and density
        // Higher speed = more blue/purple, Lower speed = green/yellow
        this.hue = 150 + (speed * 20) + (this.density * 2);
        if (mouse.isClicking) this.hue = 280 + (speed * 10); // Purple/Red shift when sucking
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Neon fluorescent color
        ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, 0.8)`;
        ctx.fill();
    }
}

// Initialize Particles
function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

// Main Animation Loop
function animate() {
    // Clear with trail effect
    ctx.fillStyle = 'rgba(10, 5, 20, 0.2)'; // Very dark purple/black with transparency for trails
    ctx.fillRect(0, 0, width, height);

    // Set composition for glowing effect
    ctx.globalCompositeOperation = 'lighter';

    // Spatial Hash Clear/Build could go here for true particle-particle collision, 
    // but for 3000 particles at 60fps on web, we might simulate fluid density visually 
    // rather than calculating O(N) neighbor checks every frame if we want pure raw speed.
    // However, the prompt asked for "collision physics". 
    // Let's do a lightweight density check using the grid.

    grid = {};
    particles.forEach((p, index) => {
        const key = getGridKey(p.x, p.y);
        if (!grid[key]) grid[key] = [];
        grid[key].push(index);
    });

    particles.forEach((p, index) => {
        // Density calculation (simplified fluid dynamics)
        const key = getGridKey(p.x, p.y);
        let neighbors = grid[key] || [];
        
        // Check adjacent cells for smoother density
        // (For extreme performance, maybe just check own cell)
        
        p.density = neighbors.length; // Simple density approximation
        
        // Optional: Simple soft collision/pressure
        if (p.density > 5) {
             // Move slightly away from random neighbor to simulate pressure
             if (neighbors.length > 1) {
                 const otherIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
                 if (otherIdx !== index) {
                     const other = particles[otherIdx];
                     const dx = p.x - other.x;
                     const dy = p.y - other.y;
                     const distSq = dx*dx + dy*dy;
                     if (distSq < p.size * p.size * 4 && distSq > 0) {
                         const dist = Math.sqrt(distSq);
                         const overlap = (p.size * 2 - dist) * 0.5;
                         const nx = dx / dist;
                         const ny = dy / dist;
                         
                         p.vx += nx * overlap * 0.1;
                         p.vy += ny * overlap * 0.1;
                     }
                 }
             }
        }

        p.update();
        p.draw();
    });

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(animate);
}

// Start
init();
animate();
