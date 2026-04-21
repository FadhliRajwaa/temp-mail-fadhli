import { memo } from 'react';
import { Compass, RadioTower, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { CONNECTION_STATUS } from '../lib/connectionStatus';

const STATUS_CONFIG = {
  [CONNECTION_STATUS.CONNECTED]: {
    container: 'border-[rgba(115,129,97,0.18)] bg-[rgba(115,129,97,0.12)] text-[var(--signal-sage)]',
    dot: 'bg-[var(--signal-sage)] signal-pulse',
    label: 'Live relay',
  },
  [CONNECTION_STATUS.RECONNECTING]: {
    container: 'border-[rgba(174,138,65,0.18)] bg-[rgba(174,138,65,0.12)] text-[var(--signal-gold)]',
    dot: 'bg-[var(--signal-gold)]',
    label: 'Re-linking',
  },
  [CONNECTION_STATUS.OFFLINE]: {
    container: 'border-[rgba(188,102,90,0.18)] bg-[rgba(188,102,90,0.12)] text-[var(--signal-rose)]',
    dot: 'bg-[var(--signal-rose)]',
    label: 'Offline',
  },
};

const Header = memo(function Header({ connectionStatus }) {
  const statusConfig = STATUS_CONFIG[connectionStatus] || STATUS_CONFIG[CONNECTION_STATUS.OFFLINE];

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(85,73,61,0.1)] bg-[rgba(246,240,230,0.8)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[4.85rem] w-full max-w-[96rem] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-[1.35rem] border border-[rgba(35,52,73,0.12)] bg-[linear-gradient(145deg,rgba(255,255,255,0.72),rgba(245,234,221,0.92))] shadow-[0_1rem_2rem_rgba(77,57,35,0.1)]">
            <div className="absolute inset-[0.35rem] rounded-[1rem] border border-white/70" />
            <RadioTower className="relative h-5 w-5 text-[var(--signal-ink)]" />
          </div>

          <div className="min-w-0">
            <div className="editorial-kicker mb-1 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-[var(--signal-clay)]" />
              Inbox Atelier
            </div>
            <h1 className="font-display text-[1.55rem] leading-none text-[var(--signal-ink)] sm:text-[1.72rem]">
              Temp<span className="text-signal">Mail</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[rgba(85,73,61,0.1)] bg-[rgba(255,255,255,0.42)] px-3.5 py-2 text-[0.72rem] font-semibold text-[var(--text-secondary)] shadow-[0_0.75rem_1.75rem_rgba(77,57,35,0.06)] md:inline-flex">
            <Sparkles className="h-3.5 w-3.5 text-[var(--signal-clay)]" />
            Premium disposable inbox for verification loops and fast signups
          </div>

          <div
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] shadow-[0_0.75rem_1.75rem_rgba(77,57,35,0.08)]',
              statusConfig.container
            )}
          >
            <span className={cn('inline-flex h-2.5 w-2.5 rounded-full', statusConfig.dot)} />
            <span>{statusConfig.label}</span>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
