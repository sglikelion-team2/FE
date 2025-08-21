import React, { useState } from 'react';
import './Quest.css';

import NetworkIcon from '../../../../assets/icons/network.svg';
import Save1Icon from '../../../../assets/icons/save1.svg';
import Save2Icon from '../../../../assets/icons/save2.svg';

export default function Wifi({ onComplete, title }) {
  const [wifiStrength, setWifiStrength] = useState(0); // 0~4 (점+아치3)

  const handleDoneClick = () => {
    if (wifiStrength === 0) return;
    onComplete({ wifiStrength });
  };

  return (
    <div className="quest-container">
      <div className="quest-content">
        <img src={NetworkIcon} alt="네트워크" className="quest-main-icon" />
        <p className="quest-instruction-small">네트워크 CHECK</p>
        <p className="quest-instruction">
          <span className="store-name">{title}</span> 의 <br />
          Wi-Fi 상태를 기록해 주세요!
        </p>

        {/* ✅ SVG 기반 와이파이 (아치 3 + 점 1) */}
        <div className="wifi-visualizer">
          <svg
            className={`wifi-svg strength-${wifiStrength}`}
            viewBox="0 0 256 200"
            width="200"
            height="160"
            aria-label={`Wi-Fi strength ${wifiStrength}/4`}
          >
            {/* 바깥 아치(4단계) */}
            <path
              className="wifi-arc arc-outer"
              d="M 32 80 A 96 96 0 0 1 224 80"
              onClick={() => setWifiStrength(4)}
            />
            {/* 가운데 아치(3단계) */}
            <path
              className="wifi-arc arc-mid"
              d="M 64 112 A 64 64 0 0 1 192 112"
              onClick={() => setWifiStrength(3)}
            />
            {/* 안쪽 아치(2단계) */}
            <path
              className="wifi-arc arc-inner"
              d="M 96 144 A 32 32 0 0 1 160 144"
              onClick={() => setWifiStrength(2)}
            />
            {/* 점(1단계) */}
            <circle
              className="wifi-dot"
              cx="128"
              cy="168"
              r="12"
              onClick={() => setWifiStrength(1)}
            />
          </svg>
        </div>

        <p className="drag-text">터치/클릭하여 기록하기</p>
      </div>

      <div className="quest-footer">
        <button
          className="quest-button-new"
          onClick={handleDoneClick}
          disabled={wifiStrength === 0}
        >
          <img src={wifiStrength > 0 ? Save2Icon : Save1Icon} alt="기록하기" />
        </button>
      </div>
    </div>
  );
}
