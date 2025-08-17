import React, { useState, useEffect } from 'react';
import './TopCafesSheet.css';
import { topCafes } from '../../../mocks/cafe-data';
import CafeListItem from './CafeListItem';
import TopDetail from './TopDetail';
import listIcon from '../../../assets/c_0.png';
import detailIcon from '../../../assets/c_1.png';

export default function TopCafesSheet({ topCafesWithDistance, onFindRoute, getRouteInfo, getCurrentLocation, setSelectedMarker }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [nickname, setNickname] = useState('');
  const [isDetailView, setIsDetailView] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState(null);

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

  const handleCafeClick = (cafe) => {
    setSelectedCafe(cafe);
    setIsDetailView(true);
    setIsExpanded(true);
  };
  
  const handleModeChange = (isDetail) => {
    if (isDetail && !selectedCafe && topCafesWithDistance.length > 0) {
      setSelectedCafe(topCafesWithDistance[0]);
    }
    setIsDetailView(isDetail);
    if (!isDetail) {
      setSelectedCafe(null);
    }
  };

  // ⭐️ 다음 카페로 이동하는 함수
  const handleNextCafe = () => {
    if (selectedCafe) {
      const currentIndex = topCafesWithDistance.findIndex(c => c.rank === selectedCafe.rank);
      if (currentIndex < topCafesWithDistance.length - 1) {
        setSelectedCafe(topCafesWithDistance[currentIndex + 1]);
      }
    }
  };

  // ⭐️ 이전 카페로 이동하는 함수
  const handlePrevCafe = () => {
    if (selectedCafe) {
      const currentIndex = topCafesWithDistance.findIndex(c => c.rank === selectedCafe.rank);
      if (currentIndex > 0) {
        setSelectedCafe(topCafesWithDistance[currentIndex - 1]);
      }
    }
  };

  return (
    <div className={`sheet-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="sheet-header">
        <div className="grabber-container" onClick={toggleSheet}>
          <div className="grabber"></div>
        </div>
        <div className="header-content">
          <div className="current-time">{currentTime}</div>
          <h2 className="sheet-title">
            지금 <span className="nickname">{nickname}</span>님에게 딱 맞는 장소 Top 5
          </h2>
          <div className="mode-toggle-icons">
            <img 
              src={listIcon} 
              alt="List View" 
              className={`mode-icon ${!isDetailView ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleModeChange(false);
              }}
            />
            <img 
              src={detailIcon} 
              alt="Detail View" 
              className={`mode-icon ${isDetailView ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleModeChange(true);
              }}
            />
          </div>
        </div>
      </div>
      <div className="cafe-list">
        {isDetailView && selectedCafe ? (
          <TopDetail
            cafe={selectedCafe}
            onFindRoute={onFindRoute}
            getRouteInfo={getRouteInfo}
            getCurrentLocation={getCurrentLocation}
            onNext={handleNextCafe} // ⭐️ prop 전달
            onPrev={handlePrevCafe} // ⭐️ prop 전달
            totalCafes={topCafesWithDistance.length} // ⭐️ 전체 카페 수 전달
          />
        ) : (
          topCafesWithDistance.map(cafe => (
            <CafeListItem
              key={cafe.rank}
              cafe={cafe}
              onFindRoute={onFindRoute}
              getRouteInfo={getRouteInfo}
              getCurrentLocation={getCurrentLocation}
              setSelectedMarker={setSelectedMarker}
              onCafeClick={handleCafeClick}
            />
          ))
        )}
      </div>
    </div>
  );
}