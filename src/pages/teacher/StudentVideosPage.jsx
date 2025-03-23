import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TeacherStudentVideosPage = () => {
  const { id } = useParams(); // 生徒のIDを取得
  const navigate = useNavigate();
  const [studentVideos, setStudentVideos] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentVideos = async () => {
      try {
        setLoading(true);
        
        // すべての動画を取得
        const response = await api.videos.getAll();
        
        // 指定された生徒の動画だけをフィルタリング
        const studentId = parseInt(id, 10);
        const filteredVideos = response.data.filter(video => video.user_id === studentId);
        
        if (filteredVideos.length > 0) {
          // 生徒名を取得（最初の動画から）
          setStudentName(filteredVideos[0].owner_name || `ユーザー ${studentId}`);
          setStudentVideos(filteredVideos);
        } else {
          setError('この生徒の動画は見つかりませんでした。');
        }
      } catch (err) {
        console.error('生徒動画取得エラー:', err);
        setError('動画の読み込み中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentVideos();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (error || studentVideos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/teacher/videos" className="text-primary hover:underline mb-6 inline-block">
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
      <Link to="/teacher/videos" className="text-primary hover:underline mb-6 inline-block">
        ← 動画一覧に戻る
      </Link>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">{studentName}の動画一覧</h1>
        <span className="bg-primary text-white px-4 py-2 rounded-full">
          {studentVideos.length}件の動画
        </span>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentVideos.map((video) => (
            <div key={video.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
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
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${video.has_feedback ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                  {video.has_feedback ? 'フィードバック済み' : 'フィードバック待ち'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold">{video.title}</h3>
                <p className="text-sm text-gray-600">練習内容: {video.practice_type}</p>
                <div className="mt-4">
                  <Link to={`/teacher/video/${video.id}`} className="text-primary hover:underline">
                    詳細を見る
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentVideosPage;