import React, { useState, useEffect } from 'react';
import { FileText, Calendar, DollarSign, Eye, Printer } from 'lucide-react';

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

  useEffect(() => {
    fetch('/data/resolutions.json')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading resolutions:', error);
        setLoading(false);
      });
  }, []);

  const handleViewPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const handlePrint = (item: Resolution) => {
    const printWindow = window.open(item.pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-t-lg">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileText className="w-8 h-8" />
          রেজুলেশন সমূহ
        </h1>
        <p className="mt-2 opacity-90">সিদ্ধান্ত ও অনুদান বরাদ্ধের তথ্য</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b">
        <button
          onClick={() => setActiveTab('decisions')}
          className={`flex-1 py-4 px-6 font-semibold transition-colors ${
            activeTab === 'decisions'
              ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            মিটিং এর সিদ্ধান্ত সমূহ
          </div>
        </button>
        <button
          onClick={() => setActiveTab('funds')}
          className={`flex-1 py-4 px-6 font-semibold transition-colors ${
            activeTab === 'funds'
              ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <DollarSign className="w-5 h-5" />
            অনুদান বরাদ্ধ প্রাপ্তি
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-lg shadow-lg">
        {activeTab === 'decisions' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">মিটিং এর সিদ্ধান্ত সমূহ</h2>
            <div className="space-y-4">
              {data.meetingDecisions.length > 0 ? (
                data.meetingDecisions.map((decision) => (
                  <div
                    key={decision.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-orange-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {decision.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {decision.date}
                          </span>
                          {decision.category && (
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                              {decision.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleViewPDF(decision.pdfUrl)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                          title="দেখুন"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handlePrint(decision)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                          title="প্রিন্ট করুন"
                        >
                          <Printer className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>কোনো সিদ্ধান্ত পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'funds' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">অনুদান বরাদ্ধ প্রাপ্তি সমূহ</h2>
            <div className="space-y-4">
              {data.fundAllocations.length > 0 ? (
                data.fundAllocations.map((fund) => (
                  <div
                    key={fund.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-green-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {fund.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {fund.date}
                          </span>
                          {fund.amount && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                              {fund.amount}
                            </span>
                          )}
                        </div>
                        {fund.source && (
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">উৎস:</span> {fund.source}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleViewPDF(fund.pdfUrl)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                          title="দেখুন"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handlePrint(fund)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                          title="প্রিন্ট করুন"
                        >
                          <Printer className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>কোনো অনুদান তথ্য পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resolutions;
