import { useState, useMemo, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { InstallPrompt } from './components/InstallPrompt';
import LoginPage, { AIChatbox } from './components/LoginPage';
import { 
  Home as HomeIcon,
  Calendar, 
  Users, 
  Image, 
  Music, 
  FileText, 
  Tv, 
  Phone, 
  LogIn, 
  Menu, 
  X, 
  Facebook, 
  ChevronRight,
  Clock, 
  Download, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2, 
  ChevronDown,
  Bell,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { OptimizedImage } from './components/OptimizedImage';

// cn function - classnames utility
const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Types (শুধু যেগুলো App.tsx এ লাগবে)
interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface PujaInfo {
  id: string;
  name: string;
  date: string;
  description: string;
  image: string;
  facebookLink: string;
}

interface Deity {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
}

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  pujaType: string;
  year: number;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  category: string;
  url: string;
  duration: string;
}

interface PDFFile {
  id: string;
  title: string;
  category: string;
  url: string;
  size: string;
}

interface LiveChannel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
}

// Data URL (শুধু এটা রাখুন)
const GITHUB_DYNAMIC_CONTENT_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/dynamicContent.json';

const deities: Deity[] = [
  {
    id: 'durga',
    name: 'দুর্গা মা',
    title: 'অসুরদমনী, মহিষাসুরমর্দিনী',
    description: 'দুর্গা মা হলেন শক্তির দেবী। তিনি অসুর রাজা মহিষাসুরকে বধ করেছিলেন। দশভুজা এই দেবী সিংহবাহিনী, ত্রিনয়নী।',
    image: 'https://i.ibb.co.com/G3dkhLZq/Durga.png'
  },
  {
    id: 'kali',
    name: 'কালী মা',
    title: 'মহাকালী, কালিকা',
    description: 'কালী মা হলেন সময়ের দেবী, মহাশক্তির এক রূপ। কৃষ্ণবর্ণা এই দেবী মা পার্বতীর তান্ত্রিক রূপ।',
    image: 'https://i.ibb.co.com/YBWdd4wK/Moha-Kali.jpg'
  },
  {
    id: 'shyama',
    name: 'শ্যামা মা',
    title: 'কালীর অন্য রূপ, কৃষ্ণবর্ণা',
    description: 'শ্যামা মা হলেন কালীর আরেক রূপ। কৃষ্ণবর্ণা এই দেবীকে দীপাবলির রাত্রিতে পূজা করা হয়।',
    image: 'https://i.ibb.co.com/0TXrT0n/Kali-Ma.png'
  },
  {
    id: 'saraswati',
    name: 'সরস্বতী মা',
    title: 'বিদ্যাদেবী, বাণীদেবী',
    description: 'সরস্বতী মা হলেন জ্ঞান, সঙ্গীত, কলা ও বিদ্যার দেবী। স্বয়ং ব্রহ্মার সঙ্গিনী এই দেবী।',
    image: 'https://i.ibb.co.com/1Jw49LtJ/Saraswati.png'
  },
  {
    id: 'jagannath',
    name: 'জগন্নাথ দেব',
    title: 'বিশ্বনাথ, পুরীধাম',
    description: 'জগন্নাথ দেব হলেন বিষ্ণুর এক রূপ। পুরীধামে এই দেবতার বিশাল রথযাত্রা হয়।',
    image: 'https://i.ibb.co.com/Xf79K9JZ/jagannath.png'
  }
];

const notices = [
  '🙏 সকলকে দূর্গাপূজার আন্তরিক শুভেচ্ছা!',
  '🎉 দুর্গাপূজা ২০২৬ এর সময়সূচী ঘোষণা',
  '📢 WE WANT TO ARISE THE TRUTH & BEAUTY OF HINDU RELIGION AND AVOID THE MYTH ',
  '🎉 মেম্বার তথ্য এবং  বিবরণী দেখতে মেম্বার লগইন এ প্রবেশ করুণ।',
  '📱 আমাদের ফেসবুক পেজে লাইক দিন!'
  
];

// ==================== GLOBAL MEDIA CONTEXT ====================

interface MediaContextType {
  // Music
  currentSong: Song | null;
  currentIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  volume: number;
  setVolume: (v: number) => void;
  playSong: (song: Song, index: number, playlist: Song[]) => void;
  togglePlayPause: () => void;
  closeMusicPlayer: () => void;
  skipForward: () => void;
  skipBack: () => void;
  seekTo: (percent: number) => void;
  playlist: Song[];
  
  // Live TV
  activeChannel: LiveChannel | null;
  setActiveChannel: (channel: LiveChannel | null) => void;
  closeLiveTV: () => void;
}

const MediaContext = createContext<MediaContextType | null>(null);

function MediaProvider({ children }: { children: React.ReactNode }) {
 
  // ===== MUSIC STATE =====
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentIndexRef = useRef<number>(-1);
  const playlistRef = useRef<Song[]>([]);

  // ===== LIVE TV STATE =====
  const [activeChannel, setActiveChannelState] = useState<LiveChannel | null>(null);

  // Refs sync
  useEffect(() => {
    currentIndexRef.current = currentIndex;
    playlistRef.current = playlist;
  }, [currentIndex, playlist]);

  // ===== AUDIO INITIALIZATION =====
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      const idx = currentIndexRef.current;
      const songs = playlistRef.current;
      
      if (songs.length > 0) {
        const nextIndex = idx + 1 >= songs.length ? 0 : idx + 1;
        const nextSong = songs[nextIndex];
        
        if (nextSong && audioRef.current) {
          setCurrentSong(nextSong);
          setCurrentIndex(nextIndex);
          setProgress(0);
          setCurrentTime(0);
          setIsLoading(true);
          
          audioRef.current.src = nextSong.url;
          audioRef.current.load();
          audioRef.current.play()
            .then(() => { setIsPlaying(true); setIsLoading(false); })
            .catch(() => { setIsPlaying(false); setIsLoading(false); });
        }
      }
    };

    const handleError = () => { 
      setIsLoading(false); 
      setIsPlaying(false); 
    };
    
    const handleCanPlay = () => { 
      setIsLoading(false); 
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // ===== MUSIC FUNCTIONS =====
  
  // Play Song - এটা call হলে TV তে কিছু হবে না, শুধু music চালু হবে
  const playSong = useCallback((song: Song, index: number, newPlaylist: Song[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setCurrentSong(song);
    setCurrentIndex(index);
    setPlaylist(newPlaylist);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);

    audio.src = song.url;
    audio.load();
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => { setIsPlaying(true); setIsLoading(false); })
        .catch(() => { setIsPlaying(false); setIsLoading(false); });
    }
  }, []);

  // Toggle Play/Pause
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [currentSong, isPlaying]);

  // Skip Forward
  const skipForward = useCallback(() => {
    const songs = playlistRef.current;
    if (songs.length === 0) return;

    let newIndex = currentIndexRef.current + 1;
    if (newIndex >= songs.length) newIndex = 0;

    const nextSong = songs[newIndex];
    if (nextSong) {
      playSong(nextSong, newIndex, songs);
    }
  }, [playSong]);

  // Skip Back
  const skipBack = useCallback(() => {
    const audio = audioRef.current;
    const songs = playlistRef.current;

    // 3 সেকেন্ডের বেশি চললে restart
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (songs.length === 0) return;

    let newIndex = currentIndexRef.current - 1;
    if (newIndex < 0) newIndex = songs.length - 1;

    const prevSong = songs[newIndex];
    if (prevSong) {
      playSong(prevSong, newIndex, songs);
    }
  }, [playSong]);

  // Seek To
  const seekTo = useCallback((percent: number) => {
    const audio = audioRef.current;
    if (!audio || !duration || isNaN(duration)) return;
    audio.currentTime = (percent / 100) * duration;
  }, [duration]);

  // Close Music Player
  const closeMusicPlayer = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    setCurrentSong(null);
    setCurrentIndex(-1);
    setPlaylist([]);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  // ===== LIVE TV FUNCTIONS =====
  
  // Set Active Channel - Music বন্ধ করে TV চালু
  const setActiveChannel = useCallback((channel: LiveChannel | null) => {
    if (channel) {
      // Music চালু থাকলে pause করি
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
    setActiveChannelState(channel);
  }, [isPlaying]);

  // Close Live TV
  const closeLiveTV = useCallback(() => {
    setActiveChannelState(null);
  }, []);

  return (
    <MediaContext.Provider value={{
      // Music
      currentSong,
      currentIndex,
      isPlaying,
      isLoading,
      progress,
      duration,
      currentTime,
      volume,
      setVolume,
      playSong,
      togglePlayPause,
      closeMusicPlayer,
      skipForward,
      skipBack,
      seekTo,
      playlist,
      // Live TV
      activeChannel,
      setActiveChannel,
      closeLiveTV
    }}>
      {children}
    </MediaContext.Provider>
  );
}

function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within MediaProvider');
  }
  return context;
}

// Hooks
function useCountdown(targetDate: string): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ 
    days: 0, 
    hours: 0, 
    minutes: 0, 
    seconds: 0 
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

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
// Components
function CountdownDisplay({ targetDate, title }: { targetDate: string; title: string }) {
  const time = useCountdown(targetDate);
  const isUpcoming = new Date(targetDate) > new Date();

  return (
    <div className="countdown-pulse bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white text-center">
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      {isUpcoming ? (
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-xl font-bold">{time.days}</div>
            <div className="text-xs">দিন</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-xl font-bold">{time.hours}</div>
            <div className="text-xs">ঘণ্টা</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-xl font-bold">{time.minutes}</div>
            <div className="text-xs">মিনিট</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-xl font-bold">{time.seconds}</div>
            <div className="text-xs">সেকেন্ড</div>
          </div>
        </div>
      ) : (
        <div className="text-lg font-bold">পূজা সম্পন্ন হয়েছে</div>
      )}
    </div>
  );
}

function NoticeMarquee() {
  return (
    <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white py-2 overflow-hidden">
      <div className="marquee whitespace-nowrap flex items-center gap-8">
        {notices.map((notice, index) => (
          <span key={index} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
            {notice}
          </span>
        ))}
        {notices.map((notice, index) => (
          <span key={`dup-${index}`} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
            {notice}
          </span>
        ))}
      </div>
    </div>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'হোম', icon: HomeIcon },
    { path: '/durga', label: 'দূর্গাপূজা', icon: Calendar },
    { path: '/shyama', label: 'শ্যামাপূজা', icon: Calendar },
    { path: '/saraswati', label: 'সরস্বতী পূজা', icon: Calendar },
    { path: '/rath', label: 'রথযাত্রা', icon: Calendar },
    { path: '/deities', label: 'দেব-দেবী', icon: Users },
    { path: '/quiz', label: 'কুইজ', icon: FileText },
    { path: '/gallery', label: 'ফটো গ্যালারি', icon: Image },
    { path: '/music', label: 'ধর্মীয় গান', icon: Music },
    { path: '/pdf', label: 'PDF', icon: FileText },
    { path: '/live', label: 'লাইভ TV', icon: Tv },
    { path: '/contact', label: 'যোগাযোগ', icon: Phone },
    { path: '/login', label: 'মেম্বার লগইন', icon: LogIn },
  ];

  return (
    <header className="sticky top-0 z-50">
      <NoticeMarquee />
      <div className="glass shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xl">
                🕉️
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold gradient-text">কলম হিন্দু ধর্মসভা</h1>
                <p className="text-xs text-gray-600">কলম, সিংড়া, নাটোর</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 whitespace-nowrap",
                    location.pathname === item.path
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  )}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-orange-50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    location.pathname === item.path
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-700 hover:bg-orange-50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-900 to-red-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              🕉️ কলম হিন্দু ধর্মসভা
            </h3>
            <p className="text-orange-200 text-sm leading-relaxed">
              কলম, সিংড়া, নাটোর, রাজশাহী<br />
              স্থাপিত: ২০১৭ সাল
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-sm text-orange-200">
              <li><Link to="/durga" className="hover:text-white">দূর্গাপূজা</Link></li>
              <li><Link to="/shyama" className="hover:text-white">শ্যামাপূজা</Link></li>
              <li><Link to="/" className="hover:text-white">ফটো গ্যালারি</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">সোশ্যাল মিডিয়া</h4>
            <a href="https://facebook.com/KHDS3" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
              <Facebook className="w-5 h-5" />
            </a>
            <p className="mt-4 text-xs text-orange-300">
              © ২০২৬ কলম হিন্দু ধর্মসভা
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  const [pujaData] = useDataLoader<PujaInfo[]>('/data/pujaData.json', []);
  const [dynamicContent] = useDataLoader<any>(GITHUB_DYNAMIC_CONTENT_URL, {});
  
  // Notices থেকে সর্বশেষ ৫টা নিবে
  const latestNotices = (dynamicContent.notices || []).slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #E6B800 100%)'
        }}></div>
        <div className="absolute inset-0 sacred-pattern opacity-30"></div>
        <div className="relative px-6 py-8 text-center">
          <img 
            src="https://raw.githubusercontent.com/tkmani91/Dharmasaba/main/hader%20Banner.png"
            alt="কলম হিন্দু ধর্মসভা"
            className="max-w-full h-auto max-h-48 mx-auto"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-center mb-6 gradient-text">আসন্ন পূজার কাউন্টডাউন</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pujaData.map((puja) => (
            <CountdownDisplay key={puja.id} targetDate={puja.date} title={puja.name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-center mb-6 gradient-text">আমাদের পূজাসমূহ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pujaData.map((puja) => (
            <Link key={puja.id} to={`/${puja.id}`} className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="h-48 overflow-hidden">
                <img src={puja.image} alt={puja.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{puja.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{puja.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-600 font-medium">
                    {new Date(puja.date).toLocaleDateString('bn-BD')}
                  </span>
                  <ChevronRight className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* সর্বশেষ আপডেট - Dynamic from notices */}
      <section className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center gap-2">
          <Clock className="w-6 h-6" />
          সর্বশেষ আপডেট
        </h2>
        
        {latestNotices.length > 0 ? (
          <div className="space-y-4">
            {latestNotices.map((notice: any, index: number) => (
              <div 
                key={notice.id || index} 
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl hover:shadow-md transition border-l-4",
                  notice.priority === 'high' ? 'border-red-500 bg-red-50/50' : 
                  notice.priority === 'medium' ? 'border-yellow-500 bg-yellow-50/50' : 
                  'border-blue-500 bg-blue-50/50'
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0",
                  notice.priority === 'high' ? 'bg-red-500' : 
                  notice.priority === 'medium' ? 'bg-yellow-500' : 
                  'bg-blue-500'
                )}>
                  {notice.category === 'পূজা' ? '🙏' : 
                   notice.category === 'সভা' ? '👥' : 
                   notice.category === 'অনুষ্ঠান' ? '🎉' : 
                   notice.category === 'জরুরী' ? '🚨' : '📢'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-gray-900">{notice.title}</h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0",
                      notice.priority === 'high' ? 'bg-red-100 text-red-600' : 
                      notice.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-blue-100 text-blue-600'
                    )}>
                      {notice.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{notice.date}</p>
                  {notice.details && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{notice.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>কোনো আপডেট নেই</p>
          </div>
        )}

        {/* সব দেখুন বাটন */}
        {latestNotices.length > 0 && (
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition"
            >
              <Bell className="w-4 h-4" />
              সব বিজ্ঞপ্তি দেখুন
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function PujaPage({ pujaId }: { pujaId: string }) {
  const [pujaData] = useDataLoader<PujaInfo[]>('/data/pujaData.json', []);
  const puja = pujaData.find(p => p.id === pujaId);
  const [schedulesData] = useDataLoader<{ [key: string]: any[] }>('/data/schedules.json', {});
  const schedule = schedulesData[pujaId] || [];

  if (!puja) {
    return <div className="text-center py-12">পূজার তথ্য পাওয়া যায়নি</div>;
  }

  return (
    <div className="space-y-8">
      <div className="relative rounded-2xl overflow-hidden">
        <OptimizedImage src={puja.image} alt={puja.name} className="w-full h-64 md:h-80"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{puja.name}</h1>
          <p className="text-orange-200">{puja.description}</p>
        </div>
      </div>
      
      <CountdownDisplay targetDate={puja.date} title={`${puja.name} শুরু হতে বাকি`} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 gradient-text">পূজার তাৎপর্য</h2>
            <p className="text-gray-700 leading-relaxed">{puja.description}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 gradient-text">সময়সূচি</h2>
            {schedule.length > 0 ? (
              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-orange-50">
                    <div className="w-16 text-center">
                      <div className="text-sm font-bold text-orange-600">{item.day}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.event}</div>
                      <div className="text-sm text-gray-500">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">সময়সূচি শীঘ্রই যুক্ত করা হবে</p>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4">ফেসবুক পেজ</h3>
            <a href={puja.facebookLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium">
              <Facebook className="w-5 h-5" />
              ফেসবুক পেজ দেখুন
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DurgaPujaPage() { return <PujaPage pujaId="durga" />; }
function ShyamaPujaPage() { return <PujaPage pujaId="shyama" />; }
function SaraswatiPujaPage() { return <PujaPage pujaId="saraswati" />; }
function RathYatraPage() { return <PujaPage pujaId="rath" />; }

function DeitiesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">দেব-দেবী</h1>
        <p className="text-gray-600">আমাদের পূজিত দেবতাদের পরিচিতি</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deities.map((deity) => (
          <div key={deity.id} className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="h-56 overflow-hidden">
              <OptimizedImage src={deity.image} alt={deity.name} className="w-full h-56"/> 
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">{deity.name}</h3>
              <p className="text-orange-600 text-sm font-medium mb-3">{deity.title}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{deity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedPuja, setSelectedPuja] = useState<string>('সব');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008];
  const pujaTypes = ['সব', 'দূর্গাপূজা', 'শ্যামাপূজা', 'সরস্বতী পূজা', 'রথযাত্রা'];

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      setError('');
      try {
        const cacheBuster = `?t=${new Date().getTime()}`;
        const response = await fetch(
          `https://raw.githubusercontent.com/tkmani91/KHD/main/gallery-images.json${cacheBuster}`,
          { cache: 'no-store' }
        );
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid data format');
        setGalleryImages(data);
      } catch (err) {
        setError('ছবি লোড করতে সমস্যা হয়েছে।');
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }
  }, [selectedImage]);

  const filteredImages = useMemo(() => {
    return galleryImages.filter((img) => {
      const yearMatch = img.year === selectedYear;
      const pujaMatch = selectedPuja === 'সব' || img.pujaType === selectedPuja;
      return yearMatch && pujaMatch;
    });
  }, [galleryImages, selectedYear, selectedPuja]);

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">ফটো গ্যালারি</h1>
        <p className="text-gray-600">পূজার ছবি সংগ্রহ</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">সাল</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 outline-none"
            >
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">পূজার ধরন</label>
            <select
              value={selectedPuja}
              onChange={(e) => setSelectedPuja(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 outline-none"
            >
              {pujaTypes.map(type => (<option key={type} value={type}>{type}</option>))}
            </select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">ছবি লোড হচ্ছে...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-orange-500 text-white rounded-lg">
            🔄 আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((img) => (
              <div 
                key={img.id} 
                onClick={() => setSelectedImage(img)} 
                className="card-hover relative group rounded-xl overflow-hidden shadow-lg cursor-pointer bg-gray-100"
              >
                <OptimizedImage src={img.url} alt={img.title} className="w-full h-48"/> 
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="text-sm font-medium line-clamp-1">{img.title}</p>
                    <p className="text-xs text-gray-300">{img.pujaType} • {img.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-500 text-lg">{selectedYear} সালের ছবি পাওয়া যায়নি</p>
            </div>
          )}
        </>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 text-white text-3xl hover:text-orange-400">✕</button>
            {filteredImages.findIndex((img) => img.id === selectedImage.id) > 0 && (
              <button onClick={() => navigateImage('prev')} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-orange-400 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center">‹</button>
            )}
            {filteredImages.findIndex((img) => img.id === selectedImage.id) < filteredImages.length - 1 && (
              <button onClick={() => navigateImage('next')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-orange-400 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center">›</button>
            )}
            <img src={selectedImage.url} alt={selectedImage.title} className="w-full rounded-xl max-h-[80vh] object-contain" />
            <div className="mt-4 text-center text-white">
              <p className="font-bold text-lg">{selectedImage.title}</p>
              <p className="text-gray-300 text-sm">{selectedImage.pujaType} • {selectedImage.year}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizArchivePage() {
  const [quizData, setQuizData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState<Record<number, boolean>>({});

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://raw.githubusercontent.com/tkmani91/KHD/main/quiz-archive.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed');
        setQuizData(await response.json());
      } catch { setError('কুইজ লোড করতে সমস্যা হয়েছে।'); }
      finally { setIsLoading(false); }
    };
    fetchQuizData();
  }, []);

  useEffect(() => { setVisibleAnswers({}); setShowAllAnswers(false); }, [selectedYear]);

  const currentYearQuiz = useMemo(() => quizData.find(q => q.year === selectedYear), [quizData, selectedYear]);

  const toggleAnswer = (questionId: number) => {
    setVisibleAnswers(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const toggleAllAnswers = () => {
    if (showAllAnswers) { setVisibleAnswers({}); }
    else {
      const allVisible: Record<number, boolean> = {};
      currentYearQuiz?.questions.forEach((q: any) => { allVisible[q.id] = true; });
      setVisibleAnswers(allVisible);
    }
    setShowAllAnswers(!showAllAnswers);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">📚 দূর্গাপূজা কুইজ</h1>
        <p className="text-gray-600">প্রতিবছর মহানবমীতে অনুষ্ঠিত কুইজ</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border">
          {years.map(year => (<option key={year} value={year}>{year}</option>))}
        </select>
      </div>

      {isLoading && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      )}

      {!isLoading && !error && currentYearQuiz && (
        <>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{currentYearQuiz.title}</h2>
              <p className="text-orange-100">📅 {currentYearQuiz.eventDate}</p>
            </div>
            <button onClick={toggleAllAnswers} className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold flex items-center gap-2">
              {showAllAnswers ? <><EyeOff className="w-5 h-5" /> সব উত্তর লুকান</> : <><Eye className="w-5 h-5" /> সব উত্তর দেখুন</>}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentYearQuiz.questions.map((q: any, index: number) => (
              <div key={q.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold">প্রশ্ন {index + 1}</span>
                </div>
                <div className="p-4">
                  <p className="font-medium text-gray-800 min-h-[60px]">{q.question}</p>
                  <button onClick={() => toggleAnswer(q.id)} className="w-full mt-4 py-2.5 bg-orange-50 text-orange-600 rounded-xl text-sm flex items-center justify-center gap-2">
                    {visibleAnswers[q.id] ? <><EyeOff className="w-4 h-4" /> উত্তর লুকান</> : <><Eye className="w-4 h-4" /> উত্তর দেখুন</>}
                  </button>
                  {visibleAnswers[q.id] && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-xs text-green-600 font-medium mb-1 flex items-center gap-1"><Check className="w-4 h-4" /> সঠিক উত্তর</p>
                      <p className="text-green-800 font-semibold">{q.answer}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!isLoading && !currentYearQuiz && (
        <div className="text-center py-16 bg-white rounded-2xl"><p className="text-gray-500">{selectedYear} সালের কুইজ নেই</p></div>
      )}
    </div>
  );
}
function MusicPage() {
  const [songs] = useDataLoader<Song[]>('/data/songs.json', []);
  const [selectedCategory, setSelectedCategory] = useState('সব');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { currentSong, isPlaying, isLoading, progress, duration, currentTime, volume, setVolume, playSong, togglePlayPause, skipForward, skipBack, seekTo } = useMedia();

  const categories = ['সব', 'দূর্গা পূজা স্পেশাল', 'শ্যামা সংগীত', 'ভজন', 'মহামন্ত্র'];
  const filteredSongs = useMemo(() => selectedCategory === 'সব' ? songs : songs.filter(s => s.category === selectedCategory), [songs, selectedCategory]);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    seekTo(percent);
  };

  const handleDownload = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    if (!song.url || song.url === '#') { alert('ডাউনলোড লিংক নেই'); return; }
    setDownloadingId(song.id);
    const link = document.createElement('a');
    link.href = song.url;
    link.download = `${song.title} - ${song.artist}.mp3`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingId(null), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">ধর্মীয় গান</h1>
        <p className="text-gray-600">পবিত্র ভজন ও সংগীত</p>
      </div>

      {currentSong && (
        <div className="rounded-2xl p-6 text-white sticky top-20 z-40 bg-gradient-to-r from-orange-600 to-red-600 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              {isLoading ? (<div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />)
                : isPlaying ? (<div className="flex items-center gap-0.5"><div className="w-1 h-4 bg-white rounded-full animate-bounce" /><div className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>)
                : (<Music className="w-8 h-8" />)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{currentSong.title}</h3>
              <p className="text-orange-100 text-sm truncate">{currentSong.artist}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={skipBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"><SkipBack className="w-5 h-5" /></button>
              <button onClick={togglePlayPause} disabled={isLoading} className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-orange-600 hover:scale-105 disabled:opacity-50">
                {isLoading ? (<div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />) : isPlaying ? (<Pause className="w-6 h-6" />) : (<Play className="w-6 h-6 ml-1" />)}
              </button>
              <button onClick={skipForward} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"><SkipForward className="w-5 h-5" /></button>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-orange-200 w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer" onClick={handleProgressClick}>
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-orange-200 w-10">{formatTime(duration)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={cn("px-4 py-2 rounded-full text-sm font-medium transition", selectedCategory === cat ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-orange-50")}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSongs.map((song, index) => (
          <div key={song.id} onClick={() => playSong(song, index, filteredSongs)} className={cn("card-hover bg-white rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all", currentSong?.id === song.id && "ring-2 ring-orange-500 bg-orange-50")}>
            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center transition-all", currentSong?.id === song.id && isPlaying ? "bg-gradient-to-br from-orange-500 to-red-500" : "bg-orange-100")}>
              {currentSong?.id === song.id && isLoading ? (<div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />)
                : currentSong?.id === song.id && isPlaying ? (<div className="flex items-center gap-0.5"><div className="w-1 h-4 bg-white rounded-full animate-bounce" /><div className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /></div>)
                : (<Music className="w-6 h-6 text-orange-600" />)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{song.title}</h4>
              <p className="text-sm text-gray-500 truncate">{song.artist}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{song.duration}</span>
              <button onClick={(e) => handleDownload(e, song)} disabled={downloadingId === song.id} className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100 text-orange-600 hover:bg-orange-200">
                {downloadingId === song.id ? (<div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />) : (<Download className="w-4 h-4" />)}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">এই ক্যাটাগরিতে গান নেই</p>
        </div>
      )}
    </div>
  );
}

function PDFPage() {
  const [pdfFiles] = useDataLoader<PDFFile[]>('/data/pdfFiles.json', []);
  const [selectedCategory, setSelectedCategory] = useState('সব');
  const categories = ['সব', 'পূজা ফর্দ', 'বিবাহ', 'শ্রাদ্ধ'];
  const filteredFiles = selectedCategory === 'সব' ? pdfFiles : pdfFiles.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">PDF ডাউনলোড</h1>
        <p className="text-gray-600">প্রয়োজনীয় ফাইল</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={cn("px-4 py-2 rounded-full text-sm font-medium transition", selectedCategory === cat ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-orange-50")}>{cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div key={file.id} className="card-hover bg-white rounded-xl p-6 shadow-lg">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-red-600" />
            </div>
            <h4 className="font-semibold mb-1">{file.title}</h4>
            <p className="text-sm text-gray-500 mb-4">{file.category} • {file.size}</p>
            <a href={file.url} download className="flex items-center justify-center gap-2 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              <Download className="w-4 h-4" />ডাউনলোড
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveTVPage() {
  const [liveChannels] = useDataLoader<LiveChannel[]>('/data/liveChannels.json', []);
  const { activeChannel, setActiveChannel } = useMedia();
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<any>(null);

  useEffect(() => {
    if (liveChannels.length > 0 && !activeChannel) {
      setActiveChannel(liveChannels[0]);
    }
  }, [liveChannels, activeChannel, setActiveChannel]);

  useEffect(() => {
    if (!activeChannel) return;

    const loadStream = async () => {
      const video = videoRef.current;
      if (!video) return;
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      setLocalLoading(true);
      setLocalError(false);

      try {
        const Hls = (await import('hls.js')).default;
        if (Hls.isSupported()) {
          const hls = new Hls();
          hlsRef.current = hls;
          hls.loadSource(activeChannel.streamUrl);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLocalLoading(false);
            video.play().catch(() => { video.muted = true; video.play().catch(() => {}); });
          });
          hls.on(Hls.Events.ERROR, (_: any, data: any) => { if (data.fatal) { setLocalError(true); setLocalLoading(false); } });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = activeChannel.streamUrl;
          video.addEventListener('loadedmetadata', () => { setLocalLoading(false); video.play().catch(() => {}); });
        }
      } catch { setLocalError(true); setLocalLoading(false); }
    };

    loadStream();
    return () => { if (hlsRef.current) hlsRef.current.destroy(); };
  }, [activeChannel]);

  if (!activeChannel) {
    return <div className="text-center py-12">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">লাইভ TV</h1>
        <p className="text-gray-600">ধর্মীয় চ্যানেল</p>
      </div>
      
      <div className="bg-black rounded-2xl overflow-hidden relative">
        <div className="aspect-video relative">
          <video ref={videoRef} className="w-full h-full object-contain bg-black" playsInline autoPlay controls />
          {localLoading && !localError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p>লোড হচ্ছে...</p>
              </div>
            </div>
          )}
          {localError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90">
              <div className="text-center text-white">
                <p className="text-xl mb-4">📡 চ্যানেল পাওয়া যাচ্ছে না</p>
                <button onClick={() => setActiveChannel({...activeChannel})} className="px-6 py-2 bg-orange-500 rounded-lg">আবার চেষ্টা করুন</button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white font-medium">🔴 LIVE: {activeChannel.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {liveChannels.map((channel) => (
          <button key={channel.id} onClick={() => setActiveChannel(channel)} className={cn("p-4 rounded-xl text-center transition-all", activeChannel.id === channel.id ? "bg-gradient-to-br from-orange-500 to-red-500 text-white" : "bg-white hover:bg-orange-50")}>
            <div className="text-3xl mb-2">{channel.logo}</div>
            <p className="font-medium text-sm">{channel.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">যোগাযোগ</h1>
        <p className="text-gray-600">আমাদের সাথে যোগাযোগ করুন</p>
      </div>

      {/* যোগাযোগের ঠিকানা ও সোশ্যাল মিডিয়া */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 gradient-text">যোগাযোগের ঠিকানা</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">📍</div>
              <div><p className="font-medium">ঠিকানা</p><p className="text-gray-600 text-sm">কলম, সিংড়া, নাটোর</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">📞</div>
              <div><p className="font-medium">ফোন</p><p className="text-gray-600 text-sm">০১৭৩৩১১৮৩১৩</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">✉️</div>
              <div><p className="font-medium">ইমেইল</p><p className="text-gray-600 text-sm">durgapuja12@gmail.com</p></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 gradient-text">সোশ্যাল মিডিয়া</h3>
          <a href="https://facebook.com/KHDS3" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100">
            <Facebook className="w-8 h-8 text-blue-600" />
            <div><p className="font-medium">ফেসবুক পেজ</p><p className="text-sm text-gray-600">@KHDS3</p></div>
          </a>
        </div>
      </div>

      {/* ✅ এখানে "আমাকে জানুন" যোগ হবে - লগইন ছাড়াই */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold gradient-text mb-2">আমাকে জানুন</h2>
          <p className="text-gray-600">আপনার প্রশ্নের উত্তর পেতে আমাদের AI সহায়কের সাথে কথা বলুন</p>
        </div>
        <AIChatbox />
      </div>
    </div>
  );
}

// ==================== GLOBAL MINI PLAYERS ====================

function GlobalMusicPlayer() {
  const { currentSong, isPlaying, isLoading, progress, togglePlayPause, closeMusicPlayer, skipForward, skipBack } = useMedia();
  const location = useLocation();

  if (!currentSong || location.pathname === '/music') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="h-1 bg-orange-300">
        <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <div className="flex items-center gap-0.5">
                <div className="w-0.5 h-3 bg-white rounded-full animate-bounce" />
                <div className="w-0.5 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-0.5 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <Music className="w-5 h-5" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{currentSong.title}</p>
            <p className="text-xs text-orange-100 truncate">{currentSong.artist}</p>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={skipBack} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
              <SkipBack className="w-4 h-4" />
            </button>
            
            <button onClick={togglePlayPause} disabled={isLoading} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-600 hover:scale-105 transition disabled:opacity-50">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            
            <button onClick={skipForward} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
              <SkipForward className="w-4 h-4" />
            </button>
            
            <button onClick={closeMusicPlayer} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-red-500 transition ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobalLiveTVPlayer() {
  const { activeChannel, closeLiveTV, isPlaying: isMusicPlaying, togglePlayPause } = useMedia();
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 64 }); // right-4, bottom-16
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const loadedChannelIdRef = useRef<string | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const shouldShow = activeChannel && location.pathname !== '/live';

  // Stream load - শুধু নতুন channel হলে
  useEffect(() => {
    if (!activeChannel || location.pathname === '/live') return;
    if (loadedChannelIdRef.current === activeChannel.id) return;

    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    loadedChannelIdRef.current = activeChannel.id;
    setIsLoading(true);
    setHasError(false);

    const loadStream = async () => {
      try {
        const Hls = (await import('hls.js')).default;
        
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
          hlsRef.current = hls;
          
          hls.loadSource(activeChannel.streamUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false);
            if (!isMusicPlaying) {
              video.play().catch(() => { video.muted = true; video.play().catch(() => {}); });
            }
          });
          
          hls.on(Hls.Events.ERROR, (_: any, data: any) => {
            if (data.fatal) { setHasError(true); setIsLoading(false); }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = activeChannel.streamUrl;
          video.addEventListener('loadedmetadata', () => {
            setIsLoading(false);
            if (!isMusicPlaying) video.play().catch(() => {});
          }, { once: true });
        }
      } catch { setHasError(true); setIsLoading(false); }
    };

    loadStream();
  }, [activeChannel?.id, location.pathname, isMusicPlaying]);

  // Music চালু/বন্ধ হলে video control
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isLoading || hasError || !activeChannel || location.pathname === '/live') return;

    if (isMusicPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [isMusicPlaying, isLoading, hasError, activeChannel, location.pathname]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    };
  }, []);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('video')) return;
    
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('video')) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      
      const deltaX = dragRef.current.startX - e.clientX;
      const deltaY = dragRef.current.startY - e.clientY;
      
      const newX = Math.max(16, Math.min(window.innerWidth - 320, dragRef.current.initialX + deltaX));
      const newY = Math.max(64, Math.min(window.innerHeight - 300, dragRef.current.initialY + deltaY));
      
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragRef.current) return;
      
      const touch = e.touches[0];
      const deltaX = dragRef.current.startX - touch.clientX;
      const deltaY = dragRef.current.startY - touch.clientY;
      
      const newX = Math.max(16, Math.min(window.innerWidth - 320, dragRef.current.initialX + deltaX));
      const newY = Math.max(64, Math.min(window.innerHeight - 300, dragRef.current.initialY + deltaY));
      
      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const handleRetry = () => {
    loadedChannelIdRef.current = null;
    setHasError(false);
    setIsLoading(true);
  };

  // Minimize toggle - video চলতে থাকবে
  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
    // Video play state বজায় রাখা
    const video = videoRef.current;
    if (video && !isMusicPlaying && !isLoading && !hasError) {
      video.play().catch(() => {});
    }
  };

  if (!shouldShow) return null;

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed z-50 transition-all shadow-2xl select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        isMinimized ? "w-56" : "w-80 md:w-96"
      )}
      style={{ 
        right: `${position.x}px`, 
        bottom: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.3s ease'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="bg-black rounded-2xl overflow-hidden border-2 border-red-500">
        {/* Header - Drag Handle */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-2 text-white flex-1 min-w-0">
            {/* Drag indicator */}
            <div className="flex flex-col gap-0.5 mr-1 opacity-50">
              <div className="w-4 h-0.5 bg-white rounded"></div>
              <div className="w-4 h-0.5 bg-white rounded"></div>
            </div>
            <div className={cn("w-2 h-2 rounded-full flex-shrink-0", isMusicPlaying ? "bg-yellow-400" : "bg-white animate-pulse")} />
            <span className="font-bold text-xs truncate">{isMusicPlaying ? "⏸️ " : "🔴 "}{activeChannel.name}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); handleMinimizeToggle(); }} 
              className="text-white hover:bg-white/20 p-1.5 rounded transition"
            >
              <ChevronDown className={cn("w-4 h-4 transition-transform", isMinimized && "rotate-180")} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); closeLiveTV(); }} 
              className="text-white hover:bg-red-800 p-1.5 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video - Always rendered but hidden when minimized */}
        <div className={cn("aspect-video bg-gray-900 relative", isMinimized && "hidden")}>
          <video ref={videoRef} autoPlay playsInline controls className="w-full h-full" />
          
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          {isMusicPlaying && !isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-center text-white">
                <Music className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm">মিউজিক চালু আছে</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} 
                  className="mt-2 px-4 py-1.5 bg-orange-500 rounded-lg text-xs hover:bg-orange-600"
                >
                  মিউজিক বন্ধ করুন
                </button>
              </div>
            </div>
          )}
          
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 text-white">
              <div className="text-center">
                <p className="text-sm mb-2">📡 সংযোগ ত্রুটি</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRetry(); }} 
                  className="px-4 py-1.5 bg-orange-500 rounded-lg text-xs"
                >
                  আবার চেষ্টা
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Minimized State */}
        {isMinimized && (
          <div className="p-3 flex items-center justify-between bg-gray-900">
            <div className="flex items-center gap-2">
              {!isMusicPlaying && !isLoading && !hasError && (
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
              <span className="text-white text-xs">
                {isMusicPlaying ? "⏸️ Paused" : isLoading ? "Loading..." : hasError ? "Error" : "▶️ Playing"}
              </span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); handleMinimizeToggle(); }}
              className="text-white bg-white/20 px-2 py-1 rounded text-xs hover:bg-white/30"
            >
              বড় করুন
            </button>
          </div>
        )}
      </div>

      {/* Drag hint */}
      {!isMinimized && (
        <p className="text-center text-xs text-gray-400 mt-1 pointer-events-none">
          ধরে সরান
        </p>
      )}
    </div>
  );
}
// ==================== MAIN APP COMPONENT ====================

function App() {
  return (
    <MediaProvider>
      <Router>
        <AppContent />
      </Router>
    </MediaProvider>
  );
}

function AppContent() {
  return (
    <>
      <InstallPrompt />
      <div className="min-h-screen sacred-pattern">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/durga" element={<DurgaPujaPage />} />
            <Route path="/shyama" element={<ShyamaPujaPage />} />
            <Route path="/saraswati" element={<SaraswatiPujaPage />} />
            <Route path="/rath" element={<RathYatraPage />} />
            <Route path="/deities" element={<DeitiesPage />} />
            <Route path="/quiz" element={<QuizArchivePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/pdf" element={<PDFPage />} />
            <Route path="/live" element={<LiveTVPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        
        <GlobalMusicPlayer />
        <GlobalLiveTVPlayer />
        
        <Footer />
      </div>
    </>
  );
}

export default App;
