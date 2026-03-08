import { memo } from 'react';

const Background = memo(function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--bg-base)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.08),transparent_28%),radial-gradient(circle_at_bottom,rgba(129,140,248,0.08),transparent_22%)]" />
      <div className="aurora-layer aurora-layer-one" />
      <div className="aurora-layer aurora-layer-two" />
      <div className="aurora-layer aurora-layer-three" />
      <div className="absolute inset-0 soft-grid opacity-[0.07]" />
      <div className="noise-overlay" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-cyan-200/6 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
});

export default Background;
