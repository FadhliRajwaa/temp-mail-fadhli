import { Inbox } from 'lucide-react';
import { cn } from '../lib/utils';
import { memo, useCallback } from 'react';

const EmailItem = memo(function EmailItem({ email, isSelected, onClick, formatDate }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer p-4 rounded-xl border transition-colors",
        isSelected
          ? "bg-violet-600/15 border-violet-500/40"
          : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/10"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {email.from.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className={cn(
              "font-semibold text-sm truncate",
              isSelected ? "text-violet-200" : "text-slate-200"
            )}>
              {email.from}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap bg-white/[0.03] px-2 py-1 rounded">
          {formatDate(email.receivedAt)}
        </span>
      </div>
      
      <div className="pl-12">
        <p className="text-sm font-medium text-slate-300 truncate mb-1">
          {email.subject || '(No Subject)'}
        </p>
        <p className="text-xs text-slate-500 line-clamp-1">
          {email.bodyText || 'No preview available'}
        </p>
      </div>

      {isSelected && (
        <div className="absolute inset-y-0 left-0 w-1 bg-violet-500 rounded-l-xl" />
      )}
    </div>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
        <Inbox className="w-7 h-7 text-slate-600" />
      </div>
      <p className="font-semibold text-slate-300 mb-1">Waiting for emails...</p>
      <p className="text-xs text-slate-500 max-w-[200px]">
        Messages will appear here instantly
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
    return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }, []);

  return (
    <div className={cn(
      "flex flex-col bg-slate-900/50 border border-white/[0.06] rounded-2xl overflow-hidden h-full min-h-[500px]",
      selectedEmail ? "hidden lg:flex" : "flex"
    )}>
      
      {/* Inbox Header */}
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="font-bold text-slate-200 flex items-center gap-2">
          <Inbox className="w-4 h-4 text-violet-400" />
          Inbox
        </h3>
        <span className="bg-violet-500/15 text-violet-300 border border-violet-500/25 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {emails.length}
        </span>
      </div>

      {/* Inbox Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
  );
});

export default InboxList;
