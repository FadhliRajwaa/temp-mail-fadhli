import { useRef, useMemo, useState, useEffect, memo, useCallback } from 'react';
import { ChevronLeft, Trash2, Mail, Calendar, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

function composeEmailSrcDoc(html) {
  const sanitized = (html || '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"><style>
      html,body{margin:0;padding:16px;background:transparent;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;height:auto!important;min-height:0!important;overflow:hidden!important;line-height:1.6}
      *{max-width:100%!important;box-sizing:border-box!important}
      img,svg,video{max-width:100%!important;height:auto!important;display:block}
      a{color:#a78bfa!important;text-decoration:underline!important}
      p,h1,h2,h3,h4,h5,h6,li,span,div{color:#cbd5e1!important}
      body>:last-child{margin-bottom:0!important}
    </style></head><body>${sanitized}</body></html>`;
}

const EmailDetail = memo(function EmailDetail({ email, onClose }) {
  const iframeRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    setIframeLoaded(false);
  }, [email?.id]);

  const resizeIframe = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;
        const height = Math.max(
          doc.body?.scrollHeight || 0,
          doc.documentElement?.scrollHeight || 0
        );
        iframe.style.height = `${height + 40}px`;
        setIframeLoaded(true);
      } catch {
        setIframeLoaded(true);
      }
    }, 50);
  }, []);

  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  const emailSrcDoc = useMemo(() =>
    email?.bodyHtml ? composeEmailSrcDoc(email.bodyHtml) : null,
    [email?.bodyHtml]
  );

  if (!email) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full min-h-[500px] text-center p-12 bg-slate-900/50 border border-white/[0.06] rounded-2xl">
        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-5">
          <Mail className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">Select an Email</h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm">
          Click on any message from your inbox to view its contents
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col bg-slate-900/50 border border-white/[0.06] rounded-2xl overflow-hidden h-full min-h-[500px]",
      "fixed inset-0 z-50 lg:static lg:inset-auto"
    )}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Subject</span>
            <h2 className="font-bold text-slate-100 truncate max-w-[200px] sm:max-w-md">
              {email.subject || '(No Subject)'}
            </h2>
          </div>
        </div>
        
        <button className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Meta Info */}
      <div className="p-5 border-b border-white/[0.04]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-lg font-bold text-white">
              {email.from.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-slate-200">{email.from}</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">To: {email.to}</div>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500 mb-1 flex items-center justify-end gap-1">
              <Calendar className="w-3 h-3" /> Received
            </div>
            <div className="text-sm font-medium text-slate-300">
              {new Date(email.receivedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto bg-[#080c14] p-5 relative">
        {emailSrcDoc ? (
          <div className="relative">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#080c14] z-10">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
              </div>
            )}
            <iframe
              title="email-content"
              ref={iframeRef}
              className={cn("w-full min-h-[400px] block border-0", !iframeLoaded && "opacity-0")}
              onLoad={resizeIframe}
              sandbox="allow-same-origin allow-popups allow-top-navigation-by-user-activation"
              loading="lazy"
              srcDoc={emailSrcDoc}
            />
          </div>
        ) : (
          <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
            {email.bodyText || '(Empty message)'}
          </div>
        )}
      </div>
    </div>
  );
});

export default EmailDetail;
