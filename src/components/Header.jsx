import { memo } from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { CONNECTION_STATUS } from '../lib/connectionStatus';

const STATUS_CONFIG = {
  [CONNECTION_STATUS.CONNECTED]: {
    container: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
    dot: 'bg-emerald-300 signal-live',
    label: 'Connected',
  },
  [CONNECTION_STATUS.RECONNECTING]: {
    container: 'border-amber-300/20 bg-amber-300/10 text-amber-100',
    dot: 'bg-amber-300',
    label: 'Reconnecting',
  },
  [CONNECTION_STATUS.OFFLINE]: {
    container: 'border-rose-400/20 bg-rose-400/10 text-rose-200',
    dot: 'bg-rose-300',
    label: 'Offline',
  },
};

const Header = memo(function Header({ connectionStatus }) {
  const statusConfig = STATUS_CONFIG[connectionStatus] || STATUS_CONFIG[CONNECTION_STATUS.OFFLINE];

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#050b16]/78 backdrop-blur-2xl">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/25 via-slate-900/80 to-slate-950 shadow-[0_12px_40px_rgba(14,116,144,0.2)]">
            <div className="absolute inset-1 rounded-[14px] bg-gradient-to-br from-cyan-300/14 to-transparent" />
            <Mail className="relative z-10 h-5 w-5 text-cyan-100" />
          </div>

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/60">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-200/80" />
              Secure Relay
            </div>
            <h1 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
              Temp<span className="text-gradient-cyan">Mail</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-medium text-slate-300 lg:flex">
            Ephemeral inbox for verification flows
          </div>

          <div
            className={cn(
              'flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-[0_10px_24px_rgba(2,8,20,0.25)]',
              statusConfig.container
            )}
          >
            <span className={cn('inline-flex h-2.5 w-2.5 rounded-full', statusConfig.dot)} />
            <span className="hidden sm:inline-block">{statusConfig.label}</span>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
