import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
 const { user, logout, isTeacher } = useAuth();

 return (
   <header className="fixed top-0 left-0 w-full bg-white bg-opacity-30 backdrop-blur-md shadow-sm z-10">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex justify-between items-center py-4">
         <div className="flex items-center">
           <Link to="/" className="text-2xl font-bold text-primary">
             空色ベビーマッサージ
           </Link>
         </div>
         
         <nav className="hidden md:flex space-x-8">
           <Link to="/" className="text-primary hover:text-opacity-80 transition-colors relative group">
             TOP
             <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
           </Link>
           <Link to="/about" className="text-primary hover:text-opacity-80 transition-colors relative group">
             講師紹介
             <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
           </Link>
           <Link to="/certification" className="text-primary hover:text-opacity-80 transition-colors relative group">
             資格について
             <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
           </Link>
           <Link to="/lessons" className="text-primary hover:text-opacity-80 transition-colors relative group">
             レッスンについて
             <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
           </Link>
           <Link to="/contact" className="text-primary hover:text-opacity-80 transition-colors relative group">
             お問い合わせ
             <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
           </Link>
         </nav>
         
         <div className="flex space-x-4">
           {user ? (
             <>
               {isTeacher() ? (
                 <Link to="/teacher/videos" className="btn-accent">
                   講師ページ
                 </Link>
               ) : (
                 <Link to="/student/videos" className="btn-secondary">
                   マイページ
                 </Link>
               )}
               <button onClick={logout} className="text-primary hover:text-opacity-80">
                 ログアウト
               </button>
             </>
           ) : (
             <>
               <Link to="/login" className="text-primary hover:text-opacity-80">
                 ログイン
               </Link>
               <Link to="/register" className="btn-primary">
                 新規登録
               </Link>
             </>
           )}
         </div>
       </div>
     </div>
   </header>
 );
};

export default Header;