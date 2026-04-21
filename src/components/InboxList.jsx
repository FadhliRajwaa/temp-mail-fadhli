import { memo, useCallback } from 'react';
import { Inbox, Mail, ShieldCheck, Clock, ChevronRight } from 'lucide-react';

const EmailItem = memo(function EmailItem({ email, isSelected, onClick, formatDate, index }) {
  const initials = email.from?.charAt(0)?.toUpperCase() || '?';
  const domainColors = [
    'bg-teal-100 text-teal-800 border-teal-300',
    'bg-cyan-100 text-cyan-800 border-cyan-300',
    'bg-blue-100 text-blue-800 border-blue-300',
    'bg-indigo-100 text-indigo-800 border-indigo-300',
    'bg-sky-100 text-sky-800 border-sky-300',
  ];
  const colorClass = domainColors[index % domainColors.length];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className={`anim-slide-up w-full text-left group transition-all duration-250 rounded-xl sm:rounded-2xl border-2 ${
        isSelected
          ? 'bg-white border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.01]'
          : 'bg-white border-slate-200 hover:border-cyan-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="relative p-3.5 sm:p-4">
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-cyan-500" />
        )}
        
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Avatar */}
          <div className={`shrink-0 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border-2 text-sm font-extrabold ${colorClass} transition-transform duration-300 group-hover:scale-105`}>
            {initials}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="truncate text-sm font-bold text-slate-900">{email.from}</p>
              {isSelected && (
                <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-[0.6rem] font-extrabold uppercase tracking-wider text-cyan-700 sm:inline-flex">
                  active
                </span>
              )}
            </div>

            <p className="truncate text-sm font-bold text-slate-600 mb-1.5">
              {email.subject || '(No Subject)'}
            </p>
            
            <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
              {email.bodyText || 'No preview available'}
            </p>
          </div>

          {/* Time + Chevron */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <span className="text-[0.65rem] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              {formatDate(email.receivedAt)}
            </span>
            <ChevronRight className={`h-4 w-4 transition-all duration-300 ${isSelected ? 'text-cyan-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5'}`} />
          </div>
        </div>
      </div>
    </button>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="anim-scale-in flex flex-col items-center justify-center px-6 py-16 sm:py-20 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl" />
        <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-white border-2 border-slate-200 shadow-lg">
          <Inbox className="h-8 w-8 sm:h-10 sm:w-10 text-slate-300" />
        </div>
      </div>
      
      <div className="space-y-2 max-w-xs">
        <h3 className="text-heading text-lg sm:text-xl text-slate-900 font-extrabold">Inbox Empty</h3>
        <p className="text-body text-sm text-slate-600 leading-relaxed">
          Your temporary mailbox is ready. Use the address above and emails will appear here instantly.
        </p>
      </div>
      
      <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
        <Clock className="h-3.5 w-3.5 text-slate-500" />
        <span className="text-xs text-slate-700 font-bold">Auto-deletes after 15 minutes</span>
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
    <section className="anim-slide-up delay-2 flex flex-col h-full">
      <div className="card rounded-2xl sm:rounded-3xl flex flex-col h-full overflow-hidden border-2 border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 border-2 border-cyan-200">
              <Mail className="h-4 w-4 text-cyan-700" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Inbox</h3>
              <p className="text-[0.7rem] text-slate-600 font-bold">
                {emails.length} {emails.length === 1 ? 'message' : 'messages'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border-2 border-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[0.65rem] font-extrabold text-emerald-700 uppercase tracking-wider">Secure</span>
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
