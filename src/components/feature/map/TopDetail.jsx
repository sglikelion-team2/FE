// TopDetail.jsx

import React, { useState } from 'react';
import { CafePhotoInline } from '../../../pages/yunseo/CafePhoto.jsx';

// 혼잡도 아이콘(필요 시 경로 그대로 사용)
import cong0 from "../../../assets/c_0.png";
import cong1 from "../../../assets/c_1.png";
import cong2 from "../../../assets/c_2.png";

// ⭐️ onNext, onPrev, totalCafes prop 포함
export default function TopDetail({
  cafe,
  onFindRoute,           // (routeData, start, end, distKm, timeMin, placeTitle) => void
  getRouteInfo,          // (coords) => Promise<{ distance, time, routeData, startCoords, endCoords }>
  getCurrentLocation,    // 필요 시 사용 가능(현재는 getRouteInfo가 startCoords를 반환하므로 필수는 아님)
  onNext,
  onPrev,
  totalCafes
}) {
   const [view, setView] = useState('detail');
  

  if (!cafe) return null;

  // 표시용(없으면 기본값)
  const {
    pinname,
    title,
    name,
    address,
    lat,
    lng,
    rate,
    open_hour,
    close_hour,
    congestion,
    noise,
    seat,
    wifi,
    img_url,
    distance,  // 리스트에서 내려온 요약용(문자열 km일 수 있음)
    time       // 리스트에서 내려온 요약용(문자열 분일 수 있음)
  } = cafe;

  // 목적지 제목 우선순위
  const placeTitle = pinname || title || name || address || '도착지';

  // 혼잡도/와이파이 표시 유틸
  const congestionStatus = {
    0: { text: "여유", className: "status-green" },
    1: { text: "보통", className: "status-orange" },
    2: { text: "혼잡", className: "status-red" },
  };

  const getCongestionInfo = (level) => {
    switch (level) {
      case 0: return { text: '여유', imgUrl: cong0 };
      case 1: return { text: '보통', imgUrl: cong1 };
      case 2: return { text: '혼잡', imgUrl: cong2 };
      default: return { text: '정보 없음', imgUrl: '' };
    }
  };

  const getWifiInfo = (level) => {
    switch (level) {
      case 0: return { text: '데이터가 없습니다.' };
      case 1: return { text: '매우 열악' };
      case 2: return { text: '열악' };
      case 3: return { text: '보통' };
      case 4: return { text: '원활' };
      case 5: return { text: '매우 원활' };
      default: return { text: '데이터가 없습니다.' };
    }
  };

  const renderStars = (rating) => {
    const r = Number(rating) || 0;
    const full = Math.floor(r);
    return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
  };

  // ✅ 길찾기: drawRoute에 6개 인자 전달
  const handleFindRoute = async () => {
    try {
      const end = { lat, lng };
      const info = await getRouteInfo(end);
      if (!info) return;

      onFindRoute(
        info.routeData,
        info.startCoords,
        info.endCoords,
        parseFloat(info.distance), // "x.x" → number (km)
        parseFloat(info.time),     // "mm"  → number (minutes)
        placeTitle                 // 목적지 이름
      );
    } catch (e) {
      console.error('handleFindRoute error:', e);
    }
  };

  return (
   <div className="topdetail-container">


      <div className="sheet-content">
        <div className="header">
          <h2>{placeTitle}</h2>
          {/* 주의: cafe.distance/cafe.time은 요약용일 수 있음. 단위 일관성을 맞춰 표시 */}
          {distance && time && (
            <p>{distance}km, {time}분</p>
          )}
        </div>

       {/* ⬇ 본문만 스왑: 상세 ↔ 사진 */}
       {view === 'detail' ? (
         <>
           <div className="img_con">
             {img_url && <img src={img_url} alt="" width="100px" />}
            <div className="imgs">
               {img_url && (
                 <img
                   src={img_url}
                   alt=""
                   width="100px"
                   onClick={() => setView('photos')}
                   style={{ cursor: 'pointer' }}
                 />
               )}
             </div>
           </div>

           <div className="info">
                  <div className="controlBtns">
        {/* 닫기/이전/다음 등 헤더 컨트롤은 기존 스타일에 맞춰 필요 시 추가 */}
        {onPrev && <button className="nav-button prev" onClick={onPrev}>‹</button>}
        {onNext && <button className="nav-button next" onClick={onNext}>›</button>}
      </div>
             <div className="ditail_1">
               <div className="rate_con">
                 <span>{renderStars(rate)}</span>
               </div>
               {(open_hour || close_hour) && (
                 <div className="hour">영업시간 {open_hour ?? '-'}~{close_hour ?? '-'}</div>
               )}
             </div>
             <div className="ditail_2">
               <ul>
                 <li>
                   <span>혼잡상태</span>
                   <div className={`congestion-dot ${congestionStatus?.[congestion]?.className || ''}`}></div>
                   <span>{getCongestionInfo(congestion).text}</span>
                 </li>
                 <li><span>소음</span><span>{noise != null ? `Lv${noise}` : '-'}</span></li>
                 <li>
                   <span>좌석</span>
                   {seat && typeof seat === 'object'
                     ? Object.entries(seat).map(([size, count]) => (
                         <span key={size}>{size}인석 {count}개 </span>
                       ))
                     : <span>-</span>}
                 </li>
                 <li><span>Wi-Fi</span><span>{getWifiInfo(wifi).text}</span></li>
               </ul>
             </div>
           </div>

           <button className="find-route-button" onClick={handleFindRoute}>
             길찾기
           </button>
         </>
       ) : (
         <CafePhotoInline
           title={placeTitle}
           onBack={() => setView('detail')}
         />
       )}
      </div>
    </div>
  );
}
