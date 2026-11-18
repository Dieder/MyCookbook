import { useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  Copy,
  Eye,
  EyeOff,
  RotateCcw,
  ShoppingBasket,
} from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import {
  LanguageCode,
  MealCalendarEntry,
  MealSlot,
  Recipe,
  ShoppingCategory,
  ShoppingDateWindow,
  UnitSystem,
} from '../types/cookbook';
import { getIntlLocale } from '../utils/calendar';
import {
  SHOPPING_CATEGORY_ORDER,
  aggregateShoppingList,
  formatShoppingListAsText,
} from '../utils/shoppingList';

interface ShoppingListPageProps {
  isSignedIn: boolean;
  entries: MealCalendarEntry[];
  recipes: Recipe[];
  servingsMap: Record<string, number>;
  unitSystem: UnitSystem;
  windowType: ShoppingDateWindow;
  onChangeWindow: (w: ShoppingDateWindow) => void;
  checkedKeys: string[];
  onToggleChecked: (key: string) => void;
  onUncheckAll: () => void;
  onOpenCalendar: () => void;
  onSelectRecipe: (recipeId: string) => void;
  onSignIn: () => void;
  lang: LanguageCode;
}

export function ShoppingListPage({
  isSignedIn,
  entries,
  recipes,
  servingsMap,
  unitSystem,
  windowType,
  onChangeWindow,
  checkedKeys,
  onToggleChecked,
  onUncheckAll,
  onOpenCalendar,
  onSelectRecipe,
  onSignIn,
  lang,
}: ShoppingListPageProps) {
  const t = UI_STRINGS[lang];
  const locale = getIntlLocale(lang);
  const [hideChecked, setHideChecked] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  const checkedSet = useMemo(() => new Set(checkedKeys), [checkedKeys]);

  const { items, plannedEntries, startKey, endKey } = useMemo(
    () =>
      aggregateShoppingList({
        entries,
        recipes,
        servingsMap,
        unitSystem,
        windowType,
        lang,
      }),
    [entries, recipes, servingsMap, unitSystem, windowType, lang]
  );

  const categoryLabels: Record<ShoppingCategory, string> = useMemo(
    () => ({
      produce: t.catProduce,
      'meat-fish': t.catMeatFish,
      dairy: t.catDairy,
      bakery: t.catBakery,
      pantry: t.catPantry,
      other: t.catOther,
    }),
    [t]
  );

  const slotLabel = (slot: MealSlot): string => {
    if (slot === 'breakfast') return t.slotBreakfast;
    if (slot === 'lunch') return t.slotLunch;
    if (slot === 'snack') return t.slotSnack;
    return t.slotDinner;
  };

  const formatShortDay = (dateKey: string): string => {
    const [y, m, d] = dateKey.split('-').map(Number);
    if (!y || !m || !d) return dateKey;
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
      new Date(y, m - 1, d)
    );
  };

  const checkedCount = useMemo(
    () => items.filter((item) => checkedSet.has(item.key)).length,
    [items, checkedSet]
  );

  const visibleItems = useMemo(
    () => (hideChecked ? items.filter((i) => !checkedSet.has(i.key)) : items),
    [items, hideChecked, checkedSet]
  );

  const groupedItems = useMemo(() => {
    return SHOPPING_CATEGORY_ORDER.map((category) => ({
      category,
      label: categoryLabels[category],
      items: visibleItems.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0);
  }, [visibleItems, categoryLabels]);

  const handleCopyList = async () => {
    const text = formatShoppingListAsText(items, categoryLabels, checkedSet);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFeedback(true);
      window.setTimeout(() => setCopiedFeedback(false), 2200);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-10 sm:py-12 space-y-8">
      {/* Editorial Header */}
      <header className="pb-6 border-b border-[var(--border-line)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
            {t.shoppingEyebrow}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--text-ink)]">
            {t.shoppingTitle}
          </h1>
          <p className="font-serif text-sm sm:text-base text-[var(--text-muted)] max-w-2xl">
            {t.shoppingSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCalendar}
          className="px-4 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] hover:border-[var(--accent-primary)] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <CalendarDays className="w-4 h-4 text-[var(--accent-secondary)]" />
          <span>{t.shoppingOpenCalendarBtn}</span>
        </button>
      </header>

      {/* Sign-in Prompt if not signed in */}
      {!isSignedIn && (
        <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="font-serif text-sm sm:text-base text-[var(--text-ink)]">
            {t.calendarSignInPrompt}
          </p>
          <button
            type="button"
            onClick={onSignIn}
            className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
          >
            {t.signInGoogle}
          </button>
        </section>
      )}

      {/* Window Filter & Progress Toolbar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: '7d' as const, label: t.shoppingWindow7d },
              { id: '14d' as const, label: t.shoppingWindow14d },
              { id: 'month' as const, label: t.shoppingWindowMonth },
            ]
          ).map((opt) => {
            const active = windowType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeWindow(opt.id)}
                className={`px-3.5 py-2 border text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                    : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-ink)] hover:border-[var(--accent-primary)]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
          <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums ml-1">
            {startKey} → {endKey}
          </span>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[var(--accent-secondary)] tabular-nums mr-1">
              {t.shoppingSourceSummary(plannedEntries.length)} ·{' '}
              {t.shoppingProgress(checkedCount, items.length)}
            </span>

            <button
              type="button"
              onClick={() => setHideChecked((prev) => !prev)}
              className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] hover:border-[var(--accent-primary)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {hideChecked ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
              <span>{hideChecked ? t.shoppingShowChecked : t.shoppingHideChecked}</span>
            </button>

            {checkedCount > 0 && (
              <button
                type="button"
                onClick={onUncheckAll}
                className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:border-[var(--accent-primary)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.shoppingUncheckAll}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => void handleCopyList()}
              className="px-3 py-1.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer whitespace-nowrap"
            >
              {copiedFeedback ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>
                {copiedFeedback ? t.shoppingCopiedToast : t.shoppingCopyList}
              </span>
            </button>
          </div>
        )}
      </section>

      {/* Empty State or Categorized Shopping Columns */}
      {items.length === 0 ? (
        <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-8 sm:p-12 text-center space-y-4">
          <ShoppingBasket className="w-8 h-8 mx-auto text-[var(--accent-secondary)]" />
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="font-display text-2xl text-[var(--text-ink)]">
              {t.shoppingEmptyTitle}
            </h2>
            <p className="font-serif text-sm text-[var(--text-muted)] leading-relaxed">
              {t.shoppingEmptyHint}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCalendar}
            className="px-5 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            <span>{t.shoppingOpenCalendarBtn}</span>
          </button>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groupedItems.map((group) => (
            <section
              key={group.category}
              className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-5 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                <h2 className="font-display text-xl text-[var(--text-ink)]">
                  {group.label}
                </h2>
                <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                  {group.items.length}
                </span>
              </div>

              <ul className="divide-y divide-[var(--border-subtle)]">
                {group.items.map((item) => {
                  const isChecked = checkedSet.has(item.key);
                  return (
                    <li key={item.key} className="py-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleChecked(item.key)}
                        className="w-full min-h-[44px] py-1.5 text-left flex items-start gap-3 cursor-pointer group"
                      >
                        <span
                          className={`mt-0.5 w-5 h-5 border inline-flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                              : 'bg-[var(--bg-paper)] border-[var(--border-line)] group-hover:border-[var(--accent-primary)]'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </span>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div
                            className={`flex items-baseline justify-between gap-3 ${
                              isChecked ? 'line-through opacity-50' : ''
                            }`}
                          >
                            <span className="font-serif text-sm sm:text-base text-[var(--text-ink)] leading-snug">
                              {item.name}
                            </span>
                            <span className="font-mono text-xs sm:text-sm font-medium text-[var(--accent-primary)] tabular-nums whitespace-nowrap shrink-0">
                              {item.formattedAmount}
                            </span>
                          </div>

                          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
                            {item.sources
                              .slice(0, 3)
                              .map(
                                (src) =>
                                  `${formatShortDay(src.date)} ${slotLabel(src.mealSlot)} · ${src.recipeTitle}`
                              )
                              .join(' · ')}
                            {item.sources.length > 3 ? ` +${item.sources.length - 3}` : ''}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      {/* Planned Meals Reference Strip */}
      {plannedEntries.length > 0 && (
        <section className="border-t border-[var(--border-line)] pt-5 space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)]">
            {t.shoppingSourceSummary(plannedEntries.length)}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-serif text-[var(--text-muted)]">
            {plannedEntries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => onSelectRecipe(entry.recipeId)}
                className="hover:text-[var(--accent-primary)] hover:underline cursor-pointer text-left"
              >
                <span className="font-mono text-[11px] text-[var(--accent-secondary)] mr-1">
                  {formatShortDay(entry.date)} {slotLabel(entry.mealSlot)}:
                </span>
                {entry.recipeTitle}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
