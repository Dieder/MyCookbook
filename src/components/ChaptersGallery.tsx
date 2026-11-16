import { useMemo, useState } from 'react';
import { Bookmark, Clock, LogIn, LogOut, PlayCircle, Search, Sparkles } from 'lucide-react';
import { getLocalizedChapters, UI_STRINGS } from '../i18n/translations';
import { LanguageCode, Recipe, TechniqueClip } from '../types/cookbook';
import { EditorialPlateImage } from './EditorialPlateImage';

interface ChaptersGalleryProps {
  recipes: Recipe[];
  onSelectRecipe: (recipeId: string) => void;
  onOpenClip: (clip: TechniqueClip, recipeTitle: string) => void;
  onOpenAskRecipe: () => void;
  favoriteIds: string[];
  onToggleFavorite: (recipeId: string) => void;
  savedOnly?: boolean;
  onBrowseAll?: () => void;
  userEmail: string | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  lang: LanguageCode;
}

export function ChaptersGallery({
  recipes,
  onSelectRecipe,
  onOpenClip,
  onOpenAskRecipe,
  favoriteIds,
  onToggleFavorite,
  savedOnly = false,
  onBrowseAll,
  userEmail,
  onSignIn,
  onSignOut,
  lang,
}: ChaptersGalleryProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const t = UI_STRINGS[lang];
  const chapters = getLocalizedChapters(lang);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      if (savedOnly && !favoriteIds.includes(recipe.id)) return false;
      if (selectedChapter !== 'all' && recipe.chapterId !== selectedChapter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          recipe.title.toLowerCase().includes(q) ||
          recipe.subtitle.toLowerCase().includes(q) ||
          recipe.region.toLowerCase().includes(q) ||
          recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [recipes, savedOnly, favoriteIds, selectedChapter, query]);

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

        {/* Interactive chapter segmented filter buttons + Account Sync */}
        <div className="flex flex-wrap items-center justify-between gap-4">
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
            {chapters.map((chap) => (
              <button
                key={chap.id}
                type="button"
                onClick={() => setSelectedChapter(chap.id)}
                className={`px-3.5 py-1.5 text-xs font-mono border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedChapter === chap.id
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                    : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                }`}
              >
                {chap.romanIndex}. {chap.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {userEmail ? (
              <>
                <span className="text-[var(--text-muted)] truncate max-w-[200px]">{userEmail}</span>
                <button
                  type="button"
                  onClick={() => void onSignOut()}
                  className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t.signOut}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => void onSignIn()}
                className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                {t.signInSync}
              </button>
            )}
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
          {filteredRecipes.map((recipe: Recipe) => {
            const isSaved = favoriteIds.includes(recipe.id);
            const firstClip = recipe.techniques[0];
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
                  {recipe.storyExcerpt}
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
      )}
    </div>
  );
}
