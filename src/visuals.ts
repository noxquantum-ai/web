// Monochrome canvas visuals. No color, no glow, no particles:
// architectural metal and macro-circuitry rendered in black and white.

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function fit(canvas: HTMLCanvasElement): { ctx: CanvasRenderingContext2D; w: number; h: number } | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, rect.width);
  const h = Math.max(1, rect.height);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

/** Static chip-floorplan drawing for the hero: precise, flat, monochrome. */
export function paintField(canvas: HTMLCanvasElement): () => void {
  const fitted = fit(canvas);
  if (!fitted) return () => {};
  const { ctx, w, h } = fitted;

  // Deterministic pseudo-random so the composition reads as designed.
  function mulberry32(seed: number): () => number {
    let a = seed;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function paint(): void {
    const rand = mulberry32(20261009);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 1;

    // Floorplan blocks on the right two-thirds: nested hairline rectangles.
    const blocks = [
      { x: 0.6, y: 0.08, w: 0.34, h: 0.4 },
      { x: 0.68, y: 0.55, w: 0.26, h: 0.36 },
      { x: 0.52, y: 0.5, w: 0.13, h: 0.42 },
    ];
    for (const b of blocks) {
      const x = b.x * w;
      const y = b.y * h;
      const bw = b.w * w;
      const bh = b.h * h;
      ctx.strokeStyle = 'rgba(255,255,255,0.20)';
      ctx.strokeRect(x, y, bw, bh);
      // Inner core inset.
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.strokeRect(x + bw * 0.12, y + bh * 0.12, bw * 0.76, bh * 0.76);
      ctx.strokeStyle = 'rgba(255,255,255,0.28)';
      ctx.strokeRect(x + bw * 0.3, y + bh * 0.3, bw * 0.4, bh * 0.4);
    }

    // Bus lines with right-angle jogs running between blocks.
    for (let i = 0; i < 64; i++) {
      const y0 = rand() * h;
      const x0 = w * (0.5 + rand() * 0.12);
      const x1 = w * (0.62 + rand() * 0.2);
      const y1 = y0 + (rand() - 0.5) * h * 0.22;
      const x2 = w * (0.86 + rand() * 0.14);
      const bright = rand() > 0.86;
      ctx.strokeStyle = bright ? 'rgba(255,255,255,0.34)' : 'rgba(255,255,255,0.10)';
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.stroke();
      if (bright) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillRect(x2 - 2, y1 - 2, 4, 4);
      }
    }

    // Vertical buses tying top to bottom.
    for (let i = 0; i < 26; i++) {
      const x0 = w * (0.55 + rand() * 0.44);
      const y0 = rand() * h * 0.4;
      const len = h * (0.2 + rand() * 0.5);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0, y0 + len);
      ctx.stroke();
    }

    // Pads at scattered terminals.
    for (let i = 0; i < 30; i++) {
      const px = w * (0.55 + rand() * 0.43);
      const py = rand() * h;
      const hot = rand() > 0.8;
      ctx.fillStyle = hot ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.20)';
      ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
      if (hot) {
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.strokeRect(px - 5.5, py - 5.5, 11, 11);
      }
    }

    // Clear the header zone so navigation sits clean.
    const top = ctx.createLinearGradient(0, 0, 0, 150);
    top.addColorStop(0, 'rgba(0,0,0,1)');
    top.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, w, 150);

    // Fade the text zone to pure black.
    const fade = ctx.createLinearGradient(0, 0, w * 0.56, 0);
    fade.addColorStop(0, 'rgba(0,0,0,1)');
    fade.addColorStop(0.7, 'rgba(0,0,0,0.9)');
    fade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, w * 0.56, h);

    // Bottom shade for the overlaid headline.
    const bottom = ctx.createLinearGradient(0, h * 0.55, 0, h);
    bottom.addColorStop(0, 'rgba(0,0,0,0)');
    bottom.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = bottom;
    ctx.fillRect(0, h * 0.55, w, h * 0.45);
  }

  paint();

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(paint, 200);
  };
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}

/** Macro circuitry for the wide media card. */
export function paintMacro(canvas: HTMLCanvasElement): () => void {
  const fitted = fit(canvas);
  if (!fitted) return () => {};
  const { ctx, w, h } = fitted;

  let raf = 0;
  const t0 = performance.now();

  // Fixed trace layout so it reads as designed, not random.
  const traces = Array.from({ length: 26 }, (_, i) => {
    const y = (h / 26) * i + h / 52;
    const x0 = ((i * 197) % 60) * (w / 60);
    const x1 = x0 + w * (0.25 + ((i * 89) % 40) / 100);
    const x2 = x1 + w * 0.08;
    const y2 = y + (((i * 53) % 3) - 1) * h * 0.09;
    return { y, x0, x1, x2, y2, bright: i % 7 === 0 };
  });
  const pads = Array.from({ length: 14 }, (_, i) => ({
    x: ((i * 331) % 100) * (w / 100),
    y: ((i * 167) % 100) * (h / 100),
    r: 2 + ((i * 41) % 5),
  }));

  function frame(now: number): void {
    const t = (now - t0) / 1000;
    ctx.fillStyle = '#0a0c0b';
    ctx.fillRect(0, 0, w, h);

    // Soft defocused discs for depth.
    for (let i = 0; i < 7; i++) {
      const cx = ((i * 389) % 100) * (w / 100);
      const cy = ((i * 241) % 100) * (h / 100);
      const r = 60 + ((i * 97) % 120);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(255,255,255,0.055)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // PCB traces with right-angle bends.
    ctx.lineWidth = 1.2;
    for (const tr of traces) {
      ctx.strokeStyle = tr.bright ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.moveTo(tr.x0, tr.y);
      ctx.lineTo(tr.x1, tr.y);
      ctx.lineTo(tr.x2, tr.y2);
      ctx.lineTo(tr.x2 + w * 0.2, tr.y2);
      ctx.stroke();
      ctx.fillStyle = tr.bright ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.arc(tr.x0, tr.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pads, one of them pulsing gently.
    pads.forEach((p, i) => {
      const pulse = i === 3 && !REDUCED ? 0.5 + 0.3 * Math.sin(t * 1.4) : 0.4;
      ctx.fillStyle = `rgba(255,255,255,${pulse})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + 5, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Bottom shade for the overlaid label.
    const bottom = ctx.createLinearGradient(0, h * 0.5, 0, h);
    bottom.addColorStop(0, 'rgba(0,0,0,0)');
    bottom.addColorStop(1, 'rgba(0,0,0,0.66)');
    ctx.fillStyle = bottom;
    ctx.fillRect(0, h * 0.5, w, h * 0.5);

    if (!REDUCED) raf = requestAnimationFrame(frame);
  }

  if (REDUCED) frame(t0);
  else raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}
