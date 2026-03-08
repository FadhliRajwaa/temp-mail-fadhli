import { useRef, useMemo, useState, useEffect, memo, useCallback } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  Eye,
  Loader2,
  Mail,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { cn } from '../lib/utils';

function composeEmailSrcDoc(html) {
  const sanitized = (html || '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"><style>
      html,body{margin:0;padding:18px;background:transparent;color:#dce7e0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;height:auto!important;min-height:0!important;overflow:hidden!important;line-height:1.7}
      *{max-width:100%!important;box-sizing:border-box!important}
      img,svg,video{max-width:100%!important;height:auto!important;display:block}
      a{color:#5eead4!important;text-decoration:underline!important}
      p,h1,h2,h3,h4,h5,h6,li,span,div{color:#dce7e0!important}
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

        const height = Math.max(doc.body?.scrollHeight || 0, doc.documentElement?.scrollHeight || 0);
        iframe.style.height = `${height + 40}px`;
        setIframeLoaded(true);
      } catch {
        setIframeLoaded(true);
      }
    }, 50);
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
      <div className="control-panel panel-topline section-reveal hidden h-full min-h-[28rem] flex-col items-center justify-center rounded-[1.6rem] px-10 py-12 text-center lg:flex">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
          <Eye className="h-9 w-9 text-[var(--text-muted)]" />
        </div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
          inspection deck
        </div>
        <h3 className="font-display text-2xl font-bold uppercase tracking-[0.12em] text-white">
          select a signal
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-7 text-[var(--text-muted)]">
          Open any message from the feed to inspect the full payload inside the secure viewer.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'control-panel control-panel-strong panel-topline section-reveal flex h-full min-h-[28rem] flex-col rounded-none lg:rounded-[1.6rem]',
        'fixed inset-0 z-50 bg-[rgba(5,10,13,0.97)] lg:static lg:inset-auto lg:bg-transparent'
      )}
    >
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[var(--text-secondary)] transition-colors hover:border-teal-300/18 hover:bg-white/[0.08] lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-200/80" />
              secure inspection
            </div>
            <h2 className="line-clamp-1 font-display text-xl font-bold uppercase tracking-[0.08em] text-white">
              {email.subject || '(No Subject)'}
            </h2>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-rose-400/14 bg-rose-400/8 text-rose-200 transition-colors hover:bg-rose-400/12"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="border-b border-white/8 px-4 py-4 sm:px-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-lime-300/16 bg-lime-300/10 text-lg font-bold text-lime-100">
              {email.from.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="mb-1 line-clamp-1 text-sm font-semibold text-white">{email.from}</div>
              <div className="font-mono-ui text-xs text-[var(--text-muted)]">to: {email.to}</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-left xl:min-w-[15rem] xl:text-right">
            <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)] xl:justify-end">
              <CalendarDays className="h-3.5 w-3.5 text-amber-300/80" />
              received
            </div>
            <div className="text-sm font-medium text-[var(--text-secondary)]">
              {new Date(email.receivedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <div className="rounded-[1.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(8,14,18,0.98),rgba(10,18,24,0.95))] p-3 sm:p-4">
          {emailSrcDoc ? (
            <div className="relative overflow-hidden rounded-[1rem] border border-white/8 bg-[rgba(6,12,16,0.95)]">
              {!iframeLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[rgba(6,12,16,0.95)]">
                  <Loader2 className="h-6 w-6 animate-spin text-teal-200" />
                </div>
              )}
              <iframe
                title="email-content"
                ref={iframeRef}
                className={cn('block min-h-[420px] w-full border-0', !iframeLoaded && 'opacity-0')}
                onLoad={resizeIframe}
                sandbox="allow-same-origin allow-popups allow-top-navigation-by-user-activation"
                loading="lazy"
                srcDoc={emailSrcDoc}
              />
            </div>
          ) : (
            <div className="rounded-[1rem] border border-white/8 bg-[rgba(6,12,16,0.88)] p-5">
              <div className="font-mono-ui whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">
                {email.bodyText || '(Empty message)'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default EmailDetail;
