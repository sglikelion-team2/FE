import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css'; 
import ZaritLogo from '../../../assets/icons/zarit-logo.svg';

export default function SplashScreen() {
  const navigate = useNavigate();
   useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/nickname');
    }, 2500); // 1.2초 뒤 자동 이동 (원하면 800~1500ms로 조정)
    return () => clearTimeout(timer);
  }, [navigate]);


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
        
      </div>
    </div>
  );
}