import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestArrival from '../../components/feature/quest/QuestArrival';
import TopCafesSheet from '../../components/feature/map/TopCafesSheet'; // 

export default function MapPage() {
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const navigate = useNavigate();

  // '도착했어요' 버튼을 눌렀을 때 실행될 함수
  const handleArrivalClick = () => {
    setIsQuestModalOpen(true); // 퀘스트 팝업을 띄우는 상태로 변경
  };

  // 퀘스트 팝업에서 'No'를 눌렀을 때
  const handleQuestDecline = () => {
    navigate('/map');
  };

  // 퀘스트 팝업에서 'Yes'를 눌렀을 때
  const handleQuestAccept = () => {
    setIsQuestModalOpen(false);
    navigate('/quest');
  };

  return (
    <div className="map-page-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* --- 지도 관련 UI (다른 FE 개발자 작업 영역) --- */}
      <div style={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888' }}>
        여기에 지도가 표시됩니다. (핀 포함)
      </div>
      
      {/* '도착했어요?' 버튼 (실제로는 지도 위 특정 위치에 있을 수 있음) */}
      <button 
        onClick={handleArrivalClick}
        style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px', zIndex: '10' }}
      >
        (임시) 매장에 도착했어요?
      </button>
      {/* ------------------------------------------- */}

      
      <TopCafesSheet />


      {/* ✅ isQuestModalOpen 상태가 true일 때만 퀘스트 도착 팝업을 렌더링합니다. */}
      {/* 이 팝업은 TopCafesSheet보다 위에 나타나야 합니다. (z-index로 제어됨) */}
      {isQuestModalOpen && (
        <QuestArrival 
          onYes={handleQuestAccept} 
          onNo={handleQuestDecline} 
        />
      )}
    </div>
  );
}