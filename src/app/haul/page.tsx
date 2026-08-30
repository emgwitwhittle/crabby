import Link from "next/link";
import HaulList from "@/components/HaulList";
import { getAllHaul } from "@/lib/airtable";

export default async function AllHaulPage() {
  const hauls = await getAllHaul();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">All Haul</h1>
        <Link href="/haul/new" className="btn-primary text-sm">
          + Add Haul
        </Link>
      </div>
      <HaulList hauls={hauls} />
    </div>
  );
}
