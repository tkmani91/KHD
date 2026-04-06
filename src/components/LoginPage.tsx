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
  Calendar
} from 'lucide-react';
import JSONEditor from './JSONEditor';
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
  editorPermissions?: Record<string, boolean>; // ✅ NEW
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

// Data URLs
const GITHUB_MEMBERS_DATA_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-data.json';
const GITHUB_CONTACTS_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/contacts.json';
const GITHUB_INVITATIONS_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/invitations.json';
const GITHUB_LOGIN_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-login.json';
const GITHUB_DYNAMIC_CONTENT_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/dynamicContent.json';
const GITHUB_CHATBOT_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/chatbot-data.json';

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
  const [loggedInUser, setLoggedInUser] = useState<LoginUser | null>(null);
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
    if (!usernameInput.trim()) { setLoginError('মোবাইল/ইমেইল দিন'); return; }
    if (!passwordInput.trim()) { setLoginError('পাসওয়ার্ড দিন'); return; }
    
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
        const userRole: 'Member' | 'Admin' | 'Super Admin' = foundUser.role || 'Member';

        const userWithRole: LoginUser = {
          id: foundUser.id,
          name: foundUser.name,
          mobile: foundUser.mobile || '',
          email: foundUser.email || '',
          password: '',
          role: userRole,
          photo: foundUser.photo || ''
        };

        localStorage.setItem('khd_logged_in_user', JSON.stringify(userWithRole));

        if (foundUser.photo) {
          setUserPhoto(foundUser.photo);
          localStorage.setItem('khd_user_photo', foundUser.photo);
        }

        setIsLoggedIn(true); 
        setLoggedInUser(userWithRole);
        setUsernameInput(''); 
        setPasswordInput(''); 
      }
      else { setLoginError('ভুল তথ্য দিয়েছেন'); }
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

 // ========== getAvailableTabs FUNCTION UPDATE ==========
const getAvailableTabs = () => {
  const baseTabs = [
    { id: 'members', label: 'সদস্য তালিকা', icon: Users },
    { id: 'org-profile', label: 'সাংগঠনিক প্রোফাইল', icon: Users },
    { id: 'fund', label: 'চাঁদা হিসাব', icon: DollarSign },
    { id: 'contacts', label: 'জরুরী ফোন', icon: Phone },
    { id: 'invitation', label: 'নিমন্ত্রণ তালিকা', icon: FileText },
    { id: 'resolutions', label: 'রেজুলেশন সমূহ', icon: FileText },
    { id: 'notice', label: 'বিজ্ঞপ্তি', icon: Bell },
    { id: 'live', label: 'লাইভ সম্প্রচার', icon: Tv },
  ];

  if (loggedInUser?.role === 'Admin' || loggedInUser?.role === 'Super Admin') {
    baseTabs.push({ id: 'accounts', label: 'বাৎসরিক হিসাব', icon: FileText });
  }

  // ✅ CHANGED: Admin এখন Control Panel দেখতে পারবে
  if (loggedInUser?.role === 'Admin' || loggedInUser?.role === 'Super Admin') {
    baseTabs.push({ id: 'json-editor', label: 'কন্ট্রোল প্যানেল', icon: Settings });
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

      {/* JSON Editor Tab (Admin ও Super Admin) */}
{activeTab === 'json-editor' && (loggedInUser?.role === 'Admin' || loggedInUser?.role === 'Super Admin') && !isDataLoading && (
  <JSONEditor 
    userRole={loggedInUser?.role || 'Member'} 
    editorPermissions={loggedInUser?.editorPermissions || {}} 
  />
)}
    </div>
  );
}

export default LoginPage;
