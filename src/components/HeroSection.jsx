import { memo, useState, useCallback } from 'react';
import { Copy, Check, RefreshCw, Zap, Clock, Shield, Link as LinkIcon } from 'lucide-react';

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
    <section className="anim-fade-up delay-1">
      <div className="surface-elevated rounded-2xl p-4 sm:p-6 lg:p-8 overflow-hidden relative">
        {/* Top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="relative flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_minmax(0,400px)] lg:gap-8">
          {/* Left column - Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[0.65rem] sm:text-xs font-semibold tracking-wide uppercase">
              <div className="h-1 w-1 rounded-full bg-blue-400 animate-pulse" />
              Temporary Email
            </div>

            <div className="space-y-2">
              <h2 className="text-display text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[var(--color-text-primary)]">
                Your instant{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  disposable
                </span>{' '}
                inbox
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Generate a temporary email address instantly. Perfect for sign-ups, verifications, and protecting your privacy.
              </p>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2">
              <div className="anim-fade-up delay-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/15 text-amber-400 text-[0.65rem] sm:text-xs font-medium">
                <Clock className="h-3 w-3 shrink-0" />
                Auto-expires 15m
              </div>
              <div className="anim-fade-up delay-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/15 text-emerald-400 text-[0.65rem] sm:text-xs font-medium">
                <Shield className="h-3 w-3 shrink-0" />
                Privacy first
              </div>
            </div>
          </div>

          {/* Right column - Email Card */}
          <div>
            <div className="relative p-4 sm:p-5 rounded-xl bg-[var(--color-surface-3)] border border-[var(--color-border-default)]">
              <div className="space-y-3">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] sm:text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Active Mailbox
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 status-pulse" />
                    <span className="text-[0.6rem] font-semibold text-emerald-400 uppercase tracking-wider">Ready</span>
                  </div>
                </div>

                {/* Email Address Display */}
                <div className="bg-[var(--color-surface-1)] border border-blue-500/20 rounded-xl p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] to-transparent pointer-events-none" />
                  <div className="relative font-mono text-xs sm:text-sm md:text-base text-[var(--color-text-primary)] font-semibold break-all text-center leading-relaxed">
                    {emailAddress}
                  </div>
                </div>

                {/* Action Buttons - stack on very small screens */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className={`btn py-2.5 px-3 text-xs rounded-xl transition-all duration-200 cursor-pointer ${
                      copiedAddress
                        ? 'bg-emerald-400/15 border border-emerald-400/30 text-emerald-400'
                        : 'btn-primary'
                    }`}
                  >
                    {copiedAddress ? (
                      <><Check className="h-3.5 w-3.5 shrink-0" /><span>Copied!</span></>
                    ) : (
                      <><Copy className="h-3.5 w-3.5 shrink-0" /><span>Copy</span></>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`btn py-2.5 px-3 text-xs rounded-xl transition-all duration-200 cursor-pointer ${
                      copiedLink
                        ? 'bg-blue-400/15 border border-blue-400/30 text-blue-400'
                        : 'btn-ghost'
                    }`}
                  >
                    {copiedLink ? (
                      <><Check className="h-3.5 w-3.5 shrink-0" /><span>Copied</span></>
                    ) : (
                      <><LinkIcon className="h-3.5 w-3.5 shrink-0" /><span>Share Link</span></>
                    )}
                  </button>
                </div>

                {/* Deep link preview */}
                <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] overflow-hidden">
                  <LinkIcon className="h-3 w-3 text-[var(--color-text-faint)] shrink-0" />
                  <span className="text-[0.6rem] sm:text-xs text-[var(--color-text-muted)] truncate font-mono">{mailboxLink}</span>
                </div>

                {/* Bottom actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="btn btn-ghost py-2.5 px-3 text-xs rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 shrink-0 ${refreshing ? 'anim-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    type="button"
                    onClick={onCreateNew}
                    className="btn btn-primary py-2.5 px-3 text-xs rounded-xl cursor-pointer"
                  >
                    <Zap className="h-3.5 w-3.5 shrink-0" />
                    <span>New Inbox</span>
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
