// src/components/feature/map/TopCafesSheet.jsx
import React, { useState, useEffect } from 'react';
import './TopCafesSheet.css';
import { topCafes } from '../../../mocks/cafe-data';
import CafeListItem from './CafeListItem';

export default function TopCafesSheet({ topCafesWithDistance, onFindRoute, getRouteInfo, getCurrentLocation, setSelectedMarker }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const now = new Date();
    const formattedTime = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} | ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}pm`;
    setCurrentTime(formattedTime);

    const storedNickname = localStorage.getItem('current_user') || '방문자';
    setNickname(storedNickname);
  }, []);

  const toggleSheet = () => {
    setIsExpanded(!isExpanded);
  };

  return (
 <div className={`sheet-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="sheet-header" onClick={toggleSheet}>
        <div className="grabber"></div>
        <div className="header-content">
          <div className="current-time">{currentTime}</div>
          <h2 className="sheet-title">
            지금 <span className="nickname">{nickname}</span>님에게 딱 맞는 장소 Top 5
          </h2>
        </div>
      </div>
      <div className="cafe-list">
{topCafesWithDistance.map(cafe => (
                    <CafeListItem
            key={cafe.rank}
            cafe={cafe}
            onFindRoute={onFindRoute} // 👈 prop 전달
            getRouteInfo={getRouteInfo}
            getCurrentLocation={getCurrentLocation}
            setSelectedMarker={setSelectedMarker}
          />
        ))}
      </div>
    </div>
  );
}