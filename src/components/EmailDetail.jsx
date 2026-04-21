import { useRef, useMemo, useState, useEffect, memo, useCallback } from 'react';
import { CalendarDays, ChevronLeft, ShieldCheck, Trash2, X, Eye, Loader2 } from 'lucide-react';

function composeEmailSrcDoc(html) {
  const sanitized = (html || '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  const styles = 'html,body{margin:0;padding:16px;background:#f8fafc;color:#0f172a;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;height:auto!important;min-height:0!important;overflow:hidden!important;line-height:1.65}*{max-width:100%!important;box-sizing:border-box!important}img,svg,video{max-width:100%!important;height:auto!important;display:block}a{color:#0891b2!important;text-decoration:underline!important}p,h1,h2,h3,h4,h5,h6,li,span,div{color:#0f172a!important}body>:last-child{margin-bottom:0!important}';
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"><style>' + styles + '</style></head><body>' + sanitized + '</body></html>';
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
        const height = Math.max(doc.body?.scrollHeight || 0, doc.documentElement?.scrollHeight || 0);
        iframe.style.height = Math.max(height + 32, 200) + 'px';
        setIframeLoaded(true);
      } catch {
        setIframeLoaded(true);
      }
    }, 80);
  }, []);

  useEffect(() => () => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
  }, []);

  const emailSrcDoc = useMemo(
    () => (email?.bodyHtml ? composeEmailSrcDoc(email.bodyHtml) : null),
    [email?.bodyHtml]
  );

  if (!email) {
    return (
      <div className="anim-scale-in hidden lg:flex flex-col items-center justify-center h-full min-h-[20rem] card rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 text-center border-2 border-slate-200">
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl" />
          <div className="relative flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-white border-2 border-slate-200 shadow-lg">
            <Eye className="h-5 w-5 sm:h-7 sm:w-7 text-slate-400" />
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1.5 sm:mb-2">Select a message</h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
          Click any email from the list to view its full content, sender details, and metadata.
        </p>
      </div>
    );
  }

  return (
    <div className="anim-slide-right h-full">
      {/* Mobile backdrop - only on mobile */}
      <div 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm lg:hidden anim-fade-in z-40"
        onClick={onClose}
      />
      
      {/* Content Panel */}
      <div className="fixed inset-x-0 bottom-0 lg:relative lg:inset-auto z-50 lg:z-auto h-[85vh] sm:h-[90vh] lg:h-full max-h-[calc(100vh-4rem)] lg:max-h-none rounded-t-2xl sm:rounded-t-3xl lg:rounded-none overflow-hidden flex flex-col anim-slide-up lg:anim-slide-right">
        <div className="card rounded-t-2xl sm:rounded-t-3xl lg:rounded-2xl lg:rounded-3xl flex flex-col h-full overflow-hidden border-2 border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b-2 border-slate-100 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden btn flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-slate-100 border-2 border-slate-200 text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              
              <div className="min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5">
                  <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-600 shrink-0" />
                  <span className="text-[0.6rem] sm:text-[0.65rem] font-extrabold text-cyan-700 uppercase tracking-wider">Verified</span>
                </div>
                <h2 className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-900 truncate">
                  {email.subject || '(No Subject)'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                className="btn flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="hidden lg:flex btn h-9 w-9 items-center justify-center rounded-lg bg-slate-100 border-2 border-slate-200 text-slate-500 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sender Info */}
          <div className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 border-b-2 border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 border-2 border-cyan-300 text-sm sm:text-base lg:text-lg font-extrabold text-cyan-800 shrink-0">
                {email.from.charAt(0).toUpperCase()}
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{email.from}</p>
                <p className="text-[0.6rem] sm:text-xs text-slate-600 font-mono truncate">to: {email.to}</p>
              </div>
              
              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-600" />
                <span className="text-[0.6rem] sm:text-xs font-bold text-slate-700">
                  {new Date(email.receivedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
            <div className="mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[0.55rem] sm:text-[0.65rem] font-extrabold text-cyan-700 uppercase tracking-wider">
                <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                Safe Preview
              </span>
              <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-100 border border-slate-200 text-[0.55rem] sm:text-[0.65rem] font-bold text-slate-600 uppercase tracking-wider">
                {emailSrcDoc ? 'HTML' : 'Plain Text'}
              </span>
            </div>

            <div className="rounded-lg sm:rounded-xl lg:rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
              {emailSrcDoc ? (
                <div className="relative">
                  {!iframeLoaded && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white min-h-[150px] sm:min-h-[200px]">
                      <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 anim-spin text-cyan-600" />
                    </div>
                  )}
                  <iframe
                    title="email-content"
                    ref={iframeRef}
                    className={iframeLoaded ? 'block w-full border-0' : 'block w-full border-0 opacity-0'}
                    onLoad={resizeIframe}
                    sandbox="allow-same-origin allow-popups allow-top-navigation-by-user-activation"
                    loading="lazy"
                    srcDoc={emailSrcDoc}
                    style={{ minHeight: '150px' }}
                  />
                </div>
              ) : (
                <div className="p-4 sm:p-5 lg:p-6">
                  <pre className="font-mono text-xs sm:text-sm text-slate-900 whitespace-pre-wrap leading-relaxed font-medium">
                    {email.bodyText || '(Empty message)'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EmailDetail;
