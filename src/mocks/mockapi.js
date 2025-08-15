// 가짜 닉네임 로그인 API
export const loginUser = async (nickname) => {
  console.log(" MOCK API CALLED: loginUser", { nickname });

  // API 명세서와 똑같은 성공 응답을 만들어서 반환
  const response = {
    isSuccess: true,
    code: 201, // 새 계정 생성이라고 가정
    message: "가짜 API: 계정 생성 성공",
    result: {
      name: nickname,
    },
  };

  return Promise.resolve(response); // 성공적인 Promise 반환
};

export const savePreferences = async (prefData) => {
  
  //  실패 조건: '방문 목적(purpose)' 값이 비어있는지(null 또는 undefined) 확인
  if (prefData.purpose == null) {
    console.log(" MOCK API CALLED: savePreferences -> FAILURE 🛑");
    
    // 실패 응답 객체 반환
    return Promise.resolve({
      isSuccess: false,
      code: 400,
      message: "가짜 API: [방문 목적]은 필수 선택 항목입니다.",
    });
  }

  // 성공 조건: 실패 조건에 해당하지 않으면 성공 응답을 보냄
  console.log(" MOCK API CALLED: savePreferences -> SUCCESS ✅", { prefData });
  return Promise.resolve({
    isSuccess: true,
    code: 200,
    message: "가짜 API: 선호도 저장 완료!",
    result: {
      name: prefData.name,
      purpose: prefData.purpose,
      atmos: prefData.atmos,
      facility: prefData.facility,
    },
  });
};