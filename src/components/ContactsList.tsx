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
  X,
  Eye
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
  const [selectedContact, setSelectedContact] = useState<ContactPerson | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

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
  // PRINT FUNCTION
  // ============================================
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>যোগাযোগ তালিকা - কলম হিন্দু ধর্মসভা</title>
        <style>
          @page { margin: 1cm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Noto Sans Bengali', 'Kalpurush', Arial, sans-serif; 
            font-size: 12px;
            line-height: 1.5;
            color: #333;
          }
          .header {
            text-align: center;
            padding: 15px 0;
            border-bottom: 3px solid #f97316;
            margin-bottom: 20px;
          }
          .header h1 { 
            font-size: 24px; 
            color: #f97316;
            margin-bottom: 5px;
          }
          .header p { 
            font-size: 12px; 
            color: #666;
          }
          .stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 20px;
            padding: 10px;
            background: #fff7ed;
            border-radius: 8px;
          }
          .stats span {
            font-weight: bold;
            color: #ea580c;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
            margin-top: 10px;
          }
          th { 
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-size: 11px;
            font-weight: bold;
          }
          td { 
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 11px;
            vertical-align: top;
          }
          tr:nth-child(even) { background: #fafafa; }
          tr:hover { background: #fff7ed; }
          .name { font-weight: bold; color: #1f2937; }
          .occupation { color: #f97316; font-size: 10px; }
          .mobile { 
            color: #2563eb; 
            font-weight: 600;
            font-family: monospace;
          }
          .address { color: #6b7280; font-size: 10px; }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #f97316;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
          .serial { 
            width: 40px; 
            text-align: center;
            font-weight: bold;
            color: #f97316;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🕉️ কলম হিন্দু ধর্মসভা</h1>
          <p>যোগাযোগ তালিকা</p>
        </div>
        
        <div class="stats">
          <span>মোট যোগাযোগ: ${filteredContacts.length} জন</span>
          <span>প্রিন্টের তারিখ: ${new Date().toLocaleDateString('bn-BD')}</span>
        </div>
        
        <table>
          <thead>
            <tr>
              <th class="serial">ক্রম</th>
              <th>নাম ও পেশা</th>
              <th>মোবাইল</th>
              <th>ঠিকানা</th>
            </tr>
          </thead>
          <tbody>
            ${filteredContacts.map((person, index) => `
              <tr>
                <td class="serial">${index + 1}</td>
                <td>
                  <div class="name">${person.name}</div>
                  <div class="occupation">${person.occupation}</div>
                </td>
                <td class="mobile">${person.mobile}</td>
                <td class="address">${person.address}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} কলম হিন্দু ধর্মসভা | কলম, সিংড়া, নাটোর</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      };
    }
  };

  // ============================================
  // VIEW CONTACT MODAL
  // ============================================
  const openModal = (contact: ContactPerson) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContact(null);
  };

  return (
    <div className="space-y-4">
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg">
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
      {/* NO RESULTS */}
      {/* ============================================ */}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
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
      {/* CARD VIEW */}
      {/* ============================================ */}
      {viewMode === 'card' && filteredContacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((person) => (
            <div 
              key={person.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-blue-200 shadow-lg flex-shrink-0 group-hover:scale-105 transition">
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
                  className="flex items-center gap-3 p-2.5 bg-green-50 rounded-lg hover:bg-green-100 transition group/call"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover/call:scale-110 transition">
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

              {/* Card Footer */}
              <div className="px-4 pb-4">
                <button 
                  onClick={() => openModal(person)}
                  className="w-full py-2.5 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition"
                >
                  <Eye className="w-4 h-4" /> বিস্তারিত দেখুন
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================ */}
      {/* LIST VIEW */}
      {/* ============================================ */}
      {viewMode === 'list' && filteredContacts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-1"></div>
            <div className="col-span-3">নাম</div>
            <div className="col-span-2">পেশা</div>
            <div className="col-span-2">মোবাইল</div>
            <div className="col-span-2">ঠিকানা</div>
            <div className="col-span-1 text-center">অ্যাকশন</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {filteredContacts.map((person, index) => (
              <div 
                key={person.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-blue-50 transition items-center"
              >
                {/* Serial */}
                <div className="hidden md:block col-span-1 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                    {index + 1}
                  </span>
                </div>

                {/* Photo */}
                <div className="hidden md:block col-span-1">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200">
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
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
                    <img 
                      src={person.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                      alt={person.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{person.name}</h4>
                    <p className="text-sm text-blue-600">{person.occupation}</p>
                    <a href={`tel:${person.mobile}`} className="text-sm text-green-600 font-medium">{person.mobile}</a>
                  </div>
                  <button 
                    onClick={() => openModal(person)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block col-span-3">
                  <h4 className="font-bold text-gray-800">{person.name}</h4>
                </div>
                <div className="hidden md:block col-span-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {person.occupation}
                  </span>
                </div>
                <div className="hidden md:block col-span-2">
                  <a href={`tel:${person.mobile}`} className="text-green-600 font-semibold hover:underline flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {person.mobile}
                  </a>
                </div>
                <div className="hidden md:block col-span-2 text-sm text-gray-600 truncate" title={person.address}>
                  {person.address}
                </div>
                <div className="hidden md:flex col-span-1 justify-center">
                  <button 
                    onClick={() => openModal(person)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODAL */}
      {/* ============================================ */}
      {showModal && selectedContact && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white text-center relative">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src={selectedContact.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                  alt={selectedContact.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                />
              </div>
              
              <h3 className="text-xl font-bold mt-4">{selectedContact.name}</h3>
              <p className="text-blue-100 flex items-center justify-center gap-1 mt-1">
                <Briefcase className="w-4 h-4" />
                {selectedContact.occupation}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <a 
                href={`tel:${selectedContact.mobile}`}
                className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition group"
              >
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">মোবাইল নম্বর</p>
                  <p className="text-xl font-bold text-green-700">{selectedContact.mobile}</p>
                  <p className="text-xs text-green-600">📞 কল করতে ক্লিক করুন</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ঠিকানা</p>
                  <p className="text-gray-700 leading-relaxed">{selectedContact.address}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t">
              <button 
                onClick={closeModal}
                className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsList;
