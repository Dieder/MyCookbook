import { useState } from 'react';
import { CheckCircle2, Download, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { UI_STRINGS } from '../i18n/translations';
import { LanguageCode } from '../types/cookbook';

interface PWAInstallButtonProps {
  lang: LanguageCode;
  variant?: 'settings' | 'compact';
}

export function PWAInstallButton({ lang, variant = 'settings' }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const t = UI_STRINGS[lang];

  if (isInstalled) {
    if (variant === 'compact') return null;
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-2 border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-xs font-mono">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>{t.pwaInstalledBadge}</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className={
          variant === 'compact'
            ? 'px-3 py-1.5 border border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[var(--accent-primary)] text-xs font-mono inline-flex items-center gap-1.5 hover:bg-[var(--accent-primary)] hover:text-[var(--accent-primary-fg)] transition-colors cursor-pointer whitespace-nowrap shrink-0'
            : 'px-4 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0'
        }
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>{t.pwaInstallBtn}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={
            variant === 'compact'
              ? 'px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-[var(--text-ink)] text-xs font-mono inline-flex items-center gap-1.5 hover:border-[var(--accent-primary)] cursor-pointer whitespace-nowrap shrink-0'
              : 'px-4 py-2.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-[var(--text-ink)] text-xs font-mono inline-flex items-center gap-2 hover:border-[var(--accent-primary)] cursor-pointer whitespace-nowrap shrink-0'
          }
        >
          <Smartphone className="w-4 h-4 shrink-0 text-[var(--accent-secondary)]" />
          <span>{t.pwaInstallIOSBtn}</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.pwaIOSGuideTitle}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          >
            <div className="w-full max-w-sm bg-[var(--bg-paper)] border border-[var(--border-line)] p-6 space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
                <h3 className="font-display text-xl text-[var(--text-ink)]">
                  {t.pwaIOSGuideTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label={t.pwaCloseBtn}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="space-y-3 font-serif text-sm text-[var(--text-ink)]">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-xs text-[var(--accent-primary)] mt-0.5">1.</span>
                  <span>
                    {t.pwaIOSGuideStep1}{' '}
                    <Share className="inline w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-xs text-[var(--accent-primary)] mt-0.5">2.</span>
                  <span>{t.pwaIOSGuideStep2}</span>
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono cursor-pointer hover:opacity-90"
              >
                {t.pwaCloseBtn}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
