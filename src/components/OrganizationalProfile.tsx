import React, { useState, useEffect, useRef } from 'react';
import { Users, Printer } from 'lucide-react';

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
  const printRef = useRef<HTMLDivElement>(null);

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
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const title = 'সাংগঠনিক প্রোফাইল - নেতৃত্বের তালিকা';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 8mm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Noto Sans Bengali', 'Kalpurush', Arial, sans-serif;
            background: white;
            font-size: 10px;
            line-height: 1.2;
          }
          .print-header {
            text-align: center;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 2px solid #333;
          }
          .print-header h1 {
            font-size: 16px;
            color: #333;
            margin-bottom: 2px;
          }
          .print-header p {
            font-size: 11px;
            color: #666;
          }
          .print-date {
            text-align: right;
            font-size: 9px;
            color: #888;
            margin-bottom: 6px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #444;
            padding: 4px 3px;
            text-align: center;
            font-size: 9px;
            vertical-align: middle;
          }
          th {
            background-color: #e8e8e8;
            font-weight: bold;
            color: #333;
            padding: 5px 3px;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .photo-cell {
            width: 30px;
            padding: 2px;
          }
          .photo-cell img {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            object-fit: cover;
            border: 1px solid #ccc;
          }
          .photo-placeholder {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            background: #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            margin: 0 auto;
          }
          .serial-cell {
            width: 25px;
            font-weight: bold;
          }
          .name-cell {
            text-align: left;
            padding-left: 5px;
            font-weight: 500;
          }
          .position-cell {
            width: 60px;
          }
          .tenure-cell {
            width: 70px;
          }
          .status-cell {
            width: 45px;
          }
          .current-badge {
            background: #22c55e;
            color: white;
            padding: 1px 4px;
            border-radius: 8px;
            font-size: 7px;
            font-weight: bold;
          }
          .completed-badge {
            color: #888;
            font-size: 8px;
          }
          .footer {
            margin-top: 10px;
            text-align: center;
            font-size: 8px;
            color: #888;
            border-top: 1px solid #ddd;
            padding-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>🏛️ সাংগঠনিক প্রোফাইল</h1>
          <p>নেতৃত্বের সংক্ষিপ্ত তালিকা</p>
        </div>
        <div class="print-date">
          প্রিন্ট তারিখ: ${new Date().toLocaleDateString('bn-BD')}
        </div>
        ${printContent.innerHTML}
        <div class="footer">
          © ${new Date().getFullYear()} - কলম হিন্দু ধর্মসভা
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-t-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Users className="w-7 h-7 md:w-8 md:h-8" />
              সাংগঠনিক প্রোফাইল
            </h1>
            <p className="mt-2 opacity-90 text-sm md:text-base">নেতৃত্বের সংক্ষিপ্ত তালিকা</p>
          </div>
          <button
            onClick={handlePrint}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <Printer className="w-5 h-5" />
            প্রিন্ট করুন
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-b-lg shadow-lg p-4 md:p-6">
        {/* Printable Table */}
        <div ref={printRef} className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 min-w-[600px]">
            <thead>
              <tr className="bg-gradient-to-r from-purple-100 to-indigo-100">
                <th className="border border-gray-300 px-3 py-3 text-center font-semibold w-16 serial-cell">ক্রমিক</th>
                <th className="border border-gray-300 px-3 py-3 text-center font-semibold w-20 photo-cell">ছবি</th>
                <th className="border border-gray-300 px-3 py-3 text-left font-semibold name-cell">নাম</th>
                <th className="border border-gray-300 px-3 py-3 text-center font-semibold position-cell">পদবি</th>
                <th className="border border-gray-300 px-3 py-3 text-center font-semibold tenure-cell">মেয়াদকাল</th>
                <th className="border border-gray-300 px-3 py-3 text-center font-semibold w-24 status-cell">অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {data.leaders.length > 0 ? (
                data.leaders.map((leader, index) => (
                  <tr key={leader.id} className="hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-300 px-3 py-3 text-center font-medium serial-cell">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-center photo-cell">
                      {leader.photo ? (
                        <img
                          src={leader.photo}
                          alt={leader.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 mx-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mx-auto border-2 border-purple-200 photo-placeholder">
                          <span className="text-xl">👤</span>
                        </div>
                      )}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 font-medium text-gray-800 name-cell">
                      {leader.name}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-center position-cell">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {leader.position}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-center text-gray-600 tenure-cell">
                      {leader.tenure}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-center status-cell">
                      {leader.current ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold current-badge">
                          বর্তমান
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm completed-badge">সমাপ্ত</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="border border-gray-300 px-3 py-12 text-center text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>কোনো তথ্য পাওয়া যায়নি</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalProfile;
