import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from "https://esm.run/@googlemaps/js-api-loader";
import { darkMapStyle, lightMapStyle } from './mapStyles';
import { CenterFocusIcon } from './icons/CenterFocusIcon';

interface Location {
  lat: number;
  lng: number;
}
interface Event {
  time: string;
  description: string;
  location?: Location;
}
interface ItineraryDay {
  day: string;
  date: string;
  title: string;
  events: Event[];
}
interface MapComponentProps {
  dayData: ItineraryDay | null;
  isDarkMode: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({ dayData, isDarkMode }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // FIX: Use `any` for Google Maps types as the `google` namespace is not available at compile time without the appropriate @types package.
  const mapInstance = useRef<any | null>(null);
  const infoWindow = useRef<any | null>(null);
  const activeMarkers = useRef<any[]>([]);
  const directionsRenderer = useRef<any | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    // Set API key and other static options for the loader
    setOptions({
      apiKey: process.env.API_KEY!,
      version: "weekly",
    });

    const initMap = async () => {
      if (!mapRef.current || !isMounted.current) return;
      
      try {
        // FIX: Remove type casting as the `google` namespace is not available at compile time.
        const { Map } = await importLibrary("maps");
        const { AdvancedMarkerElement } = await importLibrary("marker");
        const { DirectionsRenderer } = await importLibrary("routes");
        const { InfoWindow } = await importLibrary("maps");

        if (!isMounted.current) return;

        mapInstance.current = new Map(mapRef.current, {
          center: { lat: -33.4489, lng: -70.6693 }, // Santiago
          zoom: 12,
          disableDefaultUI: true,
          mapId: isDarkMode ? 'DARK_MODE_MAP' : 'LIGHT_MODE_MAP',
          styles: isDarkMode ? darkMapStyle : lightMapStyle,
        });

        infoWindow.current = new InfoWindow({
            minWidth: 200,
        });

        directionsRenderer.current = new DirectionsRenderer({
            map: mapInstance.current,
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: isDarkMode ? '#38bdf8' : '#0284c7',
                strokeOpacity: 0.8,
                strokeWeight: 6,
            },
        });
        
        if (dayData) {
          updateMap(dayData);
        }

      } catch (e) {
        console.error("Failed to load Google Maps libraries", e);
      }
    };

    const clearMap = () => {
      activeMarkers.current.forEach(marker => marker.map = null);
      activeMarkers.current = [];
      if (directionsRenderer.current) {
          directionsRenderer.current.setDirections({ routes: [] });
      }
      if (isMounted.current) {
        setRouteInfo(null);
      }
    };
    
    const updateMap = async (currentDayData: ItineraryDay) => {
      if (!mapInstance.current || !isMounted.current) return;

      clearMap();
      
      // FIX: Remove type casting as the `google` namespace is not available at compile time.
      const { AdvancedMarkerElement } = await importLibrary("marker");
      const { DirectionsService, TravelMode, DirectionsStatus } = await importLibrary("routes");
      const { LatLngBounds } = await importLibrary("core");

      const locations = currentDayData.events.filter(event => event.location).map(e => ({...e.location!, description: e.description}));
      if (locations.length === 0) return;

      const bounds = new LatLngBounds();
      
      locations.forEach((loc, index) => {
          const pin = document.createElement('div');
          pin.className = 'w-8 h-8 rounded-full bg-brand-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-lg';
          pin.textContent = String(index + 1);

          const marker = new AdvancedMarkerElement({
              position: loc,
              map: mapInstance.current,
              title: loc.description,
              content: pin,
          });

          marker.addListener('click', () => {
              if (infoWindow.current) {
                infoWindow.current.setContent(`<div class="font-sans p-1 text-gray-800"><strong class="font-bold">${loc.description}</strong></div>`);
                infoWindow.current.open(mapInstance.current, marker);
              }
          });

          activeMarkers.current.push(marker);
          bounds.extend(loc);
      });

      if (locations.length > 1) {
          const directionsService = new DirectionsService();
          const origin = locations[0];
          const destination = locations[locations.length - 1];
          const waypoints = locations.slice(1, -1).map(loc => ({ location: loc, stopover: true }));

          directionsService.route(
              {
                  origin: origin,
                  destination: destination,
                  waypoints: waypoints,
                  travelMode: TravelMode.DRIVING,
              },
              (result, status) => {
                  if (status === DirectionsStatus.OK && result) {
                      if (directionsRenderer.current) {
                        directionsRenderer.current.setDirections(result);
                      }
                      
                      const route = result.routes[0];
                      let totalDistance = 0;
                      let totalDuration = 0;
                      for (const leg of route.legs) {
                          totalDistance += leg.distance?.value || 0;
                          totalDuration += leg.duration?.value || 0;
                      }

                      if (isMounted.current) {
                        setRouteInfo({ 
                            distance: `${(totalDistance / 1000).toFixed(1)} km`, 
                            duration: `${Math.round(totalDuration / 60)} min`
                        });
                      }
                  } else {
                      console.error(`Directions request failed due to ${status}`);
                  }
              }
          );
      }
      
      mapInstance.current.fitBounds(bounds, 100);
    };
    
    initMap();
    
    return () => {
        isMounted.current = false;
    };
  }, [dayData, isDarkMode]);

  const handleRecenter = async () => {
    if (!mapInstance.current || activeMarkers.current.length === 0) return;
    // FIX: Remove type casting as the `google` namespace is not available at compile time.
    const { LatLngBounds } = await importLibrary("core");
    const bounds = new LatLngBounds();
    activeMarkers.current.forEach(marker => bounds.extend(marker.position!));
    mapInstance.current.fitBounds(bounds, 100);
  };

  return (
    <div className="w-full h-full relative">
        <div ref={mapRef} className="w-full h-full" />
        {routeInfo && (
            <div className="absolute top-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 rounded-lg p-3 shadow-lg text-sm">
                <p><strong>Distância:</strong> {routeInfo.distance}</p>
                <p><strong>Duração Est.:</strong> {routeInfo.duration}</p>
            </div>
        )}
        <button
            onClick={handleRecenter}
            className="absolute bottom-6 right-6 w-14 h-14 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-lg hover:bg-white dark:hover:bg-slate-700 hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out"
            aria-label="Centralizar no Roteiro"
            title="Centralizar no Roteiro"
        >
          <CenterFocusIcon className="w-6 h-6" />
        </button>
    </div>
  );
};
