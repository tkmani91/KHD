import React, { useState } from 'react';
import { FileText, Download, MapPin, User, ChevronDown } from 'lucide-react';

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
  const [expandedArea, setExpandedArea] = useState<string | null>(null);

  const handlePdfDownload = () => {
    if (!pdfLink || pdfLink === '') {
      alert('PDF লিংক এখনো যুক্ত হয়নি');
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

  // Group by area
  const groupedInvitations = invitationData.reduce((acc, item) => {
    if (!acc[item.area]) acc[item.area] = [];
    acc[item.area].push(item);
    return acc;
  }, {} as { [key: string]: InvitationItem[] });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white text-center sm:text-left">
          <h3 className="font-bold flex items-center gap-2 justify-center sm:justify-start">
            <FileText className="w-5 h-5" /> নিমন্ত্রণ তালিকা
          </h3>
          <p className="text-sm text-green-100">
            মোট {invitationData.reduce((acc, item) => acc + item.familyCount, 0)} জন সদস্য
          </p>
        </div>
        <button 
          onClick={handlePdfDownload}
          className="px-5 py-2.5 bg-white text-green-600 rounded-lg font-medium flex items-center gap-2 hover:bg-green-50 transition shadow-lg"
        >
          <Download className="w-5 h-5" />PDF ডাউনলোড
        </button>
      </div>

      {/* Grouped by Area */}
      <div className="space-y-3">
        {Object.entries(groupedInvitations).map(([area, items]) => {
          const totalMembers = items.reduce((sum, item) => sum + item.familyCount, 0);
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
                    <p className="text-sm text-gray-500">মোট: {totalMembers} জন</p>
                  </div>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", isExpanded && "rotate-180")} />
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100">
                  <div className="p-4 space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                        <div className="flex items-center gap-3">
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InvitationListComponent;
