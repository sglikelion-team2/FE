import React from "react";
import Nickname from "../../components/feature/OnBoarding/Nickname";  // Nickname.jsx 컴포넌트 불러오기
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate

export default function OnBoarding() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Nickname onNext={() => navigate("/preferences")} />
    </div>
  );
}

