import React, { useState, useEffect } from 'react';
import { Users, Printer, Crown, FileText, Wallet, Calendar, CheckCircle, Clock } from 'lucide-react';

interface MemberData {
  id: string;
  name: string;
  photo: string;
}

interface PositionData {
  memberId: string;
  position: string;
}

interface Committee {
  id: number;
  tenure: string;
  current: boolean;
  president: PositionData;
  secretary: PositionData;
  treasurer: PositionData;
}

interface ProfileData {
  committees: Committee[];
}

interface MergedPosition {
  position: string;
  memberId: string;
  name: string;
  photo: string;
}

interface MergedCommittee {
  id: number;
  tenure: string;
  current: boolean;
  members: MergedPosition[];
}

const OrganizationalProfile: React.FC = () => {
  const [mergedCommittees, setMergedCommittees] = useState<MergedCommittee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, membersRes] = await Promise.all([
          fetch('/data/organizationalProfile.json'),
          fetch('https://raw.githubusercontent.com/tkmani91/KHD/main/members-data.json')
        ]);

        const profileData: ProfileData = await profileRes.json();
        const membersJson = await membersRes.json();
        const membersMap = new Map<string, MemberData>();
        
        (membersJson.members || []).forEach((m: MemberData) => {
          membersMap.set(m.id, m);
        });

        // Merge committees with member data
        const merged: MergedCommittee[] = (profileData.committees || []).map((committee) => {
          const positions: MergedPosition[] = [];

          // President
          if (committee.president?.memberId) {
            const member = membersMap.get(committee.president.memberId);
            positions.push({
              position: committee.president.position || 'সভাপতি',
              memberId: committee.president.memberId,
              name: member?.name || 'নাম পাওয়া যায়নি',
              photo: member?.photo || ''
            });
          }

          // Secretary
          if (committee.secretary?.memberId) {
            const member = membersMap.get(committee.secretary.memberId);
            positions.push({
              position: committee.secretary.position || 'সাধারণ সম্পাদক',
              memberId: committee.secretary.memberId,
              name: member?.name || 'নাম পাওয়া যায়নি',
              photo: member?.photo || ''
            });
          }

          // Treasurer
          if (committee.treasurer?.memberId) {
            const member = membersMap.get(committee.treasurer.memberId);
            positions.push({
              position: committee.treasurer.position || 'অর্থ সম্পাদক / কোষাধ্যক্ষ',
              memberId: committee.treasurer.memberId,
              name: member?.name || 'নাম পাওয়া যায়নি',
              photo: member?.photo || ''
            });
          }

          return {
            id: committee.id,
            tenure: committee.tenure,
            current: committee.current,
            members: positions
          };
        });

        // Sort: current first, then by tenure descending
        merged.sort((a, b) => {
          if (a.current && !b.current) return -1;
          if (!a.current && b.current) return 1;
          return b.tenure.localeCompare(a.tenure);
        });

        setMergedCommittees(merged);
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

  const getPositionIcon = (position: string) => {
    if (position.includes('সভাপতি')) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (position.includes('সম্পাদক')) return <FileText className="w-5 h-5 text-blue-500" />;
    if (position.includes('কোষাধ্যক্ষ') || position.includes('অর্থ')) return <Wallet className="w-5 h-5 text-green-500" />;
    return <Users className="w-5 h-5 text-gray-500" />;
  };

  const getPositionColor = (position: string) => {
    if (position.includes('সভাপতি')) return 'from-yellow-400 to-orange-500';
    if (position.includes('সম্পাদক')) return 'from-blue-400 to-indigo-500';
    if (position.includes('কোষাধ্যক্ষ') || position.includes('অর্থ')) return 'from-green-400 to-emerald-500';
    return 'from-gray-400 to-gray-500';
  };

  const currentCommittee = mergedCommittees.find(c => c.current);
  const historyCommittees = mergedCommittees.filter(c => !c.current);

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
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 shadow-lg no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-left">
            <h3 className="font-bold text-lg flex items-center gap-2 justify-center sm:justify-start">
              <Users className="w-5 h-5" /> সাংগঠনিক প্রোফাইল
            </h3>
            <p className="text-sm text-purple-100">কার্যনির্বাহী কমিটি</p>
          </div>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium flex items-center gap-2 hover:bg-purple-50 transition shadow"
          >
            <Printer className="w-4 h-4" /> প্রিন্ট
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="mt-4 flex bg-white/20 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
              activeTab === 'current' 
                ? "bg-white text-purple-600 shadow" 
                : "text-white hover:bg-white/10"
            }`}
          >
            <CheckCircle className="w-4 h-4" /> বর্তমান কমিটি
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
              activeTab === 'history' 
                ? "bg-white text-purple-600 shadow" 
                : "text-white hover:bg-white/10"
            }`}
          >
            <Clock className="w-4 h-4" /> পূর্ববর্তী কমিটি ({historyCommittees.length})
          </button>
        </div>
      </div>

      {/* PRINT SECTION */}
      <div className="print-section">
        {/* Print Header */}
        <div className="print-only bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-lg mb-4">
          <h1 className="text-xl font-bold text-center">🏛️ কলম হিন্দু ধর্মসভা</h1>
          <p className="text-center text-purple-100">সাংগঠনিক প্রোফাইল - কার্যনির্বাহী কমিটি</p>
          <p className="text-center text-xs mt-2">প্রিন্টের তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
        </div>

        {/* CURRENT COMMITTEE */}
        {activeTab === 'current' && currentCommittee && (
          <div className="space-y-4 no-print">
            {/* Tenure Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="text-lg font-bold text-purple-700">মেয়াদকাল: {currentCommittee.tenure}</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                ✅ বর্তমান
              </span>
            </div>

            {/* Members Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentCommittee.members.map((member, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  {/* Position Header */}
                  <div className={`bg-gradient-to-r ${getPositionColor(member.position)} p-3 text-white`}>
                    <div className="flex items-center justify-center gap-2">
                      {getPositionIcon(member.position)}
                      <span className="font-bold">{member.position}</span>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="p-4 text-center">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-purple-200 shadow-lg mb-3">
                      <img 
                        src={member.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                      />
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">{member.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORY COMMITTEES */}
        {activeTab === 'history' && (
          <div className="space-y-6 no-print">
            {historyCommittees.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">কোনো পূর্ববর্তী কমিটির তথ্য নেই</p>
              </div>
            ) : (
              historyCommittees.map((committee) => (
                <div key={committee.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Committee Header */}
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span className="font-bold text-lg">মেয়াদকাল: {committee.tenure}</span>
                      </div>
                      <span className="bg-gray-500 text-gray-100 px-3 py-1 rounded-full text-sm">
                        সমাপ্ত
                      </span>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {committee.members.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                            <img 
                              src={member.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                              alt={member.name}
                              className="w-full h-full object-cover grayscale"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-sm truncate">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.position}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* No Data */}
        {mergedCommittees.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg no-print">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">কোনো তথ্য পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationalProfile;
