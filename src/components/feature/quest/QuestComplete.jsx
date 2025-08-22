import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './QuestComplete.css'; 

import { ReactComponent as CheckmarkCircle } from '../../../assets/icons/checkmark-circle.svg';
import { ReactComponent as LetsGoStudyButton } from '../../../assets/icons/letsgostudy.svg';

const studyQuotes = [
  "“바쁜 꿀벌은 슬퍼할 겨를이 없다...⭐️”\n -서혜원-",
  "“늦었다고 생각할 때가 진짜 늦은 것이다”\n -박명수-",
  "“해야 할 일을 미루지 마라.\n미뤄봤자 결국 내가 한다.”\n -박소린-",
  "“자고싶다면 꿈에서나 성공해라.\n -지피티-",
  "“걱정을 해서 걱정이 없어지면\n걱정이 없겠네.”",
  "“미래 배우자의 얼굴은 현재 공부량이 좌우한다.”",
  "“지금 이 순간을 미루면, \n인생마저 미루게 된다.”",
  "“시작은 반이 아니다. \n시작은 그냥 시작일 뿐이다.”",
  "“노력은 배신하지 않는다.\n배신한다면 아직 충분히 노력하지 않은 것이다.”",
  "“집중은 Wi-Fi 신호 같아서 멀어지면 끊긴다.”",
  "“교재를 덮는 순간, 내 미래도 덮인다.”",
  "“작은 습관이 큰 변화를 만든다.”",
  "“오늘 흘린 땀방울이 내일의 자신감을 만든다.”",
  "“포기하지 않는 한 실패는 없다.”",
  "“하루를 소중히 여기는 사람이\n결국 인생을 바꾼다.”",
];

export default function QuestComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const [randomQuote, setRandomQuote] = useState('');

  const reward = location.state?.reward || 0;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * studyQuotes.length);
    setRandomQuote(studyQuotes[randomIndex]);
  }, []);

  const handleGoToMap = () => {
    navigate('/map');
  };

  return (
    <div className="quest-complete-container">
      <div className="quest-complete-main">
        <div className="content-box">
          <CheckmarkCircle className="checkmark-icon" />
          
          <h2 className="complete-title">퀘스트 완료 🎉</h2>
          <p className="complete-subtitle">
            {`오늘의 기록 덕분에 Zarit의 지도가\n한층 더 똑똑해졌습니다!`}
          </p>

          <div className="reward-section">
            <span className="reward-label">리워드 보상 : </span>
            <span className="reward-pencils">{'✏️'.repeat(reward)}</span>
          </div>
        </div>

        <hr className="divider" />

        <div className="quote-box">
          <p className="study-quote">{randomQuote}</p>
        </div>
      </div>

      <button className="lets-go-study-button" onClick={handleGoToMap}>
        <LetsGoStudyButton />
      </button>
    </div>
  );
}