import React, { useState } from 'react';
import './Quest.css';

// 아이콘 import
import PlugIcon from '../../../../assets/icons/plug.svg';
import Save1Icon from '../../../../assets/icons/save1.svg';
import Save2Icon from '../../../../assets/icons/save2.svg';

const options = [
  { id: 'few', text: '적음' },
  { id: 'average', text: '적당' },
  { id: 'many', text: '많음' },
];

export default function PowerSocket({ onComplete, title }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleDoneClick = () => {
    if (!selectedOption) return;
    onComplete({ powerSocket: selectedOption });
  };

  return (
    <div className="quest-container">
      <div className="quest-content">
        <img src={PlugIcon} alt="콘센트" className="quest-main-icon" />
        <p className="quest-instruction-small">충전 CHECK</p>
        <p className="quest-instruction">
          <span className="store-name">{title}</span> 내 <br />
          전기 플러그의 개수는 충분한가요?
        </p>

        {/* 선택 버튼 UI */}
        <div className="outlet-options-new">
          {options.map((option) => (
            <button
              key={option.id}
              className={`outlet-option-new ${selectedOption === option.id ? 'selected' : ''}`}
              onClick={() => setSelectedOption(option.id)}
            >
              {option.text}
            </button>
          ))}
        </div>
        <p className="drag-text">선택하여 기록하기</p>
      </div>

      <div className="quest-footer">
        <button 
          className="quest-button-new" 
          onClick={handleDoneClick}
          disabled={!selectedOption}
        >
          <img src={selectedOption ? Save2Icon : Save1Icon} alt="기록하기" />
        </button>
      </div>
    </div>
  );
}