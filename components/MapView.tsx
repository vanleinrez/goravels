
import React, { useEffect, useRef } from 'react';
import type { Listing, SafetyZone } from '../types';

// Let TypeScript know that L (from Leaflet.js) is available globally
declare const L: any;

interface MapViewProps {
  listings: Listing[];
  safetyZones?: SafetyZone[];
  radiusKm?: number;
  userLocation?: { lat: number; lng: number };
  is3DMode?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ 
  listings, 
  safetyZones = [], 
  radiusKm = 50, 
  userLocation = { lat: 8.4542, lng: 124.6319 }, // Default to CDO
  is3DMode = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const radiusLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([userLocation.lat, userLocation.lng], 9);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(mapRef.current);
    }

    // Apply 3D tilt effect via CSS class on container
    if (mapContainerRef.current) {
        if (is3DMode) {
            mapContainerRef.current.style.transform = "perspective(1000px) rotateX(30deg) scale(1.1)";
        } else {
            mapContainerRef.current.style.transform = "none";
        }
        mapContainerRef.current.style.transition = "transform 0.5s ease-in-out";
    }

    // Clear existing markers
    markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
    markersRef.current = [];

    // Clear existing radius
    if (radiusLayerRef.current) {
        mapRef.current.removeLayer(radiusLayerRef.current);
    }

    // Draw Radius Circle
    if (radiusKm > 0) {
        radiusLayerRef.current = L.circle([userLocation.lat, userLocation.lng], {
            color: '#059669', // Emerald 600
            fillColor: '#10b981', // Emerald 500
            fillOpacity: 0.1,
            radius: radiusKm * 1000,
            weight: 1,
            dashArray: '5, 5'
        }).addTo(mapRef.current);
    }

    // User Marker
    const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16]
    });
    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(mapRef.current).bindPopup("You are here");
    markersRef.current.push(userMarker);

    // Calculate distance and filter
    const filteredListings = listings.filter(l => {
        const R = 6371; // km
        const dLat = (l.lat - userLocation.lat) * Math.PI / 180;
        const dLon = (l.lng - userLocation.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(l.lat * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c;
        return d <= radiusKm;
    });

    // Adventure Markers
    filteredListings.forEach(listing => {
      const icon = L.divIcon({
        className: 'custom-listing-marker',
        html: `
          <div style="position: relative; width: 40px; height: 40px;">
             <div style="
                width: 36px; 
                height: 36px; 
                border-radius: 50%; 
                border: 2px solid white; 
                overflow: hidden; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                background: white;
                position: absolute;
                top: 0;
                left: 2px;
                z-index: 10;
             ">
                <img src="${listing.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
             </div>
             <div style="
                width: 0; 
                height: 0; 
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 8px solid white;
                position: absolute;
                bottom: 0px;
                left: 14px;
             "></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });
      
      const marker = L.marker([listing.lat, listing.lng], { icon }).addTo(mapRef.current);
      
      const popupContent = `
        <div style="min-width: 200px; font-family: 'Inter', sans-serif;">
          <div style="position: relative; height: 100px; width: 100%; overflow: hidden; border-radius: 8px 8px 0 0;">
             <img src="${listing.imageUrl}" style="width:100%; height:100%; object-fit:cover;" />
             <span style="position: absolute; top: 8px; right: 8px; background: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; color: #059669;">₱${listing.price}</span>
          </div>
          <div style="padding: 8px;">
             <h3 style="margin: 0; font-size: 14px; font-weight: bold; color: #1f2937;">${listing.title}</h3>
             <p style="margin: 4px 0 0; font-size: 11px; color: #6b7280;">${listing.location}</p>
             <div style="margin-top: 6px; display: flex; align-items: center;">
                 <span style="color: #f59e0b; font-size: 12px;">★</span>
                 <span style="font-size: 12px; font-weight: 600; margin-left: 2px;">${listing.rating}</span>
                 <span style="font-size: 10px; color: #9ca3af; margin-left: 4px;">(${listing.reviews})</span>
             </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });

    // Safety/Danger Zones
    safetyZones.forEach(zone => {
      const zoneLayer = L.circle([zone.lat, zone.lng], {
          color: '#dc2626', 
          fillColor: '#ef4444', 
          fillOpacity: 0.2,
          radius: zone.radius,
          weight: 1
      }).addTo(mapRef.current)
      .bindPopup(`<b style="color:#dc2626">⚠ DANGER ZONE: ${zone.type}</b><br>${zone.description}`);
      markersRef.current.push(zoneLayer);
    });

  }, [listings, safetyZones, radiusKm, is3DMode]);

  return <div ref={mapContainerRef} className="h-full w-full rounded-2xl overflow-hidden shadow-inner bg-stone-100" />;
};

export default MapView;
