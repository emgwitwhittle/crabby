import Link from "next/link";
import LocationList from "@/components/LocationList";
import HaulList from "@/components/HaulList";
import Calendar from "@/components/Calendar";
import { getRecentLocations, getRecentHaul, getKeepersByDateForMonth } from "@/lib/airtable";
import { clampToSeason, defaultMonth } from "@/lib/calendar";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const requestedYear = Number(params.year);
  const requestedMonth = Number(params.month);
  const { year, month } =
    Number.isInteger(requestedYear) && Number.isInteger(requestedMonth)
      ? clampToSeason({ year: requestedYear, month: requestedMonth })
      : defaultMonth();

  const [locations, hauls, keepersByDate] = await Promise.all([
    getRecentLocations(10),
    getRecentHaul(10),
    getKeepersByDateForMonth(year, month),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Locations</h1>
          <div className="flex items-center gap-3">
            <Link href="/locations/new" className="btn-primary text-sm">
              + Add Location
            </Link>
            <Link href="/locations" className="text-sm font-semibold text-(--color-primary)">
              See All
            </Link>
          </div>
        </div>
        <LocationList locations={locations} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Recent Haul</h1>
          <div className="flex items-center gap-3">
            <Link href="/haul/new" className="btn-primary text-sm">
              + Add Haul
            </Link>
            <Link href="/haul" className="text-sm font-semibold text-(--color-primary)">
              See All
            </Link>
          </div>
        </div>
        <HaulList hauls={hauls} />
      </section>

      <section>
        <h1 className="mb-3 text-xl font-bold">Calendar</h1>
        <Calendar year={year} month={month} keepersByDate={keepersByDate} basePath="/" />
      </section>
    </div>
  );
}
