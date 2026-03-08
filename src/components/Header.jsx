import { memo } from 'react';
import { RadioTower, ShieldEllipsis } from 'lucide-react';
import { cn } from '../lib/utils';
import { CONNECTION_STATUS } from '../lib/connectionStatus';

const STATUS_CONFIG = {
  [CONNECTION_STATUS.CONNECTED]: {
    container: 'border-lime-300/20 bg-lime-300/10 text-lime-100',
    dot: 'bg-lime-300 signal-pulse',
    label: 'Link stable',
  },
  [CONNECTION_STATUS.RECONNECTING]: {
    container: 'border-amber-300/20 bg-amber-300/10 text-amber-100',
    dot: 'bg-amber-300',
    label: 'Relinking',
  },
  [CONNECTION_STATUS.OFFLINE]: {
    container: 'border-rose-400/20 bg-rose-400/10 text-rose-200',
    dot: 'bg-rose-300',
    label: 'Signal lost',
  },
};

const Header = memo(function Header({ connectionStatus }) {
  const statusConfig = STATUS_CONFIG[connectionStatus] || STATUS_CONFIG[CONNECTION_STATUS.OFFLINE];

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#050a0d]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.4rem] w-full max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-lime-300/14 bg-[linear-gradient(160deg,rgba(190,242,100,0.18),rgba(10,20,24,0.88))] shadow-[0_12px_28px_rgba(0,0,0,0.28)]">
            <RadioTower className="h-5 w-5 text-lime-100" />
          </div>

          <div className="min-w-0">
            <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
              <ShieldEllipsis className="h-3.5 w-3.5 text-teal-200/80" />
              Relay Control
            </div>
            <h1 className="font-display text-xl font-bold uppercase tracking-[0.16em] text-white">
              Temp<span className="text-signal">Mail</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)] lg:inline-flex">
            verification relay active
          </div>

          <div
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-[0_10px_24px_rgba(0,0,0,0.24)]',
              statusConfig.container
            )}
          >
            <span className={cn('inline-flex h-2.5 w-2.5 rounded-full', statusConfig.dot)} />
            <span className="hidden sm:inline">{statusConfig.label}</span>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
