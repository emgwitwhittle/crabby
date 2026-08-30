import Link from "next/link";
import {
  MONTH_NAMES,
  daysInMonth,
  firstWeekdayOfMonth,
  isoDate,
  nextSeasonMonth,
  previousSeasonMonth,
  type YearMonth,
} from "@/lib/calendar";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({
  year,
  month,
  keepersByDate,
  basePath = "/",
}: {
  year: number;
  month: number;
  keepersByDate: Map<string, number>;
  basePath?: string;
}) {
  const ym: YearMonth = { year, month };
  const prev = previousSeasonMonth(ym);
  const next = nextSeasonMonth(ym);
  const total = daysInMonth(year, month);
  const offset = firstWeekdayOfMonth(year, month);
  const todayIso = new Date().toISOString().slice(0, 10);

  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  const monthHref = (target: YearMonth | null) =>
    target ? `${basePath}?year=${target.year}&month=${target.month}` : null;

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        {prev ? (
          <Link href={monthHref(prev)!} className="btn-secondary px-3 py-1.5 text-sm">
            ← {MONTH_NAMES[prev.month - 1].slice(0, 3)}
          </Link>
        ) : (
          <span />
        )}
        <h2 className="text-lg font-bold">
          {MONTH_NAMES[month - 1]} {year}
        </h2>
        {next ? (
          <Link href={monthHref(next)!} className="btn-secondary px-3 py-1.5 text-sm">
            {MONTH_NAMES[next.month - 1].slice(0, 3)} →
          </Link>
        ) : (
          <span />
        )}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-(--color-muted)">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          const dateStr = isoDate(year, month, day);
          const keepers = keepersByDate.get(dateStr) ?? 0;
          const isToday = dateStr === todayIso;
          return (
            <Link
              key={dateStr}
              href={`/calendar/${dateStr}`}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-sm ${
                isToday ? "border-(--color-primary)" : "border-(--color-border)"
              } bg-(--color-surface) hover:border-(--color-primary)`}
            >
              <span className="font-semibold">{day}</span>
              {keepers > 0 && (
                <span className="mt-0.5 rounded-full bg-(--color-primary) px-1.5 text-[10px] font-bold text-(--color-primary-foreground)">
                  {keepers}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
