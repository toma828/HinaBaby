import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ユーザー情報の初期化
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // トークンをヘッダーに設定
          api.setAuthToken(token);
          // プロフィール情報を取得
          const response = await api.auth.me();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to initialize user:', error);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  // ログイン処理
  const login = async (username, password) => {
    try {
      const response = await api.auth.login(username, password);
      const { access_token, is_teacher } = response.data;
      
      // トークンを保存
      localStorage.setItem('accessToken', access_token);
      api.setAuthToken(access_token);
      
      // ユーザー情報を取得
      const userResponse = await api.auth.me();
      setUser(userResponse.data);
      
      // ユーザータイプに基づいてリダイレクト
      if (is_teacher) {
        navigate('/teacher/videos');
      } else {
        navigate('/student/videos');
      }
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // 登録処理
  const register = async (username, email, password, isTeacher = false) => {
    try {
      console.log('送信するデータ:', { username, email, password, is_teacher: isTeacher });
      const response = await api.auth.register(username, email, password, isTeacher);
      console.log('API応答:', response);
      return true;
    } catch (error) {
      console.error('登録エラー詳細:', error.response?.data || error.message);
      return false;
    }
  };

  // ログアウト処理
  const logout = () => {
    localStorage.removeItem('accessToken');
    api.setAuthToken(null);
    setUser(null);
    navigate('/login');
  };

  // ユーザータイプのチェック
  const isTeacher = () => user && user.is_teacher;
  const isStudent = () => user && !user.is_teacher;

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isTeacher,
    isStudent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};