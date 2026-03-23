import React, { useState } from 'react';
import { Users, Phone, Download, Eye, User, X } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white text-center sm:text-left">
          <h3 className="font-bold flex items-center gap-2 justify-center sm:justify-start">
            <Users className="w-5 h-5" /> সম্পূর্ণ সদস্য তালিকা
          </h3>
          <p className="text-sm text-orange-100">মোট {membersData.length} জন সদস্য</p>
        </div>
        <button 
          onClick={handlePdfDownload}
          className="px-5 py-2.5 bg-white text-orange-600 rounded-lg font-medium flex items-center gap-2 hover:bg-orange-50 transition shadow-lg"
        >
          <Download className="w-5 h-5" />PDF ডাউনলোড
        </button>
      </div>
      
      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Member Details Modal */}
      {showMemberDetails && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowMemberDetails(null)}>
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
