import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CafePhoto.css'; // CSS 파일을 임포트



export function CafePhotoInline({ title = '카페 사진', onBack }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockData = {
          "isSuccess": true,
          "code": 200,
          "message": "성공적으로 불러옴~",
          "result": {
            "pin_name": "스따벅싀신촌",
            "img_url": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s"
            ]
          }
        };
        if (mockData.isSuccess) setImages(mockData.result.img_url);
        else setError('데이터 로딩에 실패했습니다.');
      } catch {
        setError('네트워크 오류가 발생했습니다.');
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
          <button className="back-button" onClick={onBack}>이전으로</button>
        )}
      </div>
      <div className="image-grid-scrollable">
        <div className="image-grid">
          {images.map((url, idx) => (
            <div key={idx} className="image-item">
              <img src={url} alt={`카페 이미지 ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const location = useLocation();
  const { title } = location.state || { title: '카페 사진' };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockData = {
          "isSuccess": true,
          "code": 200,
          "message": "성공적으로 불러옴~",
          "result": {
            "pin_name": "스따벅싀신촌",
            "img_url": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-wuEdOZYUf1WRpWbEJVBHAUmUEbU_J9cng&s"
            ]
          }
        };
        if (mockData.isSuccess) {
          setImages(mockData.result.img_url);
        } else {
          setError('데이터 로딩에 실패했습니다.');
        }
      } catch (e) {
        setError('네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="gallery-container">로딩 중...</div>;
  }
  if (error) {
    return <div className="gallery-container error">{error}</div>;
  }

  return (
    <div className="gallery-wrapper"> {/* 새로운 컨테이너 추가 */}
      <div className="gallery-header">
        <h1>{title}</h1>
        <button className="back-button" onClick={() => navigate(-1)}>
          이전으로
        </button>
      </div>
      
      <div className="image-grid-scrollable"> {/* ⭐️ 스크롤 가능한 영역 */}
        <div className="image-grid">
          {images.map((url, index) => (
            <div key={index} className="image-item">
              <img src={url} alt={`카페 이미지 ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}