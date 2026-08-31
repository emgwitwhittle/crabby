"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mb-2 inline-flex items-center gap-1 text-sm text-(--color-muted) hover:text-(--color-primary)"
    >
      ← Back
    </button>
  );
}
