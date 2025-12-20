import { useRef } from 'react';
import { ChevronLeft, Trash2, Mail, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export default function EmailDetail({ email, onClose }) {
  const iframeRef = useRef(null);

  // Resize logic for iframe
  const resizeIframe = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      const height = Math.max(
        doc.body?.scrollHeight || 0,
        doc.documentElement?.scrollHeight || 0
      );
      iframe.style.height = `${height + 20}px`; // Add buffer
    } catch {
      // ignore
    }
  };

  const composeEmailSrcDoc = (html) => {
    const sanitized = (html || '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"><style>
      html,body{margin:0;padding:0;background:transparent;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;height:auto!important;min-height:0!important;overflow:hidden!important}
      *{max-width:100%!important;box-sizing:border-box!important}
      img,svg,video{max-width:100%!important;height:auto!important;display:block}
      a{color:#8b5cf6!important;text-decoration:underline!important}
      /* Dark mode adaptation for email content */
      p, h1, h2, h3, h4, h5, h6, li, span, div { color: #cbd5e1 !important; }
      body > :last-child{margin-bottom:0!important}
    </style></head><body>${sanitized}</body></html>`;
  };

  return (
    <div 
      className={cn(
        "flex flex-col bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-full min-h-[500px]",
        "fixed inset-0 z-50 lg:static lg:inset-auto", // Mobile overlay behavior
        !email && "hidden lg:flex" // Hide on mobile if no email
      )}
    >
      {email ? (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0F172A]/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-full text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Subject</span>
                <h2 className="font-bold text-slate-100 truncate max-w-[200px] sm:max-w-md">
                  {email.subject || '(No Subject)'}
                </h2>
              </div>
            </div>
            
            <button className="p-2.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-all border border-transparent hover:border-rose-500/20">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Meta Info */}
          <div className="p-6 bg-[#0F172A]/30 border-b border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-violet-500/20">
                  {email.from.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-slate-200">{email.from}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-slate-400 border border-white/5">Sender</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">To: {email.to}</div>
                </div>
              </div>
              
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-500 mb-1 flex items-center justify-end gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Received
                </div>
                <div className="text-sm font-medium text-slate-300">
                  {new Date(email.receivedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto bg-[#0F172A]/40 p-6 relative custom-scrollbar">
            {email.bodyHtml ? (
              <iframe
                title="email-content"
                ref={iframeRef}
                className="w-full min-h-[400px] block border-0"
                onLoad={resizeIframe}
                sandbox="allow-same-origin allow-popups allow-top-navigation-by-user-activation"
                srcDoc={composeEmailSrcDoc(email.bodyHtml)}
              />
            ) : (
              <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
                {email.bodyText || '(Empty message)'}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="hidden lg:flex flex-col items-center justify-center h-full text-center p-12">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10">
            <Mail className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-200 mb-2">No Selection</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            Select an email from the inbox list to view its contents securely.
          </p>
        </div>
      )}
    </div>
  );
}
