// Crabbing season is restricted to July, August, and September, from 2020 to
// the current month. All calendar navigation is expressed in terms of this
// bounded list of valid (year, month) pairs.

export const SEASON_MONTHS = [7, 8, 9];
export const EARLIEST_YEAR = 2020;

export type YearMonth = { year: number; month: number }; // month is 1-indexed

export function isValidSeasonMonth({ year, month }: YearMonth): boolean {
  return SEASON_MONTHS.includes(month) && year >= EARLIEST_YEAR;
}

function today(): YearMonth {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

// The latest month a user may navigate to: the current real month if it's
// in season, otherwise the most recent season month that has already passed
// this year (or the prior year's September if we're before July).
export function latestAllowedMonth(): YearMonth {
  const { year, month } = today();
  if (month > 9) return { year, month: 9 };
  if (month < 7) return { year: year - 1, month: 9 };
  return { year, month };
}

export const EARLIEST_ALLOWED_MONTH: YearMonth = { year: EARLIEST_YEAR, month: 7 };

function seasonIndex(ym: YearMonth): number {
  return (ym.year - EARLIEST_YEAR) * SEASON_MONTHS.length + SEASON_MONTHS.indexOf(ym.month);
}

function fromSeasonIndex(index: number): YearMonth {
  const year = EARLIEST_YEAR + Math.floor(index / SEASON_MONTHS.length);
  const month = SEASON_MONTHS[index % SEASON_MONTHS.length];
  return { year, month };
}

// Clamp an arbitrary (year, month) to the nearest valid season month within
// [EARLIEST_ALLOWED_MONTH, latestAllowedMonth()].
export function clampToSeason(ym: YearMonth): YearMonth {
  const latest = latestAllowedMonth();
  const minIndex = seasonIndex(EARLIEST_ALLOWED_MONTH);
  const maxIndex = seasonIndex(latest);

  if (SEASON_MONTHS.includes(ym.month)) {
    const idx = seasonIndex(ym);
    const clamped = Math.min(Math.max(idx, minIndex), maxIndex);
    return fromSeasonIndex(clamped);
  }

  // Outside season: snap forward to the next in-season month, then clamp.
  const nextMonth = SEASON_MONTHS.find((m) => m > ym.month);
  const snapped: YearMonth = nextMonth
    ? { year: ym.year, month: nextMonth }
    : { year: ym.year + 1, month: SEASON_MONTHS[0] };
  const idx = seasonIndex(snapped);
  const clamped = Math.min(Math.max(idx, minIndex), maxIndex);
  return fromSeasonIndex(clamped);
}

export function defaultMonth(): YearMonth {
  return clampToSeason(today());
}

export function nextSeasonMonth(ym: YearMonth): YearMonth | null {
  const latest = latestAllowedMonth();
  const idx = seasonIndex(ym);
  const maxIndex = seasonIndex(latest);
  if (idx >= maxIndex) return null;
  return fromSeasonIndex(idx + 1);
}

export function previousSeasonMonth(ym: YearMonth): YearMonth | null {
  const idx = seasonIndex(ym);
  const minIndex = seasonIndex(EARLIEST_ALLOWED_MONTH);
  if (idx <= minIndex) return null;
  return fromSeasonIndex(idx - 1);
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

// 0 = Sunday ... 6 = Saturday, for the 1st of the given month.
export function firstWeekdayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function isoDate(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${day === undefined ? "" : pad2(day)}`;
}
