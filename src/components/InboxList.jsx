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
      className={`anim-slide-up w-full text-left group transition-all duration-250 rounded-lg sm:rounded-xl border-2 ${
        isSelected
          ? 'bg-white border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.01]'
          : 'bg-white border-slate-200 hover:border-cyan-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="relative p-2.5 sm:p-3 lg:p-4">
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute left-0 top-2 sm:top-3 bottom-2 sm:bottom-3 w-1 rounded-r-full bg-cyan-500" />
        )}
        
        <div className="flex items-start gap-2.5 sm:gap-3 lg:gap-4">
          {/* Avatar */}
          <div className={`shrink-0 flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-lg sm:rounded-xl border-2 text-xs sm:text-sm font-extrabold ${colorClass} transition-transform duration-300 group-hover:scale-105`}>
            {initials}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              <p className="truncate text-xs sm:text-sm font-bold text-slate-900">{email.from}</p>
              {isSelected && (
                <span className="shrink-0 hidden sm:inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-[0.55rem] sm:text-[0.6rem] font-extrabold uppercase tracking-wider text-cyan-700">
                  active
                </span>
              )}
            </div>

            <p className="truncate text-xs sm:text-sm font-bold text-slate-600 mb-0.5 sm:mb-1.5">
              {email.subject || '(No Subject)'}
            </p>
            <p className="line-clamp-1 sm:line-clamp-2 text-[0.65rem] sm:text-xs leading-relaxed text-slate-500">
              {email.bodyText || 'No preview available'}
            </p>
          </div>

          {/* Time + Chevron */}
          <div className="shrink-0 flex flex-col items-end gap-1 sm:gap-1.5">
            <span className="text-[0.55rem] sm:text-[0.65rem] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              {formatDate(email.receivedAt)}
            </span>
            <ChevronRight className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 ${isSelected ? 'text-cyan-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5'}`} />
          </div>
        </div>
      </div>
    </button>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="anim-scale-in flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center">
      <div className="relative mb-4 sm:mb-6">
        <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl" />
        <div className="relative flex h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 items-center justify-center rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white border-2 border-slate-200 shadow-lg">
          <Inbox className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-slate-300" />
        </div>
      </div>
      
      <div className="space-y-1.5 sm:space-y-2 max-w-xs">
        <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900">Inbox Empty</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Your temporary mailbox is ready. Use the address above and emails will appear here instantly.
        </p>
      </div>
      
      <div className="mt-4 sm:mt-6 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100 border border-slate-200">
        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-500" />
        <span className="text-[0.65rem] sm:text-xs text-slate-700 font-bold">Auto-deletes after 15 minutes</span>
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
      <div className="card rounded-xl sm:rounded-2xl lg:rounded-3xl flex flex-col h-full overflow-hidden border-2 border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-5 lg:px-6 py-3 sm:py-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-cyan-50 border-2 border-cyan-200">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-700" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-900">Inbox</h3>
              <p className="text-[0.6rem] sm:text-[0.7rem] text-slate-600 font-bold">
                {emails.length} {emails.length === 1 ? 'message' : 'messages'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-50 border-2 border-emerald-200">
            <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600" />
            <span className="text-[0.55rem] sm:text-[0.65rem] font-extrabold text-emerald-700 uppercase tracking-wider">Secure</span>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-2.5">
          {emails.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2 sm:space-y-2.5">
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
