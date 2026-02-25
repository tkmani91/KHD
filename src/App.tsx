import { useState, useEffect } from 'react';
import { 
  Home, Calendar, Users, Image, Music, FileText, Tv, Phone, LogIn, LogOut, 
  ChevronRight, MapPin, Facebook, Download, Play, Pause, SkipBack, SkipForward,
  User, BookOpen, Calculator, Menu, X
} from 'lucide-react';

// ============================================
// 🔧 CONFIGURATION - এখানে সব পরিবর্তন করুন
// ============================================

// 📱 লগইন সিস্টেম কনফিগারেশন
// GitHub Raw URL অথবা সরাসরি JSON ডেটা ব্যবহার করতে পারেন
const LOGIN_CONFIG = {
  // অপশন ১: GitHub JSON URL (আপনার GitHub URL দিন)
  // উদাহরণ: 'https://raw.githubusercontent.com/username/repo/main/members-login.json'
  githubUrl: '', // এখানে আপনার GitHub URL দিন অথবা খালি রাখুন
  
  // অপশন ২: সরাসরি ডেমো ডেটা (প্রথমে এটি দিয়ে টেস্ট করুন)
  useDemoData: true, // true দিলে নিচের DEMO_LOGIN_DATA ব্যবহার হবে
};

// 👤 ডেমো লগইন ডেটা - এখানে মেম্বর যোগ করুন
const DEMO_LOGIN_DATA = {
  // সাধারণ মেম্বর - হিসাব বিবরণ দেখতে পারবে না
  normalMembers: [
    {
      mobile: "01712345678",
      email: "member1@gmail.com",
      password: "member123",
      name: "রাম প্রসাদ শীল"
    },
    {
      mobile: "01712345679",
      email: "member2@gmail.com",
      password: "member456",
      name: "শ্যাম কুমার হালদার"
    },
    {
      mobile: "01712345680",
      email: "member3@gmail.com",
      password: "member789",
      name: "গোপাল চন্দ্র ভাট"
    }
  ],
  // হিসাব দেখা মেম্বর - সব দেখতে পারবে
  accountsMembers: [
    {
      mobile: "01812345678",
      email: "admin@gmail.com",
      password: "admin123",
      name: "কমিটি সভাপতি"
    },
    {
      mobile: "01812345679",
      email: "secretary@gmail.com",
      password: "secretary123",
      name: "সম্পাদক"
    }
  ]
};

// 📄 PDF ফাইল URL - এখানে আপনার PDF লিংক দিন
const PDF_FILES = {
  // মেম্বর লিস্ট PDF
  membersList: '/pdfs/members-list-2025.pdf',
  
  // কন্টাক্ট লিস্ট PDF
  contactList: '/pdfs/contact-persons-list.pdf',
  
  // নিমন্ত্রণ লিস্ট PDF
  invitationList: '/pdfs/invitation-list-all-areas.pdf',
  
  // হিসাব বিবরণী PDF
  accounts: {
    durgaPuja: {
      '2024': '/pdfs/accounts/durga-puja-2024.pdf',
      '2023': '/pdfs/accounts/durga-puja-2023.pdf',
    },
    shyamaPuja: {
      '2024': '/pdfs/accounts/shyama-puja-2024.pdf',
      '2023': '/pdfs/accounts/shyama-puja-2023.pdf',
    },
    saraswatiPuja: {
      '2024': '/pdfs/accounts/saraswati-puja-2024.pdf',
      '2023': '/pdfs/accounts/saraswati-puja-2023.pdf',
    },
    rathYatra: {
      '2024': '/pdfs/accounts/rath-yatra-2024.pdf',
      '2023': '/pdfs/accounts/rath-yatra-2023.pdf',
    }
  }
};

// 📱 ফেসবুক পেজ লিংক
const FACEBOOK_PAGES = {
  main: 'https://facebook.com/kolomhindudhormosova',
  durgaPuja: 'https://facebook.com/kolomdurgapuja',
  shyamaPuja: 'https://facebook.com/kolomshyamapuja',
  saraswatiPuja: 'https://facebook.com/kolomsaraswatipuja',
  rathYatra: 'https://facebook.com/kolomrathyatra'
};

// 📅 পূজার তারিখ কনফিগারেশন
const PUJA_DATES = {
  durgaPuja: {
    year: 2025,
    // পূজার প্রধান দিন (মহাষ্টমী)
    mainDate: '2025-10-01',
    // সম্পূর্ণ তিথি লিস্ট
    tithis: [
      { name: 'মহালয়া', date: '2025-09-22', day: 'সোমবার' },
      { name: 'পঞ্চমী', date: '2025-09-28', day: 'রবিবার' },
      { name: 'ষষ্ঠী', date: '2025-09-29', day: 'সোমবার' },
      { name: 'সপ্তমী', date: '2025-09-30', day: 'মঙ্গলবার' },
      { name: 'মহাষ্টমী', date: '2025-10-01', day: 'বুধবার' },
      { name: 'মহানবমী', date: '2025-10-02', day: 'বৃহস্পতিবার' },
      { name: 'দশমী/বিজয়া', date: '2025-10-03', day: 'শুক্রবার' }
    ]
  },
  shyamaPuja: {
    year: 2025,
    // পূজার প্রধান দিন (কালীপূজা)
    mainDate: '2025-10-26',
    tithis: [
      { name: 'ত্রয়োদশী', date: '2025-10-25', day: 'শনিবার' },
      { name: 'কালীপূজা', date: '2025-10-26', day: 'রবিবার' },
      { name: 'অমাবস্যা', date: '2025-10-27', day: 'সোমবার' }
    ]
  },
  saraswatiPuja: {
    year: 2025,
    // পূজার প্রধান দিন (পঞ্চমী)
    mainDate: '2025-02-02',
    tithis: [
      { name: 'চতুর্থী', date: '2025-02-01', day: 'শনিবার' },
      { name: 'বসন্ত পঞ্চমী', date: '2025-02-02', day: 'রবিবার' },
      { name: 'ষষ্ঠী', date: '2025-02-03', day: 'সোমবার' }
    ]
  },
  rathYatra: {
    year: 2025,
    // রথযাত্রা
    mainDate: '2025-06-27',
    // উল্টো রথযাত্রা
    returnDate: '2025-07-05',
    tithis: [
      { name: 'রথযাত্রা', date: '2025-06-27', day: 'শুক্রবার' },
      { name: 'উল্টো রথযাত্রা', date: '2025-07-05', day: 'শনিবার' }
    ]
  }
};

// 📺 লাইভ TV চ্যানেল
const LIVE_TV_CHANNELS = [
  { name: 'সনাতন টিভি', url: 'https://example.com/stream1.m3u8', logo: '/tv-logo-1.png' },
  { name: 'ভক্তি টিভি', url: 'https://example.com/stream2.m3u8', logo: '/tv-logo-2.png' },
  { name: 'আরতী টিভি', url: 'https://example.com/stream3.m3u8', logo: '/tv-logo-3.png' }
];

// 🔔 নোটিশ/বিজ্ঞপ্তি
const NOTICES = [
  '🔔 দূর্গাপূজা ২০২৫ এর প্রস্তুতি সভা ১৫ আগস্ট অনুষ্ঠিত হবে',
  '📢 সকল মেম্বরদের নতুন নম্বর রেজিস্ট্রেশন করতে অনুরোধ করা হলো',
  '🎉 শ্যামাপূজা ২০২৫ এর তারিখ নির্ধারিত হয়েছে'
];

// ============================================
// JSON FILE TEMPLATE (GitHub এর জন্য)
// ============================================
/*
📁 ফাইল নাম: members-login.json
📂 লোকেশন: GitHub Repository Root

{
  "normalMembers": [
    {
      "mobile": "01712345678",
      "email": "member1@gmail.com",
      "password": "member123",
      "name": "রাম প্রসাদ শীল"
    }
  ],
  "accountsMembers": [
    {
      "mobile": "01812345678",
      "email": "admin@gmail.com",
      "password": "admin123",
      "name": "কমিটি সভাপতি"
    }
  ]
}
*/

// ============================================
// COMPONENTS
// ============================================

// Countdown Timer Component
function CountdownTimer({ targetDate, label }: { targetDate: string; label: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-700 font-semibold">🎉 {label} অনুষ্ঠিত হয়েছে!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
      <p className="text-sm text-orange-700 mb-2 font-medium">{label} শুরু হতে বাকি:</p>
      <div className="flex justify-center gap-2">
        {[
          { value: timeLeft.days, label: 'দিন' },
          { value: timeLeft.hours, label: 'ঘণ্টা' },
          { value: timeLeft.minutes, label: 'মিনিট' },
          { value: timeLeft.seconds, label: 'সেকেন্ড' }
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-lg px-3 py-2 shadow-sm border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">{String(item.value).padStart(2, '0')}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Member Login Page
function LoginPage({ onClose }: { onClose: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginType, setLoginType] = useState<'normal' | 'accounts'>('normal');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('members');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  // Demo Member Data
  const memberData = {
    members: [
      { id: 1, name: 'রাম প্রসাদ শীল', designation: 'সভাপতি', mobile: '01712345678', father: 'গোপাল শীল', mother: 'সীতা শীল', dob: '১৯৮০-০৫-১৫', gotra: 'কাশ্যপ', email: 'ram@gmail.com', occupation: 'ব্যবসায়ী', address: 'হালদার পাড়া, কলম', permanentAddress: 'কলম, সিংড়া, নাটোর' },
      { id: 2, name: 'শ্যাম কুমার হালদার', designation: 'সম্পাদক', mobile: '01712345679', father: 'রামেশ্বর হালদার', mother: 'অন্নপূর্ণা হালদার', dob: '১৯৮৫-০৮-২০', gotra: 'ভরদ্বাজ', email: 'shyam@gmail.com', occupation: 'শিক্ষক', address: 'মধ্য পাড়া, কলম', permanentAddress: 'কলম, সিংড়া, নাটোর' },
      { id: 3, name: 'গোপাল চন্দ্র ভাট', designation: 'কোষাধ্যক্ষ', mobile: '01712345680', father: 'নবীন ভাট', mother: 'মীনা ভাট', dob: '১৯৭৮-১২-১০', gotra: 'শান্দিল্য', email: 'gopal@gmail.com', occupation: 'কৃষক', address: 'ভাটোপাড়া, কলম', permanentAddress: 'কলম, সিংড়া, নাটোর' },
      { id: 4, name: 'মদন মোহন কুমার', designation: 'সদস্য', mobile: '01712345681', father: 'কেশব কুমার', mother: 'রाधা কুমার', dob: '১৯৯০-০৩-২৫', gotra: 'কাশ্যপ', email: 'madan@gmail.com', occupation: 'চাকরি', address: 'কুমার পাড়া, কলম', permanentAddress: 'কলম, সিংড়া, নাটোর' }
    ],
    contacts: [
      { id: 1, name: 'রামু ঢাকী', profession: 'ঢাকওয়ালা', mobile: '01711111111', address: 'কলম বাজার' },
      { id: 2, name: 'বাদল নাওয়া', profession: 'নৌকাওয়ালা', mobile: '01722222222', address: 'সিংড়া' },
      { id: 3, name: 'প্রফুল্ল পুরহিত', profession: 'পুরহিত', mobile: '01733333333', address: 'নাটোর' },
      { id: 4, name: 'অশোক পাল', profession: 'প্রতিমা শিল্পী', mobile: '01744444444', address: 'রাজশাহী' },
      { id: 5, name: 'সুজন ডেকোরেটর', profession: 'ডেকোরেটর', mobile: '01755555555', address: 'নাটোর' }
    ],
    invitations: [
      { area: 'হালদার পাড়া', households: 25 },
      { area: 'মধ্য পাড়া', households: 30 },
      { area: 'ভাটোপাড়া', households: 20 },
      { area: 'বাজার পাড়া', households: 35 },
      { area: 'পুন্ডরী', households: 15 },
      { area: 'কুমার পাড়া', households: 22 },
      { area: 'শীল পাড়া', households: 28 },
      { area: 'জগৎপুর/কামার পাড়া', households: 18 }
    ]
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let loginData;

      if (LOGIN_CONFIG.useDemoData) {
        // ডেমো ডেটা ব্যবহার করুন
        loginData = DEMO_LOGIN_DATA;
      } else if (LOGIN_CONFIG.githubUrl) {
        // GitHub থেকে লোড করুন
        const response = await fetch(LOGIN_CONFIG.githubUrl);
        if (!response.ok) throw new Error('লগইন ডেটা লোড করতে ব্যর্থ');
        loginData = await response.json();
      } else {
        throw new Error('লগইন কনফিগারেশন সেট করা হয়নি');
      }

      // সাধারণ মেম্বর চেক
      const normalMember = loginData.normalMembers.find(
        (m: any) => (m.mobile === identifier || m.email === identifier) && m.password === password
      );

      // হিসাব দেখা মেম্বর চেক
      const accountsMember = loginData.accountsMembers.find(
        (m: any) => (m.mobile === identifier || m.email === identifier) && m.password === password
      );

      if (normalMember) {
        setIsLoggedIn(true);
        setLoginType('normal');
        setCurrentMember(normalMember);
      } else if (accountsMember) {
        setIsLoggedIn(true);
        setLoginType('accounts');
        setCurrentMember(accountsMember);
      } else {
        setError('❌ ভুল মোবাইল নম্বর/ইমেইল বা পাসওয়ার্ড!');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError('❌ লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginType('normal');
    setCurrentMember(null);
    setIdentifier('');
    setPassword('');
    setActiveTab('members');
    setSelectedMember(null);
    setSelectedContact(null);
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">👤 মেম্বর ড্যাশবোর্ড</h2>
                <p className="text-orange-100 mt-1">স্বাগতম, {currentMember?.name || 'মেম্বর'}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  loginType === 'accounts' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {loginType === 'accounts' ? '🔑 হিসাব দেখার অনুমতি আছে' : '👥 সাধারণ মেম্বর'}
                </span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all">
                <LogOut className="w-5 h-5" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md mb-6 overflow-x-auto">
            <div className="flex p-2 gap-2 min-w-max">
              {[
                { id: 'members', label: '👥 মেম্বর ইনফো', icon: Users },
                { id: 'contacts', label: '📞 প্রয়োজনীয় নম্বর', icon: Phone },
                { id: 'invitations', label: '📋 নিমন্ত্রণ লিস্ট', icon: BookOpen },
                ...(loginType === 'accounts' ? [{ id: 'accounts', label: '💰 হিসাব বিবরণী', icon: Calculator }] : [])
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedMember(null);
                    setSelectedContact(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h3 className="text-xl font-bold text-gray-800">👥 মেম্বর তালিকা</h3>
                  <a
                    href={PDF_FILES.membersList}
                    download
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>সম্পূর্ণ লিস্ট PDF ডাউনলোড</span>
                  </a>
                </div>

                {selectedMember ? (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold text-gray-800">{selectedMember.name}</h4>
                      <button
                        onClick={() => setSelectedMember(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕ ফিরে যান
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <InfoItem label="পদবী" value={selectedMember.designation} />
                      <InfoItem label="মোবাইল" value={selectedMember.mobile} />
                      <InfoItem label="পিতার নাম" value={selectedMember.father} />
                      <InfoItem label="মাতার নাম" value={selectedMember.mother} />
                      <InfoItem label="জন্ম তারিখ" value={selectedMember.dob} />
                      <InfoItem label="গোত্র" value={selectedMember.gotra} />
                      <InfoItem label="ইমেইল" value={selectedMember.email} />
                      <InfoItem label="পেশা" value={selectedMember.occupation} />
                      <InfoItem label="বর্তমান ঠিকানা" value={selectedMember.address} />
                      <InfoItem label="স্থায়ী ঠিকানা" value={selectedMember.permanentAddress} />
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {memberData.members.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        className="bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg p-4 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.designation}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">📱 {member.mobile}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h3 className="text-xl font-bold text-gray-800">📞 প্রয়োজনীয় ফোন নম্বর</h3>
                  <a
                    href={PDF_FILES.contactList}
                    download
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>সম্পূর্ণ লিস্ট PDF ডাউনলোড</span>
                  </a>
                </div>

                {selectedContact ? (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold text-gray-800">{selectedContact.name}</h4>
                      <button
                        onClick={() => setSelectedContact(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕ ফিরে যান
                      </button>
                    </div>
                    <div className="space-y-3">
                      <InfoItem label="পেশা" value={selectedContact.profession} />
                      <InfoItem label="মোবাইল" value={selectedContact.mobile} />
                      <InfoItem label="ঠিকানা" value={selectedContact.address} />
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {memberData.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-4 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Phone className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.profession}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">📱 {contact.mobile}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Invitations Tab */}
            {activeTab === 'invitations' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h3 className="text-xl font-bold text-gray-800">📋 নিমন্ত্রণ লিস্ট (এলাকা ভিত্তিক)</h3>
                  <a
                    href={PDF_FILES.invitationList}
                    download
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>সম্পূর্ণ লিস্ট PDF ডাউনলোড</span>
                  </a>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {memberData.invitations.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4"
                    >
                      <p className="font-semibold text-gray-800 mb-1">{item.area}</p>
                      <p className="text-2xl font-bold text-green-600">{item.households}</p>
                      <p className="text-sm text-gray-500">বাড়ি</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>📌 নোট:</strong> সকল এলাকার নিমন্ত্রণ তালিকা একটি PDF ফাইলে সংযুক্ত। উপরের বাটনে ক্লিক করে ডাউনলোড করুন।
                  </p>
                </div>
              </div>
            )}

            {/* Accounts Tab */}
            {activeTab === 'accounts' && loginType === 'accounts' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">💰 হিসাব বিবরণী</h3>
                
                {Object.entries(PDF_FILES.accounts).map(([puja, years]) => (
                  <div key={puja} className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3 capitalize">
                      {puja === 'durgaPuja' && '🌺 দূর্গাপূজা'}
                      {puja === 'shyamaPuja' && '🪔 শ্যামাপূজা'}
                      {puja === 'saraswatiPuja' && '📚 সরস্বতীপূজা'}
                      {puja === 'rathYatra' && '🛕 রথযাত্রা'}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(years).map(([year, url]) => (
                        <a
                          key={year}
                          href={url}
                          download
                          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-200 transition-all"
                        >
                          <FileText className="w-4 h-4" />
                          <span>{year} সাল</span>
                          <Download className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">মেম্বর লগইন</h2>
          <p className="text-gray-500 mt-2">আপনার তথ্য দিয়ে লগইন করুন</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              মোবাইল নম্বর বা ইমেইল
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="01XXXXXXXXX অথবা email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="আপনার পাসওয়ার্ড"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>লোড হচ্ছে...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>লগইন করুন</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">📋 ব্যবহার বিধি:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• মোবাইল নম্বর বা ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন</li>
            <li>• মেম্বর ইনফরমেশন, প্রয়োজনীয় ফোন নম্বর, নিমন্ত্রণ লিস্ট দেখুন</li>
            <li>• প্রতিটি লিস্টের জন্য একটি PDF ডাউনলোড করতে পারবেন</li>
            <li>• হিসাব বিবরণ শুধু "হিসাব দেখুন" লগইনে দেখা যাবে</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-500 hover:text-gray-700 py-2"
        >
          ✕ বন্ধ করুন
        </button>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg p-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'durga', label: 'দূর্গাপূজা', icon: Calendar },
    { id: 'shyama', label: 'শ্যামাপূজা', icon: Calendar },
    { id: 'saraswati', label: 'সরস্বতীপূজা', icon: Calendar },
    { id: 'rathyatra', label: 'রথযাত্রা', icon: Calendar },
    { id: 'devs', label: 'দেব-দেবী', icon: Users },
    { id: 'gallery', label: 'ফটো গ্যালারি', icon: Image },
    { id: 'songs', label: 'ধর্মীয় গান', icon: Music },
    { id: 'pdfs', label: 'PDF', icon: FileText },
    { id: 'tv', label: 'লাইভ TV', icon: Tv },
    { id: 'contact', label: 'যোগাযোগ', icon: Phone },
  ];

  const renderPage = () => {
    if (showLogin) {
      return <LoginPage onClose={() => setShowLogin(false)} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'durga':
        return <DurgaPujaPage />;
      case 'shyama':
        return <ShyamaPujaPage />;
      case 'saraswati':
        return <SaraswatiPujaPage />;
      case 'rathyatra':
        return <RathYatraPage />;
      case 'devs':
        return <DevsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'songs':
        return <SongsPage />;
      case 'pdfs':
        return <PDFsPage />;
      case 'tv':
        return <LiveTVPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Scrolling Notice */}
      <div className="bg-red-600 text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {NOTICES.map((notice, index) => (
            <span key={index} className="mx-8">{notice}</span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">কলম হিন্দু ধর্মসভা</h1>
              <p className="text-orange-100 text-sm mt-1">কলম, সিংড়া, নাটোর, রাজশাহী, বাংলাদেশ</p>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setShowLogin(false);
                  }}
                  className={`flex items-center gap-1 px-2 py-2 rounded-lg transition-all text-xs whitespace-nowrap ${
                    currentPage === item.id && !showLogin
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => setShowLogin(true)}
                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition-all text-xs whitespace-nowrap ${
                  showLogin ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4">
              <div className="grid grid-cols-2 gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setShowLogin(false);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all text-sm ${
                      currentPage === item.id && !showLogin
                        ? 'bg-white/20'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all text-sm ${
                    showLogin ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>লগইন</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">কলম হিন্দু ধর্মসভা</h3>
              <p className="text-gray-400">কলম, সিংড়া, নাটোর</p>
              <p className="text-gray-400">রাজশাহী, বাংলাদেশ</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">যোগাযোগ</h3>
              <p className="text-gray-400">ফোন: ০১৭১২৩৪৫৬৭৮</p>
              <p className="text-gray-400">ইমেইল: info@kolomhindu.org</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">সোশ্যাল মিডিয়া</h3>
              <a href={FACEBOOK_PAGES.main} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
                <span>ফেসবুক পেজ</span>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© ২০২৫ কলম হিন্দু ধর্মসভা - সর্বস্বত্ব সংরক্ষিত</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Page Components
function HomePage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">🙏 স্বাগতম</h2>
        <p className="text-lg md:text-xl opacity-90">কলম হিন্দু ধর্মসভার অফিসিয়াল ওয়েবসাইটে আপনাকে স্বাগতম</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a href={FACEBOOK_PAGES.main} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            <Facebook className="w-5 h-5" />
            <span>ফেসবুক পেজ</span>
          </a>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🌺 দূর্গাপূজা ২০২৫</h3>
          <CountdownTimer targetDate={PUJA_DATES.durgaPuja.mainDate} label="দূর্গাপূজা" />
          <button onClick={() => setCurrentPage('durga')} className="mt-4 w-full text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center gap-1">
            বিস্তারিত দেখুন <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🪔 শ্যামাপূজা ২০২৫</h3>
          <CountdownTimer targetDate={PUJA_DATES.shyamaPuja.mainDate} label="শ্যামাপূজা" />
          <button onClick={() => setCurrentPage('shyama')} className="mt-4 w-full text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center gap-1">
            বিস্তারিত দেখুন <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 সরস্বতীপূজা ২০২৫</h3>
          <CountdownTimer targetDate={PUJA_DATES.saraswatiPuja.mainDate} label="সরস্বতীপূজা" />
          <button onClick={() => setCurrentPage('saraswati')} className="mt-4 w-full text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center gap-1">
            বিস্তারিত দেখুন <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🛕 রথযাত্রা ২০২৫</h3>
          <CountdownTimer targetDate={PUJA_DATES.rathYatra.mainDate} label="রথযাত্রা" />
          <button onClick={() => setCurrentPage('rathyatra')} className="mt-4 w-full text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center gap-1">
            বিস্তারিত দেখুন <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📢 সর্বশেষ আপডেট</h3>
        <div className="space-y-3">
          {NOTICES.map((notice, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-orange-500 mt-1">•</span>
              <p className="text-gray-700">{notice}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DurgaPujaPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">🌺 দূর্গাপূজা {PUJA_DATES.durgaPuja.year}</h2>
        <p className="mt-2 opacity-90">মহাষ্টমী: {new Date(PUJA_DATES.durgaPuja.mainDate).toLocaleDateString('bn-BD')}</p>
      </div>

      <CountdownTimer targetDate={PUJA_DATES.durgaPuja.mainDate} label="দূর্গাপূজা" />

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📅 সময়সূচি</h3>
        <div className="space-y-3">
          {PUJA_DATES.durgaPuja.tithis.map((tithi, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">{tithi.name}</p>
                <p className="text-sm text-gray-500">{tithi.day}</p>
              </div>
              <p className="text-orange-600 font-medium">{new Date(tithi.date).toLocaleDateString('bn-BD')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">📘 আরও তথ্য</h3>
        <p className="text-blue-700">বিস্তারিত তথ্যের জন্য আমাদের ফেসবুক পেজ দেখুন</p>
        <a href={FACEBOOK_PAGES.durgaPuja} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-800 font-medium">
          <Facebook className="w-5 h-5" />
          <span>দূর্গাপূজা ফেসবুক পেজ</span>
        </a>
      </div>
    </div>
  );
}

function ShyamaPujaPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">🪔 শ্যামাপূজা {PUJA_DATES.shyamaPuja.year}</h2>
        <p className="mt-2 opacity-90">কালীপূজা: {new Date(PUJA_DATES.shyamaPuja.mainDate).toLocaleDateString('bn-BD')}</p>
      </div>

      <CountdownTimer targetDate={PUJA_DATES.shyamaPuja.mainDate} label="শ্যামাপূজা" />

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📅 তিথি ও সময়সূচি</h3>
        <div className="space-y-3">
          {PUJA_DATES.shyamaPuja.tithis.map((tithi, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">{tithi.name}</p>
                <p className="text-sm text-gray-500">{tithi.day}</p>
              </div>
              <p className="text-purple-600 font-medium">{new Date(tithi.date).toLocaleDateString('bn-BD')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">📘 আরও তথ্য</h3>
        <a href={FACEBOOK_PAGES.shyamaPuja} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          <Facebook className="w-5 h-5" />
          <span>শ্যামাপূজা ফেসবুক পেজ</span>
        </a>
      </div>
    </div>
  );
}

function SaraswatiPujaPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">📚 সরস্বতীপূজা {PUJA_DATES.saraswatiPuja.year}</h2>
        <p className="mt-2 opacity-90">বসন্ত পঞ্চমী: {new Date(PUJA_DATES.saraswatiPuja.mainDate).toLocaleDateString('bn-BD')}</p>
      </div>

      <CountdownTimer targetDate={PUJA_DATES.saraswatiPuja.mainDate} label="সরস্বতীপূজা" />

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📅 তিথি ও সময়সূচি</h3>
        <div className="space-y-3">
          {PUJA_DATES.saraswatiPuja.tithis.map((tithi, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">{tithi.name}</p>
                <p className="text-sm text-gray-500">{tithi.day}</p>
              </div>
              <p className="text-yellow-600 font-medium">{new Date(tithi.date).toLocaleDateString('bn-BD')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">📘 আরও তথ্য</h3>
        <a href={FACEBOOK_PAGES.saraswatiPuja} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          <Facebook className="w-5 h-5" />
          <span>সরস্বতীপূজা ফেসবুক পেজ</span>
        </a>
      </div>
    </div>
  );
}

function RathYatraPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">🛕 রথযাত্রা {PUJA_DATES.rathYatra.year}</h2>
        <p className="mt-2 opacity-90">রথযাত্রা: {new Date(PUJA_DATES.rathYatra.mainDate).toLocaleDateString('bn-BD')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <CountdownTimer targetDate={PUJA_DATES.rathYatra.mainDate} label="রথযাত্রা" />
        <CountdownTimer targetDate={PUJA_DATES.rathYatra.returnDate} label="উল্টো রথযাত্রা" />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📅 তিথি ও সময়সূচি</h3>
        <div className="space-y-3">
          {PUJA_DATES.rathYatra.tithis.map((tithi, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">{tithi.name}</p>
                <p className="text-sm text-gray-500">{tithi.day}</p>
              </div>
              <p className="text-blue-600 font-medium">{new Date(tithi.date).toLocaleDateString('bn-BD')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">📘 আরও তথ্য</h3>
        <a href={FACEBOOK_PAGES.rathYatra} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          <Facebook className="w-5 h-5" />
          <span>রথযাত্রা ফেসবুক পেজ</span>
        </a>
      </div>
    </div>
  );
}

function DevsPage() {
  const devs = [
    {
      name: 'দুর্গা মা',
      title: 'অসুরদমনী, মহিষাসুরমর্দিনী',
      description: 'দুর্গা মা হিন্দু ধর্মের অন্যতম প্রধান দেবী। তিনি শক্তির প্রতীক এবং অসুরদের বিনাশ করে ধর্ম রক্ষা করেন। দূর্গাপূজায় তাকে আরাধনা করা হয়।',
      icon: '🌺'
    },
    {
      name: 'কালী মা',
      title: 'মহাকালী, কালিকা',
      description: 'কালী মা দুর্গার অন্যতম রূপ। তিনি সময়ের অধিদেবী এবং মোক্ষ প্রদানকারীনী। তার আরাধনায় ভক্তরা আধ্যাত্মিক শক্তি লাভ করেন।',
      icon: '⚔️'
    },
    {
      name: 'শ্যামা মা',
      title: 'কালীর অন্য রূপ, কৃষ্ণবর্ণা',
      description: 'শ্যামা মা কালীর কৃষ্ণবর্ণা রূপ। শ্যামাপূজায় তার আরাধনা করা হয়। তিনি ভক্তদের সমস্ত কষ্ট দূর করেন।',
      icon: '🪔'
    },
    {
      name: 'সরস্বতী মা',
      title: 'বিদ্যাদেবী, বাণীদেবী',
      description: 'সরস্বতী মা জ্ঞান, বিদ্যা ও সংগীতের দেবী। সরস্বতীপূজায় ছাত্রছাত্রীরা তার আরাধনা করে জ্ঞান লাভের প্রার্থনা করে।',
      icon: '📚'
    },
    {
      name: 'জগন্নাথ দেব',
      title: 'বিশ্বনাথ, পুরীধাম',
      description: 'জগন্নাথ দেব ভগবান বিষ্ণুর একটি রূপ। রথযাত্রায় তার আরাধনা করা হয়। তিনি সমগ্র বিশ্বের নাথ।',
      icon: '🛕'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">🙏 দেব-দেবীর পরিচিতি</h2>
        <p className="mt-2 opacity-90">আমাদের পূজিত দেবতাদের পরিচিতি</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {devs.map((dev, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">{dev.icon}</div>
            <h3 className="text-xl font-bold text-gray-800">{dev.name}</h3>
            <p className="text-orange-600 font-medium mb-3">{dev.title}</p>
            <p className="text-gray-600">{dev.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPuja, setSelectedPuja] = useState('all');

  const years = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];
  const pujaTypes = [
    { id: 'all', label: 'সব' },
    { id: 'durga', label: 'দূর্গাপূজা' },
    { id: 'shyama', label: 'শ্যামাপূজা' },
    { id: 'saraswati', label: 'সরস্বতীপূজা' },
    { id: 'rathyatra', label: 'রথযাত্রা' }
  ];

  const galleryImages = [
    { id: 1, year: '2024', puja: 'durga', title: 'দূর্গাপূজা ২০২৪', src: '/gallery/2024/durga-1.jpg' },
    { id: 2, year: '2024', puja: 'durga', title: 'দূর্গাপূজা ২০২৪', src: '/gallery/2024/durga-2.jpg' },
    { id: 3, year: '2023', puja: 'shyama', title: 'শ্যামাপূজা ২০২৩', src: '/gallery/2023/shyama-1.jpg' },
    { id: 4, year: '2023', puja: 'saraswati', title: 'সরস্বতীপূজা ২০২৩', src: '/gallery/2023/saraswati-1.jpg' },
  ];

  const filteredImages = galleryImages.filter(img => {
    const yearMatch = img.year === selectedYear;
    const pujaMatch = selectedPuja === 'all' || img.puja === selectedPuja;
    return yearMatch && pujaMatch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">📸 ফটো গ্যালারি</h2>
        <p className="mt-2 opacity-90">২০১৭ থেকে ২০২৬ সাল পর্যন্ত পূজার ছবি</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">সাল নির্বাচন করুন</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">পূজার ধরন</label>
            <select
              value={selectedPuja}
              onChange={(e) => setSelectedPuja(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {pujaTypes.map(puja => (
                <option key={puja.id} value={puja.id}>{puja.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredImages.map((image) => (
          <div key={image.id} className="bg-white rounded-xl shadow-md overflow-hidden group">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <Image className="w-16 h-16 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{image.title}</h3>
              <button className="mt-2 flex items-center gap-2 text-purple-600 hover:text-purple-700">
                <Download className="w-4 h-4" />
                <span>ডাউনলোড</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>এই সালের ছবি এখনো আপলোড করা হয়নি</p>
        </div>
      )}
    </div>
  );
}

function SongsPage() {
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const categories = [
    {
      name: 'ভজন',
      songs: [
        { id: 1, title: 'জয় মা দুর্গে', duration: '৫:৩০' },
        { id: 2, title: 'ওম নমঃ শিবায়', duration: '৪:৪৫' },
        { id: 3, title: 'হরে কৃষ্ণ হরে রাম', duration: '৬:১৫' },
      ]
    },
    {
      name: 'আরতী',
      songs: [
        { id: 4, title: 'অম্বেদুর্গা আরতী', duration: '৭:০০' },
        { id: 5, title: 'ওম জয় জগদীশ হরে', duration: '৫:৪৫' },
        { id: 6, title: 'কালী আরতী', duration: '৬:৩০' },
      ]
    },
    {
      name: 'কীর্তন',
      songs: [
        { id: 7, title: 'হরিনাম সংকীর্তন', duration: '১০:০০' },
        { id: 8, title: 'বৈষ্ণব কীর্তন', duration: '৮:৩০' },
      ]
    },
    {
      name: 'মন্ত্র',
      songs: [
        { id: 9, title: 'গায়ত্রী মন্ত্র', duration: '৩:০০' },
        { id: 10, title: 'মহামৃত্যুঞ্জয় মন্ত্র', duration: '৪:০০' },
      ]
    }
  ];

  const togglePlay = (songId: number) => {
    if (currentSong === songId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(songId);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">🎵 ধর্মীয় গান</h2>
        <p className="mt-2 opacity-90">পবিত্র ভজন ও আরতী সংগীত</p>
      </div>

      {/* Player */}
      {currentSong && (
        <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">বর্তমানে বাজছে</p>
                <p className="text-sm text-gray-500">গান #{currentSong}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{category.name}</h3>
            <div className="space-y-2">
              {category.songs.map((song) => (
                <div
                  key={song.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    currentSong === song.id ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePlay(song.id)}
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center"
                    >
                      {currentSong === song.id && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <p className="font-medium text-gray-800">{song.title}</p>
                      <p className="text-sm text-gray-500">{song.duration}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-green-600 hover:text-green-700">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">ডাউনলোড</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PDFsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'সব' },
    { id: 'durga', label: 'দূর্গাপূজা ফর্দ' },
    { id: 'shyama', label: 'শ্যামাপূজা ফর্দ' },
    { id: 'saraswati', label: 'সরস্বতীপূজা ফর্দ' },
    { id: 'marriage', label: 'বিবাহ ফর্দ' },
    { id: 'shraddha', label: 'শ্রাদ্ধ ফর্দ' }
  ];

  const pdfFiles = [
    { id: 1, title: 'দূর্গাপূজা ফর্দ ২০২৫', category: 'durga', size: '২.৫ MB' },
    { id: 2, title: 'শ্যামাপূজা ফর্দ ২০২৫', category: 'shyama', size: '১.৮ MB' },
    { id: 3, title: 'সরস্বতীপূজা ফর্দ ২০২৫', category: 'saraswati', size: '২.০ MB' },
    { id: 4, title: 'বিবাহ ফর্দ (কনে পক্ষ)', category: 'marriage', size: '৩.৫ MB' },
    { id: 5, title: 'বিবাহ ফর্দ (বর পক্ষ)', category: 'marriage', size: '৩.৫ MB' },
    { id: 6, title: 'আদ্যশ্রাদ্ধ ফর্দ', category: 'shraddha', size: '১.২ MB' },
    { id: 7, title: 'বাৎসরিক শ্রাদ্ধ ফর্দ', category: 'shraddha', size: '১.৫ MB' },
  ];

  const filteredPDFs = selectedCategory === 'all'
    ? pdfFiles
    : pdfFiles.filter(pdf => pdf.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">📄 PDF ডাউনলোড</h2>
        <p className="mt-2 opacity-90">প্রয়োজনীয় সকল ফাইল ডাউনলোড করুন</p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PDF List */}
      <div className="grid gap-4">
        {filteredPDFs.map((pdf) => (
          <div key={pdf.id} className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{pdf.title}</h3>
                <p className="text-sm text-gray-500">{pdf.size}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>ডাউনলোড</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveTVPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">📺 লাইভ TV</h2>
        <p className="mt-2 opacity-90">ধর্মীয় চ্যানেল ও লাইভ সম্প্রচার</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ নোট:</strong> নিচের চ্যানেলগুলো দেখতে আপনার ডিভাইসে ইন্টারনেট সংযোগ থাকতে হবে।
          সমস্যা হলে অনুগ্রহ করে পরে আবার চেষ্টা করুন।
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LIVE_TV_CHANNELS.map((channel, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <Tv className="w-16 h-16 text-gray-600" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{channel.name}</h3>
              <p className="text-sm text-gray-500 mt-1">m3u8 স্ট্রিম</p>
              <button className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
                <Play className="w-4 h-4" />
                <span>দেখুন</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">📞 যোগাযোগ</h2>
        <p className="mt-2 opacity-90">আমাদের সাথে যোগাযোগ করুন</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📍 ঠিকানা</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <p className="font-medium text-gray-800">কলম হিন্দু ধর্মসভা</p>
                <p className="text-gray-600">কলম, সিংড়া, নাটোর</p>
                <p className="text-gray-600">রাজশাহী, বাংলাদেশ</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📱 যোগাযোগের তথ্য</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-orange-500" />
              <p className="text-gray-700">০১৭১২৩৪৫৬৭৮</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-orange-500">@</span>
              <p className="text-gray-700">info@kolomhindu.org</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🌐 সোশ্যাল মিডিয়া</h3>
        <div className="flex flex-wrap gap-4">
          <a
            href={FACEBOOK_PAGES.main}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Facebook className="w-5 h-5" />
            <span>মূল ফেসবুক পেজ</span>
          </a>
          <a
            href={FACEBOOK_PAGES.durgaPuja}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Facebook className="w-5 h-5" />
            <span>দূর্গাপূজা পেজ</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
