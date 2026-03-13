import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, Image as ImageIcon, Music, FileText, Tv, Phone, LogIn, Menu, X, 
  ChevronRight, Download, Calendar, MapPin, Users, User, Lock, AlertCircle,
  Facebook, Mail, PhoneCall, ExternalLink, Send, Info, Play, Pause 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utilities & Config ---
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const GITHUB_BASE = "https://raw.githubusercontent.com/KHDS3/Society-Data/main";
const GITHUB_MEMBERS_DATA_URL = `${GITHUB_BASE}/membersData.json`;
const GITHUB_LOGIN_URL = `${GITHUB_BASE}/loginData.json`;
const GITHUB_GALLERY_URL = `${GITHUB_BASE}/galleryData.json`;
const GITHUB_LIVE_URL = `${GITHUB_BASE}/liveChannels.json`;

// --- Interfaces ---
interface Member {
  id: string; name: string; designation: string; mobile: string; 
  bloodGroup: string; photo: string; address: string;
  fatherName?: string; gotra?: string;
}
interface ContactPerson { id: string; name: string; occupation: string; mobile: string; address: string; }
interface InvitationList { id: string; area: string; personName: string; familyCount: number; }
interface LiveChannel { id: string; name: string; streamUrl: string; logo: string; }
interface AccountsPDFs { [key: string]: { title: string; years: { [year: string]: string } }; }
interface GalleryImage { id: string; url: string; title: string; category: string; }

// --- Hooks ---
function useDataLoader<T>(url: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [url]);
  return [data, loading] as const;
}

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const timer = setInterval(() => {
      const distance = new Date(targetDate).getTime() - new Date().getTime();
      if (distance < 0) clearInterval(timer);
      else setTimeLeft({
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance % 86400000) / 3600000),
        mins: Math.floor((distance % 3600000) / 60000),
        secs: Math.floor((distance % 60000) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  return timeLeft;
}

// --- Components ---
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const loc = useLocation();
  const nav = [
    { name: 'হোম', path: '/', icon: Home },
    { name: 'গ্যালারি', path: '/gallery', icon: ImageIcon },
    { name: 'লাইভ TV', path: '/live', icon: Tv },
    { name: 'যোগাযোগ', path: '/contact', icon: Phone },
    { name: 'লগইন', path: '/login', icon: LogIn },
  ];
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">ॐ</div>
          <span className="text-lg font-black gradient-text italic">কালিবাড়ী সোসাইটি</span>
        </Link>
        <nav className="hidden md:flex gap-1">
          {nav.map(i => (
            <Link key={i.path} to={i.path} className={cn("px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2", loc.pathname === i.path ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50")}>
              <i.icon size={16} /> {i.name}
            </Link>
          ))}
        </nav>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-orange-600"><Menu size={28}/></button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white p-4 border-b border-orange-100 space-y-2">
          {nav.map(i => <Link key={i.path} to={i.path} onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 rounded-xl font-bold bg-gray-50">{i.icon && <i.icon size={20}/>} {i.name}</Link>)}
        </div>
      )}
    </header>
  );
};

const HomePage = () => {
  const t = useCountdown('2026-10-20T00:00:00');
  return (
    <div className="space-y-12">
      <section className="relative h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl">
        <img src="https://images.unsplash.com/photo-1561488132-b753f53b3472" className="w-full h-full object-cover" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex flex-col justify-end p-8 text-white">
          <h1 className="text-4xl md:text-6xl font-black mb-6">শারদীয়া দুর্গাপূজা ২০২৬</h1>
          <div className="flex gap-4">
            {[{l:'দিন',v:t.days},{l:'ঘণ্টা',v:t.hours},{l:'মিনিট',v:t.mins}].map(x => (
              <div key={x.l} className="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-center min-w-[80px]">
                <div className="text-2xl font-bold">{x.v}</div>
                <div className="text-[10px] uppercase font-bold">{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { t: 'গ্যালারি', i: ImageIcon, c: 'bg-red-500', l: '/gallery' },
          { t: 'লাইভ TV', i: Tv, c: 'bg-green-600', l: '/live' },
          { t: 'যোগাযোগ', i: Phone, c: 'bg-blue-500', l: '/contact' },
          { t: 'লগইন', i: LogIn, c: 'bg-orange-500', l: '/login' },
        ].map(f => (
          <Link key={f.t} to={f.l} className="p-8 bg-white rounded-[2rem] shadow-sm border border-orange-50 hover:shadow-xl transition-all">
            <div className={cn("w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-white", f.c)}><f.i size={24}/></div>
            <h3 className="font-bold">{f.t}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

const LiveTVPage = () => {
  const [channels] = useDataLoader<LiveChannel[]>(GITHUB_LIVE_URL, []);
  const [active, setActive] = useState<LiveChannel | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { if (channels.length > 0 && !active) setActive(channels[0]); }, [channels, active]);

  useEffect(() => {
    if (!active || !videoRef.current) return;
    import('hls.js').then(Hls => {
      if (Hls.default.isSupported()) {
        const hls = new Hls.default();
        hls.loadSource(active.streamUrl);
        hls.attachMedia(videoRef.current!);
      }
    });
  }, [active]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl">
        <video ref={videoRef} className="w-full h-full" controls autoPlay />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {channels.map(c => (
          <button key={c.id} onClick={() => setActive(c)} className={cn("p-4 rounded-2xl border-2 transition-all", active?.id === c.id ? "border-orange-500 bg-orange-50" : "border-transparent bg-white")}>
            <div className="text-3xl mb-1">{c.logo}</div>
            <p className="font-bold text-sm">{c.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const [data] = useDataLoader<GalleryImage[]>(GITHUB_GALLERY_URL, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map(img => (
        <div key={img.id} className="h-64 rounded-3xl overflow-hidden shadow-sm border-4 border-white">
          <img src={img.url} className="w-full h-full object-cover" alt={img.title} />
        </div>
      ))}
    </div>
  );
};

const ContactPage = () => (
  <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] shadow-sm border border-orange-50 text-center">
    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600"><PhoneCall size={32}/></div>
    <h1 className="text-3xl font-black mb-4">যোগাযোগ</h1>
    <p className="font-bold text-gray-700">সিংড়া কালিবাড়ী মন্দির রোড, নাটোর</p>
    <p className="text-orange-600 font-black text-xl mt-4">০১৭৩৩১১৮৩১৩</p>
    <div className="flex justify-center gap-4 mt-8">
      <a href="https://facebook.com/KHDS3" className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Facebook/></a>
      <a href="mailto:khds3@gmail.com" className="p-4 bg-red-50 text-red-600 rounded-2xl"><Mail/></a>
    </div>
  </div>
);

const LoginPage = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState('members');
  const [uIn, setUIn] = useState('');
  const [pIn, setPIn] = useState('');
  const [loginData] = useDataLoader<any>(GITHUB_LOGIN_URL, null);
  const [mD, setMD] = useState<{members: Member[], contacts: ContactPerson[], invitations: InvitationList[], accounts: AccountsPDFs}>({members:[], contacts:[], invitations:[], accounts:{}});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = loginData?.normalMembers?.find((u: any) => u.mobile === uIn && u.password === pIn) || loginData?.accountsMembers?.find((u: any) => u.mobile === uIn && u.password === pIn);
    if (found) {
      setIsLogged(true); setUser(found);
      fetch(GITHUB_MEMBERS_DATA_URL).then(res => res.json()).then(setMD);
    }
  };

  if (!isLogged) return (
    <div className="max-w-md mx-auto bg-white p-10 rounded-[3rem] shadow-2xl border border-orange-50">
      <h2 className="text-3xl font-black text-center mb-8">সদস্য লগইন</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="text" placeholder="মোবাইল নম্বর" value={uIn} onChange={e => setUIn(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500" />
        <input type="password" placeholder="পাসওয়ার্ড" value={pIn} onChange={e => setPIn(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500" />
        <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold">লগইন করুন</button>
      </form>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] flex justify-between items-center shadow-sm">
        <h2 className="text-2xl font-bold italic">নমস্কার, {user?.name}</h2>
        <button onClick={() => setIsLogged(false)} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold">লগআউট</button>
      </div>
      <div className="flex gap-2">
        {['members','contacts','invitations','accounts'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-6 py-3 rounded-xl font-bold capitalize", tab === t ? "bg-orange-500 text-white" : "bg-white text-gray-500")}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tab === 'members' && mD.members.map(m => (
          <div key={m.id} className="bg-white p-6 rounded-3xl shadow-sm border border-orange-50 flex gap-4">
            <img src={m.photo} className="w-16 h-16 rounded-xl object-cover" alt="" />
            <div><p className="font-bold">{m.name}</p><p className="text-xs text-orange-600">{m.designation}</p></div>
          </div>
        ))}
        {tab === 'contacts' && mD.contacts.map(c => <div key={c.id} className="bg-white p-6 rounded-3xl shadow-sm font-bold">{c.name} - {c.mobile}</div>)}
        {tab === 'invitations' && mD.invitations.map(i => <div key={i.id} className="bg-white p-6 rounded-3xl shadow-sm font-bold">{i.personName} ({i.area})</div>)}
        {tab === 'accounts' && Object.entries(mD.accounts).map(([k, v]) => (
          <div key={k} className="bg-white p-6 rounded-3xl shadow-sm">
            <h4 className="font-bold mb-4">{v.title}</h4>
            {Object.entries(v.years).map(([y, u]) => <a key={y} href={u} className="block p-2 bg-gray-50 rounded-lg mb-2 text-sm">Download {y} Report</a>)}
          </div>
        ))}
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="mt-20 py-10 border-t border-orange-100 text-center text-gray-400 text-xs font-bold">
    <p>© ২০২৬ কালিবাড়ী ডিজিটাল সোসাইটি। Powered by KHDS3</p>
  </footer>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FFFCF7] text-gray-900 selection:bg-orange-200">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/live" element={<LiveTVPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <div className="fixed bottom-6 right-6">
          <button className="w-16 h-16 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"><Send/></button>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
