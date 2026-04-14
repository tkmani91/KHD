import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Image as ImageIcon, Music, Tv, BookOpen } from 'lucide-react';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'হোম', icon: Home },
    { path: '/ekadashi', label: 'একাদশী', icon: BookOpen },
    { path: '/pdf', label: 'ফর্দ', icon: FileText },
    { path: '/gallery', label: 'গ্যালারি', icon: ImageIcon },
    { path: '/music', label: 'গান', icon: Music },
    { path: '/live', label: 'লাইভ TV', icon: Tv },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isEkadashi = item.path === '/ekadashi';
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full gap-0.5 transition-all duration-300 ${
                isActive 
                  ? isEkadashi 
                    ? 'text-orange-600 scale-110' 
                    : 'text-orange-500 scale-110' 
                  : isEkadashi 
                    ? 'text-orange-400' 
                    : 'text-gray-500'
              }`}
            >
              <div className={`p-1 rounded-xl ${
                isActive 
                  ? isEkadashi 
                    ? 'bg-orange-100' 
                    : 'bg-orange-50' 
                  : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce' : ''}`} />
              </div>
              <span className="text-[9px] font-bold leading-tight">{item.label}</span>
              {isActive && <div className={`w-1 h-1 rounded-full ${
                isEkadashi ? 'bg-orange-600' : 'bg-orange-500'
              }`} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
