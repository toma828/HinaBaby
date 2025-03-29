import React from 'react';
import Layout from '../components/layout/Layout';
import Cloud from '../components/home/Cloud';
import PhotoCollage from '../components/home/PhotoCollage';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Layout>
      {/* 雲の背景 */}
      <Cloud style={{ width: '200px', height: '60px', top: '10%', left: '10%' }}>
        <div className="absolute w-[90px] h-[90px] bg-white bg-opacity-50 rounded-full top-[-50px] left-[25px] filter blur-md"></div>
        <div className="absolute w-[100px] h-[100px] bg-white bg-opacity-50 rounded-full top-[-40px] right-[25px] filter blur-md"></div>
      </Cloud>
      <Cloud style={{ width: '160px', height: '50px', top: '25%', left: '30%' }}>
        <div className="absolute w-[70px] h-[70px] bg-white bg-opacity-50 rounded-full top-[-40px] left-[20px] filter blur-md"></div>
        <div className="absolute w-[80px] h-[80px] bg-white bg-opacity-50 rounded-full top-[-35px] right-[20px] filter blur-md"></div>
      </Cloud>
      <Cloud style={{ width: '140px', height: '45px', bottom: '20%', left: '50%' }}>
        <div className="absolute w-[65px] h-[65px] bg-white bg-opacity-50 rounded-full top-[-35px] left-[15px] filter blur-md"></div>
        <div className="absolute w-[75px] h-[75px] bg-white bg-opacity-50 rounded-full top-[-30px] right-[15px] filter blur-md"></div>
      </Cloud>
      <Cloud style={{ width: '180px', height: '55px', bottom: '30%', left: '70%' }}>
        <div className="absolute w-[80px] h-[80px] bg-white bg-opacity-50 rounded-full top-[-45px] left-[20px] filter blur-md"></div>
        <div className="absolute w-[90px] h-[90px] bg-white bg-opacity-50 rounded-full top-[-40px] right-[20px] filter blur-md"></div>
      </Cloud>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="max-w-3xl mx-auto bg-white bg-opacity-70 p-8 rounded-3xl shadow-lg my-12">
          <h2 className="text-3xl font-bold text-primary mb-4">ベビーマッサージの魅力</h2>
          <p className="text-xl text-primary-600 mb-8">赤ちゃんとママの絆を深める優しい時間</p>
          <p className="mb-4">ベビーマッサージは、お母さんと赤ちゃんの触れ合いを通して、絆を深め、赤ちゃんの健やかな成長を促します。優しいタッチと穏やかな語りかけは、赤ちゃんに安心感を与え、心身の発達を助けます。</p>
          <p>当教室では、赤ちゃんの月齢や体調に合わせたマッサージ方法をご提案し、ママと赤ちゃんがリラックスできる空間をご用意しています。</p>
        </section>
        
        {/* 写真コラージュ */}
        <PhotoCollage />
        
        <div className="w-full max-w-2xl h-80 mx-auto  overflow-hidden shadow-xl mb-12">
          <h3>講師紹介</h3>
          <img src="/images/baby-massage.jpg" alt="講師顔写真"/>
          <h2 className="text-ml font-bold text-primary">名前：</h2>
          <p>小笠原　ひな</p>
          <h2 className="text-ml font-bold text-primary">年齢</h2>
          <p>21歳</p>
          <h2 className="text-ml font-bold text-primary">活動地域</h2>
          <p>千葉県印西市</p>
          <h2 className="text-ml font-bold text-primary">資格取得時期</h2>
          <p>2024/09/23/</p>
          <h2 className="text-ml font-bold text-primary">活動内容</h2>
          <p>ベビーマッサージの講師として、赤ちゃんとママの絆を深める優しい時間を提供します。</p>
        </div>
        
        <section className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-70 p-6 rounded-xl shadow-md hover:transform hover:-translate-y-1 transition-all">
              <h3 className="text-xl font-bold text-primary mb-3">赤ちゃんへの効果</h3>
              <p>睡眠の質の向上、免疫力の向上、消化促進、情緒の安定など、様々な効果が期待できます。</p>
            </div>
            <div className="bg-whi
            te bg-opacity-70 p-6 rounded-xl shadow-md hover:transform hover:-translate-y-1 transition-all">
              <h3 className="text-xl font-bold text-primary mb-3">ママへの効果</h3>
              <p>育児ストレスの軽減、赤ちゃんとの絆の深まり、産後の回復促進などのメリットがあります。</p>
            </div>
            <div className="bg-white bg-opacity-70 p-6 rounded-xl shadow-md hover:transform hover:-translate-y-1 transition-all">
              <h3 className="text-xl font-bold text-primary mb-3">教室の特徴</h3>
              <p>少人数制で丁寧な指導、アロマの香る空間、赤ちゃんにやさしい自然素材の使用にこだわっています。</p>
            </div>
          </div>
        </section>
        
        <div className="text-center my-12">
          <Link to="/contact" className="btn-primary text-lg py-3 px-8">
            体験レッスンのお申し込み
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;