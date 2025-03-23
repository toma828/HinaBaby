import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-blue via-sky-blue-light to-white">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;