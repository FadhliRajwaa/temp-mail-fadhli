import { memo } from 'react';
import { Mail } from 'lucide-react';
import { cn } from '../lib/utils';
import { CONNECTION_STATUS } from '../lib/connectionStatus';

const STATUS_CONFIG = {
  [CONNECTION_STATUS.CONNECTED]: {
    container: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
    label: 'Connected',
  },
  [CONNECTION_STATUS.RECONNECTING]: {
    container: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    dot: 'bg-amber-400',
    label: 'Reconnecting',
  },
  [CONNECTION_STATUS.OFFLINE]: {
    container: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dot: 'bg-rose-500',
    label: 'Offline',
  },
};

const Header = memo(function Header({ connectionStatus }) {
  const statusConfig = STATUS_CONFIG[connectionStatus] || STATUS_CONFIG[CONNECTION_STATUS.OFFLINE];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030712]/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-violet-500/20">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              Temp<span className="text-violet-400">Mail</span>
            </h1>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">
              Anonymous Inbox
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border",
            statusConfig.container
          )}>
            <span className="relative flex h-2 w-2">
              <span className={cn(
                "inline-flex rounded-full h-2 w-2",
                statusConfig.dot
              )} />
            </span>
            <span className="hidden sm:inline-block">
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
