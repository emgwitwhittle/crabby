import Link from "next/link";
import type { HaulRecord } from "@/lib/airtable";
import { formatDateShort } from "@/lib/format";

export default function HaulList({ hauls }: { hauls: HaulRecord[] }) {
  if (hauls.length === 0) {
    return <p className="text-(--color-muted)">No hauls logged yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {hauls.map((haul) => (
        <li key={haul.id}>
          <Link
            href={`/haul/${haul.id}`}
            className="card flex items-center justify-between gap-3 px-4 py-3 hover:border-(--color-primary)"
          >
            <div>
              <p className="font-semibold">{haul.unique || "Haul"}</p>
              <p className="text-sm text-(--color-muted)">{formatDateShort(haul.date)}</p>
            </div>
            <span className="text-sm font-semibold text-(--color-primary)">
              {haul.keepers} keeper{haul.keepers === 1 ? "" : "s"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
