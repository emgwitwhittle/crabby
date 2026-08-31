import Link from "next/link";
import HaulList from "@/components/HaulList";
import AddHaulDialog from "@/components/AddHaulDialog";
import { getAllHaul, getAllLocations } from "@/lib/airtable";

type SortKey =
  | "created-desc"
  | "created-asc"
  | "date-desc"
  | "date-asc"
  | "keepers-desc"
  | "keepers-asc";

export default async function AllHaulPage({
  searchParams,
}: {
  searchParams: Promise<{
    dateFrom?: string;
    dateTo?: string;
    minKeepers?: string;
    maxKeepers?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const [hauls, allLocations] = await Promise.all([getAllHaul(), getAllLocations()]);

  const dateFrom = params.dateFrom?.trim() || "";
  const dateTo = params.dateTo?.trim() || "";
  const minKeepers = params.minKeepers?.trim() || "";
  const maxKeepers = params.maxKeepers?.trim() || "";
  const sort: SortKey = (
    ["created-desc", "created-asc", "date-desc", "date-asc", "keepers-desc", "keepers-asc"].includes(
      params.sort ?? "",
    )
      ? params.sort
      : "created-desc"
  ) as SortKey;

  let filtered = hauls.filter((haul) => {
    if (dateFrom && (!haul.date || haul.date < dateFrom)) return false;
    if (dateTo && (!haul.date || haul.date > dateTo)) return false;
    if (minKeepers && haul.keepers < Number(minKeepers)) return false;
    if (maxKeepers && haul.keepers > Number(maxKeepers)) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case "created-asc":
        return (a.createDate ?? "").localeCompare(b.createDate ?? "");
      case "date-asc":
        return (a.date ?? "").localeCompare(b.date ?? "");
      case "date-desc":
        return (b.date ?? "").localeCompare(a.date ?? "");
      case "keepers-desc":
        return b.keepers - a.keepers;
      case "keepers-asc":
        return a.keepers - b.keepers;
      case "created-desc":
      default:
        return (b.createDate ?? "").localeCompare(a.createDate ?? "");
    }
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">All Hauls</h1>
        <AddHaulDialog locations={allLocations} />
      </div>

      <form className="card mb-4 flex flex-col gap-3 p-4" method="get">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor="dateFrom">
              From
            </label>
            <input
              id="dateFrom"
              name="dateFrom"
              type="date"
              defaultValue={dateFrom}
              className="field"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="dateTo">
              To
            </label>
            <input id="dateTo" name="dateTo" type="date" defaultValue={dateTo} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="minKeepers">
              Min Keepers
            </label>
            <input
              id="minKeepers"
              name="minKeepers"
              type="number"
              min="0"
              defaultValue={minKeepers}
              className="field"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="maxKeepers">
              Max Keepers
            </label>
            <input
              id="maxKeepers"
              name="maxKeepers"
              type="number"
              min="0"
              defaultValue={maxKeepers}
              className="field"
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="sort">
            Sort by
          </label>
          <select id="sort" name="sort" defaultValue={sort} className="field">
            <option value="created-desc">Recently added (newest first)</option>
            <option value="created-asc">Recently added (oldest first)</option>
            <option value="date-desc">Haul date (newest first)</option>
            <option value="date-asc">Haul date (oldest first)</option>
            <option value="keepers-desc">Keepers (most first)</option>
            <option value="keepers-asc">Keepers (fewest first)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary text-sm">
            Apply
          </button>
          <Link href="/haul" className="text-sm text-(--color-muted) hover:text-(--color-primary)">
            Clear filters
          </Link>
        </div>
      </form>

      <p className="mb-2 text-sm text-(--color-muted)">
        {filtered.length} haul{filtered.length === 1 ? "" : "s"}
      </p>
      <HaulList hauls={filtered} />
    </div>
  );
}
