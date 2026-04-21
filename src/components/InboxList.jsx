import { memo, useCallback } from 'react';
import { Inbox, Mail, ShieldCheck, Clock, ChevronRight } from 'lucide-react';

const EmailItem = memo(function EmailItem({ email, isSelected, onClick, formatDate, index }) {
  const initials = email.from?.charAt(0)?.toUpperCase() || '?';
  const domainColors = [
    'bg-teal-50 text-teal-700 border-teal-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-rose-50 text-rose-700 border-rose-200',
    'bg-indigo-50 text-indigo-700 border-indigo-200',
    'bg-emerald-50 text-emerald-700 border-emerald-200',
  ];
  const colorClass = domainColors[index % domainColors.length];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className={`animate-fade-in-up w-full text-left group transition-all duration-300 rounded-xl sm:rounded-2xl border ${
        isSelected
          ? 'bg-white border-teal-300 shadow-lg shadow-teal-500/10 scale-[1.01]'
          : 'bg-white/60 border-stone-200/60 hover:bg-white hover:border-stone-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="relative p-3.5 sm:p-4">
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-teal-500" />
        )}
        
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Avatar */}
          <div className={`shrink-0 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border text-sm font-bold ${colorClass} transition-transform duration-300 group-hover:scale-105`}>
            {initials}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="truncate text-sm font-semibold text-[#1c1917]">{email.from}</p>
              {isSelected && (
                <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[0.6rem] font-bold uppercase tracking-wider text-teal-700">
                  Active
                </span>
              )}
            </div>

            <p className="truncate text-sm font-medium text-[#57534e] mb-1.5">
              {email.subject || '(No Subject)'}
            </p>
            
            <p className="line-clamp-2 text-xs leading-relaxed text-stone-400">
              {email.bodyText || 'No preview available'}
            </p>
          </div>

          {/* Time + Chevron */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <span className="text-[0.65rem] font-semibold text-stone-400 uppercase tracking-wider whitespace-nowrap">
              {formatDate(email.receivedAt)}
            </span>
            <ChevronRight className={`h-4 w-4 text-stone-300 transition-all duration-300 ${isSelected ? 'text-teal-500 translate-x-0.5' : 'group-hover:text-stone-400 group-hover:translate-x-0.5'}`} />
          </div>
        </div>
      </div>
    </button>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="animate-fade-in-scale flex flex-col items-center justify-center px-6 py-16 sm:py-20 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-xl" />
        <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white to-stone-50 border border-stone-200/80 shadow-lg">
          <Inbox className="h-8 w-8 sm:h-10 sm:w-10 text-stone-300" />
        </div>
      </div>
      
      <div className="space-y-2 max-w-xs">
        <h3 className="text-heading text-lg sm:text-xl text-[#1c1917]">Inbox Empty</h3>
        <p className="text-body text-sm text-stone-600 leading-relaxed">
          Your temporary mailbox is ready. Use the address above and emails will appear here instantly.
        </p>
      </div>
      
      <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 border border-stone-100">
        <Clock className="h-3.5 w-3.5 text-stone-500" />
        <span className="text-xs text-stone-600 font-medium">Auto-deletes after 15 minutes</span>
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
    <section className="animate-fade-in-up stagger-2 flex flex-col h-full">
      <div className="card-surface rounded-2xl sm:rounded-3xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 border border-teal-100">
              <Mail className="h-4 w-4 text-teal-600" />
            </div>
            <div>
              <h3 className="text-heading text-base sm:text-lg font-semibold text-[#1c1917]">Inbox</h3>
              <p className="text-[0.7rem] text-stone-600 font-medium">
                {emails.length} {emails.length === 1 ? 'message' : 'messages'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-100">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[0.65rem] font-semibold text-stone-500 uppercase tracking-wider">Secure</span>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {emails.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2.5">
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
