// Arrived.jsx
import React, { useState } from 'react';
import './Arrived.css';

// NOTE: 프로젝트 자산 경로에 맞춰 조정하세요.
// 예: src/assets/map/popup.svg 로 저장했다면 아래 경로를 맞춰주세요.
// import popupSvg from '../../assets/map/popup.svg';
// import QuestArrival from '../../components/feature/quest/QuestArrival';

export default function Arrived({ title = '도착지', onClose, onStartQuest }){
    console.log("Arrived component rendered with title:", title);
    
  return (
    <div className="arrived-root"  aria-label="도착 알림">
      
        
     
          <div className="arrived-title"><span>{title}</span> 근처에 계시네요!</div>
          <div className="arrived-sub">매장 안에 도착하셨나요?</div>
         <button className="arrived-button"   onClick={() => {
    console.log('퀘스트 시작 버튼이 클릭되었습니다!');
    onStartQuest();
  }}>
            네! 공부할 준비가 되었어요🔥</button>
          
       
        {/* <button className="arrived-close" onClick={onClose} aria-label="닫기">×</button> */}
      </div>
    
  );
}
