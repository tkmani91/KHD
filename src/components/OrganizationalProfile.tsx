import React, { useState, useEffect } from 'react';
import { Users, Calendar, Award, Printer, ChevronRight } from 'lucide-react';

interface Leader {
  id: number;
  name: string;
  position: string;
  startDate: string;
  endDate: string;
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
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading organizational profile:', error);
        setLoading(false);
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Group leaders by tenure
  const groupedLeaders = data.leaders.reduce((acc, leader) => {
    if (!acc[leader.tenure]) {
      acc[leader.tenure] = [];
    }
    acc[leader.tenure].push(leader);
    return acc;
  }, {} as Record<string, Leader[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-t-lg print:bg-white print:text-black">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8" />
              সাংগঠনিক প্রোফাইল
            </h1>
            <p className="mt-2 opacity-90">নেতৃত্বের ধারাবাহিকতা ও ইতিহাস</p>
          </div>
          <button
            onClick={handlePrint}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2 print:hidden"
          >
            <Printer className="w-5 h-5" />
            প্রিন্ট করুন
          </button>
        </div>
      </div>

      <div className="bg-white rounded-b-lg shadow-lg p-6">
        <div className="mb-8 print:mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            নেতৃত্বের কালক্রম
          </h2>
          <p className="text-gray-600">
            প্রতিষ্ঠানের সভাপতি ও সম্পাদকদের পূর্ণাঙ্গ তালিকা
          </p>
        </div>

        {/* Timeline View */}
        <div className="relative">
          {Object.entries(groupedLeaders).sort((a, b) => b[0].localeCompare(a[0])).map(([tenure, leaders], index) => {
            const isCurrent = leaders.some(l => l.current);
            
            return (
              <div key={tenure} className="mb-8 print:mb-6 print:break-inside-avoid">
                {/* Tenure Header */}
                <div className={`flex items-center gap-3 mb-4 ${isCurrent ? 'animate-pulse' : ''}`}>
                  <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-green-500' : 'bg-purple-400'}`}></div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {tenure}
                    {isCurrent && (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                        বর্তমান
                      </span>
                    )}
                  </h3>
                </div>

                {/* Leaders Cards */}
                <div className="ml-6 border-l-2 border-purple-200 pl-6 space-y-4 print:border-gray-300">
                  {leaders.map((leader) => (
                    <div
                      key={leader.id}
                      className={`bg-gradient-to-r ${
                        isCurrent
                          ? 'from-green-50 to-emerald-50 border-green-200'
                          : 'from-purple-50 to-indigo-50 border-purple-200'
                      } border-2 rounded-lg p-5 print:border print:border-gray-300 print:bg-white`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Photo */}
                        {leader.photo && (
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                            <img
                              src={leader.photo}
                              alt={leader.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=👤';
                              }}
                            />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800 mb-1">
                            {leader.name}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4 text-purple-600" />
                            <span className="text-purple-700 font-semibold">
                              {leader.position}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {leader.startDate} থেকে {leader.endDate}
                            </span>
                          </div>
                        </div>

                        {/* Arrow for succession */}
                        {index < Object.entries(groupedLeaders).length - 1 && (
                          <ChevronRight className="w-6 h-6 text-purple-300 print:hidden" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Table */}
        <div className="mt-12 print:mt-8 print:break-before-page">
          <h3 className="text-xl font-bold text-gray-800 mb-4">সংক্ষিপ্ত তালিকা</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-purple-100 print:bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">ক্রমিক</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">নাম</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">পদবি</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">মেয়াদকাল</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">অবস্থা</th>
                </tr>
              </thead>
              <tbody>
                {data.leaders.map((leader, index) => (
                  <tr key={leader.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-3 font-medium">{leader.name}</td>
                    <td className="border border-gray-300 px-4 py-3">{leader.position}</td>
                    <td className="border border-gray-300 px-4 py-3">{leader.tenure}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      {leader.current ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                          বর্তমান
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">সমাপ্ত</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:break-before-page {
            break-before: page;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default OrganizationalProfile;
