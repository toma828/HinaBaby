import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const StudentVideosListPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ページ読み込み時に動画一覧を取得
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await api.videos.getAll();
        console.log('取得した動画データ:', response.data);
        setVideos(response.data || []);
      } catch (err) {
        console.error('動画取得エラー:', err);
        setError('動画を読み込めませんでした。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">あなたの投稿動画一覧</h1>
      <p className="text-lg text-gray-600 mb-8">過去にアップロードした動画と講師からのフィードバックを確認できます。</p>
      
      <div className="mb-8">
        <Link to="/student/upload" className="bg-secondary text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-all">
          新しい動画をアップロード
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">まだ動画がありません</h2>
          <p className="text-gray-600 mb-6">
            動画をアップロードして、講師からのフィードバックを受けましょう。
          </p>
          <Link to="/student/upload" className="bg-secondary text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-all inline-block">
            最初の動画をアップロード
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {video.thumbnail_url ? (
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className={`absolute top-2 right-2 ${video.has_feedback ? 'bg-green-500' : 'bg-yellow-500'} text-white text-xs px-2 py-1 rounded`}>
                  {video.has_feedback ? 'フィードバック済み' : 'フィードバック待ち'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-600">練習内容: {video.practice_type}</p>
                <div className="mt-4">
                  <Link to={`/student/video/${video.id}`} className="text-primary hover:underline">
                    詳細を見る
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentVideosListPage;