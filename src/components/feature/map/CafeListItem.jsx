import React from 'react';
import './CafeListItem.css';

import routeIcon from '../../../assets/map/detail_info/routeIcon.svg';

const congestionStatus = {
  0: { text: "여유", className: "status-green" },
  1: { text: "보통", className: "status-orange" },
  2: { text: "혼잡", className: "status-red" }
};

// 파일 상단 (CafeListItem.jsx, TopDetail.jsx)
const toHttpsSafeUrl = (u) =>
  typeof u === "string" && u.startsWith("http://3.39.6.173:8080/")
    ? u.replace("http://3.39.6.173:8080/", "/api/")
    : u;


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

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  let stars = '★'.repeat(fullStars);
  stars += '☆'.repeat(5 - fullStars);
  return stars;
};

export default function CafeListItem({ cafe, onFindRoute, getRouteInfo, getCurrentLocation, setSelectedMarker, onCafeClick }) {
const { pinname, address, category, rate,
 congestion, open_hour, close_hour, lat, lng, distance, time, wifi } = cafe;

// 서버가 키를 섞어서 줄 수 있으니 모두 대비
const rawImg =
  cafe.img_url_1 ??    // 언더스코어 버전
  cafe.img_url1   ??   // 낙타표기 버전
  cafe.thumbnail  ??   // 썸네일 필드
  cafe.thumb      ??   // 또 다른 썸네일
  null;

const imgSrc = toHttpsSafeUrl(rawImg);

  const handleFindRoute = async (e) => {
    e.stopPropagation();
    const endCoords = { lat, lng };
    const info = await getRouteInfo(endCoords); // info.distance("x.x"), info.time("mm"), info.startCoords 포함
    if (!info) return;
    const placeTitle = pinname || address || '도착지';
    onFindRoute(
     info.routeData,
      info.startCoords,
     info.endCoords,
      parseFloat(info.distance), // km 숫자
      parseFloat(info.time),     // 분 숫자
      placeTitle                 // 목적지 이름
    );
  };

  return (
    <div className="cafe-item-container" >

      <div className="sub-div1">
        <div className="info1">
        {pinname}&nbsp;
        <span className="cafe-distance">{distance ? `${distance}m` : '거리 정보 없음'}</span>
        </div>

        <div className="info2">
            <div className="congestion">
            <div className="congestion-text">
            {congestionStatus[congestion].text}
            </div>
            <div className={`congestion-dot ${congestionStatus[congestion].className}`}></div>
            </div>
          
          

          <div className="cafe-hashtags">
          <span className="hashtag">{category}</span>
          {wifi >= 4 && <span className="hashtag">#wifi 빵빵</span>}
          </div>

        
        </div>

        <div className="info3">
          <button className='detail-button'onClick={() => onCafeClick(cafe)}>상세보기</button>
          <button className="directions-button" onClick={handleFindRoute}>
            길찾기
            <img src={routeIcon} alt="" width="10px"/>
          </button>


        </div>

      </div>

      <div className="sub-div2">
  <img src={imgSrc || ""} alt={pinname} className="cafe-image" width="81px" />
</div>

     


      {/* <img src={img_url} alt={pinname} className="cafe-image" />


      <div className="cafe-details">

        <div className="cafe-info-header">
          <span className="cafe-name">{pinname}</span>
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
        <div className="congestion">
          {congestionStatus[congestion].text}
        </div>
        <div className={`congestion-dot ${congestionStatus[congestion].className}`}></div>


      </div> */}



    </div>
  );
}