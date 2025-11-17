import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import { useUserLocation } from "../hooks/useUserLocation";
import { getIconForSport } from "../lib/markerIcons";
import mockApi from "../lib/mockApi";
import {
  inferSportFromText,
  parseLatLngFromGoogleMaps,
} from "../lib/parseEventLocation";

type Props = {};

function RecenterMap({
  coords,
}: {
  coords: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  React.useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], 13);
  }, [coords, map]);
  return null;
}

export const ActivitiesMap: React.FC<Props> = () => {
  const { coords, loading } = useUserLocation();
  const [activities, setActivities] = React.useState<any[]>([]);

  const center = coords ?? { lat: -27.6, lng: -48.5 };

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const raw = await mockApi.getActivities();
        const parsed = raw
          .map((r: any) => {
            const latlng = parseLatLngFromGoogleMaps(r.location_url || "");
            const sport = inferSportFromText(
              r.title || "",
              r.description || ""
            );
            return { ...r, coords: latlng, sport };
          })
          .filter((it: any) => it.coords); // skip events without coords
        if (mounted) setActivities(parsed);
      } catch (e) {
        console.error("Failed to load activities for map", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="h-full min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-semibold">Explore Activities</h1>
            <p className="text-sm text-gray-500">
              Find sports and events near you
            </p>
          </div>
          <div className="h-[70vh]">
            <MapContainer
              center={[center.lat, center.lng]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <RecenterMap coords={coords} />

              {activities.map((a) => (
                <Marker
                  key={a.id}
                  position={[a.coords.lat, a.coords.lng]}
                  icon={getIconForSport(a.sport)}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-semibold">{a.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {renderSportLine(a.sport)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(a.date)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Participants: {a.participants ?? "—"}
                      </p>
                      <div className="mt-3 flex justify-end">
                        <button className="px-3 py-1 rounded bg-indigo-600 text-white text-sm shadow">
                          View details
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <Link
          to="/"
          title="Return to list"
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-full shadow-lg border border-gray-100 hover:shadow-xl transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Back to list
          </span>
        </Link>
      </div>

      {loading && (
        <div className="fixed top-6 right-6 bg-white px-3 py-2 rounded shadow text-sm text-gray-600">
          Detecting location…
        </div>
      )}
    </div>
  );
};

function renderSportLine(sport: string) {
  switch (sport) {
    case "yoga":
      return "🧘 Yoga";
    case "soccer":
      return "⚽ Soccer";
    case "running":
      return "🏃 Running";
    case "cycling":
      return "🚴 Cycling";
    case "concert":
      return "🎵 Concert";
    case "market":
      return "🧺 Market";
    default:
      return sport;
  }
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return iso;
  }
}

export default ActivitiesMap;
