import { LanguageCode } from '../types/cookbook';

const LOCALE_MAP: Record<LanguageCode, string> = {
  en: 'en-US',
  nl: 'nl-NL',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
  it: 'it-IT',
};

export function getIntlLocale(lang: LanguageCode): string {
  return LOCALE_MAP[lang] ?? 'en-US';
}

export function formatLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateKey(): string {
  return formatLocalDateKey(new Date());
}

export function addDaysLocal(base: Date, offsetDays: number): Date {
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + offsetDays
  );
}

export interface MonthGridCell {
  date: Date;
  dateKey: string;
  dayNumber: number;
  inCurrentMonth: boolean;
}

/**
 * Returns a 5- or 6-week Monday-first calendar matrix for the given year and 0-indexed month.
 */
export function buildMonthGrid(year: number, monthIndex: number): MonthGridCell[] {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const lastOfMonth = new Date(year, monthIndex + 1, 0);

  // Convert JS Sunday=0..Saturday=6 into Monday=0..Sunday=6
  const startWeekday = (firstOfMonth.getDay() + 6) % 7;
  const totalDaysInMonth = lastOfMonth.getDate();
  const totalCells = Math.ceil((startWeekday + totalDaysInMonth) / 7) * 7;

  const cells: MonthGridCell[] = [];
  for (let i = 0; i < totalCells; i++) {
    const cellDate = new Date(year, monthIndex, 1 - startWeekday + i);
    cells.push({
      date: cellDate,
      dateKey: formatLocalDateKey(cellDate),
      dayNumber: cellDate.getDate(),
      inCurrentMonth: cellDate.getMonth() === monthIndex,
    });
  }
  return cells;
}

/**
 * Returns 7 localized short weekday labels starting on Monday.
 */
export function getMondayFirstWeekdays(lang: LanguageCode): string[] {
  const fmt = new Intl.DateTimeFormat(getIntlLocale(lang), {
    weekday: 'short',
  });
  // 2024-01-01 was a Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, 1 + i);
    return fmt.format(d);
  });
}
