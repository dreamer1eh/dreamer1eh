const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()';
const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

// Interactive particle system
const particles = [];
const particleCount = 130; // Balanced count for optimal effect
let mouse = { x: 0, y: 0, isActive: false };

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        originalVx: (Math.random() - 0.5) * 0.3,
        originalVy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 1.5,
        baseSize: Math.random() * 2.5 + 1.5,
        opacity: Math.random() * 0.4 + 0.6,
        baseOpacity: Math.random() * 0.4 + 0.6,
        color: '#00ff41'
    });
}

// Mouse tracking
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isActive = true;
});

canvas.addEventListener('mouseleave', () => {
    mouse.isActive = false;
});

function drawParticles() {
    // Update and draw particles
    particles.forEach(particle => {
        // Mouse interaction effects
        if (mouse.isActive) {
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxInteractionDistance = 180;
            
            if (distance < maxInteractionDistance) {
                // Subtle attraction effect
                const force = (maxInteractionDistance - distance) / maxInteractionDistance;
                const attraction = 0.015 * force;
                particle.vx += dx * attraction * 0.008;
                particle.vy += dy * attraction * 0.008;
                
                // Increase opacity and size when near mouse
                particle.opacity = Math.min(1.0, particle.baseOpacity + force * 0.4);
                particle.size = Math.min(6, particle.baseSize + force * 3);
            } else {
                // Return to normal state
                particle.vx = particle.vx * 0.98 + particle.originalVx * 0.02;
                particle.vy = particle.vy * 0.98 + particle.originalVy * 0.02;
                particle.opacity = particle.opacity * 0.98 + particle.baseOpacity * 0.02;
                particle.size = particle.size * 0.98 + particle.baseSize * 0.02;
            }
        } else {
            // Return to original movement when mouse is not active
            particle.vx = particle.vx * 0.99 + particle.originalVx * 0.01;
            particle.vy = particle.vy * 0.99 + particle.originalVy * 0.01;
            particle.opacity = particle.opacity * 0.99 + particle.baseOpacity * 0.01;
            particle.size = particle.size * 0.99 + particle.baseSize * 0.01;
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
    
    // Draw connections between nearby particles (ALWAYS VISIBLE)
    const maxDistance = 120;
    
    // Connections between particles - always visible
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance) * 0.5;
                
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.strokeStyle = '#00ff41';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
        
        // Connections to mouse cursor - enhanced range
        if (mouse.isActive) {
            const dx = mouse.x - particles[i].x;
            const dy = mouse.y - particles[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxMouseDistance = 150;
            
            if (distance < maxMouseDistance) {
                const opacity = (1 - distance / maxMouseDistance) * 0.8;
                
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 2.0;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
    

}

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw particles first (behind matrix text)
    drawParticles();

    // Draw matrix text
    ctx.fillStyle = '#0F0'; // Green text
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Recalculate columns for matrix
    const newColumns = canvas.width / fontSize;
    drops.length = newColumns;
    for (let x = drops.length; x < newColumns; x++) {
        drops[x] = 1;
    }
    
    // Update particle positions to fit new canvas size
    particles.forEach(particle => {
        if (particle.x > canvas.width) particle.x = Math.random() * canvas.width;
        if (particle.y > canvas.height) particle.y = Math.random() * canvas.height;
    });
});

setInterval(draw, 33);