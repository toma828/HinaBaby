import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// 各ページコンポーネントのインポート - 名前付きエクスポートの場合は波括弧を使用
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';

// 生徒ページ
import StudentUploadPage from './pages/student/UploadPage';
import StudentVideosListPage from './pages/student/VideosListPage';
import StudentVideoDetailPage from './pages/student/VideoDetailPage';

// 講師ページ
import TeacherVideosListPage from './pages/teacher/VideosListPage';
import TeacherVideoDetailPage from './pages/teacher/VideoDetailPage';
import TeacherStudentVideosPage from './pages/teacher/StudentVideosPage';

// 認証コンポーネント
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 公開ページ */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* 生徒ページ（認証必要） */}
          <Route 
            path="/student/upload" 
            element={
              <PrivateRoute>
                <StudentUploadPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student/videos" 
            element={
              <PrivateRoute>
                <StudentVideosListPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student/video/:id" 
            element={
              <PrivateRoute>
                <StudentVideoDetailPage />
              </PrivateRoute>
            } 
          />
          
          {/* 講師ページ（講師認証必要） */}
          <Route 
            path="/teacher/videos" 
            element={
              <PrivateRoute teacherOnly={true}>
                <TeacherVideosListPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/teacher/video/:id" 
            element={
              <PrivateRoute teacherOnly={true}>
                <TeacherVideoDetailPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/teacher/student/:id" 
            element={
            <PrivateRoute teacherOnly={true}>
              <TeacherStudentVideosPage />
            </PrivateRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;