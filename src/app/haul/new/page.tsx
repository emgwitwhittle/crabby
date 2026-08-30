import Link from "next/link";
import { addHaulAction } from "@/lib/actions";
import { getAllLocations, getLocationById } from "@/lib/airtable";

export default async function NewHaulPage({
  searchParams,
}: {
  searchParams: Promise<{ locationId?: string; date?: string }>;
}) {
  const params = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const presetDate = params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : today;

  const presetLocation = params.locationId ? await getLocationById(params.locationId) : null;
  const allLocations = presetLocation ? [] : await getAllLocations();

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-bold">Add Haul</h1>
      <form action={addHaulAction} className="flex flex-col gap-4">
        <div>
          <label className="field-label" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" required className="field" placeholder="e.g. Saturday morning haul" />
        </div>

        <div>
          <label className="field-label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={presetDate}
            className="field"
          />
        </div>

        {presetLocation ? (
          <div>
            <p className="field-label">Location</p>
            <p className="field bg-(--color-page-bg)">
              Pin {presetLocation.pinNumber}
              {presetLocation.locationDescription ? ` — ${presetLocation.locationDescription}` : ""}
            </p>
            <input type="hidden" name="locationId" value={presetLocation.id} />
          </div>
        ) : (
          <div>
            <label className="field-label" htmlFor="locationId">
              Location
            </label>
            <select id="locationId" name="locationId" className="field">
              <option value="">— None —</option>
              {allLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  Pin {location.pinNumber}
                  {location.locationDescription ? ` — ${location.locationDescription}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="keepers">
              Keepers
            </label>
            <input id="keepers" name="keepers" type="number" min="0" className="field" defaultValue={0} />
          </div>
          <div>
            <label className="field-label" htmlFor="thrownBack">
              Thrown Back
            </label>
            <input id="thrownBack" name="thrownBack" type="number" min="0" className="field" />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="by">
            By
          </label>
          <input id="by" name="by" className="field" placeholder="Who was crabbing" />
        </div>

        <div>
          <label className="field-label" htmlFor="notes">
            Notes
          </label>
          <textarea id="notes" name="notes" className="field" rows={3} />
        </div>

        <button type="submit" className="btn-primary mt-2">
          Save Haul
        </button>
      </form>

      {presetLocation && (
        <Link
          href={`/locations/${presetLocation.id}`}
          className="mt-3 inline-block text-sm text-(--color-muted) hover:text-(--color-primary)"
        >
          ← Back to Pin {presetLocation.pinNumber}
        </Link>
      )}
    </div>
  );
}
