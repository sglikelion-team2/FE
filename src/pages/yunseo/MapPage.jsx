import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestArrival from '../../components/feature/quest/QuestArrival'; // 퀘스트 팝업 컴포넌트 import

export default function MapPage() {
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const navigate = useNavigate();

  // 도착햇냐->네 버튼을 눌렀을 때 실행될 함수
  const handleArrivalClick = () => {
    setIsQuestModalOpen(true); // 모달을 띄우는 상태로 변경
  };

  // 팝업에서 'No'를 눌렀을 때: 모달을 닫기만 함
  const handleQuestDecline = () => {
    navigate('/map');
  };

  // 팝업에서 'Yes'를 눌렀을 때: 퀘스트 페이지로 이동
  const handleQuestAccept = () => {
    setIsQuestModalOpen(false); // 일단 모달을 닫고
    navigate('/quest');       // 퀘스트 전용 페이지로 이동
  };

  return (
    <div className="map-container">
      {/* --- 지도 관련 UI */ }
      <h1>지도 페이지</h1>
      <p>여기에 카카오 지도가 렌더링 됩니다.</p>
      
      {/* 와이어프레임의 '도착했어요?' 버튼 */}
      <button className="arrival-button" onClick={handleArrivalClick}>
        매장에 도착했어요?
      </button>
      {/* ------------------------------------------- */}


      {/* isQuestModalOpen 상태가 true일 때만 퀘스트 도착 팝업을 렌더링 */}
      {isQuestModalOpen && (
        <QuestArrival 
          onYes={handleQuestAccept} 
          onNo={handleQuestDecline} 
        />
      )}
    </div>
  );
}