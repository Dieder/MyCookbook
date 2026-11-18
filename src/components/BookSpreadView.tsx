import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  CalendarDays,
  CalendarPlus,
  Check,
  Clock,
  ListChecks,
  Pause,
  Play,
  PlayCircle,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  Users,
  Utensils,
  Wand2,
  X,
} from 'lucide-react';
import {
  formatPersonLabel,
  UI_STRINGS,
} from '../i18n/translations';
import {
  ActiveTimer,
  Chapter,
  LanguageCode,
  MealCalendarEntry,
  Recipe,
  RecipeRating,
  TechniqueClip,
  UnitSystem,
} from '../types/cookbook';
import {
  formatCountdown,
  formatCulinaryQuantity,
  formatMinutesLabel,
  playSubtleClick,
} from '../utils/formatters';
import {
  addDaysLocal,
  formatLocalDateKey,
  getIntlLocale,
  getTodayDateKey,
} from '../utils/calendar';
import { StoryMarkupRenderer } from '../utils/storyMarkup';
import { resolveRecipeClips, resolveStepClip } from '../utils/youtube';
import { EditorialPlateImage } from './EditorialPlateImage';

interface BookSpreadViewProps {
  recipe: Recipe;
  allRecipes: Recipe[];
  chapters: Chapter[];
  onSelectRecipe: (recipeId: string) => void;
  onBackToChapters: () => void;
  onSelectChapter?: (chapterId: string) => void;
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
  ratings: RecipeRating[];
  currentUserUid: string | null;
  onSaveRating: (rating: number, note: string, existingId?: string) => Promise<void>;
  onDeleteRating: (ratingId: string) => Promise<void>;
  onAddToCalendar: (dateKey: string) => Promise<void>;
  scheduledEntries?: MealCalendarEntry[];
  onRemoveCalendarEntry?: (entryId: string) => Promise<void>;
  onOpenCalendar?: () => void;
  onGoToSettings: () => void;
  lang: LanguageCode;
}

export function BookSpreadView({
  recipe,
  allRecipes,
  chapters,
  onSelectRecipe,
  onBackToChapters,
  onSelectChapter,
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
  ratings,
  currentUserUid,
  onSaveRating,
  onDeleteRating,
  onAddToCalendar,
  scheduledEntries = [],
  onRemoveCalendarEntry,
  onOpenCalendar,
  onGoToSettings,
  lang,
}: BookSpreadViewProps) {
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [calendarBarOpen, setCalendarBarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState<string>(() => getTodayDateKey());
  const [savingCalendar, setSavingCalendar] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const t = UI_STRINGS[lang];
  const locale = getIntlLocale(lang);

  const nextSevenDays = useMemo(() => {
    const today = new Date();
    const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const dayFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
    return Array.from({ length: 7 }, (_, idx) => {
      const d = addDaysLocal(today, idx);
      return {
        dateKey: formatLocalDateKey(d),
        weekday: weekdayFmt.format(d),
        shortDate: dayFmt.format(d),
        isToday: idx === 0,
      };
    });
  }, [locale]);

  const scheduledDateSet = useMemo(
    () => new Set(scheduledEntries.map((e) => e.date)),
    [scheduledEntries]
  );

  const selectedScheduledEntry = useMemo(
    () => scheduledEntries.find((e) => e.date === calendarDate),
    [scheduledEntries, calendarDate]
  );

  const myRating = currentUserUid
    ? ratings.find((r) => r.ownerId === currentUserUid)
    : undefined;
  const [draftStars, setDraftStars] = useState<number>(myRating?.rating ?? 5);
  const [draftOneLiner, setDraftOneLiner] = useState<string>(myRating?.note ?? '');
  const [savingRating, setSavingRating] = useState(false);

  useEffect(() => {
    setDraftStars(myRating?.rating ?? 5);
    setDraftOneLiner(myRating?.note ?? '');
  }, [recipe.id, myRating?.id, myRating?.rating, myRating?.note]);

  useEffect(() => {
    setCalendarBarOpen(false);
    setCalendarError(null);
  }, [recipe.id]);

  const legacyChapterFallback: Record<string, string> = {
    'hearth-harvest': 'comfort-food',
    'coastal-market': 'dinner',
    'orchard-patisserie': 'desserts',
  };
  const chapter =
    chapters.find((c) => c.id === recipe.chapterId) ??
    chapters.find((c) => c.id === legacyChapterFallback[recipe.chapterId]);
  const parentChapter = chapter?.parentChapterId
    ? chapters.find((c) => c.id === chapter.parentChapterId)
    : undefined;
  const currentIndex = allRecipes.findIndex((r) => r.id === recipe.id);
  const prevRecipe = currentIndex > 0 ? allRecipes[currentIndex - 1] : null;
  const nextRecipe =
    currentIndex >= 0 && currentIndex < allRecipes.length - 1
      ? allRecipes[currentIndex + 1]
      : null;

  const multiplier = servings / recipe.baseServings;
  const availableClips = resolveRecipeClips(recipe);

  const handleNoteChange = (val: string) => {
    onSaveKitchenNote(val);
    setNoteSavedFeedback(true);
    window.setTimeout(() => setNoteSavedFeedback(false), 1200);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 sm:py-10 space-y-14">
      {/* Top Book Folio Navigation Strip */}
      <div className="pb-5 border-b border-[var(--border-line)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
          <button
            type="button"
            onClick={onBackToChapters}
            className="inline-flex items-center gap-1.5 hover:text-[var(--text-ink)] cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.allChapters}
          </button>
          {parentChapter && (
            <>
              <span aria-hidden="true">/</span>
              {onSelectChapter ? (
                <button
                  type="button"
                  onClick={() => onSelectChapter(parentChapter.id)}
                  className="hover:text-[var(--text-ink)] cursor-pointer whitespace-nowrap shrink-0"
                >
                  {parentChapter.title}
                </button>
              ) : (
                <span>{parentChapter.title}</span>
              )}
            </>
          )}
          <span aria-hidden="true">/</span>
          {chapter && onSelectChapter ? (
            <button
              type="button"
              onClick={() => onSelectChapter(chapter.id)}
              className="text-[var(--accent-secondary)] hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              {chapter.title}
            </button>
          ) : (
            <span className="text-[var(--accent-secondary)]">
              {chapter ? chapter.title : recipe.chapterId}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToSection('recipe-ingredients')}
            title={t.ingredientsAndScaling}
            aria-label={t.ingredientsAndScaling}
            className="w-9 h-9 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-ink)] inline-flex items-center justify-center hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer shrink-0"
          >
            <ListChecks className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('recipe-method')}
            title={t.openBookSpread}
            aria-label={t.openBookSpread}
            className="w-9 h-9 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-ink)] inline-flex items-center justify-center hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenCustomize}
            title={t.customizeWithAi}
            aria-label={t.customizeWithAi}
            className="w-9 h-9 border border-[var(--accent-primary)] bg-[var(--bg-paper)] text-[var(--accent-primary)] inline-flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-[var(--accent-primary-fg)] transition-colors cursor-pointer shrink-0"
          >
            <Wand2 className="w-4 h-4" />
          </button>

          {onRevertCustomization && (
            <button
              type="button"
              onClick={onRevertCustomization}
              title={t.originalVersion}
              aria-label={t.originalVersion}
              className="w-9 h-9 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)] inline-flex items-center justify-center hover:text-[var(--text-ink)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {onDeleteRecipe && (
            <button
              type="button"
              onClick={onDeleteRecipe}
              title={t.deleteRecipeAria}
              aria-label={t.deleteRecipeAria}
              className="w-9 h-9 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)] inline-flex items-center justify-center hover:text-[var(--accent-secondary)] hover:border-[var(--accent-secondary)] transition-colors cursor-pointer shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playSubtleClick();
              onToggleFavorite();
            }}
            title={isFavorite ? t.bookmarked : t.bookmark}
            aria-label={isFavorite ? t.bookmarked : t.bookmark}
            className={`w-9 h-9 border inline-flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
              isFavorite
                ? 'bg-[var(--accent-soft)] border-[var(--accent-secondary)] text-[var(--accent-secondary)]'
                : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] hover:border-[var(--accent-primary)]'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            onClick={() => {
              setCalendarError(null);
              setCalendarBarOpen((prev) => !prev);
            }}
            title={t.addToCalendarBtn}
            aria-label={t.addToCalendarBtn}
            className={`h-9 border inline-flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 tabular-nums ${
              scheduledEntries.length > 0 ? 'px-2.5' : 'w-9'
            } ${
              calendarBarOpen || scheduledEntries.length > 0
                ? 'bg-[var(--accent-soft)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] hover:border-[var(--accent-primary)]'
            }`}
          >
            <CalendarPlus className="w-4 h-4" />
            {scheduledEntries.length > 0 && (
              <span className="text-[11px] font-mono">{scheduledEntries.length}</span>
            )}
          </button>

          <button
            type="button"
            onClick={onEnterCookMode}
            className="h-9 px-3.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
          >
            <Utensils className="w-3.5 h-3.5" />
            {t.startCookMode}
          </button>
        </div>
      </div>

      {/* Always-visible scheduled dates bar when recipe is on user's calendar */}
      {currentUserUid && scheduledEntries.length > 0 && (
        <div className="border border-[var(--border-line)] bg-[var(--bg-surface)] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono">
            <span className="text-[var(--accent-secondary)] uppercase tracking-[0.1em]">
              {t.navCalendar}:
            </span>
            {scheduledEntries.map((entry) => (
              <span
                key={entry.id}
                className="inline-flex items-center gap-1.5 text-[var(--text-ink)] tabular-nums"
              >
                <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>{entry.date}</span>
                {onRemoveCalendarEntry && (
                  <button
                    type="button"
                    disabled={savingCalendar}
                    onClick={async () => {
                      setCalendarError(null);
                      setSavingCalendar(true);
                      try {
                        await onRemoveCalendarEntry(entry.id);
                      } catch (err: unknown) {
                        setCalendarError(
                          err instanceof Error ? err.message : 'Unable to remove calendar entry.'
                        );
                      } finally {
                        setSavingCalendar(false);
                      }
                    }}
                    aria-label={`${t.removeFromCalendarAria} (${entry.date})`}
                    title={t.removeFromCalendarAria}
                    className="p-0.5 text-[var(--text-muted)] hover:text-[var(--accent-secondary)] disabled:opacity-40 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {onOpenCalendar && (
            <button
              type="button"
              onClick={onOpenCalendar}
              className="text-xs font-mono text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              {t.navCalendar}
            </button>
          )}
        </div>
      )}

      {/* Inline Schedule-to-Calendar Bar */}
      {calendarBarOpen && (
        <div className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-4 sm:p-5 space-y-4">
          {currentUserUid ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                <span className="text-xs font-mono uppercase tracking-[0.1em] text-[var(--accent-secondary)]">
                  {t.nextSevenDaysTitle}
                </span>
                {onOpenCalendar && (
                  <button
                    type="button"
                    onClick={onOpenCalendar}
                    className="text-xs font-mono text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    {t.navCalendar}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {nextSevenDays.map((day) => {
                  const isSelected = calendarDate === day.dateKey;
                  const isAlreadyScheduled = scheduledDateSet.has(day.dateKey);
                  return (
                    <button
                      key={day.dateKey}
                      type="button"
                      onClick={() => {
                        setCalendarError(null);
                        setCalendarDate(day.dateKey);
                      }}
                      className={`px-2.5 py-2 border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                          : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-ink)] hover:border-[var(--accent-primary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-mono tracking-wide capitalize">
                          {day.isToday ? t.todayLabel : day.weekday}
                        </span>
                        {isAlreadyScheduled && <Check className="w-3 h-3 shrink-0" />}
                      </div>
                      <p className="text-xs font-mono tabular-nums mt-0.5 opacity-90">
                        {day.shortDate}
                      </p>
                    </button>
                  );
                })}
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!calendarDate || savingCalendar) return;
                  setCalendarError(null);
                  setSavingCalendar(true);
                  try {
                    await onAddToCalendar(calendarDate);
                  } catch (err: unknown) {
                    setCalendarError(
                      err instanceof Error ? err.message : 'Unable to save calendar date.'
                    );
                  } finally {
                    setSavingCalendar(false);
                  }
                }}
                className="flex flex-wrap items-center justify-between gap-3 pt-1"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor={`calendar-date-${recipe.id}`}
                    className="text-xs font-mono uppercase tracking-[0.1em] text-[var(--accent-secondary)]"
                  >
                    {t.addToCalendarDateLabel}
                  </label>
                  <input
                    id={`calendar-date-${recipe.id}`}
                    type="date"
                    required
                    value={calendarDate}
                    onChange={(e) => {
                      setCalendarError(null);
                      setCalendarDate(e.target.value);
                    }}
                    className="px-3 py-1.5 bg-[var(--bg-paper)] border border-[var(--border-line)] text-xs font-mono tabular-nums text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="submit"
                    disabled={savingCalendar || !calendarDate}
                    className="px-4 py-1.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono hover:opacity-90 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    {t.confirmAddToCalendarBtn}
                  </button>
                  {selectedScheduledEntry && onRemoveCalendarEntry && (
                    <button
                      type="button"
                      disabled={savingCalendar}
                      onClick={async () => {
                        setCalendarError(null);
                        setSavingCalendar(true);
                        try {
                          await onRemoveCalendarEntry(selectedScheduledEntry.id);
                        } catch (err: unknown) {
                          setCalendarError(
                            err instanceof Error ? err.message : 'Unable to remove calendar entry.'
                          );
                        } finally {
                          setSavingCalendar(false);
                        }
                      }}
                      className="px-3 py-1.5 border border-[var(--accent-secondary)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--accent-secondary)] hover:bg-[var(--accent-soft)] disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t.removeFromCalendarAria}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setCalendarBarOpen(false)}
                    className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer whitespace-nowrap"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>

              {calendarError && (
                <p className="text-xs font-serif text-[var(--accent-secondary)]">
                  {calendarError}
                </p>
              )}
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3 w-full">
              <p className="text-sm font-serif text-[var(--text-muted)]">
                {t.calendarSignInPrompt}
              </p>
              <button
                type="button"
                onClick={onGoToSettings}
                className="px-4 py-1.5 border border-[var(--accent-primary)] text-[var(--accent-primary)] text-xs font-mono hover:bg-[var(--accent-primary)] hover:text-[var(--accent-primary-fg)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {t.goToSettings}
              </button>
            </div>
          )}
        </div>
      )}

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

          {/* Preparation Technique Video Clips Shelf (hidden if no clips exist) */}
          {availableClips.length > 0 && (
            <div className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-5 space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5">
                <p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)]">
                  {t.preparationClips}
                </p>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {t.visualStudiesCount(availableClips.length)}
                </span>
              </div>

              <div className="space-y-2.5">
                {availableClips.map((clip) => (
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
                      {clip.videoUrl
                        ? t.youtubeClipHint
                        : `0:${String(clip.durationSeconds).padStart(2, '0')}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Folio Story Column */}
        <div className="lg:col-span-6 lg:pl-6 lg:border-l lg:border-[var(--border-subtle)] space-y-6 max-w-[65ch]">
          <div className="space-y-2.5">
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
              <StoryMarkupRenderer
                key={idx}
                text={para}
                enableDropCap={idx === 0}
              />
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
        <aside
          id="recipe-ingredients"
          className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-line)] p-6 sm:p-7 space-y-6 scroll-mt-24"
        >
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
        <div id="recipe-method" className="lg:col-span-7 space-y-6 scroll-mt-24">
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
              const linkedClip = resolveStepClip(step, recipe);

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

      {/* Reader Ratings & Quoted One-Liner Notes (Bottom of Recipe) */}
      <section className="pt-10 border-t border-[var(--border-line)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)]">
              {t.ratingsEyebrow}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-[var(--text-ink)] mt-0.5">
              {t.ratingsTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
            {ratings.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[var(--accent-secondary)] font-medium">
                <Star className="w-3.5 h-3.5" fill="currentColor" />
                {(
                  ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
                ).toFixed(1)}
              </span>
            )}
            <span>{t.ratingsCountLabel(ratings.length)}</span>
          </div>
        </div>

        {/* Rating & One-Liner Form */}
        {currentUserUid ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (savingRating) return;
              setSavingRating(true);
              try {
                await onSaveRating(
                  draftStars,
                  draftOneLiner.replace(/[\r\n]+/g, ' ').trim(),
                  myRating?.id
                );
              } finally {
                setSavingRating(false);
              }
            }}
            className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-mono uppercase tracking-[0.1em] text-[var(--text-muted)]">
                {t.yourRatingLabel}
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const active = starVal <= draftStars;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setDraftStars(starVal)}
                      aria-label={`${starVal} / 5`}
                      className={`p-1 cursor-pointer transition-colors ${
                        active
                          ? 'text-[var(--accent-secondary)]'
                          : 'text-[var(--text-muted)]/40 hover:text-[var(--text-ink)]'
                      }`}
                    >
                      <Star
                        className="w-5 h-5"
                        fill={active ? 'currentColor' : 'none'}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label
                  htmlFor={`rating-note-${recipe.id}`}
                  className="sr-only"
                >
                  {t.oneLinerLabel}
                </label>
                <input
                  id={`rating-note-${recipe.id}`}
                  type="text"
                  maxLength={140}
                  value={draftOneLiner}
                  onChange={(e) =>
                    setDraftOneLiner(e.target.value.replace(/[\r\n]+/g, ' '))
                  }
                  placeholder={t.oneLinerPlaceholder}
                  className="w-full px-3.5 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="submit"
                  disabled={savingRating}
                  className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono hover:opacity-90 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {myRating ? t.updateRatingBtn : t.submitRatingBtn}
                </button>
                {myRating && (
                  <button
                    type="button"
                    onClick={() => void onDeleteRating(myRating.id)}
                    className="px-3 py-2 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-secondary)] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {t.removeRatingBtn}
                  </button>
                )}
              </div>
            </div>
          </form>
        ) : (
          <div className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-serif text-[var(--text-muted)]">
              {t.signInToRatePrompt}
            </p>
            <button
              type="button"
              onClick={onGoToSettings}
              className="px-4 py-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] text-xs font-mono hover:bg-[var(--accent-primary)] hover:text-[var(--accent-primary-fg)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {t.goToSettings}
            </button>
          </div>
        )}

        {/* Submitted Ratings & Quoted One-Liners */}
        {ratings.length === 0 ? (
          <p className="text-sm font-serif italic text-[var(--text-muted)]">
            {t.noRatingsYet}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratings.map((item) => (
              <article
                key={item.id}
                className="border border-[var(--border-line)] bg-[var(--bg-surface)]/70 p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0.5 text-[var(--accent-secondary)]">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className="w-3.5 h-3.5"
                        fill={n <= item.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)] truncate">
                    {item.authorName}
                  </span>
                </div>
                {item.note && (
                  <p className="font-serif italic text-base text-[var(--text-ink)] leading-snug">
                    “{item.note}”
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
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
