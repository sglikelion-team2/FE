// findRoute.jsx
import React from 'react';
import './findRoute.css';

export default function FindRoutePanel({ info }) {
  const { distance, time, title } = info;

  return (
    <div className="find-route-panel">
      <div className="route-header">
        <h2 className="route-title">{title}까지 가는 길</h2>
      </div>
      <div className="route-info">
        <p className="route-distance">총 거리: 약 <strong>{distance}km</strong></p>
        <p className="route-time">예상 소요 시간: 약 <strong>{time}분</strong></p>
      </div>
    </div>
  );
}