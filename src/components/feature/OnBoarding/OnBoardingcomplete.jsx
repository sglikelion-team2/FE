// OnBoardingComplete.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OnBoardingComplete.css'; // 이 CSS 파일도 아래에서 만들 거예요.

export default function OnBoardingComplete() {
  const navigate = useNavigate();

  // '지도 보러가기' 버튼 클릭 시 동작할 함수
  const handleShowMapClick = () => {
    // 실제 지도가 있는 페이지 경로로 이동합니다. (예: /map)
    navigate('/map'); 
  };

  return (
    <div className="complete-container">
      <div className="complete-content">
        <span className="complete-icon">✨</span>
        <p className="complete-message">
          AI가 당신에게 딱 맞는 장소를<br />
          추천해 드려요 (완료)
        </p>
      </div>
      <button className="map-button" onClick={handleShowMapClick}>
        나만의 카공 지도 보러가기
      </button>
    </div>
  );
}