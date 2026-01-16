import { memo } from "react";

const Background = memo(function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#030712]">
      {/* Static gradient base - no animation, no blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-[#030712] to-[#030712]" />
      
      {/* Static colored orbs - NO blur, NO animation */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-violet-950/30 rounded-full" />
      <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] bg-fuchsia-950/20 rounded-full" />
      <div className="absolute -bottom-[20%] left-[10%] w-[50%] h-[50%] bg-indigo-950/25 rounded-full" />

      {/* Simple grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', 
          backgroundSize: '60px 60px' 
        }} 
      />
    </div>
  );
});

export default Background;
