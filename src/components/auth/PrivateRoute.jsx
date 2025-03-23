import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// 認証が必要なルートを保護するコンポーネント
const PrivateRoute = ({ children, teacherOnly = false }) => {
  const { user, loading, isTeacher } = useAuth();
  const location = useLocation();

  if (loading) {
    // 認証状態のロード中
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!user) {
    // 未認証の場合、ログインページにリダイレクト
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (teacherOnly && !isTeacher()) {
    // 講師専用ページで生徒がアクセスした場合
    return <Navigate to="/unauthorized" replace />;
  }

  // 認証OKの場合、子コンポーネントを表示
  return children;
};

export default PrivateRoute;