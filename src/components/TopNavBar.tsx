import { Settings, Shield } from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import { BookView, LanguageCode } from '../types/cookbook';

interface TopNavBarProps {
  activeView: BookView;
  onNavigate: (view: BookView) => void;
  savedCount: number;
  runningTimerCount: number;
  onOpenCookMode: () => void;
  canContribute: boolean;
  isAdmin: boolean;
  lang: LanguageCode;
}

export function TopNavBar({
  activeView,
  onNavigate,
  savedCount,
  runningTimerCount,
  onOpenCookMode,
  canContribute,
  isAdmin,
  lang,
}: TopNavBarProps) {
  const t = UI_STRINGS[lang];
  const navItems: Array<{ id: BookView; label: string }> = [
    { id: 'cover', label: t.navCover },
    { id: 'chapters', label: t.navChapters },
    { id: 'cards', label: t.navCards },
    { id: 'calendar', label: t.navCalendar },
    { id: 'saved', label: savedCount > 0 ? `${t.navSaved} (${savedCount})` : t.navSaved },
    ...(canContribute ? [{ id: 'my-recipes' as BookView, label: t.navMyRecipes }] : []),
  ];

  const isAdminActive = activeView === 'admin' || activeView === 'chapter-editor';
  const isSettingsActive = activeView === 'settings';

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-paper)]/95 backdrop-blur-sm border-b border-[var(--border-line)]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between gap-4 sm:gap-8">
        <button
          type="button"
          onClick={() => onNavigate('cover')}
          className="font-handwriting text-3xl font-semibold tracking-normal leading-none text-[var(--text-ink)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)]"
        >
          My cookbook
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm font-serif">
          {navItems.map((item) => {
            const isActive =
              activeView === item.id ||
              (activeView === 'spread' && item.id === 'chapters') ||
              (activeView === 'recipe-editor' && item.id === 'my-recipes');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b ${
                  isActive
                    ? 'text-[var(--accent-primary)] border-[var(--accent-primary)] font-medium'
                    : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-ink)] hover:border-[var(--border-line)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              aria-label={t.navAdmin}
              title={t.navAdmin}
              className={`p-2 border transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)] ${
                isAdminActive
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[var(--accent-primary)]'
                  : 'border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:border-[var(--accent-primary)]'
              }`}
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate('settings')}
            aria-label={t.navSettings}
            title={t.navSettings}
            className={`p-2 border transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)] ${
              isSettingsActive
                ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[var(--accent-primary)]'
                : 'border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:border-[var(--accent-primary)]'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenCookMode}
            className="px-3.5 sm:px-4 py-2 text-xs font-mono tracking-wide bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
          >
            {runningTimerCount > 0 ? t.cookModeActive(runningTimerCount) : t.cookMode}
          </button>
        </div>
      </div>

      {/* Compact mobile navigation row keeping strict <= 15% mobile height budget */}
      <nav className="md:hidden border-t border-[var(--border-subtle)] px-4 py-2 flex items-center justify-between gap-4 overflow-x-auto text-xs font-serif">
        {navItems.map((item) => {
          const isActive =
            activeView === item.id ||
            (activeView === 'spread' && item.id === 'chapters') ||
            (activeView === 'recipe-editor' && item.id === 'my-recipes');
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`py-1 whitespace-nowrap shrink-0 cursor-pointer border-b ${
                isActive
                  ? 'text-[var(--accent-primary)] border-[var(--accent-primary)] font-medium'
                  : 'text-[var(--text-muted)] border-transparent'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
