import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Image,
  Music,
  FileText,
  Tv,
  Bell,
  Users,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Download,
  Video,
  Radio
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalPuja: number;
  totalSongs: number;
  totalPDFs: number;
  totalGallery: number;
  liveViewers: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const stats: DashboardStats = {
    totalUsers: 1250,
    totalPuja: 48,
    totalSongs: 156,
    totalPDFs: 89,
    totalGallery: 2340,
    liveViewers: 342
  };

  const menuItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: LayoutDashboard },
    { id: 'puja', label: 'পূজা ব্যবস্থাপনা', icon: Calendar },
    { id: 'gallery', label: 'গ্যালারি', icon: Image },
    { id: 'music', label: 'সঙ্গীত', icon: Music },
    { id: 'pdf', label: 'PDF ফাইল', icon: FileText },
    { id: 'live', label: 'লাইভ TV', icon: Tv },
    { id: 'announcements', label: 'ঘোষণা', icon: Bell },
    { id: 'users', label: 'ব্যবহারকারী', icon: Users },
    { id: 'settings', label: 'সেটিংস', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openModal = (type: string) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="মোট ব্যবহারকারী"
                value={stats.totalUsers}
                icon={Users}
                trend="+12%"
                color="blue"
              />
              <StatCard
                title="মোট পূজা"
                value={stats.totalPuja}
                icon={Calendar}
                trend="+5%"
                color="orange"
              />
              <StatCard
                title="সঙ্গীত সংখ্যা"
                value={stats.totalSongs}
                icon={Music}
                trend="+8%"
                color="purple"
              />
              <StatCard
                title="PDF ফাইল"
                value={stats.totalPDFs}
                icon={FileText}
                trend="+15%"
                color="green"
              />
              <StatCard
                title="গ্যালারি ছবি"
                value={stats.totalGallery}
                icon={Image}
                trend="+20%"
                color="pink"
              />
              <StatCard
                title="লাইভ দর্শক"
                value={stats.liveViewers}
                icon={Radio}
                trend="Live"
                color="red"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">দ্রুত কার্যক্রম</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionButton
                  icon={Plus}
                  label="নতুন পূজা"
                  onClick={() => openModal('puja')}
                  color="orange"
                />
                <QuickActionButton
                  icon={Video}
                  label="লাইভ যোগ করুন"
                  onClick={() => openModal('live')}
                  color="red"
                />
                <QuickActionButton
                  icon={Music}
                  label="নতুন গান"
                  onClick={() => openModal('music')}
                  color="purple"
                />
                <QuickActionButton
                  icon={Bell}
                  label="ঘোষণা দিন"
                  onClick={() => openModal('announcement')}
                  color="blue"
                />
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">সাম্প্রতিক কার্যক্রম</h3>
              <div className="space-y-3">
                <ActivityItem
                  action="নতুন পূজা যোগ করা হয়েছে"
                  detail="দুর্গাপূজা ২০২৫"
                  time="৫ মিনিট আগে"
                  type="add"
                />
                <ActivityItem
                  action="গান আপডেট করা হয়েছে"
                  detail="আয় মা আমারে..."
                  time="১ ঘন্টা আগে"
                  type="update"
                />
                <ActivityItem
                  action="লাইভ সম্প্রচার শুরু"
                  detail="সন্ধ্যা আরতি"
                  time="২ ঘন্টা আগে"
                  type="live"
                />
                <ActivityItem
                  action="PDF ফাইল আপলোড"
                  detail="পূজা পদ্ধতি ২০২৫"
                  time="৩ ঘন্টা আগে"
                  type="file"
                />
              </div>
            </div>
          </div>
        );

      case 'puja':
        return <PujaManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'music':
        return <MusicManagement />;
      case 'pdf':
        return <PDFManagement />;
      case 'live':
        return <LiveTVManagement />;
      case 'announcements':
        return <AnnouncementManagement />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-orange-600">কলম হিন্দু ধর্মসভা</h1>
          <p className="text-sm text-gray-500 mt-1">অ্যাডমিন প্যানেল</p>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-semibold">
                {user?.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.role === 'admin' ? 'অ্যাডমিন' : 'মডারেটর'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {menuItems.find(item => item.id === activeTab)?.label}
          </h2>
          <p className="text-gray-500 mt-1">স্বাগতম, {user?.name}!</p>
        </div>

        {renderContent()}
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <AddModal
          type={modalType}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

// Sub-components
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ElementType;
  trend: string;
  color: string;
}> = ({ title, value, icon: Icon, trend, color }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    pink: 'bg-pink-50 text-pink-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <span className="text-sm text-green-600">{trend}</span>
        <span className="text-sm text-gray-400">গত মাস থেকে</span>
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  color: string;
}> = ({ icon: Icon, label, onClick, color }) => {
  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    red: 'bg-red-50 text-red-600 hover:bg-red-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${colorClasses[color]}`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

const ActivityItem: React.FC<{
  action: string;
  detail: string;
  time: string;
  type: string;
}> = ({ action, detail, time, type }) => {
  const typeColors: Record<string, string> = {
    add: 'bg-green-100 text-green-600',
    update: 'bg-blue-100 text-blue-600',
    live: 'bg-red-100 text-red-600',
    file: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${typeColors[type]}`} />
        <div>
          <p className="font-medium text-gray-800">{action}</p>
          <p className="text-sm text-gray-500">{detail}</p>
        </div>
      </div>
      <span className="text-sm text-gray-400">{time}</span>
    </div>
  );
};

// Management Components
const PujaManagement: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800">পূজা তালিকা</h3>
      <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all">
        <Plus className="w-4 h-4" />
        নতুন পূজা
      </button>
    </div>
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">পূজার নাম</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">তারিখ</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">সময়</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">অ্যাকশন</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        <tr>
          <td className="px-4 py-3">দুর্গাপূজা ২০২৫</td>
          <td className="px-4 py-3">১ অক্টোবর ২০২৫</td>
          <td className="px-4 py-3">সকাল ৮:০০</td>
          <td className="px-4 py-3 flex gap-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const GalleryManagement: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800">গ্যালারি</h3>
      <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all">
        <Plus className="w-4 h-4" />
        ছবি আপলোড
      </button>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="relative group">
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=300&h=300&fit=crop`}
              alt={`Gallery ${i}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button className="p-2 bg-white rounded-full"><Eye className="w-4 h-4" /></button>
            <button className="p-2 bg-white rounded-full"><Trash2 className="w-4 h-4 text-red-600" /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MusicManagement: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800">সঙ্গীত</h3>
      <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all">
        <Plus className="w-4 h-4" />
        নতুন গান
      </button>
    </div>
    <div className="space-y-3">
      {['আয় মা আমারে...', 'জয় দুর্গা মা...', 'শ্যামা সুন্দরী...'].map((song, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{song}</p>
              <p className="text-sm text-gray-500">ভজন • ৪:৩২</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PDFManagement: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800">PDF ফাইল</h3>
      <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all">
        <Plus className="w-4 h-4" />
        PDF আপলোড
      </button>
    </div>
    <div className="space-y-3">
      {['পূজা পদ্ধতি ২০২৫.pdf', 'মন্ত্র সংগ্রহ.pdf', 'অষ্টোত্তর শতনামাবলী.pdf'].map((file, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <FileText className="w-10 h-10 text-red-500" />
            <div>
              <p className="font-medium text-gray-800">{file}</p>
              <p className="text-sm text-gray-500">২.৫ MB • ১২৩ ডাউনলোড</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-green-600 hover:bg-green-50 rounded"><Download className="w-4 h-4" /></button>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LiveTVManagement: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800">লাইভ TV চ্যানেল</h3>
      <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all">
        <Plus className="w-4 h-4" />
        চ্যানেল যোগ করুন
      </button>
    </div>
    <div className="space-y-3">
      {[
        { name: 'সন্ধ্যা আরতি', type: 'M3U8', status: 'Live', viewers: 342 },
        { name: 'সকালের পূজা', type: 'Facebook Live', status: 'Offline', viewers: 0 },
        { name: 'ভজন সংধ্যা', type: 'M3U', status: 'Scheduled', viewers: 0 },
      ].map((channel, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              channel.status === 'Live' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <Tv className={`w-6 h-6 ${channel.status === 'Live' ? 'text-red-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <p className="font-medium text-gray-800">{channel.name}</p>
              <p className="text-sm text-gray-500">{channel.type} • {channel.viewers} দর্শক</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              channel.status === 'Live'
                ? 'bg-red-100 text-red-600'
                : channel.status === 'Offline'
                ? 'bg-gray-100 text-gray-600'
                : 'bg-yellow-100 text-yellow-600'
            }`}>
              {channel.status}
            </span>
            <div className="flex gap-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnnouncementManagement: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800">ঘোষণা</h3>
      <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all">
        <Plus className="w-4 h-4" />
        নতুন ঘোষণা
      </button>
    </div>
    <div className="space-y-3">
      {[
        { title: 'দুর্গাপূজা ২০২৫ তারিখ ঘোষণা', priority: 'High', date: '১৫ জানুয়ারি ২০২৫' },
        { title: 'শ্যামাপূজা অনলাইন নিবন্ধন শুরু', priority: 'Medium', date: '১০ জানুয়ারি ২০২৫' },
      ].map((announcement, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">{announcement.title}</p>
            <p className="text-sm text-gray-500">{announcement.date}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              announcement.priority === 'High'
                ? 'bg-red-100 text-red-600'
                : 'bg-yellow-100 text-yellow-600'
            }`}>
              {announcement.priority}
            </span>
            <div className="flex gap-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UserManagement: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800">ব্যবহারকারী</h3>
      <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all">
        <Plus className="w-4 h-4" />
        নতুন ব্যবহারকারী
      </button>
    </div>
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">নাম</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ইমেইল</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ভূমিকা</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">অ্যাকশন</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        <tr>
          <td className="px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold">
              A
            </div>
            Administrator
          </td>
          <td className="px-4 py-3">admin@kolomhindu.com</td>
          <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm">Admin</span></td>
          <td className="px-4 py-3 flex gap-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const SettingsManagement: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-6">সেটিংস</h3>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ওয়েবসাইটের নাম</label>
        <input type="text" defaultValue="কলম হিন্দু ধর্মসভা" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">যোগাযোগ ইমেইল</label>
        <input type="email" defaultValue="contact@kolomhindu.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ফোন নম্বর</label>
        <input type="tel" defaultValue="+৮৮০ ১৭১২-৩৪৫৬৭৮" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
      </div>
      <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all">
        পরিবর্তন সংরক্ষণ করুন
      </button>
    </div>
  </div>
);

const AddModal: React.FC<{ type: string; onClose: () => void }> = ({ type, onClose }) => {
  const titles: Record<string, string> = {
    puja: 'নতুন পূজা যোগ করুন',
    live: 'লাইভ চ্যানেল যোগ করুন',
    music: 'নতুন গান যোগ করুন',
    announcement: 'নতুন ঘোষণা দিন',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{titles[type] || 'নতুন যোগ করুন'}</h3>
        <div className="space-y-4">
          <input type="text" placeholder="শিরোনাম" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {type === 'live' && (
            <>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="">স্ট্রিম টাইপ নির্বাচন করুন</option>
                <option value="m3u8">M3U8 Stream</option>
                <option value="m3u">M3U Playlist</option>
                <option value="facebook">Facebook Live</option>
                <option value="youtube">YouTube Live</option>
              </select>
              <input type="url" placeholder="স্ট্রিম URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </>
          )}
          {type === 'music' && (
            <input type="file" accept="audio/*" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            বাতিল
          </button>
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            সংরক্ষণ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
