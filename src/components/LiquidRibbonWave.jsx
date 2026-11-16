import React, { useEffect, useRef } from 'react';

/**
 * SkillPulse-AI Enterprise Architectural Telemetry Backdrop:
 * Replaces wave ribbons with a precision SaaS architectural grid,
 * cursor-reactive spotlight illumination, orthogonal grid data beams,
 * and a refined geometric AI skill constellation.
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

    const GRID_SIZE = 64;

    // Pre-seeded depth-layered AI Skill Nodes
    const NODE_COUNT = 22;
    const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
      const seedA = Math.sin(i * 12.9898 + 1.7) * 43758.5453;
      const seedB = Math.cos(i * 78.233 + 2.3) * 24634.6345;
      const rx = seedA - Math.floor(seedA);
      const ry = seedB - Math.floor(seedB);
      const depth = 0.45 + (i % 5) * 0.13;
      return {
        bx: 0.06 + rx * 0.88,
        by: 0.08 + ry * 0.84,
        vx: (rx - 0.5) * 0.00022,
        vy: (ry - 0.5) * 0.00018,
        phase: i * 0.9,
        depth,
        isHub: i % 4 === 0,
      };
    });

    // Orthogonal grid data beams (horizontal & vertical traces traveling along grid lines)
    const BEAM_COUNT = 10;
    const beams = Array.from({ length: BEAM_COUNT }, (_, i) => ({
      isHorizontal: i % 2 === 0,
      lineIndex: 2 + ((i * 3) % 14),
      progress: (i * 0.13) % 1,
      speed: 0.0016 + (i % 4) * 0.00045,
      direction: i % 3 === 0 ? -1 : 1,
      length: 110 + (i % 3) * 35,
      isCyan: i % 2 === 0,
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

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      time += 0.014;

      const targetX = mouseRef.current?.x || 0;
      const targetY = mouseRef.current?.y || 0;
      smoothMouseX += (targetX - smoothMouseX) * 0.07;
      smoothMouseY += (targetY - smoothMouseY) * 0.07;

      ctx.clearRect(0, 0, width, height);

      const alphaMult = Math.min(1.15, Math.max(0.75, intensity));
      const cursorPx = (0.5 + smoothMouseX) * width;
      const cursorPy = (0.5 + smoothMouseY) * height;
      const shiftX = smoothMouseX * 18;
      const shiftY = smoothMouseY * 18;

      // 1. Soft Interactive Cursor Spotlight Aura
      const spotGrad = ctx.createRadialGradient(cursorPx, cursorPy, 10, cursorPx, cursorPy, 380);
      spotGrad.addColorStop(0, `rgba(17, 198, 222, ${(0.11 * alphaMult).toFixed(3)})`);
      spotGrad.addColorStop(0.5, `rgba(25, 136, 163, ${(0.05 * alphaMult).toFixed(3)})`);
      spotGrad.addColorStop(1, 'rgba(233, 234, 247, 0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Enterprise Architectural Precision Grid
      const cols = Math.ceil(width / GRID_SIZE) + 2;
      const rows = Math.ceil(height / GRID_SIZE) + 2;
      const offsetX = ((shiftX % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
      const offsetY = ((shiftY % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;

      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(25, 136, 163, ${(0.065 * alphaMult).toFixed(3)})`;
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

      // Grid Intersection Crosshairs (+) with Cursor Proximity Illumination
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if ((c + r) % 2 !== 0) continue;
          const gx = c * GRID_SIZE + offsetX;
          const gy = r * GRID_SIZE + offsetY;
          const distToCursor = Math.hypot(gx - cursorPx, gy - cursorPy);
          const proximity = Math.max(0, 1 - distToCursor / 320);

          const crossAlpha = (0.13 + proximity * 0.42) * alphaMult;
          const arm = 3 + proximity * 2;

          ctx.strokeStyle =
            proximity > 0.15
              ? `rgba(17, 198, 222, ${crossAlpha.toFixed(3)})`
              : `rgba(23, 35, 62, ${crossAlpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(gx - arm, gy);
          ctx.lineTo(gx + arm, gy);
          ctx.moveTo(gx, gy - arm);
          ctx.lineTo(gx, gy + arm);
          ctx.stroke();
        }
      }

      // 3. Orthogonal Telemetry Data Beams along Grid Lines
      for (let i = 0; i < beams.length; i++) {
        const b = beams[i];
        b.progress = (b.progress + b.speed) % 1;
        const effectiveProg = b.direction === 1 ? b.progress : 1 - b.progress;

        if (b.isHorizontal) {
          const rowIdx = b.lineIndex % Math.max(1, rows - 1);
          const y = Math.round(rowIdx * GRID_SIZE + offsetY) + 0.5;
          const headX = effectiveProg * (width + b.length * 2) - b.length;
          const tailX = headX - b.direction * b.length;

          const grad = ctx.createLinearGradient(tailX, y, headX, y);
          grad.addColorStop(0, 'rgba(17, 198, 222, 0)');
          grad.addColorStop(
            0.7,
            b.isCyan
              ? `rgba(17, 198, 222, ${(0.28 * alphaMult).toFixed(3)})`
              : `rgba(25, 136, 163, ${(0.25 * alphaMult).toFixed(3)})`
          );
          grad.addColorStop(
            1,
            b.isCyan
              ? `rgba(17, 198, 222, ${(0.75 * alphaMult).toFixed(3)})`
              : `rgba(25, 136, 163, ${(0.68 * alphaMult).toFixed(3)})`
          );

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tailX, y);
          ctx.lineTo(headX, y);
          ctx.stroke();

          ctx.fillStyle = `rgba(17, 198, 222, ${(0.85 * alphaMult).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(headX, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const colIdx = b.lineIndex % Math.max(1, cols - 1);
          const x = Math.round(colIdx * GRID_SIZE + offsetX) + 0.5;
          const headY = effectiveProg * (height + b.length * 2) - b.length;
          const tailY = headY - b.direction * b.length;

          const grad = ctx.createLinearGradient(x, tailY, x, headY);
          grad.addColorStop(0, 'rgba(25, 136, 163, 0)');
          grad.addColorStop(0.7, `rgba(25, 136, 163, ${(0.24 * alphaMult).toFixed(3)})`);
          grad.addColorStop(1, `rgba(17, 198, 222, ${(0.7 * alphaMult).toFixed(3)})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(x, tailY);
          ctx.lineTo(x, headY);
          ctx.stroke();

          ctx.fillStyle = `rgba(17, 198, 222, ${(0.8 * alphaMult).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, headY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Geometric AI Competency Graph & Telemetry Nodes
      const maxLinkDist = Math.min(width, height) * 0.22;
      const screenNodes = nodes.map((n) => {
        n.bx += n.vx;
        n.by += n.vy;
        if (n.bx < 0.05 || n.bx > 0.95) n.vx *= -1;
        if (n.by < 0.07 || n.by > 0.93) n.vy *= -1;

        const floatX = Math.sin(time * 0.65 + n.phase) * 10 * n.depth;
        const floatY = Math.cos(time * 0.55 + n.phase) * 9 * n.depth;
        const px = n.bx * width + floatX + smoothMouseX * 32 * n.depth;
        const py = n.by * height + floatY + smoothMouseY * 24 * n.depth;
        return { x: px, y: py, depth: n.depth, isHub: n.isHub, phase: n.phase };
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
          const lineAlpha = linkStrength * 0.26 * alphaMult;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle =
            a.isHub || b.isHub
              ? `rgba(17, 198, 222, ${lineAlpha.toFixed(3)})`
              : `rgba(25, 136, 163, ${(lineAlpha * 0.8).toFixed(3)})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();

          if (linkStrength > 0.45 && (i + j) % 3 === 0) {
            const pulseT = (time * 0.32 + i * 0.19 + j * 0.13) % 1;
            const sx = a.x + dx * pulseT;
            const sy = a.y + dy * pulseT;
            ctx.fillStyle = `rgba(17, 198, 222, ${(0.75 * linkStrength * alphaMult).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(sx, sy, 1.7, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Crisp Geometric Nodes
      for (let i = 0; i < screenNodes.length; i++) {
        const n = screenNodes[i];
        const pulse = 0.5 + 0.5 * Math.sin(time * 2.0 + n.phase);
        const r = 2.0 + n.depth * 1.6;

        if (n.isHub) {
          // Subtle radar ring around hub nodes
          ctx.strokeStyle = `rgba(17, 198, 222, ${((0.2 + pulse * 0.18) * alphaMult).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 4 + pulse * 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = n.isHub
          ? `rgba(17, 198, 222, ${(0.85 * alphaMult).toFixed(3)})`
          : `rgba(25, 136, 163, ${(0.68 * alphaMult).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${(0.88 * alphaMult).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
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
