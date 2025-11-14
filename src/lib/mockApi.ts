import eventsSeed from "../data/events.json";

const STORAGE_KEY = "city-events.activities";

function seedIfEmpty() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsSeed));
  }
}

export async function getActivities(): Promise<any[]> {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 250));
  seedIfEmpty();
  const raw = localStorage.getItem(STORAGE_KEY) || "[]";
  try {
    const data = JSON.parse(raw);
    // Return a copy sorted by date asc
    return [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (e) {
    console.error("Failed to parse activities from storage", e);
    return [];
  }
}

export async function addActivity(activity: any) {
  seedIfEmpty();
  const raw = localStorage.getItem(STORAGE_KEY) || "[]";
  const data = JSON.parse(raw);
  const nextId =
    data.reduce((max: number, it: any) => Math.max(max, it.id || 0), 0) + 1;
  const toSave = { ...activity, id: nextId };
  data.push(toSave);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  await new Promise((res) => setTimeout(res, 150));
  return toSave;
}

export async function resetSeed() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsSeed));
}

export default { getActivities, addActivity, resetSeed };
