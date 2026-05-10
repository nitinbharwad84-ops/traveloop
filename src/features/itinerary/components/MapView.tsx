'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { TripStopData } from '@/services/itinerary.service';

// Mock geocoding since we don't have lat/lng in DB schema
// Ideally, this would call an API or use DB fields.
const MOCK_COORDS: Record<string, [number, number]> = {
  'Tokyo': [35.6762, 139.6503],
  'Kyoto': [35.0116, 135.7681],
  'Osaka': [34.6937, 135.5023],
  'London': [51.5074, -0.1278],
  'Paris': [48.8566, 2.3522],
  'New York': [40.7128, -74.0060],
  'San Francisco': [37.7749, -122.4194],
  'Dubai': [25.2048, 55.2708],
  'Rome': [41.9028, 12.4964],
};

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// Pseudo-random coordinates for unknown cities to ensure they render on map
function getMockCoords(city: string): [number, number] {
  if (MOCK_COORDS[city]) return MOCK_COORDS[city];
  
  // Generate stable deterministic "random" coords based on city name
  // Just so something renders if the user types a random city
  const hash1 = hashString(city);
  const hash2 = hashString(city + 'x');
  
  // Restrict to Europe roughly for visual appeal if random
  const lat = 45 + (hash1 % 15);
  const lng = 5 + (hash2 % 20);
  
  return [lat, lng];
}

interface MapViewProps {
  stops: TripStopData[];
}

export default function MapView({ stops }: MapViewProps) {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<unknown>(null);

  useEffect(() => {
    // Dynamically import leaflet to avoid SSR window errors
    import('leaflet').then((leaflet) => {
      // Fix leaflet default icon issue
      delete (leaflet.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setL(leaflet);
      setMounted(true);
    });
  }, []);

  if (!mounted || !L) return <div className="h-[500px] w-full rounded-2xl bg-muted animate-pulse flex items-center justify-center">Loading map...</div>;

  const validStops = stops.filter(s => s.cityName);
  
  const mapData = validStops.map(s => {
    return {
      ...s,
      coords: getMockCoords(s.cityName)
    };
  });

  // @ts-expect-error mapData[0].coords may be undefined at runtime but is always set here
  const centerCoords = mapData.length > 0 ? mapData[0].coords : [20, 0];
  const positions = mapData.map(d => d.coords);

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border shadow-sm relative z-0">
      <MapContainer center={centerCoords as [number, number]} zoom={mapData.length > 0 ? 5 : 2} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mapData.map((stop, i) => (
          <Marker key={stop.id} position={stop.coords}>
            <Popup>
              <div className="font-semibold text-sm">{i+1}. {stop.cityName}</div>
              <div className="text-xs text-muted-foreground">{stop.countryName}</div>
              <div className="text-xs mt-1">{stop.tripActivities.length} activities</div>
            </Popup>
          </Marker>
        ))}

        {positions.length > 1 && (
          <Polyline 
            positions={positions as [number, number][]} 
            pathOptions={{ color: 'hsl(var(--primary))', weight: 3, dashArray: '10, 10' }} 
          />
        )}
      </MapContainer>
    </div>
  );
}
