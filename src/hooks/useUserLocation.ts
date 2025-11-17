import { useEffect, useState } from "react";

type PositionState = {
  coords: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
};

const DEFAULT_POS = { lat: -27.6, lng: -48.5 };

export function useUserLocation() {
  const [state, setState] = useState<PositionState>({
    coords: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    if (!("geolocation" in navigator)) {
      if (mounted)
        setState({
          coords: DEFAULT_POS,
          loading: false,
          error: "Geolocation not supported",
        });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mounted) return;
        setState({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          loading: false,
          error: null,
        });
      },
      (err) => {
        if (!mounted) return;
        setState({
          coords: DEFAULT_POS,
          loading: false,
          error: err.message || "Permission denied",
        });
      },
      { maximumAge: 1000 * 60 * 5, timeout: 5000 }
    );

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
