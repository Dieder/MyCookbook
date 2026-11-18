import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  CalendarDays,
  Home,
  LayoutGrid,
  Library,
  MoreVertical,
  Settings,
  Shield,
  ShoppingBasket,
} from 'lucide-react';
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
  const [moreOpen, setMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  const savedLabel = savedCount > 0 ? `${t.navSaved} (${savedCount})` : t.navSaved;

  const navItems: Array<{ id: BookView; label: string }> = [
    { id: 'cover', label: t.navCover },
    { id: 'chapters', label: t.navChapters },
    { id: 'cards', label: t.navCards },
    { id: 'calendar', label: t.navCalendar },
    { id: 'shopping', label: t.navShopping },
    { id: 'saved', label: savedLabel },
    ...(canContribute ? [{ id: 'my-recipes' as BookView, label: t.navMyRecipes }] : []),
  ];

  const mobileMainItems: Array<{
    id: BookView;
    tooltip: string;
    Icon: typeof Home;
    badgeCount?: number;
  }> = [
    { id: 'cover', tooltip: t.navCover, Icon: Home },
    { id: 'chapters', tooltip: t.navChapters, Icon: BookOpen },
    { id: 'cards', tooltip: t.navCards, Icon: LayoutGrid },
    { id: 'calendar', tooltip: t.navCalendar, Icon: CalendarDays },
    { id: 'saved', tooltip: savedLabel, Icon: Bookmark, badgeCount: savedCount },
  ];

  const isAdminActive = activeView === 'admin' || activeView === 'chapter-editor';
  const isSettingsActive = activeView === 'settings';
  const isMoreChildActive =
    activeView === 'shopping' ||
    activeView === 'my-recipes' ||
    activeView === 'recipe-editor' ||
    isSettingsActive ||
    isAdminActive;

  const handleMobileNavigate = (view: BookView) => {
    setMoreOpen(false);
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-paper)]/95 backdrop-blur-sm border-b border-[var(--border-line)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 h-14 md:h-16 flex items-center justify-between gap-4 sm:gap-8">
        <button
          type="button"
          onClick={() => handleMobileNavigate('cover')}
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
              className={`hidden md:inline-flex p-2 border transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)] ${
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
            className={`hidden md:inline-flex p-2 border transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)] ${
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

      {/* Iconized Mobile Main Menu + More (⋮) overflow */}
      <nav
        aria-label="Mobile main menu"
        className="md:hidden border-t border-[var(--border-subtle)] px-2 py-1 flex items-center justify-around gap-0.5 relative"
      >
        {mobileMainItems.map(({ id, tooltip, Icon, badgeCount }) => {
          const isActive =
            activeView === id || (activeView === 'spread' && id === 'chapters');
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleMobileNavigate(id)}
              title={tooltip}
              aria-label={tooltip}
              className="flex-1 min-h-[40px] inline-flex items-center justify-center cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
            >
              <span
                className={`relative px-3 py-1.5 rounded-full inline-flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                    : 'text-[var(--text-muted)] group-hover:bg-[var(--bg-elevated)] group-hover:text-[var(--text-ink)]'
                }`}
              >
                <Icon
                  className="w-5 h-5"
                  strokeWidth={isActive ? 2.2 : 1.75}
                  fill={id === 'saved' && isActive ? 'currentColor' : 'none'}
                />
                {typeof badgeCount === 'number' && badgeCount > 0 && (
                  <span className="ml-1 text-[10px] font-mono tabular-nums leading-none">
                    {badgeCount}
                  </span>
                )}
              </span>
            </button>
          );
        })}

        {/* More (⋮) Menu */}
        <div ref={moreMenuRef} className="relative flex-1 flex justify-center">
          <button
            type="button"
            onClick={() => setMoreOpen((prev) => !prev)}
            title="More"
            aria-label="More"
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            className="w-full min-h-[40px] inline-flex items-center justify-center cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
          >
            <span
              className={`px-3 py-1.5 rounded-full inline-flex items-center justify-center transition-colors ${
                moreOpen || isMoreChildActive
                  ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                  : 'text-[var(--text-muted)] group-hover:bg-[var(--bg-elevated)] group-hover:text-[var(--text-ink)]'
              }`}
            >
              <MoreVertical
                className="w-5 h-5"
                strokeWidth={moreOpen || isMoreChildActive ? 2.2 : 1.75}
              />
            </span>
          </button>

          {moreOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1.5 w-48 bg-[var(--bg-paper)] border border-[var(--border-line)] shadow-lg py-1 z-50"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => handleMobileNavigate('shopping')}
                className={`w-full px-3.5 py-2.5 text-left text-xs font-mono flex items-center gap-2.5 cursor-pointer ${
                  activeView === 'shopping'
                    ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)] font-medium'
                    : 'text-[var(--text-ink)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                <ShoppingBasket className="w-4 h-4 text-[var(--accent-secondary)] shrink-0" />
                <span>{t.navShopping}</span>
              </button>

              {canContribute && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleMobileNavigate('my-recipes')}
                  className={`w-full px-3.5 py-2.5 text-left text-xs font-mono flex items-center gap-2.5 cursor-pointer ${
                    activeView === 'my-recipes' || activeView === 'recipe-editor'
                      ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)] font-medium'
                      : 'text-[var(--text-ink)] hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  <Library className="w-4 h-4 text-[var(--accent-secondary)] shrink-0" />
                  <span>{t.navMyRecipes}</span>
                </button>
              )}

              <button
                type="button"
                role="menuitem"
                onClick={() => handleMobileNavigate('settings')}
                className={`w-full px-3.5 py-2.5 text-left text-xs font-mono flex items-center gap-2.5 cursor-pointer ${
                  isSettingsActive
                    ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)] font-medium'
                    : 'text-[var(--text-ink)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                <Settings className="w-4 h-4 text-[var(--accent-secondary)] shrink-0" />
                <span>{t.navSettings}</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleMobileNavigate('admin')}
                  className={`w-full px-3.5 py-2.5 text-left text-xs font-mono flex items-center gap-2.5 cursor-pointer ${
                    isAdminActive
                      ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)] font-medium'
                      : 'text-[var(--text-ink)] hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  <Shield className="w-4 h-4 text-[var(--accent-secondary)] shrink-0" />
                  <span>{t.navAdmin}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
