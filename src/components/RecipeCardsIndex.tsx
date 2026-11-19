import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  ListChecks,
  MoreVertical,
  PlayCircle,
  Search,
  Sparkles,
  Users,
  Utensils,
} from 'lucide-react';
import {
  formatPersonLabel,
  UI_STRINGS,
} from '../i18n/translations';
import { Chapter, LanguageCode, Recipe, TechniqueClip, UnitSystem } from '../types/cookbook';
import { formatCulinaryQuantity } from '../utils/formatters';
import { getDisplayUnitLabel } from '../utils/units';
import { resolveRecipeClips } from '../utils/youtube';

interface RecipeCardsIndexProps {
  recipes: Recipe[];
  chapters: Chapter[];
  onSelectRecipe: (recipeId: string) => void;
  onEnterCookMode: (recipeId: string) => void;
  onOpenClip: (clip: TechniqueClip, recipeTitle: string) => void;
  onOpenAskRecipe: () => void;
  favoriteIds: string[];
  onToggleFavorite: (recipeId: string) => void;
  unitSystem: UnitSystem;
  servingsMap: Record<string, number>;
  onChangeServings: (recipeId: string, servings: number) => void;
  lang: LanguageCode;
}

const LEGACY_CHAPTER_FALLBACK: Record<string, string> = {
  'hearth-harvest': 'comfort-food',
  'coastal-market': 'dinner',
  'orchard-patisserie': 'desserts',
};

const PAGE_SIZE = 12;

export function RecipeCardsIndex({
  recipes,
  chapters,
  onSelectRecipe,
  onEnterCookMode,
  onOpenClip,
  onOpenAskRecipe,
  favoriteIds,
  onToggleFavorite,
  unitSystem,
  servingsMap,
  onChangeServings,
  lang,
}: RecipeCardsIndexProps) {
  const [compactChapter, setCompactChapter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(() => new Set());
  const [openMenuRecipeId, setOpenMenuRecipeId] = useState<string | null>(null);
  const t = UI_STRINGS[lang];

  useEffect(() => {
    if (!openMenuRecipeId) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && !target.closest('[data-recipe-card-menu]')) {
        setOpenMenuRecipeId(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenuRecipeId(null);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenuRecipeId]);

  const toggleCardIngredients = (recipeId: string) => {
    setExpandedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  };

  useEffect(() => {
    setPage(1);
  }, [compactChapter, query]);

  const topChapters = chapters.filter((c) => !c.parentChapterId);
  const topIds = new Set(topChapters.map((c) => c.id));
  const orphanedSubchapters = chapters.filter(
    (c) => c.parentChapterId && !topIds.has(c.parentChapterId)
  );

  const visibleRecipes = useMemo(() => {
    const chapterIdsSet = new Set(chapters.map((c) => c.id));
    const allowedTargetIds = new Set<string>();
    if (compactChapter !== 'all') {
      allowedTargetIds.add(compactChapter);
      for (const ch of chapters) {
        if (ch.parentChapterId === compactChapter) {
          allowedTargetIds.add(ch.id);
        }
      }
    }

    return recipes.filter((r) => {
      if (compactChapter !== 'all') {
        const resolvedId = chapterIdsSet.has(r.chapterId)
          ? r.chapterId
          : LEGACY_CHAPTER_FALLBACK[r.chapterId] ?? r.chapterId;
        if (!allowedTargetIds.has(resolvedId)) return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          r.region.toLowerCase().includes(q) ||
          r.chefAuthor.toLowerCase().includes(q) ||
          r.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [recipes, chapters, compactChapter, query]);

  const totalPages = Math.max(1, Math.ceil(visibleRecipes.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pagedRecipes = useMemo(
    () => visibleRecipes.slice(startIdx, startIdx + PAGE_SIZE),
    [visibleRecipes, startIdx]
  );

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-5 sm:py-10 space-y-5 sm:space-y-8">
      <div className="border-b border-[var(--border-line)] pb-4 sm:pb-6 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
            {t.miseEnPlaceIndex}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--text-ink)] mt-1">
            {t.collectibleCardsTitle}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-52">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.filterPlaceholder}
              aria-label={t.filterAria}
              className="w-full pl-8 pr-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-xs font-serif text-[var(--text-ink)] placeholder:text-[var(--text-muted)]/70 focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <select
            value={compactChapter}
            onChange={(e) => setCompactChapter(e.target.value)}
            aria-label={t.filterByChapterAria}
            className="px-3 py-1.5 text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-line)] text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="all">{t.allCoursesLabel}</option>
            {topChapters.map((parent) => {
              const subs = chapters.filter(
                (c) => c.parentChapterId === parent.id
              );
              return [
                <option key={parent.id} value={parent.id}>
                  {parent.title}
                </option>,
                ...subs.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {'\u00A0\u00A0'}— {sub.title}
                  </option>
                )),
              ];
            })}
            {orphanedSubchapters.map((orphan) => (
              <option key={orphan.id} value={orphan.id}>
                — {orphan.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onOpenAskRecipe}
            className="px-3.5 py-1.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.askChefShort}
          </button>
        </div>
      </div>

      {/* Range Summary */}
      {visibleRecipes.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--text-muted)] tabular-nums">
          <span>
            {t.showingPlatesRange(
              startIdx + 1,
              Math.min(startIdx + PAGE_SIZE, visibleRecipes.length),
              visibleRecipes.length
            )}
          </span>
          {totalPages > 1 && <span>{t.pageOfTotal(safePage, totalPages)}</span>}
        </div>
      )}

      {/* 2-Column Linen-Ruled Recipe Card Folio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-7">
        {pagedRecipes.map((recipe) => {
          const currentServings = servingsMap[recipe.id] ?? recipe.baseServings;
          const multiplier = currentServings / recipe.baseServings;
          const isSaved = favoriteIds.includes(recipe.id);
          const isExpanded = expandedCardIds.has(recipe.id);

          const firstClip = resolveRecipeClips(recipe)[0];
          const isMenuOpen = openMenuRecipeId === recipe.id;

          return (
            <article
              key={recipe.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-line)] flex flex-col"
            >
              {/* Full-width Photo Plate */}
              <button
                type="button"
                onClick={() => onSelectRecipe(recipe.id)}
                aria-label={recipe.title}
                className="w-full h-36 sm:h-44 border-b border-[var(--border-line)] overflow-hidden bg-[var(--bg-elevated)] cursor-pointer block"
              >
                <img
                  src={recipe.heroImage}
                  alt={recipe.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                />
              </button>

              {/* Description & Metadata Under Photo */}
              <div className="px-4 py-3 sm:px-5 sm:py-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-mono text-[var(--accent-secondary)] truncate">
                      {recipe.status === 'draft' && (
                        <span className="uppercase tracking-wider font-medium mr-1.5">
                          {t.statusDraft} ·
                        </span>
                      )}
                      {t.plateLabel(recipe.plateNumber)} · {recipe.region}
                    </p>
                    <h2
                      onClick={() => onSelectRecipe(recipe.id)}
                      className="font-display text-lg sm:text-xl text-[var(--text-ink)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer mt-0.5 leading-snug"
                    >
                      {recipe.title}
                    </h2>
                    {recipe.subtitle && (
                      <p className="text-xs sm:text-sm font-serif italic text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {recipe.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0" data-recipe-card-menu>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(recipe.id)}
                      aria-label={isSaved ? t.removeBookmarkAria : t.saveRecipeAria}
                      className={`p-1.5 cursor-pointer shrink-0 ${
                        isSaved
                          ? 'text-[var(--accent-secondary)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuRecipeId((prev) =>
                            prev === recipe.id ? null : recipe.id
                          )
                        }
                        aria-haspopup="menu"
                        aria-expanded={isMenuOpen}
                        aria-label={`${t.openBookSpread} / ${t.cookAndTime}`}
                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer shrink-0"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {isMenuOpen && (
                        <div
                          role="menu"
                          className="absolute right-0 top-full mt-1 w-52 bg-[var(--bg-paper)] border border-[var(--border-line)] shadow-lg z-20 py-1"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOpenMenuRecipeId(null);
                              onSelectRecipe(recipe.id);
                            }}
                            className="w-full px-3.5 py-2.5 text-left text-xs font-mono text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] inline-flex items-center gap-2.5 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                            <span>{t.openBookSpread}</span>
                          </button>

                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOpenMenuRecipeId(null);
                              onEnterCookMode(recipe.id);
                            }}
                            className="w-full px-3.5 py-2.5 text-left text-xs font-mono text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] inline-flex items-center gap-2.5 cursor-pointer"
                          >
                            <Utensils className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                            <span>{t.cookAndTime}</span>
                          </button>

                          {firstClip && (
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuRecipeId(null);
                                onOpenClip(firstClip, recipe.title);
                              }}
                              className="w-full px-3.5 py-2.5 text-left text-xs font-mono text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] inline-flex items-center gap-2.5 cursor-pointer"
                            >
                              <PlayCircle className="w-3.5 h-3.5 text-[var(--accent-secondary)] shrink-0" />
                              <span>{t.prepClipShort}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Single Compact Row: Timer + Persons + Collapsible Ingredients Trigger */}
                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)] tabular-nums min-w-0">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-[var(--accent-secondary)] shrink-0" />
                      <span>
                        {recipe.prepMinutes + recipe.cookMinutes} {t.minUnit}
                      </span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      <Users className="w-3.5 h-3.5 text-[var(--accent-secondary)] shrink-0" />
                      <span>{currentServings}</span>
                      <span className="hidden md:inline">
                        {formatPersonLabel(currentServings, lang)}
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCardIngredients(recipe.id)}
                    aria-expanded={isExpanded}
                    aria-label={t.personsAndIngredients}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-ink)] hover:text-[var(--accent-primary)] cursor-pointer tabular-nums shrink-0 py-0.5"
                  >
                    <ListChecks className="w-3.5 h-3.5 text-[var(--accent-secondary)] shrink-0" />
                    <span className="hidden md:inline">{t.ingredientsShortWord}</span>
                    <span>({recipe.ingredients.length})</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Persons & Ingredients Panel (closed by default) */}
              {isExpanded && (
                <div className="border-t border-[var(--border-line)]">
                  {/* Person Count Selector Strip */}
                  <div className="px-4 sm:px-5 py-2.5 bg-[var(--bg-elevated)]/60 border-b border-[var(--border-line)] flex items-center justify-between gap-4">
                    <span className="text-xs font-mono text-[var(--text-muted)] inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                      <span className="hidden md:inline">{t.personsLabel}</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          onChangeServings(recipe.id, Math.max(1, currentServings - 1))
                        }
                        aria-label={t.decreasePersonsAria}
                        className="w-7 h-7 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono hover:bg-[var(--bg-elevated)] cursor-pointer"
                      >
                        −
                      </button>
                      <select
                        value={currentServings}
                        onChange={(e) =>
                          onChangeServings(recipe.id, Number(e.target.value))
                        }
                        aria-label={`${t.personCountLabel}: ${recipe.title}`}
                        className="h-7 px-2 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-ink)] tabular-nums focus:outline-none focus:border-[var(--accent-primary)]"
                      >
                        {Array.from(
                          new Set([1, 2, 3, 4, 5, 6, 8, 10, 12, currentServings])
                        )
                          .sort((a, b) => a - b)
                          .map((count) => (
                            <option key={count} value={count}>
                              {count} {formatPersonLabel(count, lang)}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          onChangeServings(recipe.id, Math.min(24, currentServings + 1))
                        }
                        aria-label={t.increasePersonsAria}
                        className="w-7 h-7 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono hover:bg-[var(--bg-elevated)] cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Ruled Ingredient Ledger */}
                  <ul className="px-4 sm:px-5 py-3 divide-y divide-[var(--border-subtle)]">
                    {recipe.ingredients.map((ing) => {
                      const baseAmt =
                        unitSystem === 'metric' ? ing.metricAmount : ing.imperialAmount;
                      const unit =
                        unitSystem === 'metric' ? ing.metricUnit : ing.imperialUnit;
                      const formatted = formatCulinaryQuantity(baseAmt * multiplier, unit, lang);
                      const unitLabel = getDisplayUnitLabel(unit, lang);

                      return (
                        <li
                          key={ing.id}
                          className="py-1.5 flex items-baseline justify-between gap-4 text-sm font-serif"
                        >
                          <span className="text-[var(--text-ink)]">{ing.name}</span>
                          <span className="font-mono text-xs text-[var(--accent-secondary)] tabular-nums whitespace-nowrap shrink-0">
                            {formatted} {unitLabel}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pt-4 border-t border-[var(--border-line)] flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => handlePageChange(safePage - 1)}
            className="px-4 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] disabled:opacity-40 cursor-pointer disabled:cursor-default whitespace-nowrap shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {t.previousPage}
          </button>
          <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
            {t.pageOfTotal(safePage, totalPages)}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => handlePageChange(safePage + 1)}
            className="px-4 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] disabled:opacity-40 cursor-pointer disabled:cursor-default whitespace-nowrap shrink-0"
          >
            {t.nextPage}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
