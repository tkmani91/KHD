import React, { useState, useEffect } from 'react';
import { Users, Printer } from 'lucide-react';

interface Leader {
  id: number;
  name: string;
  position: string;
  tenure: string;
  photo?: string;
  current?: boolean;
}

interface ProfileData {
  leaders: Leader[];
}

const OrganizationalProfile: React.FC = () => {
  const [data, setData] = useState<ProfileData>({ leaders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/organizationalProfile.json')
      .then(res => res.json())
      .then(jsonData => {
        const sortedLeaders = [...jsonData.leaders].sort((a, b) => {
          if (a.current && !b.current) return -1;
          if (!a.current && b.current) return 1;
          return 0;
        });
        setData({ leaders: sortedLeaders });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading organizational profile:', error);
        setLoading(false);
      });
  }, []);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'সাংগঠনিক-প্রোফাইল-কলম-হিন্দু-ধর্মসভা';
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-header { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important; color: white !important; padding: 6px 12px; border-radius: 6px; margin-bottom: 6px; text-align: center; }
          .print-header h1 { font-size: 14px; font-weight: 700; margin: 0; }
          .print-date { text-align: right; font-size: 10px; color: #666; margin-bottom: 4px; }
          .print-table { width: 100%; border-collapse: collapse; font-size: 10px; border: 1px solid #374151; }
          .print-table th { background: #1f2937 !important; color: white !important; padding: 4px 2px; font-weight: 700; font-size: 10px; border: 1px solid #4b5563; }
          .print-table td { padding: 2px; border: 1px solid #d1d5db; vertical-align: middle; font-size: 10px; line-height: 1.1; }
          .print-table tbody tr:nth-child(even) { background: #f3f4f6 !important; }
          .print-table .serial { text-align: center; font-weight: bold; color: #7c3aed; width: 6%; }
          .print-table .photo-cell { width: 8%; text-align: center; }
          .print-table .photo-cell img { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1px solid #ccc; }
          .print-table .name-cell { font-weight: 600; text-align: left; padding-left: 4px; }
          .print-table .position-badge { background: #e9d5ff !important; color: #6b21a8 !important; padding: 1px 4px; border-radius: 8px; font-size: 9px; font-weight: 600; }
          .print-table .current-badge { background: #dcfce7 !important; color: #166534 !important; padding: 1px 4px; border-radius: 8px; font-size: 8px; font-weight: 700; }
          .print-footer { margin-top: 8px; padding-top: 4px; border-top: 2px solid #7c3aed; text-align: center; font-size: 9px; color: #666; }
          @page { size: A4 portrait; margin: 3mm; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
        }
        .print-only { display: none; }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-3 md:p-4 shadow-lg no-print">
        <div className="flex items-center justify-between gap-3">
          <div className="text-white">
            <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              সাংগঠনিক প্রোফাইল
            </h3>
            <p className="text-xs text-purple-100 mt-0.5">
              কার্যনির্বাহী পরিষদের ধারাবাহিক তালিকা
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex-shrink-0 px-3 py-2 bg-white text-purple-600 rounded-lg font-medium flex items-center gap-1.5 hover:bg-purple-50 active:scale-95 transition shadow text-xs md:text-sm"
          >
            <Printer className="w-3.5 h-3.5 md:w-4 md:h-4" />
            প্রিন্ট
          </button>
        </div>
      </div>

      {/* ── Print Section ── */}
      <div className="print-section">
        {/* Print Only Content */}
        <div className="print-container print-only">
          <div className="print-header">
            <h1>🏛️ কলম হিন্দু ধর্মসভা - সাংগঠনিক প্রোফাইল</h1>
          </div>
          <div className="print-date">
            প্রিন্টের তারিখ: {new Date().toLocaleDateString('bn-BD')}
          </div>
          <table className="print-table">
            <thead>
              <tr>
                <th>ক্রম</th>
                <th>ছবি</th>
                <th>নাম</th>
                <th>পদবি</th>
                <th>মেয়াদকাল</th>
                <th>অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {data.leaders.map((leader, index) => (
                <tr key={leader.id}>
                  <td className="serial">{index + 1}</td>
                  <td className="photo-cell">
                    <img
                      src={leader.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                      alt={leader.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                    />
                  </td>
                  <td className="name-cell">{leader.name}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="position-badge">{leader.position}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>{leader.tenure}</td>
                  <td style={{ textAlign: 'center' }}>
                    {leader.current
                      ? <span className="current-badge">বর্তমান</span>
                      : <span style={{ color: '#888', fontSize: '8px' }}>সমাপ্ত</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="print-footer">
            <p>© {new Date().getFullYear()} কলম হিন্দু ধর্মসভা | কলম, সিংড়া, নাটোর</p>
          </div>
        </div>

        {/* ── No Data ── */}
        {data.leaders.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow-lg no-print">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">কোনো তথ্য পাওয়া যায়নি</p>
          </div>
        )}

        {/* ── Leaders List ── */}
        {data.leaders.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden no-print">

            {/* Desktop Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold text-sm">
              <div className="col-span-1 text-center">ক্রম</div>
              <div className="col-span-1 text-center">ছবি</div>
              <div className="col-span-4">নাম</div>
              <div className="col-span-2 text-center">পদবি</div>
              <div className="col-span-2 text-center">মেয়াদকাল</div>
              <div className="col-span-2 text-center">অবস্থা</div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-semibold">
              মোট {data.leaders.length} জন নেতৃবৃন্দ
            </div>

            <div className="divide-y divide-gray-100">
              {data.leaders.map((leader, index) => (
                <div key={leader.id} className="hover:bg-purple-50 transition active:bg-purple-100">

                  {/* ── Mobile Row ── */}
                  <div className="md:hidden flex items-center gap-2.5 px-3 py-2.5">
                    {/* Serial */}
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full font-bold text-xs flex-shrink-0">
                      {index + 1}
                    </span>

                    {/* Photo */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-200">
                        <img
                          src={leader.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                          alt={leader.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                        />
                      </div>
                      {/* Current dot indicator */}
                      {leader.current && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{leader.name}</h4>
                        {leader.current && (
                          <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0">
                            বর্তমান
                          </span>
                        )}
                      </div>
                      <span className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[11px] font-medium mt-0.5">
                        {leader.position}
                      </span>
                    </div>

                    {/* Tenure - ডানে */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[11px] text-gray-500 leading-tight">{leader.tenure}</p>
                    </div>
                  </div>

                  {/* ── Desktop Row ── */}
                  <div className="hidden md:grid md:grid-cols-12 gap-2 px-4 py-3 items-center">
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="col-span-1 text-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-200 mx-auto">
                        <img
                          src={leader.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                          alt={leader.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                        />
                      </div>
                    </div>
                    <div className="col-span-4">
                      <h4 className="font-bold text-gray-800 text-sm">{leader.name}</h4>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {leader.position}
                      </span>
                    </div>
                    <div className="col-span-2 text-center text-gray-600 text-sm">
                      {leader.tenure}
                    </div>
                    <div className="col-span-2 text-center">
                      {leader.current ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          বর্তমান
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">সমাপ্ত</span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationalProfile;
