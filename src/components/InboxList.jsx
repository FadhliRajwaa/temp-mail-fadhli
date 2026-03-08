import { memo, useCallback } from 'react';
import { Inbox, Radio, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

const EmailItem = memo(function EmailItem({ email, isSelected, onClick, formatDate }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative w-full overflow-hidden rounded-[1.15rem] border px-4 py-3.5 text-left transition-all duration-200',
        isSelected
          ? 'border-lime-300/22 bg-lime-300/10 shadow-[0_18px_34px_rgba(0,0,0,0.22)]'
          : 'border-white/8 bg-white/[0.03] hover:-translate-y-0.5 hover:border-teal-300/18 hover:bg-white/[0.05]'
      )}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-bold uppercase',
              isSelected
                ? 'border-lime-300/18 bg-lime-300/12 text-lime-100'
                : 'border-white/10 bg-white/[0.04] text-[var(--text-secondary)] group-hover:border-teal-300/18 group-hover:text-white'
            )}
          >
            {email.from.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-white">{email.from}</p>
              {isSelected && (
                <span className="hidden rounded-full border border-lime-300/16 bg-lime-300/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-lime-100 sm:inline-flex">
                  active
                </span>
              )}
            </div>

            <p className="mb-1 line-clamp-1 text-sm font-medium text-[var(--text-secondary)]">
              {email.subject || '(No Subject)'}
            </p>
            <p className="line-clamp-1 text-xs leading-5 text-[var(--text-muted)]">
              {email.bodyText || 'No preview available'}
            </p>
          </div>
        </div>

        <div className="rounded-full border border-white/8 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {formatDate(email.receivedAt)}
        </div>
      </div>

      {isSelected && (
        <div className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-lime-300 shadow-[0_0_18px_rgba(190,242,100,0.55)]" />
      )}
    </button>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-12 text-center">
      <div className="mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
        <ShieldAlert className="h-8 w-8 text-[var(--text-muted)]" />
      </div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
        queue idle
      </div>
      <p className="font-display text-2xl font-bold uppercase tracking-[0.12em] text-white">
        waiting for traffic
      </p>
      <p className="mt-2 max-w-[17rem] text-sm leading-6 text-[var(--text-muted)]">
        Incoming messages will appear in the feed as soon as the relay captures them.
      </p>
    </div>
  );
});

const InboxList = memo(function InboxList({ emails, selectedEmail, onSelectEmail }) {
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;

    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }, []);

  return (
    <section
      className={cn(
        'control-panel panel-topline section-reveal flex h-full min-h-[28rem] flex-col rounded-[1.6rem]',
        selectedEmail ? 'hidden lg:flex' : 'flex'
      )}
    >
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">
            <Radio className="h-3.5 w-3.5 text-teal-200/80" />
            incoming feed
          </div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-[0.12em] text-white">
            signal queue
          </h3>
        </div>

        <div className="rounded-full border border-lime-300/16 bg-lime-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-lime-100">
          {emails.length} live
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
          <Inbox className="h-4 w-4 text-teal-200/70" />
          monitor latest inbound message snapshots
        </div>

        <div className="space-y-3">
          {emails.length === 0 ? (
            <EmptyState />
          ) : (
            emails.map((email) => (
              <EmailItem
                key={email.id}
                email={email}
                isSelected={selectedEmail?.id === email.id}
                onClick={() => onSelectEmail(email)}
                formatDate={formatDate}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
});

export default InboxList;
