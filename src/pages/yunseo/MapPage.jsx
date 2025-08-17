// mapPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestArrival from '../../components/feature/quest/QuestArrival';
import TopCafesSheet from '../../components/feature/map/TopCafesSheet';
import MarkerDetail from "./markerDetail";
import axios from "axios";


import { placeData } from './pinPlace';
import { topCafes } from '../../mocks/cafe-data'; //

import img0 from '../../assets/c_0.png';
import img1 from '../../assets/c_1.png';
import img2 from '../../assets/c_2.png';
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

//////top5 전용
    const [topCafesWithDistance, setTopCafesWithDistance] = useState([]);

  const ICON_URLS = {
    0: img0,
    1: img1,
    2: img2,
    3: "https://www.freeiconspng.com/uploads/star-icon-9.png"
  };

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
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

  // ✅ 길찾기 정보만 가져오는 함수 (경로를 그리지 않음)
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

      const totalDistance = res.data.features[0].properties.totalDistance;
      const totalTime = res.data.features[0].properties.totalTime;
      const routePoints = res.data.features.filter(f => f.geometry?.type === "LineString").flatMap(f => f.geometry.coordinates);

      return {
        distance: (totalDistance / 1000).toFixed(1),
        time: (totalTime / 60).toFixed(0),
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

  // ✅ 실제로 경로를 그리는 함수
  const drawRoute = (routeData, startCoords, endCoords) => {
    if (!mapInstance.current || !routeData || routeData.length === 0) return;

    // 기존 경로선 및 마커 제거
    if (routePolyline.current) {
      routePolyline.current.setMap(null);
      routePolyline.current = null;
    }
    
    // 경로 그리기
    const points = routeData.map(([lng, lat]) => new window.Tmapv2.LatLng(lat, lng));
    routePolyline.current = new window.Tmapv2.Polyline({
      path: points,
      strokeColor: "#3478F6",
      strokeWeight: 6,
      map: mapInstance.current,
    });

    const bounds = new window.Tmapv2.LatLngBounds();
    bounds.extend(new window.Tmapv2.LatLng(startCoords.lat, startCoords.lng));
    bounds.extend(new window.Tmapv2.LatLng(endCoords.lat, endCoords.lng));
    points.forEach(p => bounds.extend(p));
    
    mapInstance.current.fitBounds(bounds, { left: 20, top: 20, right: 20, bottom: 20 });
    setSelectedMarker(null); // 패널 닫기
  };

  useEffect(() => {
    const markers = [];
    const currentMapRef = mapRef.current;

    const init = async () => {
      try {
        await waitForTmapReady();
        const el = currentMapRef;
        if (!el || el.firstChild) return;

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


        /////top5관련 로직

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




        //////

        
        places.forEach((m, index) => {
          const pos = new window.Tmapv2.LatLng(m.lat, m.lng);
          let markerIconUrl;
          if (m.cong === 0) { markerIconUrl = ICON_URLS[0]; } 
          else if (m.cong === 1) { markerIconUrl = ICON_URLS[1]; } 
          else if (m.cong === 2) { markerIconUrl = ICON_URLS[2]; } 
          else { markerIconUrl = "https://topopen.tmap.co.kr/imgs/marker/pin_b_m_s.png"; }

          const marker = new window.Tmapv2.Marker({ 
            position: pos, 
            icon: markerIconUrl,
            iconSize: new window.Tmapv2.Size(24, 24),
            map 
          });

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
            markers.push(starIcon);
          }
          
          marker.markerData = { ...m, coords: { lat: m.lat, lng: m.lng } };
          marker.addListener("click", async () => {
            const routeInfo = await getRouteInfo(marker.markerData.coords);
            if (routeInfo) {
              setSelectedMarker({ ...marker.markerData, ...routeInfo });
            }
          });
          bounds.extend(pos);
          markers.push(marker);
        });
        
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
      markers.forEach(m => m.setMap(null));
      currentMapRef?.replaceChildren();
    };
  }, []);

  return (
    <div className="map-page-container">
      <div ref={mapRef} id="map_div" style={{ width: "100%", height: "100%" }} />
      {selectedMarker && (
        <MarkerDetail
          markerInfo={selectedMarker}
          onClose={() => setSelectedMarker(null)}
          onFindRoute={() => drawRoute(selectedMarker.routeData, selectedMarker.startCoords, selectedMarker.endCoords)}
        />
      )}
      <button onClick={handleArrivalClick} style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px', zIndex: '10' }}>
        (임시) 매장에 도착했어요?
      </button>
            <TopCafesSheet
        topCafesWithDistance={topCafesWithDistance}
        onFindRoute={drawRoute} // 👈 drawRoute 함수를 prop으로 전달
        getCurrentLocation={getCurrentLocation} // 👈 필요시 현재 위치 함수도 전달
        getRouteInfo={getRouteInfo} // 👈 필요시 길찾기 정보 함수도 전달
        setSelectedMarker={setSelectedMarker} // 👈 필요시 마커 선택 상태도 전달
      />
      {isQuestModalOpen && (
        <QuestArrival onYes={handleQuestAccept} onNo={handleQuestDecline} />
      )}
    </div>
  );
}