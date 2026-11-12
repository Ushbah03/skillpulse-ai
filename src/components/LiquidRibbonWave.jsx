import React, { useEffect, useRef } from 'react';

/**
 * SkillPulse-AI Signature Full-Viewport 3D Backdrop:
 * 1. Sculptural luminous 3D glass/aurora ribbons in cyan (#11C6DE), teal (#1988A3),
 *    sapphire (#4F8FD6), and crystalline white (#FFFFFF) over Light Ice-Blue (#E9EAF7).
 * 2. Interactive AI Neural Skill Constellation with depth-layered nodes, dynamic
 *    synaptic filaments, traveling telemetry pulses, and cursor parallax.
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

    // Pre-seeded depth-layered AI Skill Nodes for deterministic, silky 60fps motion
    const NODE_COUNT = 26;
    const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
      const seedA = Math.sin(i * 12.9898) * 43758.5453;
      const seedB = Math.cos(i * 78.233) * 24634.6345;
      const rx = seedA - Math.floor(seedA);
      const ry = seedB - Math.floor(seedB);
      const depth = 0.45 + (i % 5) * 0.14; // 0.45 (far) .. 1.01 (near)
      return {
        bx: rx,
        by: ry,
        vx: (rx - 0.5) * 0.00028,
        vy: (ry - 0.5) * 0.00022,
        phase: i * 0.85,
        depth,
        isAccent: i % 3 === 0,
      };
    });

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

    const ribbonConfigs = [
      {
        yBase: 0.24,
        amp1: 0.09,
        amp2: 0.045,
        freq1: 1.5,
        freq2: 2.7,
        speed: 0.65,
        phase: 0.0,
        thickness: 0.18,
        cTop: 'rgba(17, 198, 222, 0.22)',
        cMid: 'rgba(25, 136, 163, 0.12)',
        cBot: 'rgba(255, 255, 255, 0.02)',
        rim: 'rgba(255, 255, 255, 0.85)',
        rimGlow: 'rgba(17, 198, 222, 0.45)',
      },
      {
        yBase: 0.46,
        amp1: 0.11,
        amp2: 0.05,
        freq1: 1.35,
        freq2: 2.3,
        speed: -0.52,
        phase: 1.6,
        thickness: 0.22,
        cTop: 'rgba(25, 136, 163, 0.20)',
        cMid: 'rgba(106, 174, 224, 0.16)',
        cBot: 'rgba(233, 234, 247, 0.02)',
        rim: 'rgba(17, 198, 222, 0.72)',
        rimGlow: 'rgba(25, 136, 163, 0.4)',
      },
      {
        yBase: 0.68,
        amp1: 0.095,
        amp2: 0.04,
        freq1: 1.65,
        freq2: 3.1,
        speed: 0.58,
        phase: 3.2,
        thickness: 0.20,
        cTop: 'rgba(17, 198, 222, 0.24)',
        cMid: 'rgba(27, 49, 84, 0.09)',
        cBot: 'rgba(255, 255, 255, 0.02)',
        rim: 'rgba(255, 255, 255, 0.88)',
        rimGlow: 'rgba(17, 198, 222, 0.5)',
      },
      {
        yBase: 0.86,
        amp1: 0.07,
        amp2: 0.035,
        freq1: 1.45,
        freq2: 2.5,
        speed: -0.44,
        phase: 4.5,
        thickness: 0.16,
        cTop: 'rgba(25, 136, 163, 0.16)',
        cMid: 'rgba(17, 198, 222, 0.11)',
        cBot: 'rgba(233, 234, 247, 0.01)',
        rim: 'rgba(17, 198, 222, 0.58)',
        rimGlow: 'rgba(17, 198, 222, 0.3)',
      },
    ];

    const drawRibbon = (cfg, alphaMult) => {
      const steps = 48;
      const topPts = [];
      const botPts = [];
      const bandPx = height * cfg.thickness;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = t * width;
        const wave =
          Math.sin(t * Math.PI * cfg.freq1 + time * cfg.speed + cfg.phase + smoothMouseX * 1.4) *
            (height * cfg.amp1) +
          Math.cos(t * Math.PI * cfg.freq2 - time * cfg.speed * 0.7 + cfg.phase) *
            (height * cfg.amp2);
        const y = height * cfg.yBase + wave + smoothMouseY * 38;
        const pinch = 0.65 + 0.35 * Math.sin(t * Math.PI + time * 0.4 + cfg.phase);
        topPts.push({ x, y });
        botPts.push({ x, y: y + bandPx * pinch });
      }

      // Soft volumetric translucent body
      ctx.save();
      ctx.globalAlpha = alphaMult;
      ctx.beginPath();
      ctx.moveTo(topPts[0].x, topPts[0].y);
      for (let i = 1; i < topPts.length; i++) {
        const xc = (topPts[i - 1].x + topPts[i].x) * 0.5;
        const yc = (topPts[i - 1].y + topPts[i].y) * 0.5;
        ctx.quadraticCurveTo(topPts[i - 1].x, topPts[i - 1].y, xc, yc);
      }
      ctx.lineTo(topPts[topPts.length - 1].x, topPts[topPts.length - 1].y);

      for (let i = botPts.length - 1; i >= 0; i--) {
        ctx.lineTo(botPts[i].x, botPts[i].y);
      }
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, topPts[Math.floor(steps / 2)].y - 40, 0, botPts[Math.floor(steps / 2)].y + 40);
      grad.addColorStop(0, cfg.cTop);
      grad.addColorStop(0.55, cfg.cMid);
      grad.addColorStop(1, cfg.cBot);
      ctx.fillStyle = grad;
      ctx.fill();

      // Luminous specular rim highlight along crest
      ctx.beginPath();
      ctx.moveTo(topPts[0].x, topPts[0].y);
      for (let i = 1; i < topPts.length; i++) {
        const xc = (topPts[i - 1].x + topPts[i].x) * 0.5;
        const yc = (topPts[i - 1].y + topPts[i].y) * 0.5;
        ctx.quadraticCurveTo(topPts[i - 1].x, topPts[i - 1].y, xc, yc);
      }
      ctx.lineTo(topPts[topPts.length - 1].x, topPts[topPts.length - 1].y);
      ctx.shadowColor = cfg.rimGlow;
      ctx.shadowBlur = 14;
      ctx.strokeStyle = cfg.rim;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      time += 0.014;

      const targetX = mouseRef.current?.x || 0;
      const targetY = mouseRef.current?.y || 0;
      smoothMouseX += (targetX - smoothMouseX) * 0.06;
      smoothMouseY += (targetY - smoothMouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const alphaMult = Math.min(1.15, Math.max(0.75, intensity));

      // 1. Sculptural 3D Glass/Aurora Ribbons across full viewport height
      for (let i = 0; i < ribbonConfigs.length; i++) {
        drawRibbon(ribbonConfigs[i], alphaMult);
      }

      // 2. Interactive AI Neural Skill Constellation
      const maxLinkDist = Math.min(width, height) * 0.24;
      const screenNodes = nodes.map((n) => {
        n.bx += n.vx;
        n.by += n.vy;
        if (n.bx < 0.04 || n.bx > 0.96) n.vx *= -1;
        if (n.by < 0.06 || n.by > 0.94) n.vy *= -1;

        const floatX = Math.sin(time * 0.7 + n.phase) * 14 * n.depth;
        const floatY = Math.cos(time * 0.6 + n.phase) * 12 * n.depth;
        const px = n.bx * width + floatX + smoothMouseX * 42 * n.depth;
        const py = n.by * height + floatY + smoothMouseY * 32 * n.depth;
        return { x: px, y: py, depth: n.depth, isAccent: n.isAccent, phase: n.phase };
      });

      // Synaptic filaments + traveling data pulses
      for (let i = 0; i < screenNodes.length; i++) {
        const a = screenNodes[i];
        for (let j = i + 1; j < screenNodes.length; j++) {
          const b = screenNodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          if (dist > maxLinkDist) continue;

          const linkStrength = 1 - dist / maxLinkDist;
          const lineAlpha = linkStrength * 0.34 * alphaMult;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle =
            a.isAccent || b.isAccent
              ? `rgba(17, 198, 222, ${lineAlpha.toFixed(3)})`
              : `rgba(25, 136, 163, ${(lineAlpha * 0.85).toFixed(3)})`;
          ctx.lineWidth = 0.8 + linkStrength * 0.9;
          ctx.stroke();

          // Traveling AI telemetry spark along strong connections
          if (linkStrength > 0.38 && (i + j) % 2 === 0) {
            const pulseT = ((time * 0.38 + (i * 0.17 + j * 0.11)) % 1);
            const sx = a.x + dx * pulseT;
            const sy = a.y + dy * pulseT;
            ctx.fillStyle = `rgba(17, 198, 222, ${(0.85 * linkStrength * alphaMult).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(sx, sy, 2.0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Glowing AI Skill Nodes
      for (let i = 0; i < screenNodes.length; i++) {
        const n = screenNodes[i];
        const pulse = 0.5 + 0.5 * Math.sin(time * 2.1 + n.phase);
        const r = (2.4 + n.depth * 2.0);

        if (n.isAccent) {
          // Outer breathing halo ring
          ctx.strokeStyle = `rgba(17, 198, 222, ${((0.28 + pulse * 0.25) * alphaMult).toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 4.5 + pulse * 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Soft glow
        ctx.fillStyle = `rgba(17, 198, 222, ${(0.22 * alphaMult).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Crisp core node
        ctx.fillStyle = n.isAccent
          ? `rgba(17, 198, 222, ${(0.92 * alphaMult).toFixed(3)})`
          : `rgba(25, 136, 163, ${(0.78 * alphaMult).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Specular center dot
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.9 * alphaMult).toFixed(3)})`;
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
