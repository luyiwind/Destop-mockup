import { TransformState } from '../types';

export function DeviceLayer({ transform, videoSrc }: { transform: TransformState, videoSrc: string | null }) {
  const { tx, ty, tz, rx, ry, rz, sx, sy, perspective, bezel, radius, width, height } = transform;
  
  // Calculate dynamic shadow based on 3D rotation and depth
  const shadowX = -ry * 0.5;
  const shadowY = Math.max(10, rx * 0.5); 
  const shadowBlur = Math.max(20, tz * 0.1 + 40);
  const shadowSpread = Math.max(-10, -tz * 0.05);

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ perspective: `${perspective}px` }}
    >
      <div 
        className="relative transition-transform duration-75"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transformStyle: 'preserve-3d',
          transform: `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale3d(${sx}, ${sy}, 1)`,
        }}
      >
        {/* Dynamic Shadow Layer */}
        <div 
          className="absolute inset-0 bg-black/80 pointer-events-none rounded-[inherit]"
          style={{
            borderRadius: `${radius}px`,
            transform: 'translateZ(-20px) translateY(48px) translateX(16px) scale(1.05)',
            filter: `blur(${Math.max(24, shadowBlur * 0.5)}px)`,
            boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(0,0,0,0.5)`
          }}
        />

        {/* Device Body */}
        <div 
          className="absolute inset-0 bg-[#1a1a1a] overflow-hidden flex items-center justify-center border-[1px] border-white/10 shadow-2xl"
          style={{ 
            borderRadius: `${radius}px`,
            padding: `${bezel}px`,
          }}
        >
          {/* Screen Area */}
          <div 
            className="w-full h-full relative overflow-hidden bg-[#09090b] flex items-center justify-center"
            style={{ borderRadius: `${Math.max(0, radius - bezel * 0.5)}px` }}
          >
            {videoSrc ? (
              <video 
                src={videoSrc} 
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover pointer-events-auto"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-stone-900 to-black text-white/30 text-sm gap-2">
                <span className="block font-medium">No Video Source</span>
                <span className="text-[10px] uppercase tracking-widest opacity-50 border border-white/10 px-2 py-1 rounded">Upload via Panel</span>
              </div>
            )}

            {/* Simulated Glass Reflection Glare */}
            <div 
              className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
