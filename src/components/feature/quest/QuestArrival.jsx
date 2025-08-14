import React from 'react';
import './QuestArrival.css';
import { useUserPref } from '../../../store/userPref'; // 닉네임을 가져오기 위해 Context 사용

export default function QuestArrival({ onYes, onNo }) {
  // Context나 localStorage에서 현재 사용자 닉네임 가져오기
  const { nickname } = useUserPref(); 

  return (
    <div className="arrival-backdrop">
      <div className="arrival-popup">
        <div className="popup-icon">💌</div>
        <h2 className="popup-title">Quest 도착!</h2>
        <p className="popup-description">
        {nickname}님, 공부 시작!<br />
          매장에 대한 경험 정보를 남기고 <br />
          리워드를 받아보세요!
        </p>
        <p className="popup-question">퀘스트를 진행하시겠어요?</p>
        <div className="popup-buttons">
          <button className="popup-button no" onClick={onNo}>퀘스트 포기하기ㅠㅠ</button>
          <button className="popup-button yes" onClick={onYes}>5초 투자하고
        리워드 받기</button>
        </div>
      </div>
    </div>
  );
}