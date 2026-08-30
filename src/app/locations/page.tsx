import Link from "next/link";
import LocationList from "@/components/LocationList";
import { getAllLocations } from "@/lib/airtable";

export default async function AllLocationsPage() {
  const locations = await getAllLocations();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">All Locations</h1>
        <Link href="/locations/new" className="btn-primary text-sm">
          + Add Location
        </Link>
      </div>
      <LocationList locations={locations} />
    </div>
  );
}
