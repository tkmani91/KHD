import React, { useState, useEffect } from 'react';
import { Users, Printer, Crown, Calendar, CheckCircle, Clock } from 'lucide-react';

interface CommitteeMember {
  memberId: string;
  position: string;
}

interface Committee {
  id: number;
  tenure: string;
  current: boolean;
  members: CommitteeMember[];
}

interface Member {
  id: string;
  name: string;
  photo?: string;
}

interface MembersData {
  members: Member[];
}

const OrganizationalProfile: React.FC = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [membersData, setMembersData] = useState<MembersData>({ members: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/organizationalProfile.json').then(res => res.json()),
      fetch('/members-data.json').then(res => res.json())
    ])
      .then(([profileData, members]) => {
        // ✅ বর্তমান কমিটি উপরে, বিগত কমিটি নিচে
        const sortedCommittees = [...profileData.committees].sort((a, b) => {
          if (a.current && !b.current) return -1;
          if (!a.current && b.current) return 1;
          return 0;
        });
        setCommittees(sortedCommittees);
        setMembersData(members);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  // মেম্বার আইডি থেকে মেম্বার তথ্য খুঁজে বের করা
  const getMemberById = (memberId: string): Member | undefined => {
    return membersData.members.find(m => m.id === memberId);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'সাংগঠনিক-প্রোফাইল-কলম-হিন্দু-ধর্মসভা';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const defaultPhoto = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

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
            padding: 10px;
            font-family: 'Segoe UI', Tahoma, sans-serif;
          }
          .print-header {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
            color: white !important;
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 10px;
            text-align: center;
          }
          .print-header h1 {
            font-size: 16px;
            font-weight: 700;
            margin: 0;
          }
          .print-date {
            text-align: right;
            font-size: 10px;
            color: #666;
            margin-bottom: 8px;
          }
          .print-committee {
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            overflow: hidden;
          }
          .print-committee-header {
            background: #f3f4f6 !important;
            padding: 6px 10px;
            font-weight: 700;
            font-size: 12px;
            border-bottom: 1px solid #ddd;
          }
          .print-committee-header.current {
            background: #dcfce7 !important;
            color: #166534 !important;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
          }
          .print-table th {
            background: #1f2937 !important;
            color: white !important;
            padding: 4px 6px;
            font-weight: 600;
            font-size: 10px;
            text-align: left;
          }
          .print-table td {
            padding: 4px 6px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: middle;
            font-size: 10px;
          }
          .print-table tbody tr:nth-child(even) {
            background: #f9fafb !important;
          }
          .print-table .photo-cell img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            object-fit: cover;
          }
          .print-footer {
            margin-top: 15px;
            padding-top: 8px;
            border-top: 2px solid #7c3aed;
            text-align: center;
            font-size: 9px;
            color: #666;
          }
          @page {
            size: A4 portrait;
            margin: 5mm;
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
            <p className="text-sm text-purple-100">কমিটি ভিত্তিক নেতৃত্বের তালিকা</p>
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
        {/* PRINT ONLY CONTENT */}
        <div className="print-container print-only">
          <div className="print-header">
            <h1>🏛️ কলম হিন্দু ধর্মসভা - সাংগঠনিক প্রোফাইল</h1>
          </div>
          <div className="print-date">
            প্রিন্টের তারিখ: {new Date().toLocaleDateString('bn-BD')}
          </div>
          
          {committees.map((committee) => (
            <div key={committee.id} className="print-committee">
              <div className={`print-committee-header ${committee.current ? 'current' : ''}`}>
                📋 কমিটি: {committee.tenure} {committee.current ? '(বর্তমান)' : '(বিগত)'}
              </div>
              <table className="print-table">
                <thead>
                  <tr>
                    <th style={{ width: '8%' }}>ক্রম</th>
                    <th style={{ width: '10%' }}>ছবি</th>
                    <th style={{ width: '40%' }}>নাম</th>
                    <th style={{ width: '42%' }}>পদবি</th>
                  </tr>
                </thead>
                <tbody>
                  {committee.members.map((cm, index) => {
                    const member = getMemberById(cm.memberId);
                    return (
                      <tr key={cm.memberId}>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{index + 1}</td>
                        <td className="photo-cell">
                          <img 
                            src={member?.photo || defaultPhoto} 
                            alt={member?.name || 'Member'}
                            onError={(e) => { (e.target as HTMLImageElement).src = defaultPhoto; }}
                          />
                        </td>
                        <td style={{ fontWeight: '600' }}>{member?.name || 'অজানা'}</td>
                        <td>{cm.position}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
          
          <div className="print-footer">
            <p>© {new Date().getFullYear()} কলম হিন্দু ধর্মসভা | কলম, সিংড়া, নাটোর</p>
          </div>
        </div>

        {/* NO DATA */}
        {committees.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg no-print">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">কোনো কমিটির তথ্য পাওয়া যায়নি</p>
          </div>
        )}

        {/* COMMITTEES LIST - WEB VIEW */}
        {committees.length > 0 && (
          <div className="space-y-6 no-print">
            {committees.map((committee) => (
              <div 
                key={committee.id} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${
                  committee.current ? 'border-green-400' : 'border-gray-200'
                }`}
              >
                {/* Committee Header */}
                <div className={`p-4 ${
                  committee.current 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                      <Crown className="w-6 h-6" />
                      <div>
                        <h4 className="font-bold text-lg">কমিটি: {committee.tenure}</h4>
                        <div className="flex items-center gap-2 text-sm opacity-90">
                          <Calendar className="w-4 h-4" />
                          <span>মেয়াদকাল: {committee.tenure}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      committee.current 
                        ? 'bg-white text-green-600' 
                        : 'bg-white text-gray-600'
                    }`}>
                      {committee.current ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> বর্তমান
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> বিগত
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Table Header */}
                <div className="hidden md:grid md:grid-cols-12 gap-2 px-4 py-2 bg-gray-100 font-semibold text-sm text-gray-700">
                  <div className="col-span-1 text-center">ক্রম</div>
                  <div className="col-span-1 text-center">ছবি</div>
                  <div className="col-span-5">নাম</div>
                  <div className="col-span-5">পদবি</div>
                </div>

                {/* Members List */}
                <div className="divide-y divide-gray-100">
                  {committee.members.map((cm, index) => {
                    const member = getMemberById(cm.memberId);
                    return (
                      <div 
                        key={cm.memberId} 
                        className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 hover:bg-purple-50 transition items-center"
                      >
                        {/* Mobile View */}
                        <div className="md:hidden flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-bold flex-shrink-0 text-sm">
                            {index + 1}
                          </span>
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 flex-shrink-0">
                            <img 
                              src={member?.photo || defaultPhoto} 
                              alt={member?.name || 'Member'} 
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = defaultPhoto; }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 text-sm truncate">
                              {member?.name || 'অজানা সদস্য'}
                            </h4>
                            <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                              {cm.position}
                            </span>
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
                              src={member?.photo || defaultPhoto} 
                              alt={member?.name || 'Member'} 
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = defaultPhoto; }}
                            />
                          </div>
                        </div>
                        <div className="hidden md:block col-span-5">
                          <h4 className="font-bold text-gray-800 text-sm">
                            {member?.name || 'অজানা সদস্য'}
                          </h4>
                        </div>
                        <div className="hidden md:block col-span-5">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {cm.position}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationalProfile;
