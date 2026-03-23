import React, { useState, useEffect } from 'react';
import { DollarSign, Filter, Users, CheckCircle, Clock, XCircle, User, ChevronDown, ChevronUp, LayoutGrid, List } from 'lucide-react';

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
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
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
      case 'paid': return 'bg-green-100 text-green-600 border-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'unpaid': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'paid': return <CheckCircle className="w-3 h-3" />;
      case 'partial': return <Clock className="w-3 h-3" />;
      case 'unpaid': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'paid': return 'পরিশোধিত';
      case 'partial': return 'আংশিক';
      case 'unpaid': return 'বকেয়া';
      default: return '';
    }
  };

  const filterButtons = [
    { id: 'all', label: 'সকল', count: allMembers.length, color: 'bg-blue-500', lightColor: 'bg-blue-100 text-blue-700' },
    { id: 'paid', label: 'পরিশোধিত', count: paidCount, color: 'bg-green-500', lightColor: 'bg-green-100 text-green-700' },
    { id: 'partial', label: 'আংশিক', count: partialCount, color: 'bg-yellow-500', lightColor: 'bg-yellow-100 text-yellow-700' },
    { id: 'unpaid', label: 'বকেয়া', count: unpaidCount, color: 'bg-red-500', lightColor: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 md:p-6 text-white">
        <h2 className="text-xl md:text-2xl font-bold mb-1 flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          {fundData.pujaName || 'তহবিল সংগ্রহ'}
        </h2>
        <p className="text-orange-100 text-sm">সর্বশেষ আপডেট: {fundData.lastUpdated || 'N/A'}</p>
      </div>

      {/* Message */}
      {fundData.message && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-lg">
          <p className="text-yellow-800 font-medium text-sm">📢 {fundData.message}</p>
        </div>
      )}

      {/* Summary Cards - Admin Only */}
      {userRole !== 'Member' && (
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-lg md:text-2xl font-bold text-blue-600">৳{(fundData.totalDue/1000)?.toFixed(0) || 0}K</div>
            <p className="text-xs text-gray-500">দায্যকৃত</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-lg md:text-2xl font-bold text-green-600">৳{(fundData.totalPaid/1000)?.toFixed(0) || 0}K</div>
            <p className="text-xs text-gray-500">জমা</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <div className="text-lg md:text-2xl font-bold text-red-600">৳{(fundData.totalRemaining/1000)?.toFixed(0) || 0}K</div>
            <p className="text-xs text-gray-500">বাকি</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <div className="text-lg md:text-2xl font-bold text-orange-600">{fundData.paymentStats?.paymentPercentage || 0}%</div>
            <p className="text-xs text-gray-500">সংগ্রহ</p>
          </div>
        </div>
      )}

      {/* Filter Buttons - Admin Only */}
      {userRole !== 'Member' && (
        <div className="bg-white rounded-xl p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-700 text-sm">ফিল্টার:</span>
            </div>
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1.5 rounded-md transition",
                  viewMode === 'grid' ? "bg-white shadow text-orange-600" : "text-gray-500"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  "p-1.5 rounded-md transition",
                  viewMode === 'table' ? "bg-white shadow text-orange-600" : "text-gray-500"
                )}
              >
                <List className="w-4 h-4" />
              </button>
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
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    isActive ? `${btn.color} text-white shadow` : btn.lightColor
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
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Users className="w-4 h-4" />
          {userRole === 'Member' ? 'আপনার চাঁদা হিসাব' : `সদস্য তালিকা (${visibleMembers.length} জন)`}
        </h3>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {visibleMembers.map((member: any) => {
            const memberPhoto = getMemberPhoto(member.id, member.name);
            const isExpanded = expandedMember === member.id;
            const progressPercent = member.dueAmount > 0 ? Math.round((member.paidAmount / member.dueAmount) * 100) : 0;
            
            return (
              <div 
                key={member.id} 
                className={cn(
                  "bg-white rounded-xl shadow hover:shadow-md transition-all cursor-pointer border-l-4",
                  member.status === 'paid' ? "border-green-500" : 
                  member.status === 'partial' ? "border-yellow-500" : "border-red-500"
                )}
                onClick={() => setExpandedMember(isExpanded ? null : member.id)}
              >
                {/* Compact View */}
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                      {memberPhoto ? (
                        <img 
                          src={memberPhoto} 
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">{member.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1",
                          getStatusColor(member.status)
                        )}>
                          {getStatusIcon(member.status)}
                          {getStatusText(member.status)}
                        </span>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Amount Summary */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-500">বাকি:</span>
                    <span className={cn(
                      "font-bold",
                      member.remainingAmount > 0 ? "text-red-600" : "text-green-600"
                    )}>
                      ৳{member.remainingAmount?.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          member.status === 'paid' ? "bg-green-500" : 
                          member.status === 'partial' ? "bg-yellow-500" : "bg-red-300"
                        )}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-2 border-t bg-gray-50 rounded-b-xl space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-blue-50 rounded-lg p-2">
                        <div className="text-xs text-gray-500">দায্যকৃত</div>
                        <div className="font-bold text-blue-600 text-sm">৳{member.dueAmount?.toLocaleString()}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2">
                        <div className="text-xs text-gray-500">জমা</div>
                        <div className="font-bold text-green-600 text-sm">৳{member.paidAmount?.toLocaleString()}</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-2">
                        <div className="text-xs text-gray-500">বাকি</div>
                        <div className="font-bold text-red-600 text-sm">৳{member.remainingAmount?.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    {member.lastPaymentDate && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        শেষ পেমেন্ট: {member.lastPaymentDate}
                      </div>
                    )}
                    
                    {member.transactionId && (
                      <div className="text-xs bg-white rounded p-2">
                        <span className="text-gray-500">TxID: </span>
                        <span className="font-mono">{member.transactionId}</span>
                        {member.paymentMethod && (
                          <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                            {member.paymentMethod}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">সদস্য</th>
                  <th className="px-3 py-3 text-center font-semibold">স্ট্যাটাস</th>
                  <th className="px-3 py-3 text-right font-semibold">দায্যকৃত</th>
                  <th className="px-3 py-3 text-right font-semibold">জমা</th>
                  <th className="px-3 py-3 text-right font-semibold">বাকি</th>
                  <th className="px-3 py-3 text-center font-semibold">অগ্রগতি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleMembers.map((member: any) => {
                  const memberPhoto = getMemberPhoto(member.id, member.name);
                  const progressPercent = member.dueAmount > 0 ? Math.round((member.paidAmount / member.dueAmount) * 100) : 0;
                  
                  return (
                    <tr key={member.id} className="hover:bg-gray-50 transition">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {memberPhoto ? (
                            <img 
                              src={memberPhoto} 
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <span className="font-medium text-gray-800 truncate max-w-[120px]">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1",
                          getStatusColor(member.status)
                        )}>
                          {getStatusIcon(member.status)}
                          {getStatusText(member.status)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-medium text-blue-600">৳{member.dueAmount?.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right font-medium text-green-600">৳{member.paidAmount?.toLocaleString()}</td>
                      <td className={cn(
                        "px-3 py-3 text-right font-bold",
                        member.remainingAmount > 0 ? "text-red-600" : "text-green-600"
                      )}>
                        ৳{member.remainingAmount?.toLocaleString()}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                            <div 
                              className={cn(
                                "h-2 rounded-full",
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
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {visibleMembers.length === 0 && (
        <div className="text-center py-8 bg-white rounded-2xl shadow">
          <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">
            {activeFilter === 'all' 
              ? 'কোনো তথ্য পাওয়া যায়নি' 
              : `"${filterButtons.find(f => f.id === activeFilter)?.label}" ফিল্টারে কোনো সদস্য নেই`
            }
          </p>
          {activeFilter !== 'all' && (
            <button 
              onClick={() => setActiveFilter('all')}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
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
