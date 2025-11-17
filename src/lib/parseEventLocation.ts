type Parsed = { lat: number; lng: number } | null;

export function parseLatLngFromGoogleMaps(url: string): Parsed {
  try {
    const u = new URL(url);
    const q = u.searchParams.get("q");
    if (!q) return null;
    const parts = q.split(",");
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    return null;
  } catch (e) {
    return null;
  }
}

export function inferSportFromText(title: string, description?: string) {
  const txt = (title + " " + (description || "")).toLowerCase();
  if (txt.includes("yoga")) return "yoga";
  if (txt.includes("soccer") || txt.includes("football")) return "soccer";
  if (txt.includes("run") || txt.includes("running")) return "running";
  if (txt.includes("bike") || txt.includes("cycling")) return "cycling";
  if (txt.includes("market") || txt.includes("farmers")) return "market";
  if (txt.includes("concert") || txt.includes("band") || txt.includes("music"))
    return "concert";
  return "other";
}
