import { useRef, useMemo, useState, useEffect, memo, useCallback } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  Eye,
  Link2,
  Loader2,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { cn } from '../lib/utils';

function composeEmailSrcDoc(html) {
  const sanitized = (html || '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"><style>
      html,body{margin:0;padding:18px;background:#fffdf8;color:#241c16;font-family:"Instrument Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;height:auto!important;min-height:0!important;overflow:hidden!important;line-height:1.7}
      *{max-width:100%!important;box-sizing:border-box!important}
      img,svg,video{max-width:100%!important;height:auto!important;display:block}
      a{color:#233449!important;text-decoration:underline!important}
      p,h1,h2,h3,h4,h5,h6,li,span,div{color:#241c16!important}
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
      <div className="control-panel panel-topline section-reveal section-delay-3 hidden h-full min-h-[28rem] flex-col items-center justify-center rounded-[1.8rem] px-8 py-12 text-center lg:flex">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-[rgba(85,73,61,0.1)] bg-[rgba(255,255,255,0.46)]">
          <Eye className="h-9 w-9 text-[var(--text-muted)]" />
        </div>
        <div className="editorial-kicker mb-2">Message Viewer</div>
        <h3 className="font-display text-[2.2rem] leading-none text-[var(--signal-ink)]">
          Select a message to inspect it.
        </h3>
        <p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
          The full payload opens here, including HTML emails, sender details, and the exact time
          the relay captured it.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'control-panel control-panel-strong panel-topline mail-shell section-reveal section-delay-3 flex h-full min-h-[28rem] flex-col rounded-none lg:rounded-[1.8rem]',
        'fixed inset-0 z-50 bg-[rgba(246,240,230,0.96)] lg:static lg:inset-auto lg:bg-transparent'
      )}
    >
      <div className="flex items-center justify-between border-b border-[rgba(85,73,61,0.08)] px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="button-surface inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[rgba(85,73,61,0.1)] bg-[rgba(255,255,255,0.4)] text-[var(--text-secondary)] lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="editorial-kicker mb-1 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--signal-clay)]" />
              Secure Inspection
            </div>
            <h2 className="line-clamp-1 font-display text-[1.9rem] leading-none text-[var(--signal-ink)] sm:text-[2.15rem]">
              {email.subject || '(No Subject)'}
            </h2>
          </div>
        </div>

        <button
          type="button"
          className="button-surface inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[rgba(188,102,90,0.14)] bg-[rgba(188,102,90,0.08)] text-[var(--signal-rose)]"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="border-b border-[rgba(85,73,61,0.08)] px-4 py-4 sm:px-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-[rgba(35,52,73,0.12)] bg-[rgba(35,52,73,0.08)] text-lg font-bold text-[var(--signal-ink)]">
              {email.from.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="mb-1 line-clamp-1 text-sm font-semibold text-[var(--signal-ink)]">
                {email.from}
              </div>
              <div className="font-mono-ui text-xs text-[var(--text-muted)]">to: {email.to}</div>
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-[rgba(85,73,61,0.08)] bg-[rgba(255,255,255,0.38)] px-4 py-3 text-left xl:min-w-[15rem] xl:text-right">
            <div className="mb-1 flex items-center gap-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)] xl:justify-end">
              <CalendarDays className="h-3.5 w-3.5 text-[var(--signal-gold)]" />
              received
            </div>
            <div className="text-sm font-medium text-[var(--text-secondary)]">
              {new Date(email.receivedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[rgba(85,73,61,0.08)] bg-[rgba(255,255,255,0.34)] px-3.5 py-2">
            <Link2 className="h-3.5 w-3.5 text-[var(--signal-clay)]" />
            preview mode
          </span>
          <span className="inline-flex min-h-10 items-center rounded-full border border-[rgba(85,73,61,0.08)] bg-[rgba(255,255,255,0.34)] px-3.5 py-2">
            html or plain text supported
          </span>
        </div>

        <div className="rounded-[1.45rem] border border-[rgba(85,73,61,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.56),rgba(244,235,224,0.92))] p-3 sm:p-4">
          {emailSrcDoc ? (
            <div className="relative overflow-hidden rounded-[1.15rem] border border-[rgba(85,73,61,0.08)] bg-[#fffdf8] shadow-[0_1rem_2.6rem_rgba(77,57,35,0.08)]">
              {!iframeLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#fffdf8]">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--signal-clay)]" />
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
            <div className="rounded-[1.15rem] border border-[rgba(85,73,61,0.08)] bg-[#fffdf8] p-5 shadow-[0_1rem_2.4rem_rgba(77,57,35,0.06)]">
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
