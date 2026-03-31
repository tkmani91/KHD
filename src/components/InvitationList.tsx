import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  MapPin, 
  User, 
  ChevronDown,
  Grid3X3,
  List,
  Printer,
  Filter,
  X,
  Users,
  Search
} from 'lucide-react';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface InvitationItem {
  id: string;
  personName: string;
  area: string;
  familyCount: number;
}

interface InvitationListProps {
  invitationData: InvitationItem[];
  pdfLink: string;
}

const InvitationListComponent: React.FC<InvitationListProps> = ({ invitationData, pdfLink }) => {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [expandedArea, setExpandedArea] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ============================================
  // এলাকা তালিকা বের করুন
  // ============================================
  const allAreas = useMemo(() => {
    const areas = [...new Set(invitationData.map(item => item.area))];
    return areas.sort();
  }, [invitationData]);

  // ============================================
  // ফিল্টার ও সার্চ
  // ============================================
  const filteredData = useMemo(() => {
    let data = invitationData;
    
    // এলাকা ফিল্টার
    if (selectedArea !== 'all') {
      data = data.filter(item => item.area === selectedArea);
    }
    
    // সার্চ ফিল্টার
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      data = data.filter(item => 
        item.personName.toLowerCase().includes(query) ||
        item.area.toLowerCase().includes(query)
      );
    }
    
    return data;
  }, [invitationData, selectedArea, searchQuery]);

  // ============================================
  // এলাকা অনুযায়ী গ্রুপ
  // ============================================
  const groupedInvitations = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      if (!acc[item.area]) acc[item.area] = [];
      acc[item.area].push(item);
      return acc;
    }, {} as { [key: string]: InvitationItem[] });
  }, [filteredData]);

  // ============================================
  // মোট সদস্য গণনা
  // ============================================
  const totalMembers = useMemo(() => {
    return filteredData.reduce((acc, item) => acc + item.familyCount, 0);
  }, [filteredData]);

  const totalAllMembers = useMemo(() => {
    return invitationData.reduce((acc, item) => acc + item.familyCount, 0);
  }, [invitationData]);

  // ============================================
  // PDF DOWNLOAD
  // ============================================
  const handlePdfDownload = () => {
    if (!pdfLink || pdfLink === '') {
      alert('❌ PDF লিংক এখনো যুক্ত হয়নি');
      return;
    }
    const link = document.createElement('a');
    link.href = pdfLink;
    link.download = 'নিমন্ত্রণ-তালিকা.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================================
  // PRINT FUNCTION
  // ============================================
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'নিমন্ত্রণ-তালিকা-কলম-হিন্দু-ধর্মসভা';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
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
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
            color: white !important;
            padding: 8px 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .print-header h1 {
            font-size: 16px;
            font-weight: 700;
            margin: 0;
          }
          
          .print-header .member-count {
            background: white !important;
            color: #15803d !important;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
          }
          
          .print-date {
            text-align: right;
            font-size: 10px;
            color: #666;
            margin-bottom: 8px;
          }
          
          .print-area-section {
            margin-bottom: 15px;
            page-break-inside: avoid;
          }
          
          .print-area-header {
            background: #f0fdf4 !important;
            border-left: 4px solid #16a34a !important;
            padding: 6px 12px;
            margin-bottom: 8px;
            border-radius: 0 6px 6px 0;
          }
          
          .print-area-header h2 {
            font-size: 13px;
            font-weight: 700;
            color: #166534;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .print-area-header .area-count {
            background: #16a34a !important;
            color: white !important;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            border: 1px solid #d1d5db;
          }
          
          .print-table th {
            background: #374151 !important;
            color: white !important;
            padding: 5px 8px;
            font-weight: 600;
            font-size: 10px;
            text-transform: uppercase;
            border: 1px solid #4b5563;
          }
          
          .print-table td {
            padding: 4px 8px;
            border: 1px solid #e5e7eb;
            vertical-align: middle;
          }
          
          .print-table tbody tr:nth-child(even) {
            background: #f9fafb !important;
          }
          
          .print-table .serial {
            text-align: center;
            font-weight: bold;
            color: #16a34a;
            width: 10%;
          }
          
          .print-table .name-cell {
            font-weight: 600;
            color: #111827;
          }
          
          .print-table .count-cell {
            text-align: center;
            font-weight: 700;
            color: #ea580c;
          }
          
          .print-footer {
            margin-top: 15px;
            padding-top: 8px;
            border-top: 2px solid #16a34a;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
          
          .print-summary {
            background: #fef3c7 !important;
            border: 2px solid #f59e0b !important;
            padding: 10px;
            border-radius: 8px;
            margin-top: 15px;
            text-align: center;
          }
          
          .print-summary h3 {
            font-size: 14px;
            color: #92400e;
            margin: 0;
          }
          
          @page {
            size: A4 portrait;
            margin: 5mm;
          }
          
          .print-area-section {
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
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 shadow-lg no-print">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Title */}
          <div className="text-white text-center lg:text-left">
            <h3 className="font-bold text-lg flex items-center gap-2 justify-center lg:justify-start">
              <FileText className="w-5 h-5" /> নিমন্ত্রণ তালিকা
            </h3>
            <p className="text-sm text-green-100">
              মোট {totalAllMembers} জন সদস্য | {allAreas.length} টি এলাকা
              {selectedArea !== 'all' && ` | ফিল্টার: ${totalMembers} জন`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {/* View Toggle */}
            <div className="flex bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-1",
                  viewMode === 'card' 
                    ? "bg-white text-green-600 shadow" 
                    : "text-white hover:bg-white/10"
                )}
              >
                <Grid3X3 className="w-4 h-4" /> কার্ড
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-1",
                  viewMode === 'list' 
                    ? "bg-white text-green-600 shadow" 
                    : "text-white hover:bg-white/10"
                )}
              >
                <List className="w-4 h-4" /> লিস্ট
              </button>
            </div>

            {/* Print Button */}
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-white/30 transition"
            >
              <Printer className="w-4 h-4" /> প্রিন্ট
            </button>

            {/* PDF Download */}
            <button 
              onClick={handlePdfDownload}
              className="px-4 py-2 bg-white text-green-600 rounded-lg font-medium flex items-center gap-2 hover:bg-green-50 transition shadow"
            >
              <Download className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-300" />
            <input
              type="text"
              placeholder="নাম বা এলাকা দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-green-200 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Area Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all" className="text-gray-800">সকল এলাকা</option>
              {allAreas.map(area => (
                <option key={area} value={area} className="text-gray-800">{area}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* PRINT SECTION */}
      {/* ============================================ */}
      <div className="print-section">
        {/* Print Only Content */}
        <div className="print-container print-only">
          {/* Header */}
          <div className="print-header">
            <h1>📋 কলম হিন্দু ধর্মসভা - নিমন্ত্রণ তালিকা</h1>
            <span className="member-count">👥 মোট {totalMembers} জন</span>
          </div>
          
          <div className="print-date">
            প্রিন্টের তারিখ: {new Date().toLocaleDateString('bn-BD')}
            {selectedArea !== 'all' && ` | এলাকা: ${selectedArea}`}
          </div>

          {/* Area wise tables */}
          {Object.entries(groupedInvitations).map(([area, items]) => {
            const areaTotal = items.reduce((sum, item) => sum + item.familyCount, 0);
            return (
              <div key={area} className="print-area-section">
                <div className="print-area-header">
                  <h2>
                    📍 {area}
                    <span className="area-count">{areaTotal} জন</span>
                  </h2>
                </div>
                <table className="print-table">
                  <thead>
                    <tr>
                      <th>ক্রম</th>
                      <th>নাম</th>
                      <th>সদস্য সংখ্যা</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="serial">{index + 1}</td>
                        <td className="name-cell">{item.personName}</td>
                        <td className="count-cell">{item.familyCount} জন</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}

          {/* Summary */}
          <div className="print-summary">
            <h3>🎉 সর্বমোট নিমন্ত্রিত: {totalMembers} জন | {Object.keys(groupedInvitations).length} টি এলাকা</h3>
          </div>
          
          <div className="print-footer">
            <p>© {new Date().getFullYear()} কলম হিন্দু ধর্মসভা | কলম, সিংড়া, নাটোর</p>
          </div>
        </div>

        {/* ============================================ */}
        {/* NO RESULTS */}
        {/* ============================================ */}
        {filteredData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg no-print">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">কোনো তথ্য পাওয়া যায়নি</p>
            <p className="text-gray-400 text-sm mt-1">অন্য কীওয়ার্ড বা এলাকা দিয়ে খুঁজুন</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedArea('all'); }}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              সব দেখুন
            </button>
          </div>
        )}

        {/* ============================================ */}
        {/* CARD VIEW */}
        {/* ============================================ */}
        {viewMode === 'card' && filteredData.length > 0 && (
          <div className="space-y-3 no-print">
            {Object.entries(groupedInvitations).map(([area, items]) => {
              const totalAreaMembers = items.reduce((sum, item) => sum + item.familyCount, 0);
              const isExpanded = expandedArea === area;

              return (
                <div key={area} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedArea(isExpanded ? null : area)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-800">{area}</h3>
                        <p className="text-sm text-gray-500">
                          {items.length} পরিবার | মোট: {totalAreaMembers} জন
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span className="font-bold text-orange-600">{totalAreaMembers}</span>
                      </div>
                      <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", isExpanded && "rotate-180")} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      <div className="p-4 space-y-2">
                        {items.map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                                {index + 1}
                              </span>
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="font-medium text-gray-700">{item.personName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">{item.familyCount} জন</span>
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <span className="text-orange-600 font-bold text-sm">{item.familyCount}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Area Total */}
                      <div className="bg-green-50 px-4 py-3 flex justify-between items-center border-t border-green-100">
                        <span className="text-green-700 font-medium">এই এলাকার মোট:</span>
                        <span className="text-green-700 font-bold text-lg">{totalAreaMembers} জন</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Grand Total Card */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-orange-100 text-sm">সর্বমোট নিমন্ত্রিত</p>
                    <p className="font-bold text-2xl">{totalMembers} জন</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-orange-100 text-sm">এলাকা সংখ্যা</p>
                  <p className="font-bold text-2xl">{Object.keys(groupedInvitations).length} টি</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* LIST VIEW */}
        {/* ============================================ */}
        {viewMode === 'list' && filteredData.length > 0 && (
          <div className="space-y-4 no-print">
            {Object.entries(groupedInvitations).map(([area, items]) => {
              const totalAreaMembers = items.reduce((sum, item) => sum + item.familyCount, 0);

              return (
                <div key={area} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Area Header */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                      <MapPin className="w-5 h-5" />
                      <h3 className="font-bold">{area}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                        {items.length} পরিবার
                      </span>
                      <span className="px-3 py-1 bg-white text-green-600 rounded-full font-bold text-sm">
                        {totalAreaMembers} জন
                      </span>
                    </div>
                  </div>

                  {/* Table Header */}
                  <div className="hidden md:grid md:grid-cols-12 gap-2 px-4 py-2 bg-gray-100 text-gray-600 font-semibold text-sm">
                    <div className="col-span-1 text-center">ক্রম</div>
                    <div className="col-span-8">নাম</div>
                    <div className="col-span-3 text-center">সদস্য সংখ্যা</div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-100">
                    {items.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="grid grid-cols-12 gap-2 px-4 py-2 hover:bg-green-50 transition items-center"
                      >
                        {/* Serial */}
                        <div className="col-span-1 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full font-bold text-xs">
                            {index + 1}
                          </span>
                        </div>

                        {/* Name */}
                        <div className="col-span-8 flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-700">{item.personName}</span>
                        </div>

                        {/* Member Count */}
                        <div className="col-span-3 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-600 rounded-full font-bold text-sm">
                            <Users className="w-3 h-3" />
                            {item.familyCount} জন
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Area Total */}
                  <div className="bg-green-50 px-4 py-2 flex justify-between items-center border-t-2 border-green-200">
                    <span className="text-green-700 font-medium text-sm">এই এলাকার মোট:</span>
                    <span className="text-green-700 font-bold">{totalAreaMembers} জন</span>
                  </div>
                </div>
              );
            })}

            {/* Grand Total */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-orange-100 text-sm">সর্বমোট নিমন্ত্রিত</p>
                    <p className="font-bold text-2xl">{totalMembers} জন</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-orange-100 text-sm">এলাকা সংখ্যা</p>
                  <p className="font-bold text-2xl">{Object.keys(groupedInvitations).length} টি</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationListComponent;
