import { memo } from 'react';
import { Mail, Radio, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { CONNECTION_STATUS } from '../lib/connectionStatus';

const STATUS_CONFIG = {
  [CONNECTION_STATUS.CONNECTED]: {
    icon: Wifi,
    label: 'Live',
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    dotClass: 'bg-emerald-500',
    pulse: true,
  },
  [CONNECTION_STATUS.RECONNECTING]: {
    icon: RefreshCw,
    label: 'Syncing',
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    dotClass: 'bg-amber-500',
    pulse: false,
  },
  [CONNECTION_STATUS.OFFLINE]: {
    icon: WifiOff,
    label: 'Offline',
    colorClass: 'text-red-600',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    dotClass: 'bg-red-500',
    pulse: false,
  },
};

const Header = memo(function Header({ connectionStatus }) {
  const config = STATUS_CONFIG[connectionStatus] || STATUS_CONFIG[CONNECTION_STATUS.OFFLINE];
  const StatusIcon = config.icon;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 animate-fade-in-up">
      <div className="glass border-b border-[rgba(120,113,108,0.08)]">
        <div className="mx-auto flex h-16 sm:h-[4.5rem] w-full max-w-[85rem] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/20 transition-transform duration-300 hover:scale-105">
              <Mail className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem] text-white" strokeWidth={2} />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white border-2 border-teal-500">
                <div className="h-full w-full rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
            
            <div className="min-w-0">
              <h1 className="text-heading text-base sm:text-lg font-bold text-[#1c1917] tracking-tight">
                Temp<span className="text-teal-600">Mail</span>
              </h1>
              <p className="hidden sm:block text-[0.65rem] text-[#a8a29e] font-medium tracking-wide uppercase">
                Disposable Inbox
              </p>
            </div>
          </div>

          {/* Center tagline - desktop only */}
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(13,148,136,0.06)] border border-[rgba(13,148,136,0.12)]">
            <Radio className="h-3.5 w-3.5 text-teal-600" />
            <span className="text-xs font-medium text-teal-700">Real-time ephemeral messaging</span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgClass} ${config.borderClass} transition-all duration-500`}
            >
              <span className={`relative flex h-2 w-2 ${config.pulse ? 'status-dot' : ''}`}>
                <span className={`inline-flex h-2 w-2 rounded-full ${config.dotClass} ${connectionStatus === CONNECTION_STATUS.RECONNECTING ? 'animate-spin' : ''}`} />
              </span>
              <StatusIcon 
                className={`h-3.5 w-3.5 ${config.colorClass} ${connectionStatus === CONNECTION_STATUS.RECONNECTING ? 'animate-spin' : ''}`} 
              />
              <span className={`text-xs font-semibold ${config.colorClass}`}>
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
