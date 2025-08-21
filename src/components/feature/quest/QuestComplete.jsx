import React, { useState,useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './QuestComplete.css'; // 전용 CSS 파일

import {ReactComponent as CheckmarkCircle} from '../../../assets/icons/checkmark-circle.svg';
import { ReactComponent as LetsGoStudyButton } from '../../../assets/icons/letsgostudy.svg';

// 명언 데이터는 그대로 유지합니다.

const studyQuotes=[

  "“ 바쁜 꿀벌은 슬퍼할 겨를이 없다...⭐️ ”.",
  "“늦었다고 생각할 때가 진짜 늦은 것이다”",
  "“해야 할 일을 미루지 마라. 미뤄봤자 결국 내가 한다.”",
    "“걱정을 해서 걱정이 없어지면 걱정이 없겠네.”",
      "“지금 이 순간을 미루면, 인생마저 미루게 된다.”",
        "“시작은 반이 아니다. 시작은 그냥 시작일 뿐이다.”",
  "“노력은 배신하지 않는다. 배신한다면 아직 충분히 노력하지 않은 것이다.”",
  "“작은 습관이 큰 변화를 만든다.”",
  "“오늘 흘린 땀방울이 내일의 자신감을 만든다.”",
  "“포기하지 않는 한 실패는 없다.”",
  "“하루를 소중히 여기는 사람이 결국 인생을 바꾼다.”",
              

];

export default function QuestComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const [randomQuote, setRandomQuote] = useState('');

  // location.state에서 reward 값을 가져옵니다. 기본값은 0입니다.
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
      <div className="content-box">
        {/* 상단 체크마크 아이콘 */}
        <CheckmarkCircle className="checkmark-icon" />
        
        <h2 className="complete-title">퀘스트 완료 🎉</h2>
        <p className="complete-subtitle">
          오늘의 기록 덕분에 Zarit의 지도가 한층 더 똑똑해졌습니다!
        </p>

        {/* 리워드 섹션: reward 개수만큼 연필 이모지 렌더링 */}
        <div className="reward-section">
          <span className="reward-label">리워드 보상 : </span>
          <span className="reward-pencils">{'✏️'.repeat({reward})}</span>
        </div>
      </div>

      <hr className="divider" />

      {/* 명언 섹션 */}
      <div className="quote-box">
        <p className="study-quote">{randomQuote}</p>
        {/* UI에는 이름이 있지만, 데이터에 없어 임시로 표시합니다. */}
        {/* <span className="quote-author">- 익명의 지성인 -</span> */}
      </div>

      {/* 하단 '공부하러 가기' 버튼 */}
      <button className="lets-go-study-button" onClick={handleGoToMap}>
        <LetsGoStudyButton />
      </button>
    </div>
  );
}