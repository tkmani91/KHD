import React, { useState, useEffect } from 'react';
import { DollarSign, Filter, Users, CheckCircle, Clock, XCircle, User } from 'lucide-react';

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
    { id: 'all', label: 'সকল', count: allMembers.length, icon: Users, color: 'bg-blue-500' },
    { id: 'paid', label: 'পরিশোধিত', count: paidCount, icon: CheckCircle, color: 'bg-green-500' },
    { id: 'partial', label: 'আংশিক', count: partialCount, icon: Clock, color: 'bg-yellow-500' },
    { id: 'unpaid', label: 'বকেয়া', count: unpaidCount, icon: XCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <DollarSign className="w-7 h-7" />
          {fundData.pujaName || 'তহবিল সংগ্রহ'} - চাঁদা তহবিল
        </h2>
        <p className="text-orange-100">সর্বশেষ আপডেট: {fundData.lastUpdated || 'N/A'}</p>
      </div>

      {/* Message & Instructions */}
      {fundData.message && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">৳{fundData.totalDue?.toLocaleString() || 0}</div>
              <p className="text-xs md:text-sm text-gray-600 mt-1">মোট দায্যকৃত</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600">৳{fundData.totalPaid?.toLocaleString() || 0}</div>
              <p className="text-xs md:text-sm text-gray-600 mt-1">মোট জমা</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-red-600">৳{fundData.totalRemaining?.toLocaleString() || 0}</div>
              <p className="text-xs md:text-sm text-gray-600 mt-1">মোট বাকি</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-600">{fundData.paymentStats?.paymentPercentage || 0}%</div>
              <p className="text-xs md:text-sm text-gray-600 mt-1">সংগ্রহ হয়েছে</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${fundData.paymentStats?.paymentPercentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Payment Stats Cards */}
          {fundData.paymentStats && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                📊 পেমেন্ট পরিসংখ্যান
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{fundData.paymentStats.totalMembers}</div>
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

      {/* Filter Buttons - Only for Admin/Super Admin */}
      {userRole !== 'Member' && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">ফিল্টার করুন:</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {filterButtons.map((btn) => {
              const Icon = btn.icon;
              const isActive = activeFilter === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setActiveFilter(btn.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                    isActive 
                      ? `${btn.color} text-white shadow-lg scale-105` 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{btn.label}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    isActive ? "bg-white/30" : "bg-gray-300"
                  )}>
                    {btn.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
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
        
        {visibleMembers.map((member: any) => {
          const memberPhoto = getMemberPhoto(member.id, member.name);
          
          return (
            <div key={member.id} className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                {/* Left Side - Photo + Name */}
                <div className="flex items-center gap-3">
                  {/* Member Photo */}
                  <div className="flex-shrink-0">
                    {memberPhoto ? (
                      <img 
                        src={memberPhoto} 
                        alt={member.name}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-orange-200 shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-md",
                      memberPhoto ? "hidden" : ""
                    )}>
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Name & Payment Date */}
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{member.name}</h4>
                    {member.lastPaymentDate && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        শেষ পেমেন্ট: {member.lastPaymentDate}
                      </p>
                    )}
                    {!member.lastPaymentDate && member.status === 'unpaid' && (
                      <p className="text-sm text-red-400">কোনো পেমেন্ট করেননি</p>
                    )}
                  </div>
                </div>
                
                {/* Status Badge */}
                <span className={cn("px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1", getStatusColor(member.status))}>
                  {member.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                  {member.status === 'partial' && <Clock className="w-3 h-3" />}
                  {member.status === 'unpaid' && <XCircle className="w-3 h-3" />}
                  {getStatusText(member.status)}
                </span>
              </div>

              {/* Amount Cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">দায্যকৃত</div>
                  <div className="text-lg md:text-xl font-bold text-blue-600">৳{member.dueAmount?.toLocaleString()}</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">জমা</div>
                  <div className="text-lg md:text-xl font-bold text-green-600">৳{member.paidAmount?.toLocaleString()}</div>
                </div>
                <div className={cn("text-center p-3 rounded-lg", member.remainingAmount > 0 ? "bg-red-50" : "bg-green-50")}>
                  <div className="text-xs text-gray-500 mb-1">বাকি</div>
                  <div className={cn("text-lg md:text-xl font-bold", member.remainingAmount > 0 ? "text-red-600" : "text-green-600")}>
                    ৳{member.remainingAmount?.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {member.dueAmount > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>পেমেন্ট অগ্রগতি</span>
                    <span>{Math.round((member.paidAmount / member.dueAmount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-500",
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
                <div className="bg-gray-50 rounded-lg p-3 text-sm flex flex-wrap items-center gap-2">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono font-semibold bg-white px-2 py-1 rounded">{member.transactionId}</span>
                  {member.paymentMethod && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      💳 {member.paymentMethod}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

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
    </div>
  );
};

export default FundCollection;
