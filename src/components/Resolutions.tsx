import React, { useState, useEffect } from 'react';
import { FileText, Calendar, DollarSign, Eye, Printer, Building } from 'lucide-react';

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
  const [data, setData] = useState<ResolutionsData>({ meetingDecisions: [], fundAllocations: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'decisions' | 'funds'>('decisions');

  useEffect(() => {
    fetch('/data/resolutions.json')
      .then(res => res.json())
      .then(jsonData => { setData(jsonData); setLoading(false); })
      .catch(error => { console.error('Error loading resolutions:', error); setLoading(false); });
  }, []);

  const handleViewPDF = (pdfUrl: string) => window.open(pdfUrl, '_blank');

  const handlePrintPDF = (pdfUrl: string, title: string) => {
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => { printWindow.document.title = title; printWindow.print(); };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentList = activeTab === 'decisions' ? data.meetingDecisions : data.fundAllocations;
  const isEmpty = currentList.length === 0;

  return (
    <div className="space-y-3 md:space-y-4">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-3 md:p-4 shadow-lg">
        <div className="text-white text-center mb-3">
          <h3 className="font-bold text-base md:text-lg flex items-center gap-2 justify-center">
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
            রেজুলেশন সমূহ
          </h3>
          <p className="text-xs md:text-sm text-orange-100">সিদ্ধান্ত ও অনুদান বরাদ্ধের তথ্য</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-white/20 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('decisions')}
            className={`flex-1 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-medium transition flex items-center justify-center gap-1.5 md:gap-2 ${
              activeTab === 'decisions' ? 'bg-white text-orange-600 shadow' : 'text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
            মিটিং সিদ্ধান্ত
            {data.meetingDecisions.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'decisions' ? 'bg-orange-100 text-orange-600' : 'bg-white/20 text-white'
              }`}>
                {data.meetingDecisions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('funds')}
            className={`flex-1 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-medium transition flex items-center justify-center gap-1.5 md:gap-2 ${
              activeTab === 'funds' ? 'bg-white text-orange-600 shadow' : 'text-white hover:bg-white/10'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4" />
            অনুদান বরাদ্ধ
            {data.fundAllocations.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'funds' ? 'bg-orange-100 text-orange-600' : 'bg-white/20 text-white'
              }`}>
                {data.fundAllocations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Empty State ── */}
      {isEmpty && (
        <div className="text-center py-10 bg-white rounded-xl shadow-lg">
          {activeTab === 'decisions'
            ? <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            : <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          }
          <p className="text-gray-500 text-sm md:text-lg">
            {activeTab === 'decisions' ? 'কোনো সিদ্ধান্ত পাওয়া যায়নি' : 'কোনো অনুদান তথ্য পাওয়া যায়নি'}
          </p>
        </div>
      )}

      {/* ── Decisions List ── */}
      {activeTab === 'decisions' && !isEmpty && (
        <div className="space-y-2.5 md:space-y-3">
          {data.meetingDecisions.map((decision, index) => (
            <div key={decision.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">

              {/* Mobile */}
              <div className="md:hidden p-3">
                <div className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-orange-100 text-orange-600 rounded-full font-bold text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-sm leading-snug">{decision.title}</h4>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {decision.date}
                      </span>
                      {decision.category && (
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[11px] font-medium">
                          {decision.category}
                        </span>
                      )}
                    </div>
                    {/* Buttons */}
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => handleViewPDF(decision.pdfUrl)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> PDF দেখুন
                      </button>
                      <button
                        onClick={() => handlePrintPDF(decision.pdfUrl, decision.title)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition"
                      >
                        <Printer className="w-3.5 h-3.5" /> প্রিন্ট
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop */}
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
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleViewPDF(decision.pdfUrl)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
                  >
                    <Eye className="w-4 h-4" /> PDF দেখুন
                  </button>
                  <button
                    onClick={() => handlePrintPDF(decision.pdfUrl, decision.title)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
                  >
                    <Printer className="w-4 h-4" /> প্রিন্ট
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── Funds List ── */}
      {activeTab === 'funds' && !isEmpty && (
        <div className="space-y-2.5 md:space-y-3">
          {data.fundAllocations.map((fund, index) => (
            <div key={fund.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">

              {/* Mobile */}
              <div className="md:hidden p-3">
                {/* Left accent bar */}
                <div className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-green-100 text-green-600 rounded-full font-bold text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-sm leading-snug">{fund.title}</h4>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {fund.date}
                      </span>
                      {fund.amount && (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
                          {fund.amount}
                        </span>
                      )}
                    </div>

                    {fund.source && (
                      <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                        <Building className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{fund.source}</span>
                      </p>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => handleViewPDF(fund.pdfUrl)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> PDF দেখুন
                      </button>
                      <button
                        onClick={() => handlePrintPDF(fund.pdfUrl, fund.title)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition"
                      >
                        <Printer className="w-3.5 h-3.5" /> প্রিন্ট
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop */}
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
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleViewPDF(fund.pdfUrl)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
                  >
                    <Eye className="w-4 h-4" /> PDF দেখুন
                  </button>
                  <button
                    onClick={() => handlePrintPDF(fund.pdfUrl, fund.title)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
                  >
                    <Printer className="w-4 h-4" /> প্রিন্ট
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Resolutions;
