
# Definition of Done

## 소린
##  Onboarding (1~3)
- [ ] 닉네임 1~10자 유효성
- [ ] 목적/분위기/시설 상태 저장(store/userPref)
- [ ] 완료 시 1초 로딩 후 `/map` 이동

##  Quest (10-1/2/3/4 랜덤 1개)
- [ ] `?seed` 없으면 랜덤, 있으면 고정
- [ ] 각 스텝 유효성(선택/입력/업로드)
- [ ] `submitQuest` 호출 → 성공 시 `/quest/complete`

##  Quest Complete (11)
- [ ] 보상 수치 노출(목업 10)
- [ ] “공부 계속하기(/map)” 버튼 동작

## 윤서
##  Map (4)
- [ ] Snazzy 스타일 적용 / 마커 색상
- [ ] Top5 연필 표시 / 바텀시트 분리
- [ ] 핀 클릭 → `/cafe/:id`

##  Cafe Detail (4-1)
- [ ] 감성 문구/혼잡/소음/좌석/Wi‑Fi
- [ ] “길찾기” `/directions/:id`
- [ ] “퀘스트 시작” `/quest/:id`

##  Directions (7)
- [ ] 현재 위치~매장 예상거리/시간 표시(텍스트여도 OK)

##  근접 팝업 (8)
- [ ] 거리 ≤ 50m → `ArrivalConfirm` 띄움
- [ ] “예” → `/quest/:id`, “아니오” → 닫기
