// TopDetail.jsx

import React, { useState, useRef } from 'react';
import { CafePhotoInline } from '../../../pages/yunseo/CafePhoto.jsx';

// 아이콘
import congIcon from "../../../assets/map/detail_info/cong.svg";
import noiseIcon from "../../../assets/map/detail_info/noise.svg";
import seatsIcon from "../../../assets/map/detail_info/seats.svg";
import wifiIcon from "../../../assets/map/detail_info/wifi.svg";


import rank1 from "../../../assets/map/detail_info/Rank=1.svg";
import rank2 from "../../../assets/map/detail_info/Rank=2.svg";
import rank3 from "../../../assets/map/detail_info/Rank=3.svg";
import rank4 from "../../../assets/map/detail_info/Rank=4.svg";
import rank5 from "../../../assets/map/detail_info/Rank=5.svg";

import bar from "../../../assets/map/detail_info/Divide_line.svg"
import routeIcon from "../../../assets/map/detail_info/routeIcon.svg";


import "./TopDetail.css";
const rankImgs = [null, rank1, rank2, rank3, rank4, rank5];

// ⭐️ onNext, onPrev, totalCafes prop 포함
export default function TopDetail({
  cafe,
  onFindRoute,           // (routeData, start, end, distKm, timeMin, placeTitle) => void
  getRouteInfo,          // (coords) => Promise<{ distance, time, routeData, startCoords, endCoords }>
  getCurrentLocation,    // 필요 시 사용 가능
  onNext,
  onPrev,
  totalCafes,
  onViewChange
}) {
  const [view, setView] = useState('detail');

// 상단 import/상태는 동일

    // ====== 스와이프 상태 ======
    const swipeRef = useRef({ tracking: false, startX: 0, startY: 0, type: 'mouse' });
    const SWIPE_THRESHOLD_X = 40;
    const SWIPE_TOLERANCE_Y = 30;

    const handlePointerDown = (e) => {
      if (view !== 'detail') return;
      // 마우스는 왼쪽 버튼 드래그만 허용
      if (e.pointerType === 'mouse' && (e.buttons & 1) !== 1) return;

      swipeRef.current.tracking = true;
      swipeRef.current.startX = e.clientX;
      swipeRef.current.startY = e.clientY;
      swipeRef.current.type = e.pointerType; // 'mouse' | 'touch' | 'pen'
    };

    const handlePointerMove = (e) => {
      if (!swipeRef.current.tracking || view !== 'detail') return;

      const dx = e.clientX - swipeRef.current.startX;
      const dy = e.clientY - swipeRef.current.startY;

      // 세로 스크롤 의도가 더 크면 취소
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > SWIPE_TOLERANCE_Y) {
        swipeRef.current.tracking = false;
        return;
      }

      if (Math.abs(dx) >= SWIPE_THRESHOLD_X) {
        if (dx < 0 && onNext) onNext();   // 왼쪽 → 다음
        if (dx > 0 && onPrev) onPrev();   // 오른쪽 → 이전
        swipeRef.current.tracking = false;
      }
    };

    const handlePointerUp = () => { swipeRef.current.tracking = false; };
    const handlePointerCancel = () => { swipeRef.current.tracking = false; };


  const handleTouchEnd = () => {
    swipeRef.current.tracking = false;
  };

  // (옵션) 데스크톱 키보드 ←/→ 지원
  const handleKeyDown = (e) => {
    if (view !== 'detail') return;
    if (e.key === 'ArrowLeft' && onPrev) onPrev();
    if (e.key === 'ArrowRight' && onNext) onNext();
  };

  if (!cafe) return null;

  // 표시용(없으면 기본값)
  const {
    pinname,
    title,
    name,
    rank,
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
    distance,  // "x.x" km (문자열일 수 있음)
    time       // "mm" 분 (문자열일 수 있음)
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
      case 0: return { text: '여유' };
      case 1: return { text: '보통' };
      case 2: return { text: '혼잡' };
      default: return { text: '정보 없음' };
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


    const rankNum = Number.parseInt(rank, 10) || 0;  // 1~5 기대
    const rankSrc = rankImgs[rankNum] || null;



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
        parseFloat(info.distance),
        parseFloat(info.time),
        placeTitle
      );
    } catch (e) {
      console.error('handleFindRoute error:', e);
    }
  };

return (
  <div
    className="topdetail-container"
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerUp={handlePointerUp}
    onPointerCancel={handlePointerCancel}
    onKeyDown={handleKeyDown}
    tabIndex={0}
    role="region"
    aria-label="장소 상세 스와이프 영역"
  >
    <div className="sheet-content">
      <div className="header">
        <div className="cafe-name">{placeTitle}</div>
        <span>{distance}km</span>
        {rankSrc && (   /* rank가 없을 때 빈 img 방지 */
          <img
            className="rank-badge"
            src={rankSrc}
            alt={`Rank ${rankNum}`}
          />
        )}
      </div>

      {view === 'detail' ? (
        <>
          <div className="img_con">
            {img_url && <img src={img_url} alt="" width="160px" />}

            <div className="imgs">
              {img_url && (
                <img
                  src={img_url}
                  alt=""
                  width="100%"
                 
                  
                />
              )}
              <div
                className="plus"
                onClick={() => { setView('photos'); onViewChange?.('photos'); }}
                style={{ cursor: 'pointer' }}
              >
                + 더보기
              </div>
            </div>
          </div>

          <div className="info">
            <div className="ditail_1">
              <div className="rate_con">
                {renderStars(rate)} <span>&nbsp;{rate} &nbsp;&nbsp;|</span>
              </div>

              {(open_hour || close_hour) && (
                <div className="hour">
                  {open_hour ?? '-'}~{close_hour ?? '-'}
                </div>
              )}
            </div>

            <img id="ui_bar" src={bar} alt="" />

            <div className="ditail_2">
              <div className="element">
                <div className="sub-element">
                  <img src={congIcon} alt="혼잡" />
                  <span>혼잡상태</span>
                </div>
                <div className="cong">
                <div className={`congestion-dot ${congestionStatus?.[congestion]?.className || ''}`} />
                <span>{getCongestionInfo(congestion).text}</span>
                </div>
              </div>

              <div className="element">
                <div className="sub-element">
                  <img src={noiseIcon} alt="소음" />
                  <span>소음</span>
                  </div>

                  <div className="noise">
                  <span>{noise != null ? `Lv${noise}` : '-'}</span>
                  <div className="level">(Lv1 ~ Lv5)</div>
                  </div>

                
                
              </div>

              <div className="element">
                <div className="sub-element">
                  <img src={seatsIcon} alt="좌석" />
                  <span>좌석</span>
                </div>

                <div className="seats">
                {seat && typeof seat === 'object'
                  ? Object.entries(seat).map(([size, count]) => (
                      <span key={size}>{size}인석 {count}개 </span>
                    ))
                  : <span>-</span>}

                  </div>
              </div>

              <div className="element">
                <div className="sub-element">
                  <img src={wifiIcon} alt="Wi-Fi" />
                  <span>Wi-Fi</span>
                </div>
                <span>{getWifiInfo(wifi).text}</span>
              </div>
            </div>
          </div>

          <button className="find-route-button" onClick={handleFindRoute}>
            카공 명당 찾기
            <img src={routeIcon} alt="" />
          </button>
        </>
      ) : (
        <CafePhotoInline
          title={placeTitle}
          onBack={() => { setView('detail'); onViewChange?.('detail'); }}
        />
      )}
    </div>
  </div>
);

}
