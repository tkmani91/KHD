import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate 
} from 'react-router-dom';
import { 
  Home, Image as ImageIcon, Music, FileText, Tv, Phone, LogIn, 
  Menu, X, ChevronRight, ChevronDown, Download, Eye, EyeOff, 
  Search, Calendar, MapPin, Clock, Users, User, Lock, AlertCircle,
  Facebook, Mail, PhoneCall, ExternalLink, Send, Info, Heart, Play, Pause, SkipBack, SkipForward, Volume2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility for Tailwind classes ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- GitHub Configuration ---
// এখানে আপনার গিটহাব ইউজারনেম এবং রিপোজিটরি নাম দিন
const GITHUB_BASE = "https://raw.githubusercontent.com/KHDS3/Society-Data/main";
const GITHUB_MEMBERS_DATA_URL = `${GITHUB_BASE}/membersData.json`;
const GITHUB_LOGIN_URL = `${GITHUB_BASE}/loginData.json`;
const GITHUB_GALLERY_URL = `${GITHUB_BASE}/galleryData.json`;
const GITHUB_LIVE_URL = `${GITHUB_BASE}/liveChannels.json`;

// --- Interfaces (Data Structures) ---
interface Member {
  id: string; name: string; designation: string; mobile: string; 
  bloodGroup: string; photo: string; email?: string; address: string;
  fatherName?: string; motherName?: string; gotra?: string; 
  occupation?: string; permanentAddress?: string;
}

interface ContactPerson {
  id: string; name: string; occupation: string; mobile: string; 
  address: string; photo?: string;
}

interface InvitationList {
  id: string; area: string; personName: string; familyCount: number;
}

interface LiveChannel {
  id: string; name: string; streamUrl: string; logo: string;
}

interface AccountsPDFs {
  [key: string]: { title: string; years: { [year: string]: string } };
}

interface GalleryImage {
  id: string; url: string; title: string; category: string;
}

interface Song {
  id: string; title: string; artist: string; url: string; cover: string;
}
// --- Custom Hooks ---

// গিটহাব বা যেকোনো API থেকে ডেটা লোড করার জন্য ইউনিভার্সাল হুক
function useDataLoader<T>(url: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [url]);

  return [data, loading, error] as const;
}

// ইভেন্ট কাউন্টডাউন টাইমার হুক
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

// --- Layout Components: Header ---

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // নেভিগেশন আইটেমসমূহ
  const navItems = [
    { name: 'হোম', path: '/', icon: Home },
    { name: 'গ্যালারি', path: '/gallery', icon: ImageIcon },
    { name: 'মিউজিক', path: '/music', icon: Music },
    { name: 'লাইভ TV', path: '/live', icon: Tv },
    { name: 'যোগাযোগ', path: '/contact', icon: Phone },
    { name: 'লগইন', path: '/login', icon: LogIn },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform">
            ॐ
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent italic leading-tight">
              কালিবাড়ী ডিজিটাল সোসাইটি
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase hidden sm:block">
              Tradition Meets Technology
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                location.pathname === item.path 
                  ? "bg-orange-500 text-white shadow-md scale-105" 
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              )}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-orange-600 focus:outline-none hover:bg-orange-50 rounded-lg transition-colors"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-orange-100 p-4 space-y-2 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={() => setIsOpen(false)} 
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl font-bold transition-colors",
                location.pathname === item.path 
                  ? "bg-orange-500 text-white" 
                  : "bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
// --- Home Page Component ---

const HomePage = () => {
  // ২০২৬ সালের দুর্গা পূজার একটি আনুমানিক তারিখ সেট করা হয়েছে
  const timeLeft = useCountdown('2026-10-20T00:00:00');

  const quickLinks = [
    { title: 'পূজা ক্যালেন্ডার', icon: Calendar, color: 'bg-orange-500', link: '/calendar', desc: 'তিথি ও সময়সূচী' },
    { title: 'ফটো গ্যালারি', icon: ImageIcon, color: 'bg-red-500', link: '/gallery', desc: 'উৎসবের মুহূর্ত' },
    { title: 'ভক্তিগীতি', icon: Music, color: 'bg-blue-500', link: '/music', desc: 'অডিও ও আরতি' },
    { title: 'লাইভ TV', icon: Tv, color: 'bg-emerald-600', link: '/live', desc: 'সরাসরি সম্প্রচার' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="relative h-[450px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1561488132-b753f53b3472?auto=format&fit=crop&q=80&w=2070" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt="Durga Puja Banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-16 text-white">
          <div className="inline-block px-4 py-1.5 bg-orange-500/20 backdrop-blur-md border border-orange-500/30 rounded-full text-orange-400 text-xs font-bold tracking-widest uppercase mb-4 w-fit">
            Upcoming Festival
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight">
            শারদীয়া দুর্গাপূজা <br />
            <span className="text-orange-500">২০২৬</span>
          </h1>
          
          {/* Countdown Timer Grid */}
          <div className="flex gap-3 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { label: 'দিন', value: timeLeft.days },
              { label: 'ঘণ্টা', value: timeLeft.hours },
              { label: 'মিনিট', value: timeLeft.mins },
              { label: 'সেকেন্ড', value: timeLeft.secs },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] text-center min-w-[85px] md:min-w-[110px] border border-white/20 shadow-xl">
                <div className="text-3xl md:text-5xl font-black tabular-nums">{item.value}</div>
                <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold mt-1 text-orange-200">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
            এক নজরে সব সেবা
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {quickLinks.map((item) => (
            <Link 
              key={item.title} 
              to={item.link} 
              className="group bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-orange-50 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12",
                item.color
              )}>
                <item.icon size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="text-orange-500" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section Snippet */}
      <section className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 italic">ঐতিহ্য ও আধ্যাত্মিকতার মিলনস্থল</h2>
          <p className="text-lg text-orange-50 leading-relaxed mb-8">
            কালিবাড়ী ডিজিটাল সোসাইটি সিংড়া উপজেলার একটি অন্যতম ধর্মীয় প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য হলো সনাতন ধর্মাবলম্বীদের ধর্মীয় উৎসব ও তথ্যাদি আধুনিক প্রযুক্তির মাধ্যমে সবার কাছে পৌঁছে দেওয়া।
          </p>
          <Link to="/contact" className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold shadow-xl hover:bg-orange-50 transition-colors inline-flex items-center gap-2">
            আমাদের সম্পর্কে জানুন <Info size={20}/>
          </Link>
        </div>
        <div className="absolute top-0 right-0 text-[20rem] font-black text-white/5 -mr-20 -mt-20 select-none">ॐ</div>
      </section>

    </div>
  );
};
// --- Live TV Page Component ---

const LiveTVPage = () => {
  // গিটহাব থেকে চ্যানেল লিস্ট লোড করা হচ্ছে
  const [liveChannels, loading, error] = useDataLoader<LiveChannel[]>(GITHUB_LIVE_URL, []);
  const [activeChannel, setActiveChannel] = useState<LiveChannel | null>(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const [streamError, setStreamError] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<any>(null);

  // প্রথম চ্যানেলটি ডিফল্ট হিসেবে সেট করা
  useEffect(() => {
    if (liveChannels.length > 0 && !activeChannel) {
      setActiveChannel(liveChannels[0]);
    }
  }, [liveChannels, activeChannel]);

  // HLS ভিডিও প্লেয়ার লজিক
  useEffect(() => {
    if (!activeChannel) return;

    const loadStream = async () => {
      const video = videoRef.current;
      if (!video) return;

      // আগের কোনো স্ট্রিম থাকলে তা বন্ধ করা
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      setIsBuffering(true);
      setStreamError(false);

      try {
        // ডাইনামিক ইমপোর্ট (hls.js লাইব্রেরি)
        const Hls = (await import('hls.js')).default;

        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsRef.current = hls;
          hls.loadSource(activeChannel.streamUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsBuffering(false);
            video.play().catch(() => {
              // অটো-প্লে ব্লক হলে মিউট করে ট্রাই করা
              video.muted = true;
              video.play();
            });
          });

          hls.on(Hls.Events.ERROR, (_: any, data: any) => {
            if (data.fatal) {
              setStreamError(true);
              setIsBuffering(false);
            }
          });
        } 
        // iOS/Safari সাপোর্ট
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = activeChannel.streamUrl;
          video.addEventListener('loadedmetadata', () => {
            setIsBuffering(false);
            video.play();
          });
        }
      } catch (err) {
        setStreamError(true);
        setIsBuffering(false);
      }
    };

    loadStream();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [activeChannel]);

  if (loading) return <div className="text-center py-20 font-bold text-orange-500 animate-pulse">চ্যানেল লিস্ট লোড হচ্ছে...</div>;
  if (error) return <div className="text-center py-20 text-red-500">ডেটা লোড করতে সমস্যা হয়েছে।</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-black gradient-text mb-2">লাইভ টিভি সম্প্রচার</h1>
        <p className="text-gray-500 font-medium">২৪/৭ ধর্মীয় এবং সাংস্কৃতিক অনুষ্ঠানসমূহ</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black rounded-[2.5rem] overflow-hidden relative shadow-2xl ring-8 ring-orange-50">
            <div className="aspect-video relative group">
              <video 
                ref={videoRef} 
                className="w-full h-full object-contain bg-black" 
                playsInline 
                autoPlay 
                controls 
              />
              
              {/* Buffering Overlay */}
              {isBuffering && !streamError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                  <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-white font-bold tracking-widest animate-pulse">সংযুক্ত হচ্ছে...</p>
                </div>
              )}

              {/* Error Overlay */}
              {streamError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white p-6 text-center">
                  <AlertCircle size={48} className="text-red-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">লিঙ্কটি বর্তমানে অফলাইনে আছে</h3>
                  <p className="text-gray-400 text-sm mb-6">দয়া করে অন্য কোনো চ্যানেল চেষ্টা করুন অথবা পরে আবার চেক করুন।</p>
                  <button 
                    onClick={() => setActiveChannel({...activeChannel!})} 
                    className="px-6 py-3 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-colors"
                  >
                    আবার চেষ্টা করুন
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-orange-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">
                {activeChannel?.logo}
              </div>
              <div>
                <h2 className="font-bold text-lg">{activeChannel?.name}</h2>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live Now
                </p>
              </div>
            </div>
            <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-orange-500 transition-colors">
              <ExternalLink size={20} />
            </button>
          </div>
        </div>

        {/* Channel List Sidebar */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 px-2 flex items-center gap-2">
            <Tv size={18} className="text-orange-500" /> উপলব্ধ চ্যানেলসমূহ
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
            {liveChannels.map((channel) => (
              <button 
                key={channel.id} 
                onClick={() => setActiveChannel(channel)}
                className={cn(
                  "w-full p-4 rounded-3xl flex items-center gap-4 transition-all border-2 text-left group",
                  activeChannel?.id === channel.id 
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent shadow-lg scale-[1.02]" 
                    : "bg-white border-orange-50 text-gray-700 hover:border-orange-200"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110",
                  activeChannel?.id === channel.id ? "bg-white/20" : "bg-orange-50"
                )}>
                  {channel.logo}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm leading-none mb-1">{channel.name}</p>
                  <p className={cn(
                    "text-[10px]",
                    activeChannel?.id === channel.id ? "text-orange-100" : "text-gray-400"
                  )}>Click to Play</p>
                </div>
                {activeChannel?.id === channel.id && <Play size={16} fill="white" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
// --- Contact Page Component ---

const ContactPage = () => {
  const contactInfo = [
    {
      title: 'আমাদের ঠিকানা',
      details: 'কালিবাড়ী মন্দির রোড, সিংড়া, নাটোর',
      sub: 'রাজশাহী বিভাগ, বাংলাদেশ',
      icon: MapPin,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'হেল্পলাইন',
      details: '+৮৮ ০১৭৩৩-১১৮৩১৩',
      sub: 'সকাল ১০টা থেকে রাত ১০টা',
      icon: PhoneCall,
      color: 'bg-green-100 text-green-600',
      action: 'tel:+8801733118313'
    },
    {
      title: 'ইমেইল করুন',
      details: 'khds3.official@gmail.com',
      sub: 'যেকোনো তথ্যের জন্য',
      icon: Mail,
      color: 'bg-blue-100 text-blue-600',
      action: 'mailto:khds3.official@gmail.com'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black gradient-text">যোগাযোগ করুন</h1>
        <p className="text-gray-500 max-w-xl mx-auto font-medium">
          আমাদের সোসাইটি সংক্রান্ত যেকোনো জিজ্ঞাসা বা সহযোগিতার জন্য নিচের মাধ্যমগুলোতে যোগাযোগ করতে পারেন।
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {contactInfo.map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-50 text-center group hover:shadow-xl transition-all">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6", item.color)}>
              <item.icon size={32} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="font-bold text-gray-700 text-sm mb-1">{item.details}</p>
            <p className="text-xs text-gray-400 mb-6">{item.sub}</p>
            {item.action && (
              <a href={item.action} className="inline-flex items-center gap-2 text-sm font-black text-orange-600 hover:text-orange-700 transition-colors">
                যোগাযোগ করুন <ChevronRight size={16} />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Social Media & Map Placeholder */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 italic">আমাদের সোশ্যাল মিডিয়া</h3>
            <p className="text-blue-100 mb-8 leading-relaxed">
              ফেসবুকে আমাদের সাথে যুক্ত হয়ে নিয়মিত আপডেট এবং উৎসবের লাইভ ভিডিও দেখুন।
            </p>
            <a 
              href="https://facebook.com/KHDS3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold shadow-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-3"
            >
              <Facebook size={24} /> ফেসবুক পেজে যান
            </a>
          </div>
          <Facebook className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12" />
        </div>

        <div className="bg-white p-4 rounded-[3rem] shadow-sm border border-orange-50 h-[350px] overflow-hidden relative group">
          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-8">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-orange-500">
                <MapPin size={32} />
             </div>
             <p className="font-bold text-gray-500">Google Map শীঘ্রই যুক্ত করা হবে</p>
             <p className="text-xs text-gray-400 mt-2">সিংড়া কালিবাড়ী মন্দির কমপ্লেক্স</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Layout Component: Footer ---

const Footer = () => (
  <footer className="bg-white border-t border-orange-100 pt-20 pb-10 mt-20">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
      <div className="md:col-span-2 space-y-6">
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">ॐ</div>
          <span className="text-2xl font-black gradient-text italic">কালিবাড়ী ডিজিটাল সোসাইটি</span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md">
          সিংড়া উপজেলার সনাতন ধর্মাবলম্বীদের ঐক্য এবং ডিজিটাল সেবার একটি নির্ভরযোগ্য মাধ্যম। আমরা তথ্য ও প্রযুক্তির মাধ্যমে ধর্মীয় ঐতিহ্যকে সকলের কাছে পৌঁছে দিতে কাজ করছি।
        </p>
        <div className="flex justify-center md:justify-start gap-4">
          <a href="#" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"><Facebook size={20}/></a>
          <a href="#" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shadow-sm"><Mail size={20}/></a>
          <a href="tel:+8801733118313" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors shadow-sm"><PhoneCall size={20}/></a>
        </div>
      </div>

      <div>
        <h4 className="font-black text-gray-800 mb-6 uppercase tracking-widest text-xs">দ্রুত লিঙ্ক</h4>
        <ul className="space-y-4 text-sm font-bold text-gray-500">
          <li><Link to="/" className="hover:text-orange-500 transition-colors">হোম পেজ</Link></li>
          <li><Link to="/gallery" className="hover:text-orange-500 transition-colors">ফটো গ্যালারি</Link></li>
          <li><Link to="/live" className="hover:text-orange-500 transition-colors">লাইভ টিভি</Link></li>
          <li><Link to="/login" className="hover:text-orange-500 transition-colors">সদস্য এলাকা</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-black text-gray-800 mb-6 uppercase tracking-widest text-xs">আইনি তথ্য</h4>
        <ul className="space-y-4 text-sm font-bold text-gray-500">
          <li className="hover:text-orange-500 transition-colors cursor-pointer">গোপনীয়তা নীতি</li>
          <li className="hover:text-orange-500 transition-colors cursor-pointer">ব্যবহারের শর্তাবলী</li>
          <li className="hover:text-orange-500 transition-colors cursor-pointer">কপিরাইট তথ্য</li>
        </ul>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-gray-50 flex flex-col md:row items-center justify-between gap-4 text-xs font-bold text-gray-400">
      <p>© ২০২৬ কালিবাড়ী ডিজিটাল সোসাইটি। সর্বস্বত্ব সংরক্ষিত।</p>
      <div className="flex items-center gap-2">
        <span>Powered by</span>
        <span className="text-orange-600 font-black">Gemini AI Engine</span>
      </div>
    </div>
  </footer>
);
// --- Photo Gallery Page Component ---

const GalleryPage = () => {
  // গিটহাব থেকে গ্যালারি ডেটা লোড করা
  const [galleryData, loading] = useDataLoader<GalleryImage[]>(GITHUB_GALLERY_URL, []);
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // ইউনিক ক্যাটাগরিগুলো বের করা
  const categories = useMemo(() => {
    const cats = galleryData.map(img => img.category);
    return ['All', ...Array.from(new Set(cats))];
  }, [galleryData]);

  // ফিল্টার অনুযায়ী ছবিগুলো আলাদা করা
  const filteredImages = useMemo(() => {
    if (filter === 'All') return galleryData;
    return galleryData.filter(img => img.category === filter);
  }, [filter, galleryData]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="font-bold text-orange-500 animate-pulse">গ্যালারি লোড হচ্ছে...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black gradient-text italic">উৎসবের স্মৃতি</h1>
        <p className="text-gray-500 font-medium">আমাদের বিগত অনুষ্ঠান এবং মন্দিরের চমৎকার সব মুহূর্ত</p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm border",
              filter === cat 
                ? "bg-orange-500 text-white border-orange-500 shadow-orange-200" 
                : "bg-white text-gray-500 border-orange-50 hover:border-orange-200 hover:bg-orange-50"
            )}
          >
            {cat === 'All' ? 'সব ছবি' : cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <div 
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all border-4 border-white"
          >
            <img 
              src={image.url} 
              alt={image.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <span className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">{image.category}</span>
              <h3 className="text-white font-bold leading-tight">{image.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Image Lightbox (Full Screen View) */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in-95 duration-300">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={28} />
          </button>
          
          <div className="max-w-5xl w-full flex flex-col gap-4">
            <img 
              src={selectedImage.url} 
              className="w-full h-auto max-h-[80vh] object-contain rounded-3xl shadow-2xl" 
              alt={selectedImage.title} 
            />
            <div className="text-center text-white space-y-1">
              <h2 className="text-xl font-bold">{selectedImage.title}</h2>
              <p className="text-orange-400 text-sm">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}

      {filteredImages.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-orange-50">
          <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">এই ক্যাটাগরিতে কোনো ছবি পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
};
// --- Member Area: Login & Dashboard Component ---

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginType, setLoginType] = useState<'general' | 'accounts'>('general');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'contacts' | 'invitation' | 'accounts'>('members');
  
  // Input States
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Data States
  const [membersData, setMembersData] = useState<Member[]>([]);
  const [contactsData, setContactsData] = useState<ContactPerson[]>([]);
  const [invitationData, setInvitationData] = useState<InvitationList[]>([]);
  const [accountsPDFs, setAccountsPDFs] = useState<AccountsPDFs>({});
  const [loginData, setLoginData] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // গিটহাব থেকে লগইন ক্রেডেনশিয়াল লোড করা
  useEffect(() => {
    fetch(GITHUB_LOGIN_URL, { cache: 'no-cache' })
      .then(res => res.json())
      .then(data => setLoginData(data))
      .catch(() => setLoginError('সার্ভার থেকে লগইন তথ্য লোড করা সম্ভব হয়নি।'));
  }, []);

  // লগইন হ্যান্ডলার
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!usernameInput || !passwordInput) {
      setLoginError('মোবাইল নম্বর এবং পাসওয়ার্ড দিন');
      return;
    }

    setIsLoggingIn(true);
    
    // ১ সেকেন্ডের একটি ডিলে দেওয়া হয়েছে রিয়েলিস্টিক ফিল আনার জন্য
    setTimeout(() => {
      const db = loginType === 'general' ? loginData?.normalMembers : loginData?.accountsMembers;
      const foundUser = db?.find((u: any) => 
        (u.mobile === usernameInput || u.email === usernameInput) && u.password === passwordInput
      );

      if (foundUser) {
        setIsLoggedIn(true);
        setLoggedInUser(foundUser);
        // মেম্বার ডেটা লোড করা
        fetch(GITHUB_MEMBERS_DATA_URL)
          .then(res => res.json())
          .then(data => {
            setMembersData(data.members || []);
            setContactsData(data.contacts || []);
            setInvitationData(data.invitations || []);
            setAccountsPDFs(data.accounts || {});
          });
      } else {
        setLoginError('ভুল তথ্য দিয়েছেন! আবার চেষ্টা করুন।');
      }
      setIsLoggingIn(false);
    }, 1000);
  };

  // লগআউট ফাংশন
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setUsernameInput('');
    setPasswordInput('');
  };

  // --- Login UI ---
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-10 animate-in zoom-in-95 duration-500">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-orange-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full"></div>
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-orange-600 shadow-inner">
              <Lock size={36} />
            </div>
            <h2 className="text-3xl font-black gradient-text">সদস্য এলাকা</h2>
            <p className="text-gray-400 text-sm mt-2 font-medium">আপনার একাউন্টে লগইন করুন</p>
          </div>

          <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl">
            <button onClick={() => setLoginType('general')} className={cn("flex-1 py-3 rounded-xl text-sm font-bold transition-all", loginType === 'general' ? "bg-white text-orange-600 shadow-sm" : "text-gray-400 hover:text-gray-600")}>সাধারণ সদস্য</button>
            <button onClick={() => setLoginType('accounts')} className={cn("flex-1 py-3 rounded-xl text-sm font-bold transition-all", loginType === 'accounts' ? "bg-white text-orange-600 shadow-sm" : "text-gray-400 hover:text-gray-600")}>অ্যাডমিন/হিসাব</button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username / Mobile</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={18} />
                <input type="text" placeholder="নম্বর দিন..." value={usernameInput} onChange={e => setUsernameInput(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-orange-500 outline-none transition-all font-bold" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={18} />
                <input type="password" placeholder="••••••••" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-orange-500 outline-none transition-all font-bold" />
              </div>
            </div>
            {loginError && <div className="p-3 bg-red-50 text-red-500 text-xs rounded-xl flex items-center gap-2 font-bold animate-shake"><AlertCircle size={14} /> {loginError}</div>}
            <button disabled={isLoggingIn} className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-black shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest">
              {isLoggingIn ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={20} /> Login</>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Dashboard UI ---
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[3rem] shadow-sm border border-orange-50 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-orange-500 flex items-center justify-center text-white text-3xl font-black shadow-xl rotate-3">
             {loggedInUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800">স্বাগতম, <span className="text-orange-600">{loggedInUser.name}</span></h1>
            <p className="text-sm text-gray-400 font-bold mt-1">সদস্য ড্যাশবোর্ড • {loginType === 'accounts' ? 'Admin Access' : 'Member Access'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="px-8 py-3.5 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-all flex items-center gap-2 self-start md:self-center shadow-sm">
          <LogIn size={20} className="rotate-180" /> Logout
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'members', label: 'সদস্য তালিকা', icon: Users },
          { id: 'contacts', label: 'জরুরী নম্বর', icon: PhoneCall },
          { id: 'invitation', label: 'নিমন্ত্রণ', icon: FileText },
          ...(loginType === 'accounts' ? [{ id: 'accounts', label: 'হিসাবপত্র (PDF)', icon: Download }] : [])
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("px-6 py-4 rounded-2xl flex items-center gap-3 font-black transition-all whitespace-nowrap border-2", activeTab === tab.id ? "bg-orange-500 text-white border-orange-500 shadow-xl scale-105" : "bg-white text-gray-500 border-transparent hover:border-orange-100")}>
            <tab.icon size={20} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Content Rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'members' && membersData.map(m => (
          <div key={m.id} onClick={() => setSelectedMember(m)} className="bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-orange-50 group cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-bl-[2rem] transition-all group-hover:w-20 group-hover:h-20"></div>
             <div className="flex gap-5">
                <img src={m.photo} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-orange-50 group-hover:ring-orange-100 transition-all" alt={m.name} />
                <div className="flex flex-col justify-center">
                   <h3 className="font-black text-gray-800 group-hover:text-orange-600 transition-colors">{m.name}</h3>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{m.designation}</p>
                   <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-lg w-fit">🩸 BLOOD: {m.bloodGroup}</div>
                </div>
             </div>
             <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><MapPin size={12}/> {m.address.split(',')[0]}</span>
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all"><ChevronRight size={16}/></div>
             </div>
          </div>
        ))}

        {/* --- Empty State --- */}
        {activeTab === 'members' && membersData.length === 0 && <div className="col-span-full py-20 text-center font-bold text-gray-400">কোনো তথ্য পাওয়া যায়নি...</div>}
      </div>

      {/* Member Details Modal (যদি দরকার হয়) */}
      {selectedMember && (
         <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedMember(null)}>
            <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
               <div className="h-24 bg-gradient-to-r from-orange-500 to-red-600 p-6 flex justify-end">
                  <button onClick={() => setSelectedMember(null)} className="text-white hover:scale-110 transition"><X size={28}/></button>
               </div>
               <div className="px-8 pb-10 -mt-12 text-center">
                  <img src={selectedMember.photo} className="w-32 h-32 rounded-3xl border-8 border-white shadow-xl mx-auto object-cover" alt="" />
                  <h2 className="text-2xl font-black text-gray-800 mt-4">{selectedMember.name}</h2>
                  <p className="text-orange-600 font-bold uppercase tracking-widest text-xs">{selectedMember.designation}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-8 text-left">
                     <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] text-gray-400 font-black uppercase">পিতা</p>
                        <p className="text-sm font-bold text-gray-700">{selectedMember.fatherName || 'জানা নেই'}</p>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] text-gray-400 font-black uppercase">গোত্র</p>
                        <p className="text-sm font-bold text-gray-700">{selectedMember.gotra || 'জানা নেই'}</p>
                     </div>
                  </div>
                  
                  <a href={`tel:${selectedMember.mobile}`} className="mt-8 w-full py-4 bg-orange-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all">
                    <PhoneCall size={20}/> সরাসরি কল করুন
                  </a>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
// --- Accounts/Admin Section (LoginPage এর ভেতরে ব্যবহারের জন্য) ---
const AccountsSection = ({ pdfs }: { pdfs: AccountsPDFs }) => {
  return (
    <div className="col-span-full grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
      {Object.entries(pdfs).map(([key, category]) => (
        <div key={key} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-150 opacity-50"></div>
          <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-800">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600"><FileText size={20}/></div>
            {category.title}
          </h3>
          <div className="space-y-3">
            {Object.entries(category.years).map(([year, url]) => (
              <a key={year} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-orange-500 hover:text-white transition-all group/item shadow-sm">
                <span className="font-bold">{year} সালের পূর্ণাঙ্গ হিসাব</span>
                <Download size={20} className="text-gray-400 group-hover/item:text-white transition-colors" />
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Global Music Player Component ---
const GlobalMusicPlayer = () => {
  // আপনি চাইলে GITHUB_BASE থেকে songs.json লোড করতে পারেন
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className={cn(
        "bg-white/90 backdrop-blur-2xl p-4 rounded-[2rem] shadow-2xl border border-orange-100 flex items-center gap-4 transition-all duration-500",
        isPlaying ? "w-64" : "w-16 h-16 justify-center"
      )}>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform active:scale-90",
            isPlaying ? "bg-red-500 rotate-0" : "bg-orange-500 hover:rotate-12"
          )}
        >
          {isPlaying ? <Pause size={24} fill="white" /> : <Music size={24} />}
        </button>
        {isPlaying && (
          <div className="flex flex-col animate-in fade-in slide-in-from-left-2 overflow-hidden">
            <span className="text-xs font-black text-gray-800 truncate">শ্রী শ্রী চণ্ডী পাঠ</span>
            <span className="text-[10px] font-bold text-orange-600 animate-pulse uppercase tracking-tighter">Now Playing • Live</span>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Final App Root Component ---
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FFFCF7] text-gray-900 font-sans selection:bg-orange-200">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/live" element={<LiveTVPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* 404 Page */}
            <Route path="*" element={
              <div className="text-center py-40">
                <h1 className="text-9xl font-black text-gray-100">404</h1>
                <div className="relative -mt-20">
                  <h2 className="text-3xl font-black gradient-text">পেজটি পাওয়া যায়নি</h2>
                  <p className="text-gray-400 mt-2 font-bold">আপনি ভুল পথে চলে এসেছেন ভাই!</p>
                  <Link to="/" className="mt-8 inline-block px-8 py-3 bg-orange-500 text-white rounded-2xl font-black shadow-lg">হোমে ফিরে যান</Link>
                </div>
              </div>
            } />
          </Routes>
        </main>
        
        {/* Floating AI & Music Widgets */}
        <GlobalMusicPlayer />
        
        <div className="fixed bottom-6 right-6 z-50">
          <button className="w-16 h-16 bg-gradient-to-tr from-orange-600 to-red-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 hover:-rotate-6 active:scale-95 transition-all group">
            <Send size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <div className="absolute -top-12 right-0 bg-gray-800 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all">
              AI সহায়িকা
            </div>
          </button>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
