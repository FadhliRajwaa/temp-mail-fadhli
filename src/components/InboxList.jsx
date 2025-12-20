import { Inbox, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function InboxList({ emails, selectedEmail, onSelectEmail, loading }) {
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className={cn(
      "flex flex-col bg-[#0F172A]/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-full min-h-[500px] transition-all duration-500",
      selectedEmail ? "hidden lg:flex" : "flex"
    )}>
      
      {/* Inbox Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0F172A]/50">
        <h3 className="font-bold text-slate-200 flex items-center gap-2.5">
          <Inbox className="w-5 h-5 text-violet-400" />
          Incoming Messages
        </h3>
        <span className="bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
          {emails.length}
        </span>
      </div>

      {/* Inbox Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-3 space-y-2">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10 animate-pulse">
              <Inbox className="w-8 h-8 text-slate-500" />
            </div>
            <p className="font-medium text-slate-300">Awaiting emails...</p>
            <p className="text-xs text-slate-500 mt-2 max-w-[200px]">
              Any emails sent to your temporary address will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={cn(
                  "relative group cursor-pointer p-4 rounded-2xl border transition-all duration-300",
                  selectedEmail?.id === email.id
                    ? "bg-violet-600/20 border-violet-500/50 shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)]"
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shrink-0">
                      {email.from.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className={cn(
                        "font-semibold text-sm truncate transition-colors",
                        selectedEmail?.id === email.id ? "text-violet-200" : "text-slate-200 group-hover:text-white"
                      )}>
                        {email.from}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap bg-black/20 px-2 py-1 rounded-md">
                    {formatDate(email.receivedAt)}
                  </span>
                </div>
                
                <div className="pl-11">
                  <p className="text-sm font-medium text-slate-300 truncate mb-1">
                    {email.subject || '(No Subject)'}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1 group-hover:text-slate-400 transition-colors">
                    {email.bodyText || 'No preview available'}
                  </p>
                </div>

                {/* Active Indicator */}
                {selectedEmail?.id === email.id && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-violet-500 rounded-l-2xl" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
