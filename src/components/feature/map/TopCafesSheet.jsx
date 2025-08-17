import React, { useState, useEffect, useMemo } from 'react';
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


  ///정렬

    const toInt = (v) => Number.parseInt(v, 10) || 0;
    const sortedByRank = useMemo(
    () => [...(topCafesWithDistance || [])].sort((a, b) => toInt(a.rank) - toInt(b.rank)),
   [topCafesWithDistance]
    );


  ///

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
   if (isDetail) {
     // 상세 모드 진입 시: 시트 펼치기 + 기본 카페 선택
     setIsExpanded(true);
     if (!selectedCafe && sortedByRank.length > 0) {
       // rank=1이 있으면 그걸, 없으면 첫 요소
      setSelectedCafe(sortedByRank.find(c => toInt(c.rank) === 1) || sortedByRank[0]);
       }
     setIsDetailView(true);
   } else {
     setIsDetailView(false);
     setSelectedCafe(null);
   }
 };

  // ⭐️ 다음 카페로 이동하는 함수
 const handleNextCafe = () => {
   if (!selectedCafe) return;
   const next = sortedByRank.find(c => toInt(c.rank) === toInt(selectedCafe.rank) + 1);
  if (next) setSelectedCafe(next);
 };

  // ⭐️ 이전 카페로 이동하는 함수
 const handlePrevCafe = () => {
   if (!selectedCafe) return;
   const prev = sortedByRank.find(c => toInt(c.rank) === toInt(selectedCafe.rank) - 1);
   if (prev) setSelectedCafe(prev);
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
   {isDetailView ? (
     (selectedCafe || sortedByRank?.[0])
     ? <TopDetail
        cafe={selectedCafe || sortedByRank[0]}
         onFindRoute={onFindRoute}
         getRouteInfo={getRouteInfo}
         getCurrentLocation={getCurrentLocation}
         onNext={handleNextCafe}
         onPrev={handlePrevCafe}
         totalCafes={sortedByRank.length}
       />
    : <div className="empty">표시할 장소가 없습니다.</div>
 ) : (
          sortedByRank.map(cafe => (
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