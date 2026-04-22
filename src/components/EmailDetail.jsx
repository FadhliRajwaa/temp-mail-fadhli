import { useRef, useMemo, useState, useEffect, memo, useCallback } from 'react';
import { CalendarDays, ChevronLeft, ShieldCheck, Trash2, X, Eye, Loader2 } from 'lucide-react';

function composeEmailSrcDoc(html) {
  const sanitized = (html || '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  const styles = `
    html,body{margin:0;padding:20px;background:#0c1021;color:#f1f5f9;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;height:auto!important;min-height:0!important;overflow:hidden!important;line-height:1.65}
    *{max-width:100%!important;box-sizing:border-box!important}
    img,svg,video{max-width:100%!important;height:auto!important;display:block}
    a{color:#60a5fa!important;text-decoration:underline!important}
    p,h1,h2,h3,h4,h5,h6,li,span,div{color:#f1f5f9!important}
    body>:last-child{margin-bottom:0!important}
  `.replace(/\n\s+/g, '');
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
    if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
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
    if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
  }, []);

  const emailSrcDoc = useMemo(
    () => (email?.bodyHtml ? composeEmailSrcDoc(email.bodyHtml) : null),
    [email?.bodyHtml]
  );

  if (!email) {
    return (
      <div className="anim-scale-in hidden lg:flex flex-col items-center justify-center h-full min-h-[20rem] surface-elevated rounded-2xl sm:rounded-3xl p-8 text-center">
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl scale-150" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-3)] border border-[var(--color-border-default)]">
            <Eye className="h-6 w-6 text-[var(--color-text-faint)]" />
          </div>
        </div>
        <h3 className="text-heading text-base sm:text-lg text-[var(--color-text-primary)] mb-1.5">Select a message</h3>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-sm leading-relaxed">
          Click any email from the list to view its full content, sender details, and metadata.
        </p>
      </div>
    );
  }

  return (
    <div className="anim-slide-right h-full">
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden anim-fade-in z-40"
        onClick={onClose}
      />

      {/* Content Panel */}
      <div className="fixed inset-x-0 bottom-0 lg:relative lg:inset-auto z-50 lg:z-auto h-[88vh] sm:h-[90vh] lg:h-full max-h-[calc(100vh-3.5rem)] lg:max-h-none rounded-t-2xl lg:rounded-none overflow-hidden flex flex-col" style={{ animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        <div className="surface-elevated rounded-t-2xl lg:rounded-2xl lg:rounded-3xl flex flex-col h-full overflow-hidden">
          {/* Drag handle - mobile only */}
          <div className="lg:hidden flex justify-center pt-2 pb-1">
            <div className="w-8 h-1 rounded-full bg-[var(--color-text-faint)]/30" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 border-b border-[var(--color-border-subtle)] shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden btn flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-surface-3)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span className="text-[0.6rem] font-semibold text-emerald-400 uppercase tracking-wider">Verified</span>
                </div>
                <h2 className="text-heading text-sm sm:text-base text-[var(--color-text-primary)] truncate">
                  {email.subject || '(No Subject)'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="btn flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/10 border border-red-400/15 text-red-400 hover:bg-red-400/20 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="hidden lg:flex btn h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-surface-3)] border border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sender Info */}
          <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 border-b border-[var(--color-border-subtle)] shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 text-sm font-bold text-blue-400 shrink-0">
                {email.from.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] truncate">{email.from}</p>
                <p className="text-[0.65rem] sm:text-xs text-[var(--color-text-muted)] font-mono truncate">to: {email.to}</p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--color-surface-3)] border border-[var(--color-border-subtle)] shrink-0">
                <CalendarDays className="h-3 w-3 text-amber-400" />
                <span className="text-[0.65rem] sm:text-xs font-medium text-[var(--color-text-secondary)]">
                  {new Date(email.receivedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 lg:px-6 py-4 sm:py-5">
            <div className="mb-3 flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/15 text-[0.6rem] sm:text-[0.65rem] font-semibold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="h-2.5 w-2.5" />
                Safe Preview
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--color-surface-3)] border border-[var(--color-border-subtle)] text-[0.6rem] sm:text-[0.65rem] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                {emailSrcDoc ? 'HTML' : 'Plain Text'}
              </span>
            </div>

            <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-1)] overflow-hidden">
              {emailSrcDoc ? (
                <div className="relative">
                  {!iframeLoaded && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-surface-1)] min-h-[150px]">
                      <Loader2 className="h-5 w-5 anim-spin text-blue-400" />
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
                <div className="p-4 sm:p-5">
                  <pre className="font-mono text-xs sm:text-sm text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed">
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
