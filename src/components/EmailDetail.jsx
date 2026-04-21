import { useRef, useMemo, useState, useEffect, memo, useCallback } from 'react';
import { CalendarDays, ChevronLeft, ShieldCheck, Trash2, X, Eye, Loader2 } from 'lucide-react';

function composeEmailSrcDoc(html) {
  const sanitized = (html || '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  const styles = 'html,body{margin:0;padding:20px;background:#fffdf8;color:#1c1917;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;height:auto!important;min-height:0!important;overflow:hidden!important;line-height:1.65}*{max-width:100%!important;box-sizing:border-box!important}img,svg,video{max-width:100%!important;height:auto!important;display:block}a{color:#0d9488!important;text-decoration:underline!important}p,h1,h2,h3,h4,h5,h6,li,span,div{color:#1c1917!important}body>:last-child{margin-bottom:0!important}';
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
      <div className="animate-fade-in-scale hidden lg:flex flex-col items-center justify-center h-full min-h-[28rem] card-surface rounded-2xl sm:rounded-3xl p-8 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-stone-50 border border-stone-200/80 shadow-lg">
            <Eye className="h-7 w-7 text-stone-300" />
          </div>
        </div>
        <h3 className="text-heading text-lg font-semibold text-[#1c1917] mb-2">Select a message</h3>
        <p className="text-body text-sm text-[#a8a29e] max-w-sm leading-relaxed">
          Click any email from the list to view its full content, sender details, and metadata.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-slide-in-right fixed inset-0 z-50 lg:static lg:inset-auto lg:z-auto lg:h-full">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm lg:hidden animate-fade-in-scale"
        onClick={onClose}
      />
      
      <div className="absolute inset-x-0 bottom-0 lg:relative lg:inset-auto lg:h-full max-h-[90vh] lg:max-h-none bg-[#faf8f5] lg:bg-transparent rounded-t-3xl lg:rounded-none overflow-hidden flex flex-col animate-slide-in-bottom lg:animate-slide-in-right">
        <div className="card-surface rounded-t-3xl lg:rounded-2xl lg:rounded-3xl flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-stone-100 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden btn-surface flex h-9 w-9 items-center justify-center rounded-xl bg-stone-50 border border-stone-200 text-stone-500 hover:text-stone-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                  <span className="text-[0.65rem] font-semibold text-teal-600 uppercase tracking-wider">Verified</span>
                </div>
                <h2 className="text-heading text-base sm:text-lg font-semibold text-[#1c1917] truncate">
                  {email.subject || '(No Subject)'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-surface flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="hidden lg:flex btn-surface h-9 w-9 items-center justify-center rounded-xl bg-stone-50 border border-stone-200 text-stone-500 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sender Info */}
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-stone-100 shrink-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 text-base sm:text-lg font-bold text-teal-700">
                {email.from.charAt(0).toUpperCase()}
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#1c1917] truncate">{email.from}</p>
                <p className="text-xs text-stone-400 font-mono truncate">to: {email.to}</p>
              </div>
              
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50 border border-stone-100">
                <CalendarDays className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs font-medium text-stone-600">
                  {new Date(email.receivedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-100 text-[0.65rem] font-semibold text-teal-700 uppercase tracking-wider">
                <ShieldCheck className="h-3 w-3" />
                Safe Preview
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-stone-50 border border-stone-100 text-[0.65rem] font-medium text-stone-500 uppercase tracking-wider">
                {emailSrcDoc ? 'HTML' : 'Plain Text'}
              </span>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-stone-200/80 bg-white shadow-sm overflow-hidden">
              {emailSrcDoc ? (
                <div className="relative">
                  {!iframeLoaded && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white min-h-[200px]">
                      <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
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
                    style={{ minHeight: '200px' }}
                  />
                </div>
              ) : (
                <div className="p-5 sm:p-6">
                  <pre className="font-mono text-sm text-[#1c1917] whitespace-pre-wrap leading-relaxed">
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
