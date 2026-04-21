import { useState, memo, useCallback } from 'react';
import {
  CheckCheck,
  Clock3,
  Copy,
  Dot,
  Link2,
  MoveRight,
  RefreshCw,
  ScanSearch,
  Zap,
} from 'lucide-react';
import { cn } from '../lib/utils';

const StatusChip = memo(function StatusChip({ icon, label, tone }) {
  const Icon = icon;

  return (
    <div className="flex min-h-11 items-center gap-2 rounded-full border border-[rgba(85,73,61,0.1)] bg-[rgba(255,255,255,0.42)] px-3.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
      <Icon className={cn('h-3.5 w-3.5', tone)} />
      <span>{label}</span>
    </div>
  );
});

const OperationalLine = memo(function OperationalLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[rgba(85,73,61,0.08)] py-3 last:border-b-0">
      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
        {label}
      </div>
      <div className="font-mono-ui text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--signal-ink)]">
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
    <section className="control-panel control-panel-strong panel-topline mail-shell section-reveal section-delay-1 rounded-[2rem] px-4 py-4 sm:px-6 sm:py-6 lg:px-7 xl:px-8 xl:py-8">
      <div className="absolute inset-0 signal-grid opacity-[0.12]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.48),transparent_35%),radial-gradient(circle_at_100%_0,rgba(35,52,73,0.05),transparent_26%)]" />

      <div className="relative grid gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(22rem,0.94fr)] xl:items-start">
        <div className="space-y-5 lg:space-y-6">
          <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[rgba(35,52,73,0.12)] bg-[rgba(255,255,255,0.52)] px-3.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--signal-ink)] shadow-[0_0.75rem_1.75rem_rgba(77,57,35,0.06)]">
            <ScanSearch className="h-3.5 w-3.5 text-[var(--signal-clay)]" />
            Disposable Inbox Studio
          </div>

          <div className="max-w-3xl space-y-4">
            <h2 className="font-display max-w-[11ch] text-[2.5rem] leading-[0.95] text-[var(--signal-ink)] sm:text-[3.3rem] lg:text-[4.35rem]">
              Temporary mail with a calmer, sharper presence.
            </h2>

            <p className="max-w-2xl text-[0.98rem] leading-7 text-[var(--text-secondary)] sm:text-[1.05rem]">
              Built for OTP checks, quick signups, and one-off verification flows. Generate a fresh
              address, watch messages land in real time, and move on without inbox residue or visual
              noise.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(85,73,61,0.1)] bg-[rgba(255,255,255,0.42)] px-3 py-2">
              <Dot className="h-4 w-4 text-[var(--signal-sage)]" />
              auto purge after 15 min
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(85,73,61,0.1)] bg-[rgba(255,255,255,0.42)] px-3 py-2">
              <Dot className="h-4 w-4 text-[var(--signal-gold)]" />
              smooth live refresh
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(85,73,61,0.1)] bg-[rgba(255,255,255,0.42)] px-3 py-2">
              <Dot className="h-4 w-4 text-[var(--signal-clay)]" />
              mailbox deep link ready
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(15rem,0.9fr)]">
            <div className="rounded-[1.7rem] border border-[rgba(85,73,61,0.1)] bg-[rgba(255,255,255,0.36)] px-4 py-4 sm:px-5">
              <div className="editorial-kicker mb-3">Operational Notes</div>
              <div className="space-y-0">
                <OperationalLine label="Mailbox link" value="Direct route" />
                <OperationalLine label="Realtime mode" value="Socket + recovery" />
                <OperationalLine label="Retention" value="TTL cleanup" />
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-[rgba(85,73,61,0.1)] bg-[rgba(255,255,255,0.36)] px-4 py-4 sm:px-5">
              <div className="editorial-kicker mb-3">Feels Right For</div>
              <div className="flex flex-wrap gap-2">
                <StatusChip icon={Clock3} label="OTP" tone="text-[var(--signal-gold)]" />
                <StatusChip icon={Zap} label="Signups" tone="text-[var(--signal-clay)]" />
                <StatusChip icon={Link2} label="Testing" tone="text-[var(--signal-ink)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="control-panel floating-card rounded-[1.8rem] border border-[rgba(35,52,73,0.12)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] sm:p-5 lg:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="editorial-kicker mb-1">Active Mailbox</div>
              <div className="font-display text-[2rem] leading-none text-[var(--signal-ink)] sm:text-[2.25rem]">
                Ready to receive
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(115,129,97,0.16)] bg-[rgba(115,129,97,0.12)] px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--signal-sage)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--signal-sage)] signal-pulse" />
              open route
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-[rgba(85,73,61,0.1)] bg-[linear-gradient(160deg,rgba(255,255,255,0.72),rgba(245,234,221,0.92))] p-4 sm:p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="editorial-kicker mb-1">Mailbox Address</div>
                <div className="text-sm leading-6 text-[var(--text-secondary)]">
                  Keep this tab open and use the address below anywhere you need a temporary inbox.
                </div>
              </div>
              <MoveRight className="mt-1 hidden h-5 w-5 text-[var(--signal-clay)] sm:block" />
            </div>

            <div className="mb-5 rounded-[1.35rem] border border-[rgba(35,52,73,0.1)] bg-[rgba(255,255,255,0.7)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
              <div className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                current identity
              </div>
              <div className="font-mono-ui break-all text-left text-[0.98rem] font-semibold leading-7 text-[var(--signal-ink)] sm:text-[1.08rem]">
                {emailAddress}
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleCopyAddress}
                className={cn(
                  'button-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.15rem] border px-4 text-sm font-semibold uppercase tracking-[0.12em]',
                  copiedAddress
                    ? 'border-[rgba(115,129,97,0.18)] bg-[rgba(115,129,97,0.12)] text-[var(--signal-sage)]'
                    : 'border-[rgba(35,52,73,0.12)] bg-[var(--signal-ink)] text-[var(--bg-base)] shadow-[0_1rem_2.2rem_rgba(35,52,73,0.16)]'
                )}
              >
                {copiedAddress ? (
                  <>
                    <CheckCheck className="h-4 w-4" />
                    address copied
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
                  'button-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.15rem] border px-4 text-sm font-semibold uppercase tracking-[0.12em]',
                  copiedLink
                    ? 'border-[rgba(188,109,73,0.18)] bg-[rgba(188,109,73,0.12)] text-[var(--signal-clay)]'
                    : 'border-[rgba(188,109,73,0.14)] bg-[rgba(188,109,73,0.1)] text-[var(--signal-clay)]'
                )}
              >
                {copiedLink ? (
                  <>
                    <CheckCheck className="h-4 w-4" />
                    link copied
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

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
            <a
              href={mailboxLink}
              className="flex min-h-12 items-center rounded-[1.15rem] border border-[rgba(85,73,61,0.1)] bg-[rgba(255,255,255,0.4)] px-4 text-sm text-[var(--text-secondary)] transition-colors hover:border-[rgba(35,52,73,0.16)] hover:text-[var(--signal-ink)] break-all"
            >
              <span className="font-mono-ui line-clamp-1">{mailboxLink}</span>
            </a>

            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="button-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.15rem] border border-[rgba(174,138,65,0.16)] bg-[rgba(174,138,65,0.12)] px-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--signal-gold)]"
            >
              <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
              refresh
            </button>

            <button
              type="button"
              onClick={onCreateNew}
              className="button-surface inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.15rem] border border-[rgba(35,52,73,0.14)] bg-[rgba(35,52,73,0.08)] px-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--signal-ink)]"
            >
              <Zap className="h-4 w-4" />
              new inbox
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
