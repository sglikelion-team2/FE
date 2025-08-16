import React from 'react';
import './CafeListItem.css';

// 혼잡도 텍스트와 색상을 매핑하는 객체
const congestionStatus = {
  green: { text: "여유", className: "status-green" },
  orange: { text: "보통", className: "status-orange" },
  red: { text: "혼잡", className: "status-red" },
};

export default function CafeListItem({ cafe }) {
  // 별점을 별 아이콘으로 변환하는 간단한 함수
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (halfStar) stars += '☆'; // 반쪽 별 대신 빈 별로 간단히 표현
    return stars.padEnd(5, '☆');
  };

  return (
    <div className="cafe-item-container">
      <img src={cafe.imageUrl} alt={cafe.name} className="cafe-image" />
      <div className="cafe-details">
        <div className="cafe-info-header">
          <span className="cafe-name">{cafe.name}</span>
          <span className="cafe-rating">{renderStars(cafe.rating)}</span>
        </div>
        <div className="cafe-status-line">
          <span className={`operating-status ${cafe.isOperating ? 'open' : 'closed'}`}>
            {cafe.isOperating ? '영업중' : '영업종료'}
          </span>
          <span className="cafe-distance">{cafe.distance} | 도보 {cafe.walkingTime}분</span>
        </div>
        <div className="cafe-hashtags">
          {cafe.hashtags.map(tag => (
            <span key={tag} className="hashtag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="cafe-actions">
        <div className={`congestion-dot ${congestionStatus[cafe.congestion].className}`}></div>
        <button className="directions-button">길찾기</button>
      </div>
    </div>
  );
}