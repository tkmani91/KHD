import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  Download, 
  MapPin, 
  Search, 
  Grid3X3, 
  List, 
  Printer,
  Briefcase,
  X
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

  // ============================================
  // SEARCH FILTER
  // ============================================
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
    link.download = 'যোগাযোগ-তালিকা.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================================
  // PRINT FUNCTION (✅ Same as MembersList)
  // ============================================
  const handlePrint = () => {
    window.print();
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
            padding: 0;
            font-family: 'Segoe UI', Tahoma, sans-serif;
          }
          
          /* Header */
          .print-header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
            color: white !important;
            padding: 8px 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .print-header h1 {
            font-size: 18px;
            font-weight: 700;
            margin: 0;
          }
          
          .print-header .contact-count {
            background: white !important;
            color: #1d4ed8 !important;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
          }
          
          .print-date {
            text-align: right;
            font-size: 11px;
            color: #666;
            margin-bottom: 8px;
          }
          
          /* Table */
          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            border: 1px solid #374151;
          }
          
          .print-table th {
            background: #1e40af !important;
            color: white !important;
            padding: 8px 6px;
            font-weight: 700;
            font-size: 14px;
            border: 1px solid #1e3a8a;
            text-align: center;
          }
          
          .print-table td {
            padding: 6px;
            border: 1px solid #d1d5db;
            vertical-align: middle;
            font-size: 14px;
            line-height: 1.3;
          }
          
          .print-table tbody tr:nth-child(even) {
            background: #f0f9ff !important;
          }
          
          .print-table .serial {
            text-align: center;
            font-weight: bold;
            color: #1e40af;
            font-size: 14px;
            width: 8%;
          }
          
          .print-table .name-cell {
            font-weight: 600;
            font-size: 15px;
            color: #111827;
            width: 25%;
          }
          
          .print-table .occupation-cell {
            text-align: center;
            width: 18%;
          }
          
          .print-table .occupation-badge {
            background: #dbeafe !important;
            color: #1e40af !important;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            display: inline-block;
          }
          
          .print-table .phone-cell {
            text-align: center;
            font-family: 'Courier New', monospace;
            font-weight: 600;
            color: #059669;
            font-size: 15px;
            width: 20%;
          }
          
          .print-table .address-cell {
            color: #4b5563;
            font-size: 13px;
            line-height: 1.4;
            width: 29%;
          }
          
          .print-footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px solid #2563eb;
            text-align: center;
            font-size: 11px;
            color: #666;
          }
          
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          
          tr {
            page-break-inside: avoid;
          }
          
          thead {
            display: table-header-group;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>

      {/* ============================================ */}
      {/* HEADER - Screen Only */}
      {/* ============================================ */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg no-print">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Title */}
          <div className="text-white text-center lg:text-left">
            <h3 className="font-bold text-lg flex items-center gap-2 justify-center lg:justify-start">
              <Phone className="w-5 h-5" /> যোগাযোগ তালিকা
            </h3>
            <p className="text-sm text-blue-100">
              মোট {contactsData.length} জন 
              {searchQuery && ` | ফলাফল: ${filteredContacts.length} জন`}
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
                    ? "bg-white text-blue-600 shadow" 
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
                    ? "bg-white text-blue-600 shadow" 
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
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-50 transition shadow"
            >
              <Download className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
          <input
            type="text"
            placeholder="নাম, মোবাইল, পেশা বা ঠিকানা দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
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
            <h1>📞 কলম হিন্দু ধর্মসভা - যোগাযোগ তালিকা</h1>
            <span className="contact-count">👥 মোট {filteredContacts.length} জন</span>
          </div>
          
          <div className="print-date">
            প্রিন্টের তারিখ: {new Date().toLocaleDateString('bn-BD')}
          </div>

          {/* Table */}
          <table className="print-table">
            <thead>
              <tr>
                <th>ক্রম</th>
                <th>নাম</th>
                <th>পেশা</th>
                <th>মোবাইল</th>
                <th>ঠিকানা</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((person, index) => (
                <tr key={person.id}>
                  <td className="serial">{index + 1}</td>
                  <td className="name-cell">{person.name}</td>
                  <td className="occupation-cell">
                    <span className="occupation-badge">{person.occupation}</span>
                  </td>
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

        {/* ============================================ */}
        {/* NO RESULTS - Screen Only */}
        {/* ============================================ */}
        {filteredContacts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg no-print">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">কোনো যোগাযোগ পাওয়া যায়নি</p>
            <p className="text-gray-400 text-sm mt-1">অন্য কীওয়ার্ড দিয়ে খুঁজুন</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              সব দেখুন
            </button>
          </div>
        )}

        {/* ============================================ */}
        {/* CARD VIEW - Screen Only */}
        {/* ============================================ */}
        {viewMode === 'card' && filteredContacts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
            {filteredContacts.map((person) => (
              <div 
                key={person.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-blue-200 shadow-lg flex-shrink-0">
                    <img 
                      src={person.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                      alt={person.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{person.name}</h3>
                    <p className="text-blue-600 text-sm flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {person.occupation}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <a 
                    href={`tel:${person.mobile}`} 
                    className="flex items-center gap-3 p-2.5 bg-green-50 rounded-lg hover:bg-green-100 transition group"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">মোবাইল</p>
                      <p className="font-bold text-green-700">{person.mobile}</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 p-2.5 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">ঠিকানা</p>
                      <p className="text-sm text-gray-700 leading-snug">{person.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================ */}
        {/* LIST VIEW - Screen Only */}
        {/* ============================================ */}
        {viewMode === 'list' && filteredContacts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden no-print">
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-11 gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
              <div className="col-span-1 text-center">ক্রম</div>
              <div className="col-span-1"></div>
              <div className="col-span-3">নাম</div>
              <div className="col-span-2">পেশা</div>
              <div className="col-span-2">মোবাইল</div>
              <div className="col-span-2">ঠিকানা</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredContacts.map((person, index) => (
                <div 
                  key={person.id} 
                  className="grid grid-cols-1 md:grid-cols-11 gap-4 p-4 hover:bg-blue-50 transition items-center"
                >
                  {/* Desktop View */}
                  <div className="hidden md:block col-span-1 text-center">
                    <span className="inline-flex items-center justify-center w-9 h-9 bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </span>
                  </div>

                  <div className="hidden md:block col-span-1">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
                      <img 
                        src={person.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                        alt={person.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                      />
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </span>
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-200">
                      <img 
                        src={person.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                        alt={person.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{person.name}</h4>
                      <p className="text-blue-600 text-sm">{person.occupation}</p>
                      <a href={`tel:${person.mobile}`} className="text-green-600 font-semibold text-sm">{person.mobile}</a>
                    </div>
                  </div>

                  <div className="hidden md:block col-span-3">
                    <h4 className="font-bold text-gray-800">{person.name}</h4>
                  </div>
                  <div className="hidden md:block col-span-2">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {person.occupation}
                    </span>
                  </div>
                  <div className="hidden md:block col-span-2">
                    <a href={`tel:${person.mobile}`} className="text-green-600 font-bold hover:underline flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {person.mobile}
                    </a>
                  </div>
                  <div className="hidden md:block col-span-2 text-gray-600 text-sm" title={person.address}>
                    {person.address}
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
