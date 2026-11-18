import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { UI_STRINGS } from '../i18n/translations';
import { LanguageCode } from '../types/cookbook';

interface OfflineIndicatorProps {
  lang: LanguageCode;
}

export function OfflineIndicator({ lang }: OfflineIndicatorProps) {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  const t = UI_STRINGS[lang];

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-[var(--accent-secondary)] text-[var(--accent-primary-fg)] border-b border-[var(--text-ink)]/20 px-4 py-1.5 text-xs font-mono flex items-center justify-center gap-2"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{t.offlineBannerText}</span>
    </div>
  );
}
