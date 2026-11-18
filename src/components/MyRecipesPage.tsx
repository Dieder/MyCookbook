import { useMemo, useState } from 'react';
import {
  BookOpen,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { formatPersonLabel, UI_STRINGS } from '../i18n/translations';
import {
  Chapter,
  LanguageCode,
  Recipe,
  RecipeStatus,
} from '../types/cookbook';
import { EditorialPlateImage } from './EditorialPlateImage';

interface MyRecipesPageProps {
  canContribute: boolean;
  recipes: Recipe[];
  chapters: Chapter[];
  onCreateNew: () => void;
  onOpenAskRecipe: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onOpenSpread: (recipeId: string) => void;
  onTogglePublish: (recipe: Recipe, nextStatus: RecipeStatus) => Promise<void>;
  onDeleteRecipe: (recipe: Recipe) => Promise<void>;
  onGoToSettings: () => void;
  lang: LanguageCode;
}

export function MyRecipesPage({
  canContribute,
  recipes,
  chapters,
  onCreateNew,
  onOpenAskRecipe,
  onEditRecipe,
  onOpenSpread,
  onTogglePublish,
  onDeleteRecipe,
  onGoToSettings,
  lang,
}: MyRecipesPageProps) {
  const t = UI_STRINGS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const chapterMap = useMemo(() => {
    const map = new Map<string, Chapter>();
    for (const c of chapters) {
      map.set(c.id, c);
    }
    return map;
  }, [chapters]);

  const topChapters = useMemo(
    () => chapters.filter((c) => !c.parentChapterId),
    [chapters]
  );

  const publishedCount = useMemo(
    () => recipes.filter((r) => r.status !== 'draft').length,
    [recipes]
  );
  const draftCount = useMemo(
    () => recipes.filter((r) => r.status === 'draft').length,
    [recipes]
  );

  const filteredRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return recipes.filter((r) => {
      const effectiveStatus: RecipeStatus =
        r.status === 'draft' ? 'draft' : 'published';
      if (statusFilter !== 'all' && effectiveStatus !== statusFilter) {
        return false;
      }
      if (chapterFilter !== 'all') {
        const subIds = chapters
          .filter((c) => c.parentChapterId === chapterFilter)
          .map((c) => c.id);
        if (r.chapterId !== chapterFilter && !subIds.includes(r.chapterId)) {
          return false;
        }
      }
      if (!q) return true;
      const chapTitle = chapterMap.get(r.chapterId)?.title.toLowerCase() ?? '';
      const inTitle = r.title.toLowerCase().includes(q);
      const inSubtitle = r.subtitle.toLowerCase().includes(q);
      const inRegion = r.region.toLowerCase().includes(q);
      const inIngredients = r.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(q)
      );
      return (
        inTitle ||
        inSubtitle ||
        inRegion ||
        chapTitle.includes(q) ||
        inIngredients
      );
    });
  }, [recipes, searchQuery, statusFilter, chapterFilter, chapters, chapterMap]);

  if (!canContribute) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16">
        <div className="max-w-lg mx-auto border border-[var(--border-line)] bg-[var(--bg-surface)] p-8 text-center space-y-4">
          <Shield className="w-7 h-7 mx-auto text-[var(--accent-secondary)]" />
          <h1 className="font-display text-2xl text-[var(--text-ink)]">
            {t.myRecipesTitle}
          </h1>
          <p className="font-serif text-sm text-[var(--text-muted)]">
            {t.myRecipesAccessDenied}
          </p>
          <button
            type="button"
            onClick={onGoToSettings}
            className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono cursor-pointer whitespace-nowrap"
          >
            {t.goToSettings}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 sm:py-10 space-y-8">
      {/* Masthead */}
      <div className="border-b border-[var(--border-line)] pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
            {t.myRecipesEyebrow}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--text-ink)]">
            {t.myRecipesTitle}
          </h1>
          <p className="font-serif text-base text-[var(--text-muted)] leading-relaxed">
            {t.myRecipesSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAskRecipe}
            className="px-4 py-2.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-2 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
            {t.askChefShort}
          </button>

          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.createRecipeBtn}
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchMyRecipesPlaceholder}
            aria-label={t.searchMyRecipesPlaceholder}
            className="w-full pl-10 pr-3.5 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] placeholder:text-[var(--text-muted)]/65 focus:outline-none focus:border-[var(--accent-primary)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Status Filter Buttons */}
          <div
            role="group"
            aria-label="Filter by publish status"
            className="inline-flex border border-[var(--border-line)] bg-[var(--bg-paper)]"
          >
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-mono cursor-pointer whitespace-nowrap tabular-nums ${
                statusFilter === 'all'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
              }`}
            >
              {t.statusAll} ({recipes.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 text-xs font-mono cursor-pointer whitespace-nowrap tabular-nums ${
                statusFilter === 'published'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
              }`}
            >
              {t.statusPublished} ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 text-xs font-mono cursor-pointer whitespace-nowrap tabular-nums ${
                statusFilter === 'draft'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
              }`}
            >
              {t.statusDraft} ({draftCount})
            </button>
          </div>

          {/* Chapter Filter */}
          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            aria-label={t.filterByChapterAria}
            className="px-3 py-1.5 bg-[var(--bg-paper)] border border-[var(--border-line)] text-xs font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="all">{t.allCoursesLabel}</option>
            {topChapters.map((parent) => {
              const subs = chapters.filter((c) => c.parentChapterId === parent.id);
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
          </select>
        </div>
      </div>

      {/* Recipes List */}
      {filteredRecipes.length === 0 ? (
        <div className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-10 text-center space-y-4">
          <BookOpen className="w-7 h-7 mx-auto text-[var(--accent-secondary)]" strokeWidth={1.5} />
          <h2 className="font-display text-2xl text-[var(--text-ink)]">
            {recipes.length === 0 ? t.noMyRecipesTitle : t.noMatchesTitle}
          </h2>
          <p className="font-serif text-sm text-[var(--text-muted)] max-w-md mx-auto">
            {recipes.length === 0 ? t.noMyRecipesHint : t.noMatchesHint}
          </p>
          {recipes.length === 0 && (
            <button
              type="button"
              onClick={onCreateNew}
              className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {t.createRecipeBtn}
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-[var(--border-line)] border border-[var(--border-line)] bg-[var(--bg-surface)]">
          {filteredRecipes.map((recipe) => {
            const isDraft = recipe.status === 'draft';
            const isBusy = busyId === recipe.id;
            const chapter = chapterMap.get(recipe.chapterId);

            return (
              <article
                key={recipe.id}
                className="p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-start"
              >
                <button
                  type="button"
                  onClick={() => onOpenSpread(recipe.id)}
                  className="w-full md:w-48 shrink-0 text-left cursor-pointer group"
                >
                  <EditorialPlateImage
                    src={recipe.heroImage}
                    alt={recipe.title}
                    aspectClass="aspect-[4/3]"
                  />
                </button>

                <div className="flex-1 min-w-0 space-y-2.5">
                  {/* Unboxed Typographic Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-[var(--text-muted)]">
                    <span
                      className={
                        isDraft
                          ? 'text-[var(--accent-secondary)] font-medium uppercase tracking-wider'
                          : 'text-[var(--accent-primary)] font-medium uppercase tracking-wider'
                      }
                    >
                      {isDraft ? t.statusDraft : t.statusPublished}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{chapter ? chapter.title : recipe.chapterId}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                      <span>
                        {recipe.prepMinutes + recipe.cookMinutes} {t.minUnit}
                      </span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                      <span>{recipe.baseServings}</span>
                      <span className="hidden md:inline">
                        {formatPersonLabel(recipe.baseServings, lang)}
                      </span>
                    </span>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => onOpenSpread(recipe.id)}
                      className="text-left font-display text-2xl text-[var(--text-ink)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer text-balance"
                    >
                      {recipe.title}
                    </button>
                    <p className="font-serif italic text-sm text-[var(--text-muted)] mt-0.5">
                      {recipe.subtitle}
                    </p>
                  </div>

                  <p className="font-serif text-sm text-[var(--text-ink)]/85 leading-relaxed line-clamp-2 max-w-3xl">
                    {recipe.storyExcerpt}
                  </p>

                  {/* Actions Row */}
                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onOpenSpread(recipe.id)}
                      className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {t.openPlateBtn}
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditRecipe(recipe)}
                      className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      {t.editBtn}
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={async () => {
                        setBusyId(recipe.id);
                        setConfirmDeleteId(null);
                        try {
                          await onTogglePublish(
                            recipe,
                            isDraft ? 'published' : 'draft'
                          );
                        } finally {
                          setBusyId(null);
                        }
                      }}
                      className={`px-3 py-1.5 border text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0 ${
                        isDraft
                          ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)] hover:opacity-90'
                          : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-ink)] hover:border-[var(--accent-secondary)] hover:text-[var(--accent-secondary)]'
                      }`}
                    >
                      {isDraft ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          {t.publishBtn}
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          {t.unpublishBtn}
                        </>
                      )}
                    </button>

                    {/* Delete is ONLY permitted when unpublished (draft) */}
                    {isDraft ? (
                      confirmDeleteId === recipe.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={async () => {
                              setBusyId(recipe.id);
                              try {
                                await onDeleteRecipe(recipe);
                                setConfirmDeleteId(null);
                              } finally {
                                setBusyId(null);
                              }
                            }}
                            className="px-3 py-1.5 bg-[var(--accent-secondary)] text-[var(--accent-primary-fg)] text-xs font-mono cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                          >
                            {t.confirmDeleteBtn}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            aria-label={t.cancel}
                            className="p-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-[var(--text-muted)] cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setConfirmDeleteId(recipe.id)}
                          className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--accent-secondary)] hover:bg-[var(--accent-soft)] inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {t.deleteBtn}
                        </button>
                      )
                    ) : (
                      <span
                        title={t.unpublishToDeleteHint}
                        className="text-[11px] font-serif italic text-[var(--text-muted)] pl-1"
                      >
                        {t.unpublishToDeleteHint}
                      </span>
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
