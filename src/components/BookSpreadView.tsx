import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Clock,
  Pause,
  Play,
  PlayCircle,
  Plus,
  RotateCcw,
  Trash2,
  Users,
  Utensils,
  Wand2,
} from 'lucide-react';
import {
  formatPersonLabel,
  getLocalizedChapters,
  UI_STRINGS,
} from '../i18n/translations';
import {
  ActiveTimer,
  LanguageCode,
  Recipe,
  TechniqueClip,
  UnitSystem,
} from '../types/cookbook';
import {
  formatCountdown,
  formatCulinaryQuantity,
  formatMinutesLabel,
  playSubtleClick,
} from '../utils/formatters';
import { EditorialPlateImage } from './EditorialPlateImage';

interface BookSpreadViewProps {
  recipe: Recipe;
  allRecipes: Recipe[];
  onSelectRecipe: (recipeId: string) => void;
  onBackToChapters: () => void;
  onEnterCookMode: () => void;
  onOpenClip: (clip: TechniqueClip, recipeTitle: string) => void;
  onOpenCustomize: () => void;
  onDeleteRecipe?: () => void;
  onRevertCustomization?: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  servings: number;
  onChangeServings: (servings: number) => void;
  unitSystem: UnitSystem;
  onChangeUnitSystem: (unit: UnitSystem) => void;
  checkedIngredients: string[];
  onToggleIngredient: (ingredientId: string) => void;
  completedSteps: number[];
  onToggleStepComplete: (stepNumber: number) => void;
  kitchenNote: string;
  onSaveKitchenNote: (note: string) => void;
  timers: ActiveTimer[];
  onStartTimer: (payload: {
    recipeId: string;
    recipeTitle: string;
    stepNumber: number;
    label: string;
    durationSeconds: number;
  }) => void;
  onPauseTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
  onAddMinute: (id: string) => void;
  lang: LanguageCode;
}

export function BookSpreadView({
  recipe,
  allRecipes,
  onSelectRecipe,
  onBackToChapters,
  onEnterCookMode,
  onOpenClip,
  onOpenCustomize,
  onDeleteRecipe,
  onRevertCustomization,
  isFavorite,
  onToggleFavorite,
  servings,
  onChangeServings,
  unitSystem,
  onChangeUnitSystem,
  checkedIngredients,
  onToggleIngredient,
  completedSteps,
  onToggleStepComplete,
  kitchenNote,
  onSaveKitchenNote,
  timers,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onAddMinute,
  lang,
}: BookSpreadViewProps) {
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const t = UI_STRINGS[lang];
  const chapters = getLocalizedChapters(lang);

  const chapter = chapters.find((c) => c.id === recipe.chapterId);
  const currentIndex = allRecipes.findIndex((r) => r.id === recipe.id);
  const prevRecipe = currentIndex > 0 ? allRecipes[currentIndex - 1] : null;
  const nextRecipe =
    currentIndex >= 0 && currentIndex < allRecipes.length - 1
      ? allRecipes[currentIndex + 1]
      : null;

  const multiplier = servings / recipe.baseServings;

  const handleNoteChange = (val: string) => {
    onSaveKitchenNote(val);
    setNoteSavedFeedback(true);
    window.setTimeout(() => setNoteSavedFeedback(false), 1200);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 sm:py-10 space-y-14">
      {/* Top Book Folio Navigation Strip */}
      <div className="pb-5 border-b border-[var(--border-line)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
          <button
            type="button"
            onClick={onBackToChapters}
            className="inline-flex items-center gap-1.5 hover:text-[var(--text-ink)] cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.allChapters}
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--accent-secondary)]">
            {t.chapterPrefix} {chapter?.romanIndex}: {chapter?.title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCustomize}
            className="px-3.5 py-2 border border-[var(--accent-primary)] bg-[var(--bg-paper)] text-[var(--accent-primary)] text-xs font-mono inline-flex items-center gap-1.5 hover:bg-[var(--accent-primary)] hover:text-[var(--accent-primary-fg)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Wand2 className="w-3.5 h-3.5" />
            {t.customizeWithAi}
          </button>

          {onRevertCustomization && (
            <button
              type="button"
              onClick={onRevertCustomization}
              className="px-3 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)] text-xs font-mono inline-flex items-center gap-1.5 hover:text-[var(--text-ink)] cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.originalVersion}
            </button>
          )}

          {onDeleteRecipe && (
            <button
              type="button"
              onClick={onDeleteRecipe}
              aria-label={t.deleteRecipeAria}
              className="px-3 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)] text-xs font-mono inline-flex items-center gap-1 hover:text-[var(--accent-secondary)] cursor-pointer whitespace-nowrap shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              onToggleFavorite();
            }}
            className={`px-3.5 py-2 border text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isFavorite
                ? 'bg-[var(--accent-soft)] border-[var(--accent-secondary)] text-[var(--accent-secondary)]'
                : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-ink)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? t.bookmarked : t.bookmark}
          </button>

          <button
            type="button"
            onClick={onEnterCookMode}
            className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
          >
            <Utensils className="w-3.5 h-3.5" />
            {t.startCookMode}
          </button>
        </div>
      </div>

      {/* PAGE 1 SPREAD: Large Dish Photography + Editorial Story */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start pb-14 border-b border-[var(--border-line)]">
        {/* Left Folio Plate */}
        <div className="lg:col-span-6 space-y-6">
          <EditorialPlateImage
            src={recipe.heroImage}
            alt={recipe.title}
            caption={recipe.figureCaption}
            aspectClass="aspect-[4/3]"
            priority
          />

          {/* Preparation Technique Video Clips Shelf */}
          <div className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5">
              <p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)]">
                {t.preparationClips}
              </p>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {t.visualStudiesCount(recipe.techniques.length)}
              </span>
            </div>

            <div className="space-y-2.5">
              {recipe.techniques.map((clip) => (
                <button
                  key={clip.id}
                  type="button"
                  onClick={() => onOpenClip(clip, recipe.title)}
                  className="w-full text-left p-3 bg-[var(--bg-paper)] border border-[var(--border-line)] hover:border-[var(--accent-primary)] transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="min-w-0">
                    <p className="font-display text-base text-[var(--text-ink)] group-hover:text-[var(--accent-primary)] truncate">
                      {clip.title}
                    </p>
                    <p className="text-xs font-serif text-[var(--text-muted)] truncate mt-0.5">
                      {clip.subtitle}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-secondary)] shrink-0">
                    <PlayCircle className="w-4 h-4" />
                    0:{String(clip.durationSeconds).padStart(2, '0')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Folio Story Column */}
        <div className="lg:col-span-6 lg:pl-6 lg:border-l lg:border-[var(--border-subtle)] space-y-6 max-w-[65ch]">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
              <span className="text-[var(--accent-secondary)]">
                {t.plateLabel(recipe.plateNumber)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{recipe.region}</span>
              <span aria-hidden="true">·</span>
              <span>
                {t.prepWord} {recipe.prepMinutes} {t.minUnit}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {t.cookWord} {recipe.cookMinutes} {t.minUnit}
              </span>
              <span aria-hidden="true">·</span>
              <span>{t.byAuthor(recipe.chefAuthor)}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] leading-[1.12] font-medium text-[var(--text-ink)] text-balance">
              {recipe.title}
            </h1>
            <p className="font-serif italic text-lg text-[var(--text-muted)] leading-relaxed">
              {recipe.subtitle}
            </p>
            {recipe.customizationNote && (
              <p className="text-xs font-mono text-[var(--accent-primary)] pt-1">
                {t.customizedEdition} · {recipe.customizationNote}
              </p>
            )}
          </div>

          <div className="space-y-5 pt-3 border-t border-[var(--border-subtle)]">
            {recipe.storyParagraphs.map((para, idx) => (
              <p
                key={idx}
                className={`font-serif text-[16px] leading-[1.82] text-[var(--text-ink)]/90 ${
                  idx === 0
                    ? 'first-letter:text-5xl first-letter:font-display first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.84] first-letter:text-[var(--accent-primary)]'
                    : ''
                }`}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Editorial Pull Quote — Top/Bottom Hairlines */}
          <blockquote className="my-6 py-5 border-y border-[var(--border-line)] text-center px-4">
            <p className="font-display italic text-xl sm:text-2xl text-[var(--text-ink)] leading-snug text-balance">
              {recipe.pullQuote}
            </p>
          </blockquote>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-line)] p-4">
            <p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)]">
              {t.cellarPairing}
            </p>
            <p className="text-sm font-serif text-[var(--text-ink)] mt-1 leading-relaxed">
              {recipe.pairingNote}
            </p>
          </div>
        </div>
      </section>

      {/* PAGE 2 SPREAD: Interactive Recipe Card + Step-by-Step Cooking Timers */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: Interactive Recipe Card */}
        <aside className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-line)] p-6 sm:p-7 space-y-6">
          <div className="border-b border-[var(--border-line)] pb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)]">
                {t.recipeCardEyebrow}
              </p>
              <h2 className="font-display text-2xl text-[var(--text-ink)] mt-0.5">
                {t.ingredientsAndScaling}
              </h2>
            </div>

            <div className="inline-flex border border-[var(--border-line)] bg-[var(--bg-paper)]">
              <button
                type="button"
                onClick={() => onChangeUnitSystem('metric')}
                className={`px-2.5 py-1 text-xs font-mono cursor-pointer ${
                  unitSystem === 'metric'
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                }`}
              >
                {t.metricShort}
              </button>
              <button
                type="button"
                onClick={() => onChangeUnitSystem('imperial')}
                className={`px-2.5 py-1 text-xs font-mono cursor-pointer ${
                  unitSystem === 'imperial'
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                }`}
              >
                {t.usShort}
              </button>
            </div>
          </div>

          {/* Person Count Selector for Ingredients */}
          <div className="space-y-3 py-3 border-b border-[var(--border-subtle)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label
                htmlFor={`person-select-${recipe.id}`}
                className="text-xs font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] inline-flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                {t.personCountLabel}
              </label>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onChangeServings(Math.max(1, servings - 1))}
                  aria-label={t.decreasePersonsAria}
                  className="w-8 h-8 border border-[var(--border-line)] bg-[var(--bg-paper)] font-mono text-sm hover:bg-[var(--bg-elevated)] cursor-pointer"
                >
                  −
                </button>
                <select
                  id={`person-select-${recipe.id}`}
                  value={servings}
                  onChange={(e) => onChangeServings(Number(e.target.value))}
                  aria-label={t.personCountLabel}
                  className="h-8 px-2.5 border border-[var(--border-line)] bg-[var(--bg-paper)] font-mono text-xs text-[var(--text-ink)] tabular-nums focus:outline-none focus:border-[var(--accent-primary)]"
                >
                  {Array.from(
                    new Set([1, 2, 3, 4, 5, 6, 8, 10, 12, servings])
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
                  onClick={() => onChangeServings(Math.min(24, servings + 1))}
                  aria-label={t.increasePersonsAria}
                  className="w-8 h-8 border border-[var(--border-line)] bg-[var(--bg-paper)] font-mono text-sm hover:bg-[var(--bg-elevated)] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-serif italic text-[var(--text-muted)]">
                {t.quickScaleFromBase(
                  recipe.baseServings,
                  formatPersonLabel(recipe.baseServings, lang)
                )}
              </span>
              <div className="flex items-center gap-1.5">
                {[0.5, 1, 2].map((factor) => {
                  const targetServings = Math.max(
                    1,
                    Math.round(recipe.baseServings * factor)
                  );
                  const isSelected = servings === targetServings;
                  return (
                    <button
                      key={factor}
                      type="button"
                      onClick={() => onChangeServings(targetServings)}
                      className={`px-2.5 py-1 text-xs font-mono border cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                          : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                      }`}
                    >
                      {factor}×
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mise en Place Ingredient Checklist */}
          <ul className="divide-y divide-[var(--border-subtle)]">
            {recipe.ingredients.map((ing) => {
              const checked = checkedIngredients.includes(ing.id);
              const baseAmt =
                unitSystem === 'metric' ? ing.metricAmount : ing.imperialAmount;
              const unit =
                unitSystem === 'metric' ? ing.metricUnit : ing.imperialUnit;
              const qtyLabel = formatCulinaryQuantity(baseAmt * multiplier, unit);

              return (
                <li key={ing.id} className="py-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      playSubtleClick();
                      onToggleIngredient(ing.id);
                    }}
                    className="w-full text-left flex items-start justify-between gap-3 cursor-pointer group"
                  >
                    <span className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                          checked
                            ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                            : 'border-[var(--border-line)] bg-[var(--bg-paper)] group-hover:border-[var(--accent-primary)]'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3" strokeWidth={2.5} />}
                      </span>
                      <span
                        className={`text-sm font-serif leading-snug ${
                          checked
                            ? 'line-through text-[var(--text-muted)]/70'
                            : 'text-[var(--text-ink)]'
                        }`}
                      >
                        {ing.name}
                      </span>
                    </span>

                    <span className="font-mono text-xs text-[var(--accent-secondary)] tabular-nums whitespace-nowrap shrink-0">
                      {qtyLabel} {unit}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Persistent Kitchen Margin Notes */}
          <div className="pt-4 border-t border-[var(--border-line)] space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`note-${recipe.id}`}
                className="text-xs font-mono uppercase tracking-[0.1em] text-[var(--text-muted)]"
              >
                {t.kitchenMarginNotes}
              </label>
              {noteSavedFeedback && (
                <span className="text-[11px] font-mono text-[var(--accent-primary)]">
                  {t.savedNotice}
                </span>
              )}
            </div>
            <textarea
              id={`note-${recipe.id}`}
              rows={3}
              value={kitchenNote}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder={t.marginNotePlaceholder}
              className="w-full p-3 bg-[var(--bg-paper)] border border-[var(--border-line)] text-xs font-serif text-[var(--text-ink)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
        </aside>

        {/* Right: Step-by-Step Preparation with Embedded Interactive Timers */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-b border-[var(--border-line)] pb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)]">
                {t.stepByStepMethod}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-[var(--text-ink)] mt-0.5">
                {t.preparationTimersTitle}
              </h2>
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
              {t.stepsProgress(completedSteps.length, recipe.steps.length)}
            </p>
          </div>

          <ol className="space-y-6">
            {recipe.steps.map((step) => {
              const isDone = completedSteps.includes(step.stepNumber);
              const linkedClip = step.techniqueClipId
                ? recipe.techniques.find((tClip) => tClip.id === step.techniqueClipId)
                : undefined;

              const timerId = `${recipe.id}:${step.stepNumber}`;
              const activeTimer = timers.find((timer) => timer.id === timerId);

              return (
                <li
                  key={step.stepNumber}
                  className={`border p-5 sm:p-6 transition-colors ${
                    isDone
                      ? 'bg-[var(--bg-surface)]/65 border-[var(--border-line)]'
                      : 'bg-[var(--bg-paper)] border-[var(--border-line)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          playSubtleClick();
                          onToggleStepComplete(step.stepNumber);
                        }}
                        aria-label={t.markStepCompleteAria(step.stepNumber)}
                        className={`w-7 h-7 border font-mono text-xs flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                          isDone
                            ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                            : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-ink)] hover:border-[var(--accent-primary)]'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : `0${step.stepNumber}`}
                      </button>
                      <h3
                        className={`font-display text-xl ${
                          isDone
                            ? 'line-through text-[var(--text-muted)]'
                            : 'text-[var(--text-ink)]'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {step.durationSeconds && (
                      <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums shrink-0">
                        {formatMinutesLabel(step.durationSeconds)}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-[15px] font-serif leading-[1.75] text-[var(--text-ink)]/90">
                    {step.instruction}
                  </p>

                  {step.tip && (
                    <p className="mt-3 pt-3 border-t border-[var(--border-subtle)] text-xs font-serif italic text-[var(--text-muted)]">
                      {t.chefsNotePrefix} {step.tip}
                    </p>
                  )}

                  {/* Interactive Timer & Linked Prep Clip Controls */}
                  <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                    {step.durationSeconds ? (
                      activeTimer ? (
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className={`font-mono text-base font-medium tabular-nums px-2.5 py-1 border ${
                              activeTimer.status === 'completed'
                                ? 'bg-[var(--accent-secondary)] border-[var(--accent-secondary)] text-[var(--accent-primary-fg)]'
                                : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--accent-primary)]'
                            }`}
                          >
                            {activeTimer.status === 'completed'
                              ? t.doneLabel
                              : formatCountdown(activeTimer.remainingSeconds)}
                          </span>

                          {activeTimer.status === 'running' ? (
                            <button
                              type="button"
                              onClick={() => onPauseTimer(activeTimer.id)}
                              className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono inline-flex items-center gap-1 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <Pause className="w-3 h-3" />
                              {t.pause}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                onStartTimer({
                                  recipeId: recipe.id,
                                  recipeTitle: recipe.title,
                                  stepNumber: step.stepNumber,
                                  label: step.timerLabel || step.title,
                                  durationSeconds: step.durationSeconds!,
                                })
                              }
                              className="px-3 py-1.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-1 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <Play className="w-3 h-3" />
                              {activeTimer.status === 'completed' ? t.restart : t.resume}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onAddMinute(activeTimer.id)}
                            className="px-2.5 py-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono inline-flex items-center gap-0.5 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                            1m
                          </button>

                          <button
                            type="button"
                            onClick={() => onResetTimer(activeTimer.id)}
                            aria-label={t.restart}
                            className="p-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            onStartTimer({
                              recipeId: recipe.id,
                              recipeTitle: recipe.title,
                              stepNumber: step.stepNumber,
                              label: step.timerLabel || step.title,
                              durationSeconds: step.durationSeconds!,
                            })
                          }
                          className="px-3.5 py-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--bg-paper)] hover:bg-[var(--accent-primary)] hover:text-[var(--accent-primary-fg)] transition-colors text-xs font-mono inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {t.startTimerLabel(formatCountdown(step.durationSeconds))}
                        </button>
                      )
                    ) : (
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        {t.untimedPrepStep}
                      </span>
                    )}

                    {linkedClip && (
                      <button
                        type="button"
                        onClick={() => onOpenClip(linkedClip, recipe.title)}
                        className="text-xs font-mono text-[var(--accent-secondary)] hover:text-[var(--text-ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <PlayCircle className="w-4 h-4" />
                        {t.watchClipPrefix(linkedClip.title)}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Bottom Book Page Turn Footer */}
      <nav
        aria-label="Book page pagination"
        className="pt-8 border-t border-[var(--border-line)] flex items-center justify-between gap-4"
      >
        {prevRecipe ? (
          <button
            type="button"
            onClick={() => onSelectRecipe(prevRecipe.id)}
            className="text-left group cursor-pointer max-w-xs"
          >
            <span className="text-xs font-mono text-[var(--text-muted)] inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              {t.previousPlate}
            </span>
            <p className="font-display text-base text-[var(--text-ink)] group-hover:text-[var(--accent-primary)] truncate mt-0.5">
              {prevRecipe.title}
            </p>
          </button>
        ) : (
          <div />
        )}

        <span className="hidden sm:inline text-xs font-mono text-[var(--text-muted)] tabular-nums">
          {t.plateOfTotal(currentIndex + 1, allRecipes.length)}
        </span>

        {nextRecipe ? (
          <button
            type="button"
            onClick={() => onSelectRecipe(nextRecipe.id)}
            className="text-right group cursor-pointer max-w-xs"
          >
            <span className="text-xs font-mono text-[var(--text-muted)] inline-flex items-center gap-1">
              {t.nextPlate}
              <ArrowRight className="w-3 h-3" />
            </span>
            <p className="font-display text-base text-[var(--text-ink)] group-hover:text-[var(--accent-primary)] truncate mt-0.5">
              {nextRecipe.title}
            </p>
          </button>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
