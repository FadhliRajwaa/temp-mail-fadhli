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
      <div className="surface-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 overflow-hidden relative">
        {/* Top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        {/* Glow behind card */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-blue-500/[0.06] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative grid gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-[1fr_minmax(0,420px)]">
          {/* Left column - Info */}
          <div className="space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[0.65rem] sm:text-xs font-semibold tracking-wide uppercase">
              <div className="h-1 w-1 rounded-full bg-blue-400 animate-pulse" />
              Temporary Email
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-display text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] text-[var(--color-text-primary)]">
                Your instant{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  disposable
                </span>{' '}
                inbox
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed max-w-md">
                Generate a temporary email address instantly. Perfect for sign-ups, verifications, and protecting your privacy.
              </p>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2">
              <div className="anim-fade-up delay-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/15 text-amber-400 text-[0.65rem] sm:text-xs font-medium">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Auto-expires 15m
              </div>
              <div className="anim-fade-up delay-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/15 text-emerald-400 text-[0.65rem] sm:text-xs font-medium">
                <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Privacy first
              </div>
            </div>
          </div>

          {/* Right column - Email Card */}
          <div className="space-y-3">
            <div className="relative p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--color-surface-3)] border border-[var(--color-border-default)]">
              <div className="space-y-3 sm:space-y-4">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] sm:text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Active Mailbox
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 status-pulse" />
                    <span className="text-[0.6rem] sm:text-[0.65rem] font-semibold text-emerald-400 uppercase tracking-wider">Ready</span>
                  </div>
                </div>

                {/* Email Address Display */}
                <div className="bg-[var(--color-surface-1)] border border-blue-500/20 rounded-xl p-3 sm:p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] to-transparent pointer-events-none" />
                  <div className="relative font-mono text-sm sm:text-base lg:text-lg text-[var(--color-text-primary)] font-semibold break-all text-center leading-tight">
                    {emailAddress}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className={`btn py-2.5 px-3 text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer ${
                      copiedAddress
                        ? 'bg-emerald-400/15 border border-emerald-400/30 text-emerald-400'
                        : 'btn-primary'
                    }`}
                  >
                    {copiedAddress ? (
                      <><Check className="h-3.5 w-3.5" /><span>Copied!</span></>
                    ) : (
                      <><Copy className="h-3.5 w-3.5" /><span>Copy</span></>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`btn py-2.5 px-3 text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer ${
                      copiedLink
                        ? 'bg-blue-400/15 border border-blue-400/30 text-blue-400'
                        : 'btn-ghost'
                    }`}
                  >
                    {copiedLink ? (
                      <><Check className="h-3.5 w-3.5" /><span>Link Copied</span></>
                    ) : (
                      <><LinkIcon className="h-3.5 w-3.5" /><span>Copy Link</span></>
                    )}
                  </button>
                </div>

                {/* Deep link preview */}
                <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)]">
                  <LinkIcon className="h-3 w-3 text-[var(--color-text-faint)] shrink-0" />
                  <span className="text-[0.65rem] sm:text-xs text-[var(--color-text-muted)] truncate font-mono">{mailboxLink}</span>
                </div>

                {/* Bottom actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="btn btn-ghost flex-1 py-2.5 px-3 text-xs sm:text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'anim-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    type="button"
                    onClick={onCreateNew}
                    className="btn btn-primary flex-1 py-2.5 px-3 text-xs sm:text-sm rounded-xl cursor-pointer"
                  >
                    <Zap className="h-3.5 w-3.5" />
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
