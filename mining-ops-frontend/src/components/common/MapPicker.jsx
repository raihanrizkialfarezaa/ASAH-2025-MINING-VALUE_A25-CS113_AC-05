import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapPicker = ({ onLocationSelect, onClose, initialLat, initialLng }) => {
  const [position, setPosition] = useState(null);
  const [searchLat, setSearchLat] = useState('');
  const [searchLng, setSearchLng] = useState('');

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition([parseFloat(initialLat), parseFloat(initialLng)]);
      setSearchLat(initialLat);
      setSearchLng(initialLng);
    } else {
      setPosition([-2.5489, 118.0149]);
    }
  }, [initialLat, initialLng]);

  const handleConfirm = () => {
    if (position) {
      onLocationSelect(position[0], position[1]);
      onClose();
    }
  };

  const handleSearch = () => {
    if (searchLat && searchLng) {
      const lat = parseFloat(searchLat);
      const lng = parseFloat(searchLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        setPosition([lat, lng]);
      }
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setSearchLat(pos.coords.latitude.toString());
          setSearchLng(pos.coords.longitude.toString());
        },
        (error) => {
          alert('Unable to get your location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={24} className="text-blue-600" />
            Select Location on Map
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#f3f4f6',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Latitude</label>
            <input
              type="number"
              step="0.000001"
              value={searchLat}
              onChange={(e) => setSearchLat(e.target.value)}
              placeholder="e.g., -2.5489"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Longitude</label>
            <input
              type="number"
              step="0.000001"
              value={searchLng}
              onChange={(e) => setSearchLng(e.target.value)}
              placeholder="e.g., 118.0149"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
            }}
          >
            Go to Coordinates
          </button>
          <button
            onClick={handleUseMyLocation}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
            }}
          >
            Use My Location
          </button>
        </div>

        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
          }}
        >
          <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
            <strong>Tip:</strong> Click anywhere on the map to select a location
            {position && ` | Selected: ${position[0].toFixed(6)}, ${position[1].toFixed(6)}`}
          </p>
        </div>

        <div style={{ height: '500px', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
          {position && (
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} key={position.join(',')}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!position}
            style={{
              padding: '10px 24px',
              backgroundColor: position ? '#3b82f6' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: position ? 'pointer' : 'not-allowed',
              fontWeight: '500',
              fontSize: '14px',
            }}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
