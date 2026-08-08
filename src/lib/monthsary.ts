import { useEffect, useState } from "react";

/** Where the story starts. Month is 0-indexed: 11 = December. */
export const START = { y: 2023, m: 11, d: 9 } as const;

/** The day of the month each monthsary falls on. */
const DAY = START.d;

/** Midnight local time — she reads this on her phone, in her timezone. */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetween(from: Date, to: Date): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  // Round rather than floor: DST shifts make some "days" 23 or 25 hours long.
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);
}

/** Whole months elapsed since the start date. 0 on day one. */
export function monthsTogether(now: Date): number {
  const months = (now.getFullYear() - START.y) * 12 + (now.getMonth() - START.m);
  // The current month only counts once the day-of-month has come round.
  return Math.max(0, now.getDate() >= DAY ? months : months - 1);
}

/** Days since the most recent monthsary. 0 on the day itself. */
export function daysSinceLastMonthsary(now: Date): number {
  const last =
    now.getDate() >= DAY
      ? new Date(now.getFullYear(), now.getMonth(), DAY)
      : new Date(now.getFullYear(), now.getMonth() - 1, DAY);
  return Math.max(0, daysBetween(last, now));
}

/** The next monthsary date. Returns today's date when today is the day. */
export function nextMonthsaryDate(now: Date): Date {
  return now.getDate() <= DAY
    ? new Date(now.getFullYear(), now.getMonth(), DAY)
    : new Date(now.getFullYear(), now.getMonth() + 1, DAY);
}

/** Days until the next monthsary. 0 on the day itself. */
export function daysUntilNextMonthsary(now: Date): number {
  return Math.max(0, daysBetween(now, nextMonthsaryDate(now)));
}

export function isMonthsaryToday(now: Date): boolean {
  return now.getDate() === DAY && totalDaysTogether(now) > 0;
}

export function totalDaysTogether(now: Date): number {
  return Math.max(0, daysBetween(new Date(START.y, START.m, START.d), now));
}

/** 1 -> "1st", 22 -> "22nd", 13 -> "13th". */
export function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export interface Monthsary {
  months: number;
  daysSince: number;
  daysUntil: number;
  totalDays: number;
  isToday: boolean;
}

export function readMonthsary(now: Date = new Date()): Monthsary {
  return {
    months: monthsTogether(now),
    daysSince: daysSinceLastMonthsary(now),
    daysUntil: daysUntilNextMonthsary(now),
    totalDays: totalDaysTogether(now),
    isToday: isMonthsaryToday(now),
  };
}

/**
 * Live monthsary figures.
 *
 * Ticks once a minute rather than once a second — everything here is
 * day-granular, and a racing counter would fight the calm. Also recomputes
 * when the tab is brought back, so a phone left asleep overnight is correct
 * the moment she looks at it.
 */
export function useMonthsary(): Monthsary {
  const [value, setValue] = useState<Monthsary>(() => readMonthsary());

  useEffect(() => {
    const update = () => setValue(readMonthsary());

    const id = window.setInterval(update, 60_000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return value;
}
