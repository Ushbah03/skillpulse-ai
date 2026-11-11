import React, { useState, useEffect } from 'react';
import LiquidRibbonWave from './LiquidRibbonWave';

/**
 * Shared full-viewport Light Ice-Blue (#E9EAF7) ambient gradient & 3D liquid silk
 * ribbon backdrop for visitor pages, tracking pointer parallax cleanly without
 * duplicating backdrop markup or listeners across routes.
 */
const VisitorBackdrop = ({ waveIntensity = 0.9, waveOpacityClass = 'opacity-80' }) => {
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
      <div className="absolute -top-20 left-1/4 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[#1988A3]/20 blur-[90px] sm:blur-[110px] rounded-full" />
      <div className="absolute top-1/4 -right-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#11C6DE]/18 blur-[90px] sm:blur-[110px] rounded-full" />
      <div className="absolute top-1/2 -left-20 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-[#1B3154]/12 blur-[90px] sm:blur-[110px] rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[#8A9CB7]/28 blur-[90px] sm:blur-[110px] rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.10)_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:28px_28px] opacity-35" />

      {/* Full-Viewport Seamless 3D Liquid Ice-Cyan Glass Silk Wave */}
      <div
        className={`absolute inset-0 ${waveOpacityClass} [mask-image:linear-gradient(to_bottom,transparent_0%,black_16%,black_88%,transparent_100%)]`}
      >
        <LiquidRibbonWave mouseOffset={waveMouse} intensity={waveIntensity} />
      </div>
    </div>
  );
};

export default VisitorBackdrop;
