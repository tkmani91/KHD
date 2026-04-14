import { useState, useEffect, useMemo } from 'react';

// ============ টাইপ ডেফিনিশন ============
interface EkadashiEntry {
  id: number;
  serialBn: string;
  bengaliDate: string;
  englishDate: string;
  displayDate: string;
  day: string;
  vratName: string;
  paranTime: string;
}

interface EkadashiData {
  year: string;
  title: string;
  entries: EkadashiEntry[];
}

// ============ স্ট্যাটাস নির্ণয় ============
type EntryStatus = 'passed' | 'upcoming' | 'future';

const getStatus = (dateStr: string): EntryStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const entryDate = new Date(dateStr);
  entryDate.setHours(0, 0, 0, 0);

  if (entryDate < today) return 'passed';

  // আগামী একাদশী খুঁজে বের করার জন্য এটা পরে ব্যবহার হবে
  return 'future';
};

const findUpcomingIndex = (entries: EkadashiEntry[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < entries.length; i++) {
    const entryDate = new Date(entries[i].englishDate);
    entryDate.setHours(0, 0, 0, 0);
    if (entryDate >= today) return i;
  }
  return -1;
};

// ============ স্ট্যাটাস অনুযায়ী স্টাইল ============
const getStatusStyles = (status: EntryStatus) => {
  switch (status) {
    case 'passed':
      return {
        row: 'bg-red-50 border-l-4 border-red-400',
        serial: 'bg-red-500 text-white',
        text: 'text-red-600 line-through opacity-70',
        dateText: 'text-red-400',
        vratText: 'text-red-500 font-semibold',
        paranText: 'text-red-400',
        badge: 'bg-red-100 text-red-600 border border-red-200',
        badgeLabel: 'সময় শেষ',
        icon: '🔴'
      };
    case 'upcoming':
      return {
        row: 'bg-green-50 border-l-4 border-green-500 shadow-lg shadow-green-100 ring-2 ring-green-200',
        serial: 'bg-green-500 text-white animate-pulse',
        text: 'text-green-700 font-bold',
        dateText: 'text-green-600 font-semibold',
        vratText: 'text-green-700 font-bold text-lg',
        paranText: 'text-green-600 font-semibold',
        badge: 'bg-green-100 text-green-700 border border-green-300',
        badgeLabel: '⏭️ আসন্ন',
        icon: '🟢'
      };
    case 'future':
      return {
        row: 'bg-white border-l-4 border-gray-200 hover:bg-gray-50',
        serial: 'bg-gray-700 text-white',
        text: 'text-gray-800',
        dateText: 'text-gray-600',
        vratText: 'text-gray-800 font-semibold',
        paranText: 'text-gray-500',
        badge: 'bg-gray-100 text-gray-600 border border-gray-200',
        badgeLabel: 'আসছে',
        icon: '⚫'
      };
  }
};

// ============ দিন গণনা ============
const getDaysRemaining = (dateStr: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'আজ!';
  if (diffDays === 1) return 'আগামীকাল';
  if (diffDays > 1) return `আর ${diffDays} দিন`;
  return `${Math.abs(diffDays)} দিন আগে`;
};

// ============ মূল কম্পোনেন্ট ============
const EkadashiList = () => {
  const [data, setData] = useState<EkadashiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'passed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ডেটা লোড
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/ekadashi.json');
        if (!response.ok) throw new Error('ডেটা লোড করতে সমস্যা হয়েছে');
        const jsonData: EkadashiData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'অজানা সমস্যা');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // আসন্ন একাদশী ইনডেক্স
  const upcomingIndex = useMemo(() => {
    if (!data) return -1;
    return findUpcomingIndex(data.entries);
  }, [data]);

  // প্রতিটি এন্ট্রির স্ট্যাটাস নির্ণয়
  const getEntryStatus = (entry: EkadashiEntry, index: number): EntryStatus => {
    if (index === upcomingIndex) return 'upcoming';
    const status = getStatus(entry.englishDate);
    if (status === 'passed') return 'passed';
    return 'future';
  };

  // ফিল্টার ও সার্চ
  const filteredEntries = useMemo(() => {
    if (!data) return [];

    let entries = data.entries.map((entry, index) => ({
      ...entry,
      status: getEntryStatus(entry, index)
    }));

    // ফিল্টার
    if (filter === 'upcoming') {
      entries = entries.filter(e => e.status === 'upcoming' || e.status === 'future');
    } else if (filter === 'passed') {
      entries = entries.filter(e => e.status === 'passed');
    }

    // সার্চ
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      entries = entries.filter(e =>
        e.vratName.toLowerCase().includes(term) ||
        e.displayDate.includes(term) ||
        e.bengaliDate.includes(term) ||
        e.day.includes(term)
      );
    }

    return entries;
  }, [data, filter, searchTerm, upcomingIndex]);

  // পরিসংখ্যান
  const stats = useMemo(() => {
    if (!data) return { total: 0, passed: 0, remaining: 0 };
    const passed = data.entries.filter((_, i) => {
      const s = getEntryStatus(data.entries[i], i);
      return s === 'passed';
    }).length;
    return {
      total: data.entries.length,
      passed,
      remaining: data.entries.length - passed
    };
  }, [data, upcomingIndex]);

  // আসন্ন একাদশীতে স্ক্রল
  useEffect(() => {
    if (!loading && upcomingIndex >= 0) {
      setTimeout(() => {
        const el = document.getElementById(`ekadashi-${upcomingIndex}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [loading, upcomingIndex]);

  // ============ লোডিং ============
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500 mx-auto"></div>
            <span className="absolute inset-0 flex items-center justify-center text-3xl">🙏</span>
          </div>
          <p className="mt-4 text-orange-700 font-medium text-lg">একাদশী তালিকা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // ============ এরর ============
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-xl font-bold text-red-600 mt-4">ডেটা লোড করা যায়নি</h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* ============ হেডার ============ */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* শিরোনাম */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl">🙏</span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
                একাদশী তালিকা
              </h1>
              <span className="text-4xl">🙏</span>
            </div>
            <p className="text-orange-100 text-lg mt-1">{data.year}</p>
            <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mt-3"></div>
          </div>

          {/* পরিসংখ্যান কার্ড */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-orange-100">মোট ব্রত/তিথি</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-200">{stats.passed}</p>
              <p className="text-xs text-orange-100">সময় গেছে</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-200">{stats.remaining}</p>
              <p className="text-xs text-orange-100">বাকি আছে</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* ============ আসন্ন একাদশী হাইলাইট ============ */}
        {upcomingIndex >= 0 && (
          <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-5 text-white shadow-xl shadow-green-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl animate-bounce">⏭️</span>
              <h2 className="text-lg font-bold">আসন্ন একাদশী / ব্রত</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-xl font-bold">
                {data.entries[upcomingIndex].vratName}
              </h3>
              <div className="flex flex-wrap gap-4 mt-2 text-green-50">
                <span>📅 {data.entries[upcomingIndex].displayDate}</span>
                <span>📆 {data.entries[upcomingIndex].day}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-1 text-green-50">
                <span>🕐 পারণ: {data.entries[upcomingIndex].paranTime}</span>
                <span className="bg-white/25 px-3 py-1 rounded-full text-sm font-semibold">
                  {getDaysRemaining(data.entries[upcomingIndex].englishDate)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============ ফিল্টার ও সার্চ ============ */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* সার্চ */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="🔍 একাদশী খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none bg-white text-gray-700 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* ফিল্টার বাটন */}
          <div className="flex gap-2">
            {[
              { key: 'all' as const, label: 'সবগুলো', icon: '📋' },
              { key: 'upcoming' as const, label: 'আসন্ন', icon: '🟢' },
              { key: 'passed' as const, label: 'শেষ', icon: '🔴' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f.key
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105'
                    : 'bg-white text-gray-600 border-2 border-orange-200 hover:bg-orange-50'
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ============ রঙের ব্যাখ্যা ============ */}
        <div className="flex flex-wrap gap-4 mb-6 bg-white rounded-xl p-4 shadow-sm border border-orange-100">
          <span className="text-sm text-gray-500 font-medium">রঙের অর্থ:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm text-red-600">সময় শেষ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm text-green-600 font-semibold">আসন্ন</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-700"></span>
            <span className="text-sm text-gray-600">আসছে</span>
          </div>
        </div>

        {/* ============ তালিকা ============ */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <span className="text-5xl">🔍</span>
            <p className="text-gray-500 mt-3 text-lg">কোনো একাদশী পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry, idx) => {
              const styles = getStatusStyles(entry.status);
              const isUpcoming = entry.status === 'upcoming';

              return (
                <div
                  key={entry.id}
                  id={`ekadashi-${data.entries.findIndex(e => e.id === entry.id)}`}
                  className={`
                    rounded-xl overflow-hidden transition-all duration-300
                    ${styles.row}
                    ${isUpcoming ? 'transform scale-[1.02]' : 'hover:shadow-md'}
                  `}
                >
                  <div className="p-4">
                    {/* উপরের সারি — ক্রম ও স্ট্যাটাস */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* ক্রম নম্বর */}
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          text-sm font-bold ${styles.serial}
                        `}>
                          {entry.serialBn}
                        </div>

                        {/* বাংলা তারিখ */}
                        <div>
                          <span className={`text-sm ${styles.dateText}`}>
                            {entry.bengaliDate}
                          </span>
                          <span className={`block text-xs ${styles.dateText} opacity-75`}>
                            {entry.displayDate}
                          </span>
                        </div>
                      </div>

                      {/* স্ট্যাটাস ব্যাজ */}
                      <div className="flex items-center gap-2">
                        <span className={`
                          text-xs px-3 py-1 rounded-full font-medium
                          ${styles.badge}
                        `}>
                          {isUpcoming
                            ? getDaysRemaining(entry.englishDate)
                            : styles.badgeLabel
                          }
                        </span>
                      </div>
                    </div>

                    {/* মূল তথ্য */}
                    <div className="ml-13 pl-0 sm:pl-13">
                      {/* ব্রতের নাম */}
                      <h3 className={`${styles.vratText} mb-2`}>
                        {styles.icon} {entry.vratName}
                      </h3>

                      {/* বিবরণ সারি */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span className={`text-sm flex items-center gap-1 ${styles.dateText}`}>
                          📆 {entry.day}
                        </span>
                        <span className={`text-sm flex items-center gap-1 ${styles.paranText}`}>
                          🕐 পারণ: <strong>{entry.paranTime}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* আসন্ন একাদশী — বিশেষ ফুটার */}
                  {isUpcoming && (
                    <div className="bg-green-100 px-4 py-2 flex items-center justify-center gap-2">
                      <span className="animate-pulse text-green-600">●</span>
                      <span className="text-sm font-semibold text-green-700">
                        এটি আপনার পরবর্তী একাদশী / ব্রত
                      </span>
                      <span className="animate-pulse text-green-600">●</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ============ ফুটার ============ */}
        <div className="mt-8 text-center bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <p className="text-orange-600 font-medium">🙏 হরে কৃষ্ণ 🙏</p>
          <p className="text-gray-400 text-sm mt-2">
            সকল তথ্য পঞ্জিকা অনুসারে সংকলিত। পারণের সময় স্থানভেদে পরিবর্তন হতে পারে।
          </p>
        </div>

        {/* নিচে ফাঁকা জায়গা */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default EkadashiList;
