import { useState, useEffect } from 'react';
import { Copy, CheckCircle, RefreshCw, Zap, Shield, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function HeroSection({ emailAddress, loading, onRefresh, onCreateNew, refreshing }) {
  const [copied, setCopied] = useState(false);
  const [textToType, setTextToType] = useState('');

  // Typing effect logic
  useEffect(() => {
    setTextToType(emailAddress);
  }, [emailAddress]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative z-10">
      <div className="bg-[#0F172A]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden group">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-violet-500/20 transition-colors duration-500" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto text-center space-y-8">
          
          <div className="space-y-2">
            <h2 className="text-violet-300 font-medium text-sm uppercase tracking-[0.2em] animate-pulse">
              Secure Temporary Gateway
            </h2>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Your Disposable Identity
            </h1>
          </div>
          
          <div className="w-full max-w-2xl">
            <div className="relative group/input">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-25 group-hover/input:opacity-50 transition-opacity duration-500" />
              
              <div className="relative bg-[#020617] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center p-2 sm:p-2 gap-2 shadow-2xl">
                
                {/* Email Display */}
                <div className="flex-1 w-full relative px-4 py-4 sm:py-2 flex items-center justify-center sm:justify-start overflow-hidden">
                  <div className="font-mono text-lg sm:text-xl text-slate-200 truncate font-medium tracking-wide">
                    {loading ? (
                      <span className="animate-pulse">Initializing...</span>
                    ) : (
                      emailAddress
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full sm:w-auto gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={cn(
                      "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg",
                      copied 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-white text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    <AnimatePresence mode='wait' initial={false}>
                      {copied ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Copied</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      onClick={onRefresh}
                      disabled={refreshing}
                      className="p-3.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onCreateNew}
                      className="p-3.5 rounded-xl border border-white/10 text-slate-400 hover:text-violet-400 hover:bg-white/5 transition-colors group/new"
                    >
                      <Zap className="w-5 h-5 group-hover/new:fill-violet-400/20 transition-all" />
                    </motion.button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>15m Auto-wipe</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
              <span>Real-time Socket</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
