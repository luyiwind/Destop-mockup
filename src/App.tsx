/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { CanvasEffects } from './components/CanvasEffects';
import { DeviceLayer } from './components/DeviceLayer';
import { TransformState } from './types';

const DEFAULT_TRANSFORM: TransformState = {
  tx: 0, ty: 0, tz: 0,
  rx: 25, ry: -10, rz: -5,
  sx: 1, sy: 1,
  perspective: 1000,
  bezel: 16, radius: 40,
  width: 375, height: 812
};

export default function App() {
  const [transform, setTransform] = useState<TransformState>(DEFAULT_TRANSFORM);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [showRain, setShowRain] = useState(false);
  const [showFireflies, setShowFireflies] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h' && document.activeElement?.tagName !== 'INPUT') {
        setUiVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0c0a09] text-white font-sans selection:bg-white/20">
      {/* Background Desk Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#0c0a09]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Ambient Lamp Glow */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]" />
      </div>

      {/* User Uploaded Background Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${bgImage ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}
      >
         {!bgImage && (
           <div className="w-full h-full flex items-center justify-center pointer-events-none">
             <div className="text-zinc-600/50 font-medium tracking-widest uppercase text-xs mt-96">
               Upload a background image
             </div>
           </div>
         )}
      </div>

      {/* Screen Glow Effect */}
      {showGlow && (
        <div className="absolute inset-0 bg-orange-500/15 mix-blend-overlay pointer-events-none animate-warm-pulse" />
      )}

      {/* Device Layer */}
      <DeviceLayer transform={transform} videoSrc={videoSrc} />

      {/* Canvas Effects */}
      <CanvasEffects showRain={showRain} showFireflies={showFireflies} />

      {/* Control Panel Layer */}
      <div className={`transition-opacity duration-300 ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} absolute inset-0 z-50 pointer-events-none`}>
         <ControlPanel 
           transform={transform} 
           setTransform={setTransform}
           bgImage={bgImage} setBgImage={setBgImage}
           videoSrc={videoSrc} setVideoSrc={setVideoSrc}
           showRain={showRain} setShowRain={setShowRain}
           showFireflies={showFireflies} setShowFireflies={setShowFireflies}
           showGlow={showGlow} setShowGlow={setShowGlow}
           defaultTransform={DEFAULT_TRANSFORM}
         />

         {/* Recording Status Indicator */}
         <div className="absolute top-8 right-8 flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
           <span className="text-xs font-medium tracking-wide text-white/80">LIVE SIMULATION</span>
         </div>
      </div>
    </div>
  );
}
