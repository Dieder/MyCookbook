import { useMemo, useState } from 'react';
import { Clock, Minus, Plus, Search, Users, UtensilsCrossed, X } from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import { Chapter, LanguageCode, MealSlot, Recipe } from '../types/cookbook';
import { addDaysLocal, formatLocalDateKey, getIntlLocale } from '../utils/calendar';

export interface CalendarPickerInitial {
  mode: 'add' | 'swap';
  entryId?: string;
  dateKey: string;
  mealSlot: MealSlot;
  servings?: number;
  currentRecipeId?: string;
}

interface CalendarMealPickerModalProps {
  initial: CalendarPickerInitial | null;
  recipes: Recipe[];
  chapters: Chapter[];
  onClose: () => void;
  onConfirm: (payload: {
    mode: 'add' | 'swap';
    entryId?: string;
    dateKey: string;
    mealSlot: MealSlot;
    servings: number;
    recipe: Recipe;
  }) => Promise<void>;
  lang: LanguageCode;
}

export function CalendarMealPickerModal({
  initial,
  recipes,
  chapters,
  onClose,
  onConfirm,
  lang,
}: CalendarMealPickerModalProps) {
  const t = UI_STRINGS[lang];
  const locale = getIntlLocale(lang);

  const [dateKey, setDateKey] = useState<string>(initial?.dateKey ?? '');
  const [mealSlot, setMealSlot] = useState<MealSlot>(initial?.mealSlot ?? 'dinner');
  const [servings, setServings] = useState<number>(initial?.servings ?? 4);
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [query, setQuery] = useState<string>('');
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const quickDates = useMemo(() => {
    const today = new Date();
    const fmt = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDaysLocal(today, i);
      return {
        key: formatLocalDateKey(d),
        label: fmt.format(d),
      };
    });
  }, [locale]);

  const filteredRecipes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes
      .filter((r) => {
        if (chapterFilter !== 'all' && r.chapterId !== chapterFilter) return false;
        if (!q) return true;
        return (
          r.title.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          r.ingredients.some((i) => i.name.toLowerCase().includes(q))
        );
      })
      .slice(0, 48);
  }, [recipes, chapterFilter, query]);

  if (!initial) return null;

  const slotOptions: Array<{ id: MealSlot; label: string }> = [
    { id: 'breakfast', label: t.slotBreakfast },
    { id: 'lunch', label: t.slotLunch },
    { id: 'dinner', label: t.slotDinner },
    { id: 'snack', label: t.slotSnack },
  ];

  const handlePick = async (recipe: Recipe) => {
    if (submittingId) return;
    setSubmittingId(recipe.id);
    try {
      await onConfirm({
        mode: initial.mode,
        entryId: initial.entryId,
        dateKey,
        mealSlot,
        servings: Math.max(1, Math.min(48, servings)),
        recipe,
      });
      onClose();
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={initial.mode === 'swap' ? t.swapDishTitle : t.planMealTitle}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 sm:p-4"
    >
      <div className="w-full sm:max-w-2xl max-h-[90vh] bg-[var(--bg-paper)] border border-[var(--border-line)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-line)] bg-[var(--bg-surface)] flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
              {t.navCalendar}
            </p>
            <h2 className="font-display text-2xl text-[var(--text-ink)]">
              {initial.mode === 'swap' ? t.swapDishTitle : t.planMealTitle}
            </h2>
            <p className="text-xs font-serif text-[var(--text-muted)] mt-0.5">
              {t.selectDishHint}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeModalAria}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date, Meal Slot & Servings Controls */}
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-paper)] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Date picker */}
            {initial.mode === 'add' ? (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={dateKey}
                  onChange={(e) => setDateKey(e.target.value)}
                  className="px-2.5 py-1.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
                <div className="hidden sm:flex items-center gap-1 overflow-x-auto">
                  {quickDates.slice(0, 4).map((qd) => (
                    <button
                      key={qd.key}
                      type="button"
                      onClick={() => setDateKey(qd.key)}
                      className={`px-2 py-1 border text-[11px] font-mono cursor-pointer whitespace-nowrap ${
                        dateKey === qd.key
                          ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                          : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                      }`}
                    >
                      {qd.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                {dateKey}
              </span>
            )}

            {/* Servings stepper */}
            <div className="inline-flex items-center border border-[var(--border-line)] bg-[var(--bg-surface)]">
              <button
                type="button"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                aria-label={t.decreasePersonsAria}
                className="w-8 h-8 inline-flex items-center justify-center text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 inline-flex items-center gap-1 text-xs font-mono tabular-nums text-[var(--text-ink)]">
                <Users className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                {servings}
              </span>
              <button
                type="button"
                onClick={() => setServings((s) => Math.min(24, s + 1))}
                aria-label={t.increasePersonsAria}
                className="w-8 h-8 inline-flex items-center justify-center text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Meal slot selector */}
          <div className="grid grid-cols-4 gap-1.5">
            {slotOptions.map((slot) => {
              const active = mealSlot === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setMealSlot(slot.id)}
                  className={`py-2 px-2 border text-xs font-mono transition-colors cursor-pointer truncate ${
                    active
                      ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-ink)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>

          {/* Search + chapter filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchDishPlaceholder}
                className="w-full pl-9 pr-3 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-sm font-serif text-[var(--text-ink)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <select
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              aria-label={t.filterByChapterAria}
              className="px-3 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
            >
              <option value="all">{t.allCoursesLabel}</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Recipe List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredRecipes.length === 0 ? (
            <p className="py-8 text-center text-sm font-serif italic text-[var(--text-muted)]">
              {t.noMatchesTitle}
            </p>
          ) : (
            filteredRecipes.map((recipe) => {
              const isCurrent = recipe.id === initial.currentRecipeId;
              const isSaving = submittingId === recipe.id;
              return (
                <button
                  key={recipe.id}
                  type="button"
                  disabled={Boolean(submittingId)}
                  onClick={() => void handlePick(recipe)}
                  className={`w-full text-left border p-2.5 flex items-center gap-3 transition-colors cursor-pointer ${
                    isCurrent
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)]'
                      : 'border-[var(--border-line)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]'
                  } disabled:opacity-60`}
                >
                  <div className="w-14 h-14 border border-[var(--border-line)] bg-[var(--bg-elevated)] overflow-hidden shrink-0 flex items-center justify-center">
                    {recipe.heroImage ? (
                      <img
                        src={recipe.heroImage}
                        alt={recipe.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UtensilsCrossed className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-display text-base text-[var(--text-ink)] truncate">
                      {recipe.title}
                    </p>
                    <p className="font-serif text-xs text-[var(--text-muted)] truncate">
                      {recipe.subtitle}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[var(--accent-secondary)]" />
                        {recipe.prepMinutes + recipe.cookMinutes} {t.minUnit}
                      </span>
                      <span>
                        {recipe.ingredients.length} {t.ingredientsShortWord}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[var(--accent-primary)] shrink-0 pr-1">
                    {isSaving ? '...' : initial.mode === 'swap' ? t.swapDishBtn : '+'}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
