import React, { useEffect, useRef } from 'react';

/**
 * SkillPulse-AI Enterprise Architectural Telemetry Backdrop:
 * High-contrast, rich navy-sapphire (#17233E / #1B3154) and deep ocean teal (#1988A3 / #0077B6)
 * architectural grid, interactive cursor + scroll-reactive illumination wave,
 * prominent orthogonal laser beams, and geometric AI competency graph.
 */
const LiquidRibbonWave = ({ mouseOffset = { x: 0, y: 0 }, intensity = 1 }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef(mouseOffset);

  useEffect(() => {
    mouseRef.current = mouseOffset;
  }, [mouseOffset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let time = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    let pointerActive = false;

    // Scroll reactivity state
    let targetScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let smoothScrollY = targetScrollY;
    let scrollEnergy = 0; // Boosts blue prominence & beam velocity when scrolling

    const GRID_SIZE = 64;

    // Pre-seeded depth-layered AI Skill Nodes
    const NODE_COUNT = 26;
    const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
      const seedA = Math.sin(i * 12.9898 + 1.7) * 43758.5453;
      const seedB = Math.cos(i * 78.233 + 2.3) * 24634.6345;
      const rx = seedA - Math.floor(seedA);
      const ry = seedB - Math.floor(seedB);
      const depth = 0.5 + (i % 5) * 0.13;
      return {
        bx: 0.05 + rx * 0.9,
        by: 0.06 + ry * 0.88,
        vx: (rx - 0.5) * 0.00026,
        vy: (ry - 0.5) * 0.00022,
        phase: i * 0.9,
        depth,
        isHub: i % 3 === 0,
      };
    });

    // Orthogonal grid data beams (horizontal & vertical traces traveling along grid lines)
    const BEAM_COUNT = 14;
    const beams = Array.from({ length: BEAM_COUNT }, (_, i) => ({
      isHorizontal: i % 2 === 0,
      lineIndex: 1 + ((i * 2) % 16),
      progress: (i * 0.11) % 1,
      speed: 0.0022 + (i % 4) * 0.00055,
      direction: i % 3 === 0 ? -1 : 1,
      length: 140 + (i % 3) * 45,
      isDeepNavy: i % 3 === 0,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleWindowMouseMove = (e) => {
      pointerActive = true;
      mouseRef.current = {
        x: e.clientX / Math.max(1, window.innerWidth) - 0.5,
        y: e.clientY / Math.max(1, window.innerHeight) - 0.5,
      };
      scrollEnergy = Math.min(1, scrollEnergy + 0.08);
    };

    const handleWindowScroll = () => {
      const currentY = window.scrollY || 0;
      const delta = Math.abs(currentY - targetScrollY);
      targetScrollY = currentY;
      scrollEnergy = Math.min(1.2, scrollEnergy + Math.min(0.65, delta * 0.012));
    };

    const handleWindowWheel = (e) => {
      scrollEnergy = Math.min(1.2, scrollEnergy + Math.min(0.55, Math.abs(e.deltaY) * 0.004));
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('wheel', handleWindowWheel, { passive: true });

    const draw = () => {
      time += 0.015;

      const targetX = mouseRef.current?.x || 0;
      const targetY = mouseRef.current?.y || 0;
      smoothMouseX += (targetX - smoothMouseX) * 0.08;
      smoothMouseY += (targetY - smoothMouseY) * 0.08;

      smoothScrollY += (targetScrollY - smoothScrollY) * 0.1;
      scrollEnergy *= 0.94; // Smooth decay

      ctx.clearRect(0, 0, width, height);

      const boost = 1 + scrollEnergy * 0.55;
      const alphaMult = Math.min(1.4, Math.max(0.9, intensity) * boost);

      const cursorPx = (0.5 + smoothMouseX) * width;
      const cursorPy = (0.5 + smoothMouseY) * height;
      const shiftX = smoothMouseX * 26;
      const shiftY = smoothMouseY * 26 - smoothScrollY * 0.35;

      // 1. Prominent Deep Sapphire & Ocean Teal Spotlight Aura (follows cursor + intensifies on scroll)
      const spotRadius = 440 + scrollEnergy * 140;
      const spotGrad = ctx.createRadialGradient(cursorPx, cursorPy, 12, cursorPx, cursorPy, spotRadius);
      spotGrad.addColorStop(0, `rgba(23, 35, 62, ${Math.min(0.32, 0.18 * alphaMult).toFixed(3)})`);
      spotGrad.addColorStop(0.35, `rgba(25, 136, 163, ${Math.min(0.36, 0.22 * alphaMult).toFixed(3)})`);
      spotGrad.addColorStop(0.7, `rgba(17, 198, 222, ${Math.min(0.22, 0.12 * alphaMult).toFixed(3)})`);
      spotGrad.addColorStop(1, 'rgba(233, 234, 247, 0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);

      // Secondary Scroll-Reactive Horizontal Depth Band
      const scrollBandY = ((smoothScrollY * 0.65 + time * 40) % (height + 300)) - 150;
      const bandGrad = ctx.createLinearGradient(0, scrollBandY - 220, 0, scrollBandY + 220);
      bandGrad.addColorStop(0, 'rgba(25, 136, 163, 0)');
      bandGrad.addColorStop(0.5, `rgba(25, 136, 163, ${Math.min(0.26, (0.09 + scrollEnergy * 0.14) * alphaMult).toFixed(3)})`);
      bandGrad.addColorStop(1, 'rgba(25, 136, 163, 0)');
      ctx.fillStyle = bandGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. High-Contrast Enterprise Architectural Grid
      const cols = Math.ceil(width / GRID_SIZE) + 2;
      const rows = Math.ceil(height / GRID_SIZE) + 2;
      const offsetX = ((shiftX % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
      const offsetY = ((shiftY % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;

      ctx.lineWidth = 1.1;
      ctx.strokeStyle = `rgba(27, 49, 84, ${Math.min(0.24, 0.13 * alphaMult).toFixed(3)})`;
      ctx.beginPath();
      for (let c = -1; c < cols; c++) {
        const x = Math.round(c * GRID_SIZE + offsetX) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let r = -1; r < rows; r++) {
        const y = Math.round(r * GRID_SIZE + offsetY) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Illuminated Grid Cells & Crosshairs (+) near Cursor and Scroll Wave
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const gx = c * GRID_SIZE + offsetX;
          const gy = r * GRID_SIZE + offsetY;
          const distToCursor = Math.hypot(gx - cursorPx, gy - cursorPy);
          const cursorProx = Math.max(0, 1 - distToCursor / (340 + scrollEnergy * 90));
          const scrollProx = Math.max(0, 1 - Math.abs(gy - scrollBandY) / 200) * (0.35 + scrollEnergy * 0.65);
          const proximity = Math.min(1, Math.max(cursorProx, scrollProx));

          // Highlight active grid cell interior when cursor/scroll is close
          if (proximity > 0.32 && (c + r) % 2 === 0) {
            ctx.fillStyle = `rgba(25, 136, 163, ${((proximity - 0.32) * 0.22 * alphaMult).toFixed(3)})`;
            ctx.fillRect(gx, gy, GRID_SIZE, GRID_SIZE);
          }

          if ((c + r) % 2 !== 0) continue;

          const crossAlpha = Math.min(0.9, (0.26 + proximity * 0.58) * alphaMult);
          const arm = 3.5 + proximity * 2.8;

          ctx.strokeStyle =
            proximity > 0.18
              ? `rgba(25, 136, 163, ${crossAlpha.toFixed(3)})`
              : `rgba(23, 35, 62, ${crossAlpha.toFixed(3)})`;
          ctx.lineWidth = proximity > 0.25 ? 1.5 : 1.1;
          ctx.beginPath();
          ctx.moveTo(gx - arm, gy);
          ctx.lineTo(gx + arm, gy);
          ctx.moveTo(gx, gy - arm);
          ctx.lineTo(gx, gy + arm);
          ctx.stroke();
        }
      }

      // 3. Prominent Orthogonal Telemetry Laser Beams (Dark Sapphire & Ocean Blue)
      for (let i = 0; i < beams.length; i++) {
        const b = beams[i];
        b.progress = (b.progress + b.speed * (1 + scrollEnergy * 1.6)) % 1;
        const effectiveProg = b.direction === 1 ? b.progress : 1 - b.progress;

        if (b.isHorizontal) {
          const rowIdx = b.lineIndex % Math.max(1, rows - 1);
          const y = Math.round(rowIdx * GRID_SIZE + offsetY) + 0.5;
          const headX = effectiveProg * (width + b.length * 2) - b.length;
          const tailX = headX - b.direction * b.length;

          const grad = ctx.createLinearGradient(tailX, y, headX, y);
          grad.addColorStop(0, 'rgba(23, 35, 62, 0)');
          grad.addColorStop(
            0.55,
            b.isDeepNavy
              ? `rgba(27, 49, 84, ${Math.min(0.65, 0.45 * alphaMult).toFixed(3)})`
              : `rgba(25, 136, 163, ${Math.min(0.65, 0.48 * alphaMult).toFixed(3)})`
          );
          grad.addColorStop(
            1,
            b.isDeepNavy
              ? `rgba(23, 35, 62, ${Math.min(0.95, 0.85 * alphaMult).toFixed(3)})`
              : `rgba(0, 119, 182, ${Math.min(0.95, 0.88 * alphaMult).toFixed(3)})`
          );

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(tailX, y);
          ctx.lineTo(headX, y);
          ctx.stroke();

          ctx.fillStyle = b.isDeepNavy ? '#17233E' : '#1988A3';
          ctx.beginPath();
          ctx.arc(headX, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const colIdx = b.lineIndex % Math.max(1, cols - 1);
          const x = Math.round(colIdx * GRID_SIZE + offsetX) + 0.5;
          const headY = effectiveProg * (height + b.length * 2) - b.length;
          const tailY = headY - b.direction * b.length;

          const grad = ctx.createLinearGradient(x, tailY, x, headY);
          grad.addColorStop(0, 'rgba(25, 136, 163, 0)');
          grad.addColorStop(0.55, `rgba(27, 49, 84, ${Math.min(0.6, 0.42 * alphaMult).toFixed(3)})`);
          grad.addColorStop(1, `rgba(25, 136, 163, ${Math.min(0.95, 0.85 * alphaMult).toFixed(3)})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(x, tailY);
          ctx.lineTo(x, headY);
          ctx.stroke();

          ctx.fillStyle = '#17233E';
          ctx.beginPath();
          ctx.arc(x, headY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. High-Contrast Geometric AI Competency Graph & Telemetry Nodes
      const maxLinkDist = Math.min(width, height) * 0.25;
      const screenNodes = nodes.map((n) => {
        n.bx += n.vx * (1 + scrollEnergy * 0.8);
        n.by += n.vy * (1 + scrollEnergy * 0.8);
        if (n.bx < 0.04 || n.bx > 0.96) n.vx *= -1;
        if (n.by < 0.06 || n.by > 0.94) n.vy *= -1;

        const floatX = Math.sin(time * 0.7 + n.phase) * 12 * n.depth;
        const floatY = Math.cos(time * 0.6 + n.phase) * 11 * n.depth;
        const rawY = n.by * height + floatY + smoothMouseY * 28 * n.depth - smoothScrollY * 0.22 * n.depth;
        const wrappedY = ((rawY % height) + height) % height;
        const px = n.bx * width + floatX + smoothMouseX * 36 * n.depth;
        return { x: px, y: wrappedY, depth: n.depth, isHub: n.isHub, phase: n.phase };
      });

      // Architectural node connections & data packets
      for (let i = 0; i < screenNodes.length; i++) {
        const a = screenNodes[i];
        for (let j = i + 1; j < screenNodes.length; j++) {
          const b = screenNodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          if (dist > maxLinkDist) continue;

          const linkStrength = 1 - dist / maxLinkDist;
          const lineAlpha = Math.min(0.65, linkStrength * 0.44 * alphaMult);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle =
            a.isHub || b.isHub
              ? `rgba(25, 136, 163, ${lineAlpha.toFixed(3)})`
              : `rgba(27, 49, 84, ${(lineAlpha * 0.88).toFixed(3)})`;
          ctx.lineWidth = 1.15 + linkStrength * 0.6;
          ctx.stroke();

          if (linkStrength > 0.35 && (i + j) % 2 === 0) {
            const pulseT = (time * (0.38 + scrollEnergy * 0.25) + i * 0.19 + j * 0.13) % 1;
            const sx = a.x + dx * pulseT;
            const sy = a.y + dy * pulseT;
            ctx.fillStyle = `rgba(23, 35, 62, ${Math.min(0.95, 0.85 * linkStrength * alphaMult).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Prominent Deep-Blue & Teal Geometric Hub Nodes
      for (let i = 0; i < screenNodes.length; i++) {
        const n = screenNodes[i];
        const pulse = 0.5 + 0.5 * Math.sin(time * 2.2 + n.phase);
        const r = 2.6 + n.depth * 1.9;

        if (n.isHub) {
          // Outer radar ring in deep teal/navy
          ctx.strokeStyle = `rgba(25, 136, 163, ${Math.min(0.7, (0.36 + pulse * 0.26) * alphaMult).toFixed(3)})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 4.5 + pulse * 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Soft halo
        ctx.fillStyle = `rgba(25, 136, 163, ${Math.min(0.4, 0.24 * alphaMult).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.1, 0, Math.PI * 2);
        ctx.fill();

        // Rich dark blue / ocean teal core
        ctx.fillStyle = n.isHub
          ? `rgba(23, 35, 62, ${Math.min(0.98, 0.92 * alphaMult).toFixed(3)})`
          : `rgba(25, 136, 163, ${Math.min(0.95, 0.88 * alphaMult).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Bright cyan-white center dot
        ctx.fillStyle = '#11C6DE';
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('wheel', handleWindowWheel);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="w-full h-full pointer-events-none block"
    />
  );
};

export default LiquidRibbonWave;
