# ZARIT FE Contracts

## 라우트
- `/`                : 온보딩(1~3)
- `/map`             : 지도(4)
- `/cafe/:id`        : 핀 클릭 상세(4-1)
- `/directions/:id`  : 길찾기(7)
- `/quest/:id`       : 퀘스트(10-*)
- `/quest/complete`  : 퀘스트 완료(11)

## 상수
- APPROACH_RADIUS_M = 50    # 도착 팝업 띄우는 거리
- TOP5_RADIUS_M = 400       # Top5 반경

## 데이터 스키마 (목업 기준)
```ts
type Cafe = {
  id: string;
  name: string;
  lat: number; lng: number;
  congestion: "low"|"mid"|"high";   // 마커 색
  noiseLv?: 1|2|3|4|5;              // 상세/퀘스트 참고
  seats?: { solo:number; duo:number; quad:number };
  wifi?: "great"|"good"|"fair"|"poor";
  distanceM?: number;               // 계산 값
};
type UserPref = {
  nickname: string;
  purpose: "study"|"report"|"team";
  mood: "quiet"|"medium"|"vivid";
  need: { wifi:boolean; outlet:boolean };
};
type QuestPayload =
  | { type:"noise"; level:1|2|3|4|5 }
  | { type:"wifi"; level:"great"|"good"|"fair"|"poor" }
  | { type:"seats"; count:number; positions?: string }
  | { type:"photo"; fileName:string }; // 업로드 전까지는 fileName만
