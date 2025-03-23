import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StudentVideoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        const response = await api.videos.getById(id);
        console.log('動画詳細データ:', response.data);
        setVideo(response.data);
      } catch (err) {
        console.error('動画詳細取得エラー:', err);
        setError('動画の詳細を読み込めませんでした。');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideoDetails();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/student/videos" className="text-primary hover:underline mb-6 inline-block">
          ← 動画一覧に戻る
        </Link>
        <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center">
          <p className="font-bold text-lg mb-2">エラー</p>
          <p>{error || '動画が見つかりません'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/student/videos" className="text-primary hover:underline mb-6 inline-block">
        ← 動画一覧に戻る
      </Link>
      
      <h1 className="text-3xl font-bold text-primary mb-4">{video.title}</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <video 
            controls 
            src={`http://localhost:8000${video.video_url}`}
            className="w-full h-full object-contain bg-black"
          />
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 mb-1">アップロード日: {new Date(video.created_at).toLocaleDateString('ja-JP')}</p>
              <p className="text-gray-600 mb-1">練習内容: {video.practice_type}</p>
            </div>
            <span className={`${video.has_feedback ? 'bg-green-500' : 'bg-yellow-500'} text-white px-3 py-1 rounded-full text-sm`}>
              {video.has_feedback ? 'フィードバック済み' : 'フィードバック待ち'}
            </span>
          </div>
          
          {video.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">説明</h3>
              <p className="text-gray-700">{video.description}</p>
            </div>
          )}
          
          {video.question && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">質問・コメント</h3>
              <p className="bg-gray-50 p-4 rounded">{video.question}</p>
            </div>
          )}
        </div>
      </div>
      
      {video.feedback ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">講師からのフィードバック</h2>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <p className="font-semibold">{video.feedback.teacher_name || '講師'}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <p className="whitespace-pre-line">{video.feedback.content}</p>
            </div>
          </div>
          
          {video.timestamps && video.timestamps.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">タイムスタンプコメント</h3>
              <div className="space-y-3">
                {video.timestamps.map(ts => (
                  <div 
                    key={ts.id} 
                    className="flex p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      // 動画要素を見つけて、そのタイムスタンプに移動
                      const videoElement = document.querySelector('video');
                      if (videoElement) {
                        const [minutes, seconds] = ts.time.split(':').map(Number);
                        videoElement.currentTime = minutes * 60 + seconds;
                        videoElement.play();
                      }
                    }}
                  >
                    <div className="font-mono font-semibold w-16 text-primary">{ts.time}</div>
                    <div className="flex-1">{ts.comment}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">フィードバック待ち</h2>
          <p className="text-yellow-700">講師からのフィードバックはまだありません。しばらくお待ちください。</p>
        </div>
      )}
    </div>
  );
};

export default StudentVideoDetailPage;