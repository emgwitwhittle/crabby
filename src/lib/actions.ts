"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createLocation, createHaul } from "@/lib/airtable";
import { getCurrentUser } from "@/lib/session";

export async function addLocationAction(formData: FormData) {
  const pinNumber = String(formData.get("pinNumber") ?? "").trim();
  const latitude = String(formData.get("latitude") ?? "").trim();
  const longitude = String(formData.get("longitude") ?? "").trim();
  const locationDescription = String(formData.get("locationDescription") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();

  if (!pinNumber) {
    throw new Error("Pin Number is required.");
  }

  const user = await getCurrentUser();

  const location = await createLocation({
    pinNumber,
    latitude,
    longitude,
    locationDescription,
    date: date || undefined,
    addedByUserId: user?.id,
  });

  revalidatePath("/");
  revalidatePath("/locations");
  redirect(`/locations/${location.id}`);
}

export async function addHaulAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const keepersRaw = String(formData.get("keepers") ?? "").trim();
  const thrownBackRaw = String(formData.get("thrownBack") ?? "").trim();
  const by = String(formData.get("by") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const locationId = String(formData.get("locationId") ?? "").trim();

  if (!name) {
    throw new Error("Name is required.");
  }
  if (!date) {
    throw new Error("Date is required.");
  }

  const user = await getCurrentUser();

  const haul = await createHaul({
    name,
    date,
    keepers: keepersRaw ? Number(keepersRaw) : undefined,
    thrownBack: thrownBackRaw ? Number(thrownBackRaw) : undefined,
    by: by || undefined,
    notes: notes || undefined,
    locationId: locationId || undefined,
    addedByUserId: user?.id,
  });

  revalidatePath("/");
  revalidatePath("/haul");
  if (locationId) revalidatePath(`/locations/${locationId}`);
  revalidatePath(`/calendar/${date}`);
  redirect(`/haul/${haul.id}`);
}
