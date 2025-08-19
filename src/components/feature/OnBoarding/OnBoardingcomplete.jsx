import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnBoardingComplete.css'; 
import LoadingState1 from '../../../assets/icons/connect1.svg';
import LoadingState2 from '../../../assets/icons/connect2.svg';
import SearchingButtonIcon from '../../../assets/icons/searching.svg';
import GoToMapButtonIcon from '../../../assets/icons/gotomap.svg'
import CheckmarkIcon from '../../../assets/icons/checkmark-circle.svg'
import SparkleIcon from '../../../assets/icons/sparkle.svg';

export default function OnBoardingComplete() {
  const navigate = useNavigate();

  const [status,setStatus]=useState('loading');
  useEffect(() => {
    // 1.5초 후에 'connecting' 상태로 변경 (3-0 -> 3-0-1)
    const timer1 = setTimeout(() => {
      setStatus('connecting');
    }, 1500);

    // 3초 후에 'complete' 상태로 변경 (3-0-1 -> 3)
    const timer2 = setTimeout(() => {
      setStatus('complete');
    }, 3000);

    // 컴포넌트가 사라질 때 타이머를 정리합니다.
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  // '지도 보러가기' 버튼 클릭 시 동작할 함수
  const handleShowMapClick = () => {
    // 실제 지도가 있는 페이지 경로로 이동합니다. (예: /map)
    navigate('/map'); 
  };

   const renderLoading = () => (
    <div className="onboarding-content-wrapper loading">
      <img src={SparkleIcon} alt="AI 추천 중" className="sparkle-icon" />
       <h2 className="status-title">
        AI가 당신에게 꼭 맞는 자리를<br />
        불러오고 있어요!
      </h2>
      <img 
        src={status === 'loading' ? LoadingState1 : LoadingState2} 
        alt="연결 중" 
        className="status-icon"
      />
     
      <div className="placeholder-group">
        <div className="placeholder-item"></div>
        <div className="placeholder-item"></div>
        <div className="placeholder-item"></div>
      </div>
      <div className="onboarding-footer">
        <button className="bottom-button" disabled>
          <img src={SearchingButtonIcon} alt="찾는 중..." />
        </button>
      </div>
    </div>
  );

  // 완료되었을 때 보여줄 UI
  const renderComplete = () => (
   <div className="onboarding-content-wrapper complete">
   
      <img src={CheckmarkIcon} alt="자리 확보 완료" className="status-icon" />
      <h2 className="status-title">자리 확보 완료 🎉</h2>
      <p className="status-subtitle">
        공부 명당을 찾은 짜릿한 이 순간! <br />
        이제 공부를 시작해 볼까요?
      </p>
      <div className="onboarding-footer">
        <button className="bottom-button" onClick={handleShowMapClick}>
          <img src={GoToMapButtonIcon} alt="공부하러 가기" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="onboarding-container">
      <div className="progress-bar">
        <div className="progress-step"></div>
        <div className="progress-step"></div>
        <div className="progress-step active"></div>
      </div>
      {status === 'complete' ? renderComplete() : renderLoading()}
    </div>
  );
}