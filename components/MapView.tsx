import React, { useEffect, useRef } from 'react';
import type { Listing, SafetyZone } from '../types';

// Let TypeScript know that L (from Leaflet.js) is available globally
declare const L: any;

interface MapViewProps {
  listings: Listing[];
  safetyZones?: SafetyZone[];
}

const MapView: React.FC<MapViewProps> = ({ listings, safetyZones = [] }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const northernMindanaoCenter: [number, number] = [8.4, 125.0];
    
    const initializeMap = (center: [number, number]) => {
      mapRef.current = L.map(mapContainerRef.current).setView(center, 9);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      
      // Adventure Markers
      listings.forEach(listing => {
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #059669; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white;"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        
        L.marker([listing.lat, listing.lng], { icon }).addTo(mapRef.current)
          .bindPopup(`
            <div style="min-width:150px">
              <img src="${listing.imageUrl}" style="width:100%; height:80px; object-fit:cover; border-radius:4px; margin-bottom:4px;" />
              <b style="color:#059669">${listing.title}</b><br>
              <span style="font-size:10px; color:#666">${listing.location}</span>
            </div>
          `);
      });

      // Safety/Danger Zones (Geofencing)
      safetyZones.forEach(zone => {
        L.circle([zone.lat, zone.lng], {
            color: '#dc2626', // Red 600
            fillColor: '#ef4444', // Red 500
            fillOpacity: 0.3,
            radius: zone.radius
        }).addTo(mapRef.current)
        .bindPopup(`<b style="color:#dc2626">⚠ DANGER ZONE: ${zone.type}</b><br>${zone.description}`);
      });

      // User location
      if (center[0] !== northernMindanaoCenter[0] || center[1] !== northernMindanaoCenter[1]) {
        L.circle(center, {
            color: '#3b82f6',
            fillColor: '#60a5fa',
            fillOpacity: 0.4,
            radius: 1000
        }).addTo(mapRef.current).bindPopup('You are here');
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          initializeMap([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          initializeMap(northernMindanaoCenter);
        }
      );
    } else {
      initializeMap(northernMindanaoCenter);
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };

  }, [listings, safetyZones]);

  return <div ref={mapContainerRef} className="h-full w-full rounded-2xl overflow-hidden shadow-inner" />;
};

export default MapView;