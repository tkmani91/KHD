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

// ============ রো স্টাইল ============
const rowStyle: Record<EntryStatus, React.CSSProperties> = {
  passed: {
    borderBottom: '1px solid #fca5a5',
    backgroundColor: '#fff5f5',
  },
  upcoming: {
    borderBottom: '2px solid #22c55e',
    backgroundColor: '#f0fdf4',
    boxShadow: '0 0 0 2px #bbf7d0',
  },
  future: {
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
  },
};

const serialStyle: Record<EntryStatus, React.CSSProperties> = {
  passed: { backgroundColor: '#ef4444', color: '#fff' },
  upcoming: { backgroundColor: '#22c55e', color: '#fff' },
  future: { backgroundColor: '#374151', color: '#fff' },
};

const textStyle: Record<EntryStatus, React.CSSProperties> = {
  passed: { color: '#dc2626', textDecoration: 'line-through', opacity: 0.7 },
  upcoming: { color: '#15803d', fontWeight: 700 },
  future: { color: '#1f2937' },
};

const dateStyle: Record<EntryStatus, React.CSSProperties> = {
  passed: { color: '#f87171' },
  upcoming: { color: '#16a34a', fontWeight: 600 },
  future: { color: '#4b5563' },
};

const paranStyle: Record<EntryStatus, React.CSSProperties> = {
  passed: { color: '#f87171' },
  upcoming: { color: '#16a34a', fontWeight: 600 },
  future: { color: '#6b7280' },
};

const badgeStyle: Record<EntryStatus, React.CSSProperties> = {
  passed: { backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' },
  upcoming: { backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' },
  future: { backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db' },
};

const badgeLabel: Record<EntryStatus, string> = {
  passed: 'সময় শেষ',
  upcoming: 'আসন্ন',
  future: 'আসছে',
};

const statusIcon: Record<EntryStatus, string> = {
  passed: '🔴',
  upcoming: '🟢',
  future: '⚫',
};

// ============ মূল কম্পোনেন্ট ============
const EkadashiList = () => {
  const [data, setData] = useState<EkadashiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'passed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const upcomingIndex = useMemo(() => {
    if (!data) return -1;
    return findUpcomingIndex(data.entries);
  }, [data]);

  const getEntryStatus = (index: number): EntryStatus => {
    if (index === upcomingIndex) return 'upcoming';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const entryDate = new Date(data!.entries[index].englishDate);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate < today ? 'passed' : 'future';
  };

  const filteredEntries = useMemo(() => {
    if (!data) return [];
    let entries = data.entries.map((entry, index) => ({
      ...entry,
      status: getEntryStatus(index),
    }));
    if (filter === 'upcoming') entries = entries.filter(e => e.status !== 'passed');
    else if (filter === 'passed') entries = entries.filter(e => e.status === 'passed');
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

  const stats = useMemo(() => {
    if (!data) return { total: 0, passed: 0, remaining: 0 };
    const passed = data.entries.filter((_, i) => getEntryStatus(i) === 'passed').length;
    return { total: data.entries.length, passed, remaining: data.entries.length - passed };
  }, [data, upcomingIndex]);

  useEffect(() => {
    if (!loading && upcomingIndex >= 0) {
      setTimeout(() => {
        const el = document.getElementById(`ekadashi-${upcomingIndex}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [loading, upcomingIndex]);

  // ============ লোডিং ============
  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🙏</div>
          <p style={{ color: '#c2410c', fontWeight: 600 }}>একাদশী তালিকা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // ============ এরর ============
  if (error || !data) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 400, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ color: '#dc2626', marginTop: 12, fontSize: 18, fontWeight: 700 }}>ডেটা লোড করা যায়নি</h2>
          <p style={{ color: '#6b7280', marginTop: 8 }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: '8px 24px', background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  const upcoming = upcomingIndex >= 0 ? data.entries[upcomingIndex] : null;

  return (
    <div style={{ background: '#fffbf5', minHeight: '100vh', fontFamily: 'inherit' }}>

      {/* ===== হেডার ===== */}
      <div style={{ background: 'linear-gradient(135deg, #ea580c, #f59e0b, #ea580c)', color: '#fff', padding: '24px 16px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h1 style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, letterSpacing: 1, margin: 0 }}>
              🙏 একাদশী তালিকা 🙏
            </h1>
            <p style={{ color: '#fed7aa', marginTop: 4, fontSize: 14 }}>{data.year}</p>
          </div>

          {/* পরিসংখ্যান */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'মোট', value: stats.total, color: '#fff' },
              { label: 'শেষ', value: stats.passed, color: '#fca5a5' },
              { label: 'বাকি', value: stats.remaining, color: '#86efac' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#fed7aa' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '16px 12px' }}>

        {/* ===== আসন্ন একাদশী কার্ড ===== */}
        {upcoming && (
          <div style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', borderRadius: 14, padding: 16, color: '#fff', marginBottom: 16, boxShadow: '0 4px 16px rgba(22,163,74,0.25)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, opacity: 0.9 }}>⏭️ আসন্ন একাদশী / ব্রত</div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 'clamp(15px, 4vw, 18px)', marginBottom: 6 }}>{upcoming.vratName}</div>
              <div style={{ fontSize: 13, opacity: 0.9, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <span>📅 {upcoming.displayDate}</span>
                <span>📆 {upcoming.day}</span>
              </div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <span>🕐 পারণ: {upcoming.paranTime}</span>
                <span style={{ background: 'rgba(255,255,255,0.25)', padding: '2px 10px', borderRadius: 20, fontWeight: 700, fontSize: 12 }}>
                  {getDaysRemaining(upcoming.englishDate)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ===== সার্চ ও ফিল্টার ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 একাদশী খুঁজুন..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 40px 10px 14px', borderRadius: 10, border: '2px solid #fed7aa', outline: 'none', fontSize: 14, boxSizing: 'border-box', background: '#fff' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 16 }}
              >✕</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {([
              { key: 'all', label: '📋 সব' },
              { key: 'upcoming', label: '🟢 আসন্ন' },
              { key: 'passed', label: '🔴 শেষ' },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '2px solid',
                  borderColor: filter === f.key ? '#f97316' : '#fed7aa',
                  background: filter === f.key ? '#f97316' : '#fff',
                  color: filter === f.key ? '#fff' : '#6b7280',
                  transition: 'all 0.2s',
                }}
              >{f.label}</button>
            ))}
          </div>
        </div>

        {/* ===== রঙের ব্যাখ্যা ===== */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', marginBottom: 14, border: '1px solid #fed7aa', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>রঙের অর্থ:</span>
          {[
            { color: '#ef4444', label: 'সময় শেষ' },
            { color: '#22c55e', label: 'আসন্ন' },
            { color: '#374151', label: 'আসছে' },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, display: 'inline-block' }}></span>
              <span style={{ fontSize: 12, color: c.color, fontWeight: 600 }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* ===== দাগ টানা খাতার মতো তালিকা ===== */}
        {filteredEntries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', background: '#fff', borderRadius: 12 }}>
            <div style={{ fontSize: 40 }}>🔍</div>
            <p style={{ color: '#6b7280', marginTop: 8 }}>কোনো একাদশী পাওয়া যায়নি</p>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

            {/* টেবিল হেডার */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '36px 1fr auto',
              gap: 0,
              background: 'linear-gradient(135deg, #ea580c, #f59e0b)',
              padding: '10px 12px',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', textAlign: 'center' }}>ক্রঃ</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', paddingLeft: 10 }}>তারিখ • বার • ব্রতের নাম • পারণের সময়</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', textAlign: 'right' }}>অবস্থা</div>
            </div>

            {/* প্রতিটি সারি — দাগ টানা খাতার এক লাইন */}
            {filteredEntries.map((entry) => {
              const status = entry.status;
              const isUpcoming = status === 'upcoming';
              const originalIndex = data.entries.findIndex(e => e.id === entry.id);

              return (
                <div
                  key={entry.id}
                  id={`ekadashi-${originalIndex}`}
                  style={{
                    ...rowStyle[status],
                    display: 'grid',
                    gridTemplateColumns: '36px 1fr auto',
                    alignItems: 'center',
                    gap: 0,
                    padding: '10px 12px',
                    transition: 'background 0.2s',
                    position: 'relative',
                  }}
                >
                  {/* ক্রম নম্বর */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{
                      ...serialStyle[status],
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {entry.serialBn}
                    </span>
                  </div>

                  {/* মূল তথ্য — এক লাইনে */}
                  <div style={{ paddingLeft: 10, paddingRight: 8, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '2px 8px',
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      lineHeight: 1.5,
                    }}>
                      {/* তারিখ */}
                      <span style={{ ...dateStyle[status], fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {entry.bengaliDate}
                      </span>
                      <span style={{ color: '#d1d5db' }}>•</span>
                      {/* ইংরেজি তারিখ */}
                      <span style={{ ...dateStyle[status], whiteSpace: 'nowrap', fontSize: 'clamp(11px, 2.5vw, 13px)' }}>
                        {entry.displayDate}
                      </span>
                      <span style={{ color: '#d1d5db' }}>•</span>
                      {/* বার */}
                      <span style={{ ...dateStyle[status], whiteSpace: 'nowrap' }}>
                        {entry.day}
                      </span>
                      <span style={{ color: '#d1d5db' }}>•</span>
                      {/* ব্রতের নাম */}
                      <span style={{ ...textStyle[status], fontWeight: isUpcoming ? 700 : 600 }}>
                        {statusIcon[status]} {entry.vratName}
                      </span>
                      <span style={{ color: '#d1d5db' }}>•</span>
                      {/* পারণের সময় */}
                      <span style={{ ...paranStyle[status], fontSize: 'clamp(11px, 2.5vw, 13px)' }}>
                        🕐 {entry.paranTime}
                      </span>
                    </div>
                  </div>

                  {/* স্ট্যাটাস ব্যাজ */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{
                      ...badgeStyle[status],
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 20,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}>
                      {isUpcoming ? getDaysRemaining(entry.englishDate) : badgeLabel[status]}
                    </span>
                  </div>

                  {/* আসন্ন হলে বাম পাশে সবুজ গ্লো */}
                  {isUpcoming && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      background: '#22c55e',
                      borderRadius: '0 2px 2px 0',
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== ফুটার ===== */}
        <div style={{ marginTop: 20, textAlign: 'center', background: '#fff', borderRadius: 12, padding: '16px 12px', border: '1px solid #fed7aa' }}>
          <p style={{ color: '#ea580c', fontWeight: 600, margin: 0 }}>🙏 হরে কৃষ্ণ 🙏</p>
          <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 6, marginBottom: 0 }}>
            সকল তথ্য পঞ্জিকা অনুসারে সংকলিত। পারণের সময় স্থানভেদে পরিবর্তন হতে পারে।
          </p>
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
};

export default EkadashiList;
