import React, { useState } from "react";
import { useUserPref } from "../../../store/userPref";
import './Nickname.css';
import { useNavigate } from "react-router-dom"; 
// 아이콘 import
import PencilIcon from '../../../assets/icons/pencil_2.svg';
import CloseIcon from '../../../assets/icons/close_filled.svg';
import Next1Icon from '../../../assets/icons/Next_1.svg';
import Next2Icon from '../../../assets/icons/Next_2.svg';

export default function Nickname() {
  const [nickname, setNickname] = useState("");
  const [isValid, setIsValid] = useState(false);
  const { setNickname: setContextNickname } = useUserPref();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setNickname(value);
    setIsValid(value.length >= 1 && value.length <= 10);
  };

  const handleClearInput = () => {
    setNickname("");
    setIsValid(false);
  };

  const handleNextClick = async () => { 
    if (isValid) {
      try {
        const API_URL = `/api/login`;

        const response = await fetch(API_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: nickname }),
  // credentials: "include", // 세션 쓰면
});
        const data = await response.json();

        if (data.isSuccess) {
          const allUsersDataString = localStorage.getItem("zarit_users");
          const allUsersData = allUsersDataString ? JSON.parse(allUsersDataString) : {};

          if (!allUsersData[nickname]) {
            console.log(`새로운 사용자 [${nickname}]의 데이터 공간을 생성합니다.`);
            allUsersData[nickname] = {
              preferences: {},
              quests: { coins: 0 }
            };
            localStorage.setItem("zarit_users", JSON.stringify(allUsersData));
          }

          localStorage.setItem("current_user", data.result.name);
          setContextNickname(nickname);
          navigate("/preferences");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("로그인 API 호출 중 에러 발생:", error);
        alert("서버와 통신 중 문제가 발생했습니다.");
      }
    }
  };
  
 return (
    <div className="nickname-container">
     
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