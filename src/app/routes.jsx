import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from '../components/feature/OnBoarding/SplashScreen'; // 새로 만든 스플래시
import Nickname from '../components/feature/OnBoarding/Nickname'; // 기존 닉네임 컴포넌트

import UserPreferences from '../components/feature/OnBoarding/UserPreferences'; 
import OnBoardingComplete from '../components/feature/OnBoarding/OnBoardingComplete'; 
import Quest from '../pages/sorin/Quest';
import CafeDetail from '../pages/yunseo/CafeDetail';
import MapPage from '../pages/yunseo/MapPage';
import QuestComplete from '../components/feature/quest/QuestComplete';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/*  시작 페이지를 SplashScreen으로 변경 */}
        <Route path="/" element={<SplashScreen />} /> 
        
        {/*  닉네임 페이지에 '/nickname' 경로 할당 */}
        <Route path="/nickname" element={<Nickname />} /> 
        <Route path="/preferences" element={<UserPreferences />} /> 
        <Route path="/complete" element={<OnBoardingComplete/>}/>
        <Route path="/quest" element={<Quest />} />
        <Route path="/cafe" element={<CafeDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/quest-complete" element={<QuestComplete />} />
      </Routes>
    </BrowserRouter>
  );
}


