import React, { useState } from 'react';
import { Phone, Download, MapPin, ChevronRight } from 'lucide-react';

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

  const handlePdfDownload = () => {
    if (!pdfLink || pdfLink === '') {
      alert('PDF লিংক এখনো যুক্ত হয়নি');
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white text-center sm:text-left">
          <h3 className="font-bold flex items-center gap-2 justify-center sm:justify-start">
            <Phone className="w-5 h-5" /> যোগাযোগ তালিকা
          </h3>
          <p className="text-sm text-blue-100">মোট {contactsData.length} জন</p>
        </div>
        <button 
          onClick={handlePdfDownload}
          className="px-5 py-2.5 bg-white text-blue-600 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-50 transition shadow-lg"
        >
          <Download className="w-5 h-5" />PDF ডাউনলোড
        </button>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactsData.map((person) => (
          <div 
            key={person.id} 
            onClick={() => setSelectedContact(selectedContact?.id === person.id ? null : person)} 
            className={cn(
              "bg-white rounded-xl p-4 shadow-lg cursor-pointer transition-all", 
              selectedContact?.id === person.id && "ring-2 ring-blue-500 bg-blue-50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-blue-200 shadow flex-shrink-0">
                <img 
                  src={person.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                  alt={person.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{person.name}</h3>
                <p className="text-blue-600 text-sm">{person.occupation}</p>
              </div>
              <ChevronRight className={cn("w-5 h-5 text-gray-400 transition-transform", selectedContact?.id === person.id && "rotate-90")} />
            </div>
            
            {selectedContact?.id === person.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <a href={`tel:${person.mobile}`} className="text-blue-600 font-medium hover:underline">{person.mobile}</a>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{person.address}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsList;
