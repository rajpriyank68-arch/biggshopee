import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type: 'sparkle' | 'star' | 'dot';
}

export default function SparkleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = [
      '#D4AF37', // gold
      '#FFD700', // bright gold
      '#FFA500', // orange
      '#FF6B6B', // coral
      '#E8B4B8', // pink
      '#FFFFFF', // white
      '#F5DEB3', // wheat
      '#FFE4B5', // moccasin
    ];

    const createParticle = (): Particle => {
      const types: ('sparkle' | 'star' | 'dot')[] = ['sparkle', 'star', 'dot'];
      return {
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 1.5 - 0.5,
        size: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        decay: Math.random() * 0.005 + 0.002,
        type: types[Math.floor(Math.random() * types.length)],
      };
    };

    // Initialize particles
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push(createParticle());
    }

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    };

    const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      // Vertical line
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      // Horizontal line
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      // Diagonal lines
      const diagSize = size * 0.7;
      ctx.moveTo(x - diagSize, y - diagSize);
      ctx.lineTo(x + diagSize, y + diagSize);
      ctx.moveTo(x + diagSize, y - diagSize);
      ctx.lineTo(x - diagSize, y + diagSize);
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha -= particle.decay;

        if (particle.alpha <= 0 || particle.y < -10) {
          particlesRef.current[index] = createParticle();
          particlesRef.current[index].y = canvas.offsetHeight + 10;
          return;
        }

        ctx.save();
        ctx.globalAlpha = particle.alpha;

        if (particle.type === 'dot') {
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          // Add glow
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 10;
          ctx.fill();
        } else if (particle.type === 'star') {
          ctx.fillStyle = particle.color;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 8;
          drawStar(ctx, particle.x, particle.y, particle.size);
        } else {
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 6;
          drawSparkle(ctx, particle.x, particle.y, particle.size * 2);
        }

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}
