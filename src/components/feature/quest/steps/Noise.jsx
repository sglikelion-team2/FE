import React ,{useState} from 'react';
import './Quest.css';


export default function Noise({onComplete}) {
 
  const [noiseLevel, setNoiseLevel] = useState(3); // 1~5 사이의 값, 기본값 3

  const handleDoneClick = () => {
    // 여기에 선택된 소음 정보를 서버로 보내는 로직을 추가할 수 있습니다.
    onComplete({noiseLevel});
  };

  const handleResetClick = () => {
    setNoiseLevel(3); // 기본값으로 리셋
  };

  return (
    <div className="quest-container">
      <div className="quest-header">
        <span className="quest-title">Quest</span>
        <button className="close-button">X</button>
      </div>
      
      <div className="quest-content">
        <p className="quest-instruction">
          "매장이름" 의 <br />
          주변 소음 정도를 기록해 주세요
        </p>

        <div className="noise-visualizer">
          <span className="icon">🔉</span>
          <div className="bars">
            {/* noiseLevel에 따라 활성화된 막대 스타일을 동적으로 적용 */}
            <div className={`bar ${noiseLevel >= 1 ? 'active' : ''}`}></div>
            <div className={`bar ${noiseLevel >= 2 ? 'active' : ''}`}></div>
            <div className={`bar ${noiseLevel >= 3 ? 'active' : ''}`}></div>
            <div className={`bar ${noiseLevel >= 4 ? 'active' : ''}`}></div>
            <div className={`bar ${noiseLevel >= 5 ? 'active' : ''}`}></div>
          </div>
        </div>
        
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={noiseLevel}
          onChange={(e) => setNoiseLevel(e.target.value)}
          className="noise-slider"
        />
      </div>

      <div className="quest-footer">
        <button className="quest-button reset" onClick={handleResetClick}>Reset</button>
        <button className="quest-button done" onClick={handleDoneClick}>Done</button>
      </div>
    </div>
  );
}