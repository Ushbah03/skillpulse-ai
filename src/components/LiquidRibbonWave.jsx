import React, { useEffect, useRef } from 'react';

/**
 * Ultra-Smooth Continuous 3D Liquid Metallic Silk Ribbon Canvas
 * Uses continuous multi-layered path fills & radial lighting gradients
 * with zero segment seams for Apple/Spline-grade fluid wave fidelity.
 */
const LiquidRibbonWave = ({ mouseOffset = { x: 0, y: 0 } }) => {
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
      const count = 90;
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

      // 1. Continuous Smooth Metallic Ribbon Body (Zero Seams)
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

      // 2. Clip inside ribbon & paint subtle diagonal brushed-light gleam + depth shadow
      ctx.clip();

      const gleamX = (0.32 + Math.sin(config.t * 0.45 + config.phase) * 0.18) * width;
      const gleamGrad = ctx.createRadialGradient(
        gleamX,
        config.baseY - config.thickness * 0.15,
        width * 0.02,
        gleamX,
        config.baseY,
        width * 0.48
      );
      gleamGrad.addColorStop(0, 'rgba(218, 250, 255, 0.48)');
      gleamGrad.addColorStop(0.35, 'rgba(17, 198, 222, 0.28)');
      gleamGrad.addColorStop(1, 'rgba(6, 12, 26, 0)');
      ctx.fillStyle = gleamGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft bottom shadow fold for 3D cylindrical volume
      const shadowGrad = ctx.createLinearGradient(0, config.baseY - config.thickness, 0, config.baseY + config.thickness * 1.2);
      shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
      shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      shadowGrad.addColorStop(1, 'rgba(3, 7, 18, 0.85)');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      // 3. Crisp Glowing Specular Rim Edge along top fold
      ctx.save();
      ctx.beginPath();
      drawSmoothCurve(top, true);
      const rimGrad = ctx.createLinearGradient(0, 0, width, 0);
      rimGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.72)');
      rimGrad.addColorStop(0.28, 'rgba(17, 198, 222, 0.92)');
      rimGrad.addColorStop(0.65, 'rgba(25, 136, 163, 0.45)');
      rimGrad.addColorStop(1.0, 'rgba(17, 198, 222, 0.2)');
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = config.rimWidth || 2.2;
      ctx.shadowColor = '#11C6DE';
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.restore();

      // 4. Secondary Subtle Specular Bottom Lip
      ctx.save();
      ctx.beginPath();
      drawSmoothCurve(bot, true);
      ctx.strokeStyle = 'rgba(17, 198, 222, 0.25)';
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

      // Ambient Cyan-Blue Mist Behind Ribbons
      const mist = ctx.createRadialGradient(
        width * 0.45,
        height * 0.55,
        10,
        width * 0.45,
        height * 0.55,
        width * 0.6
      );
      mist.addColorStop(0, 'rgba(17, 198, 222, 0.16)');
      mist.addColorStop(0.5, 'rgba(25, 136, 163, 0.09)');
      mist.addColorStop(1, 'rgba(6, 11, 24, 0)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, width, height);

      // Layer 1: Deep Sweeping Background Ribbon
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
        rimWidth: 1.5,
        cStart: 'rgba(12, 34, 84, 0.75)',
        cBright: 'rgba(25, 136, 163, 0.65)',
        cMid: 'rgba(16, 62, 136, 0.72)',
        cDeep: 'rgba(9, 25, 64, 0.85)',
        cEnd: 'rgba(6, 14, 36, 0.85)'
      });

      // Layer 2: Primary Sculptural Electric Cyan Metallic Wave
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
        rimWidth: 2.5,
        cStart: 'rgba(22, 112, 168, 0.90)',
        cBright: 'rgba(17, 198, 222, 0.86)',
        cMid: 'rgba(25, 136, 163, 0.85)',
        cDeep: 'rgba(15, 52, 118, 0.92)',
        cEnd: 'rgba(8, 20, 52, 0.92)'
      });

      // Layer 3: Sharp Luminous Top Silk Fold
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
        cStart: 'rgba(17, 198, 222, 0.32)',
        cBright: 'rgba(180, 244, 255, 0.45)',
        cMid: 'rgba(17, 198, 222, 0.38)',
        cDeep: 'rgba(25, 136, 163, 0.25)',
        cEnd: 'rgba(10, 22, 52, 0.20)'
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="w-full h-full block pointer-events-none select-none"
    />
  );
};

export default LiquidRibbonWave;
