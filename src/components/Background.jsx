import { memo, useEffect, useRef } from 'react';

const Background = memo(function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const particleCount = Math.min(30, Math.floor(window.innerWidth / 50));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.25 + 0.08,
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(8, 145, 178, ${p.opacity})`;
        ctx.fill();
      });
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(8, 145, 178, ${0.06 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden" style={{ background: '#f0f4f8' }}>
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(8, 145, 178, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(217, 119, 6, 0.02) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.015) 0%, transparent 60%),
            #f0f4f8
          `
        }}
      />
      
      {/* Animated mesh */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: `
            radial-gradient(circle at 15% 20%, rgba(8, 145, 178, 0.06) 0%, transparent 30%),
            radial-gradient(circle at 85% 80%, rgba(217, 119, 6, 0.04) 0%, transparent 30%),
            radial-gradient(circle at 50% 50%, rgba(8, 145, 178, 0.03) 0%, transparent 40%)
          `,
          animation: 'gradient-shift 20s ease-in-out infinite',
          backgroundSize: '200% 200%'
        }}
      />
      
      {/* Subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(15,23,42,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Particle canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.6 }}
      />
    </div>
  );
});

export default Background;
