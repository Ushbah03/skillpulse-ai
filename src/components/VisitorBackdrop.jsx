import React, { useState, useEffect } from 'react';
import LiquidRibbonWave from './LiquidRibbonWave';

/**
 * Shared full-viewport Light Ice-Blue (#E9EAF7) & Deep Sapphire/Teal
 * architectural telemetry backdrop for visitor and authentication pages.
 */
const VisitorBackdrop = ({ waveIntensity = 1.05, waveOpacityClass = 'opacity-100' }) => {
  const [waveMouse, setWaveMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setWaveMouse({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute -top-20 left-1/4 w-[380px] sm:w-[580px] h-[380px] sm:h-[580px] bg-[#1988A3]/28 blur-[95px] sm:blur-[115px] rounded-full" />
      <div className="absolute top-1/4 -right-20 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] bg-[#1B3154]/22 blur-[95px] sm:blur-[115px] rounded-full" />
      <div className="absolute top-1/2 -left-20 w-[380px] sm:w-[620px] h-[380px] sm:h-[620px] bg-[#17233E]/20 blur-[95px] sm:blur-[115px] rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[380px] sm:w-[560px] h-[380px] sm:h-[560px] bg-[#1988A3]/26 blur-[95px] sm:blur-[115px] rounded-full" />

      {/* Full-Viewport Enterprise Architectural Telemetry Grid & AI Constellation */}
      <div className={`absolute inset-0 ${waveOpacityClass}`}>
        <LiquidRibbonWave mouseOffset={waveMouse} intensity={waveIntensity} />
      </div>
    </div>
  );
};

export default VisitorBackdrop;
