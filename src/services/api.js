import axios from 'axios';

// ベースURL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// APIクライアントのインスタンス
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 認証トークンを設定する関数
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// 認証関連API
const authApi = {
  login: (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return apiClient.post('/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  register: (username, email, password, isTeacher = false) => 
    apiClient.post('/register', { username, email, password, is_teacher: isTeacher }),
  me: () => apiClient.get('/users/me'),
};

let uploadProgressCallback = null;

// 動画関連API
const videosApi = {
  getAll: () => apiClient.get('/videos'),
  getById: (id) => apiClient.get(`/videos/${id}`),

  upload: (formData) => {
    return apiClient.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (uploadProgressCallback) {
          uploadProgressCallback(percentCompleted);
        }
      }
    });
  },
  
  // フィードバック追加メソッド
  addFeedback: (videoId, feedbackData) => {
    return apiClient.post(`/videos/${videoId}/feedback`, feedbackData);
  },

  // タイムスタンプ追加メソッド
  addTimestamp: (videoId, timestampData) => {
    return apiClient.post(`/videos/${videoId}/timestamps`, timestampData);
  }
};


export default {
  setAuthToken,
  auth: authApi,
  setUploadProgressCallback: (callback) => {
    uploadProgressCallback = callback;
  },
  videos: videosApi,
};