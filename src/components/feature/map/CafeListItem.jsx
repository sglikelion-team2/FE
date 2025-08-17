// src/components/feature/map/CafeListItem.jsx
import React from 'react';
import './CafeListItem.css';

// 혼잡도 텍스트와 색상을 매핑하는 객체
const congestionStatus = {
  0: { text: "여유", className: "status-green" },
  1: { text: "보통", className: "status-orange" },
  2: { text: "혼잡", className: "status-red" }
};

// 현재 시간을 기준으로 영업 상태를 판단하는 함수
const isCafeOpen = (openTime, closeTime) => {
  const now = new Date();
  const [openHour, openMin] = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);

  const open = new Date();
  open.setHours(openHour, openMin, 0);

  const close = new Date();
  close.setHours(closeHour, closeMin, 0);

  if (close <= open) {
    close.setDate(close.getDate() + 1);
  }

  return now >= open && now < close;
};

// ⭐️ 별점을 별 아이콘으로 변환하는 함수
const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    let stars = '★'.repeat(fullStars);
    stars += '☆'.repeat(5 - fullStars);
    return stars;
};


export default function CafeListItem({ cafe,  onFindRoute, getRouteInfo, getCurrentLocation, setSelectedMarker  }) {
  const { pinname, address, img_url, category, rate, congestion, open_hour, close_hour,lat,lng, distance, time, wifi } = cafe;
  const isOperating = isCafeOpen(open_hour, close_hour);



  ////도보 경로 시각화
    const handleFindRoute = async () => {
    // 1. 현재 위치와 목적지(카페) 정보를 가져옴
    const startCoords = await getCurrentLocation();
    const endCoords = { lat: lat, lng: lng };
    
    // 2. Tmap API를 통해 경로 정보(distance, time, routeData)를 가져옴
    const routeInfo = await getRouteInfo(endCoords);
    
    if (routeInfo) {
      // 3. 지도에 경로를 그림
      onFindRoute(routeInfo.routeData, startCoords, endCoords);
      // 4. 지도 패널 닫기 (선택 사항)
      // setSelectedMarker(null);
    }
  };

  return (
    <div className="cafe-item-container">
      <img src={img_url} alt={pinname} className="cafe-image" />
      <div className="cafe-details">
        <div className="cafe-info-header">
          <span className="cafe-name">{pinname}</span>
          {/* ⭐️ rate 데이터로 별점 표시 */}
          <span className="cafe-rating">{renderStars(rate)}</span>
        </div>
        <div className="cafe-status-line">
          <span className={`operating-status ${isOperating ? 'open' : 'closed'}`}>
            {isOperating ? '영업중' : '영업종료'}
          </span>

          <span className="cafe-distance">{distance ? `${distance}Km | 도보 ${time}분` : '거리 정보 없음'}</span>


          <span className="cafe-address">{address}</span>
        </div>
        <div className="cafe-hashtags">
          <span className="hashtag">{category}</span>
           {wifi >= 4 && <span className="hashtag">#wifi 빵빵</span>}
        </div>
      </div>
      <div className="cafe-actions">
        <div className={`congestion-dot ${congestionStatus[congestion].className}`}></div>
        <button className="directions-button" onClick={handleFindRoute}>
          길찾기
        </button>
      </div>
    </div>
  );
}