import Link from "next/link";
import { notFound } from "next/navigation";
import HaulList from "@/components/HaulList";
import { getLocationById, getHaulByIds, getAllUsersMap } from "@/lib/airtable";
import { formatDate, formatDateShort } from "@/lib/format";

export default async function LocationDetailPage({
  params,
}: PageProps<"/locations/[id]">) {
  const { id } = await params;
  const location = await getLocationById(id);
  if (!location) notFound();

  const [hauls, usersMap] = await Promise.all([
    getHaulByIds(location.haul),
    getAllUsersMap(),
  ]);
  const sortedHauls = [...hauls].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  const addedByNames = location.addedBy.map((uid) => usersMap.get(uid)?.name ?? "Unknown");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pin {location.pinNumber}</h1>
          <Link href={`/haul/new?locationId=${location.id}`} className="btn-primary text-sm">
            + Add Haul Here
          </Link>
        </div>

        <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
          <Field label="Location Description" value={location.locationDescription || "—"} />
          <Field label="Date" value={formatDate(location.date)} />
          <Field label="Latitude" value={location.latitude || "—"} />
          <Field label="Longitude" value={location.longitude || "—"} />
          <Field label="Added by" value={addedByNames.join(", ") || "—"} />
          <Field
            label="Logged on"
            value={location.createDate ? formatDateShort(location.createDate) : "—"}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold">Haul at this Location</h2>
        <HaulList hauls={sortedHauls} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
        {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
