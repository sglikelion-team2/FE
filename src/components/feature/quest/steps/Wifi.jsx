import React, { useState } from 'react';
import './Quest.css';

export default function Wifi({ onComplete }) {
  const [wifiStrength, setWifiStrength] = useState(3); // 1~5 단계, 기본값 3

  const handleDoneClick = () => {
    onComplete({ wifiStrength });
  };

  const handleResetClick = () => {
    setWifiStrength(3);
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
          네트워크 상태를 기록해 주세요
        </p>

        <div className="wifi-visualizer">
          <div className={`wifi-icon strength-${wifiStrength}`}>
            <div className="wifi-dot" onClick={() => setWifiStrength(1)}></div>
            <div className="wifi-arc arc-sm" onClick={() => setWifiStrength(2)}></div>
            <div className="wifi-arc arc-md" onClick={() => setWifiStrength(3)}></div>
            <div className="wifi-arc arc-lg" onClick={() => setWifiStrength(4)}></div>
            <div className="wifi-arc arc-xl" onClick={() => setWifiStrength(5)}></div>
          </div>
        </div>
      </div>

      <div className="quest-footer">
        <button className="quest-button reset" onClick={handleResetClick}>Reset</button>
        <button className="quest-button done" onClick={handleDoneClick}>Done</button>
      </div>
    </div>
  );
}