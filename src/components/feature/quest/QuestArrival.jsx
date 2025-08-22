import React from 'react';
import './QuestArrival.css';

// 새로운 SVG 아이콘 import (아이콘 이름은 실제 파일명에 맞게 수정 필요)
import { ReactComponent as QuestMarkIcon } from '../../../assets/icons/postbox.svg'; 
import { ReactComponent as CloseIcon } from '../../../assets/icons/close_filled.svg';

// ✅ title, onYes, onNo를 props로 받도록 수정
export default function QuestArrival({ title, onYes, onNo }) {

  return (
    // 이 컴포넌트는 MapPage 같은 부모 컴포넌트 안에서 위치가 결정되어야 합니다.
    // 여기서는 팝업 자체의 모양만 만듭니다.
    <div className="quest-arrival-backdrop">
      <div className="quest-arrival-popup">
        {/* ✅ 우측 상단 닫기 버튼 추가 */}
        <button className="popup-close-button" onClick={onNo}>
          <CloseIcon />
        </button>

        <p className="cafe-name-header">{title}</p>
        
        <h2 className="popup-title">QUEST 도착</h2>
        
        <div className="popup-icon-wrapper">
          <QuestMarkIcon />
        </div>
      
      <p className="popup-description">
        짝짝짝 👏 카공 명소에 도착했네요!<br />
        퀘스트로 카페의 진짜 모습을 기록하고,<br />
        리워드도 받아가세요!🎁
      </p>
       <div className="popup-buttons">
          <button className="popup-button no" onClick={onNo}>리워드는 포기할래요😅</button>
          <button className="popup-button yes" onClick={onYes}>Yes</button>
        </div>
        
      </div>
    </div>
  );
}