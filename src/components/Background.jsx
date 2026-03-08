import { memo } from 'react';

const Background = memo(function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--bg-base)]">
      <div className="absolute inset-0 signal-grid opacity-[0.08]" />
      <div className="absolute inset-0 scan-lines" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(94,234,212,0.08),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(190,242,100,0.08),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(251,191,36,0.05),transparent_24%)]" />
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-teal-300/8 blur-3xl" />
      <div className="absolute right-[-5rem] top-[-2rem] h-80 w-80 rounded-full bg-lime-300/8 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-amber-300/6 blur-3xl" />
      <div className="signal-sweep opacity-60" />
    </div>
  );
});

export default Background;
