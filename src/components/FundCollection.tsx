import React, { useState, useEffect } from 'react';
import { DollarSign, Filter, Users, CheckCircle, Clock, XCircle, User, LayoutGrid, List, Printer } from 'lucide-react';

// cn function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// useDataLoader hook
function useDataLoader<T>(url: string, initialData: T): [T, boolean, string] {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  return [data, loading, error];
}

const GITHUB_DYNAMIC_CONTENT_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/dynamicContent.json';
const GITHUB_MEMBERS_DATA_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-data.json';

interface FundCollectionProps {
  userRole: string;
  loggedInUserId: string;
}

const FundCollection: React.FC<FundCollectionProps> = ({ userRole, loggedInUserId }) => {
  const [dynamicContent] = useDataLoader<any>(GITHUB_DYNAMIC_CONTENT_URL, {});
  const [membersData] = useDataLoader<any>(GITHUB_MEMBERS_DATA_URL, {});
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isPrinting, setIsPrinting] = useState(false);
  
  const fundData = dynamicContent.fundCollection || {};
  const allMembersInfo = membersData.members || [];

  const getMemberPhoto = (memberId: string, memberName: string) => {
    const memberInfo = allMembersInfo.find((m: any) => 
      m.id === memberId || m.name === memberName
    );
    return memberInfo?.photo || memberInfo?.imageUrl || memberInfo?.image || null;
  };

  const getFilteredMembers = () => {
    let members = userRole === 'Member' 
      ? (fundData.members || []).filter((m: any) => m.id === loggedInUserId) 
      : fundData.members || [];

    if (activeFilter === 'all') return members;
    return members.filter((m: any) => m.status === activeFilter);
  };

  const visibleMembers = getFilteredMembers();

  const allMembers = fundData.members || [];
  const paidCount = allMembers.filter((m: any) => m.status === 'paid').length;
  const partialCount = allMembers.filter((m: any) => m.status === 'partial').length;
  const unpaidCount = allMembers.filter((m: any) => m.status === 'unpaid').length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-600';
      case 'partial': return 'bg-yellow-100 text-yellow-600';
      case 'unpaid': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'paid': return '✓ পরিশোধিত';
      case 'partial': return '◐ আংশিক';
      case 'unpaid': return '✕ বকেয়া';
      default: return '';
    }
  };

  const filterButtons = [
    { id: 'all', label: 'সকল', count: allMembers.length, color: 'bg-blue-500', lightColor: 'bg-blue-100 text-blue-700' },
    { id: 'paid', label: 'পরিশোধিত', count: paidCount, color: 'bg-green-500', lightColor: 'bg-green-100 text-green-700' },
    { id: 'partial', label: 'আংশিক', count: partialCount, color: 'bg-yellow-500', lightColor: 'bg-yellow-100 text-yellow-700' },
    { id: 'unpaid', label: 'বকেয়া', count: unpaidCount, color: 'bg-red-500', lightColor: 'bg-red-100 text-red-700' },
  ];

  // =============================================
  // FIXED PRINT HANDLER FOR MOBILE CHROME
  // =============================================
  const handlePrint = () => {
    setIsPrinting(true);
    
    // Force layout recalculation
    document.body.offsetHeight;
    
    // Small delay for mobile Chrome
    setTimeout(() => {
      window.print();
      
      // Reset after print dialog closes
      setTimeout(() => {
        setIsPrinting(false);
      }, 500);
    }, 300);
  };

  // Listen for print events
  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
    };
    
    const afterPrint = () => {
      setIsPrinting(false);
    };
    
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    
    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* FIXED PRINT STYLES FOR MOBILE CHROME */}
      {/* ============================================ */}
      <style>{`
        /* ========================================= */
        /* PRINT MEDIA QUERY - MOBILE CHROME FIX */
        /* ========================================= */
        @media print {
          /* Force color printing - ALL browsers */
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Reset HTML & Body */
          html {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }
          
          /* Hide ALL non-print elements */
          .no-print,
          .no-print * {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            left: -9999px !important;
          }
          
          /* Show print area */
          .print-area {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .print-area * {
            visibility: visible !important;
          }
          
          /* Show print-only content */
          .print-only {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            left: 0 !important;
            width: 100% !important;
            height: auto !important;
          }
          
          /* Print Container */
          .print-container {
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 8px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            font-family: 'Segoe UI', Tahoma, Arial, sans-serif !important;
          }
          
          /* ===================== */
          /* HEADER STYLES */
          /* ===================== */
          .print-header-box {
            display: block !important;
            visibility: visible !important;
            background: #ea580c !important;
            background-color: #ea580c !important;
            color: white !important;
            padding: 12px 16px !important;
            border-radius: 8px !important;
            margin-bottom: 12px !important;
            text-align: center !important;
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .print-header-box h1 {
            display: block !important;
            font-size: 18px !important;
            font-weight: bold !important;
            margin: 0 0 4px 0 !important;
            color: white !important;
          }
          
          .print-header-box h2 {
            display: block !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            margin: 0 0 4px 0 !important;
            color: white !important;
          }
          
          .print-header-box p {
            display: block !important;
            font-size: 11px !important;
            margin: 0 !important;
            color: white !important;
          }
          
          /* ===================== */
          /* SUMMARY GRID */
          /* ===================== */
          .print-summary-grid {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            margin-bottom: 12px !important;
            page-break-inside: avoid !important;
            width: 100% !important;
          }
          
          .print-summary-card {
            display: inline-block !important;
            flex: 1 1 22% !important;
            min-width: 80px !important;
            text-align: center !important;
            padding: 8px 4px !important;
            border-radius: 6px !important;
            border: 1px solid #d1d5db !important;
            page-break-inside: avoid !important;
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .print-summary-card.blue {
            background-color: #dbeafe !important;
            border-color: #93c5fd !important;
          }
          
          .print-summary-card.green {
            background-color: #dcfce7 !important;
            border-color: #86efac !important;
          }
          
          .print-summary-card.red {
            background-color: #fee2e2 !important;
            border-color: #fca5a5 !important;
          }
          
          .print-summary-card.orange {
            background-color: #ffedd5 !important;
            border-color: #fdba74 !important;
          }
          
          .print-summary-card .value {
            display: block !important;
            font-size: 14px !important;
            font-weight: bold !important;
            margin-bottom: 2px !important;
          }
          
          .print-summary-card .label {
            display: block !important;
            font-size: 9px !important;
            color: #4b5563 !important;
          }
          
          /* ===================== */
          /* STATS ROW */
          /* ===================== */
          .print-stats-row {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 8px !important;
            margin-bottom: 10px !important;
            font-size: 10px !important;
            page-break-inside: avoid !important;
          }
          
          .print-stats-row span {
            display: inline-block !important;
            padding: 3px 8px !important;
            border-radius: 10px !important;
            font-weight: 500 !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          /* ===================== */
          /* TABLE STYLES */
          /* ===================== */
          .print-table {
            display: table !important;
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 10px !important;
            border: 1px solid #9ca3af !important;
            margin: 0 !important;
            page-break-inside: auto !important;
          }
          
          .print-table thead {
            display: table-header-group !important;
          }
          
          .print-table tbody {
            display: table-row-group !important;
          }
          
          .print-table tfoot {
            display: table-footer-group !important;
          }
          
          .print-table tr {
            display: table-row !important;
            page-break-inside: avoid !important;
          }
          
          .print-table th {
            display: table-cell !important;
            background-color: #1f2937 !important;
            color: white !important;
            padding: 8px 6px !important;
            font-weight: 600 !important;
            font-size: 10px !important;
            border: 1px solid #374151 !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .print-table th:nth-child(1) { width: 5% !important; text-align: center !important; }
          .print-table th:nth-child(2) { width: 35% !important; text-align: left !important; }
          .print-table th:nth-child(3) { width: 12% !important; text-align: center !important; }
          .print-table th:nth-child(4) { width: 16% !important; text-align: right !important; }
          .print-table th:nth-child(5) { width: 16% !important; text-align: right !important; }
          .print-table th:nth-child(6) { width: 16% !important; text-align: right !important; }
          
          .print-table td {
            display: table-cell !important;
            padding: 6px !important;
            border: 1px solid #d1d5db !important;
            font-size: 10px !important;
            vertical-align: middle !important;
          }
          
          .print-table tbody tr:nth-child(even) {
            background-color: #f3f4f6 !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .print-table tbody tr:nth-child(odd) {
            background-color: white !important;
          }
          
          /* Status badges in table */
          .print-table .status-paid {
            display: inline-block !important;
            background-color: #dcfce7 !important;
            color: #166534 !important;
            padding: 2px 6px !important;
            border-radius: 8px !important;
            font-size: 9px !important;
            font-weight: 600 !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .print-table .status-partial {
            display: inline-block !important;
            background-color: #fef9c3 !important;
            color: #854d0e !important;
            padding: 2px 6px !important;
            border-radius: 8px !important;
            font-size: 9px !important;
            font-weight: 600 !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .print-table .status-unpaid {
            display: inline-block !important;
            background-color: #fee2e2 !important;
            color: #991b1b !important;
            padding: 2px 6px !important;
            border-radius: 8px !important;
            font-size: 9px !important;
            font-weight: 600 !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .print-table tfoot tr {
            background-color: #e5e7eb !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          .print-table tfoot td {
            padding: 8px 6px !important;
            font-weight: bold !important;
            border-top: 2px solid #6b7280 !important;
          }
          
          /* ===================== */
          /* UTILITY CLASSES */
          /* ===================== */
          .text-right { text-align: right !important; }
          .text-center { text-align: center !important; }
          .text-left { text-align: left !important; }
          .text-blue { color: #2563eb !important; }
          .text-green { color: #16a34a !important; }
          .text-red { color: #dc2626 !important; }
          .font-bold { font-weight: bold !important; }
          
          /* ===================== */
          /* FOOTER */
          /* ===================== */
          .print-footer {
            display: block !important;
            margin-top: 12px !important;
            padding-top: 8px !important;
            border-top: 1px dashed #9ca3af !important;
            text-align: center !important;
            font-size: 9px !important;
            color: #6b7280 !important;
            page-break-inside: avoid !important;
          }
          
          /* ===================== */
          /* PAGE SETTINGS */
          /* ===================== */
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
        
        /* ========================================= */
        /* SCREEN STYLES */
        /* ========================================= */
        .print-only {
          display: none !important;
        }
        
        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `}</style>

      {/* ============================================ */}
      {/* SCREEN VIEW - Header */}
      {/* ============================================ */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white no-print">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <DollarSign className="w-7 h-7" />
          {fundData.pujaName || 'তহবিল সংগ্রহ'} - চাঁদা তহবিল
        </h2>
        <p className="text-orange-100">সর্বশেষ আপডেট: {fundData.lastUpdated || 'N/A'}</p>
      </div>

      {/* Message */}
      {fundData.message && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg no-print">
          <p className="text-yellow-800 font-medium mb-2">📢 {fundData.message}</p>
          {fundData.instructions && (
            <div className="mt-3 space-y-1 text-sm text-yellow-700">
              {fundData.instructions.map((inst: string, i: number) => (
                <p key={i}>{inst}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin Summary Cards */}
      {userRole !== 'Member' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 no-print">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">৳{fundData.totalDue?.toLocaleString() || 0}</div>
              <p className="text-sm text-gray-600 mt-1">মোট দায্যকৃত</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600">৳{fundData.totalPaid?.toLocaleString() || 0}</div>
              <p className="text-sm text-gray-600 mt-1">মোট জমা</p>
            </div>
            <div className="bg-red-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-red-600">৳{fundData.totalRemaining?.toLocaleString() || 0}</div>
              <p className="text-sm text-gray-600 mt-1">মোট বাকি</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">{fundData.paymentStats?.paymentPercentage || 0}%</div>
              <p className="text-sm text-gray-600 mt-1">সংগ্রহ হয়েছে</p>
            </div>
          </div>

          {fundData.paymentStats && (
            <div className="bg-white rounded-xl p-6 shadow-lg no-print">
              <h3 className="font-bold mb-4">📊 পেমেন্ট পরিসংখ্যান</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div><div className="text-2xl font-bold">{fundData.paymentStats.totalMembers}</div><p className="text-xs text-gray-500">মোট সদস্য</p></div>
                <div><div className="text-2xl font-bold text-green-600">{fundData.paymentStats.paidMembers}</div><p className="text-xs text-gray-500">পরিশোধিত</p></div>
                <div><div className="text-2xl font-bold text-yellow-600">{fundData.paymentStats.partialMembers}</div><p className="text-xs text-gray-500">আংশিক</p></div>
                <div><div className="text-2xl font-bold text-red-600">{fundData.paymentStats.unpaidMembers}</div><p className="text-xs text-gray-500">বকেয়া</p></div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Filter & Controls */}
      {userRole !== 'Member' && (
        <div className="bg-white rounded-xl p-4 shadow-lg no-print">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">ফিল্টার:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('card')}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition",
                    viewMode === 'card' ? "bg-white shadow text-orange-600" : "text-gray-500"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">কার্ড</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition",
                    viewMode === 'list' ? "bg-white shadow text-orange-600" : "text-gray-500"
                  )}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">লিস্ট</span>
                </button>
              </div>

              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium transition shadow-md",
                  isPrinting ? "opacity-50 cursor-wait" : "hover:from-green-600 hover:to-emerald-700"
                )}
              >
                <Printer className="w-4 h-4" />
                <span>{isPrinting ? 'প্রসেসিং...' : 'প্রিন্ট / PDF'}</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveFilter(btn.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeFilter === btn.id ? `${btn.color} text-white shadow-lg` : btn.lightColor
                )}
              >
                {btn.label} ({btn.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Members Header */}
      <div className="flex items-center justify-between no-print">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          {userRole === 'Member' ? 'আপনার চাঁদা হিসাব' : 'সদস্যদের চাঁদা তালিকা'}
        </h3>
        {userRole !== 'Member' && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {visibleMembers.length} জন
          </span>
        )}
      </div>

      {/* ============================================ */}
      {/* PRINT AREA - Contains print-only content */}
      {/* ============================================ */}
      <div className="print-area">
        {/* ========================================= */}
        {/* PRINT ONLY CONTENT */}
        {/* ========================================= */}
        <div className="print-only print-container">
          {/* Print Header */}
          <div className="print-header-box">
            <h1>🙏 কলম হিন্দু ধর্মসভা</h1>
            <h2>{fundData.pujaName || 'চাঁদা তহবিল'} - চাঁদা সংগ্রহ তালিকা</h2>
            <p>
              📅 {new Date().toLocaleDateString('bn-BD')} | 
              {activeFilter === 'all' ? ' সকল সদস্য' : ` ${filterButtons.find(f => f.id === activeFilter)?.label}`} | 
              মোট: {visibleMembers.length} জন
            </p>
          </div>

          {/* Print Summary */}
          <div className="print-summary-grid">
            <div className="print-summary-card blue">
              <span className="value text-blue">৳{fundData.totalDue?.toLocaleString() || 0}</span>
              <span className="label">মোট দায্যকৃত</span>
            </div>
            <div className="print-summary-card green">
              <span className="value text-green">৳{fundData.totalPaid?.toLocaleString() || 0}</span>
              <span className="label">মোট জমা</span>
            </div>
            <div className="print-summary-card red">
              <span className="value text-red">৳{fundData.totalRemaining?.toLocaleString() || 0}</span>
              <span className="label">মোট বাকি</span>
            </div>
            <div className="print-summary-card orange">
              <span className="value">{fundData.paymentStats?.paymentPercentage || 0}%</span>
              <span className="label">সংগ্রহ সম্পন্ন</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="print-stats-row">
            <span style={{backgroundColor: '#dbeafe'}}>👥 মোট: {allMembers.length}</span>
            <span style={{backgroundColor: '#dcfce7'}}>✓ পরিশোধিত: {paidCount}</span>
            <span style={{backgroundColor: '#fef9c3'}}>◐ আংশিক: {partialCount}</span>
            <span style={{backgroundColor: '#fee2e2'}}>✕ বকেয়া: {unpaidCount}</span>
          </div>

          {/* Print Table */}
          <table className="print-table">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th className="text-left">সদস্যের নাম</th>
                <th className="text-center">স্ট্যাটাস</th>
                <th className="text-right">দায্যকৃত</th>
                <th className="text-right">জমা</th>
                <th className="text-right">বাকি</th>
              </tr>
            </thead>
            <tbody>
              {visibleMembers.map((member: any, index: number) => (
                <tr key={member.id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-left">{member.name}</td>
                  <td className="text-center">
                    <span className={`status-${member.status}`}>
                      {getStatusText(member.status)}
                    </span>
                  </td>
                  <td className="text-right">৳{member.dueAmount?.toLocaleString()}</td>
                  <td className="text-right text-green">৳{member.paidAmount?.toLocaleString()}</td>
                  <td className={cn("text-right font-bold", member.remainingAmount > 0 ? "text-red" : "text-green")}>
                    ৳{member.remainingAmount?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right">মোট ({visibleMembers.length} জন):</td>
                <td className="text-right text-blue">
                  ৳{visibleMembers.reduce((s: number, m: any) => s + (m.dueAmount || 0), 0).toLocaleString()}
                </td>
                <td className="text-right text-green">
                  ৳{visibleMembers.reduce((s: number, m: any) => s + (m.paidAmount || 0), 0).toLocaleString()}
                </td>
                <td className="text-right text-red">
                  ৳{visibleMembers.reduce((s: number, m: any) => s + (m.remainingAmount || 0), 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Print Footer */}
          <div className="print-footer">
            © কলম হিন্দু ধর্মসভা | স্বয়ংক্রিয়ভাবে তৈরি | {new Date().toLocaleTimeString('bn-BD')}
          </div>
        </div>

        {/* ============================================ */}
        {/* SCREEN - Card View */}
        {/* ============================================ */}
        {viewMode === 'card' && visibleMembers.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden divide-y divide-gray-100 no-print">
            {visibleMembers.map((member: any) => {
              const memberPhoto = getMemberPhoto(member.id, member.name);
              
              return (
                <div key={member.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {userRole !== 'Member' && (
                        <div className="flex-shrink-0">
                          {memberPhoto ? (
                            <img 
                              src={memberPhoto} 
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-orange-200 shadow-sm"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={cn(
                            "w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-sm",
                            memberPhoto ? "hidden" : ""
                          )}>
                            <User className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-bold text-gray-800">{member.name}</h4>
                        {member.lastPaymentDate && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            শেষ পেমেন্ট: {member.lastPaymentDate}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1", getStatusColor(member.status))}>
                      {member.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                      {member.status === 'partial' && <Clock className="w-3 h-3" />}
                      {member.status === 'unpaid' && <XCircle className="w-3 h-3" />}
                      {getStatusText(member.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="bg-blue-50 rounded-lg py-2">
                      <div className="text-xs text-gray-500">দায্যকৃত</div>
                      <div className="font-bold text-blue-600">৳{member.dueAmount?.toLocaleString()}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg py-2">
                      <div className="text-xs text-gray-500">জমা</div>
                      <div className="font-bold text-green-600">৳{member.paidAmount?.toLocaleString()}</div>
                    </div>
                    <div className={cn("rounded-lg py-2", member.remainingAmount > 0 ? "bg-red-50" : "bg-green-50")}>
                      <div className="text-xs text-gray-500">বাকি</div>
                      <div className={cn("font-bold", member.remainingAmount > 0 ? "text-red-600" : "text-green-600")}>
                        ৳{member.remainingAmount?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {member.transactionId && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-2 text-xs flex flex-wrap items-center gap-2">
                      <span className="text-gray-500">TxID:</span>
                      <span className="font-mono font-semibold">{member.transactionId}</span>
                      {member.paymentMethod && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                          {member.paymentMethod}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================ */}
        {/* SCREEN - List View */}
        {/* ============================================ */}
        {viewMode === 'list' && visibleMembers.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden no-print">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                  <tr>
                    <th className="px-3 py-3 text-center font-semibold">#</th>
                    <th className="px-3 py-3 text-left font-semibold">সদস্য</th>
                    <th className="px-3 py-3 text-center font-semibold">স্ট্যাটাস</th>
                    <th className="px-3 py-3 text-right font-semibold">দায্যকৃত</th>
                    <th className="px-3 py-3 text-right font-semibold">জমা</th>
                    <th className="px-3 py-3 text-right font-semibold">বাকি</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleMembers.map((member: any, index: number) => {
                    const memberPhoto = getMemberPhoto(member.id, member.name);
                    
                    return (
                      <tr key={member.id} className="hover:bg-orange-50 transition">
                        <td className="px-3 py-3 text-center text-gray-500">{index + 1}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            {userRole !== 'Member' && memberPhoto && (
                              <img 
                                src={memberPhoto} 
                                alt={member.name}
                                className="w-7 h-7 rounded-full object-cover border"
                              />
                            )}
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getStatusColor(member.status))}>
                            {getStatusText(member.status)}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right text-blue-600 font-medium">৳{member.dueAmount?.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right text-green-600 font-medium">৳{member.paidAmount?.toLocaleString()}</td>
                        <td className={cn("px-3 py-3 text-right font-bold", member.remainingAmount > 0 ? "text-red-600" : "text-green-600")}>
                          ৳{member.remainingAmount?.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {userRole !== 'Member' && (
                  <tfoot className="bg-gray-100 font-semibold">
                    <tr>
                      <td colSpan={3} className="px-3 py-3 text-right">মোট ({visibleMembers.length} জন):</td>
                      <td className="px-3 py-3 text-right text-blue-600">
                        ৳{visibleMembers.reduce((s: number, m: any) => s + (m.dueAmount || 0), 0).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right text-green-600">
                        ৳{visibleMembers.reduce((s: number, m: any) => s + (m.paidAmount || 0), 0).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right text-red-600">
                        ৳{visibleMembers.reduce((s: number, m: any) => s + (m.remainingAmount || 0), 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {visibleMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg no-print">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">
            {activeFilter === 'all' ? 'কোনো তথ্য নেই' : `"${filterButtons.find(f => f.id === activeFilter)?.label}" নেই`}
          </p>
          {activeFilter !== 'all' && (
            <button onClick={() => setActiveFilter('all')} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
              সকল দেখুন
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FundCollection;
