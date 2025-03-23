import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const TeacherVideosListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentMap, setStudentMap] = useState({});

  useEffect(() => {
    // 動画一覧を取得
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await api.videos.getAll();
        console.log('取得した動画データ:', response.data);
        setVideos(response.data || []);

        // 生徒ごとに動画をグループ化するためのマップを作成
        const studentsMap = {};
        response.data.forEach(video => {
          if (!studentsMap[video.user_id]) {
            studentsMap[video.user_id] = {
              videos: [],
              name: video.owner_name ||'ユーザー ' + video.user_id // APIが生徒名を返す場合は修正
            };
          }
          studentsMap[video.user_id].videos.push(video);
        });
        
        setStudentMap(studentsMap);
      } catch (err) {
        console.error('動画取得エラー:', err);
        setError('動画を読み込めませんでした。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // フィルタリングされた生徒リストを取得
  const getFilteredStudents = () => {
    const filtered = {};
    
    Object.keys(studentMap).forEach(studentId => {
      const student = studentMap[studentId];
      
      // 生徒名で検索フィルタリング
      if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return;
      }
      
      // 動画のステータスでフィルタリング
      const filteredVideos = student.videos.filter(video => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'pending') return !video.has_feedback;
        if (activeFilter === 'completed') return video.has_feedback;
        return true;
      });
      
      if (filteredVideos.length > 0) {
        filtered[studentId] = {
          ...student,
          videos: filteredVideos
        };
      }
    });
    
    return filtered;
  };

  const filteredStudents = getFilteredStudents();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">生徒の動画一覧</h1>
      <p className="text-lg text-gray-600 mb-8">
        生徒から提出された動画一覧です。フィードバックが必要な動画を確認してください。
      </p>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-full ${activeFilter === 'all' ? 'bg-primary text-white' : 'border border-primary text-primary'}`}
              onClick={() => handleFilterChange('all')}
            >
              すべて
            </button>
            <button 
              className={`px-4 py-2 rounded-full ${activeFilter === 'pending' ? 'bg-primary text-white' : 'border border-primary text-primary'}`}
              onClick={() => handleFilterChange('pending')}
            >
              フィードバック待ち
            </button>
            <button 
              className={`px-4 py-2 rounded-full ${activeFilter === 'completed' ? 'bg-primary text-white' : 'border border-primary text-primary'}`}
              onClick={() => handleFilterChange('completed')}
            >
              フィードバック済み
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="生徒名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
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
      ) : Object.keys(filteredStudents).length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">該当する動画はありません</h2>
          <p className="text-gray-600 mb-6">
            {videos.length === 0 
              ? "まだ生徒からの動画投稿はありません" 
              : "検索条件に合う動画がありません。フィルターを変更してみてください。"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.keys(filteredStudents).map(studentId => {
            const student = filteredStudents[studentId];
            return (
              <div key={studentId} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-primary text-white p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{student.name}</h2>
                    <span className="bg-white text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {student.videos.length} 動画
                    </span>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {student.videos.slice(0, 3).map(video => (
                    <div key={video.id} className="flex border-b pb-4">
                      <div className="w-32 h-20 bg-gray-200 rounded flex-shrink-0">
                        {video.thumbnail_url ? (
                          <img 
                            src={video.thumbnail_url} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{video.title}</h3>
                          <span className={`${video.has_feedback ? 'bg-green-500' : 'bg-yellow-500'} text-white text-xs px-2 py-1 rounded`}>
                            {video.has_feedback ? 'FB済' : 'FB待ち'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">練習内容: {video.practice_type}</p>
                        <div className="mt-1">
                          <Link to={`/teacher/video/${video.id}`} className="text-primary text-sm hover:underline">
                            詳細を見る
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {student.videos.length > 3 && (
                    <div className="text-center">
                      <Link to={`/teacher/student/${studentId}`} className="text-primary hover:underline">
                        すべての動画を見る →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherVideosListPage;