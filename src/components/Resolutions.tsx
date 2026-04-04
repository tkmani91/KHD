import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Eye, 
  Printer,
  Search,
  X,
  Building
} from 'lucide-react';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface Resolution {
  id: number;
  title: string;
  date: string;
  category?: string;
  pdfUrl: string;
  amount?: string;
  source?: string;
}

interface ResolutionsData {
  meetingDecisions: Resolution[];
  fundAllocations: Resolution[];
}

const Resolutions: React.FC = () => {
  const [data, setData] = useState<ResolutionsData>({
    meetingDecisions: [],
    fundAllocations: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'decisions' | 'funds'>('decisions');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/data/resolutions.json')
      .then(res => res.json())
      .then(jsonData => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading resolutions:', error);
        setLoading(false);
      });
  }, []);

  // ============================================
  // SEARCH FILTER
  // ============================================
  const filteredDecisions = useMemo(() => {
    if (!searchQuery.trim()) return data.meetingDecisions;
    const query = searchQuery.toLowerCase().trim();
    return data.meetingDecisions.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.date.includes(query) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  }, [data.meetingDecisions, searchQuery]);

  const filteredFunds = useMemo(() => {
    if (!searchQuery.trim()) return data.fundAllocations;
    const query = searchQuery.toLowerCase().trim();
    return data.fundAllocations.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.date.includes(query) ||
      (item.source && item.source.toLowerCase().includes(query)) ||
      (item.amount && item.amount.includes(query))
    );
  }, [data.fundAllocations, searchQuery]);

  const handleViewPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  // ============================================
  // PRINT FUNCTION
  // ============================================
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = activeTab === 'decisions' 
      ? 'মিটিং-সিদ্ধান্ত-কলম-হিন্দু-ধর্মসভা' 
      : 'অনুদান-বরাদ্ধ-কলম-হিন্দু-ধর্মসভা';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentData = activeTab === 'decisions' ? filteredDecisions : filteredFunds;
  const totalCount = activeTab === 'decisions' ? data.meetingDecisions.length : data.fundAllocations.length;

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
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
            color: white !important;
            padding: 6px 12px;
            border-radius: 6px;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .print-header h1 {
            font-size: 14px;
            font-weight: 700;
            margin: 0;
          }
          
          .print-header .count {
            background: white !important;
            color: #ea580c !important;
            padding: 2px 8px;
            border-radius: 11px;
            font-size: 12px;
            font-weight: 700;
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
            font-size: 11px;
            border: 1px solid #374151;
          }
          
          .print-table th {
            background: #1f2937 !important;
            color: white !important;
            padding: 4px 2px;
            font-weight: 700;
            font-size: 11px;
            border: 1px solid #4b5563;
          }
          
          .print-table td {
            padding: 3px;
            border: 1px solid #d1d5db;
            vertical-align: middle;
            font-size: 11px;
            line-height: 1.2;
          }
          
          .print-table tbody tr:nth-child(even) {
            background: #f3f4f6 !important;
          }
          
          .print-table .serial {
            text-align: center;
            font-weight: bold;
            color: #ea580c;
            width: 8%;
          }
          
          .print-footer {
            margin-top: 10px;
            padding-top: 6px;
            border-top: 2px solid #ea580c;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
          
          @page {
            size: A4 portrait;
            margin: 3mm;
          }
          
          tr {
            page-break-inside: avoid;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>

      {/* ============================================ */}
      {/* HEADER - Screen Only */}
      {/* ============================================ */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-4 shadow-lg no-print">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Title */}
          <div className="text-white text-center lg:text-left">
            <h3 className="font-bold text-lg flex items-center gap-2 justify-center lg:justify-start">
              <FileText className="w-5 h-5" /> রেজুলেশন সমূহ
            </h3>
            <p className="text-sm text-orange-100">
              সিদ্ধান্ত ও অনুদান বরাদ্ধের তথ্য
              {searchQuery && ` | ফলাফল: ${currentData.length} টি`}
            </p>
          </div>

          {/* Tab Toggle & Print */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {/* Tab Toggle */}
            <div className="flex bg-white/20 rounded-lg p-1">
              <button
                onClick={() => { setActiveTab('decisions'); setSearchQuery(''); }}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-1",
                  activeTab === 'decisions' 
                    ? "bg-white text-orange-600 shadow" 
                    : "text-white hover:bg-white/10"
                )}
              >
                <FileText className="w-4 h-4" /> সিদ্ধান্ত
              </button>
              <button
                onClick={() => { setActiveTab('funds'); setSearchQuery(''); }}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-1",
                  activeTab === 'funds' 
                    ? "bg-white text-orange-600 shadow" 
                    : "text-white hover:bg-white/10"
                )}
              >
                <DollarSign className="w-4 h-4" /> অনুদান
              </button>
            </div>

            {/* Print Button */}
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium flex items-center gap-2 hover:bg-orange-50 transition shadow"
            >
              <Printer className="w-4 h-4" /> প্রিন্ট
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-300" />
          <input
            type="text"
            placeholder={activeTab === 'decisions' ? "সিদ্ধান্ত খুঁজুন..." : "অনুদান খুঁজুন..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-orange-200 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* PRINT SECTION */}
      {/* ============================================ */}
      <div className="print-section">
        {/* Print Only Content */}
        <div className="print-container print-only">
          <div className="print-header">
            <h1>📋 কলম হিন্দু ধর্মসভা - {activeTab === 'decisions' ? 'মিটিং সিদ্ধান্ত সমূহ' : 'অনুদান বরাদ্ধ প্রাপ্তি'}</h1>
            <span className="count">মোট {currentData.length} টি</span>
          </div>
          
          <div className="print-date">
            প্রিন্টের তারিখ: {new Date().toLocaleDateString('bn-BD')}
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th>ক্রম</th>
                <th>শিরোনাম</th>
                <th>তারিখ</th>
                {activeTab === 'decisions' ? <th>ক্যাটাগরি</th> : <th>পরিমাণ</th>}
                {activeTab === 'funds' && <th>উৎস</th>}
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id}>
                  <td className="serial">{index + 1}</td>
                  <td style={{ fontWeight: 600 }}>{item.title}</td>
                  <td style={{ textAlign: 'center' }}>{item.date}</td>
                  {activeTab === 'decisions' ? (
                    <td style={{ textAlign: 'center' }}>{item.category || '-'}</td>
                  ) : (
                    <td style={{ textAlign: 'center', color: '#059669', fontWeight: 600 }}>{item.amount || '-'}</td>
                  )}
                  {activeTab === 'funds' && (
                    <td style={{ textAlign: 'center' }}>{item.source || '-'}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="print-footer">
            <p>© {new Date().getFullYear()} কলম হিন্দু ধর্মসভা | কলম, সিংড়া, নাটোর</p>
          </div>
        </div>

        {/* ============================================ */}
        {/* NO RESULTS - Screen Only */}
        {/* ============================================ */}
        {currentData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg no-print">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">কোনো তথ্য পাওয়া যায়নি</p>
            <p className="text-gray-400 text-sm mt-1">অন্য কীওয়ার্ড দিয়ে খুঁজুন</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              সব দেখুন
            </button>
          </div>
        )}

        {/* ============================================ */}
        {/* DECISIONS LIST - Screen Only */}
        {/* ============================================ */}
        {activeTab === 'decisions' && filteredDecisions.length > 0 && (
          <div className="space-y-3 no-print">
            <div className="text-sm text-gray-500 px-1">
              মোট {totalCount} টি সিদ্ধান্ত
              {searchQuery && ` | ফলাফল: ${filteredDecisions.length} টি`}
            </div>
            {filteredDecisions.map((decision, index) => (
              <div
                key={decision.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Mobile View */}
                <div className="md:hidden p-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm leading-snug">{decision.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {decision.date}
                        </span>
                        {decision.category && (
                          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            {decision.category}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleViewPDF(decision.pdfUrl)}
                        className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> PDF দেখুন
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:flex items-center justify-between p-4 gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-600 rounded-full font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800">{decision.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {decision.date}
                        </span>
                        {decision.category && (
                          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                            {decision.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewPDF(decision.pdfUrl)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 flex-shrink-0"
                  >
                    <Eye className="w-4 h-4" /> PDF দেখুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================ */}
        {/* FUNDS LIST - Screen Only */}
        {/* ============================================ */}
        {activeTab === 'funds' && filteredFunds.length > 0 && (
          <div className="space-y-3 no-print">
            <div className="text-sm text-gray-500 px-1">
              মোট {totalCount} টি অনুদান
              {searchQuery && ` | ফলাফল: ${filteredFunds.length} টি`}
            </div>
            {filteredFunds.map((fund, index) => (
              <div
                key={fund.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Mobile View */}
                <div className="md:hidden p-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm leading-snug">{fund.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {fund.date}
                        </span>
                        {fund.amount && (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                            {fund.amount}
                          </span>
                        )}
                      </div>
                      {fund.source && (
                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                          <Building className="w-3 h-3" /> {fund.source}
                        </p>
                      )}
                      <button
                        onClick={() => handleViewPDF(fund.pdfUrl)}
                        className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> PDF দেখুন
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:flex items-center justify-between p-4 gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-full font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800">{fund.title}</h4>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {fund.date}
                        </span>
                        {fund.amount && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                            {fund.amount}
                          </span>
                        )}
                        {fund.source && (
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Building className="w-4 h-4" /> {fund.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewPDF(fund.pdfUrl)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 flex-shrink-0"
                  >
                    <Eye className="w-4 h-4" /> PDF দেখুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resolutions;
