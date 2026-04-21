import { memo, useCallback } from 'react';
import { Inbox, Radio, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

const EmailItem = memo(function EmailItem({ email, isSelected, onClick, formatDate, index }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index, 6) * 55}ms` }}
      className={cn(
        'group section-reveal section-delay-2 relative w-full overflow-hidden rounded-[1.35rem] border px-4 py-4 text-left transition-all duration-300',
        isSelected
          ? 'border-[rgba(35,52,73,0.16)] bg-[linear-gradient(145deg,rgba(255,255,255,0.62),rgba(239,230,217,0.92))] shadow-[0_1.4rem_2.8rem_rgba(77,57,35,0.12)]'
          : 'border-[rgba(85,73,61,0.08)] bg-[rgba(255,255,255,0.34)] hover:-translate-y-0.5 hover:border-[rgba(188,109,73,0.16)] hover:bg-[rgba(255,255,255,0.48)]'
      )}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border text-sm font-bold uppercase transition-colors',
              isSelected
                ? 'border-[rgba(35,52,73,0.14)] bg-[rgba(35,52,73,0.08)] text-[var(--signal-ink)]'
                : 'border-[rgba(85,73,61,0.08)] bg-[rgba(255,255,255,0.46)] text-[var(--text-secondary)] group-hover:border-[rgba(188,109,73,0.16)] group-hover:text-[var(--signal-clay)]'
            )}
          >
            {email.from.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-[var(--signal-ink)]">{email.from}</p>
              {isSelected && (
                <span className="hidden rounded-full border border-[rgba(35,52,73,0.14)] bg-[rgba(35,52,73,0.08)] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--signal-ink)] sm:inline-flex">
                  active
                </span>
              )}
            </div>

            <p className="mb-1.5 line-clamp-1 text-sm font-medium text-[var(--text-secondary)]">
              {email.subject || '(No Subject)'}
            </p>
            <p className="line-clamp-2 text-xs leading-5 text-[var(--text-muted)]">
              {email.bodyText || 'No preview available'}
            </p>
          </div>
        </div>

        <div className="rounded-full border border-[rgba(85,73,61,0.08)] bg-[rgba(255,255,255,0.52)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {formatDate(email.receivedAt)}
        </div>
      </div>

      {isSelected && (
        <div className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-[var(--signal-clay)] shadow-[0_0_18px_rgba(188,109,73,0.28)]" />
      )}
    </button>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center sm:px-8">
      <div className="mb-5 flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-[1.4rem] border border-[rgba(85,73,61,0.1)] bg-[rgba(255,255,255,0.46)]">
        <ShieldAlert className="h-8 w-8 text-[var(--text-muted)]" />
      </div>
      <div className="editorial-kicker mb-2">Inbox Waiting</div>
      <p className="font-display text-[2rem] leading-none text-[var(--signal-ink)] sm:text-[2.2rem]">
        Nothing has landed yet.
      </p>
      <p className="mt-3 max-w-[21rem] text-sm leading-7 text-[var(--text-secondary)]">
        Keep the address active, complete your verification step, and any new message will flow
        into this queue automatically.
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
        'control-panel panel-topline section-reveal section-delay-2 flex h-full min-h-[28rem] flex-col rounded-[1.8rem]',
        selectedEmail ? 'hidden lg:flex' : 'flex'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(85,73,61,0.08)] px-4 py-4 sm:px-5">
        <div>
          <div className="editorial-kicker mb-1 flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-[var(--signal-clay)]" />
            Incoming Feed
          </div>
          <h3 className="font-display text-[2rem] leading-none text-[var(--signal-ink)]">
            Recent messages
          </h3>
        </div>

        <div className="rounded-full border border-[rgba(35,52,73,0.1)] bg-[rgba(255,255,255,0.42)] px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--signal-ink)]">
          {emails.length} in queue
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="mb-4 flex items-center gap-2 rounded-[1.15rem] border border-[rgba(85,73,61,0.08)] bg-[rgba(255,255,255,0.34)] px-3.5 py-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
          <Inbox className="h-4 w-4 text-[var(--signal-clay)]" />
          Real-time snapshots stay here until they expire
        </div>

        <div className="space-y-3">
          {emails.length === 0 ? (
            <EmptyState />
          ) : (
            emails.map((email, index) => (
              <EmailItem
                key={email.id}
                email={email}
                index={index}
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
