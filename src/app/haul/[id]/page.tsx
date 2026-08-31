import Link from "next/link";
import { notFound } from "next/navigation";
import HaulList from "@/components/HaulList";
import BackButton from "@/components/BackButton";
import {
  getHaulById,
  getLocationById,
  getHaulsByDate,
  getAllUsersMap,
} from "@/lib/airtable";
import { formatDate, formatDateLong, formatDateShort } from "@/lib/format";

export default async function HaulDetailPage({ params }: PageProps<"/haul/[id]">) {
  const { id } = await params;
  const haul = await getHaulById(id);
  if (!haul) notFound();

  const [location, usersMap, sameDayHauls] = await Promise.all([
    haul.locations[0] ? getLocationById(haul.locations[0]) : Promise.resolve(null),
    getAllUsersMap(),
    haul.date ? getHaulsByDate(haul.date) : Promise.resolve([]),
  ]);

  const addedByNames = haul.addedBy.map((uid) => usersMap.get(uid)?.name ?? "Unknown");
  const otherSameDayHauls = sameDayHauls.filter((h) => h.id !== haul.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <BackButton />
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{haul.unique || "Haul"}</h1>
          <Link href={`/haul/${haul.id}/edit`} className="btn-secondary text-sm">
            Edit
          </Link>
        </div>

        <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
          <Field label="Date" value={formatDate(haul.date)} />
          <Field label="Keepers" value={String(haul.keepers)} />
          <Field label="Thrown Back" value={haul.thrownBack === null ? "—" : String(haul.thrownBack)} />
          <Field label="By" value={haul.by || "—"} />
          <Field label="Added by" value={addedByNames.join(", ") || "—"} />
          <Field label="Year" value={haul.year === null ? "—" : String(haul.year)} />
          <Field label="Notes" value={haul.notes || "—"} />
          <Field
            label="Logged on"
            value={haul.createDate ? formatDateShort(haul.createDate) : "—"}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold">Location</h2>
        {location ? (
          <Link
            href={`/locations/${location.id}`}
            className="card block px-4 py-3 hover:border-(--color-primary)"
          >
            <p className="font-semibold">Pin {location.pinNumber}</p>
            {location.locationDescription && (
              <p className="text-sm text-(--color-muted)">{location.locationDescription}</p>
            )}
          </Link>
        ) : (
          <p className="text-(--color-muted)">No location linked.</p>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold">
          Other Hauls on {formatDateLong(haul.date)}
        </h2>
        <HaulList hauls={otherSameDayHauls} />
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
