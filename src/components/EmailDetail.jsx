import { useRef, useMemo, useState, useEffect, memo, useCallback } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  Loader2,
  Mail,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { cn } from '../lib/utils';

function composeEmailSrcDoc(html) {
  const sanitized = (html || '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"><style>
      html,body{margin:0;padding:18px;background:transparent;color:#d8e2ef;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;height:auto!important;min-height:0!important;overflow:hidden!important;line-height:1.7}
      *{max-width:100%!important;box-sizing:border-box!important}
      img,svg,video{max-width:100%!important;height:auto!important;display:block}
      a{color:#7dd3fc!important;text-decoration:underline!important}
      p,h1,h2,h3,h4,h5,h6,li,span,div{color:#d8e2ef!important}
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
      <div className="premium-panel section-reveal hidden h-full min-h-[28rem] flex-col items-center justify-center rounded-[1.9rem] px-10 py-12 text-center lg:flex">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.8rem] border border-cyan-300/14 bg-cyan-300/8 shadow-[0_20px_48px_rgba(3,16,32,0.35)]">
          <Mail className="h-9 w-9 text-cyan-100/70" />
        </div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-500">
          Viewer
        </div>
        <h3 className="mb-3 font-display text-2xl font-bold text-white">Select a message</h3>
        <p className="max-w-sm text-sm leading-7 text-slate-400">
          Your secure message viewer appears here once you choose an email from the incoming
          stream.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'premium-panel premium-panel-strong section-reveal flex h-full min-h-[28rem] flex-col rounded-none lg:rounded-[1.9rem]',
        'fixed inset-0 z-50 bg-[rgba(4,9,20,0.96)] lg:static lg:inset-auto lg:bg-transparent'
      )}
    >
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-cyan-300/22 hover:bg-white/[0.08] lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-200/80" />
              Secure Viewer
            </div>
            <h2 className="line-clamp-1 font-display text-lg font-bold text-white sm:text-xl">
              {email.subject || '(No Subject)'}
            </h2>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-300/12 bg-rose-300/8 text-rose-200 transition-colors hover:bg-rose-300/14"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="border-b border-white/6 px-4 py-5 sm:px-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.15rem] bg-[linear-gradient(135deg,#67e8f9,#818cf8)] text-lg font-bold text-slate-950 shadow-[0_18px_36px_rgba(6,28,46,0.35)]">
              {email.from.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="mb-1 line-clamp-1 text-sm font-semibold text-white">{email.from}</div>
              <div className="font-mono-ui text-xs text-slate-400">To: {email.to}</div>
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-left xl:min-w-[15rem] xl:text-right">
            <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 xl:justify-end">
              <CalendarDays className="h-3.5 w-3.5 text-cyan-200/80" />
              Received
            </div>
            <div className="text-sm font-medium text-slate-200">
              {new Date(email.receivedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
        <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(6,11,22,0.96),rgba(9,18,32,0.92))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-4">
          {emailSrcDoc ? (
            <div className="relative overflow-hidden rounded-[1.2rem] border border-white/8 bg-[rgba(4,9,18,0.92)]">
              {!iframeLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[rgba(4,9,18,0.92)]">
                  <Loader2 className="h-6 w-6 animate-spin text-cyan-200" />
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
            <div className="rounded-[1.2rem] border border-white/8 bg-[rgba(4,9,18,0.78)] p-5">
              <div className="font-mono-ui whitespace-pre-wrap text-sm leading-7 text-slate-200">
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
