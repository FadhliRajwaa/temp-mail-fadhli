import { memo, useCallback } from 'react';
import { Inbox, Radar } from 'lucide-react';
import { cn } from '../lib/utils';

const EmailItem = memo(function EmailItem({ email, isSelected, onClick, formatDate }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative w-full overflow-hidden rounded-[1.35rem] border p-4 text-left transition-all duration-300',
        'shadow-[0_18px_40px_rgba(2,8,20,0.16)] hover:-translate-y-0.5',
        isSelected
          ? 'border-cyan-300/24 bg-cyan-300/10 shadow-[0_24px_50px_rgba(12,74,110,0.22)]'
          : 'border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.06]'
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,232,249,0.1),transparent_34%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-[0_16px_28px_rgba(8,47,73,0.24)]',
              isSelected
                ? 'bg-[linear-gradient(135deg,#67e8f9,#818cf8)]'
                : 'bg-[linear-gradient(135deg,#1e293b,#0f172a)] group-hover:bg-[linear-gradient(135deg,#22d3ee,#6366f1)]'
            )}
          >
            {email.from.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-white">{email.from}</p>
              {isSelected && (
                <span className="hidden rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100 sm:inline-flex">
                  Active
                </span>
              )}
            </div>

            <p className="mb-1 line-clamp-1 text-sm font-medium text-slate-200">
              {email.subject || '(No Subject)'}
            </p>

            <p className="line-clamp-1 text-xs leading-5 text-slate-400">
              {email.bodyText || 'No preview available'}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-full border border-white/8 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {formatDate(email.receivedAt)}
        </div>
      </div>

      {isSelected && (
        <div className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.7)]" />
      )}
    </button>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-12 text-center">
      <div className="mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.6rem] border border-cyan-300/12 bg-cyan-300/8 shadow-[0_20px_40px_rgba(6,20,35,0.3)]">
        <Inbox className="h-8 w-8 text-cyan-100/70" />
      </div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-500">
        Standby
      </div>
      <p className="mb-2 font-display text-xl font-bold text-white">Waiting for inbound mail</p>
      <p className="max-w-[16rem] text-sm leading-6 text-slate-400">
        New messages will appear here automatically as soon as the relay catches them.
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

    if (diffMins < 1) return 'Now';
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
        'premium-panel section-reveal flex h-full min-h-[28rem] flex-col rounded-[1.9rem]',
        selectedEmail ? 'hidden lg:flex' : 'flex'
      )}
    >
      <div className="relative flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            <Radar className="h-3.5 w-3.5 text-cyan-200/80" />
            Live Inbox
          </div>
          <h3 className="font-display text-xl font-bold text-white">Incoming stream</h3>
        </div>

        <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
          {emails.length} mail
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
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
