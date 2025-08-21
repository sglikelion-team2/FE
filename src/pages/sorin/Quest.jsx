import React, { useState, useEffect } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';

import Noise from '../../components/feature/quest/steps/Noise';
import Wifi from '../../components/feature/quest/steps/Wifi';
import PowerSocket from '../../components/feature/quest/steps/PowerSocket';
import Photo from '../../components/feature/quest/steps/Photo';

const questConfig = {
  noise: { component: Noise, reward: 10 },
  wifi: { component: Wifi, reward: 10 },
  power: { component: PowerSocket, reward: 15 },
  photo: { component: Photo, reward: 25 },
};
const questKeys = Object.keys(questConfig);

export default function Quest() {
  const navigate = useNavigate();
  const location=useLocation();
  const [currentQuestKey, setCurrentQuestKey] = useState(null);

  const storeTitle=location.state?.title||"매장이름";

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * questKeys.length);
    setCurrentQuestKey(questKeys[randomIndex]);
  }, []);

  const handleQuestComplete = (questData) => {
   
    if (!currentQuestKey) {
      console.error("2. 🛑 에러: currentQuestKey가 없습니다. 여기서 중단됩니다.");
      return;
    }
  
    const questInfo = questConfig[currentQuestKey];
    if (!questInfo) {
      console.error("3. 🛑 에러: 퀘스트 키에 해당하는 정보를 찾을 수 없습니다.");
      return;
    }
   
    const currentUser = localStorage.getItem('current_user');
    if (!currentUser) {
      console.error("4. 🛑 에러: 현재 사용자(current_user)를 찾을 수 없습니다.");
      return;
    }
  
    // 🚨 중요: localStorage 키 이름이 'zarit_users'가 맞는지 확인해주세요!
    // 이전에 'jari_issoyo_users'로 만들었다면 여기서 데이터를 못 찾을 수 있습니다.
    const allUsersData = JSON.parse(localStorage.getItem('zarit_users')) || {};
    const userData = allUsersData[currentUser];
    
    if (!userData) {
      
      return;
    }

    // 보상 누적 및 저장 로직은 이전과 동일
    const currentTotalReward = userData.quests?.coins || 0;
    const newTotalReward = currentTotalReward + questInfo.reward;
    userData.quests = { ...userData.quests, coins: newTotalReward };
    localStorage.setItem('zarit_users', JSON.stringify(allUsersData));
    
    
    // 최종 페이지 이동
    navigate('/quest-complete', { state: { reward: questInfo.reward } });
  };

  const renderQuestStep = () => {
    if (!currentQuestKey) {
      return <div>퀘스트를 불러오는 중...</div>;
    }
    const QuestComponent = questConfig[currentQuestKey].component;
    return <QuestComponent onComplete={handleQuestComplete} title={storeTitle}/>;
  };

  return (
    <div className="quest-flow-container">
      {renderQuestStep()}
    </div>
  );
}

