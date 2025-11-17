import L from "leaflet";

const baseStyle = `display:flex;align-items:center;justify-content:center;border-radius:50%;width:36px;height:36px;font-size:18px;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.15);`;

export function getIconForSport(sport: string) {
  let bg = "#3b82f6";
  let emoji = "🏃";

  switch (sport) {
    case "yoga":
      bg = "#10b981";
      emoji = "🧘";
      break;
    case "soccer":
      bg = "#f97316";
      emoji = "⚽️";
      break;
    case "running":
      bg = "#ef4444";
      emoji = "🏃‍♀️";
      break;
    case "cycling":
      bg = "#8b5cf6";
      emoji = "🚴";
      break;
    case "concert":
      bg = "#06b6d4";
      emoji = "🎵";
      break;
    case "market":
      bg = "#f59e0b";
      emoji = "🧺";
      break;
    default:
      bg = "#3b82f6";
      emoji = "📍";
  }

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="${baseStyle}background:${bg};">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}
