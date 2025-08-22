import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CafePhoto.css'; // CSS 파일을 임포트

import backIcon from "../../assets/map/detail_info/arrow-back.svg"; // 뒤로가기 아이콘


export function CafePhotoInline({ title = '카페 사진', onBack }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  console.log("사진 더보기 컴포넌트 렌더링", title);

  useEffect(() => {
    const fetchData = async () => {
 try {
   
   const API_BASE =
           process.env.REACT_APP_PROJECT_API ??
            import.meta.env.PROJECT_API ??
            window.PROJECT_API ??
            "";
   if (!API_BASE) {
     console.warn('API base URL이 비어 있습니다. (.env의 VITE_PROJECT_API 확인)');
     
   }


   
   
     const Url =
       `${API_BASE}/mainpage/${encodeURIComponent(title)}/photos`;

   const ctrlTop = new AbortController();
   const Res = await fetch(Url, {
     method: 'GET',
     signal: ctrlTop.signal,
     headers: {

     },
     // 서버 요구가 "GET + JSON 바디"라면 아래 유지, 아니면 제거
    
    
   });
      if (!Res.ok) {
        // ✅ 서버가 보낸 에러 바디까지 찍어서 원인 파악
        const text = await Res.text();
        throw new Error(`HTTP ${Res.status} — ${text}`);
      }
   const Data = await Res.json();

   console.log('TopCafes API 응답:', Data);
   setImages(Data.result.img_url)

 
 
 } catch (e) {
   console.warn('더보기 사진 요청 실패:', e);
   // 폴백이 필요하면 mock 사용 (import는 위에서 주석만 했으니, 임시로 풀어서 사용 가능)
   // const updatedTopCafes = await Promise.all(
   //   (topCafes?.result?.pin ?? []).map(async (cafe) => {
   //     const routeInfo = await getRouteInfo({ lat: cafe.lat, lng: cafe.lng }, { silent: true });
   //     return { ...cafe, distance: routeInfo?.distance ?? null, time: routeInfo?.time ?? null };
   //   })
   // );
   // setTopCafesWithDistance(updatedTopCafes);
 } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [title]);

  if (loading) return <div className="gallery-container">로딩 중...</div>;
  if (error)   return <div className="gallery-container error">{error}</div>;

  return (
    <div className="gallery-wrapper">
      <div className="gallery-header">
        {/* <h1>{title}</h1> */}
        {onBack && (
          <img src={backIcon} onClick={onBack} alt=''/>
        )}
      </div>
      <div className="image-grid-scrollable">  {/* ← 스크롤 가능 영역 */}
        <div className="image-grid">
          {images.map((url, idx) => (
            <div key={idx} className="image-item">
              <img src={url} alt={`카페 이미지 ${idx + 1}`} width/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// export default function Gallery() {
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
  
//   const location = useLocation();
//   const { title } = location.state || { title: '카페 사진' };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const mockData = {
//           "isSuccess": true,
//           "code": 200,
//           "message": "성공적으로 불러옴~",
//           "result": {
//             "pin_name": "스따벅싀신촌",
//             "img_url": [
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s"
//             ]
//           }
//         };
//         if (mockData.isSuccess) {
//           setImages(mockData.result.img_url);
//         } else {
//           setError('데이터 로딩에 실패했습니다.');
//         }
//       } catch (e) {
//         setError('네트워크 오류가 발생했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return <div className="gallery-container">로딩 중...</div>;
//   }
//   if (error) {
//     return <div className="gallery-container error">{error}</div>;
//   }

//   return (
//     <div className="gallery-wrapper"> {/* 새로운 컨테이너 추가 */}
//       <div className="gallery-header">
//         <h1>{title}</h1>
//         <button className="back-button" onClick={() => navigate(-1)}>
//           이전으로feeef
//         </button>
//       </div>
      
//       <div className="image-grid-scrollable"> {/* ⭐️ 스크롤 가능한 영역 */}
//         <div className="image-grid">
//           {images.map((url, index) => (
//             <div key={index} className="image-item">
//               <img src={url} alt={`카페 이미지 ${index + 1}`} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }