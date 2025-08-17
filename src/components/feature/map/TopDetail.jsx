import React from 'react';
// import '../../../pages/yunseo/markerDetail.css';
import { useNavigate } from 'react-router-dom';
import cong0 from "../../../assets/c_0.png";
import cong1 from "../../../assets/c_1.png";
import cong2 from "../../../assets/c_2.png";




// ⭐️ onNext, onPrev, totalCafes prop 추가
export default function TopDetail({ cafe, onFindRoute, getRouteInfo, getCurrentLocation, onNext, onPrev, totalCafes }) {
  const nav = useNavigate();

  const congestionStatus = {
    0: { text: "여유", className: "status-green" },
    1: { text: "보통", className: "status-orange" },
    2: { text: "혼잡", className: "status-red" },
  };

  if (!cafe) {
    return null;
  }
  
  const { rank, pinname, address, img_url, category, rate, congestion, open_hour, close_hour, lat, lng, distance, time, noise, seat, wifi } = cafe;
  const img1 = img_url;
  const img2 = img_url;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    let stars = '★'.repeat(fullStars);
    stars += '☆'.repeat(5 - fullStars);
    return stars;
  };

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
  
  const handleFindRoute = async () => {
    const startCoords = await getCurrentLocation();
    const endCoords = { lat: lat, lng: lng };
    const routeInfo = await getRouteInfo(endCoords);

    if (routeInfo) {
      onFindRoute(routeInfo.routeData, startCoords, endCoords);
    }
  };

  return (
    <div className="sheet-content">
      <div className="header">

        <span className="rank-badge">{rank}</span>
        <h2>{pinname}</h2>
        <p>{distance}m, {time}분</p>
      </div>



      <div className="directBtns">

        {/* <<<<<< */}
        <button 
          className="prevBtn" 
          onClick={onPrev} 
          disabled={rank === 1}>
          &lt;
        </button>

        {/* >>>>>>>> */}
        <button 
          className="nextBtn" 
          onClick={onNext} 
          disabled={rank === totalCafes}>
          &gt;
        </button>


      </div>





      <div className="img_con">
        <img src={img1} alt="" width="100%"/>
        <div className="imgs">
          <img src={img2} alt="" width="50%"/>
          <img src={img2} alt="" width="50%" onClick={()=> nav('/cafe-photo', {state:{title:pinname}})} />
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
              <div className={`congestion-dot ${congestionStatus[congestion].className}`}></div>
              <span>{getCongestionInfo(congestion).text}</span>
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
      <button 
        className="find-route-button"
        onClick={handleFindRoute}>
        길찾기
      </button>
    </div>
  );
}