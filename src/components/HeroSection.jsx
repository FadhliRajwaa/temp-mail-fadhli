import { memo, useState, useCallback } from 'react';
import { Copy, Check, RefreshCw, Zap, Clock, Shield, Globe, Link as LinkIcon, Sparkles } from 'lucide-react';

const HeroSection = memo(function HeroSection({
  emailAddress,
  mailboxLink,
  onRefresh,
  onCreateNew,
  refreshing,
}) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      // ignore
    }
  }, [emailAddress]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mailboxLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  }, [mailboxLink]);

  return (
    <section className="anim-slide-up delay-1">
      <div className="card rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 overflow-hidden relative">
        {/* Decorative gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-100/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
        
        <div className="relative grid gap-6 lg:gap-8 lg:grid-cols-[1fr_minmax(20rem,28rem)]">
          {/* Left column - Info */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Temporary Email Service
            </div>
            
            <div className="space-y-3">
              <h2 className="text-display text-3xl sm:text-4xl lg:text-[2.5rem] text-slate-900">
                Your instant
                <span className="relative inline-block mx-1.5">
                  <span className="relative z-10 text-teal-600">disposable</span>
                  <span className="absolute bottom-0 left-0 right-0 h-2.5 bg-teal-100/70 rounded-sm -z-0" />
                </span>
                inbox
              </h2>
              <p className="text-body text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
                Generate a temporary email address instantly. Perfect for sign-ups, verifications, 
                and protecting your privacy. No registration required.
              </p>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap gap-2.5">
              <div className="anim-slide-up delay-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                Auto-expires 15m
              </div>
              <div className="anim-slide-up delay-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                <Shield className="h-3.5 w-3.5 text-teal-600" />
                Privacy first
              </div>
              <div className="anim-slide-up delay-5 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                <Globe className="h-3.5 w-3.5 text-slate-600" />
                No signup needed
              </div>
            </div>
          </div>
          
          {/* Right column - Email Card */}
          <div className="space-y-4">
            <div className="relative p-5 sm:p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-lg">
              {/* Subtle gradient overlay */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-100/20 via-transparent to-teal-100/20" />
              
              <div className="relative space-y-4">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 status-pulse" />
                    Active Mailbox
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[0.65rem] font-bold text-emerald-700 uppercase tracking-wider">Ready</span>
                  </div>
                </div>
                
                {/* Email Address Display - HIGH CONTRAST */}
                <div className="email-box">
                  <div className="text-mono text-sm sm:text-base text-slate-900 font-bold tracking-tight">
                    {emailAddress}
                  </div>
                  <div className="mt-1.5 text-[0.65rem] text-slate-600 font-bold uppercase tracking-wider">
                    Temporary Address
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className={`btn py-3 px-4 text-sm rounded-xl transition-all duration-200 ${
                      copiedAddress
                        ? 'bg-emerald-100 border-2 border-emerald-300 text-emerald-800'
                        : 'bg-slate-900 text-white border-2 border-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="hidden sm:inline font-bold">Copy Address</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`btn py-3 px-4 text-sm rounded-xl transition-all duration-200 ${
                      copiedLink
                        ? 'bg-cyan-100 border-2 border-cyan-300 text-cyan-800'
                        : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-cyan-400 hover:text-cyan-700'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline font-bold">Link Copied</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4" />
                        <span className="hidden sm:inline font-bold">Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Deep link preview */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <LinkIcon className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="text-xs text-slate-600 truncate font-mono">{mailboxLink}</span>
                </div>
                
                {/* Bottom actions */}
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="btn flex-1 py-3 px-4 text-sm rounded-xl bg-amber-50 border-2 border-amber-200 text-amber-800 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'anim-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={onCreateNew}
                    className="btn flex-1 py-3 px-4 text-sm rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 border-0 text-white hover:from-cyan-700 hover:to-teal-700 transition-all duration-200 font-bold shadow-md shadow-cyan-500/20"
                  >
                    <Zap className="h-4 w-4" />
                    <span className="hidden sm:inline">New Inbox</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
