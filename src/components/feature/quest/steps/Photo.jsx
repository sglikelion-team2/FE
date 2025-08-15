import React, { useState, useRef, useEffect } from 'react';
import './Quest.css';

export default function Photo({ onComplete }) {
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
    if (!selectedFile) {
      alert('사진을 업로드해주세요!');
      return;
    }
    // 부모에게 완료 신호와 파일 데이터를 보냅니다.
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
      <div className="quest-header">
        <span className="quest-title">Quest</span>
        <button className="close-button">X</button>
      </div>
      
      <div className="quest-content">
        <p className="quest-instruction">
          **카페의 분위기**를 잘 보여주는 <br />
          사진 1장을 업로드 해주세요
        </p>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} 
        />

        <div className="photo-upload-area" onClick={handleUploadAreaClick}>
          {previewUrl ? (
            <img src={previewUrl} alt="미리보기" className="photo-preview" />
          ) : (
            <div className="upload-placeholder">
              <span className="upload-icon">↑</span>
              <p>Upload</p>
            </div>
          )}
        </div>
      </div>

      <div className="quest-footer">
        <button className="quest-button done" onClick={handleDoneClick}>Done</button>
      </div>
    </div>
  );
}