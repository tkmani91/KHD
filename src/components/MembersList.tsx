import React, { useState } from 'react';
import { Users, Phone, Download, Eye, User, X, LayoutGrid, List, Printer } from 'lucide-react';

// cn function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface Member {
  id: string;
  name: string;
  designation: string;
  mobile: string;
  email?: string;
  photo: string;
  bloodGroup: string;
  fatherName?: string;
  motherName?: string;
  gotra?: string;
  occupation?: string;
  address: string;
  permanentAddress?: string;
}

interface MembersListProps {
  membersData: Member[];
  pdfLink: string;
}

const MembersList: React.FC<MembersListProps> = ({ membersData, pdfLink }) => {
  const [showMemberDetails, setShowMemberDetails] = useState<Member | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const handlePdfDownload = () => {
    if (!pdfLink || pdfLink === '') {
      alert('PDF লিংক এখনো যুক্ত হয়নি');
      return;
    }
    const link = document.createElement('a');
    link.href = pdfLink;
    link.download = 'সদস্য-তালিকা.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* ============================================ */}
      {/* PRINT STYLES */}
      {/* ============================================ */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            background: white !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-area {
            display: block !important;
            position: static !important;
            width: 100% !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .print-container {
            padding: 12px;
            font-family: 'Segoe UI', Tahoma, sans-serif;
          }
          
          /* Header */
          .print-header-box {
            background: linear-gradient(135deg, #f97316, #dc2626) !important;
            color: white !important;
            padding: 14px 18px;
            border-radius: 10px;
            margin-bottom: 14px;
            text-align: center;
            border: 2px solid #c2410c;
          }
          
          .print-header-box h1 {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 4px 0;
          }
          
          .print-header-box p {
            font-size: 11px;
            margin: 0;
          }
          
          /* Table */
          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            border: 2px solid #374151;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .print-table th {
            background: #1f2937 !important;
            color: white !important;
            padding: 10px 6px;
            font-weight: 700;
            text-align: left;
            font-size: 10px;
            border-bottom: 2px solid #f97316;
          }
          
          .print-table td {
            padding: 8px 6px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: middle;
          }
          
          .print-table tbody tr:nth-child(even) {
            background: #f9fafb !important;
          }
          
          .print-table .blood-group {
            background: #fee2e2 !important;
            color: #dc2626 !important;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: 700;
            border: 1px solid #fca5a5;
            display: inline-block;
          }
          
          .print-table .designation {
            background: #ffedd5 !important;
            color: #c2410c !important;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: 600;
            display: inline-block;
          }
          
          .print-table .gotra {
            background: #e0e7ff !important;
            color: #4338ca !important;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: 600;
            display: inline-block;
          }
          
          .text-center { text-align: center; }
          
          .print-footer {
            margin-top: 14px;
            padding-top: 10px;
            border-top: 2px dashed #9ca3af;
            text-align: center;
            font-size: 9px;
            color: #6b7280;
            font-style: italic;
          }
          
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          
          tr {
            page-break-inside: avoid;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="text-white text-center sm:text-left">
          <h3 className="font-bold flex items-center gap-2 justify-center sm:justify-start">
            <Users className="w-5 h-5" /> সম্পূর্ণ সদস্য তালিকা
          </h3>
          <p className="text-sm text-orange-100">মোট {membersData.length} জন সদস্য</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition",
                viewMode === 'card' ? "bg-white text-orange-600 shadow" : "text-white hover:bg-white/10"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">কার্ড</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition",
                viewMode === 'list' ? "bg-white text-orange-600 shadow" : "text-white hover:bg-white/10"
              )}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">লিস্ট</span>
            </button>
          </div>

          {/* Print Button */}
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-white/30 transition"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">প্রিন্ট</span>
          </button>

          {/* PDF Download Button */}
          <button 
            onClick={handlePdfDownload}
            className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium flex items-center gap-2 hover:bg-orange-50 transition shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* PRINT AREA */}
      {/* ============================================ */}
      <div className="print-area">
        {/* Print Only Content */}
        <div className="print-container print-only">
          <div className="print-header-box">
            <h1>🙏 কলম হিন্দু ধর্মসভা - সদস্য তালিকা</h1>
            <p>📅 {new Date().toLocaleDateString('bn-BD')} | মোট সদস্য: {membersData.length} জন</p>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th className="text-center" style={{width: '5%'}}>#</th>
                <th style={{width: '20%'}}>নাম</th>
                <th className="text-center" style={{width: '12%'}}>পদবী</th>
                <th style={{width: '13%'}}>ফোন নম্বর</th>
                <th style={{width: '22%'}}>ইমেইল</th>
                <th className="text-center" style={{width: '10%'}}>রক্তের গ্রুপ</th>
                <th className="text-center" style={{width: '13%'}}>গোত্র</th>
              </tr>
            </thead>
            <tbody>
              {membersData.map((member, index) => (
                <tr key={member.id}>
                  <td className="text-center" style={{fontWeight: 600, color: '#6b7280'}}>
                    {index + 1}
                  </td>
                  <td style={{fontWeight: 700, color: '#111827'}}>{member.name}</td>
                  <td className="text-center">
                    <span className="designation">{member.designation}</span>
                  </td>
                  <td style={{fontWeight: 500}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                      📱 {member.mobile}
                    </span>
                  </td>
                  <td style={{fontSize: '9px', color: '#4b5563'}}>
                    {member.email ? (
                      <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        ✉️ {member.email}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="text-center">
                    <span className="blood-group">🩸 {member.bloodGroup}</span>
                  </td>
                  <td className="text-center">
                    {member.gotra ? (
                      <span className="gotra">🔱 {member.gotra}</span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="print-footer">
            © কলম হিন্দু ধর্মসভা | স্বয়ংক্রিয়ভাবে তৈরি | {new Date().toLocaleTimeString('bn-BD')}
          </div>
        </div>

        {/* ============================================ */}
        {/* SCREEN - Card View */}
        {/* ============================================ */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
            {membersData.map((member) => (
              <div key={member.id} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-orange-200 shadow flex-shrink-0">
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{member.name}</h3>
                    <p className="text-orange-600 text-sm font-medium">{member.designation}</p>
                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {member.mobile}
                    </p>
                  </div>
                </div>

                <div className="mb-4 pb-3 border-b border-gray-100 flex gap-3 items-center">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    সদস্য নং: #{member.id.padStart(3, '0')}
                  </span>
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded font-medium">
                    🩸 {member.bloodGroup}
                  </span>
                </div>

                <button 
                  onClick={() => setShowMemberDetails(member)}
                  className="w-full py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-orange-600 transition"
                >
                  <Eye className="w-4 h-4" />
                  বিস্তারিত দেখুন
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ============================================ */}
        {/* SCREEN - List View */}
        {/* ============================================ */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden no-print">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <tr>
                    <th className="px-3 py-3 text-center font-semibold w-12">#</th>
                    <th className="px-3 py-3 text-center font-semibold w-16">ছবি</th>
                    <th className="px-3 py-3 text-left font-semibold">নাম</th>
                    <th className="px-3 py-3 text-center font-semibold">পদবী</th>
                    <th className="px-3 py-3 text-left font-semibold">মোবাইল</th>
                    <th className="px-3 py-3 text-center font-semibold">রক্ত</th>
                    <th className="px-3 py-3 text-center font-semibold hidden md:table-cell">গোত্র</th>
                    <th className="px-3 py-3 text-center font-semibold w-24">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {membersData.map((member, index) => (
                    <tr key={member.id} className="hover:bg-orange-50 transition">
                      <td className="px-3 py-3 text-center text-gray-500 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <img 
                          src={member.photo} 
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-orange-200 mx-auto"
                          onError={(e) => { 
                            (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; 
                          }}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-semibold text-gray-800">{member.name}</div>
                        <div className="text-xs text-gray-400">#{member.id.padStart(3, '0')}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                          {member.designation}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <a href={`tel:${member.mobile}`} className="text-gray-600 hover:text-orange-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {member.mobile}
                        </a>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                          🩸 {member.bloodGroup}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center hidden md:table-cell">
                        {member.gotra ? (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full">
                            🔱 {member.gotra}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button 
                          onClick={() => setShowMemberDetails(member)}
                          className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-orange-600 transition mx-auto"
                        >
                          <Eye className="w-3 h-3" />
                          বিস্তারিত
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {showMemberDetails && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 no-print" onClick={() => setShowMemberDetails(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5" /> সদস্য বিস্তারিত
              </h2>
              <button onClick={() => setShowMemberDetails(null)} className="text-white hover:bg-white/20 p-2 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="w-32 h-32 mx-auto sm:mx-0 rounded-xl overflow-hidden border-4 border-orange-200 shadow-lg flex-shrink-0">
                  <img 
                    src={showMemberDetails.photo} 
                    alt={showMemberDetails.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-gray-800">{showMemberDetails.name}</h3>
                  <p className="text-orange-600 font-semibold text-lg">{showMemberDetails.designation}</p>
                  <p className="text-gray-500 text-sm mt-1">সদস্য নং: #{showMemberDetails.id.padStart(3, '0')}</p>
                  <p className="text-red-600 font-medium text-sm mt-1">🩸 রক্তের গ্রুপ: {showMemberDetails.bloodGroup}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-3 rounded-xl">
                  <p className="text-xs text-orange-500 font-medium mb-1">📱 মোবাইল</p>
                  <p className="font-semibold text-gray-800">{showMemberDetails.mobile}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl">
                  <p className="text-xs text-orange-500 font-medium mb-1">📧 ইমেইল</p>
                  <p className="font-semibold text-gray-800 text-sm break-all">{showMemberDetails.email || '—'}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl">
                  <p className="text-xs text-orange-500 font-medium mb-1">👨 পিতার নাম</p>
                  <p className="font-semibold text-gray-800">{showMemberDetails.fatherName || '—'}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl">
                  <p className="text-xs text-orange-500 font-medium mb-1">👩 মাতার নাম</p>
                  <p className="font-semibold text-gray-800">{showMemberDetails.motherName || '—'}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl">
                  <p className="text-xs text-orange-500 font-medium mb-1">🔱 গোত্র</p>
                  <p className="font-semibold text-gray-800">{showMemberDetails.gotra || '—'}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl">
                  <p className="text-xs text-orange-500 font-medium mb-1">💼 পেশা</p>
                  <p className="font-semibold text-gray-800">{showMemberDetails.occupation || '—'}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl sm:col-span-2">
                  <p className="text-xs text-orange-500 font-medium mb-1">📍 বর্তমান ঠিকানা</p>
                  <p className="font-semibold text-gray-800">{showMemberDetails.address}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl sm:col-span-2">
                  <p className="text-xs text-orange-500 font-medium mb-1">🏠 স্থায়ী ঠিকানা</p>
                  <p className="font-semibold text-gray-800">{showMemberDetails.permanentAddress || '—'}</p>
                </div>
              </div>

              <div className="mt-6">
                <a 
                  href={`tel:${showMemberDetails.mobile}`}
                  className="w-full py-3 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition"
                >
                  <Phone className="w-5 h-5" /> কল করুন
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersList;
