import { useEffect, useMemo, useState } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Clock, PlayCircle, Search, Sparkles } from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import { Chapter, LanguageCode, Recipe, TechniqueClip } from '../types/cookbook';
import { resolveRecipeClips } from '../utils/youtube';
import { stripStoryMarkup } from '../utils/storyMarkup';
import { EditorialPlateImage } from './EditorialPlateImage';

interface ChaptersGalleryProps {
  recipes: Recipe[];
  chapters: Chapter[];
  initialChapterId?: string;
  onSelectRecipe: (recipeId: string) => void;
  onOpenClip: (clip: TechniqueClip, recipeTitle: string) => void;
  onOpenAskRecipe: () => void;
  favoriteIds: string[];
  onToggleFavorite: (recipeId: string) => void;
  savedOnly?: boolean;
  onBrowseAll?: () => void;
  lang: LanguageCode;
}

const LEGACY_CHAPTER_FALLBACK: Record<string, string> = {
  'hearth-harvest': 'comfort-food',
  'coastal-market': 'dinner',
  'orchard-patisserie': 'desserts',
};

const PAGE_SIZE = 24;

export function ChaptersGallery({
  recipes,
  chapters,
  initialChapterId = 'all',
  onSelectRecipe,
  onOpenClip,
  onOpenAskRecipe,
  favoriteIds,
  onToggleFavorite,
  savedOnly = false,
  onBrowseAll,
  lang,
}: ChaptersGalleryProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>(initialChapterId);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const t = UI_STRINGS[lang];

  useEffect(() => {
    setSelectedChapter(initialChapterId);
  }, [initialChapterId]);

  useEffect(() => {
    setPage(1);
  }, [selectedChapter, query, savedOnly]);

  const topChapters = useMemo(
    () => chapters.filter((c) => !c.parentChapterId),
    [chapters]
  );

  const selectedChapterObj = useMemo(
    () => chapters.find((c) => c.id === selectedChapter),
    [chapters, selectedChapter]
  );

  const activeParentChapter = useMemo(() => {
    if (!selectedChapterObj) return undefined;
    if (selectedChapterObj.parentChapterId) {
      return chapters.find((c) => c.id === selectedChapterObj.parentChapterId);
    }
    const hasChildren = chapters.some(
      (c) => c.parentChapterId === selectedChapterObj.id
    );
    return hasChildren ? selectedChapterObj : undefined;
  }, [chapters, selectedChapterObj]);

  const activeSubchapters = useMemo(() => {
    if (!activeParentChapter) return [];
    return chapters.filter((c) => c.parentChapterId === activeParentChapter.id);
  }, [chapters, activeParentChapter]);

  const filteredRecipes = useMemo(() => {
    const chapterIdsSet = new Set(chapters.map((c) => c.id));
    const allowedTargetIds = new Set<string>();
    if (selectedChapter !== 'all') {
      allowedTargetIds.add(selectedChapter);
      for (const ch of chapters) {
        if (ch.parentChapterId === selectedChapter) {
          allowedTargetIds.add(ch.id);
        }
      }
    }

    return recipes.filter((recipe) => {
      if (savedOnly && !favoriteIds.includes(recipe.id)) return false;
      if (selectedChapter !== 'all') {
        const resolvedChapterId = chapterIdsSet.has(recipe.chapterId)
          ? recipe.chapterId
          : LEGACY_CHAPTER_FALLBACK[recipe.chapterId] ?? recipe.chapterId;
        if (!allowedTargetIds.has(resolvedChapterId)) return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          recipe.title.toLowerCase().includes(q) ||
          recipe.subtitle.toLowerCase().includes(q) ||
          recipe.region.toLowerCase().includes(q) ||
          recipe.storyExcerpt.toLowerCase().includes(q) ||
          recipe.chefAuthor.toLowerCase().includes(q) ||
          recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [recipes, chapters, savedOnly, favoriteIds, selectedChapter, query]);

  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pagedRecipes = useMemo(
    () => filteredRecipes.slice(startIdx, startIdx + PAGE_SIZE),
    [filteredRecipes, startIdx]
  );

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 sm:py-10 space-y-10">
      {/* Header & Controls */}
      <div className="border-b border-[var(--border-line)] pb-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
              {savedOnly ? t.personalBookmarkShelf : t.seasonalBistroFolio}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-[var(--text-ink)] mt-1">
              {savedOnly ? t.savedTitle : t.chaptersTitle}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.filterPlaceholder}
                aria-label={t.filterAria}
                className="w-full pl-9 pr-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] placeholder:text-[var(--text-muted)]/70 focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <button
              type="button"
              onClick={onOpenAskRecipe}
              className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t.askChefShort}
            </button>
          </div>
        </div>

        {/* Interactive Chapter & Subchapter Filter Controls */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedChapter('all')}
              className={`px-3.5 py-1.5 text-xs font-mono border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedChapter === 'all'
                  ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
              }`}
            >
              {t.allChapters}
            </button>
            {topChapters.map((chap) => {
              const isActive =
                selectedChapter === chap.id ||
                activeParentChapter?.id === chap.id;
              return (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => setSelectedChapter(chap.id)}
                  className={`px-3.5 py-1.5 text-xs font-mono border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                  }`}
                >
                  {chap.title}
                </button>
              );
            })}
          </div>

          {activeParentChapter && activeSubchapters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)] mr-1">
                {t.subchaptersLabel}:
              </span>
              <button
                type="button"
                onClick={() => setSelectedChapter(activeParentChapter.id)}
                className={`px-3 py-1 text-xs font-mono border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedChapter === activeParentChapter.id
                    ? 'bg-[var(--accent-secondary)] border-[var(--accent-secondary)] text-[var(--accent-primary-fg)]'
                    : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                }`}
              >
                {t.allInParentChapter(activeParentChapter.title)}
              </button>
              {activeSubchapters.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedChapter(sub.id)}
                  className={`px-3 py-1 text-xs font-mono border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedChapter === sub.id
                      ? 'bg-[var(--accent-secondary)] border-[var(--accent-secondary)] text-[var(--accent-primary-fg)]'
                      : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                  }`}
                >
                  {sub.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredRecipes.length === 0 ? (
        <div className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-12 text-center max-w-xl mx-auto my-12 space-y-4">
          <Bookmark className="w-7 h-7 mx-auto text-[var(--accent-secondary)]" strokeWidth={1.4} />
          <h2 className="font-display text-2xl text-[var(--text-ink)]">
            {savedOnly ? t.noBookmarksTitle : t.noMatchesTitle}
          </h2>
          <p className="text-sm font-serif text-[var(--text-muted)] leading-relaxed">
            {savedOnly ? t.noBookmarksHint : t.noMatchesHint}
          </p>
          {savedOnly && onBrowseAll && (
            <button
              type="button"
              onClick={onBrowseAll}
              className="px-5 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono cursor-pointer hover:opacity-90"
            >
              {t.browseSeasonalChapters}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--text-muted)] tabular-nums">
            <span>
              {t.showingPlatesRange(
                startIdx + 1,
                Math.min(startIdx + PAGE_SIZE, filteredRecipes.length),
                filteredRecipes.length
              )}
            </span>
            {totalPages > 1 && (
              <span>{t.pageOfTotal(safePage, totalPages)}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
            {pagedRecipes.map((recipe: Recipe) => {
            const isSaved = favoriteIds.includes(recipe.id);
            const firstClip = resolveRecipeClips(recipe)[0];
            const timedSteps = recipe.steps.filter((s) => s.durationSeconds).length;

            return (
              <article
                key={recipe.id}
                className="group flex flex-col border-b border-[var(--border-line)] pb-8"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => onSelectRecipe(recipe.id)}
                >
                  <EditorialPlateImage
                    src={recipe.heroImage}
                    alt={recipe.title}
                    caption={recipe.figureCaption}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                    {recipe.status === 'draft' && (
                      <>
                        <span className="text-[var(--accent-secondary)] uppercase tracking-wider font-medium">
                          {t.statusDraft}
                        </span>
                        <span aria-hidden="true">·</span>
                      </>
                    )}
                    <span className="text-[var(--accent-secondary)]">
                      {t.plateLabel(recipe.plateNumber)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{recipe.region}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {recipe.prepMinutes + recipe.cookMinutes} {t.minUnit}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{t.servesCount(recipe.baseServings)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(recipe.id)}
                    aria-label={isSaved ? t.removeBookmarkAria : t.saveRecipeAria}
                    className={`p-1.5 cursor-pointer transition-colors ${
                      isSaved
                        ? 'text-[var(--accent-secondary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                    }`}
                  >
                    <Bookmark
                      className="w-4 h-4"
                      fill={isSaved ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>

                <h2
                  onClick={() => onSelectRecipe(recipe.id)}
                  className="font-display text-2xl sm:text-[1.75rem] leading-tight text-[var(--text-ink)] group-hover:text-[var(--accent-primary)] transition-colors mt-2 cursor-pointer text-balance"
                >
                  {recipe.title}
                </h2>
                <p className="text-sm font-serif text-[var(--text-muted)] mt-2 leading-relaxed">
                  {stripStoryMarkup(recipe.storyExcerpt)}
                </p>

                <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectRecipe(recipe.id)}
                    className="text-xs font-mono text-[var(--accent-primary)] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {t.readStoryCard}
                  </button>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-[var(--text-muted)] inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {t.timersCount(timedSteps)}
                    </span>
                    {firstClip && (
                      <button
                        type="button"
                        onClick={() => onOpenClip(firstClip, recipe.title)}
                        className="text-xs font-mono text-[var(--accent-secondary)] hover:text-[var(--text-ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        {t.watchPrepClip}
                      </button>
                    )}
                  </div>
                </div>
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
      )}
    </div>
  );
}
