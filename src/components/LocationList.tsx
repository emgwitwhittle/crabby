import Link from "next/link";
import type { LocationRecord } from "@/lib/airtable";

export default function LocationList({ locations }: { locations: LocationRecord[] }) {
  if (locations.length === 0) {
    return <p className="text-(--color-muted)">No locations logged yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {locations.map((location) => (
        <li key={location.id}>
          <Link
            href={`/locations/${location.id}`}
            className="card flex items-center justify-between gap-3 px-4 py-3 hover:border-(--color-primary)"
          >
            <div>
              <p className="font-semibold">Pin {location.pinNumber}</p>
              {location.locationDescription && (
                <p className="text-sm text-(--color-muted)">{location.locationDescription}</p>
              )}
            </div>
            <span className="text-sm text-(--color-muted)">{location.haul.length} haul(s)</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
