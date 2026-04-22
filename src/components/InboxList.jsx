import { memo, useCallback } from 'react';
import { Inbox, Mail, ShieldCheck, Clock, ChevronRight } from 'lucide-react';

const AVATAR_COLORS = [
  'from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/20',
  'from-violet-500/20 to-violet-600/20 text-violet-400 border-violet-500/20',
  'from-cyan-500/20 to-cyan-600/20 text-cyan-400 border-cyan-500/20',
  'from-emerald-500/20 to-emerald-600/20 text-emerald-400 border-emerald-500/20',
  'from-amber-500/20 to-amber-600/20 text-amber-400 border-amber-500/20',
];

const EmailItem = memo(function EmailItem({ email, isSelected, onClick, formatDate, index }) {
  const initials = email.from?.charAt(0)?.toUpperCase() || '?';
  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className={`anim-fade-up w-full text-left group transition-all duration-200 rounded-xl cursor-pointer ${
        isSelected
          ? 'bg-blue-500/[0.08] border border-blue-500/25 shadow-lg shadow-blue-500/5'
          : 'bg-transparent border border-transparent hover:bg-[var(--color-surface-3)] hover:border-[var(--color-border-default)]'
      }`}
    >
      <div className="relative p-3 sm:p-3.5">
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-blue-500" />
        )}

        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`shrink-0 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br border text-xs sm:text-sm font-bold ${colorClass} transition-transform duration-200 group-hover:scale-105`}>
            {initials}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="truncate text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">{email.from}</p>
            </div>
            <p className="truncate text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              {email.subject || '(No Subject)'}
            </p>
            <p className="line-clamp-1 text-[0.7rem] sm:text-xs text-[var(--color-text-muted)] leading-relaxed">
              {email.bodyText || 'No preview available'}
            </p>
          </div>

          {/* Time + Chevron */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <span className="text-[0.6rem] sm:text-[0.65rem] font-medium text-[var(--color-text-faint)] whitespace-nowrap">
              {formatDate(email.receivedAt)}
            </span>
            <ChevronRight className={`h-3.5 w-3.5 transition-all duration-200 ${isSelected ? 'text-blue-400 translate-x-0.5' : 'text-[var(--color-text-faint)] group-hover:text-[var(--color-text-muted)] group-hover:translate-x-0.5'}`} />
          </div>
        </div>
      </div>
    </button>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="anim-scale-in flex flex-col items-center justify-center px-4 py-14 sm:py-20 text-center">
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl scale-150" />
        <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-3)] border border-[var(--color-border-default)]">
          <Inbox className="h-6 w-6 sm:h-7 sm:w-7 text-[var(--color-text-faint)]" />
        </div>
      </div>

      <div className="space-y-1.5 max-w-xs">
        <h3 className="text-heading text-base sm:text-lg text-[var(--color-text-primary)]">Inbox Empty</h3>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
          Your temporary mailbox is ready. Use the address above and emails will appear here instantly.
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-3)] border border-[var(--color-border-subtle)]">
        <Clock className="h-3 w-3 text-[var(--color-text-faint)]" />
        <span className="text-[0.65rem] sm:text-xs text-[var(--color-text-muted)] font-medium">Auto-deletes after 15 minutes</span>
      </div>
    </div>
  );
});

const InboxList = memo(function InboxList({ emails, selectedEmail, onSelectEmail }) {
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;

    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }, []);

  return (
    <section className="anim-fade-up delay-2 flex flex-col h-full">
      <div className="surface-elevated rounded-2xl sm:rounded-3xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/15">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-heading text-sm sm:text-base text-[var(--color-text-primary)]">Inbox</h3>
              <p className="text-[0.6rem] sm:text-[0.65rem] text-[var(--color-text-muted)] font-medium">
                {emails.length} {emails.length === 1 ? 'message' : 'messages'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/15">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span className="text-[0.6rem] sm:text-[0.65rem] font-semibold text-emerald-400 uppercase tracking-wider">Secure</span>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
          {emails.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-1">
              {emails.map((email, index) => (
                <EmailItem
                  key={email.id}
                  email={email}
                  index={index}
                  isSelected={selectedEmail?.id === email.id}
                  onClick={() => onSelectEmail(email)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default InboxList;
