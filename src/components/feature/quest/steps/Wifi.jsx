import React, { useState } from 'react';
// 🚨 자식은 페이지 이동을 직접 하지 않으므로 useNavigate가 필요 없습니다.
import './Quest.css';

// ✅ 부모로부터 onComplete 함수를 props로 받습니다.
export default function Wifi({ onComplete }) {

  const [wifiStrength, setWifiStrength] = useState(3);

  const handleDoneClick = () => {
    // 🚨 직접 이동하는 navigate('/quest-complete'); 코드는 반드시 삭제!
    
    // ✅ 부모에게 퀘스트가 완료되었음을 알리고, 관련 데이터를 전달합니다.
    onComplete({ wifiStrength });
  };

  const handleResetClick = () => {
    setWifiStrength(3);
  };

  return (
    <div className="quest-container">
      {/* ... 나머지 JSX 코드는 그대로 ... */}
      <div className="quest-footer">
        <button className="quest-button reset" onClick={handleResetClick}>Reset</button>
        <button className="quest-button done" onClick={handleDoneClick}>Done</button>
      </div>
    </div>
  );
}