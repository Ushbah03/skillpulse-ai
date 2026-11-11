import React, { useEffect, useRef } from 'react';

/**
 * High-FPS 3D Parametric Liquid Glass Silk Ribbon Canvas
 * Designed for SkillPulse-AI's signature Light Ice-Blue (#E9EAF7) frosted theme:
 * Translucent cyan (#11C6DE), teal (#1988A3), sky-sapphire (#6AAEE0),
 * soft navy depth (#1B3154), and crystalline white specular rims (#FFFFFF).
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

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const buildWavePoints = ({ t, amp1, amp2, freq1, freq2, phase, baseY, thickness, twistSpeed }) => {
      const count = 96;
      const mx = (mouseRef.current?.x || 0) * 26;
      const my = (mouseRef.current?.y || 0) * 16;

      const top = [];
      const bot = [];

      for (let i = 0; i <= count; i++) {
        const nx = i / count;
        const x = nx * width;

        const spineY =
          baseY +
          my * Math.sin(nx * Math.PI) +
          Math.sin(nx * freq1 + t + phase) * amp1 +
          Math.cos(nx * freq2 - t * 0.65 + phase * 1.2) * amp2;

        const twistAngle = nx * 3.8 + t * twistSpeed + phase + mx * 0.008;
        const halfH = thickness * (0.34 + 0.66 * Math.abs(Math.cos(twistAngle)));
        const foldY = Math.sin(twistAngle) * (thickness * 0.25);

        top.push({ x, y: spineY - halfH + foldY });
        bot.push({ x, y: spineY + halfH + foldY });
      }

      return { top, bot };
    };

    const drawSmoothCurve = (pts, moveFirst = true) => {
      if (moveFirst) ctx.moveTo(pts[0].x, pts[0].y);
      else ctx.lineTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) * 0.5;
        const yc = (pts[i].y + pts[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);
    };

    const drawSilkBand = (config) => {
      const { top, bot } = buildWavePoints(config);
      const revBot = [...bot].reverse();

      // 1. Continuous Translucent Iridescent Blue-Cyan Silk Body
      ctx.save();
      ctx.beginPath();
      drawSmoothCurve(top, true);
      drawSmoothCurve(revBot, false);
      ctx.closePath();

      const bodyGrad = ctx.createLinearGradient(0, config.baseY - config.thickness, width, config.baseY + config.thickness);
      bodyGrad.addColorStop(0.0, config.cStart);
      bodyGrad.addColorStop(0.28, config.cBright);
      bodyGrad.addColorStop(0.55, config.cMid);
      bodyGrad.addColorStop(0.82, config.cDeep);
      bodyGrad.addColorStop(1.0, config.cEnd);

      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // 2. Clip inside ribbon & paint crystalline white/cyan gleam + airy blue depth
      ctx.clip();

      const gleamX = (0.34 + Math.sin(config.t * 0.45 + config.phase) * 0.18) * width;
      const gleamGrad = ctx.createRadialGradient(
        gleamX,
        config.baseY - config.thickness * 0.12,
        width * 0.02,
        gleamX,
        config.baseY,
        width * 0.52
      );
      gleamGrad.addColorStop(0, `rgba(255, 255, 255, ${(0.55 * intensity).toFixed(2)})`);
      gleamGrad.addColorStop(0.38, `rgba(17, 198, 222, ${(0.28 * intensity).toFixed(2)})`);
      gleamGrad.addColorStop(1, 'rgba(25, 136, 163, 0)');
      ctx.fillStyle = gleamGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft translucent cobalt volume shading (Light-Mode Glass Refraction)
      const shadowGrad = ctx.createLinearGradient(0, config.baseY - config.thickness, 0, config.baseY + config.thickness * 1.2);
      shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      shadowGrad.addColorStop(0.5, 'rgba(17, 198, 222, 0.05)');
      shadowGrad.addColorStop(1, 'rgba(27, 49, 84, 0.18)');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      // 3. Crisp Luminous White & Cyan Specular Rim Edge along top fold
      ctx.save();
      ctx.beginPath();
      drawSmoothCurve(top, true);
      const rimGrad = ctx.createLinearGradient(0, 0, width, 0);
      rimGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.92)');
      rimGrad.addColorStop(0.32, 'rgba(17, 198, 222, 0.78)');
      rimGrad.addColorStop(0.68, 'rgba(25, 136, 163, 0.55)');
      rimGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.75)');
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = config.rimWidth || 2.2;
      ctx.shadowColor = 'rgba(17, 198, 222, 0.65)';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // 4. Secondary Subtle Specular Bottom Lip
      ctx.save();
      ctx.beginPath();
      drawSmoothCurve(bot, true);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      // Ambient Ice-Cyan Mist
      const mist = ctx.createRadialGradient(
        width * 0.48,
        height * 0.54,
        10,
        width * 0.48,
        height * 0.54,
        width * 0.62
      );
      mist.addColorStop(0, `rgba(17, 198, 222, ${(0.18 * intensity).toFixed(2)})`);
      mist.addColorStop(0.5, `rgba(25, 136, 163, ${(0.10 * intensity).toFixed(2)})`);
      mist.addColorStop(1, 'rgba(233, 234, 247, 0)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, width, height);

      // Layer 1: Soft Sapphire-Slate Blue Glass Ribbon
      drawSilkBand({
        t: time * 0.8,
        amp1: height * 0.14,
        amp2: height * 0.07,
        freq1: 2.8,
        freq2: 4.5,
        phase: 1.9,
        baseY: height * 0.52,
        thickness: height * 0.30,
        twistSpeed: 0.7,
        rimWidth: 1.6,
        cStart: `rgba(138, 156, 183, ${(0.32 * intensity).toFixed(2)})`,
        cBright: `rgba(17, 198, 222, ${(0.30 * intensity).toFixed(2)})`,
        cMid: `rgba(25, 136, 163, ${(0.28 * intensity).toFixed(2)})`,
        cDeep: `rgba(27, 49, 84, ${(0.22 * intensity).toFixed(2)})`,
        cEnd: `rgba(138, 156, 183, ${(0.25 * intensity).toFixed(2)})`
      });

      // Layer 2: Primary Sculptural Electric Cyan & Ocean Teal Glass Wave
      drawSilkBand({
        t: time,
        amp1: height * 0.17,
        amp2: height * 0.08,
        freq1: 2.3,
        freq2: 3.9,
        phase: 0.15,
        baseY: height * 0.56,
        thickness: height * 0.34,
        twistSpeed: 1.0,
        rimWidth: 2.4,
        cStart: `rgba(25, 136, 163, ${(0.42 * intensity).toFixed(2)})`,
        cBright: `rgba(17, 198, 222, ${(0.48 * intensity).toFixed(2)})`,
        cMid: `rgba(88, 186, 218, ${(0.38 * intensity).toFixed(2)})`,
        cDeep: `rgba(25, 136, 163, ${(0.36 * intensity).toFixed(2)})`,
        cEnd: `rgba(27, 49, 84, ${(0.28 * intensity).toFixed(2)})`
      });

      // Layer 3: Sharp Luminous Crystalline White-Cyan Silk Fold
      drawSilkBand({
        t: time * 1.15,
        amp1: height * 0.11,
        amp2: height * 0.05,
        freq1: 3.2,
        freq2: 5.0,
        phase: 3.6,
        baseY: height * 0.63,
        thickness: height * 0.16,
        twistSpeed: 1.25,
        rimWidth: 1.8,
        cStart: `rgba(255, 255, 255, ${(0.42 * intensity).toFixed(2)})`,
        cBright: `rgba(17, 198, 222, ${(0.35 * intensity).toFixed(2)})`,
        cMid: `rgba(210, 243, 252, ${(0.38 * intensity).toFixed(2)})`,
        cDeep: `rgba(25, 136, 163, ${(0.24 * intensity).toFixed(2)})`,
        cEnd: `rgba(255, 255, 255, ${(0.28 * intensity).toFixed(2)})`
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      render();
      cancelAnimationFrame(animationFrameId);
    } else {
      render();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="w-full h-full block pointer-events-none select-none"
    />
  );
};

export default LiquidRibbonWave;
