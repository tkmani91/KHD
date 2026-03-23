import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, Filter, Users, CheckCircle, Clock, XCircle, User, LayoutGrid, List, Download, FileText, Image } from 'lucide-react';

// cn function - inline defined
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// useDataLoader hook - inline defined
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

// GitHub URLs
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
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  const fundData = dynamicContent.fundCollection || {};
  const allMembersInfo = membersData.members || [];

  // সদস্যের ছবি খুঁজে বের করা
  const getMemberPhoto = (memberId: string, memberName: string) => {
    const memberInfo = allMembersInfo.find((m: any) => 
      m.id === memberId || m.name === memberName
    );
    return memberInfo?.photo || memberInfo?.imageUrl || memberInfo?.image || null;
  };

  // ফিল্টার অনুযায়ী সদস্য
  const getFilteredMembers = () => {
    let members = userRole === 'Member' 
      ? (fundData.members || []).filter((m: any) => m.id === loggedInUserId) 
      : fundData.members || [];

    if (activeFilter === 'all') return members;
    return members.filter((m: any) => m.status === activeFilter);
  };

  const visibleMembers = getFilteredMembers();

  // পরিসংখ্যান
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

  // ============================================
  // DOWNLOAD FUNCTIONS
  // ============================================

  // Print / PDF Download
  const handlePrint = () => {
    setIsPrintMode(true);
    setShowDownloadMenu(false);
    
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsPrintMode(false), 500);
    }, 300);
  };

  // CSV Download
  const handleDownloadCSV = () => {
  const headers: string[] = ['ক্রমিক', 'নাম', 'স্ট্যাটাস', 'দায্যকৃত', 'জমা', 'বাকি', 'শেষ পেমেন্ট', 'পেমেন্ট মাধ্যম'];
  
  const rows: (string | number)[][] = visibleMembers.map((member: any, index: number) => [
    index + 1,
    member.name,
    member.status === 'paid' ? 'পরিশোধিত' : member.status === 'partial' ? 'আংশিক' : 'বকেয়া',
    member.dueAmount,
    member.paidAmount,
    member.remainingAmount,
    member.lastPaymentDate || '-',
    member.paymentMethod || '-'
  ]);

  // Add summary row
  rows.push([]);
  rows.push(['', 'মোট:', '', 
    visibleMembers.reduce((sum: number, m: any) => sum + (m.dueAmount || 0), 0),
    visibleMembers.reduce((sum: number, m: any) => sum + (m.paidAmount || 0), 0),
    visibleMembers.reduce((sum: number, m: any) => sum + (m.remainingAmount || 0), 0),
    '', ''
  ]);

  const csvContent: string = [
    `${fundData.pujaName || 'চাঁদা তহবিল'} - ${activeFilter === 'all' ? 'সকল সদস্য' : filterButtons.find(f => f.id === activeFilter)?.label}`,
    `তারিখ: ${new Date().toLocaleDateString('bn-BD')}`,
    '',
    headers.join(','),
    ...rows.map((row: (string | number)[]) => row.join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `চাঁদা_তালিকা_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  setShowDownloadMenu(false);
};

  // Copy to Clipboard
  const handleCopyText = () => {
    let text = `📋 ${fundData.pujaName || 'চাঁদা তহবিল'}\n`;
    text += `📅 তারিখ: ${new Date().toLocaleDateString('bn-BD')}\n\n`;
    
    text += `📊 সারাংশ:\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `মোট দায্যকৃত: ৳${fundData.totalDue?.toLocaleString() || 0}\n`;
    text += `মোট জমা: ৳${fundData.totalPaid?.toLocaleString() || 0}\n`;
    text += `মোট বাকি: ৳${fundData.totalRemaining?.toLocaleString() || 0}\n`;
    text += `সংগ্রহ: ${fundData.paymentStats?.paymentPercentage || 0}%\n\n`;
    
    text += `👥 সদস্য (${visibleMembers.length} জন):\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    
    visibleMembers.forEach((member: any, index: number) => {
      const status = member.status === 'paid' ? '✅' : member.status === 'partial' ? '🟡' : '❌';
      text += `${index + 1}. ${member.name} ${status}\n`;
      text += `   জমা: ৳${member.paidAmount?.toLocaleString()} / বাকি: ৳${member.remainingAmount?.toLocaleString()}\n`;
    });

    navigator.clipboard.writeText(text);
    alert('✅ কপি হয়েছে! WhatsApp বা অন্যত্র পেস্ট করুন।');
    setShowDownloadMenu(false);
  };

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* PRINT STYLES */}
      {/* ============================================ */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      {/* ============================================ */}
      {/* PRINTABLE AREA START */}
      {/* ============================================ */}
      <div ref={printRef} className={isPrintMode ? "print-area" : ""}>
        
        {/* Print Header - Only shows when printing */}
        <div className="print-only mb-6 text-center border-b-2 border-gray-300 pb-4">
          <h1 className="text-2xl font-bold text-gray-800">কলম হিন্দু ধর্মসভা</h1>
          <h2 className="text-xl font-semibold text-orange-600 mt-1">{fundData.pujaName || 'চাঁদা তহবিল'}</h2>
          <p className="text-sm text-gray-500 mt-2">প্রিন্ট তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white no-print">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <DollarSign className="w-7 h-7" />
            {fundData.pujaName || 'তহবিল সংগ্রহ'} - চাঁদা তহবিল
          </h2>
          <p className="text-orange-100">সর্বশেষ আপডেট: {fundData.lastUpdated || 'N/A'}</p>
        </div>

        {/* Message & Instructions */}
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

        {/* Admin/Super Admin View - Summary Cards */}
        {userRole !== 'Member' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 rounded-xl p-4 md:p-6 text-center border border-blue-100">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">৳{fundData.totalDue?.toLocaleString() || 0}</div>
                <p className="text-sm text-gray-600 mt-1">মোট দায্যকৃত</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 md:p-6 text-center border border-green-100">
                <div className="text-2xl md:text-3xl font-bold text-green-600">৳{fundData.totalPaid?.toLocaleString() || 0}</div>
                <p className="text-sm text-gray-600 mt-1">মোট জমা</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 md:p-6 text-center border border-red-100">
                <div className="text-2xl md:text-3xl font-bold text-red-600">৳{fundData.totalRemaining?.toLocaleString() || 0}</div>
                <p className="text-sm text-gray-600 mt-1">মোট বাকি</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 md:p-6 text-center border border-orange-100">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">{fundData.paymentStats?.paymentPercentage || 0}%</div>
                <p className="text-sm text-gray-600 mt-1">সংগ্রহ হয়েছে</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2 no-print">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${fundData.paymentStats?.paymentPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Payment Stats */}
            {fundData.paymentStats && (
              <div className="bg-white rounded-xl p-6 shadow-lg mt-4 border">
                <h3 className="font-bold mb-4">📊 পেমেন্ট পরিসংখ্যান</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">{fundData.paymentStats.totalMembers}</div>
                    <p className="text-xs text-gray-500">মোট সদস্য</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{fundData.paymentStats.paidMembers}</div>
                    <p className="text-xs text-gray-500">পরিশোধিত</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{fundData.paymentStats.partialMembers}</div>
                    <p className="text-xs text-gray-500">আংশিক</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{fundData.paymentStats.unpaidMembers}</div>
                    <p className="text-xs text-gray-500">বকেয়া</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Filter & View Toggle & Download - Admin Only */}
        {userRole !== 'Member' && (
          <div className="bg-white rounded-xl p-4 shadow-lg no-print mt-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">ফিল্টার করুন:</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('card')}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition",
                      viewMode === 'card' ? "bg-white shadow text-orange-600" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">কার্ড</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition",
                      viewMode === 'list' ? "bg-white shadow text-orange-600" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">লিস্ট</span>
                  </button>
                </div>

                {/* Download Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">ডাউনলোড</span>
                  </button>
                  
                  {/* Download Menu */}
                  {showDownloadMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                      <button
                        onClick={handlePrint}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition text-sm"
                      >
                        <FileText className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="font-medium">PDF / প্রিন্ট</div>
                          <div className="text-xs text-gray-400">Ctrl+P চাপুন</div>
                        </div>
                      </button>
                      <button
                        onClick={handleDownloadCSV}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition text-sm border-t"
                      >
                        <FileText className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="font-medium">CSV ফাইল</div>
                          <div className="text-xs text-gray-400">Excel এ খুলুন</div>
                        </div>
                      </button>
                      <button
                        onClick={handleCopyText}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition text-sm border-t"
                      >
                        <Image className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="font-medium">টেক্সট কপি</div>
                          <div className="text-xs text-gray-400">WhatsApp এ শেয়ার</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filterButtons.map((btn) => {
                const isActive = activeFilter === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => setActiveFilter(btn.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      isActive ? `${btn.color} text-white shadow-lg` : btn.lightColor
                    )}
                  >
                    {btn.label} ({btn.count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Members Header */}
        <div className="flex items-center justify-between mt-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            {userRole === 'Member' ? 'আপনার চাঁদা হিসাব' : 'সদস্যদের চাঁদা তালিকা'}
          </h3>
          {userRole !== 'Member' && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              দেখাচ্ছে: {visibleMembers.length} জন
            </span>
          )}
        </div>

        {/* ============================================ */}
        {/* CARD VIEW */}
        {/* ============================================ */}
        {viewMode === 'card' && visibleMembers.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden divide-y divide-gray-100 mt-4 border">
            {visibleMembers.map((member: any, index: number) => {
              const memberPhoto = getMemberPhoto(member.id, member.name);
              
              return (
                <div key={member.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-3">
                    {/* Left Side - Photo + Name */}
                    <div className="flex items-center gap-3">
                      {/* Serial Number for Print */}
                      <span className="text-gray-400 font-medium w-6">{index + 1}.</span>
                      
                      {/* Member Photo - Only for Admin/Super Admin */}
                      {userRole !== 'Member' && (
                        <div className="flex-shrink-0 no-print">
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
                      
                      {/* Name & Payment Date */}
                      <div>
                        <h4 className="font-bold text-gray-800">{member.name}</h4>
                        {member.lastPaymentDate && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 no-print" />
                            শেষ পেমেন্ট: {member.lastPaymentDate}
                          </p>
                        )}
                        {!member.lastPaymentDate && member.status === 'unpaid' && (
                          <p className="text-xs text-red-400">কোনো পেমেন্ট করেননি</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1", getStatusColor(member.status))}>
                      {member.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                      {member.status === 'partial' && <Clock className="w-3 h-3" />}
                      {member.status === 'unpaid' && <XCircle className="w-3 h-3" />}
                      {getStatusText(member.status)}
                    </span>
                  </div>

                  {/* Amount Row */}
                  <div className="grid grid-cols-3 gap-2 text-center text-sm ml-8">
                    <div className="bg-blue-50 rounded-lg py-2 border border-blue-100">
                      <div className="text-xs text-gray-500">দায্যকৃত</div>
                      <div className="font-bold text-blue-600">৳{member.dueAmount?.toLocaleString()}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg py-2 border border-green-100">
                      <div className="text-xs text-gray-500">জমা</div>
                      <div className="font-bold text-green-600">৳{member.paidAmount?.toLocaleString()}</div>
                    </div>
                    <div className={cn("rounded-lg py-2 border", member.remainingAmount > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100")}>
                      <div className="text-xs text-gray-500">বাকি</div>
                      <div className={cn("font-bold", member.remainingAmount > 0 ? "text-red-600" : "text-green-600")}>
                        ৳{member.remainingAmount?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar - No Print */}
                  {member.dueAmount > 0 && (
                    <div className="mt-3 ml-8 no-print">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-500",
                            member.status === 'paid' ? "bg-green-500" : 
                            member.status === 'partial' ? "bg-yellow-500" : "bg-red-300"
                          )}
                          style={{ width: `${Math.min((member.paidAmount / member.dueAmount) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Transaction Info */}
                  {member.transactionId && (
                    <div className="mt-3 ml-8 bg-gray-50 rounded-lg p-2 text-xs flex flex-wrap items-center gap-2 no-print">
                      <span className="text-gray-500">TxID:</span>
                      <span className="font-mono font-semibold">{member.transactionId}</span>
                      {member.paymentMethod && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                          💳 {member.paymentMethod}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Total Summary Row */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 font-semibold">
              <div className="grid grid-cols-3 gap-2 text-center text-sm ml-8">
                <div className="bg-blue-100 rounded-lg py-3 border border-blue-200">
                  <div className="text-xs text-gray-600">মোট দায্যকৃত</div>
                  <div className="font-bold text-blue-700 text-lg">
                    ৳{visibleMembers.reduce((sum: number, m: any) => sum + (m.dueAmount || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-green-100 rounded-lg py-3 border border-green-200">
                  <div className="text-xs text-gray-600">মোট জমা</div>
                  <div className="font-bold text-green-700 text-lg">
                    ৳{visibleMembers.reduce((sum: number, m: any) => sum + (m.paidAmount || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-red-100 rounded-lg py-3 border border-red-200">
                  <div className="text-xs text-gray-600">মোট বাকি</div>
                  <div className="font-bold text-red-700 text-lg">
                    ৳{visibleMembers.reduce((sum: number, m: any) => sum + (m.remainingAmount || 0), 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* LIST VIEW */}
        {/* ============================================ */}
        {viewMode === 'list' && visibleMembers.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-4 border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">সদস্য</th>
                    <th className="px-4 py-3 text-center font-semibold">স্ট্যাটাস</th>
                    <th className="px-4 py-3 text-right font-semibold">দায্যকৃত</th>
                    <th className="px-4 py-3 text-right font-semibold">জমা</th>
                    <th className="px-4 py-3 text-right font-semibold">বাকি</th>
                    <th className="px-4 py-3 text-center font-semibold hidden md:table-cell no-print">অগ্রগতি</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleMembers.map((member: any, index: number) => {
                    const memberPhoto = getMemberPhoto(member.id, member.name);
                    const progressPercent = member.dueAmount > 0 ? Math.round((member.paidAmount / member.dueAmount) * 100) : 0;
                    
                    return (
                      <tr key={member.id} className="hover:bg-orange-50 transition">
                        <td className="px-4 py-3 text-gray-500 font-medium">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {/* Photo - Only for Admin/Super Admin */}
                            {userRole !== 'Member' && (
                              <div className="no-print">
                                {memberPhoto ? (
                                  <img 
                                    src={memberPhoto} 
                                    alt={member.name}
                                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                            )}
                            <div>
                              <span className="font-semibold text-gray-800">{member.name}</span>
                              {member.lastPaymentDate && (
                                <p className="text-xs text-gray-400">{member.lastPaymentDate}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1",
                            getStatusColor(member.status)
                          )}>
                            {member.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                            {member.status === 'partial' && <Clock className="w-3 h-3" />}
                            {member.status === 'unpaid' && <XCircle className="w-3 h-3" />}
                            <span className="hidden sm:inline">{getStatusText(member.status)}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-blue-600">
                          ৳{member.dueAmount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-green-600">
                          ৳{member.paidAmount?.toLocaleString()}
                        </td>
                        <td className={cn(
                          "px-4 py-3 text-right font-bold",
                          member.remainingAmount > 0 ? "text-red-600" : "text-green-600"
                        )}>
                          ৳{member.remainingAmount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell no-print">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                              <div 
                                className={cn(
                                  "h-2 rounded-full transition-all",
                                  member.status === 'paid' ? "bg-green-500" : 
                                  member.status === 'partial' ? "bg-yellow-500" : "bg-red-300"
                                )}
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 w-8">{progressPercent}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                
                {/* Table Footer - Summary */}
                <tfoot className="bg-gradient-to-r from-gray-100 to-gray-200 font-semibold">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right text-gray-700">মোট ({visibleMembers.length} জন):</td>
                    <td className="px-4 py-3 text-right text-blue-700 text-lg">
                      ৳{visibleMembers.reduce((sum: number, m: any) => sum + (m.dueAmount || 0), 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-green-700 text-lg">
                      ৳{visibleMembers.reduce((sum: number, m: any) => sum + (m.paidAmount || 0), 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-red-700 text-lg">
                      ৳{visibleMembers.reduce((sum: number, m: any) => sum + (m.remainingAmount || 0), 0).toLocaleString()}
                    </td>
                    <td className="hidden md:table-cell no-print"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Print Footer */}
        <div className="print-only mt-8 pt-4 border-t text-center text-sm text-gray-500">
          <p>© কলম হিন্দু ধর্মসভা | স্বয়ংক্রিয়ভাবে তৈরি</p>
        </div>

      </div>
      {/* PRINTABLE AREA END */}

      {/* Empty State */}
      {visibleMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg mb-2">
            {activeFilter === 'all' 
              ? 'কোনো তথ্য পাওয়া যায়নি' 
              : `"${filterButtons.find(f => f.id === activeFilter)?.label}" ফিল্টারে কোনো সদস্য নেই`
            }
          </p>
          {activeFilter !== 'all' && (
            <button 
              onClick={() => setActiveFilter('all')}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              সকল দেখুন
            </button>
          )}
        </div>
      )}

      {/* Click outside to close download menu */}
      {showDownloadMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDownloadMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default FundCollection;
