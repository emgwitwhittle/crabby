"use client";

import { useRef } from "react";
import { addHaulAction } from "@/lib/actions";

type LocationOption = { id: string; pinNumber: string; locationDescription: string };

export default function AddHaulDialog({
  locations,
  presetLocationId,
  presetLocationLabel,
  presetDate,
  triggerLabel = "+ Add Haul",
}: {
  locations: LocationOption[];
  presetLocationId?: string;
  presetLocationLabel?: string;
  presetDate?: string;
  triggerLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <button
        type="button"
        className="btn-primary text-sm"
        onClick={() => dialogRef.current?.showModal()}
      >
        {triggerLabel}
      </button>
      <dialog ref={dialogRef} className="app-dialog">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Add Haul</h2>
          <button
            type="button"
            className="text-xl leading-none text-(--color-muted) hover:text-(--color-primary)"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form action={addHaulAction} className="flex flex-col gap-4">
          <div>
            <label className="field-label" htmlFor="ah-date">
              Date
            </label>
            <input
              id="ah-date"
              name="date"
              type="date"
              required
              defaultValue={presetDate ?? today}
              className="field"
            />
          </div>

          {presetLocationId ? (
            <div>
              <p className="field-label">Location</p>
              <p className="field bg-(--color-page-bg)">{presetLocationLabel}</p>
              <input type="hidden" name="locationId" value={presetLocationId} />
            </div>
          ) : (
            <div>
              <label className="field-label" htmlFor="ah-location">
                Location
              </label>
              <select id="ah-location" name="locationId" className="field">
                <option value="">— None —</option>
                {locations.map((location) => (
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
              <label className="field-label" htmlFor="ah-keepers">
                Keepers
              </label>
              <input
                id="ah-keepers"
                name="keepers"
                type="number"
                min="0"
                defaultValue={0}
                className="field"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="ah-thrown">
                Thrown Back
              </label>
              <input id="ah-thrown" name="thrownBack" type="number" min="0" className="field" />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="ah-by">
              By
            </label>
            <input id="ah-by" name="by" className="field" placeholder="Who was crabbing" />
          </div>

          <div>
            <label className="field-label" htmlFor="ah-notes">
              Notes
            </label>
            <textarea id="ah-notes" name="notes" rows={3} className="field" />
          </div>

          <button type="submit" className="btn-primary mt-2">
            Save Haul
          </button>
        </form>
      </dialog>
    </>
  );
}
