import React, { useState, useEffect, useMemo } from 'react';
import './TopCafesSheet.css';
import { topCafes } from '../../../mocks/cafe-data';
import CafeListItem from './CafeListItem';
import TopDetail from './TopDetail';

import banner_bar from "../../../assets/map/banner.svg";
import line from "../../../assets/map/mode/line.svg";
import sorting_act from "../../../assets/map/mode/sorting_act.svg";
import sorting from "../../../assets/map/mode/sorting.svg";
import viewer_act from "../../../assets/map/mode/viewer_act.svg";
import viewer from "../../../assets/map/mode/viewer.svg";



// 헤더 배지 이미지
import order1 from "../../../assets/map/detail_info/OrderFirst.svg";
import order2 from "../../../assets/map/detail_info/OrderSecond.svg";
import order3 from "../../../assets/map/detail_info/OrderThird.svg";
import order4 from "../../../assets/map/detail_info/OrderFourth.svg";
import order5 from "../../../assets/map/detail_info/OrderFifth.svg";





export default function TopCafesSheet({ topCafesWithDistance, onFindRoute, getRouteInfo, getCurrentLocation, setSelectedMarker }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [nickname, setNickname] = useState('');
  const [isDetailView, setIsDetailView] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [isPhotoView, setIsPhotoView] = useState(false); // ← 추가


  // 정렬
  const toInt = (v) => Number.parseInt(v, 10) || 0;
  const sortedByRank = useMemo(
    () => [...(topCafesWithDistance || [])].sort((a, b) => toInt(a.rank) - toInt(b.rank)),
    [topCafesWithDistance]
  );

  useEffect(() => {
    const now = new Date();
    const formattedTime = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} | ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}pm`;
    setCurrentTime(formattedTime);

    const storedNickname = localStorage.getItem('current_user') || '방문자';
    setNickname(storedNickname);
  }, []);

  const toggleSheet = () => setIsExpanded(!isExpanded);

  const handleCafeClick = (cafe) => {
    setSelectedCafe(cafe);
    setIsDetailView(true);
    setIsExpanded(true);
  };

  const handleModeChange = (isDetail) => {
    if (isDetail) {
      setIsExpanded(true);
      if (!selectedCafe && sortedByRank.length > 0) {
        setSelectedCafe(sortedByRank.find(c => toInt(c.rank) === 1) || sortedByRank[0]);
      }
      setIsDetailView(true);
    } else {
      setIsDetailView(false);
      setSelectedCafe(null);
    }
  };

  // 다음/이전
  const handleNextCafe = () => {
    if (!selectedCafe) return;
    const next = sortedByRank.find(c => toInt(c.rank) === toInt(selectedCafe.rank) + 1);
    if (next) setSelectedCafe(next);
  };

  const handlePrevCafe = () => {
    if (!selectedCafe) return;
    const prev = sortedByRank.find(c => toInt(c.rank) === toInt(selectedCafe.rank) - 1);
    if (prev) setSelectedCafe(prev);
  };



  const orderBadges = [order1, order2, order3, order4, order5];

  const currentIndex = (() => {
    if (!isDetailView) return -1;
    const current = selectedCafe || (sortedByRank[0] ?? null);
    if (!current) return -1;
    const idx = sortedByRank.findIndex(c => toInt(c.rank) === toInt(current.rank));
    return idx; // 0부터 시작 (0=1등)
  })();


return (
  <div className={`sheet-container ${isExpanded ? 'expanded' : ''}`}>
    <div className="sheet-header">
      <div className="grabber-container" onClick={toggleSheet}>
        <img src={banner_bar} alt="" />
      </div>

      <div className="header-content">
        {!isDetailView && (
          <h2 className="sheet-title">
            지금, <span className="nickname">{nickname}</span>님을 위한<br />
            공부자리 Top 5 🔥
          </h2>
        )}

        {isDetailView &&
          !isPhotoView &&
          currentIndex >= 0 &&
          currentIndex < orderBadges.length && (
            <img
              className="order-badge"
              src={orderBadges[currentIndex]}
              alt={`order ${currentIndex + 1}`}
            />
          )}

        {/* 사진 뷰일 때는 상단 토글 아이콘 숨김 */}
        {!isPhotoView && (
          <div className="mode-toggle-icons">
            {/* 리스트(정렬) 모드 아이콘: 활성 시 sorting_act */}
            <img
              src={isDetailView ? sorting : sorting_act}
              alt="List / Sorting View"
              className={`mode-icon ${!isDetailView ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleModeChange(false);
              }}
              width="20px"
            />

            <img src={line} alt="" height="20px" />

            {/* 상세(뷰어) 모드 아이콘: 활성 시 viewer_act */}
            <img
              src={isDetailView ? viewer_act : viewer}
              alt="Detail / Viewer View"
              className={`mode-icon ${isDetailView ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleModeChange(true);
              }}
              width="20px"
            />
          </div>
        )}
      </div>{/* header-content */}
    </div>{/* sheet-header */}

    <div className="cafe-list">
      {isDetailView ? (
        (selectedCafe || sortedByRank?.[0]) ? (
          <TopDetail
            cafe={selectedCafe || sortedByRank[0]}
            onFindRoute={onFindRoute}
            getRouteInfo={getRouteInfo}
            getCurrentLocation={getCurrentLocation}
            onNext={handleNextCafe}
            onPrev={handlePrevCafe}
            totalCafes={sortedByRank.length}
            onViewChange={(v) => setIsPhotoView(v === 'photos')}
          />
        ) : (
          <div className="empty">표시할 장소가 없습니다.</div>
        )
      ) : (
        sortedByRank.map((cafe) => (
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
