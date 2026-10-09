// Monochrome canvas visuals. No color, no glow, no particles:
// architectural metal and macro-circuitry rendered in black and white.

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

/**
 * Chip-floorplan drawing for the hero: precise, flat, monochrome. At rest it is a
 * still image; when the pointer is near, individual bus lines bend away from it.
 */
export function paintField(canvas: HTMLCanvasElement): () => void {
  let fitted = fit(canvas);
  if (!fitted) return () => {};
  const ctx = fitted.ctx;
  let w = fitted.w;
  let h = fitted.h;

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

  interface Bus { x0: number; y0: number; x1: number; y1: number; x2: number; bright: boolean; o0: number; o1: number; oj: number }
  interface Rail { x: number; y0: number; y1: number; o: number }
  let buses: Bus[] = [];
  let rails: Rail[] = [];
  let pads: { x: number; y: number; hot: boolean }[] = [];

  // Same random sequence, in the same order, as the original static drawing.
  function layout(): void {
    const rand = mulberry32(20261009);
    buses = [];
    for (let i = 0; i < 64; i++) {
      const y0 = rand() * h;
      const x0 = w * (0.5 + rand() * 0.12);
      const x1 = w * (0.62 + rand() * 0.2);
      const y1 = y0 + (rand() - 0.5) * h * 0.22;
      const x2 = w * (0.86 + rand() * 0.14);
      const bright = rand() > 0.86;
      buses.push({ x0, y0, x1, y1, x2, bright, o0: 0, o1: 0, oj: 0 });
    }
    rails = [];
    for (let i = 0; i < 26; i++) {
      const x = w * (0.55 + rand() * 0.44);
      const y0 = rand() * h * 0.4;
      const len = h * (0.2 + rand() * 0.5);
      rails.push({ x, y0, y1: y0 + len, o: 0 });
    }
    pads = [];
    for (let i = 0; i < 30; i++) {
      const x = w * (0.55 + rand() * 0.43);
      const y = rand() * h;
      pads.push({ x, y, hot: rand() > 0.8 });
    }
  }

  function paint(): void {
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
    for (const b of buses) {
      const ya = b.y0 + b.o0;
      const yb = b.y1 + b.o1;
      const xj = b.x1 + b.oj;
      ctx.strokeStyle = b.bright ? 'rgba(255,255,255,0.34)' : 'rgba(255,255,255,0.10)';
      ctx.beginPath();
      ctx.moveTo(b.x0, ya);
      ctx.lineTo(xj, ya);
      ctx.lineTo(xj, yb);
      ctx.lineTo(b.x2, yb);
      ctx.stroke();
      if (b.bright) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillRect(b.x2 - 2, yb - 2, 4, 4);
      }
    }

    // Vertical buses tying top to bottom.
    for (const r of rails) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.moveTo(r.x + r.o, r.y0);
      ctx.lineTo(r.x + r.o, r.y1);
      ctx.stroke();
    }

    // Pads at scattered terminals.
    for (const p of pads) {
      ctx.fillStyle = p.hot ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.20)';
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      if (p.hot) {
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.strokeRect(p.x - 5.5, p.y - 5.5, 11, 11);
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

  layout();
  paint();

  // --- Pointer interaction: lines near the cursor part around it, each on its own spring. ---
  const REACH = 190; // px of influence
  const PUSH = 30; // max px a line moves
  const cursor = { x: 0, y: 0, on: false };
  let raf = 0;

  // Distance from a point to a horizontal / vertical segment.
  const distH = (xa: number, xb: number, y: number) =>
    Math.hypot(Math.max(Math.min(xa, xb) - cursor.x, 0, cursor.x - Math.max(xa, xb)), y - cursor.y);
  const distV = (x: number, ya: number, yb: number) =>
    Math.hypot(x - cursor.x, Math.max(Math.min(ya, yb) - cursor.y, 0, cursor.y - Math.max(ya, yb)));
  // Signed push away from the cursor, fading smoothly with distance.
  const push = (coord: number, from: number, dist: number) =>
    cursor.on ? Math.sign(coord - from || 1) * PUSH * Math.exp(-((dist / REACH) ** 2)) : 0;

  function step(): void {
    raf = 0;
    let moving = false;
    const ease = (cur: number, to: number, k: number) => {
      const next = cur + (to - cur) * k;
      if (Math.abs(next - to) > 0.05) moving = true;
      return Math.abs(next - to) > 0.05 ? next : to;
    };
    buses.forEach((b, i) => {
      const k = 0.07 + (i % 5) * 0.025; // each line settles at its own pace
      b.o0 = ease(b.o0, push(b.y0, cursor.y, distH(b.x0, b.x1, b.y0)), k);
      b.o1 = ease(b.o1, push(b.y1, cursor.y, distH(b.x1, b.x2, b.y1)), k);
      b.oj = ease(b.oj, push(b.x1, cursor.x, distV(b.x1, b.y0, b.y1)), k);
    });
    rails.forEach((r, i) => {
      r.o = ease(r.o, push(r.x, cursor.x, distV(r.x, r.y0, r.y1)), 0.06 + (i % 4) * 0.025);
    });
    paint();
    if (moving) raf = requestAnimationFrame(step);
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const last = { x: 0, y: 0 };
  const aim = () => {
    const rect = canvas.getBoundingClientRect();
    cursor.x = last.x - rect.left;
    cursor.y = last.y - rect.top;
    cursor.on = cursor.x >= 0 && cursor.x <= rect.width && cursor.y >= 0 && cursor.y <= rect.height;
    if (!raf) raf = requestAnimationFrame(step);
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    last.x = e.clientX;
    last.y = e.clientY;
    aim();
  };
  const onLeave = () => {
    cursor.on = false;
    if (!raf) raf = requestAnimationFrame(step);
  };
  if (!reduced) {
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', aim, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
  }

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      fitted = fit(canvas);
      if (!fitted) return;
      w = fitted.w;
      h = fitted.h;
      layout();
      paint();
    }, 200);
  };
  window.addEventListener('resize', onResize);
  return () => {
    window.clearTimeout(resizeTimer);
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('scroll', aim);
    document.documentElement.removeEventListener('pointerleave', onLeave);
  };
}
