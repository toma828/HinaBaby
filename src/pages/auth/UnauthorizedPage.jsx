import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

const UnauthorizedPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">アクセス権限がありません</h1>
        <p className="text-xl text-gray-600 mb-8">
          このページにアクセスするための権限がありません。
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="btn-primary">
            トップページに戻る
          </Link>
          <Link to="/login" className="btn-secondary">
            ログインページへ
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default UnauthorizedPage;