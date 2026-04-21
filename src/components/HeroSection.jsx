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
    <section className="animate-fade-in-up stagger-1">
      <div className="card-surface rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 overflow-hidden relative">
        {/* Decorative accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
        
        <div className="relative grid gap-6 lg:gap-8 lg:grid-cols-[1fr_minmax(20rem,28rem)]">
          {/* Left column - Info */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Temporary Email Service
            </div>
            
            <div className="space-y-3">
              <h2 className="text-display text-3xl sm:text-4xl lg:text-[2.75rem] text-[#1c1917]">
                Your instant
                <span className="relative inline-block mx-2">
                  <span className="relative z-10 text-teal-700">disposable</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-teal-100/60 rounded-sm -z-0" />
                </span>
                inbox
              </h2>
              <p className="text-body text-sm sm:text-base text-[#57534e] max-w-lg leading-relaxed">
                Generate a temporary email address instantly. Perfect for sign-ups, verifications, 
                and protecting your privacy. No registration required.
              </p>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap gap-2.5">
              <div className="animate-fade-in-up stagger-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                Auto-expires 15m
              </div>
              <div className="animate-fade-in-up stagger-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 text-xs font-medium">
                <Shield className="h-3.5 w-3.5 text-teal-600" />
                Privacy first
              </div>
              <div className="animate-fade-in-up stagger-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 text-xs font-medium">
                <Globe className="h-3.5 w-3.5 text-stone-500" />
                No signup needed
              </div>
            </div>
          </div>
          
          {/* Right column - Email Card */}
          <div className="space-y-4">
            <div className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-stone-50 border border-stone-200/80 shadow-lg shadow-stone-200/40">
              {/* Glow effect */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-teal-500/10 via-transparent to-amber-500/10 blur-xl opacity-60" />
              
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-badge-glow" />
                    Active Mailbox
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[0.65rem] font-semibold text-emerald-700 uppercase tracking-wider">Ready</span>
                  </div>
                </div>
                
                {/* Email Address Display */}
                <div className="input-surface rounded-xl p-4 text-center break-all">
                  <div className="font-mono text-sm sm:text-base font-bold text-stone-900 tracking-tight">
                    {emailAddress}
                  </div>
                  <div className="mt-2 text-[0.65rem] text-stone-600 font-semibold uppercase tracking-wider">
                    Temporary Address
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className={`btn-surface flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      copiedAddress
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        : 'bg-[#1c1917] text-white border border-[#1c1917] hover:bg-[#292524]'
                    }`}
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="hidden sm:inline">Copy Address</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`btn-surface flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      copiedLink
                        ? 'bg-teal-50 border border-teal-200 text-teal-700'
                        : 'bg-white border border-stone-200 text-stone-700 hover:border-teal-300 hover:text-teal-700'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline">Link Copied</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Deep link preview */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-stone-50 border border-stone-100">
                  <LinkIcon className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                  <span className="text-xs text-stone-500 truncate font-mono">{mailboxLink}</span>
                </div>
                
                {/* Bottom actions */}
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="btn-surface flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={onCreateNew}
                    className="btn-surface flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-teal-600 border border-teal-600 text-white hover:bg-teal-700 transition-all duration-200"
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
