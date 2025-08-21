// markerDetail.jsx
import React, { useEffect, useState } from 'react';
// import { cafe_info } from './cafeInfo'; /////////카페 하나에 대한 데모 데이터
import { useNavigate } from 'react-router-dom';

// 아이콘
import congIcon from "../../assets/map/detail_info/cong.svg";
import noiseIcon from "../../assets/map/detail_info/noise.svg";
import seatsIcon from "../../assets/map/detail_info/seats.svg";
import wifiIcon from "../../assets/map/detail_info/wifi.svg";

import rank1 from "../../assets/map/detail_info/Rank=1.svg";
import rank2 from "../../assets/map/detail_info/Rank=2.svg";
import rank3 from "../../assets/map/detail_info/Rank=3.svg";
import rank4 from "../../assets/map/detail_info/Rank=4.svg";
import rank5 from "../../assets/map/detail_info/Rank=5.svg";

import bar from "../../assets/map/detail_info/Divide_line.svg";
import routeIcon from "../../assets/map/detail_info/routeIcon.svg";
import banner_bar from "../../assets/map/banner.svg";

import { CafePhotoInline } from './CafePhoto.jsx';
import './markerDetail.css';

const rankImgs = [null, rank1, rank2, rank3, rank4, rank5];

export default function MarkerDetail({ markerInfo, onClose, onFindRoute, getRouteInfo }) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [view, setView] = useState('detail'); // 'detail' | 'photos'
  const nav = useNavigate();
  const { title, desc, coords, distance, time } = markerInfo;
  const [cafeInfo, setCafeInfo] = useState(null);
  const [cafeError, setCafeError] = useState(null);
  const [cafeLoading, setCafeLoading] = useState(false);


 useEffect(() => {
   if (!title) return;
   const ctrl = new AbortController();
   const API_BASE =
     import.meta.env.VITE_PROJECT_API // ← Vite는 VITE_ 프리픽스 필요
     ?? import.meta.env.PROJECT_API   // (있다면) 백업
     ?? window.PROJECT_API;           // (있다면) 또 다른 백업

   if (!API_BASE) {
     setCafeError('API base URL is missing (VITE_PROJECT_API)');
     setCafeInfo(null);
     return;
   }

   setCafeLoading(true);
   setCafeError(null);
   (async () => {
     try {
       const url = `${API_BASE}/mainpage/cafe/${encodeURIComponent(title)}`;
       const res = await fetch(url, {
         method: 'GET',
         signal: ctrl.signal, 
        //  headers: {"Content-Type": "application/json"},
       
       });
       if (!res.ok) throw new Error(`HTTP ${res.status}`);
       const data = await res.json();
       setCafeInfo(data);
     } catch (e) {
       if (e.name !== 'AbortError') {
         console.error('fetch cafe error:', e);
         setCafeError(e.message || String(e));
         setCafeInfo(null);
       }
     } finally {
       setCafeLoading(false);
     }
   })();
   return () => ctrl.abort();
 }, [title]);




  const congestionStatus = {
    0: { text: "여유", className: "status-green" },
    1: { text: "보통", className: "status-orange" },
    2: { text: "혼잡", className: "status-red" },
  };

  if (!markerInfo) return null;



  const toggleSheet = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    setIsExpanded(!isExpanded);
  };

  // 데모 데이터(기존 구조 유지)
  const pin = cafeInfo?.[0]?.result?.pin?.[0] ?? {};
  const rate = pin.rate;
  const open_hour = pin.open_hour;
  const close_hour = pin.close_hour;
  const cong = pin.congestion;
  const noise = pin.noise;
  const seat = pin.seat;
  const wifi = pin.wifi;
  const [img1, img2] = [pin.img_url_1, pin.img_url_2];

  // 별점 렌더
  const renderStars = (rating) => {
    const full = Math.floor(Number(rating) || 0);
    return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
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
  

  // (옵션) TopDetail과 동일 플로우가 필요하면 이 핸들러 사용
  const handleFindRoute = async () => {
    try {
      if (getRouteInfo && coords) {
        const info = await getRouteInfo(coords); // { routeData, startCoords, endCoords, distance, time }
        if (info && onFindRoute) {
          onFindRoute(
            info.routeData,
            info.startCoords,
            info.endCoords,
            parseFloat(info.distance),
            parseFloat(info.time),
            title || '도착지'
          );
          return;
        }
      }
      // 기존 단순 호출 호환
      onFindRoute && onFindRoute();
    } catch (err) {
      console.error('handleFindRoute error:', err);
    }
  };

  return (
    <div className={`sheet-container ${isExpanded ? 'expanded' : ''}`} style={{ zIndex: 9999, height: '770px' }}>
      <div className="sheet-header" onClick={toggleSheet}>
        <div className="grabber-container">
          <img src={banner_bar} alt="" />
        </div>
      </div>

      <div className="sheet-content">
        {/* 상단 정보 */}
        <div className="header">
          <div className="cafe-name">{title}</div>
          <span>{distance}m</span>
          <button className="close-button" onClick={onClose} aria-label="닫기">X</button>
        </div>

        {view === 'detail' ? (
          <>
            {/* 이미지 영역 */}
            <div className="img_con">
              {img1 && <img src={img1} alt="" width="160px" />}
              <div
                className="imgs"
                onClick={() => setView('photos')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setView('photos')}
                style={{ cursor: 'pointer' }}
              >
                {img2 && <img src={img2} alt="" width="100%" />}
                <div className="plus">+ 더보기</div>
              </div>
            </div>

            {/* 정보 영역 */}
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
                {/* 혼잡도 */}
                <div className="element">
                  <div className="sub-element">
                    <img src={congIcon} alt="혼잡" />
                    <span>혼잡상태</span>
                  </div>
                  <div className="cong">
                    <div className={`congestion-dot ${congestionStatus?.[cong]?.className || ''}`} />
                    <span>{getCongestionInfo(cong).text}</span>
                  </div>
                </div>

                {/* 소음 */}
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

                {/* 좌석 */}
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

                {/* Wi-Fi */}
                <div className="element">
                  <div className="sub-element">
                    <img src={wifiIcon} alt="Wi-Fi" />
                    <span>Wi-Fi</span>
                  </div>
                  <span>{getWifiInfo(wifi).text}</span>
                </div>
              </div>
            </div>

            {/* 길찾기 버튼 */}

                                      <button className="find-route-button" onClick={handleFindRoute}>
              카공 명당 찾기
              <img src={routeIcon} alt="" />
            </button>

          </>
        ) : (
          // ⬇️ "+ 더보기" 클릭 시 인라인 갤러리 표시
          <CafePhotoInline
            title={title}
            onBack={() => setView('detail')}
          />
        )}
      </div>
    </div>
  );
}
