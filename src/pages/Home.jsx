import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [nickname, setNickname] = useState('');
  const [purpose, setPurpose] = useState('');
  const [mood, setMood] = useState('');
  const [facilities, setFacilities] = useState({ wifi: false, outlet: false });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 온보딩 정보 저장 후 다음 페이지로 이동
    navigate('/map');
  };

  return (
    <div className="home-container">
      <h1> ZARIT - 온보딩</h1>
      <form onSubmit={handleSubmit}>
        <label>
          닉네임:
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요!"
          />
        </label>
        <label>
          목적:
          <select onChange={(e) => setPurpose(e.target.value)}>
            <option value="study">공부</option>
            <option value="report">레포트</option>
            <option value="teamwork">팀플</option>
          </select>
        </label>
        <label>
          분위기:
          <select onChange={(e) => setMood(e.target.value)}>
            <option value="quiet">조용</option>
            <option value="moderate">적당</option>
            <option value="vibrant">활기</option>
          </select>
        </label>
        <label>
          필수 시설:
          <input
            type="checkbox"
            onChange={() => setFacilities({ ...facilities, wifi: !facilities.wifi })}
          /> Wi-Fi
          <input
            type="checkbox"
            onChange={() => setFacilities({ ...facilities, outlet: !facilities.outlet })}
          /> 콘센트
        </label>
        <button type="submit">시작하기</button>
      </form>
    </div>
  );
};

export default Home;
