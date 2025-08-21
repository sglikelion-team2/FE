import React, { useState } from 'react';
import './Quest.css'; // Quest.jsx와 같은 CSS 파일을 사용한다고 가정

// 기존 아이콘 import는 유지
import NetworkIcon from '../../../../assets/icons/network.svg';
import Save1Icon from '../../../../assets/icons/save1.svg';
import Save2Icon from '../../../../assets/icons/save2.svg';

// ✅ 새로운 와이파이 아이콘 8개 import
import WifiFalse0 from '../../../../assets/icons/wifi_false0.svg';
import WifiFalse1 from '../../../../assets/icons/wifi_false1.svg';
import WifiFalse2 from '../../../../assets/icons/wifi_false2.svg';
import WifiFalse3 from '../../../../assets/icons/wifi_false3.svg';
import WifiFilled0 from '../../../../assets/icons/wifi_0.svg';
import WifiFilled1 from '../../../../assets/icons/wifi_1.svg';
import WifiFilled2 from '../../../../assets/icons/wifi_2.svg';
import WifiFilled3 from '../../../../assets/icons/wifi_3.svg';

// ✅ 아이콘 관리를 편하게 하기 위해 배열로 정리
const wifiIconLevels = [
  { level: 1, unfilled: WifiFalse0, filled: WifiFilled0 }, // 동그라미 (맨 아래)
  { level: 2, unfilled: WifiFalse1, filled: WifiFilled1 }, // 작은 아치
  { level: 3, unfilled: WifiFalse2, filled: WifiFilled2 }, // 중간 아치
  { level: 4, unfilled: WifiFalse3, filled: WifiFilled3 }, // 큰 아치 (맨 위)
];

export default function Wifi({ onComplete, title }) {
  // wifiStrength: 0 (선택 안 함), 1~4 (채워진 칸 수)
  const [wifiStrength, setWifiStrength] = useState(0);

  const handleDoneClick = () => {
    if (wifiStrength === 0) return;
    // wifiStrength는 1~4 사이의 값이 됩니다.
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

        {/* ✅ 와이파이 아이콘 선택 UI */}
        <div className="wifi-icon-selector">
          {wifiIconLevels.map((icon) => (
            <img
              key={icon.level}
              src={wifiStrength >= icon.level ? icon.filled : icon.unfilled}
              alt={`와이파이 세기 ${icon.level}단계`}
              className="wifi-level-icon"
              onClick={() => setWifiStrength(icon.level)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setWifiStrength(icon.level)}
            />
          ))}
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
