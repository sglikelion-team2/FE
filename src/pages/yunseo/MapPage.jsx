import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestArrival from '../../components/feature/quest/QuestArrival';
import TopCafesSheet from '../../components/feature/map/TopCafesSheet';
import MarkerDetail from "./markerDetail";
import axios from "axios";
import './MapPage.css';

import Arrived from './Arrived.jsx';  


import FindRoute from './findRoute.jsx';

// import { placeData } from './pinPlace';
 // import { topCafes } from '../../mocks/cafe-data'; // ← 보존만 하고 사용 안 함
 // (선택) 원본 응답을 보고 싶다면 보관용 state


import img0 from '../../assets/c_0.png';
import img1 from '../../assets/c_1.png';
import img2 from '../../assets/c_2.png';
import img3 from '../../assets/c_3.png';

import marker from '../../assets/marker.png';
import "./markerDetail.css"

const APP_KEY =
  (typeof window !== "undefined" && (window.__TMAP_KEY__ || "")) ||
  (typeof import.meta !== "undefined" && import.meta.env?.REACT_APP_TMAP_KEY) ||
  process.env.REACT_APP_TMAP_KEY ||
  "";

function waitForTmapReady(timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    (function check() {
      const ok =
        typeof window !== "undefined" &&
        window.Tmapv2 &&
        typeof window.Tmapv2.Map === "function" &&
        typeof window.Tmapv2.LatLng === "function";
      if (ok) return resolve();
      if (Date.now() - t0 > timeoutMs) return reject(new Error("Tmapv2 not ready within timeout"));
      setTimeout(check, 100);
    })();
  });
}

export default function MapPage() {
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0); // ✅ 초기화 후 재-Init 용 키
  const navigate = useNavigate();
  const [arrivedOpen, setArrivedOpen] = useState(false); // ⬅ 추가
  const [places, setPlaces] = useState([]); // ← 추가 (디버깅/재사용용)
  const [questTargetTitle, setQuestTargetTitle] = useState('');
   const [topCafesRaw, setTopCafesRaw] = useState([]);
   const bootUserLocationRef = useRef(null);
   const [storedNickname, setStoredNickname] = useState('');
   const [sotredPoint, setStoredPoint] = useState('0'); 

   const [isFindRouteOpen, setIsFindRouteOpen] = useState(true); // ⬅ 패널 표시 상태

  

  const handleArrivalClick = () => {
    setIsQuestModalOpen(true);
  };

  const handleQuestDecline = () => {
    resetAll();
    navigate('/map');
  };

  const handleQuestAccept = () => {
    setIsQuestModalOpen(false);
    navigate('/quest',{ state: { title: questTargetTitle } });
  };

    // 수정 후 ✅
// 1. Arrived 팝업의 '네!' 버튼을 누를 때 실행될 함수를 새로 만듭니다.
  const handleStartQuest = (title) => {
    setArrivedOpen(false);      // Arrived 팝업 닫기
    setQuestTargetTitle(title); // ✅ 전달받은 장소 이름을 state에 저장
    setIsQuestModalOpen(true);  // QuestArrival 팝업 열기
  };

  // const places = placeData.result.pin.map((place) =>({
  //   lat : place.lat,
  //   lng : place.lng,
  //   title: place.pinname,
  //   cong: place.congestion,
  //   rank : place.rank
  // }));

  const [topCafesWithDistance, setTopCafesWithDistance] = useState([]);

  const ICON_URLS = {
    0: img0,
    1: img1,
    2: img2,
    3: img3
  };

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);        // ✅ 모든 마커를 저장
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [findRouteInfo, setFindRouteInfo] = useState(null); 
  const [currentLocation, setCurrentLocation] = useState(null);
  const routePolyline = useRef(null);


  //////



  ////////네비게이션 구현
  const userMarkerRef = useRef(null);    // ✅ 유저 마커를 직접 이동시키기 위함


  // ✅ 내비게이션(스냅/축소 렌더)용 상태
  const routeLatLngsRef = useRef([]);    // [{lat,lng}, ...] (경로 원본)
  const routeCumDistRef = useRef([]);    // [누적(m), ...]
  const routeEndRef = useRef(null);      // {lat,lng}
  const pointsTmapRef = useRef([]);      // [Tmapv2.LatLng, ...]
  const watchIdRef = useRef(null);
  const lastIdxRef = useRef(0);          // 마지막 스냅 인덱스
  const navActiveRef = useRef(false);
  const arrivalAlertedRef = useRef(false);
  /////////

  // 🔎 디버깅 HUD용
  const [navDebug, setNavDebug] = useState({
    active: false,
    secure: typeof window !== 'undefined' ? window.isSecureContext : null,
    hasGeo: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    watchAlive: false,
    routePts: 0,
    lastIdx: 0,
    idx: 0,
    dToEnd: null,
    lat: null,
    lng: null,
    ts: null,
  });

const geoPromiseRef = useRef(null);

const getCurrentLocationOnce = () => {
  if (geoPromiseRef.current) return geoPromiseRef.current; // 진행 중/완료된 것 재사용
  geoPromiseRef.current = new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) return reject(new Error("Geolocation 미지원"));
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
  return geoPromiseRef.current;
};

const alertedRef = useRef(false);

const getRouteInfo = async (destinationCoords, { silent = false } = {}) => {
  try {
    const startCoords = currentLocation || await getCurrentLocationOnce();
    setCurrentLocation(startCoords);

    const { lat: endY, lng: endX } = destinationCoords;
    const { lat: startY, lng: startX } = startCoords;

    const url = "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json";
    const payload = {
      startX, startY, endX, endY,
      reqCoordType: "WGS84GEO", resCoordType: "WGS84GEO",
      startName: "현 위치", endName: "도착지",
    };

    const res = await axios.post(url, payload, {
      headers: {
        appKey: (APP_KEY || "").trim(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log(res);

    // const totalDistance = res.data.features[0].properties.totalDistance;
    // const totalTime = res.data.features[0].properties.totalTime;


    // ✅ SP(Point)에서 totalDistance/totalTime 가져오되, 방어적으로 처리
    const feats = res.data?.features ?? [];
    const sp = feats.find(f => f?.geometry?.type === 'Point' && f?.properties?.pointType === 'SP')
              || feats.find(f => f?.properties?.totalDistance != null);
    const totalDistance = sp?.properties?.totalDistance;
    const totalTime     = sp?.properties?.totalTime;


    ////

    const routePoints = res.data.features
      .filter(f => f.geometry?.type === "LineString")
      .flatMap(f => f.geometry.coordinates);

    return {
      distance: (totalDistance),
      time: (totalTime / 60).toFixed(0),
      routeData: routePoints,
      startCoords,
      endCoords: destinationCoords
    };
  } catch (err) {
    console.warn("길찾기 실패:", err?.response?.data || err?.message || err);
    if (!silent && !alertedRef.current) {
      alertedRef.current = true;
      alert("길찾기 경로를 찾을 수 없습니다. 잠시 후 다시 시도해 주세요.");
      setTimeout(() => { alertedRef.current = false; }, 3000); // 3초 뒤 알림 해제(중복 방지)
    }
    return null;
  }
};



  // ======================
  // 🔧 거리/스냅 유틸
  // ======================
  function haversine(a, b) {
    const R = 6371000;
    const toRad = d => d * Math.PI/180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const s = 2 * Math.asin(Math.sqrt(
      Math.sin(dLat/2)**2 +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng/2)**2
    ));
    return R * s;
  }

  function preprocessRoute(routeLngLatArray) {
    // routeLngLatArray: [[lng,lat], ...]
    const arr = routeLngLatArray.map(([lng,lat]) => ({lat, lng}));
    routeLatLngsRef.current = arr;
    // 누적 거리
    const cum = new Array(arr.length).fill(0);
    for (let i=1; i<arr.length; i++) {
      cum[i] = cum[i-1] + haversine(arr[i-1], arr[i]);
    }
    routeCumDistRef.current = cum;
    // Tmap LatLng 캐시
    pointsTmapRef.current = arr.map(p => new window.Tmapv2.LatLng(p.lat, p.lng));
    lastIdxRef.current = 0;
    console.log('[NAV] preprocessRoute: len=', arr.length, 'total(m)=', routeCumDistRef.current.at(-1));
    setNavDebug(d => ({ ...d, routePts: arr.length, lastIdx: 0, idx: 0 }));
  }

  function snapIndex(pos, lookAhead = 30) {
    // 간단: 최근 인덱스 근처에서 가장 가까운 버텍스에 스냅
    const pts = routeLatLngsRef.current;
    if (!pts.length) return 0;
    let best = lastIdxRef.current;
    let bestD = Infinity;
    const start = lastIdxRef.current;
    const end = Math.min(pts.length - 1, start + lookAhead);
    for (let i=start; i<=end; i++) {
      const d = haversine(pos, pts[i]);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function rebuildRemainingPolyline(fromIdx) {
    const sliced = pointsTmapRef.current.slice(Math.max(0, fromIdx));
    if (sliced.length < 2) return;
    // setPath 지원 여부가 불확실하므로 안전하게 재생성
    if (routePolyline.current) {
      routePolyline.current.setMap(null);
      routePolyline.current = null;
    }
    routePolyline.current = new window.Tmapv2.Polyline({
      path: sliced,
      strokeColor: "#3478F6",
      strokeWeight: 6,
      map: mapInstance.current,
    });
  }

  function stopNavigation() {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    navActiveRef.current = false;
  }

  function startNavigation() {
    if (navActiveRef.current || !routeLatLngsRef.current.length) return;
    navActiveRef.current = true;
    arrivalAlertedRef.current = false;
    console.log('[NAV] startNavigation, secure=', window.isSecureContext, 'geo=', 'geolocation' in navigator);

    watchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const raw = { lat: coords.latitude, lng: coords.longitude };

         // 디버깅용 현재 좌표/시간 업데이트
        setNavDebug(d => ({ ...d, watchAlive: true, lat: raw.lat, lng: raw.lng, ts: Date.now() }));
        // 최초 한번 콘솔에 권한/정확도 출력
        if (!navDebug.active) {
          console.log('[NAV] pos', raw, 'acc=', coords.accuracy, 'speed=', coords.speed, 'heading=', coords.heading);
        }


        // 최근 인덱스 근처 스냅
        const idx = snapIndex(raw, 40);
        if (idx > lastIdxRef.current) {
          lastIdxRef.current = idx;
          console.log('[NAV] snap idx advanced →', idx);


          // 폴리라인을 앞에서부터 줄이기
          rebuildRemainingPolyline(idx);
          // 남은 거리/시간 갱신
          const total = routeCumDistRef.current.at(-1) || 0;
          const traveled = routeCumDistRef.current[idx] || 0;
          const remaining = Math.max(0, total - traveled); // m
          setFindRouteInfo(prev => {
            if (!prev) return prev;
            const estMin = prev.time ? Math.max(1, Math.round(prev.time * (remaining / total))) : null;
            return {
              ...prev,
              distance: (remaining / 1000).toFixed(1), // km
              time: estMin
            };
          });
          setNavDebug(d => ({ ...d, lastIdx: idx, idx }));

        }else {
          // 인덱스가 안 올라갈 때도 로그 한 번씩
          // (경로점 간격이 넓거나, 경로에서 멀어졌거나, GPS가 정지상태일 수 있음)
          console.debug('[NAV] idx not advanced. current=', idx, 'last=', lastIdxRef.current);
         }


        // 유저 마커(스냅 위치) 이동
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(new window.Tmapv2.LatLng(
            routeLatLngsRef.current[lastIdxRef.current].lat,
            routeLatLngsRef.current[lastIdxRef.current].lng
          ));
        }        // 도착 판정(15m, 1회 알림)
        const dest = routeEndRef.current;
        if (dest && !arrivalAlertedRef.current) {
          const dToEnd = haversine(routeLatLngsRef.current[lastIdxRef.current], dest);
          setNavDebug(d => ({ ...d, dToEnd: Math.round(dToEnd) }));
          if (dToEnd <= 100) {
            arrivalAlertedRef.current = true;
            // alert("도착했습니다.");
            setArrivedOpen(true); // ⬅ 팝업 열기
            console.log('[NAV] ARRIVED <= 100m');
          }
        }
      },
      (err) => {
        console.warn('watchPosition error:', err);
        setNavDebug(d => ({ ...d, watchAlive: false }));
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );
  }


  const drawRoute = (routeData, startCoords, endCoords, totalDistance, totalTime, placeTitle) => {
    if (!mapInstance.current || !routeData || routeData.length === 0) return;
    console.log('[NAV] drawRoute called. route pts=', routeData.length);


    // 기존 폴리라인 제거
    if (routePolyline.current) {
      routePolyline.current.setMap(null);
      routePolyline.current = null;
    }
    
    const points = routeData.map(([lng, lat]) => new window.Tmapv2.LatLng(lat, lng));
    routePolyline.current = new window.Tmapv2.Polyline({
      path: points,
      strokeColor: "#3478F6",
      strokeWeight: 6,
      map: mapInstance.current,
    });

    // 뷰포트 맞춤
    const bounds = new window.Tmapv2.LatLngBounds();
    bounds.extend(new window.Tmapv2.LatLng(startCoords.lat, startCoords.lng));
    bounds.extend(new window.Tmapv2.LatLng(endCoords.lat, endCoords.lng));
    points.forEach(p => bounds.extend(p));
    mapInstance.current.fitBounds(bounds, { left: 20, top: 20, right: 20, bottom: 20 });

    // 정보 패널 세팅
    const distNum = Number(totalDistance);
    const timeNum = Number(totalTime);

    setSelectedMarker(null);
    setFindRouteInfo({
      distance: Number.isFinite(distNum) ? distNum.toFixed(1) : null, // km
      time: Number.isFinite(timeNum) ? Math.round(timeNum) : null,     // 분
      title: placeTitle ?? selectedMarker?.title ?? null    
    });

    setIsFindRouteOpen(true); // ⬅ 경로 그릴 때 패널 열기

    // ✅ 내비게이션 준비 및 시작 (스냅/축소 렌더)
    preprocessRoute(routeData);     // [[lng,lat], ...] → refs 세팅
    routeEndRef.current = endCoords;
    startNavigation();
  };

  // ✅ 전체 초기화 + 재-Init 트리거
  const resetAll = useCallback(() => {
        // 내비게이션 중지
    stopNavigation();
    arrivalAlertedRef.current = false;
    routeLatLngsRef.current = [];
    routeCumDistRef.current = [];
    routeEndRef.current = null;
    pointsTmapRef.current = [];
    lastIdxRef.current = 0;










    // 폴리라인 제거
    if (routePolyline.current) {
      routePolyline.current.setMap(null);
      routePolyline.current = null;
    }
    // 마커 제거
    if (markersRef.current.length) {
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
    }
    // 상태 초기화
    setIsQuestModalOpen(false);
    setSelectedMarker(null);
    setFindRouteInfo(null);
    setTopCafesWithDistance([]);
    setCurrentLocation(null);
    setArrivedOpen(false); // ⬅ 추가

    // 맵 뷰 초기값(선택)
    if (mapInstance.current && window.Tmapv2) {
      mapInstance.current.setCenter(new window.Tmapv2.LatLng(37.5665, 126.9780));
      mapInstance.current.setZoom(14);
    }

    // 재-Init
    setReloadKey(k => k + 1);
  }, []);

  useEffect(() => {
    markersRef.current = []; // 매 Init마다 비우기
    const currentMapRef = mapRef.current;
    
    const init = async () => {
      try {
        await waitForTmapReady();
        const el = currentMapRef;
        if (!el || el.firstChild) return;

        // 맵 초기화
        const map = new window.Tmapv2.Map("map_div", {
          center: new window.Tmapv2.LatLng(37.5665, 126.9780),
          width: "100%",
          height: "884px",
          zoom: 14,
          zoomControl: true,
          scrollwheel: true,
        });
        mapInstance.current = map;
        const bounds = new window.Tmapv2.LatLngBounds();
         let pinsForMarkers = [];

        // 사용자 위치 마커
        try {
          const userLocation = await getCurrentLocationOnce();
          const pos = new window.Tmapv2.LatLng(userLocation.lat, userLocation.lng);

          bootUserLocationRef.current = userLocation;


          const userMarkerIconUrl = `${marker}`;
          const userMarker = new window.Tmapv2.Marker({
            position: pos,
            icon: userMarkerIconUrl,
            iconSize: new window.Tmapv2.Size(30, 30),
            map: mapInstance.current,
          });

          userMarkerRef.current = userMarker; // ✅ 저장해서 이후 이동에 사용
          console.log('[INIT] user marker placed at', userLocation);

          markersRef.current.push(userMarker);
          bounds.extend(pos); 
          map.setCenter(pos);
          setCurrentLocation(userLocation);




             // === NEW: placeData를 API로 가져오기 ===
         // localStorage에서 이름
          const storedNickname = localStorage.getItem('current_user') || '방문자';
          setStoredNickname(storedNickname); // state에 저장 (나중에 사용)
          // 환경변수 기반 API 베이스 (필요 시 조정)
         const API_BASE = "/api"; 

          if (!API_BASE) {
            console.warn('API base URL이 비어 있습니다. (.env의 VITE_PROJECT_API 확인)');
          }
          const url =
            `${API_BASE}/mainpage/${encodeURIComponent(storedNickname)}` +
            `?lat=${userLocation.lat}&lng=${userLocation.lng}`;

          // GET이지만 서버 요구대로 JSON body 포함
          // (주의: 크로스 오리진이면 프리플라이트 발생 가능)
         let apiPins = [];
          try {
            const ctrl = new AbortController();
            const res = await fetch(url, {
              method: 'GET',
              signal: ctrl.signal,
              headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
              },
            
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            // 응답 스키마에 맞춰 매핑 (기존 구조 유지 시도)
           // 기대: data.result.pin = [{ lat, lng, pinname, congestion, rank }, ...]
            const rawPins =
              (data?.result?.pin) ??
              (data?.result) ??
              (data?.pins) ??
              data;

          setStoredPoint(data?.result?.point ?? '0'); // ⬅ 포인트 저장 (나중에 사용)
            apiPins = Array.isArray(rawPins)
              ? rawPins.map(p => ({
                  lat: p.lat,
                  lng: p.lng,
                  title: p.pinname ?? p.title ?? p.name,
                  cong: p.congestion ?? p.cong ?? 0,
                  rank: p.rank ?? p.rankNo ?? 999,
                })).filter(v => Number.isFinite(v.lat) && Number.isFinite(v.lng))
              : [];
            setPlaces(apiPins); // state에도 보관
          } catch (e) {
            console.warn('place API 요청 실패:', e);
            // 필요하면 더미 데이터로 폴백하려면 아래 주석 해제
            // apiPins = (placeData?.result?.pin ?? []).map(place => ({
            //   lat: place.lat,
            //   lng: place.lng,
            //   title: place.pinname,
            //   cong: place.congestion,
           //   rank: place.rank,
            // }));
            // setPlaces(apiPins);
          }

          // === 이후 마커 생성은 apiPins 기준으로 ===
          
          pinsForMarkers = apiPins// api 성공 시 생성, 실패 시 빈 배열

          // 카페 마커들



        } catch (locationError) {
          console.warn("⚠️ 현재 위치를 가져오는 데 실패했습니다:", locationError);
        }

        // 카페 마커들
        for  (const m of pinsForMarkers) {


          const pos = new window.Tmapv2.LatLng(m.lat, m.lng);
          let markerIconUrl;
          if (m.cong === 0) markerIconUrl = ICON_URLS[0];
          else if (m.cong === 1) markerIconUrl = ICON_URLS[1];
          else if (m.cong === 2) markerIconUrl = ICON_URLS[2];
          else markerIconUrl = ICON_URLS[2];

          const placeMarker = new window.Tmapv2.Marker({
            position: pos,
            icon: markerIconUrl,
            iconSize: new window.Tmapv2.Size(22, 30),
            map
          });

          // Top5 표시용 별 아이콘
          if (m.rank >= 1 && m.rank <= 5) {
            const BIG_SIZE = new window.Tmapv2.Size(28, 38);
            const starIcon = new window.Tmapv2.Marker({
              position: pos,
              icon: ICON_URLS[3],
              iconSize: BIG_SIZE,
              map
            });
            starIcon.markerData = { ...m, coords: { lat: m.lat, lng: m.lng } };
            starIcon.addListener("click", async () => {
              const routeInfo = await getRouteInfo(starIcon.markerData.coords);
              if (routeInfo) {
                setSelectedMarker({ ...starIcon.markerData, ...routeInfo });
              }
            });
            markersRef.current.push(starIcon);
          }

          placeMarker.markerData = { ...m, coords: { lat: m.lat, lng: m.lng } };
          placeMarker.addListener("click", async () => {
            const routeInfo = await getRouteInfo(placeMarker.markerData.coords);
            if (routeInfo) {
              setSelectedMarker({ ...placeMarker.markerData, ...routeInfo });
            }
          });

          bounds.extend(pos); 
          markersRef.current.push(placeMarker);
        }

        // 사용자 위치 마커 이후…

 // === NEW: TopCafes를 API로 가져와 후처리는 동일하게 ===
 try {
   const storedNickname = localStorage.getItem('current_user') || '방문자';
  //  //const API_BASE =
  //          process.env.REACT_APP_PROJECT_API ??
  //           import.meta.env.PROJECT_API ??
  //           window.PROJECT_API ??
  //           "";
  //  if (!API_BASE) {
  //    console.warn('API base URL이 비어 있습니다. (.env의 VITE_PROJECT_API 확인)');
     
  //  }

      const loc = bootUserLocationRef.current;
   if (!loc) {
     console.warn('초기 위치가 없습니다. TopCafes 요청을 건너뜁니다.');
   } else {
   const topUrl =
  `/api/mainpage/${encodeURIComponent(storedNickname)}/top5` + 
  `?lat=${loc.lat}&lng=${loc.lng}`;
   const ctrlTop = new AbortController();
   const topRes = await fetch(topUrl, {
     method: 'GET',
     signal: ctrlTop.signal,
     headers: {

     },
     // 서버 요구가 "GET + JSON 바디"라면 아래 유지, 아니면 제거
    
    
   });
   if (!topRes.ok) throw new Error(`HTTP ${topRes.status}`);
   const topData = await topRes.json();

   console.log('TopCafes API 응답:', topData);

   // 응답 스키마 적응: 배열 꺼내기
   // 기대 구조: data.result.pin = [{lat,lng,pinname,congestion,rank}, ...]
   const rawTop =
     (topData?.result?.pin) ??
     (topData?.result?.top) ??
     (topData?.pins) ??
     (topData?.top) ??
     [];
   // (선택) 원본 보관
   setTopCafesRaw(Array.isArray(rawTop) ? rawTop : []);

   // 이후 후처리 동일: 각 카페에 routeInfo 붙이기
   const updatedTopCafes = await Promise.all(
     (Array.isArray(rawTop) ? rawTop : []).map(async (cafe) => {
       const lat = Number(cafe.lat);
       const lng = Number(cafe.lng);
       if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
         return { ...cafe, distance: null, time: null };
       }
       const routeInfo = await getRouteInfo({ lat, lng }, { silent: true });
       return {
         ...cafe,
         // 기존 키 호환: title(pinname), cong(congestion)
         title: cafe.pinname ?? cafe.title ?? cafe.name,
         cong: cafe.congestion ?? cafe.cong ?? 0,
         rank: cafe.rank ?? cafe.rankNo ?? 999,
         distance: routeInfo ? routeInfo.distance : null,
         time: routeInfo ? routeInfo.time : null,
       };
     })
   );
   setTopCafesWithDistance(updatedTopCafes);
 }
 } catch (e) {
   console.warn('TopCafes API 요청 실패:', e);
   // 폴백이 필요하면 mock 사용 (import는 위에서 주석만 했으니, 임시로 풀어서 사용 가능)
   // const updatedTopCafes = await Promise.all(
   //   (topCafes?.result?.pin ?? []).map(async (cafe) => {
   //     const routeInfo = await getRouteInfo({ lat: cafe.lat, lng: cafe.lng }, { silent: true });
   //     return { ...cafe, distance: routeInfo?.distance ?? null, time: routeInfo?.time ?? null };
   //   })
   // );
   // setTopCafesWithDistance(updatedTopCafes);
 }



        
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { left: 500, top: 500, right: 500, bottom: 500 });
        }
      } catch (e) {
        console.error(e);
      }
    };

    init();

    return () => {
      stopNavigation();
      if (routePolyline.current) routePolyline.current.setMap(null);
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      currentMapRef?.replaceChildren();
    };
  // ✅ reloadKey 변경 시 재-Init
  }, [reloadKey]);



    // 🔎 간단 HUD: 화면에서 상태 확인
  const hudStyle = {
    position: 'absolute', right: 8, top: 8, zIndex: 99999,
    background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '8px 10px',
    borderRadius: 8, fontSize: 12, lineHeight: 1.35, maxWidth: 260
  };
  return (
    <div className="map-page-container">
      <div ref={mapRef} id="map_div" style={{ width: "100%", height: "100%" }} />
      {/* <div style={hudStyle}>
       <div><b>NAV DEBUG</b></div>
        <div>secure: {String(navDebug.secure)} / geo: {String(navDebug.hasGeo)}</div>
        <div>watchAlive: {String(navDebug.watchAlive)}</div>
       <div>route pts: {navDebug.routePts}</div>
       <div>idx: {navDebug.idx} / last: {navDebug.lastIdx}</div>
        <div>dToEnd: {navDebug.dToEnd ?? '-' } m</div>
        <div>pos: {navDebug.lat?.toFixed?.(5)}, {navDebug.lng?.toFixed?.(5)}</div>
        <div>ts: {navDebug.ts ? new Date(navDebug.ts).toLocaleTimeString() : '-'}</div>
      </div> */}


      <div className="point-container">
      <span className='nickname'>{storedNickname}<span>님</span></span>
      <span className="point">✏️ {sotredPoint}</span>
      
      </div>

      {arrivedOpen && (
    //   <Arrived
    //     title={findRouteInfo?.title || '도착지'}
    //     onClose={() => setArrivedOpen(false)}
    //         onStartQuest={() => {
    //  // 필요하면 Arrived를 닫고(선택), 최상위 모달을 켭니다.
    //    setArrivedOpen(false);
    //   setIsQuestModalOpen(true);}}
    //   />
    <Arrived
  title={findRouteInfo?.title || selectedMarker?.title || '도착지'}
  onClose={() => setArrivedOpen(false)}
  // ✅ onStartQuest가 handleStartQuest를 호출하고, 현재 장소 title을 전달하도록 수정
  onStartQuest={() => handleStartQuest(findRouteInfo?.title || selectedMarker?.title || '도착지')}
/>
    )}




      {/* ✅ 조건부 렌더링: 하나의 컴포넌트만 보이도록 */}
      {!selectedMarker && !findRouteInfo && !isQuestModalOpen&&(
        <TopCafesSheet
          topCafesWithDistance={topCafesWithDistance}
          onFindRoute={drawRoute}
          getCurrentLocation={getCurrentLocationOnce}
          getRouteInfo={getRouteInfo}
          setSelectedMarker={setSelectedMarker}
        />
      )}

      {selectedMarker && (
        <MarkerDetail
          markerInfo={selectedMarker}
          onClose={() => setSelectedMarker(null)}
          onFindRoute={() =>
            drawRoute(
              selectedMarker.routeData,
              selectedMarker.startCoords,
              selectedMarker.endCoords,
              parseFloat(selectedMarker.distance), // ✅ 숫자로 변환
              parseFloat(selectedMarker.time),
              selectedMarker.title     // ✅ 목적지 이름 전달
            )
          }
        />
      )}

      {findRouteInfo && isFindRouteOpen && !isQuestModalOpen&&(
        <FindRoute 
          findRouteInfo={findRouteInfo} 
          onMinimize={() => setIsFindRouteOpen(false)} // ⬅ routIcon-box용: 패널만 숨김
          onClose={() => {
            // ✅ 전체 리셋 (마커/폴리라인/상태 초기화 후 재-Init)
            resetAll();
            // (선택) 이미 /map이면 굳이 navigate 불필요
            // navigate('/map');
          }} 
        />
      )}

      {isQuestModalOpen && (
        <QuestArrival 
        title={questTargetTitle}
    onYes={handleQuestAccept}
    onNo={handleQuestDecline}
  />
      )}
    </div>
  );
}
