
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestArrival from '../../components/feature/quest/QuestArrival';
import TopCafesSheet from '../../components/feature/map/TopCafesSheet'; // 
import MarkerDetail from "./markerDetail";
import axios from "axios";


// (APP_KEY 및 waitForTmapReady 함수는 기존 코드와 동일)
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

  // '도착했어요' 버튼을 눌렀을 때 실행될 함수
  const handleArrivalClick = () => {
    setIsQuestModalOpen(true); // 퀘스트 팝업을 띄우는 상태로 변경
  };

  // 퀘스트 팝업에서 'No'를 눌렀을 때
  const handleQuestDecline = () => {
    navigate('/map');
  };

  // 퀘스트 팝업에서 'Yes'를 눌렀을 때
  const handleQuestAccept = () => {
    setIsQuestModalOpen(false);
    navigate('/quest');
  };



  ///////지도 부분

  const mapRef = useRef(null);
  const mapInstance = useRef(null); // 지도 인스턴스를 저장
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const routePolyline = useRef(null); // 경로선 객체를 저장







    // 현 위치를 가져오는 함수
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



   // 길찾기 함수
  const findRoute = async (destinationCoords) => {
    try {
      const startCoords = currentLocation || await getCurrentLocation();
      setCurrentLocation(startCoords); // 현 위치 상태 업데이트
      
      const { lat: endY, lng: endX } = destinationCoords;
      const { lat: startY, lng: startX } = startCoords;

      if (!mapInstance.current) {
        throw new Error("지도 인스턴스가 준비되지 않았습니다.");
      }

      // 기존 경로선이 있으면 제거
      if (routePolyline.current) {
        routePolyline.current.setMap(null);
        routePolyline.current = null;
      }
      
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

      const features = res.data?.features ?? [];
      const points = [];
      const bounds = new window.Tmapv2.LatLngBounds();
      
      // 출발지/도착지 마커 추가
      const startPos = new window.Tmapv2.LatLng(startY, startX);
      const endPos = new window.Tmapv2.LatLng(endY, endX);
      new window.Tmapv2.Marker({ position: startPos, map: mapInstance.current });
      new window.Tmapv2.Marker({ position: endPos, map: mapInstance.current });

      bounds.extend(startPos);
      bounds.extend(endPos);

      for (const f of features) {
        const g = f.geometry;
        if (g?.type === "LineString") {
          for (const [lng, lat] of g.coordinates) {
            const ll = new window.Tmapv2.LatLng(lat, lng);
            points.push(ll);
            bounds.extend(ll);
          }
        }
      }


      if (points.length >= 2) {
        routePolyline.current = new window.Tmapv2.Polyline({
          path: points,
          strokeColor: "#3478F6",
          strokeWeight: 6,
          map: mapInstance.current,
        });
      }
      
      // 경로가 지도에 모두 보이도록 뷰포트 조정
      if (!bounds.isEmpty()) {
        mapInstance.current.fitBounds(bounds, { left: 20, top: 20, right: 20, bottom: 20 });
      }

    } catch (err) {
      console.error("길찾기 실패:", err);
      alert("길찾기 경로를 가져오는 데 실패했습니다.");
    } finally {
      // 패널 닫기
      setSelectedMarker(null);
    }
  };

   useEffect(() => {
    const markers = [];

    const init = async () => {
      try {
        await waitForTmapReady();
        const el = mapRef.current;
        if (!el || el.firstChild) return;

        const departure = { lat: 37.5665, lng: 126.9780 };
        const arrival   = { lat: 37.5700, lng: 126.9860 };

        const map = new window.Tmapv2.Map("map_div", {
          center: new window.Tmapv2.LatLng(departure.lat, departure.lng),
          width: "100%",
          height: "884px",
          zoom: 14,
          zoomControl: true,
          scrollwheel: true,
        });
        mapInstance.current = map; // 지도 인스턴스 저장

        const bounds = new window.Tmapv2.LatLngBounds();
        const departPos = new window.Tmapv2.LatLng(departure.lat, departure.lng);
        const arrivePos = new window.Tmapv2.LatLng(arrival.lat, arrival.lng);
        
        const departMarker = new window.Tmapv2.Marker({ position: departPos, map });
        departMarker.markerData = { 
          id: 'departure', 
          title: '출발지', 
          desc: '여기가 출발하는 곳입니다.', 
          coords: departure 
        };
        departMarker.addListener("click", () => setSelectedMarker(departMarker.markerData));
        markers.push(departMarker);
        
        const arriveMarker = new window.Tmapv2.Marker({
          position: arrivePos,
          icon: "https://topopen.tmap.co.kr/imgs/marker/pin_r_m_e.png",
          iconSize: new window.Tmapv2.Size(24, 38),
          map,
        });
        arriveMarker.markerData = { 
          id: 'arrival', 
          title: '도착지', 
          desc: '목적지에 도착했습니다.', 
          coords: arrival 
        };
        arriveMarker.addListener("click", () => setSelectedMarker(arriveMarker.markerData));
        markers.push(arriveMarker);

        bounds.extend(departPos);
        bounds.extend(arrivePos);

        [
          { lat: 37.5652045, lng: 126.98602028, title: '샘플1', desc: '샘플 마커 1입니다.' },
          { lat: 37.5652045, lng: 126.98702028, title: '샘플2', desc: '샘플 마커 2입니다.' },
          { lat: 37.5652045, lng: 126.98802028, title: '샘플3', desc: '샘플 마커 3입니다.' },
        ].forEach((m, index) => {
          const pos = new window.Tmapv2.LatLng(m.lat, m.lng);
          const marker = new window.Tmapv2.Marker({ position: pos, map });
          marker.markerData = { id: `sample-${index}`, title: m.title, desc: m.desc, coords: m };
          marker.addListener("click", () => setSelectedMarker(marker.markerData));
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

    // 언마운트 시 정리 로직
    return () => {
      try {
        if (routePolyline.current) routePolyline.current.setMap(null);
        markers.forEach(m => m.setMap(null));
        mapRef.current?.replaceChildren();
      } catch {}
    };
  }, []);







  


  return (
    <div className="map-page-container" >
 

      <div ref={mapRef} id="map_div" style={{ width: "100%", height: "100%" }} />
      {selectedMarker && (
        <MarkerDetail
          markerInfo={selectedMarker}
          onClose={() => setSelectedMarker(null)}
          onFindRoute={findRoute} // 길찾기 함수를 props로 전달
        />
      )}
   
      
      {/* '도착했어요?' 버튼 (실제로는 지도 위 특정 위치에 있을 수 있음) */}
      <button 
        onClick={handleArrivalClick}
        style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px', zIndex: '10' }}
      >
        (임시) 매장에 도착했어요?
      </button>
      {/* ------------------------------------------- */}

      
      <TopCafesSheet />


      {/* ✅ isQuestModalOpen 상태가 true일 때만 퀘스트 도착 팝업을 렌더링합니다. */}
      {/* 이 팝업은 TopCafesSheet보다 위에 나타나야 합니다. (z-index로 제어됨) */}
      {isQuestModalOpen && (
        <QuestArrival 
          onYes={handleQuestAccept} 
          onNo={handleQuestDecline} 
        />
      )}
    </div>
  );
}




