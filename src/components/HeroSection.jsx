import { useState, memo, useCallback } from 'react';
import {
  CheckCheck,
  Clock3,
  Copy,
  Link2,
  RefreshCw,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '../lib/utils';

const StatusChip = memo(function StatusChip({ icon, label, tone }) {
  const Icon = icon;

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
      <Icon className={cn('h-3.5 w-3.5', tone)} />
      <span>{label}</span>
    </div>
  );
});

const Metric = memo(function Metric({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
        {label}
      </div>
      <div className={cn('font-display text-2xl font-bold uppercase tracking-[0.12em]', accent)}>
        {value}
      </div>
    </div>
  );
});

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
      setTimeout(() => setCopiedAddress(false), 1800);
    } catch {
      // ignore
    }
  }, [emailAddress]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mailboxLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1800);
    } catch {
      // ignore
    }
  }, [mailboxLink]);

  return (
    <section className="control-panel control-panel-strong panel-topline section-reveal rounded-[1.75rem] px-5 py-5 sm:px-6 sm:py-6 lg:px-7">
      <div className="absolute inset-0 signal-grid opacity-[0.06]" />
      <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.92fr)] xl:items-start">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-300/14 bg-lime-300/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-lime-100">
            <Sparkles className="h-3.5 w-3.5" />
            Signal Control Room
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="font-display text-[2.5rem] font-bold uppercase leading-none tracking-[0.1em] text-white sm:text-[3.3rem] lg:text-[4rem]">
              Disposable relay for
              <span className="mt-2 block text-signal">instant inbox capture</span>
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              Generate a route, monitor inbound traffic, and rotate identities on demand. Built for
              verification loops, OTP flows, and throwaway mailbox tasks without clutter.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="purge" value="15m" accent="text-lime-200" />
            <Metric label="mode" value="live" accent="text-teal-200" />
            <Metric label="relay" value="open" accent="text-amber-200" />
          </div>

          <div className="flex flex-wrap gap-2.5">
            <StatusChip icon={Shield} label="Encrypted Route" tone="text-teal-200" />
            <StatusChip icon={Clock3} label="Auto Purge" tone="text-amber-300" />
            <StatusChip icon={Zap} label="Realtime Feed" tone="text-lime-200" />
          </div>
        </div>

        <div className="control-panel rounded-[1.45rem] border border-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                active relay node
              </div>
              <div className="font-display text-2xl font-bold uppercase tracking-[0.12em] text-white">
                identity console
              </div>
            </div>

            <div className="rounded-full border border-lime-300/16 bg-lime-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-lime-100">
              armed
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(7,14,18,0.96),rgba(10,18,24,0.94))] p-4">
            <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              <span>mailbox address</span>
              <span className="font-mono-ui">signal ready</span>
            </div>

            <div className="font-mono-ui mb-4 break-all text-left text-base font-semibold leading-7 text-white sm:text-lg">
              {emailAddress}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleCopyAddress}
                className={cn(
                  'button-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-200',
                  copiedAddress
                    ? 'border-lime-300/20 bg-lime-300/12 text-lime-100'
                    : 'border-lime-300/16 bg-[linear-gradient(135deg,rgba(190,242,100,0.18),rgba(94,234,212,0.14))] text-white hover:-translate-y-0.5'
                )}
              >
                {copiedAddress ? (
                  <>
                    <CheckCheck className="h-4 w-4" />
                    copied address
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    copy address
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className={cn(
                  'button-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-200',
                  copiedLink
                    ? 'border-teal-300/20 bg-teal-300/12 text-teal-100'
                    : 'border-white/8 bg-white/[0.04] text-[var(--text-primary)] hover:-translate-y-0.5 hover:border-teal-300/18 hover:bg-white/[0.06]'
                )}
              >
                {copiedLink ? (
                  <>
                    <CheckCheck className="h-4 w-4" />
                    copied link
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    copy link
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-[1fr_auto_auto]">
            <a
              href={mailboxLink}
              className="flex min-h-12 items-center rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-[var(--text-secondary)] transition-colors hover:border-teal-300/16 hover:text-white break-all"
            >
              <span className="font-mono-ui line-clamp-1">{mailboxLink}</span>
            </a>

            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="button-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-300/16 bg-amber-300/10 px-4 text-sm font-semibold uppercase tracking-[0.12em] text-amber-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-300/14"
            >
              <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
              refresh
            </button>

            <button
              type="button"
              onClick={onCreateNew}
              className="button-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-teal-300/16 bg-teal-300/10 px-4 text-sm font-semibold uppercase tracking-[0.12em] text-teal-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-300/14"
            >
              <Zap className="h-4 w-4" />
              new id
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
