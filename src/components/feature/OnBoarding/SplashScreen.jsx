import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css'; 
import ZaritLogo from '../../../assets/icons/zarit-logo.svg';

export default function SplashScreen() {
  const navigate = useNavigate();

  const handleScreenClick = () => {
    navigate('/nickname');
  };

  return (
    <div className="splash-container" onClick={handleScreenClick}>
      {/* "글씨 부분" */}
      <div className="splash-text-wrapper">
        <p className="splash-intro-text">
          좋은 자리를 찾는<br />
          짜릿한 순간,
        </p>
      </div>
      
      {/* "로고 부분" */}
      <div className="splash-logo-box">
        <img src={ZaritLogo} alt="Zarit Logo" className="splash-logo" />
        <h1 className="splash-brand-title">Zarit</h1>
      </div>
    </div>
  );
}