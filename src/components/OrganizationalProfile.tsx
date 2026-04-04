import React, { useState, useEffect } from 'react';
import { Users, Printer } from 'lucide-react';

interface Leader {
  id: number;
  memberId: string;      // 🆕 members-data থেকে reference
  position: string;
  tenure: string;
  current?: boolean;
}

interface MemberData {
  id: string;
  name: string;
  designation: string;
  photo: string;
}

interface ProfileData {
  leaders: Leader[];
}

// 🆕 Merged Leader type (for display)
interface MergedLeader extends Leader {
  name: string;
  photo: string;
}

const OrganizationalProfile: React.FC = () => {
  const [data, setData] = useState<ProfileData>({ leaders: [] });
  const [membersData, setMembersData] = useState<MemberData[]>([]);
  const [mergedLeaders, setMergedLeaders] = useState<MergedLeader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🆕 Fetch both JSON files
        const [profileRes, membersRes] = await Promise.all([
          fetch('/data/organizationalProfile.json'),
          fetch('https://raw.githubusercontent.com/tkmani91/KHD/main/members-data.json')
        ]);

        const profileData = await profileRes.json();
        const membersJson = await membersRes.json();

        setData(profileData);
        setMembersData(membersJson.members || []);

        // 🆕 Merge data
        const merged = (profileData.leaders || []).map((leader: Leader) => {
          const member = (membersJson.members || []).find(
            (m: MemberData) => m.id === leader.memberId
          );
          return {
            ...leader,
            name: member?.name || 'নাম পাওয়া যায়নি',
            photo: member?.photo || ''
          };
        });

        setMergedLeaders(merged);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'সাংগঠনিক-প্রোফাইল-কলম-হিন্দু-ধর্মসভা';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-container {
            padding: 0;
            font-family: 'Segoe UI', Tahoma, sans-serif;
          }
          .print-header {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
            color: white !important;
            padding: 6px 12px;
            border-radius: 6px;
            margin-bottom: 6px;
            text-align: center;
          }
          .print-header h1 {
            font-size: 14px;
            font-weight: 700;
            margin: 0;
          }
          .print-date {
            text-align: right;
            font-size: 10px;
            color: #666;
            margin-bottom: 4px;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            border: 1px solid #374151;
          }
          .print-table th {
            background: #1f2937 !important;
            color: white !important;
            padding: 4px 2px;
            font-weight: 700;
            font-size: 10px;
            border: 1px solid #4b5563;
          }
          .print-table td {
            padding: 2px;
            border: 1px solid #d1d5db;
            vertical-align: middle;
            font-size: 10px;
            line-height: 1.1;
          }
          .print-table tbody tr:nth-child(even) {
            background: #f3f4f6 !important;
          }
          .print-table .serial {
            text-align: center;
            font-weight: bold;
            color: #7c3aed;
            width: 6%;
          }
          .print-table .photo-cell {
            width: 8%;
            text-align: center;
          }
          .print-table .photo-cell img {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            object-fit: cover;
            border: 1px solid #ccc;
          }
          .print-table .name-cell {
            font-weight: 600;
            text-align: left;
            padding-left: 4px;
          }
          .print-table .position-badge {
            background: #e9d5ff !important;
            color: #6b21a8 !important;
            padding: 1px 4px;
            border-radius: 8px;
            font-size: 9px;
            font-weight: 600;
          }
          .print-table .current-badge {
            background: #dcfce7 !important;
            color: #166534 !important;
            padding: 1px 4px;
            border-radius: 8px;
            font-size: 8px;
            font-weight: 700;
          }
          .print-footer {
            margin-top: 8px;
            padding-top: 4px;
            border-top: 2px solid #7c3aed;
            text-align: center;
            font-size: 9px;
            color: #666;
          }
          @page {
            size: A4 portrait;
            margin: 3mm;
          }
          tr {
            page-break-inside: avoid;
          }
          thead {
            display: table-header-group;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-4 shadow-lg no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-left">
            <h3 className="font-bold text-lg flex items-center gap-2 justify-center sm:justify-start">
              <Users className="w-5 h-5" /> সাংগঠনিক প্রোফাইল
            </h3>
            <p className="text-sm text-purple-100">নেতৃত্বের সংক্ষিপ্ত তালিকা</p>
          </div>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium flex items-center gap-2 hover:bg-purple-50 transition shadow"
          >
            <Printer className="w-4 h-4" /> প্রিন্ট
          </button>
        </div>
      </div>

      {/* PRINT SECTION */}
      <div className="print-section">
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
              {mergedLeaders.map((leader, index) => (
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
                    {leader.current ? (
                      <span className="current-badge">বর্তমান</span>
                    ) : (
                      <span style={{ color: '#888', fontSize: '8px' }}>সমাপ্ত</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="print-footer">
            <p>© {new Date().getFullYear()} কলম হিন্দু ধর্মসভা | কলম, সিংড়া, নাটোর</p>
          </div>
        </div>

        {/* NO DATA */}
        {mergedLeaders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg no-print">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">কোনো তথ্য পাওয়া যায়নি</p>
          </div>
        )}

        {/* LEADERS LIST */}
        {mergedLeaders.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden no-print">
            <div className="hidden md:grid md:grid-cols-12 gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold text-sm">
              <div className="col-span-1 text-center">ক্রম</div>
              <div className="col-span-1 text-center">ছবি</div>
              <div className="col-span-4">নাম</div>
              <div className="col-span-2 text-center">পদবি</div>
              <div className="col-span-2 text-center">মেয়াদকাল</div>
              <div className="col-span-2 text-center">অবস্থা</div>
            </div>

            <div className="divide-y divide-gray-100">
              {mergedLeaders.map((leader, index) => (
                <div key={leader.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 hover:bg-purple-50 transition items-center">
                  {/* Mobile View */}
                  <div className="md:hidden flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 flex-shrink-0">
                      <img 
                        src={leader.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                        alt={leader.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{leader.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {leader.position}
                        </span>
                        <span className="text-gray-500 text-xs">{leader.tenure}</span>
                      </div>
                      {leader.current && (
                        <span className="inline-block mt-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                          বর্তমান
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:block col-span-1 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <div className="hidden md:block col-span-1 text-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-200 mx-auto">
                      <img 
                        src={leader.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                        alt={leader.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                      />
                    </div>
                  </div>
                  <div className="hidden md:block col-span-4">
                    <h4 className="font-bold text-gray-800 text-sm">{leader.name}</h4>
                  </div>
                  <div className="hidden md:block col-span-2 text-center">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {leader.position}
                    </span>
                  </div>
                  <div className="hidden md:block col-span-2 text-center text-gray-600 text-sm">
                    {leader.tenure}
                  </div>
                  <div className="hidden md:block col-span-2 text-center">
                    {leader.current ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        বর্তমান
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">সমাপ্ত</span>
                    )}
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
