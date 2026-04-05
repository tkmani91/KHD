import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Phone, 
  FileText, 
  Tv, 
  LogIn, 
  X, 
  Clock, 
  Download, 
  Play,
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Bell,
  Send,
  Settings,
  LogOut,
  DollarSign,
  ChevronRight,
  Calendar,
  Shield
} from 'lucide-react';
import FundCollection from './FundCollection';
import MembersList from './MembersList';
import ContactsList from './ContactsList';
import InvitationListComponent from './InvitationList';
import Resolutions from './Resolutions';
import OrganizationalProfile from './OrganizationalProfile';

//==================== TYPES ====================

interface LoginUser {
  id: string;
  name: string;
  mobile: string;
  email: string;
  password: string;
  role: 'Member' | 'Admin' | 'Super Admin';
  photo?: string;
  permissions?: string[];  // 👈 নতুন লাইন যোগ করুন
}

interface SessionUser {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: 'Member' | 'Admin' | 'Super Admin';
  photo?: string;
  permissions?: string[];  // 👈 নতুন লাইন যোগ করুন
}

interface Member {
  id: string;
  name: string;
  designation: string;
  photo: string;
  bloodGroup: string;
  birthDate: string;
  address: string;
  permanentAddress: string;
  mobile: string;
  gotra: string;
  email: string;
  fatherName: string;
  motherName: string;
  occupation: string;
  pdfUrl: string;
}

interface ContactPerson {
  id: string;
  name: string;
  mobile: string;
  address: string;
  occupation: string;
  pdfUrl: string;
  photo?: string;
}

interface InvitationItem {
  id: string;
  area: string;
  personName: string;
  familyCount: number;
  pdfUrl: string;
}

interface AccountsPDFs {
  [key: string]: {
    title: string;
    years: {
      [year: string]: string;
    };
  };
}

// ==================== UTILITIES ====================

const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

// ==================== PERMISSION HELPERS ==================== 👈 এখান থেকে যোগ করুন

/**
 * Check if user has a specific permission
 * Super Admin always returns true
 */
const hasPermission = (user: SessionUser | null, permission: string): boolean => {
  if (!user) return false;
  
  // Super Admin সব permission আছে
  if (user.role === 'Super Admin') return true;
  
  // Check permission array
  return user.permissions?.includes(permission) || false;
};



/**
 * Sanitize user data for storage (remove sensitive info)
 */
const sanitizeForStorage = (user: LoginUser): SessionUser => ({
  id: user.id,
  name: user.name,
  mobile: user.mobile || '',
  email: user.email || '',
  role: user.role || 'Member',
  photo: user.photo || '',
  permissions: user.permissions || []  // 👈 নতুন
});

// Data URLs
const GITHUB_MEMBERS_DATA_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-data.json';
const GITHUB_CONTACTS_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/contacts.json';
const GITHUB_INVITATIONS_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/invitations.json';
const GITHUB_LOGIN_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-login.json';
const GITHUB_DYNAMIC_CONTENT_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/dynamicContent.json';
const GITHUB_CHATBOT_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/chatbot-data.json';

const PERMISSION_KEYS = {
  // Data Management
  EDIT_MEMBERS: 'edit_members',
  EDIT_CONTACTS: 'edit_contacts',
  EDIT_INVITATIONS: 'edit_invitations',
  EDIT_ORG_PROFILE: 'edit_org_profile',
  EDIT_RESOLUTIONS: 'edit_resolutions',
  
  // Content Management
  EDIT_NOTICES: 'edit_notices',
  EDIT_LIVE_STREAM: 'edit_live_stream',
  EDIT_CHATBOT: 'edit_chatbot',
  
  // Finance
  VIEW_ALL_FUNDS: 'view_all_funds',
  EDIT_FUNDS: 'edit_funds',
  
  // User Management (Super Admin only)
  MANAGE_USERS: 'manage_users',
} as const;

// All available permissions with details
const ALL_PERMISSIONS = {
  [PERMISSION_KEYS.EDIT_MEMBERS]: {
    id: PERMISSION_KEYS.EDIT_MEMBERS,
    label: 'সদস্য তালিকা সম্পাদনা',
    description: 'members-data.json এডিট করতে পারবে',
    category: 'data'
  },
  [PERMISSION_KEYS.EDIT_CONTACTS]: {
    id: PERMISSION_KEYS.EDIT_CONTACTS,
    label: 'জরুরী ফোন সম্পাদনা',
    description: 'contacts.json এডিট করতে পারবে',
    category: 'data'
  },
  [PERMISSION_KEYS.EDIT_INVITATIONS]: {
    id: PERMISSION_KEYS.EDIT_INVITATIONS,
    label: 'নিমন্ত্রণ তালিকা সম্পাদনা',
    description: 'invitations.json এডিট করতে পারবে',
    category: 'data'
  },
  [PERMISSION_KEYS.EDIT_ORG_PROFILE]: {
    id: PERMISSION_KEYS.EDIT_ORG_PROFILE,
    label: 'সাংগঠনিক প্রোফাইল সম্পাদনা',
    description: 'organizationalProfile.json এডিট করতে পারবে',
    category: 'data'
  },
  [PERMISSION_KEYS.EDIT_RESOLUTIONS]: {
    id: PERMISSION_KEYS.EDIT_RESOLUTIONS,
    label: 'রেজুলেশন সম্পাদনা',
    description: 'resolutions.json এডিট করতে পারবে',
    category: 'data'
  },
  [PERMISSION_KEYS.EDIT_NOTICES]: {
    id: PERMISSION_KEYS.EDIT_NOTICES,
    label: 'বিজ্ঞপ্তি সম্পাদনা',
    description: 'dynamicContent.json (notices) এডিট করতে পারবে',
    category: 'content'
  },
  [PERMISSION_KEYS.EDIT_LIVE_STREAM]: {
    id: PERMISSION_KEYS.EDIT_LIVE_STREAM,
    label: 'লাইভ সম্প্রচার সম্পাদনা',
    description: 'dynamicContent.json (liveStream) এডিট করতে পারবে',
    category: 'content'
  },
  [PERMISSION_KEYS.EDIT_CHATBOT]: {
    id: PERMISSION_KEYS.EDIT_CHATBOT,
    label: 'চ্যাটবট সম্পাদনা',
    description: 'chatbot-data.json এডিট করতে পারবে',
    category: 'content'
  },
  [PERMISSION_KEYS.VIEW_ALL_FUNDS]: {
    id: PERMISSION_KEYS.VIEW_ALL_FUNDS,
    label: 'সব চাঁদা দেখা',
    description: 'সকল সদস্যের চাঁদার তথ্য দেখতে পারবে',
    category: 'finance'
  },
  [PERMISSION_KEYS.EDIT_FUNDS]: {
    id: PERMISSION_KEYS.EDIT_FUNDS,
    label: 'চাঁদা সম্পাদনা',
    description: 'চাঁদার তথ্য এডিট করতে পারবে',
    category: 'finance'
  },
  [PERMISSION_KEYS.MANAGE_USERS]: {
    id: PERMISSION_KEYS.MANAGE_USERS,
    label: 'ইউজার ব্যবস্থাপনা',
    description: 'members-login.json এডিট করতে পারবে',
    category: 'admin'
  },
};


// ==================== CUSTOM HOOK ====================

function useDataLoader<T>(url: string, fallback: T): [T, boolean, string] {
  const [data, setData] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (!response.ok) throw new Error('Failed to load');
        const jsonData = await response.json();
        setData(jsonData);
        setError('');
      } catch {
        setError('ডেটা লোড করতে সমস্যা হয়েছে');
        setData(fallback);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return [data, isLoading, error];
}

// ==================== SUB COMPONENTS ====================

// Notice Board Component
function NoticeBoard() {
  const [dynamicContent] = useDataLoader<any>(GITHUB_DYNAMIC_CONTENT_URL, {});
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
  const noticesList = dynamicContent.notices || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <Bell className="w-7 h-7" />
          জরুরী বিজ্ঞপ্তি
        </h2>
        <span className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
          {noticesList.length}টি নোটিশ
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {noticesList.map((notice: any) => (
          <div 
            key={notice.id} 
            onClick={() => setSelectedNotice(notice)}
            className={cn(
              "bg-white rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all border-l-4",
              notice.priority === 'high' ? 'border-red-500' : 
              notice.priority === 'medium' ? 'border-yellow-500' : 'border-blue-500'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{notice.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {notice.date}
                  </span>
                  <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    {notice.category}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {noticesList.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">কোনো বিজ্ঞপ্তি নেই</p>
        </div>
      )}

      {selectedNotice && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedNotice(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className={cn(
              "p-6 rounded-t-2xl text-white",
              selectedNotice.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
              selectedNotice.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
              'bg-gradient-to-r from-blue-500 to-blue-600'
            )}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedNotice.title}</h2>
                  <p className="text-sm opacity-90">{selectedNotice.date}</p>
                </div>
                <button onClick={() => setSelectedNotice(null)} className="text-white hover:bg-white/20 p-2 rounded-full transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {selectedNotice.details}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Live Broadcasting Component
function LiveBroadcasting() {
  const [dynamicContent] = useDataLoader<any>(GITHUB_DYNAMIC_CONTENT_URL, {});
  const stream = dynamicContent.liveStream || {};

  const getBengaliMonth = (monthIndex: number) => {
    const months = ['জানু', 'ফেব', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগ', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'];
    return months[monthIndex] || '';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
        <Tv className="w-7 h-7" />
        সরাসরি সম্প্রচার
      </h2>

      {stream.isLive ? (
        <div className="space-y-4">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-fit animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" />
            <span className="font-bold">🔴 LIVE</span>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe 
              src={stream.streamUrl} 
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 text-center text-white">
          <Tv className="w-24 h-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-2xl font-bold mb-3">সম্প্রচার বন্ধ আছে</h3>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">{stream.offlineMessage}</p>
        </div>
      )}

      {stream.upcomingEvents && stream.upcomingEvents.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-orange-500" />
            আসন্ন লাইভ ইভেন্ট
          </h3>
          <div className="space-y-3">
            {stream.upcomingEvents.map((event: any) => {
              const dateParts = event.dateEn?.split('-') || [];
              const day = dateParts[2] || '00';
              const monthIndex = parseInt(dateParts[1]) - 1;
              
              return (
                <div key={event.id} className="flex items-start gap-4 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition">
                  <div className="w-16 h-16 bg-orange-500 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                    <div className="text-2xl font-bold">{day}</div>
                    <div className="text-xs">{getBengaliMonth(monthIndex)}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{event.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <p className="text-sm text-orange-600 font-medium mt-2">⏰ {event.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stream.recentRecordings && stream.recentRecordings.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">📹 সাম্প্রতিক রেকর্ডিং</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stream.recentRecordings.map((video: any) => (
              <a 
                key={video.id} 
                href={video.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="aspect-video bg-gray-200 relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Video';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 group-hover:text-orange-600 transition">{video.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{video.views} views • {video.date}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// AI Chatbox Component (Export করা হচ্ছে ContactPage এর জন্য)
export function AIChatbox() {
  const [chatbotData] = useDataLoader<any>(GITHUB_CHATBOT_URL, {});
  const chatbot = chatbotData || {};
  
  const [messages, setMessages] = useState<{role: string; text: string}[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatbot.welcomeMessage && messages.length === 0) {
      setMessages([{ role: 'bot', text: chatbot.welcomeMessage }]);
    }
  }, [chatbot.welcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const findAnswer = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    const faq = chatbot.faq || [];
    
    for (const item of faq) {
      const keywords = item.keywords || [];
      if (keywords.some((keyword: string) => lowerQuestion.includes(keyword.toLowerCase()))) {
        return item.answer;
      }
    }
    
    const fallbacks = chatbot.fallbackMessages || ['দুঃখিত, আমি বুঝতে পারিনি।'];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    
    setTimeout(() => {
      const answer = findAnswer(input);
      setMessages(prev => [...prev, { role: 'bot', text: answer }]);
    }, 500);
    
    setInput('');
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl flex flex-col" style={{ height: '600px' }}>
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 rounded-t-2xl text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-lg">আমাকে জানুন</h3>
            <p className="text-xs text-orange-100">ভার্চুয়াল সহায়ক</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              "max-w-[75%] p-4 rounded-2xl shadow-md",
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none'
            )}>
              <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {chatbot.quickReplies && messages.length <= 1 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <p className="text-xs text-gray-500 mb-2">দ্রুত প্রশ্ন:</p>
          <div className="flex flex-wrap gap-2">
            {chatbot.quickReplies.map((reply: string, i: number) => (
              <button 
                key={i}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-1.5 bg-white border border-orange-200 text-orange-600 rounded-full text-xs hover:bg-orange-50 transition"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="প্রশ্ন করুন..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 transition"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN LOGIN PAGE COMPONENT ====================

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<SessionUser | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('members');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [dataSource, setDataSource] = useState<'local' | 'github'>('local');
  const [membersData, setMembersData] = useState<Member[]>([]);
  const [contactsData, setContactsData] = useState<ContactPerson[]>([]);
  const [invitationData, setInvitationData] = useState<InvitationItem[]>([]);
  const [accountsPDFs, setAccountsPDFs] = useState<AccountsPDFs>({});
  const [pdfLinks, setPdfLinks] = useState({ membersList: '', contactsList: '', invitationList: '' });
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [loginData, setLoginData] = useState<{ accountsMembers: LoginUser[]; normalMembers: LoginUser[] } | null>(null);

  // ===== SESSION PERSISTENCE - Check saved login =====
  useEffect(() => {
    const checkSavedSession = async () => {
      try {
        const savedUser = localStorage.getItem('khd_logged_in_user');
        const savedPhoto = localStorage.getItem('khd_user_photo');
        
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setLoggedInUser(user);
          setUserPhoto(user.photo || savedPhoto || '');
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log('Session check failed:', error);
        localStorage.removeItem('khd_logged_in_user');
        localStorage.removeItem('khd_user_photo');
      }
      setIsCheckingSession(false);
    };

    checkSavedSession();
  }, []);

  // Load login data
  useEffect(() => {
    const fetchLoginData = async () => {
      try {
        const response = await fetch(GITHUB_LOGIN_URL, { cache: 'no-cache' });
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        if (data.accountsMembers && data.normalMembers) { 
          setLoginData(data); 
          setDataSource('github'); 
        }
      } catch { 
        setDataSource('local');
      }
    };
    fetchLoginData();
  }, []);

  // Load all data after login
  useEffect(() => {
    if (!isLoggedIn || !loggedInUser) return;
    
    const fetchAllData = async () => {
      setIsDataLoading(true);
      try {
        // Fetch Members
        const membersRes = await fetch(GITHUB_MEMBERS_DATA_URL, { cache: 'no-cache' });
        if (membersRes.ok) {
          const membersJson = await membersRes.json();
          if (membersJson.members) {
            setMembersData(membersJson.members);
            setPdfLinks(prev => ({ ...prev, membersList: membersJson.pdfLink || '' }));
          }
          
          // Photo logic (only if login data has no photo)
          if (!loggedInUser.photo || loggedInUser.photo === '') {
            const currentUserMember = membersJson.members.find((m: Member) => {
              return String(m.id).trim() === String(loggedInUser.id).trim();
            });
            if (currentUserMember?.photo) {
              setUserPhoto(currentUserMember.photo);
              localStorage.setItem('khd_user_photo', currentUserMember.photo);
            }
          } else {
            setUserPhoto(loggedInUser.photo);
          }
        }

        // Fetch Contacts
        const contactsRes = await fetch(GITHUB_CONTACTS_URL, { cache: 'no-cache' });
        if (contactsRes.ok) {
          const contactsJson = await contactsRes.json();
          if (contactsJson.contacts) {
            setContactsData(contactsJson.contacts);
            setPdfLinks(prev => ({ ...prev, contactsList: contactsJson.pdfLink || '' }));
          }
        }

        // Fetch Invitations
        const invitationsRes = await fetch(GITHUB_INVITATIONS_URL, { cache: 'no-cache' });
        if (invitationsRes.ok) {
          const invitationsJson = await invitationsRes.json();
          if (invitationsJson.invitations) {
            setInvitationData(invitationsJson.invitations);
            setPdfLinks(prev => ({ ...prev, invitationList: invitationsJson.pdfLink || '' }));
          }
        }

      } catch (error) { 
        console.error('❌ Data fetch error:', error); 
      } finally { 
        setIsDataLoading(false); 
      }
    };
    
    fetchAllData();

    // Load accounts PDFs
    const loadAccountsPDFs = async () => {
      try {
        const response = await fetch('/data/accountsPDFs.json');
        if (response.ok) {
          const data = await response.json();
          setAccountsPDFs(data);
        }
      } catch (error) {
        console.log('Failed to load accounts PDFs:', error);
      }
    };
    
    loadAccountsPDFs();
  }, [isLoggedIn, loggedInUser]);
  
 // ===== LOGIN HANDLER =====
const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  setLoginError('');
  
  if (!usernameInput.trim()) { 
    setLoginError('মোবাইল/ইমেইল দিন'); 
    return; 
  }
  if (!passwordInput.trim()) { 
    setLoginError('পাসওয়ার্ড দিন'); 
    return; 
  }
  
  if (!loginData) {
    setLoginError('লগইন ডেটা লোড হয়নি');
    return;
  }

  setIsLoading(true);
  
  setTimeout(() => {
    const trimmedUsername = usernameInput.trim().toLowerCase();
    const trimmedPassword = passwordInput.trim();
    
    const allUsers = [...loginData.accountsMembers, ...loginData.normalMembers];
    
    const foundUser = allUsers.find((u: LoginUser) => 
      (u.mobile === trimmedUsername || u.email?.toLowerCase() === trimmedUsername) && 
      u.password === trimmedPassword
    );

    if (foundUser) { 
      // ✅ sanitizeForStorage() ব্যবহার করে password বাদ দিয়ে সংরক্ষণ
      const sessionUser = sanitizeForStorage(foundUser);

      // localStorage-এ সংরক্ষণ (password ছাড়া, permissions সহ)
      localStorage.setItem('khd_logged_in_user', JSON.stringify(sessionUser));

      // Photo সংরক্ষণ
      if (foundUser.photo) {
        setUserPhoto(foundUser.photo);
        localStorage.setItem('khd_user_photo', foundUser.photo);
      }

      // State আপডেট
      setIsLoggedIn(true); 
      setLoggedInUser(sessionUser);
      setUsernameInput(''); 
      setPasswordInput(''); 
    }
    else { 
      setLoginError('ভুল তথ্য দিয়েছেন'); 
    }
    
    setIsLoading(false);
  }, 800);
};
  
  // ===== LOGOUT HANDLER =====
const handleLogout = () => {
  localStorage.removeItem('khd_logged_in_user');
  localStorage.removeItem('khd_user_photo');
  
  setIsLoggedIn(false);
  setLoggedInUser(null);
  setUserPhoto('');
  setActiveTab('members');
};

// ===== AVAILABLE TABS =====
const getAvailableTabs = () => {
  // ===== সবাই দেখবে (Member, Admin, Super Admin) =====
  const baseTabs = [
    { id: 'members', label: 'সদস্য তালিকা', icon: Users },
    { id: 'org-profile', label: 'সাংগঠনিক প্রোফাইল', icon: Users },
    { id: 'fund', label: 'চাঁদা হিসাব', icon: DollarSign },
    { id: 'contacts', label: 'জরুরী ফোন', icon: Phone },
    { id: 'invitation', label: 'নিমন্ত্রণ তালিকা', icon: FileText },
    { id: 'notice', label: 'বিজ্ঞপ্তি', icon: Bell },
    { id: 'live', label: 'লাইভ সম্প্রচার', icon: Tv },
  ];

  // ===== রেজুলেশন - শুধু Admin ও Super Admin দেখবে =====
  if (loggedInUser?.role === 'Admin' || loggedInUser?.role === 'Super Admin') {
    baseTabs.push({ id: 'resolutions', label: 'রেজুলেশন সমূহ', icon: FileText });
  }

  // ===== বাৎসরিক হিসাব - শুধু Admin ও Super Admin দেখবে =====
  if (loggedInUser?.role === 'Admin' || loggedInUser?.role === 'Super Admin') {
    baseTabs.push({ id: 'accounts', label: 'বাৎসরিক হিসাব', icon: FileText });
  }

  // ===== কন্ট্রোল প্যানেল - Admin ও Super Admin দেখবে =====
  if (loggedInUser?.role === 'Admin' || loggedInUser?.role === 'Super Admin') {
    baseTabs.push({ id: 'json-editor', label: 'কন্ট্রোল প্যানেল', icon: Settings });
  }

  // ===== পারমিশন ব্যবস্থাপনা - শুধু Super Admin দেখবে =====
  if (loggedInUser?.role === 'Super Admin') {
    baseTabs.push({ id: 'permissions', label: 'পারমিশন ব্যবস্থাপনা', icon: Shield });
  }

  return baseTabs;
};
  
  // ===== SESSION CHECKING LOADING =====
  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">সেশন যাচাই করা হচ্ছে...</p>
          <p className="text-gray-400 text-sm mt-2">অনুগ্রহ করে অপেক্ষা করুন</p>
        </div>
      </div>
    );
  }

  // ===== LOGIN FORM =====
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">মেম্বার লগইন</h1>
          <p className="text-gray-600 text-sm">একটি অ্যাকাউন্ট দিয়ে সব সুবিধা</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {dataSource === 'github' && (
            <div className="mb-4 px-3 py-2 rounded-lg text-xs flex items-center gap-2 bg-green-50 text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              ✓ সার্ভার থেকে ডেটা লোড হয়েছে
            </div>
          )}

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল / ইমেইল</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={usernameInput} 
                  onChange={(e) => { setUsernameInput(e.target.value); setLoginError(''); }} 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none" 
                  placeholder="মোবাইল বা ইমেইল" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={passwordInput} 
                  onChange={(e) => { setPasswordInput(e.target.value); setLoginError(''); }} 
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none" 
                  placeholder="পাসওয়ার্ড" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className={cn(
                "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition", 
                isLoading ? "bg-gray-400 text-white" : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg"
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  যাচাই করা হচ্ছে...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  লগইন
                </>
              )}
            </button>
          </form>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700">
              🔑 নিবন্ধনের জন্য যোগাযোগ করুণ: 📞+88 01733118313 । 📞+88 01612118313
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD =====
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-200 shadow-lg flex-shrink-0 bg-gradient-to-br from-orange-100 to-red-100">
              <img 
                src={userPhoto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                alt={loggedInUser?.name} 
                className="w-full h-full object-cover"
                onError={(e) => { 
                  (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; 
                }}
              />
            </div>
            
            <div>
              <h1 className="text-xl md:text-2xl font-bold gradient-text">ড্যাশবোর্ড</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-sm text-gray-500">
                  স্বাগতম, <span className="font-bold text-orange-600">{loggedInUser?.name}</span>
                </p>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  loggedInUser?.role === 'Super Admin' ? 'bg-purple-100 text-purple-600' :
                  loggedInUser?.role === 'Admin' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                )}>
                  {loggedInUser?.role}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {loggedInUser?.mobile}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> লগআউট
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {getAvailableTabs().map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition", 
              activeTab === tab.id 
                ? "bg-orange-500 text-white shadow-lg" 
                : "bg-white text-gray-700 hover:bg-orange-50"
            )}
          >
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isDataLoading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">ডেটা লোড হচ্ছে...</p>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && !isDataLoading && (
        <MembersList 
          membersData={membersData} 
          pdfLink={pdfLinks.membersList} 
        />
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && !isDataLoading && (
        <ContactsList 
          contactsData={contactsData} 
          pdfLink={pdfLinks.contactsList} 
        />
      )}

      {/* Invitation Tab */}
      {activeTab === 'invitation' && !isDataLoading && (
        <InvitationListComponent 
          invitationData={invitationData} 
          pdfLink={pdfLinks.invitationList} 
        />
      )}

      {/* Resolutions Tab - নতুন */}
      {activeTab === 'resolutions' && !isDataLoading && <Resolutions />}

      {/* Organizational Profile Tab - নতুন */}
      {activeTab === 'org-profile' && !isDataLoading && <OrganizationalProfile />}
      
      {/* Notice Tab */}
      {activeTab === 'notice' && !isDataLoading && <NoticeBoard />}

      {/* Live Broadcasting Tab */}
      {activeTab === 'live' && !isDataLoading && <LiveBroadcasting />}

      {/* Fund Collection Tab */}
      {activeTab === 'fund' && !isDataLoading && (
        <FundCollection 
          userRole={loggedInUser?.role || 'Member'} 
          loggedInUserId={loggedInUser?.id || ''} 
        />
      )}

      {/* Accounts Tab (Admin/Super Admin only) */}
      {activeTab === 'accounts' && (loggedInUser?.role === 'Admin' || loggedInUser?.role === 'Super Admin') && !isDataLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(accountsPDFs).map(([key, data]) => (
            <div key={key} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg">{data.title}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(data.years).map(([year, url]) => (
                  <a key={year} href={url as string} download className="flex items-center justify-center gap-2 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition">
                    <Download className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">{year}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

            {/* JSON Editor Tab - Permission Based (Admin & Super Admin) */}
      {activeTab === 'json-editor' && 
        (loggedInUser?.role === 'Admin' || loggedInUser?.role === 'Super Admin') && 
        !isDataLoading && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Settings className="w-8 h-8" />
                  কন্ট্রোল প্যানেল
                </h2>
                <p className="text-orange-100 text-sm mt-1">
                  {loggedInUser?.role === 'Super Admin' 
                    ? '✨ সম্পূর্ণ নিয়ন্ত্রণ (Super Admin)'
                    : `🔒 সীমিত সম্পাদনা (Admin)`
                  }
                </p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <p className="text-xs text-orange-100">আপনার Role</p>
                <p className="font-bold">{loggedInUser?.role}</p>
              </div>
            </div>
          </div>

          {/* Admin-এর জন্য Permission Badge */}
          {loggedInUser?.role === 'Admin' && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-800 mb-2">আপনার সম্পাদনা অনুমতি:</h4>
                  {loggedInUser.permissions && loggedInUser.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {loggedInUser.permissions.map((perm) => (
                        <span 
                          key={perm}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {ALL_PERMISSIONS[perm as keyof typeof ALL_PERMISSIONS]?.label || perm}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-blue-600">
                      ⚠️ আপনার কোনো সম্পাদনা অনুমতি নেই। Super Admin-এর সাথে যোগাযোগ করুন।
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* JSON Editor Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* সদস্য তালিকা */}
            {hasPermission(loggedInUser, PERMISSION_KEYS.EDIT_MEMBERS) && (
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">সদস্য তালিকা</h3>
                    <p className="text-xs text-gray-500">members-data.json</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">সদস্যদের তথ্য সম্পাদনা করুন</p>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  সম্পাদনা করুন
                </button>
              </div>
            )}

            {/* জরুরী ফোন */}
            {hasPermission(loggedInUser, PERMISSION_KEYS.EDIT_CONTACTS) && (
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">জরুরী ফোন</h3>
                    <p className="text-xs text-gray-500">contacts.json</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">যোগাযোগের তথ্য সম্পাদনা করুন</p>
                <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  সম্পাদনা করুন
                </button>
              </div>
            )}

            {/* নিমন্ত্রণ তালিকা */}
            {hasPermission(loggedInUser, PERMISSION_KEYS.EDIT_INVITATIONS) && (
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition border-l-4 border-purple-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">নিমন্ত্রণ তালিকা</h3>
                    <p className="text-xs text-gray-500">invitations.json</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">নিমন্ত্রণ তালিকা সম্পাদনা করুন</p>
                <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  সম্পাদনা করুন
                </button>
              </div>
            )}

            {/* সাংগঠনিক প্রোফাইল */}
            {hasPermission(loggedInUser, PERMISSION_KEYS.EDIT_ORG_PROFILE) && (
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition border-l-4 border-orange-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">সাংগঠনিক প্রোফাইল</h3>
                    <p className="text-xs text-gray-500">organizationalProfile.json</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">সংগঠনের তথ্য সম্পাদনা করুন</p>
                <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  সম্পাদনা করুন
                </button>
              </div>
            )}

            {/* রেজুলেশন */}
            {hasPermission(loggedInUser, PERMISSION_KEYS.EDIT_RESOLUTIONS) && (
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">রেজুলেশন সমূহ</h3>
                    <p className="text-xs text-gray-500">resolutions.json</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">রেজুলেশন সম্পাদনা করুন</p>
                <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  সম্পাদনা করুন
                </button>
              </div>
            )}

            {/* বিজ্ঞপ্তি */}
            {hasPermission(loggedInUser, PERMISSION_KEYS.EDIT_NOTICES) && (
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition border-l-4 border-yellow-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">বিজ্ঞপ্তি</h3>
                    <p className="text-xs text-gray-500">dynamicContent.json</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">বিজ্ঞপ্তি সম্পাদনা করুন</p>
                <button className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  সম্পাদনা করুন
                </button>
              </div>
            )}

            {/* লাইভ সম্প্রচার */}
            {hasPermission(loggedInUser, PERMISSION_KEYS.EDIT_LIVE_STREAM) && (
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition border-l-4 border-pink-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Tv className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">লাইভ সম্প্রচার</h3>
                    <p className="text-xs text-gray-500">dynamicContent.json</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">লাইভ সম্প্রচার সেটিংস</p>
                <button className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  সম্পাদনা করুন
                </button>
              </div>
            )}

            {/* চ্যাটবট */}
            {hasPermission(loggedInUser, PERMISSION_KEYS.EDIT_CHATBOT) && (
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition border-l-4 border-indigo-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">চ্যাটবট</h3>
                    <p className="text-xs text-gray-500">chatbot-data.json</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">চ্যাটবট সম্পাদনা করুন</p>
                <button className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  সম্পাদনা করুন
                </button>
              </div>
            )}

            {/* লগইন ডেটা - শুধু Super Admin */}
            {hasPermission(loggedInUser, PERMISSION_KEYS.MANAGE_USERS) && (
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition border-l-4 border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">লগইন ডেটা</h3>
                    <p className="text-xs text-gray-500">members-login.json</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">ইউজার ও পাসওয়ার্ড</p>
                <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  সম্পাদনা করুন
                </button>
              </div>
            )}
          </div>

          {/* No Permission Message for Admin */}
          {loggedInUser?.role === 'Admin' && 
            (!loggedInUser.permissions || loggedInUser.permissions.length === 0) && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-orange-300" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">কোনো সম্পাদনা অনুমতি নেই</h3>
              <p className="text-gray-500">Super Admin-এর সাথে যোগাযোগ করুন।</p>
            </div>
          )}
        </div>
      )}

      {/* Permission Management Tab - Super Admin Only */}
{activeTab === 'permissions' && loggedInUser?.role === 'Super Admin' && !isDataLoading && (
  <div className="space-y-6">
    {/* Header */}
    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Shield className="w-8 h-8" />
        পারমিশন ব্যবস্থাপনা
      </h2>
      <p className="text-purple-100 text-sm mt-1">
        Admin-দের জন্য সম্পাদনা অনুমতি নির্ধারণ করুন
      </p>
    </div>

    {/* Info Card */}
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-yellow-800 mb-1">গুরুত্বপূর্ণ তথ্য</h4>
          <p className="text-sm text-yellow-700">
            Permission পরিবর্তন করতে হলে <strong>members-login.json</strong> ফাইলে 
            সরাসরি <strong>permissions</strong> array আপডেট করতে হবে।
          </p>
        </div>
      </div>
    </div>

    {/* Available Permissions */}
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-purple-500" />
        সকল Permission Keys
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Admin-কে যে permission দিতে চান, সেই key টি <code className="bg-gray-100 px-2 py-1 rounded">permissions</code> array-তে যোগ করুন:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(ALL_PERMISSIONS).map(([key, perm]) => (
          <div 
            key={key}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
              perm.category === 'data' ? 'bg-blue-100' :
              perm.category === 'content' ? 'bg-green-100' :
              perm.category === 'finance' ? 'bg-orange-100' : 'bg-purple-100'
            )}>
              <FileText className={cn(
                "w-5 h-5",
                perm.category === 'data' ? 'text-blue-600' :
                perm.category === 'content' ? 'text-green-600' :
                perm.category === 'finance' ? 'text-orange-600' : 'text-purple-600'
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm">{perm.label}</p>
              <code className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700 block mt-1 break-all">
                "{key}"
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Current Users from members-login.json */}
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-500" />
        বর্তমান ইউজার তালিকা
        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full ml-2">
          members-login.json থেকে লোড
        </span>
      </h3>
      
      {loginData ? (
        <div className="space-y-6">
          {/* Super Admins */}
          <div>
            <h4 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
              <span className="text-lg">👑</span> Super Admin
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...loginData.accountsMembers, ...loginData.normalMembers]
                .filter(u => u.role === 'Super Admin')
                .map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.mobile}</p>
                    </div>
                    <span className="ml-auto text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full">
                      সব অনুমতি ✓
                    </span>
                  </div>
                ))
              }
              {[...loginData.accountsMembers, ...loginData.normalMembers]
                .filter(u => u.role === 'Super Admin').length === 0 && (
                <p className="text-sm text-gray-500 italic">কোনো Super Admin নেই</p>
              )}
            </div>
          </div>

          {/* Admins */}
          <div>
            <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="text-lg">🔧</span> Admin
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {[...loginData.accountsMembers, ...loginData.normalMembers]
                .filter(u => u.role === 'Admin')
                .map(user => (
                  <div key={user.id} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.mobile} • {user.email}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-2 font-medium">📋 Permissions:</p>
                      {user.permissions && user.permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.permissions.map((p: string) => (
                            <span 
                              key={p} 
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {ALL_PERMISSIONS[p as keyof typeof ALL_PERMISSIONS]?.label || p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          কোনো permission নেই - JSON ফাইলে যোগ করুন
                        </span>
                      )}
                    </div>
                  </div>
                ))
              }
              {[...loginData.accountsMembers, ...loginData.normalMembers]
                .filter(u => u.role === 'Admin').length === 0 && (
                <p className="text-sm text-gray-500 italic">কোনো Admin নেই</p>
              )}
            </div>
          </div>

          {/* Members Count */}
          <div>
            <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
              <span className="text-lg">👤</span> Member
            </h4>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-gray-700">
                মোট <span className="font-bold text-green-600">
                  {[...loginData.accountsMembers, ...loginData.normalMembers]
                    .filter(u => u.role === 'Member').length}
                </span> জন সাধারণ সদস্য
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (Member-দের কোনো edit permission থাকে না)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">লগইন ডেটা লোড হচ্ছে...</p>
        </div>
      )}
    </div>

      {/* Quick Guide */}
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
      <h3 className="text-lg font-bold text-purple-800 mb-3">📌 Permission যোগ করার নিয়ম</h3>
      <ol className="list-decimal list-inside space-y-2 text-sm text-purple-700">
        <li>GitHub-এ <code className="bg-white px-2 py-0.5 rounded">members-login.json</code> ফাইলটি Edit করুন</li>
        <li>যে Admin-কে permission দিতে চান তাকে খুঁজুন</li>
        <li><code className="bg-white px-2 py-0.5 rounded">"permissions": []</code> array-তে উপরের key গুলো যোগ করুন</li>
        <li>ফাইল save/commit করুন</li>
        <li>Admin যখন login করবে, তার permission অনুযায়ী section দেখবে</li>
      </ol>
    </div>
  </div>
)}
    </div>
  );
}

export default LoginPage;
