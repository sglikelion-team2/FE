// markerDetail.jsx
import React, { useState } from 'react';
import '../../components/feature/map/TopCafesSheet.css';

export default function MarkerDetail({ markerInfo, onClose, onFindRoute }) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!markerInfo) {
    return null;
  }
  
  // ✅ props에서 거리, 시간 정보도 구조 분해
  const { title, desc, coords, distance, time } = markerInfo;

  const toggleSheet = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`sheet-container ${isExpanded ? 'expanded' : ''}`}
      style={{ zIndex: 9999, height: '600px' }}
    >
      <div className="sheet-header" onClick={toggleSheet}>
        <div className="grabber"></div>
        <button className="close-button" onClick={onClose}>X</button>
      </div>

      <div className="sheet-content">
        <h2>{title}</h2>
        <p>{desc}</p>
        
        {/* ✅ 길찾기 정보 표시 */}
        {distance && time && (
          <div className="route-info">
            <p><strong>총 거리:</strong> 약 {distance}km</p>
            <p><strong>예상 소요 시간:</strong> 약 {time}분</p>
          </div>
        )}
        
        {/* ✅ 길찾기 버튼 클릭 시 drawRoute 함수 호출 */}
        <button 
          className="find-route-button"
          onClick={onFindRoute}>
          경로 지도에 그리기
        </button>
      </div>
    </div>
  );
}