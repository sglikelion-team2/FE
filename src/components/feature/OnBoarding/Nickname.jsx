import React, { useState } from "react";
import { useUserPref } from "../../../store/userPref";  // Context 사용
import './Nickname.css';  // 스타일 적용
import { useNavigate } from "react-router-dom"; 
import { loginUser } from '../../../mocks/mockapi'; // << 가짜 API를 가져옵
import PencilIcon from '../../../assets/icons/pencil_2.svg';
import CloseIcon from '../../../assets/icons/close_filled.svg';
import Next1Icon from '../../../assets/icons/Next_1.svg';
import Next2Icon from '../../../assets/icons/Next_2.svg';

export default function Nickname({ onNext }) {
  const [nickname, setNickname] = useState(""); // 닉네임 상태
  const [isValid, setIsValid] = useState(false); // 유효성 체크
  const { setNickname: setContextNickname } = useUserPref(); // Context에서 setNickname 호출
const navigate = useNavigate();

  const handleInputChange = (e) => {
    let value = e.target.value; 
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    setNickname(value); // 잘라낸 값을 state에 저장
    setIsValid(value.length >= 1 && value.length <= 10);
  };

   const handleClearInput = () => {
    setNickname("");
    setIsValid(false);
  };

const handleNextClick = async () => { 
  if (isValid) {
    try {
      // 1. API 호출
      const response = await loginUser(nickname);

      // 2. API 호출 성공 시
      if (response.isSuccess) {
        

        
        // 3. localStorage에서 전체 사용자 데이터 가져오기
        const allUsersDataString = localStorage.getItem("zarit_users");
        const allUsersData = allUsersDataString ? JSON.parse(allUsersDataString) : {};

        // 4. 새로운 사용자인 경우에만 데이터 공간 생성
        if (!allUsersData[nickname]) {
          console.log(`새로운 사용자 [${nickname}]의 데이터 공간을 생성합니다.`);
          allUsersData[nickname] = {
            preferences: {}, // 취향 정보는 나중에 채워짐
            quests: { coins: 0 } // 퀘스트 정보(코인) 초기화
          };
          // 수정된 전체 데이터를 다시 localStorage에 저장
          localStorage.setItem("zarit_users", JSON.stringify(allUsersData));
        }

        // 5. 현재 사용자가 누구인지 localStorage에 기록
        localStorage.setItem("current_user", response.result.name);
        
        // Context에도 닉네임 설정
        setContextNickname(nickname);
        
        // 다음 페이지로 이동
        navigate("/preferences");

      } else {
        // API가 실패 응답을 보냈을 때
        alert(response.message);
      }
    } catch (error) {
      // 네트워크 에러 등 fetch 자체가 실패했을 때
      console.error("로그인 API 호출 중 에러 발생:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }
  }
};
 return (
    <div className="nickname-container">
      {/*  3. 피그마 상단의 진행 바 추가 */}
      <div className="progress-bar">
        <div className="progress-step active"></div>
        <div className="progress-step"></div>
        <div className="progress-step"></div>
      </div>

      <div className="nickname-header">
        <span className="brand-name">Zarit</span>
        <h1 className="main-title">
          공부할 자리<br />
          찾으러 가기 전에,
        </h1>
      </div>
      

      <div className="nickname-input-wrapper">
        <input
          className="nickname-input"
          type="text"
          placeholder="닉네임을 입력해 주세요"
          value={nickname}
          onChange={handleInputChange}
          maxLength={10}
        />
        {nickname.length === 0 ? (
          <img src={PencilIcon} alt="입력" className="input-icon" />
        ) : (
          <img 
            src={CloseIcon} 
            alt="지우기" 
            className="input-icon clear" 
            onClick={handleClearInput} 
          />
        )}
      </div>
      <p className="char-counter">({nickname.length}/10)</p>

      <div className="nickname-footer">
        <button className="next-button" onClick={handleNextClick} disabled={!isValid}>
          <img src={isValid ? Next2Icon : Next1Icon} alt="다음으로" />
        </button>
      </div>
    </div>
  );
}
