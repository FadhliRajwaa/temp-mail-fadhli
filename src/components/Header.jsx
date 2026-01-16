import { memo } from 'react';
import { Mail } from 'lucide-react';
import { cn } from '../lib/utils';

const Header = memo(function Header({ isConnected }) {
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
            isConnected 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          )}>
            <span className="relative flex h-2 w-2">
              <span className={cn(
                "inline-flex rounded-full h-2 w-2",
                isConnected ? "bg-emerald-500" : "bg-rose-500"
              )} />
            </span>
            <span className="hidden sm:inline-block">
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
