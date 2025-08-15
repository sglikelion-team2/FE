// src/store/userPref.js

import { createContext, useContext, useEffect, useState } from "react";

// 로컬스토리지 키
const KEY = "zarit_user_pref";

// 기본 Context 만들기
const Ctx = createContext(null);

// UserPrefProvider: 앱 전체에서 유저 정보 관리
export function UserPrefProvider({ children }) {
  const [nickname, setNickname] = useState("");
  const [purpose, setPurpose] = useState("");
  const [mood, setMood] = useState("");
  const [need, setNeed] = useState({ wifi: false, outlet: false });

  // 앱 처음 실행 시 로컬스토리지에서 정보 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      const { nickname, purpose, mood, need } = JSON.parse(saved);
      setNickname(nickname);
      setPurpose(purpose);
      setMood(mood);
      setNeed(need);
    }
  }, []);

  // 유저 정보가 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    if (nickname) {
      const userPref = { nickname, purpose, mood, need };
      localStorage.setItem(KEY, JSON.stringify(userPref));
    }
  }, [nickname, purpose, mood, need]);

  const value = { nickname, setNickname, purpose, setPurpose, mood, setMood, need, setNeed };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Context에 접근하는 훅
export const useUserPref = () => useContext(Ctx);

