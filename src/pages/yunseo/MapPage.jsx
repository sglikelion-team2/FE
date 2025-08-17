import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestArrival from '../../components/feature/quest/QuestArrival';
import TopCafesSheet from '../../components/feature/map/TopCafesSheet';
import MarkerDetail from "./markerDetail";
import axios from "axios";

import FindRoute from './FindRoute';

import { placeData } from './pinPlace';
import { topCafes } from '../../mocks/cafe-data';

import img0 from '../../assets/c_0.png';
import img1 from '../../assets/c_1.png';
import img2 from '../../assets/c_2.png';

import marker from '../../assets/marker.png';
import "./markerDetail.css"

const APP_KEY =
  (typeof window !== "undefined" && (window.__TMAP_KEY__ || "")) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_TMAP_KEY) ||
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

  const handleArrivalClick = () => {
    setIsQuestModalOpen(true);
  };

  const handleQuestDecline = () => {
    navigate('/map');
  };

  const handleQuestAccept = () => {
    setIsQuestModalOpen(false);
    navigate('/quest');
  };

  const places = placeData.result.pin.map((place) =>({
    lat : place.lat,
    lng : place.lng,
    title: place.pinname,
    cong: place.congestion,
    rank : place.rank
  }));

  const [topCafesWithDistance, setTopCafesWithDistance] = useState([]);

  const ICON_URLS = {
    0: img0,
    1: img1,
    2: img2,
    3: "https://www.freeiconspng.com/uploads/star-icon-9.png"
  };

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);        // ✅ 모든 마커를 저장
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [findRouteInfo, setFindRouteInfo] = useState(null); 
  const [currentLocation, setCurrentLocation] = useState(null);
  const routePolyline = useRef(null);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error("현 위치를 가져오는 데 실패했습니다:", error);
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        reject(new Error("Geolocation API가 지원되지 않습니다."));
      }
    });
  };

  const getRouteInfo = async (destinationCoords) => {
    try {
      const startCoords = currentLocation || await getCurrentLocation();
      setCurrentLocation(startCoords);
      
      const { lat: endY, lng: endX } = destinationCoords;
      const { lat: startY, lng: startX } = startCoords;

      const url =
        "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json";
      const payload = {
        startX,
        startY,
        endX,
        endY,
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
        startName: "현 위치",
        endName: "도착지",
      };

      const res = await axios.post(url, payload, {
        headers: {
          appKey: (APP_KEY || "").trim(),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const totalDistance = res.data.features[0].properties.totalDistance; // meters
      const totalTime = res.data.features[0].properties.totalTime;         // seconds
      const routePoints = res.data.features
        .filter(f => f.geometry?.type === "LineString")
        .flatMap(f => f.geometry.coordinates);

      return {
        distance: (totalDistance / 1000).toFixed(1), // string "x.x"
        time: (totalTime / 60).toFixed(0),          // string "mm"
        routeData: routePoints,
        startCoords,
        endCoords: destinationCoords
      };

    } catch (err) {
      console.error("길찾기 정보 가져오기 실패:", err);
      alert("길찾기 정보를 가져오는 데 실패했습니다.");
      return null;
    }
  };

  const drawRoute = (routeData, startCoords, endCoords, totalDistance, totalTime, placeTitle) => {
    if (!mapInstance.current || !routeData || routeData.length === 0) return;

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
  };

  // ✅ 전체 초기화 + 재-Init 트리거
  const resetAll = useCallback(() => {
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

        // 사용자 위치 마커
        try {
          const userLocation = await getCurrentLocation();
          const pos = new window.Tmapv2.LatLng(userLocation.lat, userLocation.lng);
          const userMarkerIconUrl = `${marker}`;
          const userMarker = new window.Tmapv2.Marker({
            position: pos,
            icon: userMarkerIconUrl,
            iconSize: new window.Tmapv2.Size(16, 16),
            map: mapInstance.current,
          });
          markersRef.current.push(userMarker);
          bounds.extend(pos); 
          map.setCenter(pos);
          setCurrentLocation(userLocation);
        } catch (locationError) {
          console.warn("⚠️ 현재 위치를 가져오는 데 실패했습니다:", locationError);
        }

        // 카페 마커들
        for (const m of places) {
          const pos = new window.Tmapv2.LatLng(m.lat, m.lng);
          let markerIconUrl;
          if (m.cong === 0) markerIconUrl = ICON_URLS[0];
          else if (m.cong === 1) markerIconUrl = ICON_URLS[1];
          else if (m.cong === 2) markerIconUrl = ICON_URLS[2];
          else markerIconUrl = ICON_URLS[2];

          const placeMarker = new window.Tmapv2.Marker({
            position: pos,
            icon: markerIconUrl,
            iconSize: new window.Tmapv2.Size(24, 24),
            map
          });

          // Top5 표시용 별 아이콘
          if (m.rank >= 1 && m.rank <= 5) {
            const starIcon = new window.Tmapv2.Marker({
              position: pos,
              icon: ICON_URLS[3],
              iconSize: new window.Tmapv2.Size(24, 24),
              map,
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

        // Top5 카페 거리/시간
        const updatedTopCafes = await Promise.all(
          topCafes.result.pin.map(async (cafe) => {
            const routeInfo = await getRouteInfo({ lat: cafe.lat, lng: cafe.lng });
            return {
              ...cafe,
              distance: routeInfo ? routeInfo.distance : null,
              time: routeInfo ? routeInfo.time : null,
            };
          })
        );
        setTopCafesWithDistance(updatedTopCafes);
        
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { left: 20, top: 20, right: 20, bottom: 20 });
        }
      } catch (e) {
        console.error(e);
      }
    };

    init();

    return () => {
      if (routePolyline.current) routePolyline.current.setMap(null);
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      currentMapRef?.replaceChildren();
    };
  // ✅ reloadKey 변경 시 재-Init
  }, [reloadKey]);

  return (
    <div className="map-page-container">
      <div ref={mapRef} id="map_div" style={{ width: "100%", height: "100%" }} />
      {/* ✅ 조건부 렌더링: 하나의 컴포넌트만 보이도록 */}
      {!selectedMarker && !findRouteInfo && (
        <TopCafesSheet
          topCafesWithDistance={topCafesWithDistance}
          onFindRoute={drawRoute}
          getCurrentLocation={getCurrentLocation}
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

      {findRouteInfo && (
        <FindRoute 
          findRouteInfo={findRouteInfo} 
          onClose={() => {
            // ✅ 전체 리셋 (마커/폴리라인/상태 초기화 후 재-Init)
            resetAll();
            // (선택) 이미 /map이면 굳이 navigate 불필요
            // navigate('/map');
          }} 
        />
      )}

      {isQuestModalOpen && (
        <QuestArrival onYes={handleQuestAccept} onNo={handleQuestDecline} />
      )}
    </div>
  );
}
