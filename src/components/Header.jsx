import { memo } from 'react';
import { Mail, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { CONNECTION_STATUS } from '../lib/connectionStatus';

const STATUS_CONFIG = {
  [CONNECTION_STATUS.CONNECTED]: {
    icon: Wifi,
    label: 'Live',
    dotColor: 'bg-emerald-400',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
    pulse: true,
  },
  [CONNECTION_STATUS.RECONNECTING]: {
    icon: RefreshCw,
    label: 'Syncing',
    dotColor: 'bg-amber-400',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/20',
    pulse: false,
  },
  [CONNECTION_STATUS.OFFLINE]: {
    icon: WifiOff,
    label: 'Offline',
    dotColor: 'bg-red-400',
    textColor: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20',
    pulse: false,
  },
};

const Header = memo(function Header({ connectionStatus }) {
  const config = STATUS_CONFIG[connectionStatus] || STATUS_CONFIG[CONNECTION_STATUS.OFFLINE];
  const StatusIcon = config.icon;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 anim-fade-down">
      <div className="surface-glass border-b border-[rgba(148,163,184,0.06)]">
        <div className="mx-auto flex h-14 sm:h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 transition-transform duration-200 hover:scale-105 cursor-pointer shrink-0">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" strokeWidth={2.5} />
            </div>

            <div className="min-w-0">
              <h1 className="text-display text-sm sm:text-base text-[var(--color-text-primary)] tracking-tight">
                Temp<span className="text-blue-400">Mail</span>
              </h1>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border ${config.bgColor} ${config.borderColor} transition-all duration-300`}
            >
              <span className={`relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 ${config.pulse ? 'status-pulse' : ''}`}>
                <span className={`inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${config.dotColor}`} />
              </span>
              <StatusIcon
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${config.textColor} ${connectionStatus === CONNECTION_STATUS.RECONNECTING ? 'anim-spin' : ''}`}
              />
              <span className={`text-[0.65rem] sm:text-xs font-semibold ${config.textColor} tracking-wide`}>
                {config.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
