import React, { useEffect } from 'react';

const PhotoCollage = () => {
  useEffect(() => {
    // アニメーション用のスクリプト
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((bubble, index) => {
      bubble.style.animation = `rise ${3 + index * 0.5}s infinite ease-out ${index * 0.3}s`;
    });
  }, []);

  return (
    <div className="relative w-full max-w-3xl h-[750px] mx-auto mb-12">
      {/* 写真円 - 逆三角形の配置 */}
      {/* 上段（大きめの写真） */}
      <div className="photo-circle absolute w-28 h-28 rounded-full overflow-hidden shadow-md border-3 border-white bg-gray-100 flex items-center justify-center top-[2%] left-[10%]">
        <img src="/images/photo1.jpg" alt="ベビーマッサージ写真1" className="w-full h-full object-cover" />
      </div>
      <div className="photo-circle absolute w-[120px] h-[120px] rounded-full overflow-hidden shadow-md border-3 border-white bg-gray-100 flex items-center justify-center top-[2%] left-[30%]">
        <img src="/images/photo2.jpg" alt="ベビーマッサージ写真2" className="w-full h-full object-cover" />
      </div>
      <div className="photo-circle absolute w-[130px] h-[130px] rounded-full overflow-hidden shadow-md border-3 border-white bg-gray-100 flex items-center justify-center top-[2%] left-[50%]">
        <img src="/images/photo3.jpg" alt="ベビーマッサージ写真3" className="w-full h-full object-cover" />
      </div>
      <div className="photo-circle absolute w-[120px] h-[120px] rounded-full overflow-hidden shadow-md border-3 border-white bg-gray-100 flex items-center justify-center top-[2%] left-[70%]">
        <img src="/images/photo4.jpg" alt="ベビーマッサージ写真4" className="w-full h-full object-cover" />
      </div>
      
      {/* 中段（中サイズの写真） */}
      <div className="photo-circle absolute w-[95px] h-[95px] rounded-full overflow-hidden shadow-md border-3 border-white bg-gray-100 flex items-center justify-center top-[15%] left-[20%]">
        <img src="/images/photo5.jpg" alt="ベビーマッサージ写真5" className="w-full h-full object-cover" />
      </div>
      <div className="photo-circle absolute w-[100px] h-[100px] rounded-full overflow-hidden shadow-md border-3 border-white bg-gray-100 flex items-center justify-center top-[15%] left-[40%]">
        <img src="/images/photo6.jpg" alt="ベビーマッサージ写真6" className="w-full h-full object-cover" />
      </div>
      <div className="photo-circle absolute w-[95px] h-[95px] rounded-full overflow-hidden shadow-md border-3 border-white bg-gray-100 flex items-center justify-center top-[15%] left-[60%]">
        <img src="/images/photo7.jpg" alt="ベビーマッサージ写真7" className="w-full h-full object-cover" />
      </div>
      
      {/* 下段（小さめの写真） */}
      <div className="photo-circle absolute w-[80px] h-[80px] rounded-full overflow-hidden shadow-md border-3 border-white bg-gray-100 flex items-center justify-center top-[28%] left-[25%]">
        <img src="/images/photo8.jpg" alt="ベビーマッサージ写真8" className="w-full h-full object-cover" />
      </div>
      <div className="photo-circle absolute w-[85px] h-[85px] rounded-full overflow-hidden shadow-md border-3 border-white bg-gray-100 flex items-center justify-center top-[28%] left-[55%]">
        <img src="/images/photo9.jpg" alt="ベビーマッサージ写真9" className="w-full h-full object-cover" />
      </div>
      
      {/* 最下段（小さめの写真） */}
      <div className="photo-circle absolute w-[70px] h-[70px] rounded-full overflow-hidden shadow-md border-3 border-white bg-gray-100 flex items-center justify-center top-[40%] left-[40%]">
        <img src="/images/photo10.jpg" alt="ベビーマッサージ写真10" className="w-full h-full object-cover" />
      </div>

      {/* 泡エリア - 中央部分に配置 */}
      <div className="bubble absolute w-9 h-9 rounded-full bg-white bg-opacity-70 top-[55%] left-[45%] z-1"></div>
      <div className="bubble absolute w-7 h-7 rounded-full bg-white bg-opacity-70 top-[58%] left-[52%] z-1"></div>
      <div className="bubble absolute w-[22px] h-[22px] rounded-full bg-white bg-opacity-70 top-[61%] left-[48%] z-1"></div>
      <div className="bubble absolute w-[18px] h-[18px] rounded-full bg-white bg-opacity-70 top-[64%] left-[43%] z-1"></div>
      <div className="bubble absolute w-[15px] h-[15px] rounded-full bg-white bg-opacity-70 top-[67%] left-[55%] z-1"></div>

      {/* キャラクター - 明確に下部に */}
      <div className="character absolute bottom-[50px] left-1/2 transform -translate-x-1/2 w-40 h-40 animate-float">
        <img 
            src="/images/neokihiyoko.png"
            alt="キャラクター" 
            className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default PhotoCollage;