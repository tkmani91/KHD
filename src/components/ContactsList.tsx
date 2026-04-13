import React, { useState, useMemo } from 'react';
import { 
  Phone, Download, MapPin, Search, 
  Grid3X3, List, Printer, Briefcase, X
} from 'lucide-react';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface ContactPerson {
  id: string;
  name: string;
  mobile: string;
  occupation: string;
  address: string;
  photo?: string;
}

interface ContactsListProps {
  contactsData: ContactPerson[];
  pdfLink: string;
}

const ContactsList: React.FC<ContactsListProps> = ({ contactsData, pdfLink }) => {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contactsData;
    const query = searchQuery.toLowerCase().trim();
    return contactsData.filter(person =>
      person.name.toLowerCase().includes(query) ||
      person.mobile.includes(query) ||
      person.occupation.toLowerCase().includes(query) ||
      person.address.toLowerCase().includes(query)
    );
  }, [contactsData, searchQuery]);

  const handlePdfDownload = () => {
    if (!pdfLink || pdfLink === '') { alert('❌ PDF লিংক এখনো যুক্ত হয়নি'); return; }
    const link = document.createElement('a');
    link.href = pdfLink;
    link.download = 'যোগাযোগ-তালিকা.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'যোগাযোগ-তালিকা-কলম-হিন্দু-ধর্মসভা';
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1000);
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* ── Print Styles ── */}
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important; color: white !important; padding: 6px 12px; border-radius: 6px; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between; }
          .print-header h1 { font-size: 14px; font-weight: 700; margin: 0; }
          .print-header .contact-count { background: white !important; color: #1d4ed8 !important; padding: 2px 8px; border-radius: 11px; font-size: 12px; font-weight: 700; }
          .print-date { text-align: right; font-size: 10px; color: #666; margin-bottom: 4px; }
          .print-table { width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #374151; }
          .print-table th { background: #1f2937 !important; color: white !important; padding: 4px 2px; font-weight: 700; font-size: 11px; border: 1px solid #4b5563; }
          .print-table td { padding: 2px; border: 1px solid #d1d5db; vertical-align: middle; font-size: 11px; line-height: 1.1; }
          .print-table tbody tr:nth-child(even) { background: #f3f4f6 !important; }
          .print-table .serial { text-align: center; font-weight: bold; color: #2563eb; font-size: 11px; width: 8%; }
          .print-table .name-cell { font-weight: 600; font-size: 11px; color: #111827; }
          .print-table .occupation-badge { padding: 1px 3px; border-radius: 6px; font-size: 11px; font-weight: 600; background: #dbeafe !important; color: #1e40af !important; }
          .print-table .phone-cell { text-align: center; font-family: monospace; font-weight: 600; color: #059669; font-size: 11px; }
          .print-table .address-cell { color: #4b5563; font-size: 10px; }
          .print-footer { margin-top: 10px; padding-top: 6px; border-top: 2px solid #2563eb; text-align: center; font-size: 10px; color: #666; }
          @page { size: A4 portrait; margin: 3mm; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
        }
        .print-only { display: none; }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 md:p-4 shadow-lg no-print">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-white">
            <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
              যোগাযোগ তালিকা
            </h3>
            <p className="text-xs text-blue-100 mt-0.5">
              মোট {contactsData.length} জন
              {searchQuery && ` | ফলাফল: ${filteredContacts.length} জন`}
            </p>
          </div>

          {/* View Toggle - সবসময় দেখাবে */}
          <div className="flex bg-white/20 rounded-lg p-0.5 md:p-1">
            <button
              onClick={() => setViewMode('card')}
              className={cn(
                "px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition flex items-center gap-1",
                viewMode === 'card' ? "bg-white text-blue-600 shadow" : "text-white hover:bg-white/10"
              )}
            >
              <Grid3X3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">কার্ড</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition flex items-center gap-1",
                viewMode === 'list' ? "bg-white text-blue-600 shadow" : "text-white hover:bg-white/10"
              )}
            >
              <List className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">লিস্ট</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-blue-300" />
          <input
            type="text"
            placeholder="নাম, মোবাইল, পেশা বা ঠিকানা..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 md:pl-10 pr-9 py-2 md:py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-blue-200 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none px-3 py-2 bg-white/20 text-white rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-white/30 active:scale-95 transition text-xs md:text-sm"
          >
            <Printer className="w-3.5 h-3.5 md:w-4 md:h-4" />
            প্রিন্ট
          </button>
          <button
            onClick={handlePdfDownload}
            className="flex-1 md:flex-none px-3 py-2 bg-white text-blue-600 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-blue-50 active:scale-95 transition shadow text-xs md:text-sm"
          >
            <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* ── Print Section ── */}
      <div className="print-section">
        {/* Print Only */}
        <div className="print-container print-only">
          <div className="print-header">
            <h1>📞 কলম হিন্দু ধর্মসভা - যোগাযোগ তালিকা</h1>
            <span className="contact-count">👥 মোট {filteredContacts.length} জন</span>
          </div>
          <div className="print-date">প্রিন্টের তারিখ: {new Date().toLocaleDateString('bn-BD')}</div>
          <table className="print-table">
            <thead>
              <tr>
                <th>ক্রম</th><th>নাম</th><th>পেশা</th><th>মোবাইল</th><th>ঠিকানা</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((person, index) => (
                <tr key={person.id}>
                  <td className="serial">{index + 1}</td>
                  <td className="name-cell">{person.name}</td>
                  <td className="occupation-cell"><span className="occupation-badge">{person.occupation}</span></td>
                  <td className="phone-cell">{person.mobile}</td>
                  <td className="address-cell">{person.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="print-footer">
            <p>© {new Date().getFullYear()} কলম হিন্দু ধর্মসভা | কলম, সিংড়া, নাটোর</p>
          </div>
        </div>

        {/* ── No Results ── */}
        {filteredContacts.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow-lg no-print">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">কোনো যোগাযোগ পাওয়া যায়নি</p>
            <p className="text-gray-400 text-sm mt-1">অন্য কীওয়ার্ড দিয়ে খুঁজুন</p>
            <button onClick={() => setSearchQuery('')} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 active:scale-95 transition">
              সব দেখুন
            </button>
          </div>
        )}

        {/* ── Card View ── */}
        {viewMode === 'card' && filteredContacts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 no-print">
            {filteredContacts.map((person) => (
              <div key={person.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all active:scale-[0.99]">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 md:p-4 flex items-center gap-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-blue-200 shadow flex-shrink-0">
                    <img
                      src={person.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base truncate">{person.name}</h3>
                    <p className="text-blue-600 text-xs flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3 h-3" />
                      {person.occupation}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                  <a
                    href={`tel:${person.mobile}`}
                    className="flex items-center gap-2.5 p-2 md:p-2.5 bg-green-50 rounded-lg hover:bg-green-100 active:bg-green-200 transition group"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-500">মোবাইল</p>
                      <p className="font-bold text-green-700 text-sm md:text-base">{person.mobile}</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-2.5 p-2 md:p-2.5 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] md:text-xs text-gray-500">ঠিকানা</p>
                      <p className="text-xs md:text-sm text-gray-700 leading-snug">{person.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── List View ── */}
        {viewMode === 'list' && filteredContacts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden no-print">
            {/* Desktop Header */}
            <div className="hidden md:grid md:grid-cols-11 gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm">
              <div className="col-span-1 text-center">ক্রম</div>
              <div className="col-span-1"></div>
              <div className="col-span-3">নাম</div>
              <div className="col-span-2">পেশা</div>
              <div className="col-span-2">মোবাইল</div>
              <div className="col-span-2">ঠিকানা</div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold">
              {filteredContacts.length}টি যোগাযোগ
            </div>

            <div className="divide-y divide-gray-100">
              {filteredContacts.map((person, index) => (
                <div key={person.id} className="hover:bg-blue-50 transition active:bg-blue-100">
                  {/* Mobile List Row */}
                  <div className="md:hidden flex items-center gap-3 px-3 py-2.5">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full font-bold text-xs flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 flex-shrink-0">
                      <img
                        src={person.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{person.name}</h4>
                      <p className="text-blue-600 text-[11px]">{person.occupation}</p>
                      <p className="text-gray-500 text-[11px] truncate">{person.address}</p>
                    </div>
                    {/* Call Button - মোবাইলে সহজে ট্যাপ করার জন্য */}
                    <a
                      href={`tel:${person.mobile}`}
                      className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md active:scale-95 transition"
                    >
                      <Phone className="w-4 h-4 text-white" />
                    </a>
                  </div>

                  {/* Desktop List Row */}
                  <div className="hidden md:grid md:grid-cols-11 gap-2 px-4 py-2 items-center">
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200">
                        <img
                          src={person.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                          alt={person.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                        />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <h4 className="font-bold text-gray-800 text-sm">{person.name}</h4>
                    </div>
                    <div className="col-span-2">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {person.occupation}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <a href={`tel:${person.mobile}`} className="text-green-600 font-bold hover:underline flex items-center gap-1 text-sm">
                        <Phone className="w-3.5 h-3.5" />
                        {person.mobile}
                      </a>
                    </div>
                    <div className="col-span-2 text-gray-600 text-xs leading-tight">
                      {person.address}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsList;
