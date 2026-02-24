import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Users, 
  Calendar, 
  Music, 
  FileText, 
  Image as ImageIcon, 
  Tv, 
  Bell,
  Plus,
  Trash2,
  Edit,
  Save
} from 'lucide-react';

interface PujaDate {
  id: number;
  name: string;
  date: string;
  time: string;
  type: string;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
}

interface PDF {
  id: number;
  title: string;
  url: string;
}

interface GalleryItem {
  id: number;
  year: string;
  puja: string;
  image: string;
}

interface LiveTVChannel {
  id: number;
  name: string;
  url: string;
  type: string;
}

interface Announcement {
  id: number;
  text: string;
  active: boolean;
}

interface DashboardData {
  pujaDates: PujaDate[];
  songs: Song[];
  pdfs: PDF[];
  gallery: GalleryItem[];
  liveTV: LiveTVChannel[];
  announcements: Announcement[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<DashboardData>({
    pujaDates: [],
    songs: [],
    pdfs: [],
    gallery: [],
    liveTV: [],
    announcements: []
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('kollamHinduData');
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      // Initialize with default data
      const defaultData: DashboardData = {
        pujaDates: [
          { id: 1, name: 'দুর্গাপূজা ২০২৪', date: '২০২৪-১০-০৯', time: 'সকাল ৮:০০', type: 'durga' },
          { id: 2, name: 'শ্যামাপূজা ২০২৪', date: '২০২৪-১১-০১', time: 'রাত ১০:০০', type: 'shyama' },
        ],
        songs: [
          { id: 1, title: 'অমর শ্যামা গান ১', artist: 'আরতী', url: 'https://example.com/song1.mp3' },
        ],
        pdfs: [
          { id: 1, title: 'দুর্গাপূজা গাইড ২০২৪', url: 'https://example.com/guide.pdf' },
        ],
        gallery: [
          { id: 1, year: '২০২৪', puja: 'দুর্গাপূজা', image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400' },
        ],
        liveTV: [
          { id: 1, name: 'সনাতন টিভি', url: 'https://example.com/stream.m3u8', type: 'm3u8' },
        ],
        announcements: [
          { id: 1, text: 'স্বাগতম কলম হিন্দু ধর্মসভায়!', active: true },
        ]
      };
      setData(defaultData);
      localStorage.setItem('kollamHinduData', JSON.stringify(defaultData));
    }
  }, []);

  // Save data to localStorage
  const saveData = (newData: DashboardData) => {
    setData(newData);
    localStorage.setItem('kollamHinduData', JSON.stringify(newData));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/login');
  };

  // Add new item
  const addItem = <K extends keyof DashboardData>(section: K, item: Omit<DashboardData[K][number], 'id'>) => {
    const newData = { ...data };
    const items = newData[section];
    const newId = items.length > 0 ? Math.max(...items.map((i: any) => i.id)) + 1 : 1;
    (newData[section] as any[]) = [...items, { ...item, id: newId }];
    saveData(newData);
  };

  // Delete item
  const deleteItem = <K extends keyof DashboardData>(section: K, id: number) => {
    const newData = { ...data };
    (newData[section] as any[]) = (newData[section] as any[]).filter((item: any) => item.id !== id);
    saveData(newData);
  };

  // Update item
  const updateItem = <K extends keyof DashboardData>(section: K, id: number, updates: Partial<DashboardData[K][number]>) => {
    const newData = { ...data };
    (newData[section] as any[]) = (newData[section] as any[]).map((item: any) => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveData(newData);
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">মোট পূজা তারিখ</p>
            <p className="text-3xl font-bold text-orange-600">{data.pujaDates.length}</p>
          </div>
          <Calendar className="w-12 h-12 text-orange-200" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">মোট গান</p>
            <p className="text-3xl font-bold text-orange-600">{data.songs.length}</p>
          </div>
          <Music className="w-12 h-12 text-orange-200" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">মোট PDF</p>
            <p className="text-3xl font-bold text-orange-600">{data.pdfs.length}</p>
          </div>
          <FileText className="w-12 h-12 text-orange-200" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">গ্যালারি ছবি</p>
            <p className="text-3xl font-bold text-orange-600">{data.gallery.length}</p>
          </div>
          <ImageIcon className="w-12 h-12 text-orange-200" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">লাইভ TV চ্যানেল</p>
            <p className="text-3xl font-bold text-orange-600">{data.liveTV.length}</p>
          </div>
          <Tv className="w-12 h-12 text-orange-200" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">ঘোষণা</p>
            <p className="text-3xl font-bold text-orange-600">{data.announcements.length}</p>
          </div>
          <Bell className="w-12 h-12 text-orange-200" />
        </div>
      </div>
    </div>
  );

  const renderPujaDates = () => {
    const [editing, setEditing] = useState<number | null>(null);
    const [newPuja, setNewPuja] = useState({ name: '', date: '', time: '', type: 'durga' });

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">পূজা তারিখ ব্যবস্থাপনা</h3>
        
        {/* Add New */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-orange-50 rounded-lg">
          <input
            type="text"
            placeholder="পূজার নাম"
            value={newPuja.name}
            onChange={(e) => setNewPuja({...newPuja, name: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={newPuja.date}
            onChange={(e) => setNewPuja({...newPuja, date: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="সময়"
            value={newPuja.time}
            onChange={(e) => setNewPuja({...newPuja, time: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          />
          <select
            value={newPuja.type}
            onChange={(e) => setNewPuja({...newPuja, type: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="durga">দুর্গাপূজা</option>
            <option value="shyama">শ্যামাপূজা</option>
            <option value="saraswati">সরস্বতী পূজা</option>
          </select>
          <button
            onClick={() => {
              if (newPuja.name && newPuja.date) {
                addItem('pujaDates', newPuja);
                setNewPuja({ name: '', date: '', time: '', type: 'durga' });
              }
            }}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> যোগ করুন
          </button>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-100">
              <tr>
                <th className="px-4 py-2 text-left">নাম</th>
                <th className="px-4 py-2 text-left">তারিখ</th>
                <th className="px-4 py-2 text-left">সময়</th>
                <th className="px-4 py-2 text-left">ধরন</th>
                <th className="px-4 py-2 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {data.pujaDates.map((puja) => (
                <tr key={puja.id} className="border-b">
                  {editing === puja.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          defaultValue={puja.name}
                          onBlur={(e) => updateItem('pujaDates', puja.id, { name: e.target.value })}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          defaultValue={puja.date}
                          onBlur={(e) => updateItem('pujaDates', puja.id, { date: e.target.value })}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          defaultValue={puja.time}
                          onBlur={(e) => updateItem('pujaDates', puja.id, { time: e.target.value })}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          defaultValue={puja.type}
                          onChange={(e) => updateItem('pujaDates', puja.id, { type: e.target.value })}
                          className="w-full px-2 py-1 border rounded"
                        >
                          <option value="durga">দুর্গাপূজা</option>
                          <option value="shyama">শ্যামাপূজা</option>
                          <option value="saraswati">সরস্বতী পূজা</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => setEditing(null)} className="text-green-600 hover:text-green-800">
                          <Save className="w-5 h-5" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{puja.name}</td>
                      <td className="px-4 py-2">{puja.date}</td>
                      <td className="px-4 py-2">{puja.time}</td>
                      <td className="px-4 py-2">{puja.type}</td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => setEditing(puja.id)} className="text-blue-600 hover:text-blue-800 mr-2">
                          <Edit className="w-5 h-5 inline" />
                        </button>
                        <button onClick={() => deleteItem('pujaDates', puja.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSongs = () => {
    const [newSong, setNewSong] = useState({ title: '', artist: '', url: '' });

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">গান ব্যবস্থাপনা</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-orange-50 rounded-lg">
          <input
            type="text"
            placeholder="গানের শিরোনাম"
            value={newSong.title}
            onChange={(e) => setNewSong({...newSong, title: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="শিল্পী"
            value={newSong.artist}
            onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="অডিও URL"
            value={newSong.url}
            onChange={(e) => setNewSong({...newSong, url: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          />
          <button
            onClick={() => {
              if (newSong.title && newSong.url) {
                addItem('songs', newSong);
                setNewSong({ title: '', artist: '', url: '' });
              }
            }}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> যোগ করুন
          </button>
        </div>

        <div className="space-y-2">
          {data.songs.map((song) => (
            <div key={song.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">{song.title}</p>
                <p className="text-sm text-gray-600">{song.artist}</p>
              </div>
              <button
                onClick={() => deleteItem('songs', song.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLiveTV = () => {
    const [newChannel, setNewChannel] = useState({ name: '', url: '', type: 'm3u8' });

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">লাইভ TV ব্যবস্থাপনা</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-orange-50 rounded-lg">
          <input
            type="text"
            placeholder="চ্যানেলের নাম"
            value={newChannel.name}
            onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="স্ট্রিম URL"
            value={newChannel.url}
            onChange={(e) => setNewChannel({...newChannel, url: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          />
          <select
            value={newChannel.type}
            onChange={(e) => setNewChannel({...newChannel, type: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="m3u8">M3U8 Stream</option>
            <option value="m3u">M3U Playlist</option>
            <option value="facebook">Facebook Live</option>
            <option value="youtube">YouTube Live</option>
            <option value="mp4">MP4 Video</option>
          </select>
          <button
            onClick={() => {
              if (newChannel.name && newChannel.url) {
                addItem('liveTV', newChannel);
                setNewChannel({ name: '', url: '', type: 'm3u8' });
              }
            }}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> যোগ করুন
          </button>
        </div>

        <div className="space-y-2">
          {data.liveTV.map((channel) => (
            <div key={channel.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">{channel.name}</p>
                <p className="text-sm text-gray-600">{channel.type.toUpperCase()}</p>
                <p className="text-xs text-gray-500 truncate max-w-md">{channel.url}</p>
              </div>
              <button
                onClick={() => deleteItem('liveTV', channel.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAnnouncements = () => {
    const [newAnnouncement, setNewAnnouncement] = useState('');

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">ঘোষণা ব্যবস্থাপনা</h3>
        
        <div className="flex gap-4 mb-6 p-4 bg-orange-50 rounded-lg">
          <input
            type="text"
            placeholder="নতুন ঘোষণা লিখুন"
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            onClick={() => {
              if (newAnnouncement) {
                addItem('announcements', { text: newAnnouncement, active: true });
                setNewAnnouncement('');
              }
            }}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> যোগ করুন
          </button>
        </div>

        <div className="space-y-2">
          {data.announcements.map((announcement) => (
            <div key={announcement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <p className="flex-1">{announcement.text}</p>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={announcement.active}
                    onChange={(e) => updateItem('announcements', announcement.id, { active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">সক্রিয়</span>
                </label>
                <button
                  onClick={() => deleteItem('announcements', announcement.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <h1 className="text-2xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            লগআউট
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-md overflow-hidden">
              {[
                { id: 'overview', label: 'ওভারভিউ', icon: Users },
                { id: 'puja', label: 'পূজা তারিখ', icon: Calendar },
                { id: 'songs', label: 'গান', icon: Music },
                { id: 'pdfs', label: 'PDF ফাইল', icon: FileText },
                { id: 'gallery', label: 'গ্যালারি', icon: ImageIcon },
                { id: 'livetv', label: 'লাইভ TV', icon: Tv },
                { id: 'announcements', label: 'ঘোষণা', icon: Bell },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'puja' && renderPujaDates()}
            {activeTab === 'songs' && renderSongs()}
            {activeTab === 'pdfs' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">PDF ব্যবস্থাপনা</h3>
                <p className="text-gray-600">PDF ফাইল যোগ করার ফিচার শীঘ্রই আসছে...</p>
              </div>
            )}
            {activeTab === 'gallery' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">গ্যালারি ব্যবস্থাপনা</h3>
                <p className="text-gray-600">গ্যালারি ব্যবস্থাপনা ফিচার শীঘ্রই আসছে...</p>
              </div>
            )}
            {activeTab === 'livetv' && renderLiveTV()}
            {activeTab === 'announcements' && renderAnnouncements()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;