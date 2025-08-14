import React, { useState } from 'react';
import './Quest.css';

const options = [
  { id: 'few', text: '적음' },
  { id: 'average', text: '보통' },
  { id: 'many', text: '많음' },
];

export default function PowerSocket({ onComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleDoneClick = () => {
    if (!selectedOption) {
      alert('옵션을 선택해주세요!');
      return;
    }
    // 부모에게 완료 신호와 데이터를 보냅니다.
    onComplete({ powerSocket: selectedOption });
  };

  return (
    <div className="quest-container">
      <div className="quest-header">
        <span className="quest-title">Quest</span>
        <button className="close-button">X</button>
      </div>
      
      <div className="quest-content">
        <p className="quest-instruction">
          **매장이름**의 <br />
          콘센트 개수는 충분한가요?
        </p>

        <div className="outlet-options">
          {options.map((option) => (
            <button
              key={option.id}
              className={`outlet-option ${selectedOption === option.id ? 'selected' : ''}`}
              onClick={() => setSelectedOption(option.id)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="quest-footer">
        <button className="quest-button done" onClick={handleDoneClick}>Done</button>
      </div>
    </div>
  );
}