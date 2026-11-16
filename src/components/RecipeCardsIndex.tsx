import { useState } from 'react';
import { Bookmark, Clock, PlayCircle, Sparkles, Users, Utensils } from 'lucide-react';
import {
  formatPersonLabel,
  getLocalizedChapters,
  UI_STRINGS,
} from '../i18n/translations';
import { LanguageCode, Recipe, TechniqueClip, UnitSystem } from '../types/cookbook';
import { formatCulinaryQuantity } from '../utils/formatters';

interface RecipeCardsIndexProps {
  recipes: Recipe[];
  onSelectRecipe: (recipeId: string) => void;
  onEnterCookMode: (recipeId: string) => void;
  onOpenClip: (clip: TechniqueClip, recipeTitle: string) => void;
  onOpenAskRecipe: () => void;
  favoriteIds: string[];
  onToggleFavorite: (recipeId: string) => void;
  unitSystem: UnitSystem;
  onChangeUnitSystem: (unit: UnitSystem) => void;
  servingsMap: Record<string, number>;
  onChangeServings: (recipeId: string, servings: number) => void;
  lang: LanguageCode;
}

export function RecipeCardsIndex({
  recipes,
  onSelectRecipe,
  onEnterCookMode,
  onOpenClip,
  onOpenAskRecipe,
  favoriteIds,
  onToggleFavorite,
  unitSystem,
  onChangeUnitSystem,
  servingsMap,
  onChangeServings,
  lang,
}: RecipeCardsIndexProps) {
  const [compactChapter, setCompactChapter] = useState<string>('all');
  const t = UI_STRINGS[lang];
  const chapters = getLocalizedChapters(lang);

  const visibleRecipes =
    compactChapter === 'all'
      ? recipes
      : recipes.filter((r) => r.chapterId === compactChapter);

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 sm:py-10 space-y-10">
      <div className="border-b border-[var(--border-line)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
            {t.miseEnPlaceIndex}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--text-ink)] mt-1">
            {t.collectibleCardsTitle}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex border border-[var(--border-line)] bg-[var(--bg-surface)]">
            <button
              type="button"
              onClick={() => onChangeUnitSystem('metric')}
              className={`px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                unitSystem === 'metric'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
              }`}
            >
              {t.metricFull}
            </button>
            <button
              type="button"
              onClick={() => onChangeUnitSystem('imperial')}
              className={`px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                unitSystem === 'imperial'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
              }`}
            >
              {t.usCustomaryFull}
            </button>
          </div>

          <select
            value={compactChapter}
            onChange={(e) => setCompactChapter(e.target.value)}
            aria-label={t.filterByChapterAria}
            className="px-3 py-1.5 text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-line)] text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="all">{t.allChapters}</option>
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.romanIndex}. {ch.title}
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

      {/* 2-Column Linen-Ruled Recipe Card Folio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visibleRecipes.map((recipe) => {
          const currentServings = servingsMap[recipe.id] ?? recipe.baseServings;
          const multiplier = currentServings / recipe.baseServings;
          const isSaved = favoriteIds.includes(recipe.id);

          return (
            <article
              key={recipe.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-line)] flex flex-col justify-between"
            >
              {/* Card Top Masthead */}
              <div>
                <div className="p-6 border-b border-[var(--border-line)] flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={recipe.heroImage}
                      alt={recipe.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-cover border border-[var(--border-line)] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-[var(--accent-secondary)]">
                        {t.plateLabel(recipe.plateNumber)} · {recipe.region}
                      </p>
                      <h2
                        onClick={() => onSelectRecipe(recipe.id)}
                        className="font-display text-xl text-[var(--text-ink)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer mt-1 leading-snug"
                      >
                        {recipe.title}
                      </h2>
                      <p className="text-xs font-mono text-[var(--text-muted)] mt-1.5 tabular-nums">
                        {t.prepWord} {recipe.prepMinutes}m · {t.cookWord} {recipe.cookMinutes}m ·{' '}
                        {recipe.steps.length} {t.stepsWord}
                      </p>
                    </div>
                  </div>

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
                </div>

                {/* Person Count Selector Strip */}
                <div className="px-6 py-3 bg-[var(--bg-elevated)]/60 border-b border-[var(--border-line)] flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-[var(--text-muted)] inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                    {t.personsLabel}
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
                <ul className="px-6 py-4 divide-y divide-[var(--border-subtle)]">
                  {recipe.ingredients.map((ing) => {
                    const baseAmt =
                      unitSystem === 'metric' ? ing.metricAmount : ing.imperialAmount;
                    const unit =
                      unitSystem === 'metric' ? ing.metricUnit : ing.imperialUnit;
                    const formatted = formatCulinaryQuantity(baseAmt * multiplier, unit);

                    return (
                      <li
                        key={ing.id}
                        className="py-2 flex items-baseline justify-between gap-4 text-sm font-serif"
                      >
                        <span className="text-[var(--text-ink)]">{ing.name}</span>
                        <span className="font-mono text-xs text-[var(--accent-secondary)] tabular-nums whitespace-nowrap shrink-0">
                          {formatted} {unit}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Card Action Footer */}
              <div className="px-6 py-4 border-t border-[var(--border-line)] bg-[var(--bg-paper)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onSelectRecipe(recipe.id)}
                    className="text-xs font-mono text-[var(--accent-primary)] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {t.openBookSpread}
                  </button>
                  {recipe.techniques[0] && (
                    <button
                      type="button"
                      onClick={() => onOpenClip(recipe.techniques[0], recipe.title)}
                      className="text-xs font-mono text-[var(--accent-secondary)] hover:text-[var(--text-ink)] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      {t.prepClipShort}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onEnterCookMode(recipe.id)}
                  className="px-3.5 py-1.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Utensils className="w-3 h-3" />
                  {t.cookAndTime}
                  <Clock className="w-3 h-3 opacity-80" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
