
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import type { Listing, SafetyZone } from '../types';

// Let TypeScript know that L (from Leaflet.js) is available globally
declare const L: any;

export interface MapViewHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  centerOnUser: () => void;
  flyTo: (lat: number, lng: number) => void;
}

export type MapLayerType = 'standard' | 'satellite' | 'hybrid' | 'terrain';

interface MapViewProps {
  listings: Listing[];
  safetyZones?: SafetyZone[];
  radiusKm?: number;
  userLocation?: { lat: number; lng: number };
  pitch?: number;
  bearing?: number;
  layerType?: MapLayerType;
  route?: {
    from: { lat: number; lng: number };
    to: { lat: number; lng: number };
  } | null;
}

const MapView = forwardRef<MapViewHandle, MapViewProps>(({ 
  listings, 
  safetyZones = [], 
  radiusKm = 50, 
  userLocation = { lat: 8.4542, lng: 124.6319 }, // Default to CDO
  pitch = 0,
  bearing = 0,
  layerType = 'standard',
  route = null
}, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const radiusLayerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const hybridLabelLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      mapRef.current?.zoomIn();
    },
    zoomOut: () => {
      mapRef.current?.zoomOut();
    },
    centerOnUser: () => {
      if (mapRef.current) {
        mapRef.current.flyTo([userLocation.lat, userLocation.lng], 14, {
           animate: true,
           duration: 1.5
        });
      }
    },
    flyTo: (lat: number, lng: number) => {
      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], 16, {
           animate: true,
           duration: 1.5
        });
      }
    }
  }));

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([userLocation.lat, userLocation.lng], 10);
    }
  }, []); // Run once on mount

  // Handle Layer Changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous layers
    if (tileLayerRef.current) mapRef.current.removeLayer(tileLayerRef.current);
    if (hybridLabelLayerRef.current) mapRef.current.removeLayer(hybridLabelLayerRef.current);

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap';

    if (layerType === 'satellite' || layerType === 'hybrid') {
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if (layerType === 'terrain') {
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community';
    }

    tileLayerRef.current = L.tileLayer(url, {
        attribution: attribution,
        maxZoom: 19
    }).addTo(mapRef.current);

    // Add labels for Hybrid
    if (layerType === 'hybrid') {
        hybridLabelLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19
        }).addTo(mapRef.current);
    }

  }, [layerType]);

  // Handle Markers, Radius, Route, and View Updates
  useEffect(() => {
    if (!mapRef.current) return;

    // Apply 3D tilt and bearing effect via CSS
    if (mapContainerRef.current) {
        // We need to scale up the map container when rotating or tilting to avoid seeing whitespace edges.
        const needsScale = pitch > 0 || (bearing % 360 !== 0);
        const scale = needsScale ? 1.6 : 1;
        
        mapContainerRef.current.style.transform = `perspective(1000px) rotateX(${pitch}deg) rotateZ(${bearing}deg) scale(${scale})`;
        mapContainerRef.current.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
    }

    // Clear existing markers/layers
    markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
    markersRef.current = [];
    if (radiusLayerRef.current) mapRef.current.removeLayer(radiusLayerRef.current);
    if (routeLayerRef.current) mapRef.current.removeLayer(routeLayerRef.current);
    if (destinationMarkerRef.current) mapRef.current.removeLayer(destinationMarkerRef.current);

    // Draw Route (Navigation)
    if (route) {
        const latlngs = [
            [route.from.lat, route.from.lng],
            [route.to.lat, route.to.lng]
        ];
        
        // Dashed line to simulate route
        routeLayerRef.current = L.polyline(latlngs, {
            color: '#3b82f6', // Blue for navigation
            weight: 6,
            opacity: 0.8,
            dashArray: '10, 10',
            lineJoin: 'round'
        }).addTo(mapRef.current);

        // Fit bounds to show the whole route
        mapRef.current.fitBounds(L.latLngBounds(latlngs).pad(0.2));

        // Destination Marker
        const destIcon = L.divIcon({
            className: 'dest-marker',
            html: `<div style="font-size: 24px; transform: rotate(${-bearing}deg);">📍</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });
        destinationMarkerRef.current = L.marker([route.to.lat, route.to.lng], { icon: destIcon })
            .addTo(mapRef.current)
            .bindPopup("Destination");
            
    } else {
        // Draw Radius Circle if NO route is active (to avoid clutter)
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
    }

    // User Marker
    // We counter-rotate markers inside the HTML to keep them upright relative to the screen
    const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); transform: scale(${route ? 1.2 : 1}) rotate(${-bearing}deg);"></div>`,
        iconSize: [16, 16]
    });
    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(mapRef.current).bindPopup("You are here");
    markersRef.current.push(userMarker);

    // Listing Markers (Only show if NOT routing, or show dimmed)
    if (!route) {
        listings.forEach(listing => {
          const icon = L.divIcon({
            className: 'custom-listing-marker',
            html: `
              <div style="position: relative; width: 40px; height: 40px; transform: rotate(${-bearing}deg);">
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
    }

  }, [listings, safetyZones, radiusKm, pitch, bearing, userLocation, route, layerType]);

  return <div ref={mapContainerRef} className="h-full w-full rounded-2xl overflow-hidden shadow-inner bg-stone-100" />;
});

export default MapView;
