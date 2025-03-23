import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TeacherVideoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // フィードバック関連の状態
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  
  // タイムスタンプコメント関連の状態
  const [currentTime, setCurrentTime] = useState('00:00');
  const [timestampComment, setTimestampComment] = useState('');
  const [isSubmittingTimestamp, setIsSubmittingTimestamp] = useState(false);
  const [timestamps, setTimestamps] = useState([]);
  const [videoRef, setVideoRef] = useState(null);
  
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        const response = await api.videos.getById(id);
        console.log('動画詳細データ:', response.data);
        
        setVideo(response.data);
        
        // フィードバックが既に存在する場合はフォームに設定
        if (response.data.feedback) {
          setFeedbackContent(response.data.feedback.content);
        }
        
        // タイムスタンプを設定
        if (response.data.timestamps) {
          setTimestamps(response.data.timestamps);
        }
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
  }, [id]);

  // フィードバック送信
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackContent.trim()) {
      return;
    }
    
    setIsSubmittingFeedback(true);
    
    try {
      const response = await api.videos.addFeedback(id, {
        content: feedbackContent
      });
      
      console.log('フィードバック送信結果:', response.data);
      setFeedbackSuccess(true);
      
      // 3秒後にメッセージを消す
      setTimeout(() => {
        setFeedbackSuccess(false);
      }, 3000);
      
      // 動画データを更新（フィードバック済みに）
      if (video) {
        setVideo({
          ...video,
          has_feedback: true,
          feedback: {
            ...video.feedback,
            content: feedbackContent
          }
        });
      }
    } catch (err) {
      console.error('フィードバック送信エラー:', err);
      alert('フィードバックの送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // タイムスタンプ更新（動画の現在時間を取得）
  const updateCurrentTime = () => {
    if (videoRef) {
      const time = videoRef.currentTime;
      const minutes = Math.floor(time / 60).toString().padStart(2, '0');
      const seconds = Math.floor(time % 60).toString().padStart(2, '0');
      setCurrentTime(`${minutes}:${seconds}`);
    }
  };

  // タイムスタンプコメント送信
  const handleTimestampSubmit = async (e) => {
    e.preventDefault();
    
    if (!timestampComment.trim()) {
      return;
    }
    
    setIsSubmittingTimestamp(true);
    
    try {
      const response = await api.videos.addTimestamp(id, {
        time: currentTime,
        comment: timestampComment
      });
      
      console.log('タイムスタンプ送信結果:', response.data);
      
      // 新しいタイムスタンプを追加
      const newTimestamp = {
        id: response.data.id || Date.now(), // APIがIDを返さない場合の仮ID
        time: currentTime,
        comment: timestampComment
      };
      
      setTimestamps([...timestamps, newTimestamp]);
      setTimestampComment(''); // フォームをクリア
    } catch (err) {
      console.error('タイムスタンプ送信エラー:', err);
      alert('タイムスタンプの送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmittingTimestamp(false);
    }
  };

  // タイムスタンプをクリックして動画をシーク
  const seekToTimestamp = (timeStr) => {
    if (videoRef) {
      const [minutes, seconds] = timeStr.split(':').map(Number);
      const timeInSeconds = minutes * 60 + seconds;
      videoRef.currentTime = timeInSeconds;
      videoRef.play();
    }
  };

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
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左側: 動画プレーヤーと詳細情報 */}
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-bold text-primary mb-4">{video.title}</h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <video 
                controls 
                src={`http://localhost:8000${video.video_url}`}
                className="w-full h-full object-contain bg-black"
                ref={ref => setVideoRef(ref)}
                onTimeUpdate={updateCurrentTime}
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600 mb-1">生徒名: {video.owner_name}</p>
                  <p className="text-gray-600 mb-1">練習内容: {video.practice_type}</p>
                  <p className="text-gray-600 mb-1">赤ちゃんの月齢: {video.baby_age}</p>
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
                  <h3 className="text-lg font-semibold mb-2">生徒からの質問・コメント</h3>
                  <p className="bg-gray-50 p-4 rounded">{video.question}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 右側: フィードバックとタイムスタンプ */}
        <div className="lg:w-1/3">
          {/* フィードバックフォーム */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-primary mb-4">フィードバック</h2>
            
            <form onSubmit={handleFeedbackSubmit}>
              <div className="mb-4">
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="6"
                  placeholder="生徒へのフィードバックを入力してください..."
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  required
                ></textarea>
              </div>
              
              {feedbackSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                  フィードバックが正常に送信されました！
                </div>
              )}
              
              <button
                type="submit"
                className={`w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 ${isSubmittingFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmittingFeedback}
              >
                {isSubmittingFeedback ? '送信中...' : 'フィードバックを送信'}
              </button>
            </form>
          </div>
          
          {/* タイムスタンプコメント */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-primary mb-4">タイムスタンプコメント</h2>
            
            <form onSubmit={handleTimestampSubmit} className="mb-6">
              <div className="flex gap-2 mb-4">
                <div className="w-24">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                    placeholder="00:00"
                    pattern="[0-9]{2}:[0-9]{2}"
                  />
                </div>
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300"
                  onClick={updateCurrentTime}
                >
                  現在時間
                </button>
              </div>
              
              <div className="mb-4">
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                  placeholder="この時間のコメントを入力..."
                  value={timestampComment}
                  onChange={(e) => setTimestampComment(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className={`w-full bg-secondary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 ${isSubmittingTimestamp ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmittingTimestamp}
              >
                {isSubmittingTimestamp ? '送信中...' : 'コメントを追加'}
              </button>
            </form>
            
            {timestamps.length > 0 ? (
              <div>
                <h3 className="font-semibold mb-2">追加済みコメント</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {timestamps.map((ts) => (
                    <div 
                      key={ts.id} 
                      className="flex p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                      onClick={() => seekToTimestamp(ts.time)}
                    >
                      <div className="font-mono font-semibold w-16 text-primary">{ts.time}</div>
                      <div className="flex-1">{ts.comment}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">まだコメントはありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherVideoDetailPage;