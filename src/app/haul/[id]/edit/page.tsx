import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import { getHaulById, getAllLocations } from "@/lib/airtable";
import { editHaulAction } from "@/lib/actions";

export default async function EditHaulPage({ params }: PageProps<"/haul/[id]/edit">) {
  const { id } = await params;
  const [haul, locations] = await Promise.all([getHaulById(id), getAllLocations()]);
  if (!haul) notFound();

  const boundAction = editHaulAction.bind(null, haul.id);
  const currentLocationId = haul.locations[0] ?? "";

  return (
    <div className="mx-auto max-w-md">
      <BackButton />
      <h1 className="mb-4 text-xl font-bold">Edit {haul.unique || "Haul"}</h1>
      <form action={boundAction} className="flex flex-col gap-4">
        <div>
          <label className="field-label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={haul.date ?? ""}
            className="field"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="locationId">
            Location
          </label>
          <select id="locationId" name="locationId" defaultValue={currentLocationId} className="field">
            <option value="">— None —</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                Pin {location.pinNumber}
                {location.locationDescription ? ` — ${location.locationDescription}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="keepers">
              Keepers
            </label>
            <input
              id="keepers"
              name="keepers"
              type="number"
              min="0"
              defaultValue={haul.keepers}
              className="field"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="thrownBack">
              Thrown Back
            </label>
            <input
              id="thrownBack"
              name="thrownBack"
              type="number"
              min="0"
              defaultValue={haul.thrownBack ?? undefined}
              className="field"
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="by">
            By
          </label>
          <input id="by" name="by" defaultValue={haul.by ?? ""} className="field" />
        </div>

        <div>
          <label className="field-label" htmlFor="notes">
            Notes
          </label>
          <textarea id="notes" name="notes" rows={3} defaultValue={haul.notes} className="field" />
        </div>

        <button type="submit" className="btn-primary mt-2">
          Save Changes
        </button>
      </form>
    </div>
  );
}
