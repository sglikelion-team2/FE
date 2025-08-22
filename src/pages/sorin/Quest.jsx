import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ❌ API 함수 import 삭제

// 퀘스트 컴포넌트들
import Noise from '../../components/feature/quest/steps/Noise';
import Wifi from '../../components/feature/quest/steps/Wifi';
import PowerSocket from '../../components/feature/quest/steps/PowerSocket';
import Photo from '../../components/feature/quest/steps/Photo';

// questConfig에서 reward 제거
const questConfig = {
  noise: { component: Noise },
  wifi: { component: Wifi },
  power: { component: PowerSocket },
  photo: { component: Photo },
};
const questKeys = Object.keys(questConfig);

export default function Quest() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestKey, setCurrentQuestKey] = useState(null);
  const storeTitle = location.state?.title || "매장이름"; 

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * questKeys.length);
    setCurrentQuestKey(questKeys[randomIndex]);
  }, []);

  const handleQuestComplete = async (questData) => {
    if (!currentQuestKey) return;
    
    const currentUser = localStorage.getItem('current_user');
    const API_BASE_URL = process.env.REACT_APP_PROJECT_API;
    let endpoint = '';
    let payload;
    let isFormData = false;

    // 퀘스트에 따라 API 경로와 보낼 데이터를 설정
    switch (currentQuestKey) {
      case 'noise':
        endpoint = '/quest/{name}/noise';
        payload = { name: currentUser, pin_name: storeTitle.trim(), noise: questData.noiseLevel };
        break;
      case 'wifi':
        endpoint = '/quest/{name}/wifi';
        payload = { name: currentUser, pin_name: storeTitle.trim(), wifi: questData.wifiStrength };
        break;
      case 'power':
        endpoint = '/quest/{name}/plugbar';
        const powerMap = { 'few': 1, 'average': 2, 'many': 3 };
        payload = { name: currentUser, pin_name: storeTitle.trim(), plugbar: powerMap[questData.powerSocket] };
        break;
      case 'photo':
        endpoint = '/quest/{name}/atmos';
        isFormData = true;
        const formData = new FormData();
        formData.append('photo', questData.photo);
        formData.append('pin_name', storeTitle.trim());
        payload = formData;
        break;
      default:
        return;
    }

    try {
      // API 요청 보내기
        const finalEndpoint = endpoint.replace('{name}', encodeURIComponent(currentUser));

      const response = await fetch(`${API_BASE_URL}${finalEndpoint}`, {
        method: 'POST',
        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        body: isFormData ? payload : JSON.stringify(payload),
      });

      const data = await response.json();

      // 응답 처리
      if (data.isSuccess) {
        const earnedPoints = data.result.point;
        // ... (localStorage에 보상 누적하는 로직)
        const allUsersData = JSON.parse(localStorage.getItem('zarit_users')) || {};
        const userData = allUsersData[currentUser];
        if (!userData) return;
        const currentTotalReward = userData.quests?.coins || 0;
        const newTotalReward = currentTotalReward + earnedPoints;
        userData.quests.coins = newTotalReward;
        localStorage.setItem('zarit_users', JSON.stringify(allUsersData));

        navigate('/quest-complete', { state: { reward: earnedPoints } });
      } else {
        alert(data.message || '퀘스트 기록에 실패했습니다.');
      }
    } catch (error) {
      console.error(`${currentQuestKey} 퀘스트 API 호출 중 에러:`, error);
      alert('서버와 통신 중 문제가 발생했습니다.');
    }
  };

  const renderQuestStep = () => {
    if (!currentQuestKey) return <div>퀘스트를 불러오는 중...</div>;
    const QuestComponent = questConfig[currentQuestKey].component;
    return <QuestComponent onComplete={handleQuestComplete} title={storeTitle} />;
  };

  return (
    <div className="quest-flow-container">
      {renderQuestStep()}
    </div>
  );
}