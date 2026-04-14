import { useState, useEffect, useMemo } from 'react';
import { Search, X, Printer } from 'lucide-react';

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

type EntryStatus = 'passed' | 'upcoming' | 'future';

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

const getDaysRemaining = (dateStr: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'আজ!';
  if (diffDays === 1) return 'আগামীকাল';
  if (diffDays > 1) return `আর ${diffDays} দিন`;
  return `${Math.abs(diffDays)} দিন আগে`;
};

const STATUS_CONFIG = {
  passed: {
    row: 'bg-red-50 border-b border-red-200',
    serial: 'bg-red-500 text-white',
    text: 'text-red-600 line-through opacity-70',
    date: 'text-red-400',
    paran: 'text-red-400',
    badge: 'bg-red-100 text-red-600 border border-red-200',
    badgeLabel: 'সময় শেষ',
    icon: '🔴',
    bar: '',
  },
  upcoming: {
    row: 'bg-green-50 border-b-2 border-green-400 shadow-[0_0_0_2px_#bbf7d0]',
    serial: 'bg-green-500 text-white',
    text: 'text-green-700 font-bold',
    date: 'text-green-600 font-semibold',
    paran: 'text-green-600 font-semibold',
    badge: 'bg-green-100 text-green-700 border border-green-300',
    badgeLabel: 'আসন্ন',
    icon: '🟢',
    bar: 'absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r',
  },
  future: {
    row: 'bg-white border-b border-gray-100',
    serial: 'bg-gray-700 text-white',
    text: 'text-gray-800',
    date: 'text-gray-500',
    paran: 'text-gray-500',
    badge: 'bg-gray-100 text-gray-500 border border-gray-200',
    badgeLabel: 'আসছে',
    icon: '⚫',
    bar: '',
  },
};

const EkadashiList = () => {
  const [data, setData] = useState<EkadashiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'passed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/data/ekadashi.json')
      .then(res => { if (!res.ok) throw new Error('ডেটা লোড করতে সমস্যা'); return res.json(); })
      .then((json: EkadashiData) => setData(json))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const upcomingIndex = useMemo(() =>
    data ? findUpcomingIndex(data.entries) : -1, [data]);

  const getStatus = (index: number): EntryStatus => {
    if (index === upcomingIndex) return 'upcoming';
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const d = new Date(data!.entries[index].englishDate); d.setHours(0, 0, 0, 0);
    return d < today ? 'passed' : 'future';
  };

  const filteredEntries = useMemo(() => {
    if (!data) return [];
    let entries = data.entries.map((e, i) => ({ ...e, status: getStatus(i) }));
    if (filter === 'upcoming') entries = entries.filter(e => e.status !== 'passed');
    else if (filter === 'passed') entries = entries.filter(e => e.status === 'passed');
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      entries = entries.filter(e =>
        e.vratName.toLowerCase().includes(t) ||
        e.displayDate.includes(t) ||
        e.bengaliDate.includes(t) ||
        e.day.includes(t)
      );
    }
    return entries;
  }, [data, filter, searchTerm, upcomingIndex]);

  const stats = useMemo(() => {
    if (!data) return { total: 0, passed: 0, remaining: 0 };
    const passed = data.entries.filter((_, i) => getStatus(i) === 'passed').length;
    return { total: data.entries.length, passed, remaining: data.entries.length - passed };
  }, [data, upcomingIndex]);

  useEffect(() => {
    if (!loading && upcomingIndex >= 0) {
      setTimeout(() => {
        document.getElementById(`ekadashi-${upcomingIndex}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [loading, upcomingIndex]);

  const handlePrint = () => {
    const orig = document.title;
    document.title = 'একাদশী-তালিকা-কলম-হিন্দু-ধর্মসভা';
    window.print();
    setTimeout(() => { document.title = orig; }, 1000);
  };

  // ── Loading ──
  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-3">🙏</div>
        <p className="text-orange-600 font-semibold">একাদশী তালিকা লোড হচ্ছে...</p>
      </div>
    </div>
  );

  // ── Error ──
  if (error || !data) return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-lg">
        <div className="text-5xl mb-3">⚠️</div>
        <h2 className="text-red-600 font-bold text-lg">ডেটা লোড করা যায়নি</h2>
        <p className="text-gray-500 text-sm mt-2">{error}</p>
        <button onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 active:scale-95 transition">
          পুনরায় চেষ্টা করুন
        </button>
      </div>
    </div>
  );

  const upcoming = upcomingIndex >= 0 ? data.entries[upcomingIndex] : null;

  return (
    <div className="bg-[#fffbf5] min-h-screen font-inherit">

      {/* ── Print Styles ── */}
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-header { background: linear-gradient(135deg, #ea580c, #f59e0b) !important; color: white !important; padding: 10px 16px; border-radius: 8px; margin-bottom: 10px; text-align: center; }
          .print-header h1 { font-size: 16px; font-weight: 800; margin: 0; }
          .print-header p { font-size: 11px; margin: 3px 0 0; opacity: 0.9; }
          .print-table { width: 100%; border-collapse: collapse; font-size: 10px; }
          .print-table th { background: #1f2937 !important; color: white !important; padding: 5px 6px; font-size: 10px; border: 1px solid #374151; }
          .print-table td { padding: 4px 6px; border: 1px solid #e5e7eb; font-size: 10px; vertical-align: middle; }
          .print-table tr.passed td { background: #fff5f5 !important; color: #dc2626; text-decoration: line-through; opacity: 0.7; }
          .print-table tr.upcoming td { background: #f0fdf4 !important; color: #15803d; font-weight: 700; }
          .print-table tr:nth-child(even):not(.passed):not(.upcoming) td { background: #f9fafb !important; }
          .print-badge { padding: 1px 6px; border-radius: 10px; font-size: 9px; font-weight: 700; }
          .print-badge.passed { background: #fee2e2 !important; color: #dc2626 !important; }
          .print-badge.upcoming { background: #dcfce7 !important; color: #15803d !important; }
          .print-badge.future { background: #f3f4f6 !important; color: #4b5563 !important; }
          .print-footer { margin-top: 12px; text-align: center; font-size: 10px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 8px; }
          @page { size: A4 portrait; margin: 8mm; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
        }
        .print-only { display: none; }
      `}</style>

      {/* ── Print Area ── */}
      <div className="print-area">
        <div className="print-only">
          <div className="print-header">
            <h1>🙏 একাদশী তালিকা - {data.year} 🙏</h1>
            <p>কলম হিন্দু ধর্মসভা | মোট: {stats.total} | শেষ: {stats.passed} | বাকি: {stats.remaining}</p>
          </div>
          <table className="print-table">
            <thead>
              <tr>
                <th style={{width:'5%'}}>ক্রঃ</th>
                <th style={{width:'14%'}}>বাংলা তারিখ</th>
                <th style={{width:'14%'}}>ইং তারিখ</th>
                <th style={{width:'8%'}}>বার</th>
                <th style={{width:'35%'}}>ব্রতের নাম</th>
                <th style={{width:'18%'}}>পারণের সময়</th>
                <th style={{width:'6%'}}>অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, idx) => (
                <tr key={entry.id} className={entry.status}>
                  <td style={{textAlign:'center', fontWeight:700}}>{entry.serialBn}</td>
                  <td>{entry.bengaliDate}</td>
                  <td>{entry.displayDate}</td>
                  <td>{entry.day}</td>
                  <td style={{fontWeight: entry.status === 'upcoming' ? 700 : 400}}>
                    {STATUS_CONFIG[entry.status].icon} {entry.vratName}
                  </td>
                  <td>🕐 {entry.paranTime}</td>
                  <td style={{textAlign:'center'}}>
                    <span className={`print-badge ${entry.status}`}>
                      {entry.status === 'upcoming' ? getDaysRemaining(entry.englishDate) : STATUS_CONFIG[entry.status].badgeLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="print-footer">
            <p>🙏 হরে কৃষ্ণ 🙏 | সকল তথ্য পঞ্জিকা অনুসারে | প্রিন্টের তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white px-4 py-5 md:py-6 no-print">
        <div className="max-w-4xl mx-auto">
          {/* Title + Print */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black tracking-wide">🙏 একাদশী তালিকা 🙏</h1>
              <p className="text-orange-100 text-xs md:text-sm mt-0.5">{data.year}</p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs md:text-sm font-semibold active:scale-95 transition backdrop-blur-sm border border-white/20"
            >
              <Printer className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">প্রিন্ট</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {[
              { label: 'মোট', value: stats.total, color: 'text-white' },
              { label: 'শেষ', value: stats.passed, color: 'text-red-200' },
              { label: 'বাকি', value: stats.remaining, color: 'text-green-200' },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl py-2.5 text-center border border-white/10">
                <div className={`text-xl md:text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[11px] md:text-xs text-orange-100 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 md:px-4 py-3 md:py-4 no-print">

        {/* ── আসন্ন একাদশী Card ── */}
        {upcoming && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl md:rounded-2xl p-3.5 md:p-5 text-white mb-3 md:mb-4 shadow-lg shadow-green-200">
            <p className="text-[11px] md:text-sm font-bold opacity-90 mb-2">⏭️ আসন্ন একাদশী / ব্রত</p>
            <div className="bg-white/15 rounded-lg md:rounded-xl p-3 md:p-4">
              <h3 className="font-black text-base md:text-xl mb-2">{upcoming.vratName}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs md:text-sm opacity-90">
                <span>📅 {upcoming.displayDate}</span>
                <span>📆 {upcoming.day}</span>
                <span>🕐 পারণ: {upcoming.paranTime}</span>
                <span className="bg-white/25 px-2.5 py-0.5 rounded-full font-bold text-xs">
                  {getDaysRemaining(upcoming.englishDate)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Search + Filter ── */}
        <div className="space-y-2 mb-3 md:mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
            <input
              type="text"
              placeholder="একাদশী খুঁজুন..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border-2 border-orange-200 focus:border-orange-400 outline-none text-sm bg-white"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {([
              { key: 'all', label: '📋 সব', count: data.entries.length },
              { key: 'upcoming', label: '🟢 আসন্ন', count: stats.remaining },
              { key: 'passed', label: '🔴 শেষ', count: stats.passed },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex-1 py-2 px-2 md:px-4 rounded-lg text-xs md:text-sm font-semibold border-2 transition active:scale-95 ${
                  filter === f.key
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white border-orange-200 text-gray-600 hover:border-orange-300'
                }`}
              >
                {f.label}
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  filter === f.key ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Color Legend ── */}
        <div className="bg-white rounded-lg px-3 py-2 mb-3 border border-orange-100 flex flex-wrap gap-3 items-center">
          <span className="text-[11px] text-gray-500 font-semibold">রঙের অর্থ:</span>
          {[
            { color: 'bg-red-500', label: 'সময় শেষ', text: 'text-red-600' },
            { color: 'bg-green-500', label: 'আসন্ন', text: 'text-green-600' },
            { color: 'bg-gray-700', label: 'আসছে', text: 'text-gray-600' },
          ].map(c => (
            <div key={c.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
              <span className={`text-[11px] font-semibold ${c.text}`}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* ── List ── */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-gray-500 text-sm">কোনো একাদশী পাওয়া যায়নি</p>
            <button onClick={() => { setSearchTerm(''); setFilter('all'); }}
              className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm active:scale-95 transition">
              সব দেখুন
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2.5 md:px-4 md:py-3">
              {/* Mobile header */}
              <div className="md:hidden grid grid-cols-[32px_1fr_auto] gap-2 text-white text-[11px] font-bold">
                <div className="text-center">ক্রঃ</div>
                <div>তারিখ • বার • ব্রত • পারণ</div>
                <div>অবস্থা</div>
              </div>
              {/* Desktop header */}
              <div className="hidden md:grid grid-cols-[40px_120px_120px_80px_1fr_140px_90px] gap-2 text-white text-xs font-bold">
                <div className="text-center">ক্রঃ</div>
                <div>বাংলা তারিখ</div>
                <div>ইং তারিখ</div>
                <div>বার</div>
                <div>ব্রতের নাম</div>
                <div>পারণের সময়</div>
                <div className="text-center">অবস্থা</div>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {filteredEntries.map((entry) => {
                const cfg = STATUS_CONFIG[entry.status];
                const originalIndex = data.entries.findIndex(e => e.id === entry.id);
                return (
                  <div
                    key={entry.id}
                    id={`ekadashi-${originalIndex}`}
                    className={`relative ${cfg.row} transition-colors`}
                  >
                    {/* Green left bar for upcoming */}
                    {entry.status === 'upcoming' && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r" />
                    )}

                    {/* Mobile Row */}
                    <div className="md:hidden grid grid-cols-[32px_1fr_auto] gap-2 px-3 py-2.5 items-start">
                      <div className="flex justify-center pt-0.5">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${cfg.serial}`}>
                          {entry.serialBn}
                        </span>
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className={`font-bold text-sm leading-snug ${cfg.text}`}>
                          {cfg.icon} {entry.vratName}
                        </div>
                        <div className={`text-[11px] ${cfg.date}`}>
                          {entry.bengaliDate} • {entry.displayDate} • {entry.day}
                        </div>
                        <div className={`text-[11px] ${cfg.paran}`}>
                          🕐 {entry.paranTime}
                        </div>
                      </div>
                      <div className="flex-shrink-0 pt-0.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${cfg.badge}`}>
                          {entry.status === 'upcoming' ? getDaysRemaining(entry.englishDate) : cfg.badgeLabel}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Row */}
                    <div className="hidden md:grid grid-cols-[40px_120px_120px_80px_1fr_140px_90px] gap-2 px-4 py-3 items-center">
                      <div className="flex justify-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${cfg.serial}`}>
                          {entry.serialBn}
                        </span>
                      </div>
                      <div className={`text-sm font-semibold ${cfg.date}`}>{entry.bengaliDate}</div>
                      <div className={`text-sm ${cfg.date}`}>{entry.displayDate}</div>
                      <div className={`text-sm ${cfg.date}`}>{entry.day}</div>
                      <div className={`text-sm font-semibold ${cfg.text}`}>
                        {cfg.icon} {entry.vratName}
                      </div>
                      <div className={`text-sm ${cfg.paran}`}>🕐 {entry.paranTime}</div>
                      <div className="flex justify-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${cfg.badge}`}>
                          {entry.status === 'upcoming' ? getDaysRemaining(entry.englishDate) : cfg.badgeLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="mt-4 bg-white rounded-xl p-3 md:p-4 text-center border border-orange-100">
          <p className="text-orange-500 font-bold text-sm md:text-base">🙏 হরে কৃষ্ণ 🙏</p>
          <p className="text-gray-400 text-xs mt-1">
            সকল তথ্য পঞ্জিকা অনুসারে সংকলিত। পারণের সময় স্থানভেদে পরিবর্তন হতে পারে।
          </p>
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
};

export default EkadashiList;
