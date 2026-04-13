import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, LogIn } from 'lucide-react';

const MobileHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-xl shadow-inner">
            🕉️
          </div>
          <div className="leading-none">
            <h1 className="text-sm font-black tracking-tight">কলম হিন্দু ধর্মসভা</h1>
            <p className="text-[10px] text-orange-100 opacity-80">Singhra, Natore</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          <button className="p-1.5 bg-white/10 rounded-full active:scale-90 transition">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-1.5 bg-white/10 rounded-full active:scale-90 transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
          </button>
          <Link to="/login" className="p-1.5 bg-white/10 rounded-full active:scale-90 transition">
            <LogIn className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
