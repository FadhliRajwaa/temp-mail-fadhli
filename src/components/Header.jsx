import { Mail, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Header({ isConnected }) {
  return (
    <header 
      className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#020617]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-violet-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-violet-500/20 ring-1 ring-white/20">
              <Mail className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white leading-none font-sans">
              Temp<span className="text-violet-400">Mail</span>
            </h1>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
              Anonymous Inbox
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-colors duration-500",
            isConnected 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          )}>
            <span className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                isConnected ? "bg-emerald-500" : "bg-rose-500"
              )}></span>
            </span>
            <span className="hidden sm:inline-block">
              {isConnected ? 'System Online' : 'Offline Mode'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
