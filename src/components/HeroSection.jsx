import { useState, memo, useCallback } from 'react';
import {
  CheckCircle2,
  Clock3,
  Copy,
  Link2,
  RefreshCw,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '../lib/utils';

const FeatureBadge = memo(function FeatureBadge({ icon, label, tone }) {
  const Icon = icon;

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-200 shadow-[0_10px_24px_rgba(2,8,20,0.18)]">
      <Icon className={cn('h-3.5 w-3.5', tone)} />
      <span>{label}</span>
    </div>
  );
});

const StatusMetric = memo(function StatusMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left shadow-[0_12px_30px_rgba(2,8,20,0.16)]">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </div>
      <div className="font-display text-lg font-bold text-white">{value}</div>
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
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }, [emailAddress]);

  return (
    <section className="premium-panel premium-panel-strong section-reveal rounded-[2rem] px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,232,249,0.11),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.08),transparent_24%)]" />
      <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] xl:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-300/8 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
            <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
            Futuristic Private Inbox
          </div>

          <div className="max-w-3xl space-y-4">
            <h2 className="font-display text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Disposable identity built for{' '}
              <span className="text-gradient-cyan">instant verification</span>
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Generate a private address, catch inbound messages in real time, and discard the
              entire inbox after a short lifecycle. Fast enough for OTP flows, clean enough for
              daily verification work.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatusMetric label="TTL" value="15 min" />
            <StatusMetric label="Delivery" value="Realtime" />
            <StatusMetric label="Routing" value="Secure" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FeatureBadge icon={Shield} label="Encrypted Relay" tone="text-cyan-200" />
            <FeatureBadge icon={Clock3} label="Auto Purge" tone="text-amber-300" />
            <FeatureBadge icon={Zap} label="Instant Sync" tone="text-violet-300" />
          </div>
        </div>

        <div className="relative">
          <div className="premium-panel glow-cyan rounded-[1.75rem] p-4 sm:p-5">
            <div className="relative rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(5,11,21,0.98),rgba(9,18,32,0.92))] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
                    Active Identity
                  </div>
                  <div className="text-sm font-medium text-slate-300">
                    Ready to receive at your private route
                  </div>
                </div>
                <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100/90">
                  Live
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-cyan-300/14 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Inbox Address
                  </div>
                  <div className="font-mono-ui text-[11px] text-slate-500">Ephemeral route</div>
                </div>

                <div className="font-mono-ui mb-4 break-all text-left text-base font-semibold leading-7 text-white sm:text-lg">
                  {emailAddress}
                </div>

                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'button-sheen inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-all duration-300',
                      copied
                        ? 'border border-emerald-400/20 bg-emerald-400/12 text-emerald-100'
                        : 'bg-[linear-gradient(135deg,#89f5ff,#dbeafe)] text-slate-950 shadow-[0_16px_38px_rgba(34,211,238,0.2)] hover:-translate-y-0.5'
                    )}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy address
                      </>
                    )}
                  </button>

                  <button
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/22 hover:bg-white/[0.07]"
                  >
                    <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>

                  <button
                    onClick={onCreateNew}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-amber-300/18 bg-amber-300/10 px-4 text-sm font-semibold text-amber-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-300/16"
                  >
                    <Zap className="h-4 w-4" />
                    <span className="hidden sm:inline">New</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  <Link2 className="h-3.5 w-3.5 text-cyan-200/80" />
                  Shareable mailbox link
                </div>
                <a
                  href={mailboxLink}
                  className="font-mono-ui text-sm leading-6 text-cyan-100/90 transition-colors hover:text-white break-all"
                >
                  {mailboxLink}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
