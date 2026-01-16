import { useState, memo, useCallback } from 'react';
import { Copy, CheckCircle, RefreshCw, Zap, Shield, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

const FeatureBadge = memo(function FeatureBadge({ icon, label, color }) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
      <Icon className={cn("w-3.5 h-3.5", color)} />
      <span className="text-slate-400 text-xs font-medium">{label}</span>
    </div>
  );
});

const HeroSection = memo(function HeroSection({ emailAddress, loading, onRefresh, onCreateNew, refreshing }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [emailAddress]);

  return (
    <div className="relative z-10">
      <div className="bg-slate-900/50 border border-white/[0.06] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center max-w-3xl mx-auto text-center space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <span className="text-violet-300 font-medium text-xs uppercase tracking-wider">
                Secure Gateway
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Your <span className="text-violet-400">Disposable</span> Identity
            </h1>
          </div>
          
          <div className="w-full max-w-xl">
            <div className="bg-[#0a0f1a] border border-white/[0.08] rounded-xl flex flex-col sm:flex-row items-center p-2 gap-2">
              
              {/* Email Display */}
              <div className="flex-1 w-full px-4 py-3 sm:py-2 flex items-center justify-center sm:justify-start overflow-hidden">
                <div className="font-mono text-base sm:text-lg text-slate-200 truncate font-medium">
                  {loading ? (
                    <span className="text-slate-500">Generating...</span>
                  ) : (
                    <span className="select-all">{emailAddress}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex w-full sm:w-auto gap-2">
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-colors",
                    copied 
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" 
                      : "bg-white text-slate-900 hover:bg-slate-100"
                  )}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="p-3 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
                  </button>

                  <button
                    onClick={onCreateNew}
                    className="p-3 rounded-lg border border-white/[0.08] text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                  >
                    <Zap className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <FeatureBadge icon={Shield} label="Encrypted" color="text-emerald-400" />
            <FeatureBadge icon={Clock} label="15m Auto-delete" color="text-orange-400" />
            <FeatureBadge icon={Zap} label="Real-time" color="text-violet-400" />
          </div>

        </div>
      </div>
    </div>
  );
});

export default HeroSection;
