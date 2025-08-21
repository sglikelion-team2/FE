import React, { useState, useRef, useEffect } from 'react';
import './Quest.css';

// 아이콘 import
import CoffeeIcon from '../../../../assets/icons/coffee.svg';
import Save1Icon from '../../../../assets/icons/save1.svg';
import Save2Icon from '../../../../assets/icons/save2.svg';
import upload from '../../../../assets/icons/Upload.svg';

export default function Photo({ onComplete, title }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleDoneClick = () => {
    if (!selectedFile) return;
    onComplete({ photo: selectedFile });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="quest-container">
      <div className="quest-content">
        <img src={CoffeeIcon} alt="분위기" className="quest-main-icon" />
        <p className="quest-instruction-small">분위기 CHECK</p>
        <p className="quest-instruction">
          <span className="store-name">{title}</span> 의 <br />
          무드를 사진으로 남겨주세요! 📸
        </p>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} 
        />
        
        {/* 사진 업로드 UI */}
        <div className="photo-upload-area-new" onClick={handleUploadAreaClick}>
          {previewUrl ? (
            <img src={previewUrl} alt="미리보기" className="photo-preview" />
          ) : (
            <div className="upload-placeholder">
              <span className="upload-icon"><img src={upload} alt="업로드" /></span>
              <p>터치하여 이미지 업로드</p>
            </div>
          )}
        </div>
        <p className="drag-text">사진 업로드하여 기록하기</p>
      </div>

      <div className="quest-footer">
        <button 
          className="quest-button-new" 
          onClick={handleDoneClick}
          disabled={!selectedFile}
        >
          <img src={selectedFile ? Save2Icon : Save1Icon} alt="기록하기" />
        </button>
      </div>
    </div>
  );
}