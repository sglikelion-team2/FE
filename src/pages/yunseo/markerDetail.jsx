// markerDetail.jsx
import React, { useState } from 'react';
import '../../components/feature/map/TopCafesSheet.css';
import { cafe_info } from './cafeInfo';
import { useNavigate } from 'react-router-dom';
import rate_url from "../../assets/c_0.png"; // 별점 이미지
import cong0 from "../../assets/c_0.png";
import cong1 from "../../assets/c_1.png";
import cong2 from "../../assets/c_2.png";


import { CafePhotoInline } from './CafePhoto.jsx'; // ✅ 추가





export default function MarkerDetail({ markerInfo, onClose, onFindRoute }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const nav = useNavigate();

  const [view, setView] = useState('detail'); ///사진 더보기를 위해 추가

    const congestionStatus = {
    0: { text: "여유", className: "status-green" },
    1: { text: "보통", className: "status-orange" },
    2: { text: "혼잡", className: "status-red" },
  };


  if (!markerInfo) {
    return null;
  }
  
  const { title, desc, coords, distance, time } = markerInfo;

  const toggleSheet = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    setIsExpanded(!isExpanded);
  };

  /// 그 이후 데이터 파싱부분
  const rate = cafe_info[0].result.pin[0].rate;
  const open_hour = cafe_info[0].result.pin[0].open_hour;
  const close_hour = cafe_info[0].result.pin[0].close_hour;

  const cong = cafe_info[0].result.pin[0].congestion;
  const noise = cafe_info[0].result.pin[0].noise;
  const seat = cafe_info[0].result.pin[0].seat;
  const wifi = cafe_info[0].result.pin[0].wifi;

  const [img1, img2]= [cafe_info[0].result.pin[0].img_url_1, cafe_info[0].result.pin[0].img_url_2];

  // ⭐️ 별점을 별 아이콘으로 변환하는 함수
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    let stars = '★'.repeat(fullStars);
    // 빈 별을 추가하여 총 5개로 맞추기
    stars += '☆'.repeat(5 - fullStars);
    return stars;
  };

  ////혼잡도
  const getCongestionInfo = (level) => {
    switch (level) {
      case 0:
        return {
          text: '여유',
          imgUrl: cong0,
        };
      case 1:
        return {
          text: '보통',
          imgUrl: cong1,
        };
      case 2:
        return {
          text: '혼잡',
          imgUrl: cong2,
        };
      default:
        return {
          text: '정보 없음',
          imgUrl: '',
        };
    }
  };

  /////wifi
  const getWifiInfo = (level) => {
    switch (level) {
      case 0:
        return {
          text: '데이터가 없습니다.',
        };
      case 1:
        return {
          text: '매우 열악',
        };
      case 2:
        return {
          text: '열악',
        };
      case 3:
        return {
          text: '보통',
        };
      case 4:
        return {
          text: '원활',
        };
      case 5:
        return {
          text: '매우 원활',
        };
      default:
        return {
          text: '데이터가 없습니다.',
        };
    }
  };
  


  //////네비게이션 
  
return(
    <div className={`sheet-container ${isExpanded ? 'expanded' : ''}`} style={{ zIndex: 9999, height: '600px' }}>
      <div className="sheet-header" onClick={toggleSheet}>
        <div className="grabber"></div>
        <button className="close-button" onClick={onClose}>X</button>
      </div>

      <div className="sheet-content">
        {/* ⬇️ 상단 정보는 항상 고정(장소명 유지) */}
        <div className="header">
          <h2>{title}</h2>
          <p>{distance}m, {time}분</p>
        </div>

        {/* ⬇️ 이 아래 본문만 스왑 */}
        {view === 'detail' ? (
          <>
            <div className="img_con">
              <img src={img1} alt="" width="10px" />
              <div className="imgs">
                <img src={img2} alt="" width="10px" />
                <img
                  src={img2}
                  alt=""
                  width="100px"
                  onClick={() => setView('photos')}   // 사진 보기로 전환
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            <div className="info">
              <div className="ditail_1">
                <div className="rate_con">
                  <span>{renderStars(rate)}</span>
                </div>
                <div className="hour">영업시간 {open_hour}~{close_hour}</div>
              </div>

              <div className="ditail_2">
                <ul>
                  <li>
                    <span>혼잡상태</span>
                    <div className={`congestion-dot ${congestionStatus[cong]?.className || ''}`}></div>
                    <span>{getCongestionInfo(cong).text}</span>
                  </li>
                  <li>
                    <span>소음</span>
                    <span>Lv{noise}</span>
                  </li>
                  <li>
                    <span>좌석</span>
                    {Object.entries(seat).map(([size, count]) => (
                      <span key={size}>{size}인석 {count}개 </span>
                    ))}
                  </li>
                  <li>
                    <span>Wi-Fi</span>
                    <span>{getWifiInfo(wifi).text}</span>
                  </li>
                </ul>
              </div>
            </div>

            <button className="find-route-button" onClick={onFindRoute}>길찾기</button>
          </>
        ) : (
          // ⬇️ 사진 보기 (인라인)
          <CafePhotoInline
            title={title}
            onBack={() => setView('detail')}  // 다시 상세로
          />
        )}
      </div>
    </div>
  );
}