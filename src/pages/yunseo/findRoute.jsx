// FindRoute.jsx
import React from 'react';
import './FindRoute.css';


export default function FindRoute({ findRouteInfo, onClose }) {


  if (!findRouteInfo) {
    console.log(findRouteInfo);
  }

  console.log(findRouteInfo);

  

  const { distance, time , title } = findRouteInfo;

  return (
    <div className="find-route-panel">
      <div className="panel-content">
    <button
      className="close-button"
      onClick={onClose}   // ✅ 부모가 초기화와 이동을 책임짐
    >
      X
    </button>


        <div className="route-summary">
          <h2>경로 안내</h2>

          <div className="info-box">
            <span>도착지:</span>
            <strong>{title}</strong>
          </div>
          <div className="info-box">
            <span>총 거리:</span>
            <strong>{distance} m</strong>
          </div>
          <div className="info-box">
            <span>예상 시간:</span>
            <strong>{time} 분</strong>
          </div>
        </div>
      </div>
    </div>
  );
}