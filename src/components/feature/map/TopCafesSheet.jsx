import React, { useState, useEffect } from 'react';
import './TopCafesSheet.css';
import { topCafes } from '../../../mocks/cafe-data';
import CafeListItem from './CafeListItem';

export default function TopCafesSheet() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [nickname, setNickname] = useState(''); // ✅ 1. 닉네임을 저장할 state 추가

  // 컴포넌트가 처음 렌더링될 때 실행
  useEffect(() => {
    // 현재 날짜와 시간을 포맷에 맞게 설정
    const now = new Date();
    const formattedTime = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} | ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}pm`;
    setCurrentTime(formattedTime);

    // ✅ 2. localStorage에서 현재 사용자 닉네임 불러오기
    const storedNickname = localStorage.getItem('current_user') || '방문자'; // 값이 없으면 '방문자'로 표시
    setNickname(storedNickname);

  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정

  const toggleSheet = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sheet-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="sheet-header" onClick={toggleSheet}>
        <div className="grabber"></div>
        <div className="header-content">
          <div className="current-time">{currentTime}</div>
          <h2 className="sheet-title">
            {/* ✅ 3. 하드코딩된 '소린'을 nickname state 변수로 교체 */}
            지금 <span className="nickname">{nickname}</span>님에게 딱 맞는 장소 Top 5
          </h2>
        </div>
      </div>
      <div className="cafe-list">
        {topCafes.map(cafe => (
          <CafeListItem key={cafe.id} cafe={cafe} />
        ))}
      </div>
    </div>
  );
}