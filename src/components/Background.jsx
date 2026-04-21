import { memo } from 'react';

const Background = memo(function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--bg-base)]">
      <div className="absolute inset-0 paper-grain opacity-80" />
      <div className="absolute inset-0 signal-grid opacity-[0.22]" />
      <div className="absolute inset-0 scan-lines" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(188,109,73,0.14),transparent_26%),radial-gradient(circle_at_88%_4%,rgba(35,52,73,0.1),transparent_22%),radial-gradient(circle_at_40%_90%,rgba(174,138,65,0.1),transparent_28%)]" />

      <div className="orbital-accent left-[-5rem] top-[6rem] h-36 w-36 border border-white/40 bg-[rgba(255,252,248,0.52)]" />
      <div className="orbital-accent right-[8%] top-[12%] h-24 w-24 border border-[rgba(35,52,73,0.08)] bg-[rgba(255,245,236,0.7)] [animation-delay:2s]" />
      <div className="orbital-accent bottom-[16%] left-[18%] h-20 w-20 border border-[rgba(188,109,73,0.12)] bg-[rgba(255,240,230,0.78)] [animation-delay:4s]" />

      <div className="absolute inset-x-[7%] top-[5.2rem] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(35,52,73,0.18),transparent)] lg:block" />
      <div className="absolute inset-x-[10%] bottom-[12%] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(188,109,73,0.18),transparent)] lg:block" />
      <div className="signal-sweep opacity-70" />
    </div>
  );
});

export default Background;
