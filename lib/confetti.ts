/**
 * Lightweight, zero-dependency canvas confetti effect
 * Runs client-side anywhere without external libraries.
 */
export function triggerConfetti(options?: {
  particleCount?: number;
  duration?: number;
  colors?: string[];
}) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const count = options?.particleCount || 90;
  const duration = options?.duration || 2600;
  const colors = options?.colors || [
    "#3A86FF", // Brand Blue
    "#0FA4A9", // Brand Teal
    "#10B981", // Emerald Green
    "#F59E0B", // Amber
    "#EC4899", // Pink
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
  ];

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();

  interface Particle {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    vx: number;
    vy: number;
    rotation: number;
    vRot: number;
    alpha: number;
    scale: number;
  }

  const particles: Particle[] = [];
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight * 0.45;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
    const speed = 7 + Math.random() * 12;
    particles.push({
      x: startX + (Math.random() - 0.5) * 60,
      y: startY + (Math.random() - 0.5) * 40,
      w: 8 + Math.random() * 6,
      h: 5 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 14,
      alpha: 1,
      scale: 0.8 + Math.random() * 0.4,
    });
  }

  const startTime = performance.now();

  function animate(now: number) {
    if (!ctx) return;
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // Gravity
      p.vx *= 0.985; // Air resistance
      p.rotation += p.vRot;
      p.alpha = Math.max(0, 1 - progress);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.scale(p.scale, p.scale);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(animate);
}
