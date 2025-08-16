// markerDetail.jsx
import React from 'react';

export default function MarkerDetail({ markerInfo, onClose, onFindRoute }) {
  if (!markerInfo) {
    return null;
  }

  const { title, desc, coords } = markerInfo; // coords: 마커의 좌표 정보 추가

  const panelStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '400px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const buttonStyle = {
    alignSelf: 'flex-end',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#aaa'
  };
  
  // 길찾기 버튼 스타일
  const findRouteButtonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#3478F6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px'
  };

  return (
    <div style={panelStyle}>
      <button style={buttonStyle} onClick={onClose}>
        X
      </button>
      <h2>{title}</h2>
      <p>{desc}</p>
      {/* 길찾기 버튼 추가 */}
      <button 
        style={findRouteButtonStyle}
        onClick={() => onFindRoute(coords)}>
        현 위치에서 길찾기
      </button>
    </div>
  );
}