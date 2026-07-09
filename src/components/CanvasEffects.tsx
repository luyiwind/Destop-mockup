import { useEffect, useRef } from 'react';

export function CanvasEffects({ showRain, showFireflies }: { showRain: boolean, showFireflies: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const raindrops = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      l: Math.random() * 15 + 10,
      xs: Math.random() * 2 - 1,
      ys: Math.random() * 15 + 15
    }));

    const fireflies = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: Math.random() * 2 + 1,
      ang: Math.random() * Math.PI * 2,
      v: Math.random() * 0.8 + 0.2
    }));

    let animationId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.01;

      if (showRain) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (let i = 0; i < raindrops.length; i++) {
          const p = raindrops[i];
          ctx.lineWidth = p.l * 0.1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.xs, p.y + p.ys);
          p.x += p.xs;
          p.y += p.ys;
          if (p.y > h) {
            p.x = Math.random() * w;
            p.y = -20;
          }
        }
        ctx.stroke();
      }

      if (showFireflies) {
        for (let i = 0; i < fireflies.length; i++) {
          const f = fireflies[i];
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.s, 0, Math.PI * 2);
          const opacity = Math.sin(time * 5 + i) * 0.4 + 0.6;
          ctx.fillStyle = `rgba(255, 210, 120, ${opacity})`;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(255, 210, 120, ${opacity})`;
          ctx.fill();
          
          f.x += Math.cos(f.ang) * f.v;
          f.y += Math.sin(f.ang) * f.v;
          f.ang += (Math.random() - 0.5) * 0.1;
          
          if (f.x < -10) f.x = w + 10;
          if (f.x > w + 10) f.x = -10;
          if (f.y < -10) f.y = h + 10;
          if (f.y > h + 10) f.y = -10;
        }
        ctx.shadowBlur = 0; // reset shadow for next frame elements if needed
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [showRain, showFireflies]);

  if (!showRain && !showFireflies) return null;

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 block" />
  );
}
