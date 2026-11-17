import { Bookmark, Sparkles } from 'lucide-react';
import { BOOK_METADATA } from '../data/cookbookData';
import {
  BOOK_METADATA_I18N,
  UI_STRINGS,
} from '../i18n/translations';
import { Chapter, LanguageCode, Recipe } from '../types/cookbook';
import { resolveRecipeClips } from '../utils/youtube';
import { EditorialPlateImage } from './EditorialPlateImage';

interface BookCoverFrontispieceProps {
  recipes: Recipe[];
  chapters: Chapter[];
  onSelectRecipe: (recipeId: string) => void;
  onBrowseChapters: () => void;
  onSelectChapter?: (chapterId: string) => void;
  onOpenAskRecipe: () => void;
  favoriteIds: string[];
  onToggleFavorite: (recipeId: string) => void;
  lang: LanguageCode;
}

const LEGACY_CHAPTER_FALLBACK: Record<string, string> = {
  'hearth-harvest': 'comfort-food',
  'coastal-market': 'dinner',
  'orchard-patisserie': 'desserts',
};

export function BookCoverFrontispiece({
  recipes,
  chapters,
  onSelectRecipe,
  onBrowseChapters,
  onSelectChapter,
  onOpenAskRecipe,
  favoriteIds,
  onToggleFavorite,
  lang,
}: BookCoverFrontispieceProps) {
  const t = UI_STRINGS[lang];
  const meta = BOOK_METADATA_I18N[lang];

  const totalClips = recipes.reduce((acc, r) => acc + resolveRecipeClips(r).length, 0);
  const totalTimedSteps = recipes.reduce(
    (acc, r) => acc + r.steps.filter((s) => s.durationSeconds).length,
    0
  );

  const chapterIdsSet = new Set(chapters.map((c) => c.id));
  const resolveRecipeChapterId = (chapterId: string) =>
    chapterIdsSet.has(chapterId)
      ? chapterId
      : LEGACY_CHAPTER_FALLBACK[chapterId] ?? chapterId;

  const topChapters = chapters.filter((c) => !c.parentChapterId);

  const renderRecipeRow = (recipe: Recipe) => {
    const isSaved = favoriteIds.includes(recipe.id);
    return (
      <div
        key={recipe.id}
        className="group flex items-start justify-between gap-3 pb-3 border-b border-[var(--border-subtle)] last:border-b-0 last:pb-0"
      >
        <button
          type="button"
          onClick={() => onSelectRecipe(recipe.id)}
          className="text-left flex-1 cursor-pointer min-w-0"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            {recipe.status === 'draft' && (
              <>
                <span className="text-[var(--accent-secondary)] uppercase tracking-wider font-medium">
                  {t.statusDraft}
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{t.plateLabel(recipe.plateNumber)}</span>
            <span aria-hidden="true">·</span>
            <span>
              {recipe.prepMinutes + recipe.cookMinutes} {t.minUnit}
            </span>
            {resolveRecipeClips(recipe).length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {resolveRecipeClips(recipe).length} {t.clipsUnit}
                </span>
              </>
            )}
          </div>
          <p className="font-display text-base text-[var(--text-ink)] group-hover:text-[var(--accent-primary)] transition-colors mt-0.5 leading-snug">
            {recipe.title}
          </p>
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(recipe.id)}
          aria-label={isSaved ? t.removeBookmarkAria : t.saveRecipeAria}
          className={`p-2 cursor-pointer transition-colors shrink-0 ${
            isSaved
              ? 'text-[var(--accent-secondary)]'
              : 'text-[var(--text-muted)]/60 hover:text-[var(--text-ink)]'
          }`}
        >
          <Bookmark
            className="w-4 h-4"
            fill={isSaved ? 'currentColor' : 'none'}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 sm:py-12 space-y-16">
      {/* Split-Column Editorial Frontispiece */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch pb-14 border-b border-[var(--border-line)]">
        <div className="lg:col-span-6 flex flex-col justify-between py-2">
          <div className="space-y-6">
            <p className="text-xs font-mono uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
              {meta.volume}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] font-medium text-[var(--text-ink)] text-balance">
              {meta.title}
            </h1>
            <p className="text-lg font-serif italic text-[var(--text-muted)] max-w-xl leading-relaxed">
              {meta.subtitle}
            </p>

            <div className="pt-4 border-t border-[var(--border-subtle)] max-w-xl">
              <p className="font-serif text-[15px] leading-[1.8] text-[var(--text-ink)]/90 first-letter:text-5xl first-letter:font-display first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-0.5 first-letter:leading-[0.85] first-letter:text-[var(--accent-primary)]">
                {meta.foreword}
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAskRecipe}
              className="px-5 py-3 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-sm font-serif inline-flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              {t.askChefForRecipe}
            </button>
            <button
              type="button"
              onClick={onBrowseChapters}
              className="px-5 py-3 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-ink)] text-sm font-serif hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {t.browsePlates}
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col">
          <EditorialPlateImage
            src={BOOK_METADATA.coverImage}
            alt={meta.title}
            caption={meta.coverCaption}
            aspectClass="aspect-[3/4] lg:aspect-auto lg:h-[560px]"
            priority
            className="h-full"
          />
        </div>
      </section>

      {/* Our Kitchen Menu */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-line)] pb-5">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-[var(--text-ink)]">
              {t.chaptersIndexTitle}
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
            {t.platesSummary(recipes.length, totalClips, totalTimedSteps)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {topChapters.map((chapter) => {
            const subchapters = chapters.filter(
              (sub) => sub.parentChapterId === chapter.id
            );
            const chapterRecipes = recipes.filter(
              (r) => resolveRecipeChapterId(r.chapterId) === chapter.id
            );

            return (
              <div
                key={chapter.id}
                className="flex flex-col justify-between border border-[var(--border-line)] bg-[var(--bg-surface)]/80 p-6 sm:p-7"
              >
                <div>
                  <div className="pb-2.5 border-b border-[var(--border-line)]">
                    <span className="text-xs font-serif italic text-[var(--accent-secondary)]">
                      {chapter.seasonNote}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-[var(--text-ink)] mt-3.5">
                    {onSelectChapter ? (
                      <button
                        type="button"
                        onClick={() => onSelectChapter(chapter.id)}
                        className="text-left hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                      >
                        {chapter.title}
                      </button>
                    ) : (
                      chapter.title
                    )}
                  </h3>
                  <p className="text-sm font-serif text-[var(--text-muted)] mt-2 leading-relaxed">
                    {chapter.epigraph}
                  </p>
                </div>

                {(chapterRecipes.length > 0 || subchapters.length > 0) && (
                  <div className="mt-6 pt-4 border-t border-[var(--border-line)] space-y-4">
                    {chapterRecipes.slice(0, 3).map(renderRecipeRow)}

                    {chapterRecipes.length > 0 && onSelectChapter && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => onSelectChapter(chapter.id)}
                          className="text-xs font-mono text-[var(--accent-primary)] hover:underline cursor-pointer tabular-nums"
                        >
                          {t.viewAllPlatesCount(chapterRecipes.length)}
                        </button>
                      </div>
                    )}

                    {subchapters.length > 0 && (
                      <div className="space-y-3 pt-1">
                        <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)]">
                          {t.subchaptersLabel}
                        </p>
                        <div className="space-y-3">
                          {subchapters.map((sub) => {
                            const subRecipes = recipes.filter(
                              (r) =>
                                resolveRecipeChapterId(r.chapterId) === sub.id
                            );
                            return (
                              <div
                                key={sub.id}
                                className="pl-3.5 pt-2 border-t border-[var(--border-subtle)] space-y-2"
                              >
                                <div className="flex items-baseline justify-between gap-2">
                                  {onSelectChapter ? (
                                    <button
                                      type="button"
                                      onClick={() => onSelectChapter(sub.id)}
                                      className="font-display text-base text-[var(--text-ink)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer text-left"
                                    >
                                      — {sub.title}
                                    </button>
                                  ) : (
                                    <span className="font-display text-base text-[var(--text-ink)]">
                                      — {sub.title}
                                    </span>
                                  )}
                                  <span className="text-[11px] font-serif italic text-[var(--text-muted)] truncate">
                                    {sub.seasonNote}
                                  </span>
                                </div>
                                {subRecipes.length > 0 && (
                                  <div className="space-y-2.5 pl-3">
                                    {subRecipes.slice(0, 2).map(renderRecipeRow)}
                                    {onSelectChapter && (
                                      <button
                                        type="button"
                                        onClick={() => onSelectChapter(sub.id)}
                                        className="text-[11px] font-mono text-[var(--accent-primary)] hover:underline cursor-pointer tabular-nums block pt-0.5"
                                      >
                                        {t.viewAllPlatesCount(subRecipes.length)}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
