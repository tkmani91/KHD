import React, { useState } from 'react';
import { Users, Phone, Download, Eye, User, X, LayoutGrid, List, Printer } from 'lucide-react';

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
    if (!pdfLink || pdfLink === '') { alert('PDF লিংক এখনো যুক্ত হয়নি'); return; }
    const link = document.createElement('a');
    link.href = pdfLink;
    link.download = 'সদস্য-তালিকা.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'সদস্য-তালিকা-কলম-হিন্দু-ধর্মসভা';
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1000);
  };

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
          .print-header { background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%) !important; color: white !important; padding: 6px 12px; border-radius: 6px; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between; }
          .print-header h1 { font-size: 14px; font-weight: 700; margin: 0; }
          .print-header .member-count { background: white !important; color: #dc2626 !important; padding: 2px 8px; border-radius: 11px; font-size: 12px; font-weight: 700; }
          .print-table { width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #374151; }
          .print-table th { background: #1f2937 !important; color: white !important; padding: 4px 2px; font-weight: 700; font-size: 11px; border: 1px solid #4b5563; }
          .print-table td { padding: 2px; border: 1px solid #d1d5db; vertical-align: middle; font-size: 11px; line-height: 1.1; }
          .print-table tbody tr:nth-child(even) { background: #f3f4f6 !important; }
          .print-photo { width: 19px; height: 19px; border-radius: 50%; object-fit: cover; border: 1px solid #f97316; }
          .print-table .name-cell { font-weight: 600; font-size: 11px; color: #111827; max-width: 65px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .print-table .badge { padding: 1px 3px; border-radius: 6px; font-size: 11px; font-weight: 600; display: inline-block; white-space: nowrap; }
          .print-table .badge-orange { background: #ffedd5 !important; color: #9a3412 !important; }
          .print-table .badge-red { background: #fee2e2 !important; color: #991b1b !important; }
          .print-table .badge-indigo { background: #e0e7ff !important; color: #3730a3 !important; }
          @page { size: A4 portrait; margin: 3mm; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
        }
        .print-only { display: none; }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3 md:p-4 shadow-lg no-print">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-white">
            <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              সদস্য তালিকা
            </h3>
            <p className="text-xs text-orange-100 mt-0.5">মোট {membersData.length} জন সদস্য</p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white/20 rounded-lg p-0.5 md:p-1">
            <button
              onClick={() => setViewMode('card')}
              className={cn(
                "flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition",
                viewMode === 'card' ? "bg-white text-orange-600 shadow" : "text-white hover:bg-white/10"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">কার্ড</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition",
                viewMode === 'list' ? "bg-white text-orange-600 shadow" : "text-white hover:bg-white/10"
              )}
            >
              <List className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">লিস্ট</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none px-3 py-2 bg-white/20 text-white rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-white/30 active:scale-95 transition text-xs md:text-sm"
          >
            <Printer className="w-3.5 h-3.5 md:w-4 md:h-4" />
            প্রিন্ট
          </button>
          <button
            onClick={handlePdfDownload}
            className="flex-1 md:flex-none px-3 py-2 bg-white text-orange-600 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-orange-50 active:scale-95 transition shadow text-xs md:text-sm"
          >
            <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* ── Print Section ── */}
      <div className="print-section">
        {/* Print Only */}
        <div className="print-container print-only">
          <div className="print-header">
            <h1>🙏 কলম হিন্দু ধর্মসভা - সদস্য তালিকা</h1>
            <span className="member-count">👥 মোট {membersData.length} জন</span>
          </div>
          <table className="print-table">
            <thead>
              <tr>
                <th style={{width:'4%'}}>#</th>
                <th style={{width:'6%'}}>ছবি</th>
                <th style={{width:'16%'}}>নাম</th>
                <th style={{width:'11%'}}>পদবী</th>
                <th style={{width:'14%'}}>ফোন</th>
                <th style={{width:'22%'}}>ইমেইল</th>
                <th style={{width:'9%'}}>রক্ত</th>
                <th style={{width:'11%'}}>গোত্র</th>
              </tr>
            </thead>
            <tbody>
              {membersData.map((member, index) => (
                <tr key={member.id}>
                  <td style={{textAlign:'center'}}>{index + 1}</td>
                  <td style={{textAlign:'center'}}>
                    <img src={member.photo} alt="" className="print-photo"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }} />
                  </td>
                  <td className="name-cell">{member.name}</td>
                  <td style={{textAlign:'center'}}><span className="badge badge-orange">{member.designation}</span></td>
                  <td style={{textAlign:'center'}}>{member.mobile}</td>
                  <td style={{textAlign:'center',fontSize:'10px'}}>{member.email || '—'}</td>
                  <td style={{textAlign:'center'}}><span className="badge badge-red">{member.bloodGroup}</span></td>
                  <td style={{textAlign:'center'}}>{member.gotra ? <span className="badge badge-indigo">{member.gotra}</span> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Card View ── */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 no-print">
            {membersData.map((member) => (
              <div key={member.id} className="bg-white rounded-xl p-3 md:p-4 shadow-md hover:shadow-lg transition-all border border-gray-100 active:scale-[0.99]">
                <div className="flex items-center gap-3 mb-3">
                  {/* Photo */}
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-orange-200 shadow flex-shrink-0">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                    />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base truncate">{member.name}</h3>
                    <p className="text-orange-600 text-xs md:text-sm font-medium truncate">{member.designation}</p>
                    <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {member.mobile}
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 items-center mb-3 pb-2.5 border-b border-gray-100">
                  <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    #{member.id.padStart(3, '0')}
                  </span>
                  <span className="text-[11px] text-red-600 bg-red-100 px-2 py-0.5 rounded font-medium">
                    🩸 {member.bloodGroup}
                  </span>
                </div>

                {/* Detail Button */}
                <button
                  onClick={() => setShowMemberDetails(member)}
                  className="w-full py-2 md:py-2.5 bg-orange-500 text-white rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-orange-600 active:scale-95 transition"
                >
                  <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  বিস্তারিত দেখুন
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── List View ── */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden no-print">
            {/* Desktop Table Header */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <tr>
                    <th className="px-3 py-3 text-center font-semibold w-12">#</th>
                    <th className="px-3 py-3 text-center font-semibold w-16">ছবি</th>
                    <th className="px-3 py-3 text-left font-semibold">নাম</th>
                    <th className="px-3 py-3 text-center font-semibold">পদবী</th>
                    <th className="px-3 py-3 text-left font-semibold">মোবাইল</th>
                    <th className="px-3 py-3 text-center font-semibold">রক্ত</th>
                    <th className="px-3 py-3 text-center font-semibold">গোত্র</th>
                    <th className="px-3 py-3 text-center font-semibold w-24">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {membersData.map((member, index) => (
                    <tr key={member.id} className="hover:bg-orange-50 transition">
                      <td className="px-3 py-3 text-center text-gray-500 font-medium">{index + 1}</td>
                      <td className="px-3 py-3 text-center">
                        <img src={member.photo} alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-orange-200 mx-auto"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-semibold text-gray-800">{member.name}</div>
                        <div className="text-xs text-gray-400">#{member.id.padStart(3, '0')}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">{member.designation}</span>
                      </td>
                      <td className="px-3 py-3">
                        <a href={`tel:${member.mobile}`} className="text-gray-600 hover:text-orange-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" />{member.mobile}
                        </a>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">🩸 {member.bloodGroup}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {member.gotra ? <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full">🔱 {member.gotra}</span> : '—'}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button onClick={() => setShowMemberDetails(member)}
                          className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-orange-600 transition mx-auto">
                          <Eye className="w-3 h-3" /> বিস্তারিত
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="md:hidden">
              <div className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold">
                মোট {membersData.length} জন সদস্য
              </div>
              <div className="divide-y divide-gray-100">
                {membersData.map((member, index) => (
                  <div key={member.id} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-orange-50 active:bg-orange-100 transition">
                    {/* Serial */}
                    <span className="text-[11px] text-gray-400 font-bold w-5 flex-shrink-0 text-center">
                      {index + 1}
                    </span>

                    {/* Photo */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200 flex-shrink-0">
                      <img src={member.photo} alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{member.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full">
                          {member.designation}
                        </span>
                        <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                          🩸{member.bloodGroup}
                        </span>
                      </div>
                    </div>

                    {/* Detail Button */}
                    <button
                      onClick={() => setShowMemberDetails(member)}
                      className="flex-shrink-0 w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center active:scale-95 transition shadow-md"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Member Details Modal ── */}
      {showMemberDetails && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center p-0 md:p-4 no-print"
          onClick={() => setShowMemberDetails(null)}
        >
          <div
            className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle - mobile */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 md:p-4 flex justify-between items-center md:rounded-t-2xl">
              <h2 className="text-base md:text-xl font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 md:w-5 md:h-5" /> সদস্য বিস্তারিত
              </h2>
              <button onClick={() => setShowMemberDetails(null)}
                className="text-white hover:bg-white/20 p-1.5 md:p-2 rounded-full transition">
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="p-4 md:p-6">
              {/* Profile Row */}
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-xl overflow-hidden border-4 border-orange-200 shadow-lg flex-shrink-0">
                  <img src={showMemberDetails.photo} alt={showMemberDetails.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }} />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800">{showMemberDetails.name}</h3>
                  <p className="text-orange-600 font-semibold text-sm md:text-lg">{showMemberDetails.designation}</p>
                  <p className="text-gray-500 text-xs mt-1">সদস্য নং: #{showMemberDetails.id.padStart(3, '0')}</p>
                  <p className="text-red-600 font-medium text-xs mt-1">🩸 {showMemberDetails.bloodGroup}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                {[
                  { label: '📱 মোবাইল', value: showMemberDetails.mobile },
                  { label: '📧 ইমেইল', value: showMemberDetails.email || '—', small: true },
                  { label: '👨 পিতার নাম', value: showMemberDetails.fatherName || '—' },
                  { label: '👩 মাতার নাম', value: showMemberDetails.motherName || '—' },
                  { label: '🔱 গোত্র', value: showMemberDetails.gotra || '—' },
                  { label: '💼 পেশা', value: showMemberDetails.occupation || '—' },
                ].map((item, i) => (
                  <div key={i} className="bg-orange-50 p-2.5 md:p-3 rounded-xl">
                    <p className="text-[10px] md:text-xs text-orange-500 font-medium mb-0.5 md:mb-1">{item.label}</p>
                    <p className={cn("font-semibold text-gray-800", item.small ? 'text-xs break-all' : 'text-xs md:text-sm')}>
                      {item.value}
                    </p>
                  </div>
                ))}

                <div className="bg-orange-50 p-2.5 md:p-3 rounded-xl col-span-2">
                  <p className="text-[10px] md:text-xs text-orange-500 font-medium mb-0.5 md:mb-1">📍 বর্তমান ঠিকানা</p>
                  <p className="font-semibold text-gray-800 text-xs md:text-sm">{showMemberDetails.address}</p>
                </div>
                <div className="bg-orange-50 p-2.5 md:p-3 rounded-xl col-span-2">
                  <p className="text-[10px] md:text-xs text-orange-500 font-medium mb-0.5 md:mb-1">🏠 স্থায়ী ঠিকানা</p>
                  <p className="font-semibold text-gray-800 text-xs md:text-sm">{showMemberDetails.permanentAddress || '—'}</p>
                </div>
              </div>

              {/* Call Button */}
              <div className="mt-4 md:mt-6">
                <a href={`tel:${showMemberDetails.mobile}`}
                  className="w-full py-2.5 md:py-3 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600 active:scale-95 transition text-sm md:text-base">
                  <Phone className="w-4 h-4 md:w-5 md:h-5" /> কল করুন
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
