import React ,{useState} from 'react';
import './Quest.css';
import EarIcon from '../../../../assets/icons/ear.svg';
import Save1Icon from '../../../../assets/icons/save1.svg';
import Save2Icon from '../../../../assets/icons/save2.svg';
import SoundIcon from '../../../../assets/icons/sound.svg';

export default function Noise({onComplete,title}) {
 
  const [noiseLevel, setNoiseLevel] = useState(0); // 
const handleDoneClick = () => {
    if (noiseLevel === 0) {
      alert("소음 정도를 선택해주세요!");
      return;
    }
    onComplete({ noiseLevel });
  };

  return (
    <div className="quest-container">
      {/* 헤더 부분은 새 디자인에 없으므로 삭제 */}
      
      <div className="quest-content">
              <img src={SoundIcon} alt="소음" className="quest-main-icon" />
        <p className="quest-instruction-small">소음 CHECK</p>
        <p className="quest-instruction">
          <span className="store-name">{title}</span> 의 <br />
          주변 소음 정도를 기록해 주세요!
        </p>

        <div className="noise-visualizer-new">
          <img src={EarIcon} alt="소음 측정" className="ear-icon" />
          <div className="sound-domes">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`sound-dome dome-${level} ${noiseLevel >= level ? 'active' : ''}`}
                onClick={() => setNoiseLevel(level)}
              />
            ))}
          </div>
        </div>
        <p className="drag-text">드래그하여 기록하기</p>
      </div>

      <div className="quest-footer">
        {/* ✅ noiseLevel 값에 따라 다른 버튼 아이콘을 보여줌 */}
        <button 
          className="quest-button-new" 
          onClick={handleDoneClick} 
          disabled={noiseLevel === 0}
        >
          <img src={noiseLevel > 0 ? Save2Icon : Save1Icon} alt="기록하기" />
        </button>
      </div>
    </div>
  );
}