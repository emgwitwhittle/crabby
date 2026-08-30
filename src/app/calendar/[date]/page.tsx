import Link from "next/link";
import { notFound } from "next/navigation";
import { getHaulsByDate, getLocationById } from "@/lib/airtable";
import { formatDate } from "@/lib/format";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function CalendarDayPage({ params }: PageProps<"/calendar/[date]">) {
  const { date } = await params;
  if (!DATE_RE.test(date)) notFound();

  const hauls = await getHaulsByDate(date);
  const locations = await Promise.all(
    hauls.map((haul) => (haul.locations[0] ? getLocationById(haul.locations[0]) : null)),
  );
  const totalKeepers = hauls.reduce((sum, h) => sum + h.keepers, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{formatDate(date)}</h1>
          <p className="text-sm text-(--color-muted)">
            {hauls.length} haul{hauls.length === 1 ? "" : "s"} · {totalKeepers} keeper
            {totalKeepers === 1 ? "" : "s"} total
          </p>
        </div>
        <Link href={`/haul/new?date=${date}`} className="btn-primary text-sm">
          + Add Haul
        </Link>
      </div>

      {hauls.length === 0 ? (
        <p className="text-(--color-muted)">No haul logged for this day.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {hauls.map((haul, idx) => {
            const location = locations[idx];
            return (
              <li key={haul.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <Link href={`/haul/${haul.id}`} className="font-semibold hover:text-(--color-primary)">
                    {haul.name || "Untitled haul"}
                  </Link>
                  <span className="text-sm font-semibold text-(--color-primary)">
                    {haul.keepers} keeper{haul.keepers === 1 ? "" : "s"}
                  </span>
                </div>
                {location ? (
                  <Link
                    href={`/locations/${location.id}`}
                    className="mt-1 inline-block text-sm text-(--color-muted) hover:text-(--color-primary)"
                  >
                    Pin {location.pinNumber}
                    {location.locationDescription ? ` — ${location.locationDescription}` : ""}
                  </Link>
                ) : (
                  <p className="mt-1 text-sm text-(--color-muted)">No location linked.</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
