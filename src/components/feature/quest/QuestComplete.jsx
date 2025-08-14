import React, { useState,useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './QuestComplete.css'; // 전용 CSS 파일

const studyQuotes=[

  "배움은 의무가 될 때 재미가 없다.",
  "오늘 걷지 않으면 내일은 뛰어야 한다.",
  "가장 유능한 사람은 가장 배우기 힘쓰는 사람이다.",
  "포기하지 않는 한, 실패는 없다.",
  "공부할 때의 고통은 잠깐이지만, 못 배운 고통은 평생이다.",
  "성공은 가장 끈기 있는 자에게 돌아간다.",
  "지금 흘린 침은 내일 흘릴 눈물이 된다.",
  "불가능, 그것은 나약한 사람들의 핑계에 불과하다.",
  "꿈이 바로 앞에 있는데, 당신은 왜 팔을 뻗지 않는가?",
  "노력은 배신하지 않는다.",
  "실패는 성공의 어머니다.",
  "늦었다고 생각할 때가 가장 빠른 때이다.",
  "한 시간 더 공부하면 배우자의 얼굴이 바뀐다.",
  "천재는 1%의 영감과 99%의 노력으로 이루어진다.",
  "행동의 가치는 그 행동을 끝까지 이루는 데 있다."

];


export default function QuestComplete() {
  const navigate = useNavigate();
  const [randomQuote,setRandomQuote]=useState('');
  const location=useLocation();

  const reward=location.state?.reward||0 ;


  useEffect(()=>{
    const randomIndex=Math.floor(Math.random()*studyQuotes.length);
    setRandomQuote(studyQuotes[randomIndex]);
},[]);

const handleGoToMap=() =>{
    navigate('/map');
}
  return (
    <div className="complete-page-container">
      <div className="complete-icon">✔️</div>
      <h2 className="complete-title">기록 완료!</h2>
      <p className="complete-reward">
        리워드(보상): {reward} P
      </p>
      <div className="quote-section">
        <p className="study-quote">"{randomQuote}"</p>
      </div>
      <div className="action-section">

        <button className="go-to-map-button" onClick={handleGoToMap}>공부 스팟 고르기</button>
      </div>
    </div>
  );
}