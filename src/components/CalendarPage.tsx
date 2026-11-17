import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
} from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import {
  Chapter,
  LanguageCode,
  MealCalendarEntry,
  Recipe,
} from '../types/cookbook';
import {
  addDaysLocal,
  buildMonthGrid,
  formatLocalDateKey,
  getIntlLocale,
  getMondayFirstWeekdays,
  getTodayDateKey,
} from '../utils/calendar';

interface CalendarPageProps {
  isSignedIn: boolean;
  entries: MealCalendarEntry[];
  recipes: Recipe[];
  chapters: Chapter[];
  onSelectRecipe: (recipeId: string) => void;
  onSelectChapter: (chapterId: string) => void;
  onRemoveEntry: (entryId: string) => Promise<void>;
  onSignIn: () => void;
  onGoToSettings: () => void;
  lang: LanguageCode;
}

export function CalendarPage({
  isSignedIn,
  entries,
  recipes,
  chapters,
  onSelectRecipe,
  onSelectChapter,
  onRemoveEntry,
  onSignIn,
  onGoToSettings,
  lang,
}: CalendarPageProps) {
  const t = UI_STRINGS[lang];
  const locale = getIntlLocale(lang);
  const today = useMemo(() => new Date(), []);
  const todayKey = getTodayDateKey();

  const [displayYear, setDisplayYear] = useState<number>(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState<number>(today.getMonth());

  const chapterMap = useMemo(() => {
    const map = new Map<string, Chapter>();
    for (const ch of chapters) {
      map.set(ch.id, ch);
    }
    return map;
  }, [chapters]);

  const recipeMap = useMemo(() => {
    const map = new Map<string, Recipe>();
    for (const r of recipes) {
      map.set(r.id, r);
    }
    return map;
  }, [recipes]);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, MealCalendarEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return map;
  }, [entries]);

  const nextSevenDays = useMemo(() => {
    const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    const shortDateFmt = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
    });
    return Array.from({ length: 7 }, (_, idx) => {
      const dateObj = addDaysLocal(today, idx);
      return {
        date: dateObj,
        dateKey: formatLocalDateKey(dateObj),
        weekdayLabel: weekdayFmt.format(dateObj),
        dateLabel: shortDateFmt.format(dateObj),
        isToday: idx === 0,
      };
    });
  }, [today, locale]);

  const monthCells = useMemo(
    () => buildMonthGrid(displayYear, displayMonth),
    [displayYear, displayMonth]
  );

  const weekdayHeaders = useMemo(() => getMondayFirstWeekdays(lang), [lang]);

  const activeMonthTitle = useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    }).format(new Date(displayYear, displayMonth, 1));
  }, [displayYear, displayMonth, locale]);

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayYear((y) => y - 1);
      setDisplayMonth(11);
    } else {
      setDisplayMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayYear((y) => y + 1);
      setDisplayMonth(0);
    } else {
      setDisplayMonth((m) => m + 1);
    }
  };

  const handleJumpToday = () => {
    setDisplayYear(today.getFullYear());
    setDisplayMonth(today.getMonth());
  };

  const renderCourseLink = (entry: MealCalendarEntry) => {
    const matchedRecipe = recipeMap.get(entry.recipeId);
    const courseId = matchedRecipe?.chapterId ?? entry.courseId;
    const courseChapter = chapterMap.get(courseId);
    return {
      title: matchedRecipe?.title ?? entry.recipeTitle,
      courseId,
      courseTitle: courseChapter?.title ?? courseId,
    };
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-10 sm:py-12 space-y-12">
      {/* Editorial Header */}
      <header className="pb-6 border-b border-[var(--border-line)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
            {t.calendarEyebrow}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--text-ink)]">
            {t.calendarTitle}
          </h1>
          <p className="font-serif text-sm sm:text-base text-[var(--text-muted)] max-w-2xl">
            {t.calendarSubtitle}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] tabular-nums shrink-0">
          <CalendarDays className="w-4 h-4 text-[var(--accent-secondary)]" />
          <span>{todayKey}</span>
        </div>
      </header>

      {/* Sign-in Prompt when logged out */}
      {!isSignedIn && (
        <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="font-serif text-base text-[var(--text-ink)]">
            {t.calendarSignInPrompt}
          </p>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onSignIn}
              className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
            >
              {t.signInGoogle}
            </button>
            <button
              type="button"
              onClick={onGoToSettings}
              className="px-4 py-2 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
            >
              {t.goToSettings}
            </button>
          </div>
        </section>
      )}

      {/* SECTION 1: NEXT 7 DAYS */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <h2 className="font-display text-2xl text-[var(--text-ink)]">
            {t.nextSevenDaysTitle}
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
            {nextSevenDays[0].dateLabel} — {nextSevenDays[6].dateLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nextSevenDays.map((day) => {
            const dayEntries = entriesByDate.get(day.dateKey) ?? [];

            return (
              <article
                key={day.dateKey}
                className={`border p-4 flex flex-col justify-between gap-4 transition-colors ${
                  day.isToday
                    ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-paper)] border-[var(--border-line)]'
                }`}
              >
                <div className="space-y-3">
                  {/* Day Header */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[var(--border-subtle)]">
                    <div>
                      <p className="font-display text-lg text-[var(--text-ink)] capitalize leading-tight">
                        {day.weekdayLabel}
                      </p>
                      <p className="text-xs font-mono text-[var(--text-muted)] tabular-nums mt-0.5">
                        {day.dateLabel}
                      </p>
                    </div>

                    {day.isToday && (
                      <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--accent-primary)] font-medium shrink-0">
                        {t.todayLabel}
                      </span>
                    )}
                  </div>

                  {/* Scheduled Courses */}
                  {dayEntries.length === 0 ? (
                    <p className="text-xs font-serif italic text-[var(--text-muted)]/80 py-1">
                      {t.noMealsScheduledDay}
                    </p>
                  ) : (
                    <ul className="space-y-2.5">
                      {dayEntries.map((entry) => {
                        const info = renderCourseLink(entry);
                        return (
                          <li
                            key={entry.id}
                            className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2 flex items-start justify-between gap-2"
                          >
                            <div className="min-w-0 space-y-0.5">
                              <button
                                type="button"
                                onClick={() => onSelectRecipe(entry.recipeId)}
                                className="block text-left font-serif text-sm font-medium text-[var(--text-ink)] hover:text-[var(--accent-primary)] hover:underline cursor-pointer leading-snug"
                              >
                                {info.title}
                              </button>
                              <button
                                type="button"
                                onClick={() => onSelectChapter(info.courseId)}
                                className="block text-left text-[11px] font-mono text-[var(--accent-secondary)] hover:underline cursor-pointer"
                              >
                                {info.courseTitle}
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => void onRemoveEntry(entry.id)}
                              aria-label={t.removeFromCalendarAria}
                              title={t.removeFromCalendarAria}
                              className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-secondary)] cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: MONTHLY CALENDAR VIEW */}
      <section className="space-y-5 pt-4 border-t border-[var(--border-line)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)]">
              {t.monthViewTitle}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-[var(--text-ink)] capitalize mt-0.5">
              {activeMonthTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label={t.prevMonthBtn}
              title={t.prevMonthBtn}
              className="px-3 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-ink)] hover:border-[var(--accent-primary)] text-xs font-mono inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.prevMonthBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleJumpToday}
              className="px-3.5 py-2 border border-[var(--border-line)] bg-[var(--bg-paper)] text-[var(--text-ink)] hover:border-[var(--accent-primary)] text-xs font-mono cursor-pointer whitespace-nowrap shrink-0"
            >
              {t.todayBtn}
            </button>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label={t.nextMonthBtn}
              title={t.nextMonthBtn}
              className="px-3 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-ink)] hover:border-[var(--accent-primary)] text-xs font-mono inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="hidden sm:inline">{t.nextMonthBtn}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Column Month Matrix */}
        <div className="overflow-x-auto border border-[var(--border-line)]">
          <div className="min-w-[700px]">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-[var(--border-line)] bg-[var(--bg-surface)]">
              {weekdayHeaders.map((dayName) => (
                <div
                  key={dayName}
                  className="px-3 py-2.5 text-xs font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] border-r last:border-r-0 border-[var(--border-subtle)]"
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 bg-[var(--bg-paper)]">
              {monthCells.map((cell) => {
                const cellEntries = entriesByDate.get(cell.dateKey) ?? [];
                const isToday = cell.dateKey === todayKey;

                return (
                  <div
                    key={cell.dateKey}
                    className={`min-h-[124px] p-2.5 border-r border-b border-[var(--border-subtle)] flex flex-col gap-1.5 ${
                      !cell.inCurrentMonth
                        ? 'bg-[var(--bg-surface)]/45 opacity-65'
                        : isToday
                        ? 'bg-[var(--accent-soft)]/35'
                        : 'bg-[var(--bg-paper)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-xs font-mono tabular-nums ${
                          isToday
                            ? 'px-1.5 py-0.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] font-medium'
                            : cell.inCurrentMonth
                            ? 'text-[var(--text-ink)] font-medium'
                            : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      {cellEntries.map((entry) => {
                        const info = renderCourseLink(entry);
                        return (
                          <div
                            key={entry.id}
                            className="border border-[var(--border-line)] bg-[var(--bg-surface)] px-2 py-1 space-y-0.5 group"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <button
                                type="button"
                                onClick={() => onSelectRecipe(entry.recipeId)}
                                className="text-left font-serif text-[12px] leading-tight text-[var(--text-ink)] hover:text-[var(--accent-primary)] hover:underline cursor-pointer line-clamp-2"
                              >
                                {info.title}
                              </button>
                              <button
                                type="button"
                                onClick={() => void onRemoveEntry(entry.id)}
                                aria-label={t.removeFromCalendarAria}
                                className="text-[var(--text-muted)]/60 hover:text-[var(--accent-secondary)] cursor-pointer shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => onSelectChapter(info.courseId)}
                              className="block text-left text-[10px] font-mono text-[var(--accent-secondary)] hover:underline cursor-pointer truncate max-w-full"
                            >
                              {info.courseTitle}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
