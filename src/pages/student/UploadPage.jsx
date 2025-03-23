import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StudentUploadPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [babyAge, setBabyAge] = useState('');
  const [practiceType, setPracticeType] = useState('');
  const [question, setQuestion] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // ファイルサイズチェック (100MB以下)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setMessage({
          type: 'error',
          text: 'ファイルサイズが大きすぎます。100MB以下の動画を選択してください。'
        });
        return;
      }
      
      // 動画ファイルかチェック
      if (!selectedFile.type.startsWith('video/')) {
        setMessage({
          type: 'error',
          text: '動画ファイルを選択してください。'
        });
        return;
      }
      
      setFile(selectedFile);
      
      // プレビュー用のURLを作成
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage({
        type: 'error',
        text: '動画ファイルを選択してください。'
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    // FormDataの作成
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('baby_age', babyAge);
    formData.append('practice_type', practiceType);
    if (question) formData.append('question', question);
    formData.append('video_file', file);
    
    try {
      // APIにアップロード
      // アップロード進捗はapiクライアントで処理
      api.setUploadProgressCallback(setUploadProgress);
      
      const response = await api.videos.upload(formData);
      
      setMessage({
        type: 'success',
        text: '動画が正常にアップロードされました。講師からのフィードバックをお待ちください。'
      });
      
      // 成功したら2秒後に動画一覧ページへリダイレクト
      setTimeout(() => {
        navigate('/student/videos', { state: { message: '動画のアップロードが完了しました。' } });
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'アップロード中にエラーが発生しました。もう一度お試しください。'
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">動画アップロード</h1>
      <p className="text-lg text-gray-600 mb-8">
        ベビーマッサージの練習動画をアップロードして、講師からフィードバックをもらいましょう。
      </p>

      {message.text && (
        <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 背中のマッサージ練習"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
            説明
          </label>
          <textarea
            id="description"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="動画の内容について簡単に説明してください"
            rows="3"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="babyAge">
              赤ちゃんの月齢
            </label>
            <select
              id="babyAge"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={babyAge}
              onChange={(e) => setBabyAge(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="">選択してください</option>
              <option value="0-1">0〜1ヶ月</option>
              <option value="2-3">2〜3ヶ月</option>
              <option value="4-6">4〜6ヶ月</option>
              <option value="7-9">7〜9ヶ月</option>
              <option value="10-12">10〜12ヶ月</option>
              <option value="over-12">12ヶ月以上</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="practiceType">
              練習内容
            </label>
            <select
              id="practiceType"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={practiceType}
              onChange={(e) => setPracticeType(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="">選択してください</option>
              <option value="basic">基本マッサージ</option>
              <option value="legs">脚のマッサージ</option>
              <option value="arms">腕のマッサージ</option>
              <option value="chest">胸のマッサージ</option>
              <option value="back">背中のマッサージ</option>
              <option value="face">顔のマッサージ</option>
              <option value="full">全身マッサージ</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="question">
            質問・コメント
          </label>
          <textarea
            id="question"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="講師に質問したいことや、気になる点などがあれば入力してください"
            rows="4"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">
            動画ファイル
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="video"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <label
              htmlFor="video"
              className={`cursor-pointer bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 inline-block mb-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              ファイルを選択
            </label>
            
            {!file && !isSubmitting && (
              <p className="text-gray-500 text-sm">
                ファイルサイズは100MB以下、長さは5分以内の動画を推奨します。<br />
                MP4、MOV形式に対応しています。
              </p>
            )}
            
            {file && (
              <div className="mt-4">
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                {previewUrl && (
                  <div className="mt-4 max-w-lg mx-auto">
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-auto rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {uploadProgress > 0 && (
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-secondary rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center mt-2">{uploadProgress}% アップロード完了</p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className={`bg-secondary text-white py-2 px-8 rounded-full font-semibold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'アップロード中...' : '動画をアップロード'}
          </button>
        </div>
      </form>

      <div className="text-center">
        <Link to="/student/videos" className="text-primary hover:underline">
          動画一覧に戻る
        </Link>
      </div>
    </div>
  );
};

export default StudentUploadPage;