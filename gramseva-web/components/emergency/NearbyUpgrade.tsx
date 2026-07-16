// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useState, useCallback } from 'react';

interface Coords {
  lat: number;
  lng: number;
}

interface EmergencyService {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'fire' | 'ambulance';
  lat: number;
  lng: number;
  phone: string;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateTravelTime(distanceKm: number): string {
  const walking = Math.round(distanceKm / 5 * 60);
  const driving = Math.round(distanceKm / 30 * 60);
  if (distanceKm < 1) return `${driving} min drive / ${walking} min walk`;
  return `${driving} min drive`;
}

interface NearbyUpgradeProps {
  services?: EmergencyService[];
}

export default function NearbyUpgrade({ services = [] }: NearbyUpgradeProps) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported / जियोलोकेशन समर्थित नहीं है');
      return;
    }
    setLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setGeoError('Could not get location. / स्थान प्राप्त नहीं कर सके।');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  const nearbyWithDistances = coords
    ? services
        .map((s) => ({
          ...s,
          distance: haversineDistance(coords.lat, coords.lng, s.lat, s.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">📍</span>
        <h2 className="text-base font-bold text-gray-800">Nearby Services / नजदीकी सेवाएं</h2>
      </div>

      {!coords && !geoError && (
        <button
          onClick={handleLocate}
          disabled={loading}
          className="w-full py-3 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 disabled:opacity-60 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          {loading ? '📍 Detecting... / खोज रहा है...' : '📍 Detect My Location / मेरा स्थान खोजें'}
        </button>
      )}

      {geoError && (
        <div className="flex items-center gap-2">
          <p className="text-xs text-red-600" role="alert">{geoError}</p>
          <button onClick={handleLocate} className="py-1.5 px-3 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200 transition-colors">Retry</button>
        </div>
      )}

      {coords && nearbyWithDistances.length === 0 && (
        <p className="text-xs text-gray-500">No nearby services found. / कोई नजदीकी सेवा नहीं मिली।</p>
      )}

      {coords && nearbyWithDistances.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            📍 {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://www.google.com/maps/search/hospital/@${coords.lat},${coords.lng},15z`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-green-600 text-white text-xs font-medium rounded-xl text-center hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              🏥 Hospitals
            </a>
            <a
              href={`https://www.google.com/maps/search/police+station/@${coords.lat},${coords.lng},15z`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-blue-600 text-white text-xs font-medium rounded-xl text-center hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              👮 Police
            </a>
            <a
              href={`https://www.google.com/maps/search/ambulance/@${coords.lat},${coords.lng},15z`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-red-600 text-white text-xs font-medium rounded-xl text-center hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              🚑 Ambulance
            </a>
            <a
              href={`https://www.google.com/maps/dir/${coords.lat},${coords.lng}/emergency+services`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-purple-600 text-white text-xs font-medium rounded-xl text-center hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              🗺️ Directions
            </a>
          </div>

          <div className="space-y-1.5 mt-2">
            {nearbyWithDistances.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base flex-shrink-0" aria-hidden="true">
                    {s.type === 'hospital' ? '🏥' : s.type === 'police' ? '👮' : s.type === 'fire' ? '🚒' : '🚑'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{s.name}</p>
                    <p className="text-[10px] text-gray-400">{s.distance.toFixed(1)} km — {estimateTravelTime(s.distance)}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <a
                    href={`tel:${s.phone}`}
                    className="px-2.5 py-1.5 bg-red-600 text-white text-[10px] font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label={`Call ${s.name}`}
                  >
                    Call
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/${coords!.lat},${coords!.lng}/${s.lat},${s.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="px-2.5 py-1.5 bg-blue-600 text-white text-[10px] font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label={`Directions to ${s.name}`}
                  >
                    Route
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {services.length === 0 && coords && (
        <p className="text-xs text-gray-500 mt-2">
          No local data available. Use the navigation buttons above to search on Google Maps.
          / कोई स्थानीय डेटा उपलब्ध नहीं है। Google Maps पर खोजने के लिए ऊपर नेविगेशन बटन का उपयोग करें।
        </p>
      )}
    </div>
  );
}
