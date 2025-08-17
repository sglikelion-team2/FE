import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OnBoarding from '../pages/sorin/OnBoarding';
import UserPreferences from '../components/feature/OnBoarding/UserPreferences'; 
import OnBoardingComplete from '../components/feature/OnBoarding/OnBoardingcomplete'; 
import Quest from '../pages/sorin/Quest';
import CafeDetail from '../pages/yunseo/CafeDetail';
import MapPage from '../pages/yunseo/MapPage';
import QuestComplete from '../components/feature/quest/QuestComplete';
import CafePhoto from "../pages/yunseo/CafePhoto.jsx";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnBoarding />} />
        <Route path="/preferences" element={<UserPreferences/>} />
        <Route path="/complete" element={<OnBoardingComplete/>}/>
        <Route path="/quest" element={<Quest />} />
        <Route path="/cafe" element={<CafeDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/quest-complete" element={<QuestComplete />} />
        <Route path="/cafe-photo" element={<CafePhoto />} />
        
      </Routes>
    </BrowserRouter>
  );
}


