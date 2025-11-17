export type Activity = {
  id: number;
  title: string;
  sport: "yoga" | "concert" | "market" | "soccer" | "running" | "cycling";
  date: string;
  participants: number;
  coords: { lat: number; lng: number };
};

export const sampleActivities: Activity[] = [
  {
    id: 1,
    title: "Riverside Yoga",
    sport: "yoga",
    date: "2025-11-20T09:00:00.000Z",
    participants: 12,
    coords: { lat: -27.5954, lng: -48.548 },
  },
  {
    id: 2,
    title: "Community Soccer Match",
    sport: "soccer",
    date: "2025-11-22T17:00:00.000Z",
    participants: 22,
    coords: { lat: -27.6, lng: -48.51 },
  },
  {
    id: 3,
    title: "Evening Run Group",
    sport: "running",
    date: "2025-11-21T18:30:00.000Z",
    participants: 8,
    coords: { lat: -27.605, lng: -48.52 },
  },
  {
    id: 4,
    title: "Bike Tour Downtown",
    sport: "cycling",
    date: "2025-11-23T09:30:00.000Z",
    participants: 15,
    coords: { lat: -27.59, lng: -48.53 },
  },
];
