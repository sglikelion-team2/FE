import React, { useState } from "react";
import { useUserPref } from "../../../store/userPref";
import { useNavigate } from "react-router-dom";
import './UserPreferences.css';
import { savePreferences } from '../../../mocks/mockapi'; // << 가짜 API를 가져옵

const purposeOptions = ["공부", "레포트 작성", "팀플", "회의"];
const moodOptions = [
  { id: "calm", text: "조용한" },
  { id: "lively", text: "활기찬" },
  { id: "chill", text: "편안한" },
  { id: "RnB", text: "R&B" },
  { id: "LoFi", text: "LoFi" },
  { id: "whichever", text: "상관없음" },
];

export default function UserPreferences() {
  const [purpose, setPurpose] = useState("");
  const [mood, setMood] = useState(""); 
  const [wifi, setWifi] = useState(false);
  const [outlet, setOutlet] = useState(false);
  const { setNeed } = useUserPref();
  const navigate = useNavigate();

const mapToApiData = (prefs) => {
  const purposeMap = { "공부": 0, "레포트 작성": 1, "팀플": 2, "회의": 3 };
  const moodMap = { "calm": 0, "적당": 1, "chill": 2, "RnB": 3, "LoFi": 4, "whichever": 5};
  
  let facilityCode = -1;
  if (prefs.outlet && prefs.wifi) facilityCode = 2;
  else if (prefs.wifi) facilityCode = 1;
  else if (prefs.outlet) facilityCode = 0;

  return {
    name: localStorage.getItem("current_user"),
    purpose: purposeMap[prefs.purpose],
    atmos: moodMap[prefs.mood],
    facility: facilityCode,
  };
};
  const handlePurposeChange = (e) => {
    setPurpose(e.target.value);
  };

  // 'mood' 핸들러를 라디오 버튼용으로 변경
  const handleMoodChange = (e) => {
    setMood(e.target.value);
  };

 
const handleNextClick = async () => { 

    setNeed({ nickname: localStorage.getItem("current_user"), purpose, mood, wifi, outlet });


  const currentUser = localStorage.getItem("current_user");
  if (!currentUser) { /* ... 에러 처리 ... */ return; }

  // 1. API가 요구하는 형식으로 데이터 변환
  const apiData = mapToApiData({ purpose, mood, wifi, outlet });

  // 2. 필수값이 모두 있는지 확인
  if (apiData.name == null || apiData.purpose == null || apiData.atmos == null || apiData.facility === -1) {
    alert("모든 값을 선택해주세요.");
    return;
  }

  try {
    // 3. 백엔드에 선호도 데이터 전송
    const response = await savePreferences(apiData);

    if (response.isSuccess) {
      // (선택사항) 성공 응답을 받으면 localStorage 캐시를 업데이트 할 수도 있음
      // 또는 그냥 다음 페이지로 넘어가도 무방
      navigate("/complete");
    } else {
      alert(response.message);
    }
  } catch (error) {
    console.error("선호도 저장 API 호출 중 에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }
};

  return (
    <div className="pref-container">
      <h1>내가 원하는 공간은?</h1>

      <div className="pref-section">
        <h3>방문 목적</h3>
        <div className="purpose-options">
          {purposeOptions.map((option) => (
            <label key={option} className="custom-radio">
              <input
                type="radio"
                name="purpose"
                value={option}
                checked={purpose === option}
                onChange={handlePurposeChange}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pref-section">
        <h3>분위기 및 음악</h3>
        <div className="mood-options">
          {moodOptions.map((option) => (
         
            <label key={option.id} className="custom-checkbox"> 
              <input
                type="radio" // 타입을 'radio'로 변경
                name="mood" // 모든 버튼이 같은 name을 갖도록 설정
                value={option.id} // value를 id로 설정
                checked={mood === option.id} // 체크 여부 비교 로직 변경
                onChange={handleMoodChange} // 새로운 핸들러 연결
              />
              <span>{option.text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pref-section">
        <h3>필수 시설</h3>
        <div className="facility-options">
          <label>
            <input
              type="checkbox"
              name="wifi"
              checked={wifi}
              onChange={(e) => setWifi(e.target.checked)}
            />
            Wi-Fi 필요
          </label>
          <label>
            <input
              type="checkbox"
              name="outlet"
              checked={outlet}
              onChange={(e) => setOutlet(e.target.checked)}
            />
            콘센트 필요
          </label>
        </div>
      </div>

      <button className="next-button" onClick={handleNextClick}>Next</button>
    </div>
  );
}


// API 형식에 맞게 데이터 변환하는 함수

