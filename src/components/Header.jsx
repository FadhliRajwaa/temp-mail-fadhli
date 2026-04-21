import { memo } from 'react';
import { Mail, Radio, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { CONNECTION_STATUS } from '../lib/connectionStatus';

const STATUS_CONFIG = {
  [CONNECTION_STATUS.CONNECTED]: {
    icon: Wifi,
    label: 'Live',
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    dotClass: 'bg-emerald-500',
    pulse: true,
  },
  [CONNECTION_STATUS.RECONNECTING]: {
    icon: RefreshCw,
    label: 'Syncing',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300',
    dotClass: 'bg-amber-500',
    pulse: false,
  },
  [CONNECTION_STATUS.OFFLINE]: {
    icon: WifiOff,
    label: 'Offline',
    colorClass: 'text-red-700',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-300',
    dotClass: 'bg-red-500',
    pulse: false,
  },
};

const Header = memo(function Header({ connectionStatus }) {
  const config = STATUS_CONFIG[connectionStatus] || STATUS_CONFIG[CONNECTION_STATUS.OFFLINE];
  const StatusIcon = config.icon;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 anim-slide-down">
      <div className="glass border-b border-slate-200/80 shadow-sm">
        <div className="mx-auto flex h-16 sm:h-[4.5rem] w-full max-w-[85rem] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 shadow-lg shadow-cyan-500/30 transition-transform duration-300 hover:scale-105">
              <Mail className="h-5 w-5 text-white" strokeWidth={2.5} />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white border-2 border-cyan-500">
                <div className="h-full w-full rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
            
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Temp<span className="text-cyan-600">Mail</span>
              </h1>
              <p className="hidden sm:block text-[0.65rem] text-slate-600 font-bold tracking-wide uppercase">
                Disposable Inbox
              </p>
            </div>
          </div>

          {/* Center tagline - desktop only */}
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200">
            <Radio className="h-3.5 w-3.5 text-cyan-600" />
            <span className="text-xs font-bold text-cyan-700">Real-time ephemeral messaging</span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 ${config.bgClass} ${config.borderClass} transition-all duration-500`}
            >
              <span className={`relative flex h-2.5 w-2.5 ${config.pulse ? 'status-pulse' : ''}`}>
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${config.dotClass} ${connectionStatus === CONNECTION_STATUS.RECONNECTING ? 'anim-spin' : ''}`} />
              </span>
              <StatusIcon 
                className={`h-4 w-4 ${config.colorClass} ${connectionStatus === CONNECTION_STATUS.RECONNECTING ? 'anim-spin' : ''}`} 
              />
              <span className={`text-xs font-extrabold ${config.colorClass}`}>
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
