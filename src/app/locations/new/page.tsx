import { addLocationAction } from "@/lib/actions";

export default function NewLocationPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-bold">Add Location</h1>
      <form action={addLocationAction} className="flex flex-col gap-4">
        <div>
          <label className="field-label" htmlFor="pinNumber">
            Pin Number
          </label>
          <input
            id="pinNumber"
            name="pinNumber"
            required
            className="field"
            placeholder="e.g. 12"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="locationDescription">
            Location Description
          </label>
          <input
            id="locationDescription"
            name="locationDescription"
            className="field"
            placeholder="e.g. North side of the dock, past the pilings"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="latitude">
              Latitude
            </label>
            <input id="latitude" name="latitude" className="field" placeholder="47.6062" />
          </div>
          <div>
            <label className="field-label" htmlFor="longitude">
              Longitude
            </label>
            <input id="longitude" name="longitude" className="field" placeholder="-122.3321" />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="date">
            Date
          </label>
          <input id="date" name="date" type="date" defaultValue={today} className="field" />
        </div>

        <button type="submit" className="btn-primary mt-2">
          Save Location
        </button>
      </form>
    </div>
  );
}
