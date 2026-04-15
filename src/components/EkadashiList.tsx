import { useState, useEffect, useMemo } from 'react';
import { Printer } from 'lucide-react';

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
  },
};

const EkadashiList = () => {
  const [data, setData] = useState<EkadashiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'passed'>('all');

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
    return entries;
  }, [data, filter, upcomingIndex]);

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

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-3">🙏</div>
        <p className="text-orange-600 font-semibold">একাদশী তালিকা লোড হচ্ছে...</p>
      </div>
    </div>
  );

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
    <div className="bg-[#fffbf5] min-h-screen">
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .min-h-screen { min-height: 0 !important; }
          .print-header {
            background: linear-gradient(135deg, #ea580c, #f59e0b) !important;
            color: white !important;
            padding: 7px 12px;
            border-radius: 6px;
            margin-bottom: 8px;
          }
          .print-header h1 { font-size: 15px; font-weight: 800; margin: 0; line-height: 1.3; }
          .print-header p { font-size: 9.5px; margin: 2px 0 0; opacity: 0.9; }
          .print-table { width: 100%; border-collapse: collapse; }
          .print-table th {
            background: #1f2937 !important;
            color: white !important;
            padding: 3px 6px;
            font-size: 10.5px;
            border: 1px solid #374151;
            line-height: 1.2;
            font-weight: 700;
          }
          .print-table td {
            padding: 2px 6px;
            border: 1px solid #e5e7eb;
            font-size: 10.5px;
            vertical-align: middle;
            line-height: 1.3;
          }
          .print-table tr.passed td {
            background: #fff5f5 !important;
            color: #dc2626;
            text-decoration: line-through;
            opacity: 0.7;
          }
          .print-table tr.upcoming td {
            background: #f0fdf4 !important;
            color: #15803d;
            font-weight: 700;
          }
          .print-table tr:nth-child(even):not(.passed):not(.upcoming) td {
            background: #f9fafb !important;
          }
          .print-footer {
            margin-top: 6px;
            text-align: center;
            font-size: 9px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 5px;
          }
          @page { size: A4 portrait; margin: 6mm; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
        }
        .print-only { display: none; }
      `}</style>

      {/* ── Print Area ── */}
      <div className="print-area">
        <div className="print-only">
          <div className="print-header" style={{ textAlign: 'center' }}>
            <h1>একাদশী তালিকা - {data.year}</h1>
            <p>কলম হিন্দু ধর্মসভা | কলম, সিংড়া, নাটোর</p>
          </div>
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '4%' }}>ক্রঃ</th>
                <th style={{ width: '13%' }}>বাংলা তারিখ</th>
                <th style={{ width: '13%' }}>ইং তারিখ</th>
                <th style={{ width: '8%' }}>বার</th>
                <th style={{ width: '43%' }}>ব্রতের নাম</th>
                <th style={{ width: '19%' }}>পারণের সময়</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className={entry.status}>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{entry.serialBn}</td>
                  <td>{entry.bengaliDate}</td>
                  <td>{entry.displayDate}</td>
                  <td>{entry.day}</td>
                  <td style={{ fontWeight: entry.status === 'upcoming' ? 700 : 400 }}>
                    {STATUS_CONFIG[entry.status].icon} {entry.vratName}
                  </td>
                  <td>{entry.paranTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="print-footer">
            <p>🙏 হরে কৃষ্ণ 🙏 | সকল তথ্য পঞ্জিকা অনুসারে সংকলিত | প্রিন্টের তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
          </div>
        </div>
      </div>

      {/* ── Screen Header ── */}
      <div className="no-print">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">

          {/* মোবাইল */}
          <div className="flex items-center justify-between gap-3 md:hidden">
            <div>
              <h1 className="text-base font-black gradient-text">একাদশী তালিকা</h1>
              <p className="text-gray-500 text-[10px] mt-0">{data.year}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-lg px-2 py-1.5 text-[11px]">
                <span className="text-orange-600 font-bold">{stats.total}</span>
                <span className="text-gray-500">মোট</span>
                <span className="text-gray-300">|</span>
                <span className="text-red-500 font-bold">{stats.passed}</span>
                <span className="text-gray-500">শেষ</span>
                <span className="text-gray-300">|</span>
                <span className="text-green-600 font-bold">{stats.remaining}</span>
                <span className="text-gray-500">বাকি</span>
              </div>
              <button onClick={handlePrint}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold active:scale-95 transition">
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ডেস্কটপ */}
          <div className="hidden md:flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center text-4xl shadow-md">
                🙏
              </div>
              <div>
                <h1 className="text-3xl font-black gradient-text">
                  একাদশী ও বিশেষ ব্রত তালিকা
                </h1>
                <p className="text-gray-600 text-sm mt-1 font-medium">{data.year}</p>
                <p className="text-gray-400 text-xs mt-0.5">কলম হিন্দু ধর্মসভা • কলম, সিংড়া, নাটোর</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {[
                { label: 'মোট ব্রত', value: stats.total, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
                { label: 'সম্পন্ন', value: stats.passed, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
                { label: 'বাকি', value: stats.remaining, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-xl px-4 py-2.5 text-center border ${s.border} shadow-sm`}>
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
              <button onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold active:scale-95 transition shadow-lg">
                <Printer className="w-4 h-4" />
                প্রিন্ট/PDF
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 pb-6 no-print">

        {/* আসন্ন একাদশী Card */}
        {upcoming && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-3 md:p-5 text-white mb-4 shadow-lg shadow-green-200/50">
            <p className="text-[11px] md:text-xs font-bold opacity-90 mb-1.5">⏭️ আসন্ন একাদশী / ব্রত</p>
            <div className="bg-white/15 rounded-lg p-2.5 md:p-4">
              <h3 className="font-black text-sm md:text-lg mb-1.5">{upcoming.vratName}</h3>
              <div className="flex flex-wrap gap-x-3 md:gap-x-5 gap-y-1 text-xs md:text-sm opacity-90">
                <span>📅 {upcoming.displayDate}</span>
                <span>📆 {upcoming.day}</span>
                <span>🕐 পারণ: {upcoming.paranTime}</span>
                <span className="bg-white/25 px-2 py-0.5 rounded-full font-bold">
                  {getDaysRemaining(upcoming.englishDate)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Table ── */}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">

          {/* Table Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 md:px-4 md:py-3">
            <div className="md:hidden grid grid-cols-[32px_1fr_auto] gap-2 text-white text-[11px] font-bold">
              <div className="text-center">ক্রঃ</div>
              <div>তারিখ • বার • ব্রত • পারণ</div>
              <div>অবস্থা</div>
            </div>
            <div className="hidden md:grid grid-cols-[44px_130px_130px_90px_1fr_160px_95px] gap-2 text-white text-sm font-bold">
              <div className="text-center">ক্রঃ</div>
              <div>বাংলা তারিখ</div>
              <div>ইং তারিখ</div>
              <div>বার</div>
              <div>ব্রতের নাম</div>
              <div>পারণের সময়</div>
              <div className="text-center">অবস্থা</div>
            </div>
          </div>

          {/* Table Rows */}
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
                  <div className="hidden md:grid grid-cols-[44px_130px_130px_90px_1fr_160px_95px] gap-2 px-4 py-2.5 items-center">
                    <div className="flex justify-center">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${cfg.serial}`}>
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

        </div>{/* ── Table End ── */}

        {/* Footer */}
        <div className="mt-4 bg-white rounded-xl p-3 md:p-4 text-center border border-orange-100">
          <p className="text-orange-500 font-bold text-sm md:text-base">🙏 হরে কৃষ্ণ 🙏</p>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            সকল তথ্য পঞ্জিকা অনুসারে সংকলিত। পারণের সময় স্থানভেদে পরিবর্তন হতে পারে।
          </p>
        </div>
        <div className="h-6" />

      </div>
    </div>
  );
};

export default EkadashiList;
