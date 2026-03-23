import React from 'react';
import { DollarSign } from 'lucide-react';
// Import paths ঠিক করুন - আপনার project structure অনুযায়ী

// Option 1: যদি utils সরাসরি src এ থাকে
// import { cn } from '../utils';

// Option 2: যদি lib folder এ থাকে
// import { cn } from '../lib/utils';

// Option 3: যদি cn function না থাকে, তাহলে inline define করুন
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// useDataLoader এর জন্য
// Option 1: যদি hooks folder এ থাকে
// import { useDataLoader } from '../hooks/useDataLoader';

// Option 2: যদি App.tsx এ থাকে, তাহলে সেখান থেকে export করুন
// import { useDataLoader } from '../App';

// Option 3: সরাসরি এখানে define করুন (temporary)
import { useState, useEffect } from 'react';

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

// GitHub URL
const GITHUB_DYNAMIC_CONTENT_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/dynamicContent.json';

interface FundCollectionProps {
  userRole: string;
  loggedInUserId: string;
}

const FundCollection: React.FC<FundCollectionProps> = ({ userRole, loggedInUserId }) => {
  const [dynamicContent] = useDataLoader<any>(GITHUB_DYNAMIC_CONTENT_URL, {});
  const fundData = dynamicContent.fundCollection || {};

  const visibleMembers = userRole === 'Member' 
    ? (fundData.members || []).filter((m: any) => m.id === loggedInUserId) 
    : fundData.members || [];

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                ৳{fundData.totalDue?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-600 mt-1">মোট দায্যকৃত</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                ৳{fundData.totalPaid?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-600 mt-1">মোট জমা</p>
            </div>
            <div className="bg-red-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-red-600">
                ৳{fundData.totalRemaining?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-600 mt-1">মোট বাকি</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {fundData.paymentStats?.paymentPercentage || 0}%
              </div>
              <p className="text-sm text-gray-600 mt-1">সংগ্রহ হয়েছে</p>
            </div>
          </div>

          {/* Payment Stats */}
          {fundData.paymentStats && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold mb-4">📊 পেমেন্ট পরিসংখ্যান</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{fundData.paymentStats.totalMembers}</div>
                  <p className="text-xs text-gray-500">মোট সদস্য</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{fundData.paymentStats.paidMembers}</div>
                  <p className="text-xs text-gray-500">পরিশোধিত</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{fundData.paymentStats.partialMembers}</div>
                  <p className="text-xs text-gray-500">আংশিক</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{fundData.paymentStats.unpaidMembers}</div>
                  <p className="text-xs text-gray-500">বকেয়া</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Members List */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg">
          {userRole === 'Member' ? 'আপনার চাঁদা হিসাব' : 'সদস্যদের চাঁদা তালিকা'}
        </h3>
        
        {visibleMembers.map((member: any) => (
          <div key={member.id} className="bg-white rounded-xl p-5 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-lg">{member.name}</h4>
                {member.lastPaymentDate && (
                  <p className="text-sm text-gray-500">শেষ পেমেন্ট: {member.lastPaymentDate}</p>
                )}
              </div>
              <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getStatusColor(member.status))}>
                {getStatusText(member.status)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">দায্যকৃত</div>
                <div className="text-xl font-bold text-blue-600">৳{member.dueAmount}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">জমা</div>
                <div className="text-xl font-bold text-green-600">৳{member.paidAmount}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">বাকি</div>
                <div className={cn("text-xl font-bold", member.remainingAmount > 0 ? "text-red-600" : "text-green-600")}>
                  ৳{member.remainingAmount}
                </div>
              </div>
            </div>

            {member.transactionId && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <span className="text-gray-600">Transaction ID: </span>
                <span className="font-mono font-semibold">{member.transactionId}</span>
                <span className="ml-3 text-gray-600">({member.paymentMethod})</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {visibleMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">কোনো তথ্য পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
};

export default FundCollection;
