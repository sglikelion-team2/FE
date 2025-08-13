import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OnBoarding from '../pages/sorin/OnBoarding';
import Quest from '../pages/sorin/Quest';
import CafeDetail from '../pages/yunseo/CafeDetail';
import MapPage from '../pages/yunseo/MapPage';



// MapPage 컴포넌트를 import하세요. (예: import MapPage from '../pages/yunseo/MapPage';)

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnBoarding />} />
        <Route path="/quest/:id" element={<Quest />} />
        <Route path="/cafe" element={<CafeDetail />} />
        <Route path="/map" element={<MapPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}