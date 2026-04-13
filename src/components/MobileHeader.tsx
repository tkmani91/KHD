import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, Search, LogIn, X,
  AlertTriangle, Megaphone, Info, Clock, ChevronRight
} from 'lucide-react';

interface Notice {
  id: number;
  title: string;
  date: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  details: string;
}

interface MobileHeaderProps {
  notices?: Notice[];
}

// ✅ Fix: icon কে function হিসেবে রাখা হয়েছে, JSX object হিসেবে নয়
const PRIORITY_CONFIG: Record<
  'high' | 'medium' | 'low',
  {
    label: string;
    badge: string;
    icon: React.ReactNode;
    dot: string;
    borderLeft: string;
    bg: string;
  }
> = {
  high: {
    label: 'জরুরী',
    badge: 'bg-red-100 text-red-700',
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
    dot: 'bg-red-500',
    borderLeft: 'border-l-red-500',
    bg: 'bg-red-50',
  },
  medium: {
    label: 'মাঝারি',
    badge: 'bg-yellow-100 text-yellow-700',
    icon: <Megaphone className="w-4 h-4 text-yellow-500" />,
    dot: 'bg-yellow-500',
    borderLeft: 'border-l-yellow-500',
    bg: 'bg-yellow-50',
  },
  low: {
    label: 'সাধারণ',
    badge: 'bg-blue-100 text-blue-700',
    icon: <Info className="w-4 h-4 text-blue-500" />,
    dot: 'bg-blue-400',
    borderLeft: 'border-l-blue-400',
    bg: 'bg-blue-50',
  },
};

const MobileHeader: React.FC<MobileHeaderProps> = ({ notices = [] }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const unreadCount = notices.filter((n) => !readIds.has(n.id)).length;

  const handleNoticeClick = (notice: Notice) => {
    setReadIds((prev) => new Set(prev).add(notice.id));
    setSelectedNotice(notice);
  };

  const handleClose = () => {
    setShowPanel(false);
    setSelectedNotice(null);
  };

  return (
    // ✅ Fix: একটাই Fragment, nested fragment নেই
    <>
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden p-0.5">
              <img
                src="https://i.ibb.co.com/XZT93Lxq/KHDS.png"
                alt="কলম হিন্দু ধর্মসভা"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="leading-none">
              <h1 className="text-sm font-black tracking-tight">কলম হিন্দু ধর্মসভা</h1>
              <p className="text-[10px] text-orange-100 opacity-80">
                কলম, সিংড়া, নাটোর, বাংলাদেশ
              </p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full active:scale-90 transition-all"
              aria-label="সার্চ"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowPanel(true)}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full active:scale-90 transition-all relative"
              aria-label="বিজ্ঞপ্তি"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-yellow-400 text-orange-900 text-[10px] font-black rounded-full flex items-center justify-center px-0.5 animate-bounce shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            <Link
              to="/login"
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full active:scale-90 transition-all"
              aria-label="লগইন"
            >
              <LogIn className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          showPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* ── Slide Panel ── */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          showPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedNotice ? (
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition mr-1"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
              ) : (
                <Bell className="w-5 h-5" />
              )}
              <h2 className="font-bold text-lg">
                {selectedNotice ? 'বিজ্ঞপ্তি বিবরণ' : 'বিজ্ঞপ্তি'}
              </h2>
              {!selectedNotice && unreadCount > 0 && (
                <span className="bg-yellow-400 text-orange-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} নতুন
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-all hover:rotate-90 duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Detail View */}
        {selectedNotice ? (
          <div className="flex-1 overflow-y-auto">
            <div className={`h-1 w-full ${
              selectedNotice.priority === 'high' ? 'bg-red-500' :
              selectedNotice.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-400'
            }`} />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PRIORITY_CONFIG[selectedNotice.priority].badge}`}>
                  {PRIORITY_CONFIG[selectedNotice.priority].label}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  {selectedNotice.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {selectedNotice.title}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {selectedNotice.date}
              </div>
              <hr className="border-gray-100" />
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {selectedNotice.details}
              </p>
            </div>
          </div>
        ) : (
          /* Notice List */
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {notices.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                <Bell className="w-12 h-12 opacity-30" />
                <p className="text-sm">কোনো বিজ্ঞপ্তি নেই</p>
              </div>
            ) : (
              notices.map((notice) => {
                const cfg = PRIORITY_CONFIG[notice.priority];
                const isRead = readIds.has(notice.id);
                return (
                  <div
                    key={notice.id}
                    onClick={() => handleNoticeClick(notice)}
                    className={`p-4 cursor-pointer transition-colors border-l-4 ${cfg.borderLeft} ${
                      !isRead ? cfg.bg : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                          {!isRead && (
                            <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                          )}
                        </div>
                        <h3 className={`text-sm font-semibold mb-1 line-clamp-2 ${
                          !isRead ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {notice.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notice.date}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <p className="text-[11px] text-center text-gray-400">
            কলম হিন্দু ধর্মসভা • অফিসিয়াল নোটিশ
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
