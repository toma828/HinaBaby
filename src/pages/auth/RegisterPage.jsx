import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // バリデーション
    if (!username || !email || !password || !confirmPassword) {
      setError('すべての項目を入力してください');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const success = await register(username, email, password, isTeacher);
      if (success) {
        // 登録成功時、ログインページへリダイレクト
        navigate('/login', { state: { message: '登録が完了しました。ログインしてください。' } });
      } else {
        setError('登録に失敗しました。別のユーザー名やメールアドレスをお試しください。');
      }
    } catch (err) {
      setError('登録中にエラーが発生しました。');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-sky-blue via-sky-blue-light to-white">
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">アカウント登録</h1>
            <p className="text-gray-600 mt-2">空色ベビーマッサージへようこそ</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                ユーザー名
              </label>
              <input
                id="username"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                パスワード（確認）
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="isTeacher"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={isTeacher}
                  onChange={(e) => setIsTeacher(e.target.checked)}
                />
                <label htmlFor="isTeacher" className="ml-2 block text-gray-700">
                  講師アカウントとして登録
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? '登録中...' : 'アカウント登録'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              既にアカウントをお持ちの方は{' '}
              <Link to="/login" className="text-primary hover:underline">
                ログイン
              </Link>
              {' '}してください
            </p>
          </div>
          
          <div className="text-center mt-4">
            <Link to="/" className="text-gray-500 text-sm hover:underline">
              ← トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;