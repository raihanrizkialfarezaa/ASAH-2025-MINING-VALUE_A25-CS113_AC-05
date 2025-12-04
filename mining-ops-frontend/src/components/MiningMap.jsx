import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const siteIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const loadingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dumpingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const FitBounds = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [positions, map]);

  return null;
};

const MiningMap = ({ sites = [], loadingPoints = [], dumpingPoints = [], roads = [], trucks = [] }) => {
  const getPosition = (item) => {
    if (item.latitude && item.longitude) {
      return [parseFloat(item.latitude), parseFloat(item.longitude)];
    }
    if (item.lat && item.lng) {
      return [item.lat, item.lng];
    }
    return null;
  };

  const allPositions = useMemo(() => {
    const positions = [];
    [...sites, ...loadingPoints, ...dumpingPoints, ...trucks].forEach((item) => {
      const pos = getPosition(item);
      if (pos) positions.push(pos);
    });
    return positions;
  }, [sites, loadingPoints, dumpingPoints, trucks]);

  const defaultCenter = [-2.48, 115.52];
  const center = allPositions.length > 0 ? allPositions[0] : defaultCenter;

  const visibleSites = useMemo(() => sites.slice(0, 100), [sites]);
  const visibleLoadingPoints = useMemo(() => loadingPoints.slice(0, 100), [loadingPoints]);
  const visibleDumpingPoints = useMemo(() => dumpingPoints.slice(0, 100), [dumpingPoints]);

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FitBounds positions={allPositions} />

        {visibleSites.map((site) => {
          const pos = getPosition(site);
          if (!pos) return null;
          return (
            <Marker key={`site-${site.id}`} position={pos} icon={siteIcon}>
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-sm text-blue-700">{site.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    <div>Code: {site.code}</div>
                    <div>Type: {site.siteType}</div>
                    {site.capacity && <div>Capacity: {site.capacity.toFixed(2)} ton/day</div>}
                    {site.elevation && <div>Elevation: {site.elevation.toFixed(2)} m</div>}
                    <div className="mt-1 text-gray-500">{site.isActive ? '🟢 Active' : '🔴 Inactive'}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {visibleLoadingPoints.map((lp) => {
          const pos = getPosition(lp);
          if (!pos) return null;
          return (
            <Marker key={`lp-${lp.id}`} position={pos} icon={loadingIcon}>
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-sm text-green-700">{lp.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    <div>Code: {lp.code}</div>
                    <div>Loading Point</div>
                    {lp.coalSeam && <div>Seam: {lp.coalSeam}</div>}
                    <div>Queue: {lp.maxQueueSize} trucks</div>
                    {lp.coalQuality && (
                      <div className="mt-1 text-gray-500">
                        {lp.coalQuality.calorie && <div>Cal: {lp.coalQuality.calorie.toFixed(0)}</div>}
                        {lp.coalQuality.moisture && <div>Moisture: {lp.coalQuality.moisture.toFixed(1)}%</div>}
                      </div>
                    )}
                    <div className="mt-1 text-gray-500">{lp.isActive ? '🟢 Active' : '🔴 Inactive'}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {visibleDumpingPoints.map((dp) => {
          const pos = getPosition(dp);
          if (!pos) return null;
          return (
            <Marker key={`dp-${dp.id}`} position={pos} icon={dumpingIcon}>
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-sm text-purple-700">{dp.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    <div>Code: {dp.code}</div>
                    <div>Dumping Point - {dp.dumpingType}</div>
                    {dp.capacity && <div>Capacity: {dp.capacity.toFixed(2)} ton</div>}
                    {dp.currentStock !== null && dp.currentStock !== undefined && <div>Stock: {dp.currentStock.toFixed(2)} ton</div>}
                    {dp.capacity && dp.currentStock !== null && (
                      <div className="mt-1">
                        <div className="text-gray-500">Utilization: {((dp.currentStock / dp.capacity) * 100).toFixed(1)}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${Math.min((dp.currentStock / dp.capacity) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    )}
                    <div className="mt-1 text-gray-500">{dp.isActive ? '🟢 Active' : '🔴 Inactive'}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {trucks.map((truck) => {
          const pos = getPosition(truck);
          if (!pos) return null;
          return (
            <Marker
              key={`truck-${truck.id}`}
              position={pos}
              icon={
                new L.Icon({
                  iconUrl: 'https://cdn-icons-png.flaticon.com/512/233/233086.png',
                  iconSize: [25, 25],
                })
              }
            >
              <Popup>
                <div className="font-bold">{truck.code}</div>
                <div className="text-sm">{truck.status}</div>
              </Popup>
            </Marker>
          );
        })}

        {roads.map((road) => {
          if (road.path && Array.isArray(road.path)) {
            return <Polyline key={`road-${road.id}`} positions={road.path} color="orange" weight={3} />;
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default MiningMap;
