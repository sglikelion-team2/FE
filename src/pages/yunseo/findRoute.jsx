// FindRoute.jsx
import React, { useState, useEffect } from 'react';
import './findRoute.css';

import routeIcon from "../../assets/map/route/Vector.svg";


export default function FindRoute({ findRouteInfo, onClose, onMinimize }) {
  const [closing, setClosing] = useState(false); // ⬅ 닫힘 애니메이션 상태
  const DURATION = 280; // css와 동일(ms)


  if (!findRouteInfo) {
    console.log(findRouteInfo);
  }

  console.log(findRouteInfo);

 const handleMinimize = () => {
    // 패널만 “스르륵 아래”로 사라지게
    setClosing(true);
    // 애니메이션 끝나면 부모에게 패널 숨기기 알림
    setTimeout(() => {
      onMinimize?.();
      setClosing(false); // 다음에 다시 열릴 때를 대비
    }, DURATION);
  };

  

  const { distance, time , title } = findRouteInfo;

  return (
    <div className={`find-route-panel ${closing ? 'closing' : ''}`}>
      <div className="panel-content">
    <button
      className="close-button"
      onClick={onClose}   // ✅ 부모가 초기화와 이동을 책임짐
    >
      X
    </button>


        <div className="route-summary">
          
          <div className="info-box">
            <div className='route-name'>최단 거리 ✏️</div>
             <div className="time-box">
              {time} <span>min</span>
             </div>

          </div>
          {/* <div className="distance-box">
            
            {distance} m
          </div> */}
          <div className="img-box">
            <div className="routIcon-box" onClick={handleMinimize}>
            <img src={routeIcon} alt="" width="24px"/>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}