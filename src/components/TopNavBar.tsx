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
    { id: 'saved', label: savedCount > 0 ? `${t.navSaved} (${savedCount})` : t.navSaved },
    ...(canContribute ? [{ id: 'my-recipes' as BookView, label: t.navMyRecipes }] : []),
    { id: 'settings', label: t.navSettings },
    ...(isAdmin ? [{ id: 'admin' as BookView, label: t.navAdmin }] : []),
  ];

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-paper)]/95 backdrop-blur-sm border-b border-[var(--border-line)]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => onNavigate('cover')}
          className="font-display text-xl font-semibold tracking-tight text-[var(--text-ink)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)]"
        >
          Maison Feuille
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm font-serif">
          {navItems.map((item) => {
            const isActive =
              activeView === item.id ||
              (activeView === 'spread' && item.id === 'chapters') ||
              (activeView === 'recipe-editor' && item.id === 'my-recipes') ||
              (activeView === 'chapter-editor' && item.id === 'admin');
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

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCookMode}
            className="px-4 py-2 text-xs font-mono tracking-wide bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
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
            (activeView === 'recipe-editor' && item.id === 'my-recipes') ||
            (activeView === 'chapter-editor' && item.id === 'admin');
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
