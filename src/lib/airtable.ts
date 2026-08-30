import "server-only";
import Airtable from "airtable";

// Constructed lazily (not at module load) so builds and pages that don't
// touch Airtable still work before env vars are configured.
let cachedBase: Airtable.Base | null = null;

function base(table: string) {
  if (!cachedBase) {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    if (!apiKey || !baseId) {
      throw new Error(
        "AIRTABLE_API_KEY / AIRTABLE_BASE_ID are not set. Configure them in .env.local.",
      );
    }
    cachedBase = new Airtable({ apiKey }).base(baseId);
  }
  return cachedBase(table);
}

export const TABLES = {
  LOCATIONS: "Locations",
  HAUL: "Haul",
  USERS: "Users",
} as const;

// ---- Field name constants (kept in one place so a rename in Airtable is a one-line fix) ----

export const LOCATION_FIELDS = {
  PIN_NUMBER: "Pin Number",
  ADDED_BY: "Added by",
  CREATE_DATE: "Create Date",
  DATE: "Date",
  HAUL: "Haul",
  LATITUDE: "Latitude",
  LOCATION_DESCRIPTION: "Location Description",
  LONGITUDE: "Longitude",
} as const;

export const HAUL_FIELDS = {
  NAME: "Name",
  ADDED_BY: "Added by",
  BY: "By",
  CREATE_DATE: "Create Date",
  DATE: "Date",
  KEEPERS: "Keepers",
  LOCATIONS: "Locations",
  NOTES: "Notes",
  THROWN_BACK: "Thrown Back",
  TEMP_LOCATION_NOTES: "Temp Location Notes",
  YEAR: "Year",
} as const;

export const USER_FIELDS = {
  NAME: "Name",
  EMAIL: "Email",
  CREATED: "Created",
  HAUL: "Haul",
  LOCATIONS: "Locations",
  RANDOM_TOKEN: "Random token",
} as const;

// ---- Types ----

export type LocationRecord = {
  id: string;
  pinNumber: string;
  addedBy: string[];
  createDate: string | null;
  date: string | null;
  haul: string[];
  latitude: string;
  longitude: string;
  locationDescription: string;
};

export type HaulRecord = {
  id: string;
  name: string;
  addedBy: string[];
  by: string | null;
  createDate: string | null;
  date: string | null;
  keepers: number;
  locations: string[];
  notes: string;
  thrownBack: number | null;
  tempLocationNotes: string;
  year: number | null;
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  created: string | null;
  haul: string[];
  locations: string[];
  token: string;
};

function toLocationRecord(record: Airtable.Record<Airtable.FieldSet>): LocationRecord {
  const f = record.fields;
  return {
    id: record.id,
    pinNumber: String(f[LOCATION_FIELDS.PIN_NUMBER] ?? ""),
    addedBy: (f[LOCATION_FIELDS.ADDED_BY] as string[] | undefined) ?? [],
    createDate: (f[LOCATION_FIELDS.CREATE_DATE] as string | undefined) ?? null,
    date: (f[LOCATION_FIELDS.DATE] as string | undefined) ?? null,
    haul: (f[LOCATION_FIELDS.HAUL] as string[] | undefined) ?? [],
    latitude: String(f[LOCATION_FIELDS.LATITUDE] ?? ""),
    longitude: String(f[LOCATION_FIELDS.LONGITUDE] ?? ""),
    locationDescription: String(f[LOCATION_FIELDS.LOCATION_DESCRIPTION] ?? ""),
  };
}

function toHaulRecord(record: Airtable.Record<Airtable.FieldSet>): HaulRecord {
  const f = record.fields;
  return {
    id: record.id,
    name: String(f[HAUL_FIELDS.NAME] ?? ""),
    addedBy: (f[HAUL_FIELDS.ADDED_BY] as string[] | undefined) ?? [],
    by: (f[HAUL_FIELDS.BY] as string | undefined) ?? null,
    createDate: (f[HAUL_FIELDS.CREATE_DATE] as string | undefined) ?? null,
    date: (f[HAUL_FIELDS.DATE] as string | undefined) ?? null,
    keepers: Number(f[HAUL_FIELDS.KEEPERS] ?? 0),
    locations: (f[HAUL_FIELDS.LOCATIONS] as string[] | undefined) ?? [],
    notes: String(f[HAUL_FIELDS.NOTES] ?? ""),
    thrownBack:
      f[HAUL_FIELDS.THROWN_BACK] === undefined ? null : Number(f[HAUL_FIELDS.THROWN_BACK]),
    tempLocationNotes: String(f[HAUL_FIELDS.TEMP_LOCATION_NOTES] ?? ""),
    year: f[HAUL_FIELDS.YEAR] === undefined ? null : Number(f[HAUL_FIELDS.YEAR]),
  };
}

function toUserRecord(record: Airtable.Record<Airtable.FieldSet>): UserRecord {
  const f = record.fields;
  return {
    id: record.id,
    name: String(f[USER_FIELDS.NAME] ?? ""),
    email: String(f[USER_FIELDS.EMAIL] ?? ""),
    created: (f[USER_FIELDS.CREATED] as string | undefined) ?? null,
    haul: (f[USER_FIELDS.HAUL] as string[] | undefined) ?? [],
    locations: (f[USER_FIELDS.LOCATIONS] as string[] | undefined) ?? [],
    token: String(f[USER_FIELDS.RANDOM_TOKEN] ?? record.id),
  };
}

// Natural sort so text-typed "Pin Number" values like "2", "10", "PIN-3" order sensibly.
function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

// ---- Locations ----

export async function getAllLocations(): Promise<LocationRecord[]> {
  const records = await base(TABLES.LOCATIONS).select({}).all();
  return records.map(toLocationRecord).sort((a, b) => naturalCompare(a.pinNumber, b.pinNumber));
}

export async function getRecentLocations(limit: number): Promise<LocationRecord[]> {
  const all = await getAllLocations();
  return all.slice(0, limit);
}

export async function getLocationById(id: string): Promise<LocationRecord | null> {
  try {
    const record = await base(TABLES.LOCATIONS).find(id);
    return toLocationRecord(record);
  } catch {
    return null;
  }
}

export async function createLocation(fields: {
  pinNumber: string;
  latitude: string;
  longitude: string;
  locationDescription: string;
  date?: string;
  addedByUserId?: string;
}): Promise<LocationRecord> {
  const airtableFields: Airtable.FieldSet = {
    [LOCATION_FIELDS.PIN_NUMBER]: fields.pinNumber,
    [LOCATION_FIELDS.LATITUDE]: fields.latitude,
    [LOCATION_FIELDS.LONGITUDE]: fields.longitude,
    [LOCATION_FIELDS.LOCATION_DESCRIPTION]: fields.locationDescription,
  };
  if (fields.date) airtableFields[LOCATION_FIELDS.DATE] = fields.date;
  if (fields.addedByUserId) airtableFields[LOCATION_FIELDS.ADDED_BY] = [fields.addedByUserId];

  const record = await base(TABLES.LOCATIONS).create(airtableFields, { typecast: true });
  return toLocationRecord(record);
}

// ---- Haul ----

export async function getAllHaul(): Promise<HaulRecord[]> {
  const records = await base(TABLES.HAUL)
    .select({ sort: [{ field: HAUL_FIELDS.DATE, direction: "desc" }] })
    .all();
  return records.map(toHaulRecord);
}

export async function getRecentHaul(limit: number): Promise<HaulRecord[]> {
  const records = await base(TABLES.HAUL)
    .select({
      sort: [{ field: HAUL_FIELDS.DATE, direction: "desc" }],
      maxRecords: limit,
    })
    .all();
  return records.map(toHaulRecord);
}

export async function getHaulById(id: string): Promise<HaulRecord | null> {
  try {
    const record = await base(TABLES.HAUL).find(id);
    return toHaulRecord(record);
  } catch {
    return null;
  }
}

export async function getHaulByIds(ids: string[]): Promise<HaulRecord[]> {
  const results = await Promise.all(ids.map((id) => getHaulById(id)));
  return results.filter((r): r is HaulRecord => r !== null);
}

export async function getHaulsByLocationId(locationId: string): Promise<HaulRecord[]> {
  const records = await base(TABLES.HAUL)
    .select({
      filterByFormula: `FIND('${locationId}', ARRAYJOIN({${HAUL_FIELDS.LOCATIONS}}))`,
      sort: [{ field: HAUL_FIELDS.DATE, direction: "desc" }],
    })
    .all();
  return records.map(toHaulRecord);
}

export async function getHaulsByDate(dateStr: string): Promise<HaulRecord[]> {
  const records = await base(TABLES.HAUL)
    .select({
      filterByFormula: `IS_SAME({${HAUL_FIELDS.DATE}}, '${dateStr}', 'day')`,
    })
    .all();
  return records.map(toHaulRecord);
}

export async function getKeepersByDateForMonth(
  year: number,
  month: number, // 1-indexed
): Promise<Map<string, number>> {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(Date.UTC(year, month, 1));
  const end = endDate.toISOString().slice(0, 10);

  const records = await base(TABLES.HAUL)
    .select({
      filterByFormula: `AND(IS_AFTER({${HAUL_FIELDS.DATE}}, '${start}'), IS_BEFORE({${HAUL_FIELDS.DATE}}, '${end}'))`,
      fields: [HAUL_FIELDS.DATE, HAUL_FIELDS.KEEPERS],
    })
    .all();

  // IS_AFTER is exclusive of the start date itself, so also fetch that single day.
  const firstDayRecords = await base(TABLES.HAUL)
    .select({
      filterByFormula: `IS_SAME({${HAUL_FIELDS.DATE}}, '${start}', 'day')`,
      fields: [HAUL_FIELDS.DATE, HAUL_FIELDS.KEEPERS],
    })
    .all();

  const totals = new Map<string, number>();
  for (const record of [...records, ...firstDayRecords]) {
    const dateValue = record.fields[HAUL_FIELDS.DATE] as string | undefined;
    if (!dateValue) continue;
    const day = dateValue.slice(0, 10);
    const keepers = Number(record.fields[HAUL_FIELDS.KEEPERS] ?? 0);
    totals.set(day, (totals.get(day) ?? 0) + keepers);
  }
  return totals;
}

export async function createHaul(fields: {
  name: string;
  date: string;
  keepers?: number;
  notes?: string;
  by?: string;
  thrownBack?: number;
  locationId?: string;
  addedByUserId?: string;
}): Promise<HaulRecord> {
  const airtableFields: Airtable.FieldSet = {
    [HAUL_FIELDS.NAME]: fields.name,
    [HAUL_FIELDS.DATE]: fields.date,
  };
  if (fields.keepers !== undefined) airtableFields[HAUL_FIELDS.KEEPERS] = fields.keepers;
  if (fields.notes) airtableFields[HAUL_FIELDS.NOTES] = fields.notes;
  if (fields.by) airtableFields[HAUL_FIELDS.BY] = fields.by;
  if (fields.thrownBack !== undefined) airtableFields[HAUL_FIELDS.THROWN_BACK] = fields.thrownBack;
  if (fields.locationId) airtableFields[HAUL_FIELDS.LOCATIONS] = [fields.locationId];
  if (fields.addedByUserId) airtableFields[HAUL_FIELDS.ADDED_BY] = [fields.addedByUserId];

  const record = await base(TABLES.HAUL).create(airtableFields, { typecast: true });
  return toHaulRecord(record);
}

// ---- Users ----

export async function getUserById(id: string): Promise<UserRecord | null> {
  try {
    const record = await base(TABLES.USERS).find(id);
    return toUserRecord(record);
  } catch {
    return null;
  }
}

// A logged-in user's token *is* their record ID (the Airtable field is a
// RECORD_ID() formula), so validating a token is just fetching that record.
export async function getUserByToken(token: string): Promise<UserRecord | null> {
  return getUserById(token);
}

let usersMapCache: { at: number; map: Map<string, UserRecord> } | null = null;
const USERS_CACHE_MS = 30_000;

export async function getAllUsersMap(): Promise<Map<string, UserRecord>> {
  if (usersMapCache && Date.now() - usersMapCache.at < USERS_CACHE_MS) {
    return usersMapCache.map;
  }
  const records = await base(TABLES.USERS).select({}).all();
  const map = new Map(records.map((r) => [r.id, toUserRecord(r)]));
  usersMapCache = { at: Date.now(), map };
  return map;
}
