// FindRoute.jsx
import React from 'react';
import './findRoute.css';

import routeIcon from "../../assets/map/route/Vector.svg";


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
            <div className="routIcon-box">
            <img src={routeIcon} alt="" width="24px"/>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}