import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './UserPreferences.css';
import { savePreferences } from '../../../mocks/mockapi'; // << 가짜 API를 가져옵
import BackIcon from '../../../assets/icons/back.svg';
import WifiIcon from '../../../assets/icons/wifi.svg';
import OutletIcon from '../../../assets/icons/plug.svg';
import Zarichat1 from '../../../assets/icons/zarichat1.svg';
import Zarichat2 from '../../../assets/icons/zarichat2.svg';


const purposeOptions = ["개인 공부", "레포트 작성", "팀플"];
const moodOptions = [
  "조용", "차분", "활기", "아늑", "상쾌", 
  "Chill", "트렌디", "Lo-fi", "R&B", "따뜻"
];

export default function UserPreferences() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  

  const [selections, setSelections] = useState({
    purpose: '',      // 방문 목적 (단일 선택)
    moods: '',        // 분위기 (단일 선택)
    needsWifi: false, // 필수 옵션
    needsOutlet: false // 필수 옵션
  });
  
  const [isSelectionComplete, setIsSelectionComplete] = useState(false);

  // 닉네임 불러오기
  useEffect(() => {
    setNickname(localStorage.getItem('current_user') || '사용자');
  }, []);

  useEffect(() => {
    setNickname(localStorage.getItem('current_user') || '사용자');
  }, []);

  useEffect(() => {
    if (selections.purpose && selections.mood) {
      setIsSelectionComplete(true);
    } else {
      setIsSelectionComplete(false);
    }
  }, [selections]);

  const handlePurposeClick = (purpose) => {
    setSelections(prev => ({ ...prev, purpose }));
  };

  const handleMoodClick = (mood) => {
    setSelections(prev => ({ ...prev, mood }));
  };

  const handleNeedChange = (e) => {
    const { name, checked } = e.target;
    setSelections(prev => ({ ...prev, [name]: checked }));
  };

  // API 전송을 위한 데이터 변환 함수
  const mapToApiData = () => {
    const { purpose, mood, needsWifi, needsOutlet } = selections;

    const purposeMap = { "개인 공부": 0, "레포트 작성": 1, "팀플": 2, "회의": 3 };
    const atmosMap = { 
      "조용": 0, "차분": 1, "활기": 2, "아늑": 3, "상쾌": 4, 
      "Chill": 5, "트렌디": 6, "Lo-fi": 7, "R&B": 8, "따뜻": 9 
    };
    
    let facilityCode = null;
    if (needsOutlet && needsWifi) facilityCode = 2;
    else if (needsWifi) facilityCode = 1;
    else if (needsOutlet) facilityCode = 0;

    return {
      name: nickname,
      purpose: purposeMap[purpose],
      atmos: atmosMap[mood],
      facility: facilityCode,
    };
  };

  const handleFindClick = async () => {
    const apiData = mapToApiData();
    console.log("API로 전송할 데이터:", apiData);

    // API 호출 로직 (Mock)
    try {
      const response = await savePreferences(apiData);
      if (response.isSuccess) {
        navigate("/complete");
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("요청 중 에러가 발생했습니다.");
    }
  };

  return (
    <div className="pref-container">
      <div className="pref-header">
        <div className="progress-bar">
          <div className="progress-step"></div>
          <div className="progress-step active"></div>
          <div className="progress-step"></div>
        </div>
        <button className="back-button" onClick={() => navigate('/nickname')}>
          <img src={BackIcon} alt="뒤로가기" />
        </button>
        <h1 className="pref-title">
          <span className="nickname">{nickname}</span>님이<br/>
          공부하고 싶은 자리는<br/>
          이런 곳!
        </h1>
      </div>

      <div className="pref-section">
        <h3 className="section-title">방문 목적</h3>
        <div className="options-grid purpose">
          {purposeOptions.map(option => (
            <button
              key={option}
              className={`option-chip ${selections.purpose === option ? 'selected' : ''}`}
              onClick={() => handlePurposeClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-section">
        <h3 className="section-title">분위기</h3>
        <div className="options-grid mood">
          {moodOptions.map(option => (
            <button
              key={option}
              className={`option-chip ${selections.mood === option ? 'selected' : ''}`}
              onClick={() => handleMoodClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="pref-section">
        <h3 className="section-title">꼭 필요한 옵션</h3>
        <div className="needs-options">
          <label className="need-item">
            <input type="checkbox" name="needsWifi" checked={selections.needsWifi} onChange={handleNeedChange} />
            
            <span>Wi-Fi</span><img src={WifiIcon} alt="와이파이" />
          </label>
          <label className="need-item">
            <input type="checkbox" name="needsOutlet" checked={selections.needsOutlet} onChange={handleNeedChange} />
            <span>콘센트</span><img src={OutletIcon} alt="콘센트" />
            
          </label>
        </div>
      </div>

      <div className="pref-footer">
        <button className="find-button" onClick={handleFindClick} disabled={!isSelectionComplete}>
          <img src={isSelectionComplete ? Zarichat2 : Zarichat1} alt="자리찾기" />
        </button>
      </div>
    </div>
  );
}