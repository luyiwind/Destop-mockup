import React, { useState, useRef } from 'react';
import { Upload, MonitorSmartphone, Droplets, Sparkles, Sun, Settings2, RotateCcw } from 'lucide-react';
import { TransformState } from '../types';

interface ControlPanelProps {
  transform: TransformState;
  setTransform: React.Dispatch<React.SetStateAction<TransformState>>;
  bgImage: string | null;
  setBgImage: (val: string | null) => void;
  videoSrc: string | null;
  setVideoSrc: (val: string | null) => void;
  showRain: boolean;
  setShowRain: (val: boolean) => void;
  showFireflies: boolean;
  setShowFireflies: (val: boolean) => void;
  showGlow: boolean;
  setShowGlow: (val: boolean) => void;
  defaultTransform: TransformState;
}

export function ControlPanel({ 
  transform, setTransform,
  bgImage, setBgImage,
  videoSrc, setVideoSrc,
  showRain, setShowRain,
  showFireflies, setShowFireflies,
  showGlow, setShowGlow,
  defaultTransform
}: ControlPanelProps) {
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panelX: 0, panelY: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panelX: pos.x, panelY: pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPos({
      x: dragStart.current.panelX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panelY + (e.clientY - dragStart.current.y),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const updateTransform = (key: keyof TransformState, value: number) => {
    setTransform(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div 
      className="absolute flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl w-80 shadow-2xl pointer-events-auto overflow-hidden"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, maxHeight: 'calc(100vh - 48px)' }}
    >
      <div 
        className="flex flex-col gap-1 p-6 pb-4 cursor-move select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-semibold tracking-tight text-white/90 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-white/70" /> AuraSand
          </h1>
        </div>
        <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Studio Simulator</p>
      </div>

      <div className="p-6 pt-2 overflow-y-auto no-drag space-y-8 custom-scrollbar">
        {/* Media Uploads */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex justify-between items-center">
            Media Assets
            <span className="text-[9px] lowercase tracking-normal">Local or URL</span>
          </h3>
          <div className="space-y-4">
            {/* Background Source */}
            <div className="space-y-2">
              <div className="flex gap-2">
                 <input 
                   type="text" 
                   placeholder="Background Image URL" 
                   className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
                   onChange={e => setBgImage(e.target.value || null)}
                 />
                 <label className="shrink-0 flex items-center justify-center w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-colors group relative" title="Upload Local Image">
                    <Upload className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) setBgImage(URL.createObjectURL(file));
                    }} />
                 </label>
              </div>
            </div>

            {/* Video Source */}
            <div className="space-y-2">
              <div className="flex gap-2">
                 <input 
                   type="text" 
                   placeholder="Screen Video URL" 
                   className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
                   onChange={e => setVideoSrc(e.target.value || null)}
                 />
                 <label className="shrink-0 flex items-center justify-center w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-colors group relative" title="Upload Local Video">
                    <Upload className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                    <input type="file" accept="video/*" className="hidden" onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) setVideoSrc(URL.createObjectURL(file));
                    }} />
                 </label>
              </div>
            </div>
          </div>
        </section>

        {/* Ambience */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Ambience</h3>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => setShowRain(!showRain)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${showRain ? 'bg-white/10 border-blue-500/50 text-white/90' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'}`}
            >
              <Droplets className={`w-4 h-4 ${showRain ? 'text-blue-400' : 'text-white/40'}`} />
              <span className="text-[10px] font-medium">Rain</span>
            </button>
            <button 
              onClick={() => setShowFireflies(!showFireflies)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${showFireflies ? 'bg-white/10 border-amber-500/50 text-white/90' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'}`}
            >
              <Sparkles className={`w-4 h-4 ${showFireflies ? 'text-amber-400' : 'text-white/40'}`} />
              <span className="text-[10px] font-medium">Fireflies</span>
            </button>
            <button 
              onClick={() => setShowGlow(!showGlow)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${showGlow ? 'bg-white/10 border-orange-500/50 text-white/90' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'}`}
            >
              <Sun className={`w-4 h-4 ${showGlow ? 'text-orange-400' : 'text-white/40'}`} />
              <span className="text-[10px] font-medium">Warm Glow</span>
            </button>
          </div>
        </section>

        {/* 3D Transform Settings */}
        <section className="space-y-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">3D Transform</h3>
            <button 
              onClick={() => setTransform(defaultTransform)}
              className="text-[10px] flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          
          <Slider label="Perspective Depth" value={transform.perspective} min={200} max={3000} step={10} onChange={v => updateTransform('perspective', v)} />
          
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-medium text-white/30 uppercase tracking-widest border-b border-white/5 pb-1">Position Space</h4>
            <Slider label="Translate X" value={transform.tx} min={-1000} max={1000} onChange={v => updateTransform('tx', v)} />
            <Slider label="Translate Y" value={transform.ty} min={-1000} max={1000} onChange={v => updateTransform('ty', v)} />
            <Slider label="Translate Z" value={transform.tz} min={-1000} max={1000} onChange={v => updateTransform('tz', v)} />
          </div>
          
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-medium text-white/30 uppercase tracking-widest border-b border-white/5 pb-1">Rotation (Pitch, Yaw, Roll)</h4>
            <Slider label="Rotate X (Pitch)" value={transform.rx} min={-180} max={180} onChange={v => updateTransform('rx', v)} />
            <Slider label="Rotate Y (Yaw)" value={transform.ry} min={-180} max={180} onChange={v => updateTransform('ry', v)} />
            <Slider label="Rotate Z (Roll)" value={transform.rz} min={-180} max={180} onChange={v => updateTransform('rz', v)} />
          </div>
          
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-medium text-white/30 uppercase tracking-widest border-b border-white/5 pb-1">Scale</h4>
            <Slider label="Scale X" value={transform.sx} min={0.1} max={3} step={0.01} onChange={v => updateTransform('sx', v)} />
            <Slider label="Scale Y" value={transform.sy} min={0.1} max={3} step={0.01} onChange={v => updateTransform('sy', v)} />
          </div>
          
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-medium text-white/30 uppercase tracking-widest border-b border-white/5 pb-1">Device Form Factor</h4>
            <Slider label="Width" value={transform.width} min={200} max={1200} onChange={v => updateTransform('width', v)} />
            <Slider label="Height" value={transform.height} min={200} max={1200} onChange={v => updateTransform('height', v)} />
            <Slider label="Bezel Thickness" value={transform.bezel} min={0} max={100} onChange={v => updateTransform('bezel', v)} />
            <Slider label="Corner Radius" value={transform.radius} min={0} max={100} onChange={v => updateTransform('radius', v)} />
          </div>
        </section>
      </div>

      <div className="p-6 pt-4 border-t border-white/5 mt-auto bg-black/20">
        <div className="flex items-center justify-between">
          <div className="px-2 py-1 bg-orange-500/20 rounded text-[9px] text-orange-400 font-bold uppercase tracking-wider">OBS Ready</div>
          <span className="text-[10px] text-white/30">Press <kbd className="bg-white/10 px-1 rounded text-white/60">H</kbd> to toggle UI</span>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, onChange }: { label: string, value: number, min: number, max: number, step?: number, onChange: (v: number) => void }) {
  // Calculate percentage for active track styling
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-[11px] text-white/60">
        <span>{label}</span>
        <span className="font-mono text-white/60 w-10 text-right">{value.toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <div className="relative h-1 bg-white/10 rounded-full flex items-center">
        <div 
          className="absolute left-0 top-0 h-full bg-orange-500 rounded-full pointer-events-none" 
          style={{ width: `${percentage}%` }}
        />
        <input 
          type="range" min={min} max={max} step={step} value={value} 
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <div 
          className="absolute w-3 h-3 bg-white rounded-full shadow-lg pointer-events-none"
          style={{ left: `calc(${percentage}% - 6px)` }}
        />
      </div>
    </div>
  );
}
