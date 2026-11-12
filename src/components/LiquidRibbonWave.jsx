import React, { useEffect, useRef } from 'react';

/**
 * Architectural 3D Topographic Contour & Perspective Dot-Matrix Terrain Canvas
 * Designed for SkillPulse-AI's Light Ice-Blue (#E9EAF7) frosted theme:
 * Combines smooth undulating 3D elevation contours, perspective-scaled dot-matrix
 * lattice nodes, and cursor depth parallax without harsh wave bands.
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

    // Grid resolution tuned for 60fps smoothness across desktop & mobile
    const COLS = 44;
    const ROWS = 28;
    const projected = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({ sx: 0, sy: 0, elev: 0, depthFade: 0, scale: 1 }))
    );

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
      time += 0.011;

      const targetX = mouseRef.current?.x || 0;
      const targetY = mouseRef.current?.y || 0;
      smoothMouseX += (targetX - smoothMouseX) * 0.06;
      smoothMouseY += (targetY - smoothMouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const fov = Math.max(width, height) * 0.72;
      const viewerDist = 5.6;
      const camPitch = 0.48 + smoothMouseY * 0.14;
      const cosPitch = Math.cos(camPitch);
      const sinPitch = Math.sin(camPitch);

      const terrainWidth = 18.0;
      const terrainDepth = 11.0;
      const elevAmp = 0.72 * Math.min(1.25, Math.max(0.75, intensity));

      // 1. Compute 3D undulating elevation + full-viewport perspective projection
      for (let r = 0; r < ROWS; r++) {
        const nz = r / (ROWS - 1); // 0 (far) -> 1 (near)
        const zWorld = (0.5 - nz) * terrainDepth + 1.2;

        for (let c = 0; c < COLS; c++) {
          const nx = c / (COLS - 1); // 0 -> 1
          const xWorld = (nx - 0.5) * terrainWidth + smoothMouseX * 1.1;

          // Multi-harmonic organic topographic swell
          const waveA = Math.sin(xWorld * 0.48 + time * 0.85) * Math.cos(zWorld * 0.45 - time * 0.65);
          const waveB = Math.sin((xWorld * 0.34 - zWorld * 0.42) + time * 0.55) * 0.62;
          const waveC = Math.cos((xWorld * 0.78 + zWorld * 0.72) - time * 0.4) * 0.25;

          // Subtle pointer proximity ridge lift
          const dx = nx - 0.5 - smoothMouseX * 0.65;
          const dz = nz - 0.52 - smoothMouseY * 0.45;
          const distSq = dx * dx + dz * dz;
          const pointerLift = Math.exp(-distSq * 8.0) * 0.52;

          const yWorld = (waveA + waveB + waveC) * elevAmp + pointerLift * elevAmp - 0.75;

          // Pitch rotation around X-axis
          const ry = yWorld * cosPitch - zWorld * sinPitch;
          const rz = yWorld * sinPitch + zWorld * cosPitch + viewerDist;

          const safeZ = Math.max(1.1, rz);
          const scale = fov / safeZ;
          const sx = width * 0.5 + xWorld * scale * 0.38;
          const sy = height * 0.54 - ry * scale * 0.38;

          const elev = Math.max(0, Math.min(1, (yWorld + 1.55) / 2.2));
          const depthFade = Math.sin(nz * Math.PI) * (0.35 + 0.65 * nz);

          const pt = projected[r][c];
          pt.sx = sx;
          pt.sy = sy;
          pt.elev = elev;
          pt.depthFade = Math.max(0, Math.min(1, depthFade));
          pt.scale = scale / fov;
        }
      }

      const alphaScale = Math.min(1.2, Math.max(0.7, intensity));

      // 2. Draw smooth architectural topographic contour curves (back-to-front)
      for (let r = 1; r < ROWS - 1; r++) {
        const row = projected[r];
        const rowAlpha = row[Math.floor(COLS / 2)].depthFade;
        if (rowAlpha < 0.03) continue;

        ctx.beginPath();
        ctx.moveTo(row[0].sx, row[0].sy);
        for (let c = 1; c < COLS - 1; c++) {
          const xc = (row[c].sx + row[c + 1].sx) * 0.5;
          const yc = (row[c].sy + row[c + 1].sy) * 0.5;
          ctx.quadraticCurveTo(row[c].sx, row[c].sy, xc, yc);
        }
        const last = row[COLS - 1];
        ctx.lineTo(last.sx, last.sy);

        // Highlight every 3rd contour line in crisp cyan-teal, others in refined slate-blue
        const isMajorContour = r % 3 === 0;
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        if (isMajorContour) {
          grad.addColorStop(0, `rgba(25, 136, 163, 0.02)`);
          grad.addColorStop(0.22, `rgba(25, 136, 163, ${(0.28 * rowAlpha * alphaScale).toFixed(3)})`);
          grad.addColorStop(0.5, `rgba(17, 198, 222, ${(0.42 * rowAlpha * alphaScale).toFixed(3)})`);
          grad.addColorStop(0.78, `rgba(25, 136, 163, ${(0.28 * rowAlpha * alphaScale).toFixed(3)})`);
          grad.addColorStop(1, `rgba(25, 136, 163, 0.02)`);
          ctx.lineWidth = 1.15;
        } else {
          grad.addColorStop(0, `rgba(90, 109, 137, 0.01)`);
          grad.addColorStop(0.28, `rgba(90, 109, 137, ${(0.15 * rowAlpha * alphaScale).toFixed(3)})`);
          grad.addColorStop(0.5, `rgba(25, 136, 163, ${(0.20 * rowAlpha * alphaScale).toFixed(3)})`);
          grad.addColorStop(0.72, `rgba(90, 109, 137, ${(0.15 * rowAlpha * alphaScale).toFixed(3)})`);
          grad.addColorStop(1, `rgba(90, 109, 137, 0.01)`);
          ctx.lineWidth = 0.75;
        }
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      // 3. Draw subtle cross-meridian architectural hairlines (every 4th column)
      for (let c = 2; c < COLS - 2; c += 4) {
        ctx.beginPath();
        ctx.moveTo(projected[0][c].sx, projected[0][c].sy);
        for (let r = 1; r < ROWS - 1; r++) {
          const xc = (projected[r][c].sx + projected[r + 1][c].sx) * 0.5;
          const yc = (projected[r][c].sy + projected[r + 1][c].sy) * 0.5;
          ctx.quadraticCurveTo(projected[r][c].sx, projected[r][c].sy, xc, yc);
        }
        ctx.strokeStyle = `rgba(23, 35, 62, ${(0.075 * alphaScale).toFixed(3)})`;
        ctx.lineWidth = 0.65;
        ctx.stroke();
      }

      // 4. Draw perspective-scaled 3D dot-matrix lattice nodes on intersections
      for (let r = 1; r < ROWS - 1; r++) {
        for (let c = 1; c < COLS - 1; c++) {
          const pt = projected[r][c];
          if (pt.sx < -10 || pt.sx > width + 10 || pt.sy < -10 || pt.sy > height + 10) continue;

          // Gentle horizontal edge fade
          const edgeX = 1 - Math.pow(Math.abs(pt.sx / width - 0.5) * 2, 2.6);
          const nodeAlpha = Math.max(0, edgeX) * pt.depthFade * alphaScale;
          if (nodeAlpha < 0.04) continue;

          const dotRadius = (1.1 + pt.elev * 1.3) * (0.7 + pt.scale * 1.7);

          if (pt.elev > 0.60) {
            ctx.fillStyle = `rgba(17, 198, 222, ${(0.62 * nodeAlpha).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(pt.sx, pt.sy, dotRadius * 1.25, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(27, 49, 84, ${(0.28 * nodeAlpha).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(pt.sx, pt.sy, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
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
