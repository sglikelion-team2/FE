import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapPage = () => {
  const center = { lat: 37.5665, lng: 126.9780 }; // 서울 위치 예시
  const top5Stores = [
    { id: 1, name: '카페A', lat: 37.5667, lng: 126.9781, status: '여유' },
    { id: 2, name: '카페B', lat: 37.5670, lng: 126.9790, status: '혼잡' },
    // Top5 매장 데이터
  ];

  return (
    <div className="map-page">
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap center={center} zoom={12} mapContainerStyle={{ height: '400px', width: '100%' }}>
          {top5Stores.map((store) => (
            <Marker key={store.id} position={{ lat: store.lat, lng: store.lng }} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapPage;
