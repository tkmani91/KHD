import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, Calendar, Users, Image, Music, FileText, 
  Tv, Phone, LogIn, Menu, X, Facebook, ChevronRight,
  Clock, Download, Play, Pause, SkipBack, SkipForward,
  Volume2, User, Lock, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { cn } from './utils/cn';

// Types
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
  id: string;
  year: number;
  pujaType: string;
  url: string;
  title: string;
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

interface Member {
  id: string;
  name: string;
  designation: string;
  photo: string;
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
}

interface InvitationList {
  id: string;
  area: string;
  personName: string;
  familyCount: number;
  pdfUrl: string;
}

// Data
const pujaData: PujaInfo[] = [
  {
    id: 'durga',
    name: 'দূর্গাপূজা',
    date: '2026-10-17',
    description: 'দূর্গা মা অসুরদমনী, মহিষাসুরমর্দিনী - শক্তির আরাধনা',
    image: 'https://i.ibb.co.com/G3dkhLZq/Durga.png',
    facebookLink: 'https://facebook.com/KHDS3'
  },
  {
    id: 'shyama',
    name: 'শ্যামাপূজা',
    date: '2026-11-08',
    description: 'শ্যামা মা কালীর অন্য রূপ, কৃষ্ণবর্ণা - কালীপূজা',
    image: 'https://i.ibb.co.com/0TXrT0n/Kali-Ma.png',
    facebookLink: 'https://facebook.com/KHDS3'
  },
  {
    id: 'saraswati',
    name: 'সরস্বতী পূজা',
    date: '2027-02-11',
    description: 'সরস্বতী মা বিদ্যাদেবী, বাণীদেবী - জ্ঞানের আরাধনা',
    image: 'https://i.ibb.co.com/1Jw49LtJ/Saraswati.png',
    facebookLink: 'https://facebook.com/KHDS3'
  },
  {
    id: 'rath',
    name: 'রথযাত্রা',
    date: '2026-05-16',
    description: 'জগন্নাথ দেব বিশ্বনাথ, পুরীধাম - ভগবানের রথযাত্রা',
    image: 'https://i.ibb.co.com/Xf79K9JZ/jagannath.png',
    facebookLink: 'https://facebook.com/KHDS3'
  }
];

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

function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedPuja, setSelectedPuja] = useState<string>('সব');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,2016,2015,2014,2013,2012,2011,2010,2009,2008];
  const pujaTypes = ['সব', 'দূর্গাপূজা', 'শ্যামাপূজা', 'সরস্বতী পূজা', 'রথযাত্রা'];

  // ✅ GitHub JSON থেকে ছবি লোড
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/tkmani91/KHD/main/gallery-images.json',
          { cache: 'no-cache' }
        );
        if (!response.ok) throw new Error('লোড ব্যর্থ');
        const data = await response.json();
        setGalleryImages(data);
      } catch (err) {
        setError('ছবি লোড করতে সমস্যা হয়েছে। ইন্টারনেট চেক করুন।');
        setGalleryImages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  const filteredImages = galleryImages.filter(img => {
    const yearMatch = img.year === selectedYear;
    const pujaMatch = selectedPuja === 'সব' || img.pujaType === selectedPuja;
    return yearMatch && pujaMatch;
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">ফটো গ্যালারি</h1>
        <p className="text-gray-600">২০১৭ থেকে ২০২৬ সাল পর্যন্ত পূজার ছবি</p>
      </div>

      {/* ফিল্টার */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              সাল নির্বাচন করুন
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              পূজার ধরন
            </label>
            <select
              value={selectedPuja}
              onChange={(e) => setSelectedPuja(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
            >
              {pujaTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* লোডিং */}
      {isLoading && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">ছবি লোড হচ্ছে...</p>
        </div>
      )}

      {/* এরর */}
      {error && !isLoading && (
        <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
          <p className="text-red-500 text-lg mb-2">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            🔄 আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* ছবির গ্রিড */}
      {!isLoading && !error && (
        <>
          {/* কতটি ছবি পাওয়া গেছে */}
          {filteredImages.length > 0 && (
            <p className="text-sm text-gray-500 text-right">
              মোট {filteredImages.length}টি ছবি পাওয়া গেছে
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className="card-hover relative group rounded-xl overflow-hidden shadow-lg cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/400x300?text=ছবি+নেই';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="text-sm font-medium">{img.title}</p>
                    <p className="text-xs text-gray-300">{img.pujaType} • {img.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ছবি না থাকলে */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">🖼️</div>
              <p className="text-gray-500 text-lg">
                {selectedYear} সালের {selectedPuja !== 'সব' ? selectedPuja : ''} ছবি এখনো যুক্ত করা হয়নি
              </p>
              <p className="text-sm text-gray-400 mt-2">
                অন্য সাল বা পূজার ধরন সিলেক্ট করুন
              </p>
            </div>
          )}
        </>
      )}

      {/* ✅ লাইটবক্স - ছবিতে ক্লিক করলে বড় দেখাবে */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-orange-400"
            >
              ✕
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full rounded-xl max-h-[80vh] object-contain"
            />
            <div className="mt-3 text-center text-white">
              <p className="font-bold text-lg">{selectedImage.title}</p>
              <p className="text-gray-400 text-sm">
                {selectedImage.pujaType} • {selectedImage.year}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const songs: Song[] = [
  { id: '1', title: 'নমোঃ দেবযাই মহা দেবযাই', artist: 'তুষার দত্ত', category: 'দূর্গা পূজা স্পেশাল', url: 'https://github.com/tkmani91/Dharmasaba/raw/main/MP3/Durga%20Devi%20Sthuti/Namoh%20Devyai%20Maha%20Devyai.webm', duration: '9:27' },
  { id: '2', title: 'মধুকৈটভ বিধবংশী', artist: 'তুষার দত্ত', category: 'দূর্গা পূজা স্পেশাল', url: 'https://github.com/tkmani91/Dharmasaba/raw/main/MP3/Durga%20Devi%20Sthuti/Madhukaitava%20Vidhwangsi.webm', duration: '9:48' },
  { id: '3', title: 'ওম আয়ুর্দেহি যশোদেহি', artist: 'তুষার দত্ত', category: 'দূর্গা পূজা স্পেশাল', url: 'https://github.com/tkmani91/Dharmasaba/raw/main/MP3/Durga%20Devi%20Sthuti/Om%20Ayurdehi%20Jashodehi.webm', duration: '7:16' },
  { id: '4', title: 'ওম জয়তাং দেবী চামুন্ডে', artist: 'তুষার দত্ত', category: 'দূর্গা পূজা স্পেশাল', url: 'https://github.com/tkmani91/Dharmasaba/raw/main/MP3/Durga%20Devi%20Sthuti/Om%20Jayatang%20Devi%20Chamunde.webm', duration: '8:20' },
  { id: '5', title: 'সাভারণী সূর্যো তমায়ো', artist: 'তুষার দত্ত', category: 'দূর্গা পূজা স্পেশাল', url: 'https://github.com/tkmani91/Dharmasaba/raw/main/MP3/Durga%20Devi%20Sthuti/Savarni%20Suryo%20Tanayo.mp3', duration: '6:04' },
  { id: '6', title: 'আমার সাধ না মিটিল', artist: 'শুভঙ্কর', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/glpacs.webm', duration: '4:01' },
  { id: '7', title: 'আমার আর কোনও গুন নেই মা', artist: 'মধুপূর্ণা গাঙ্গুলি', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/gpra90.webm', duration: '5:45' },
  { id: '8', title: 'আমার চেতনা চৈতন্য', artist: 'মেখলা দাশগুপ্ত', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/1wl9oi.webm', duration: '3:32' },
  { id: '9', title: 'আমার সাধ না মিটিল', artist: 'সোমচন্দ ভট্টাচার্য', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/7f4a2l.webm', duration: '4:48' },
  { id: '10', title: 'আমি সকল কাজের', artist: 'সোহিনী মুখার্জি', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/k76bty.webm', duration: '3:41' },
  { id: '11', title: 'ভেবে দেখ মন', artist: 'অরিজিৎ চক্রবর্তী', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/1tn51j.webm', duration: '5:37' },
  { id: '12', title: 'বল মা আমি দাঁড়াই কোথা', artist: 'গুরুজিৎ সিং', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/q9of4f.webm', duration: '4:48' },
  { id: '13', title: 'ডাক দেখি মন', artist: 'অর্পণা চক্রবর্তী', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/xpxdq7.webm', duration: '3:16' },
  { id: '14', title: 'দোষ কারো নয় গো', artist: 'সৃজন চ্যাটার্জী', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/0gsfj5.webm', duration: '4:45' },
  { id: '15', title: 'ডুব দে রে মন কালী বলে', artist: 'অর্পিতা দে', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/03wm3l.webm', duration: '5:58' },
  { id: '16', title: 'একবার নাচো মা', artist: 'কালিকাপ্রসাদ', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/kmiive.webm', duration: '5:39' },
  { id: '17', title: 'কালী কালী বল রসনা', artist: 'সোহিনী মুখার্জি', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/6sktoa.webm', duration: '4:46' },
  { id: '18', title: 'কালো মেয়ের পায়ের তলায়', artist: 'শুভঙ্কর', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/bms14y.webm', duration: '4:31' },
  { id: '19', title: 'মা গো তোর কৃপা', artist: 'সৌরভ মুখার্জি', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/ybmbw2.webm', duration: '5:06' },
  { id: '20', title: 'মায়ের মূর্তি গড়াতে চাই', artist: 'সোহিনী মুখার্জি', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/hbb5il.webm', duration: '3:41' },
  { id: '21', title: 'মায়ের পায়ের জবা', artist: 'অভিক মুখার্জি', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/9fefj5.webm', duration: '3:31' },
  { id: '22', title: 'মন রে কৃষিকাজ', artist: 'অরিজিৎ চক্রবর্তী', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/mu6tpm.webm', duration: '4:03' },
  { id: '23', title: 'মন তোরে তাই বলি বলি', artist: 'বিভবেন্দু ভট্টাচার্য', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/svrhp5.webm', duration: '5:33' },
  { id: '24', title: 'সদানন্দময়ী কালী', artist: 'অমৃতা দত্ত', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/sn28p5.webm', duration: '4:20' },
  { id: '25', title: 'সকলই তোমারই ইচ্ছা', artist: 'শুভঙ্কর - রামদুলাল নন্দী', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/dkmn3u.webm', duration: '3:00' },
  { id: '26', title: 'শ্যামা মা কি আমার', artist: 'অমৃতা', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/2f9fxp.webm', duration: '4:09' },
  { id: '27', title: 'সুরের প্রেমাঞ্জলী', artist: 'অপরাজিতা চক্রবর্তী', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/u9x41k.webm', duration: '3:59' },
  { id: '28', title: 'হরে কৃষ্ণ হরে কৃষ্ণ কৃষ্ণ কৃষ্ণ হরে হরে হরে রাম হরে রাম রাম রাম হরে হরে', artist: 'চৈতন্য মহাপ্রভু', category: 'মহামন্ত্র', url: 'https://ia903208.us.archive.org/29/items/hare-krishna-hare-rama/Hare%20Krishna%20Hare%20Rama.webm', duration: '15:59' },
  { id: '29', title: 'হরি হরয়ে নমঃ কৃষ্ণ যাদবায় নমঃ', artist: 'সনাতন গোস্বামী', category: 'ভজন', url: 'https://ia903208.us.archive.org/29/items/hare-krishna-hare-rama/Hari%20Haraye%20Namaha%20Krishna.webm', duration: '7:00' },
  { id: '30', title: 'জগন্নাথ স্বামী নয়ন পথগামী ভবতু মে', artist: 'শ্রী জগন্নাথ অষ্টকম্', category: 'ভজন', url: 'https://ia903208.us.archive.org/29/items/hare-krishna-hare-rama/Jagannaath%20Ashtakam.webm', duration: '8:59' },
  { id: '31', title: 'জয়ও জগন্নাথ', artist: 'বাসুদেব ঘোষ', category: 'ভজন', url: 'https://ia803208.us.archive.org/29/items/hare-krishna-hare-rama/Joyo%20Jagannaath.webm', duration: '14:06' },
];

const pdfFiles: PDFFile[] = [
  { id: '1', title: 'দূর্গাপূজা ফর্দ', category: 'পূজা ফর্দ', url: 'https://tinyurl.com/ywj8ejmr', size: '170 KB' },
  { id: '2', title: 'শ্যামাপূজা ফর্দ', category: 'পূজা ফর্দ', url: '#', size: '2.1 MB' },
  { id: '3', title: 'সরস্বতী পূজা ফর্দ', category: 'পূজা ফর্দ', url: '#', size: '1.8 MB' },
  { id: '4', title: 'বিবাহ ফর্দ (কনে পক্ষ)', category: 'বিবাহ', url: '#', size: '3.2 MB' },
  { id: '5', title: 'বিবাহ ফর্দ (বর পক্ষ)', category: 'বিবাহ', url: '#', size: '3.0 MB' },
  { id: '6', title: 'আদ্যশ্রাদ্ধ', category: 'শ্রাদ্ধ', url: '#', size: '1.5 MB' },
  { id: '7', title: 'বাৎসরিক শ্রাদ্ধ', category: 'শ্রাদ্ধ', url: '#', size: '1.7 MB' },
];

const liveChannels: LiveChannel[] = [
  { id: '1', name: 'Sanskar TV', logo: '📺', streamUrl: 'https://d26idhjf0y1p2g.cloudfront.net/out/v1/cd66dd25b9774cb29943bab54bbf3e2f/index.m3u8' },
  { id: '2', name: 'Shubh TV', logo: '🙏', streamUrl: 'https://d2g1vdc6ozl2o8.cloudfront.net/out/v1/0a0dc7d7911b4fddbb4dfc963fdd4b9e/index.m3u8' },
  { id: '3', name: 'Satsang TV', logo: '🪔', streamUrl: 'https://d2vfwvjxwtwq1t.cloudfront.net/out/v1/6b24239d5517495b986e7705490c6e65/index.m3u8' },
  { id: '4', name: 'SVBC 4', logo: '☸️', streamUrl: 'https://d1msejlow1t3l4.cloudfront.net/fta/svbchindi4/chunks.m3u8' },
];

// ============================================
// ডেমো লগইন ডেটা
// ============================================
const DEMO_LOGIN_DATA = {
  normalMembers: [
    { mobile: "01712345678", email: "demo@member.com", password: "demo123", name: "ডেমো মেম্বর" },
    { mobile: "01733118313", email: "tanmoy4bd@gmail.com", password: "admin123", name: "তন্ময় কুমার মানী" },
  ],
  accountsMembers: [
    { mobile: "01812345678", email: "demo@member.com", password: "demo123", name: "ডেমো অ্যাডমিন" },
  ]
};

const GITHUB_LOGIN_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-login.json';

// মেম্বর ইনফরমেশন লিস্ট
const members: Member[] = [
  {
    id: '1',
    name: 'পিনাকী কুন্ডু',
    designation: 'সভাপতি',
    photo: 'https://i.ibb.co.com/0R0mJxmJ/PINAKI.png',
    birthDate: '1970-05-15',
    address: 'নজরপুর, কলম',
    permanentAddress: 'কলম, সিংড়া, নাটোর',
    mobile: '01712345678',
    gotra: '',
    email: 'ram@example.com',
    fatherName: 'ভূপতী কুন্ডু',
    motherName: '',
    occupation: 'ব্যবসায়ী',
    pdfUrl: '/pdfs/members-list-2025.pdf'
  },
  {
    id: '2',
    name: 'শুভ্র জ্যোতি পোদ্দার',
    designation: 'সাধারণ সম্পাদক',
    photo: 'https://i.ibb.co.com/r2WgcXQt/SUVROJOTI-PODDER-2.png',
    birthDate: '1975-08-20',
    address: 'নজরপুর, কলম',
    permanentAddress: 'কলম, সিংড়া, নাটোর',
    mobile: '01576693413',
    gotra: '',
    email: '',
    fatherName: 'আনান্দ পোদ্দার',
    motherName: 'কনা রানী পোদ্দার',
    occupation: 'সরকারী চাকুরী',
    pdfUrl: '/pdfs/members-list-2025.pdf'
  },
];

// প্রয়োজনীয় ফোন নম্বর লিস্ট
const contactPersons: ContactPerson[] = [
  { id: '1', name: 'গৌর', mobile: '01753838412', address: 'রাখালগাছা সিংড়া', occupation: 'ঢাকওয়ালা', pdfUrl: '/pdfs/contact-persons-list.pdf' },
  { id: '2', name: 'আনোয়ার সরদার', mobile: '01757909116', address: 'বড় সাঐল বুদা বাজার', occupation: 'নৌকাওয়ালা', pdfUrl: '/pdfs/contact-persons-list.pdf' },
  { id: '3', name: 'সমর চক্রবর্তি', mobile: '01724982790', address: 'কুমার পাড়া', occupation: 'পুরোহিত', pdfUrl: '/pdfs/contact-persons-list.pdf' },
];

// নিমন্ত্রণ লিস্ট
const invitationLists: InvitationList[] = [
  { id: '1', area: 'হালদার পাড়া', personName: 'রামেশ্বর হালদার', familyCount: 5, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
  { id: '2', area: 'মধ্য পাড়া', personName: 'গোপাল চন্দ্র', familyCount: 4, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
  { id: '3', area: 'ভাটোপাড়া', personName: 'নীলকণ্ঠ ভট্টাচার্য', familyCount: 6, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
  { id: '4', area: 'বাজার পাড়া', personName: 'কালীপদ দাস', familyCount: 3, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
  { id: '5', area: 'পুন্ডরী', personName: 'বিষ্ণু পুন্ডরিক', familyCount: 5, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
  { id: '6', area: 'কুমার পাড়া', personName: 'শ্যাম কুমার', familyCount: 4, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
];

// হিসাব বিবরণী PDF URL
const accountsPDFs = {
  durgaPuja: {
    title: 'দূর্গাপূজা হিসাব',
    years: {
      2024: '/pdfs/accounts/durga-puja-2024.pdf',
      2023: '/pdfs/accounts/durga-puja-2023.pdf',
      2022: '/pdfs/accounts/durga-puja-2022.pdf',
      2021: '/pdfs/accounts/durga-puja-2021.pdf',
      2020: '/pdfs/accounts/durga-puja-2020.pdf',
      2019: '/pdfs/accounts/durga-puja-2019.pdf',
    }
  },
  shyamaPuja: {
    title: 'শ্যামাপূজা হিসাব',
    years: {
      2024: '/pdfs/accounts/shyama-puja-2024.pdf',
      2023: '/pdfs/accounts/shyama-puja-2023.pdf',
      2022: '/pdfs/accounts/shyama-puja-2022.pdf',
      2021: '/pdfs/accounts/shyama-puja-2021.pdf',
      2020: '/pdfs/accounts/shyama-puja-2020.pdf',
      2019: '/pdfs/accounts/shyama-puja-2019.pdf',
    }
  },
  saraswatiPuja: {
    title: 'সরস্বতী পূজা হিসাব',
    years: {
      2024: '/pdfs/accounts/saraswati-puja-2024.pdf',
      2023: '/pdfs/accounts/saraswati-puja-2023.pdf',
      2022: '/pdfs/accounts/saraswati-puja-2022.pdf',
      2021: '/pdfs/accounts/saraswati-puja-2021.pdf',
      2020: '/pdfs/accounts/saraswati-puja-2020.pdf',
      2019: '/pdfs/accounts/saraswati-puja-2019.pdf',
    }
  },
  rathYatra: {
    title: 'রথযাত্রা হিসাব',
    years: {
      2024: '/pdfs/accounts/rath-yatra-2024.pdf',
      2023: '/pdfs/accounts/rath-yatra-2023.pdf',
      2022: '/pdfs/accounts/rath-yatra-2022.pdf',
      2021: '/pdfs/accounts/rath-yatra-2021.pdf',
      2020: '/pdfs/accounts/rath-yatra-2020.pdf',
      2019: '/pdfs/accounts/rath-yatra-2019.pdf',
    }
  }
};

const notices = [
  '🙏 সকলকে দূর্গাপূজার আন্তরিক শুভেচ্ছা! এবারের পূজা ১ অক্টোবর থেকে শুরু হবে 2025।',
  '📢 আগামী ১৫ জানুয়ারি মাসিক সভা সকাল ১০টায়। সকল সদস্যকে উপস্থিত থাকার অনুরোধ 2025।',
  '🎉 সরস্বতী পূজা ২০২৫ এর প্রস্তুতি সভা ২০ জানুয়ারি।',
  '📱 আমাদের ফেসবুক পেজে লাইক দিন এবং সর্বশেষ খবর পেতে ফলো করুন!'
];

// ============================================
// Countdown Hook
// ============================================
function useCountdown(targetDate: string): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

// ============================================
// Components
// ============================================
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
    { path: '/', label: 'হোম', icon: Home },
    { path: '/durga', label: 'দূর্গাপূজা', icon: Calendar },
    { path: '/shyama', label: 'শ্যামাপূজা', icon: Calendar },
    { path: '/saraswati', label: 'সরস্বতী পূজা', icon: Calendar },
    { path: '/rath', label: 'রথযাত্রা', icon: Calendar },
    { path: '/deities', label: 'দেব-দেবী', icon: Users },
    { path: '/gallery', label: 'ফটো গ্যালারি', icon: Image },
    { path: '/music', label: 'ধর্মীয় গান', icon: Music },
    { path: '/pdf', label: 'PDF', icon: FileText },
    { path: '/live', label: 'লাইভ TV', icon: Tv },
    { path: '/contact', label: 'যোগাযোগ', icon: Phone },
    { path: '/login', label: 'মেম্বর লগইন', icon: LogIn },
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
                <p className="text-xs text-gray-600">কলম, সিংড়া, নাটোর, রাজশাহী</p>
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
              কলম, সিংড়া, নাটোর, রাজশাহী, বাংলাদেশ<br />
              স্থাপিত: ২০১৭ সাল
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-sm text-orange-200">
              <li><Link to="/durga" className="hover:text-white">দূর্গাপূজা</Link></li>
              <li><Link to="/shyama" className="hover:text-white">শ্যামাপূজা</Link></li>
              <li><Link to="/saraswati" className="hover:text-white">সরস্বতী পূজা</Link></li>
              <li><Link to="/gallery" className="hover:text-white">ফটো গ্যালারি</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">সোশ্যাল মিডিয়া</h4>
            <div className="flex gap-4">
              <a href="https://facebook.com/KHDS3" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-4 text-xs text-orange-300">
              © ২০২৬ কলম হিন্দু ধর্মসভা। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// Pages
// ============================================
function HomePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600"></div>
        <div className="absolute inset-0 sacred-pattern opacity-30"></div>
        <div className="relative px-6 py-16 text-center text-white">
          <div className="text-6xl mb-4">🕉️</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">কলম হিন্দু ধর্মসভা</h1>
          <p className="text-lg md:text-xl text-orange-100 mb-2">কলম, সিংড়া, নাটোর, রাজশাহী, বাংলাদেশ</p>
          <p className="text-sm text-orange-200">স্থাপিত: ২০১৭ সাল</p>
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
                    {new Date(puja.date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <ChevronRight className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 gradient-text flex items-center gap-2">
          <Clock className="w-6 h-6" />
          সর্বশেষ আপডেট
        </h2>
        <div className="space-y-4">
          {[
            { title: 'দূর্গাপূজা ২০২৫ এর প্রস্তুতি শুরু', date: '২ জানুয়ারি ২০২৫', type: 'নোটিশ' },
            { title: 'নতুন কমিটি গঠন সম্পন্ন', date: '১ জানুয়ারি ২০২৫', type: 'সংবাদ' },
            { title: 'সরস্বতী পূজার তারিখ ঘোষণা', date: '২৮ ডিসেম্বর ২০২৪', type: 'পূজা' },
            { title: 'বার্ষিক সাধারণ সভা অনুষ্ঠিত', date: '২৫ ডিসেম্বর ২০২৪', type: 'সভা' },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-orange-50 transition">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-bold text-xs">
                {item.type}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DurgaPujaPage() {
  const puja = pujaData.find(p => p.id === 'durga')!;
  const schedule = [
    { day: 'মহালয়া', date: '১০ অক্টোবর', event: 'দেবীপক্ষের সূচনা' },
    { day: 'পঞ্চমী', date: '১৬ অক্টোবর', event: 'বিল্বপূজা, অঙ্কুরারোপণ' },
    { day: 'ষষ্ঠী', date: '১৭ অক্টোবর', event: 'দেবীর বোধন, অধিবাস' },
    { day: 'সপ্তমী', date: '১৮ অক্টোবর', event: 'নবপত্রিকা প্রবেশ, সপ্তমী পূজা' },
    { day: 'অষ্টমী', date: '১৯ অক্টোবর', event: 'অষ্টমী পূজা, কুমারী পূজা, সন্ধি পূজা' },
    { day: 'নবমী', date: '২০ অক্টোবর', event: 'নবমী পূজা, মহানবমী ভোগ' },
    { day: 'দশমী', date: '২১ অক্টোবর', event: 'বিজয়া দশমী, দশমী পূজা, প্রতিমা বিসর্জন' },
  ];

  return (
    <div className="space-y-8">
      <div className="relative rounded-2xl overflow-hidden">
        <img src={puja.image} alt={puja.name} className="w-full h-64 md:h-80 object-cover" />
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
            <p className="text-gray-700 leading-relaxed">
              দূর্গাপূজা হলো হিন্দু ধর্মাবলম্বীদের সবচেয়ে বড় উৎসব। দুর্গা মা অসুরদমনী, মহিষাসুরমর্দিনী -
              শক্তির প্রতীক। এই পূজার মাধ্যমে ভক্তরা দেবীর কাছে সকলের মঙ্গল কামনা করেন।
              কলম হিন্দু ধর্মসভা প্রতি বছর এই পূজা উৎসব ধর্মীয় ভাবগাম্ভীর্যের সাথে পালন করে থাকে।
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 gradient-text">সময়সূচি</h2>
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
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4">ফেসবুক পেজ</h3>
            <p className="text-sm text-orange-100 mb-4">আমাদের ফেসবুক পেজে লাইক দিন</p>
            <a href={puja.facebookLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition">
              <Facebook className="w-5 h-5" />
              ফেসবুক পেজ দেখুন
            </a>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold mb-4">পূজা তথ্য</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between"><span className="text-gray-600">পূজার তারিখ:</span><span className="font-medium">{new Date(puja.date).toLocaleDateString('bn-BD')}</span></li>
              <li className="flex justify-between"><span className="text-gray-600">স্থান:</span><span className="font-medium">কলম হিন্দু ধর্মসভা প্রাঙ্গণ</span></li>
              <li className="flex justify-between"><span className="text-gray-600">সময়:</span><span className="font-medium">সকাল ৮টা থেকে রাত ১০টা</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShyamaPujaPage() {
  const puja = pujaData.find(p => p.id === 'shyama')!;
  const schedule = [
    { day: 'অমাবস্যা', date: '৮ নভেম্বর', event: 'এ বছর অমাবস্যা তিথি ৮ নভেম্বর বেলা ১১:২৭ মিনিটে শুরু হয়ে ৯ নভেম্বর বেলা ১২:৩১ মিনিটে শেষ' },
  ];

  return (
    <div className="space-y-8">
      <div className="relative rounded-2xl overflow-hidden">
        <img src={puja.image} alt={puja.name} className="w-full h-64 md:h-80 object-cover" />
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
            <p className="text-gray-700 leading-relaxed">
              শ্যামা পূজা বা কালীপূজা কৃষ্ণ চতুর্দশী তিথিতে অনুষ্ঠিত হয়। শ্যামা মা হলেন কালীর অন্য রূপ,
              কৃষ্ণবর্ণা এই দেবীকে দীপাবলির রাত্রিতে পূজা করা হয়।
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 gradient-text">সময়সূচি</h2>
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-orange-50">
                  <div className="w-20 text-center"><div className="text-sm font-bold text-orange-600">{item.day}</div></div>
                  <div className="flex-1"><div className="font-medium">{item.event}</div><div className="text-sm text-gray-500">{item.date}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4">ফেসবুক পেজ</h3>
            <p className="text-sm text-orange-100 mb-4">আমাদের ফেসবুক পেজে লাইক দিন</p>
            <a href={puja.facebookLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition">
              <Facebook className="w-5 h-5" />ফেসবুক পেজ দেখুন
            </a>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold mb-4">পূজা তথ্য</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between"><span className="text-gray-600">তিথি:</span><span className="font-medium">কার্তিক অমাবস্যা</span></li>
              <li className="flex justify-between"><span className="text-gray-600">পূজার তারিখ:</span><span className="font-medium">{new Date(puja.date).toLocaleDateString('bn-BD')}</span></li>
              <li className="flex justify-between"><span className="text-gray-600">স্থান:</span><span className="font-medium">কলম হিন্দু ধর্মসভা প্রাঙ্গণ</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SaraswatiPujaPage() {
  const puja = pujaData.find(p => p.id === 'saraswati')!;
  const schedule = [
    { day: 'চতুর্থী', date: '২২ জানুয়ারি', event: 'বিকাল ৪টা - মণ্ডপ সাজানো, সন্ধ্যা ৬টা - প্রতিমা স্থাপন' },
    { day: 'পঞ্চমী', date: '২৩ জানুয়ারি', event: 'সকাল ৮টা - পূজা শুরু, সকাল ৯টা - প্রধান পূজা, বেলা ১০টা - হাতে খড়ি ও প্রসাদ বিতরণ' },
    { day: 'ষষ্ঠী', date: '২৪ জানুয়ারি', event: 'সকাল ১১টা - প্রতিমা বিসর্জন' },
  ];

  return (
    <div className="space-y-8">
      <div className="relative rounded-2xl overflow-hidden">
        <img src={puja.image} alt={puja.name} className="w-full h-64 md:h-80 object-cover" />
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
            <p className="text-gray-700 leading-relaxed">
              সরস্বতী পূজা মাঘ মাসের শুক্লা পঞ্চমী তিথিতে অনুষ্ঠিত হয়। সরস্বতী মা বিদ্যাদেবী, বাণীদেবী -
              জ্ঞান, সঙ্গীত, কলা ও বিদ্যার দেবী।
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 gradient-text">সময়সূচি</h2>
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-orange-50">
                  <div className="w-16 text-center"><div className="text-sm font-bold text-orange-600">{item.day}</div></div>
                  <div className="flex-1"><div className="font-medium">{item.event}</div><div className="text-sm text-gray-500">{item.date}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4">ফেসবুক পেজ</h3>
            <p className="text-sm text-orange-100 mb-4">আমাদের ফেসবুক পেজে লাইক দিন</p>
            <a href={puja.facebookLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition">
              <Facebook className="w-5 h-5" />ফেসবুক পেজ দেখুন
            </a>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold mb-4">পূজা তথ্য</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between"><span className="text-gray-600">তিথি:</span><span className="font-medium">মাঘ শুক্লা পঞ্চমী</span></li>
              <li className="flex justify-between"><span className="text-gray-600">পূজার তারিখ:</span><span className="font-medium">{new Date(puja.date).toLocaleDateString('bn-BD')}</span></li>
              <li className="flex justify-between"><span className="text-gray-600">স্থান:</span><span className="font-medium">কলম হিন্দু ধর্মসভা প্রাঙ্গণ</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function RathYatraPage() {
  const puja = pujaData.find(p => p.id === 'rath')!;
  const schedule = [
    { day: 'প্রথম দিন', date: '১৬ জুলাই, বৃহস্পতিবার ', event: 'রথ টানা অভিযাত্রা - বিকাল ৪টা' },
    { day: 'দ্বিতীয় দিন', date: '১৭ জুলাই', event: 'রথ থামা ও পূজা - সকাল ১০টা' },
    { day: 'তৃতীয় দিন', date: '১৮ জুলাই', event: 'রথ থামা ও পূজা - সকাল ১০টা' },
    { day: 'চতুর্থ দিন', date: '১৯ জুলাই', event: 'রথ থামা ও পূজা - সকাল ১০টা' },
    { day: 'পঞ্চম দিন', date: '২০ জুলাই', event: 'রথ থামা ও পূজা - সকাল ১০টা' },
    { day: 'ষষ্ঠ দিন', date: '২১ জুলাই', event: 'রথ থামা ও পূজা - সকাল ১০টা' },
    { day: 'সপ্তম দিন', date: '২২ জুলাই', event: 'রথ থামা ও পূজা - সকাল ১০টা' },
    { day: 'অষ্টম দিন', date: '২৩ জুলাই', event: 'রথ থামা ও পূজা - সকাল ১০টা' },
    { day: 'উল্টো রথ', date: '২৪ জুলাই, শুক্রবার', event: 'উল্টো রথযাত্রা - বিকাল ৪টা' },
  ];

  return (
    <div className="space-y-8">
      <div className="relative rounded-2xl overflow-hidden">
        <img src={puja.image} alt={puja.name} className="w-full h-64 md:h-80 object-cover" />
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
            <p className="text-gray-700 leading-relaxed">
              রথযাত্রা হলো জগন্নাথ দেবের বার্ষিক উৎসব। জগন্নাথ দেব বিশ্বনাথ, পুরীধাম - বিষ্ণুর এক রূপ।
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 gradient-text">সময়সূচি</h2>
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-orange-50">
                  <div className="w-24 text-center"><div className="text-sm font-bold text-orange-600">{item.day}</div></div>
                  <div className="flex-1"><div className="font-medium">{item.event}</div><div className="text-sm text-gray-500">{item.date}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4">ফেসবুক পেজ</h3>
            <p className="text-sm text-orange-100 mb-4">আমাদের ফেসবুক পেজে লাইক দিন</p>
            <a href={puja.facebookLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition">
              <Facebook className="w-5 h-5" />ফেসবুক পেজ দেখুন
            </a>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold mb-4">পূজা তথ্য</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between"><span className="text-gray-600">পূজার তারিখ:</span><span className="font-medium">{new Date(puja.date).toLocaleDateString('bn-BD')}</span></li>
              <li className="flex justify-between"><span className="text-gray-600">উল্টো রথ:</span><span className="font-medium">২৪ জুলাই, শুক্রবার ২০২৬</span></li>
              <li className="flex justify-between"><span className="text-gray-600">স্থান:</span><span className="font-medium">কলম হিন্দু ধর্মসভা প্রাঙ্গণ</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

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
              <img src={deity.image} alt={deity.name} className="w-full h-full object-cover" />
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
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedPuja, setSelectedPuja] = useState<string>('all');
  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];
  const pujaTypes = ['সব', 'দূর্গাপূজা', 'শ্যামাপূজা', 'সরস্বতী পূজা', 'রথযাত্রা'];
  const filteredImages = galleryImages.filter(img => {
    const yearMatch = img.year === selectedYear;
    const pujaMatch = selectedPuja === 'all' || selectedPuja === 'সব' || img.pujaType === selectedPuja;
    return yearMatch && pujaMatch;
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">ফটো গ্যালারি</h1>
        <p className="text-gray-600">২০১৭ থেকে ২০২৬ সাল পর্যন্ত পূজার ছবি</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">সাল নির্বাচন করুন</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none">
              {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">পূজার ধরন</label>
            <select value={selectedPuja} onChange={(e) => setSelectedPuja(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none">
              {pujaTypes.map(type => (<option key={type} value={type}>{type}</option>))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((img) => (
          <div key={img.id} className="card-hover relative group rounded-xl overflow-hidden shadow-lg">
            <img src={img.url} alt={img.title} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="text-sm font-medium">{img.title}</p>
                <p className="text-xs text-gray-300">{img.pujaType}</p>
              </div>
            </div>
            <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
              <Download className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// ফিক্সড মিউজিক পেজ - স্কিপ + অডিও প্লেয়ার
// ============================================
function MusicPage() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const categories = ['সব', 'দূর্গা পূজা স্পেশাল', 'শ্যামা সংগীত', 'ভজন', 'আরতী', 'কীর্তন', 'মহামন্ত্র', 'মন্ত্র'];

  const filteredSongs = selectedCategory === 'all' || selectedCategory === 'সব'
    ? songs
    : songs.filter(s => s.category === selectedCategory);

  // অডিও সেটআপ
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1 >= filteredSongs.length ? 0 : prev + 1;
        const nextSong = filteredSongs[nextIndex];
        if (nextSong && audioRef.current) {
          setCurrentSong(nextSong);
          audioRef.current.src = nextSong.url;
          audioRef.current.load();
          audioRef.current.play().catch(() => setIsPlaying(false));
        }
        return nextIndex;
      });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playSong = (song: Song, index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = song.url;
      audioRef.current.load();
      setCurrentSong(song);
      setCurrentIndex(index);
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSkipBack = () => {
    if (filteredSongs.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);
      return;
    }
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = filteredSongs.length - 1;
    playSong(filteredSongs[newIndex], newIndex);
  };

  const handleSkipForward = () => {
    if (filteredSongs.length === 0) return;
    let newIndex = currentIndex + 1;
    if (newIndex >= filteredSongs.length) newIndex = 0;
    playSong(filteredSongs[newIndex], newIndex);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const bar = e.currentTarget;
    const clickX = e.clientX - bar.getBoundingClientRect().left;
    const barWidth = bar.clientWidth;
    const newTime = (clickX / barWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / duration) * 100);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================
  // ✅ ফিক্সড ডাউনলোড ফাংশন
  // ============================================
  const handleDownload = async (e: React.MouseEvent, song: Song) => {
    // গান বাজানো থেকে আলাদা রাখা
    e.stopPropagation();

    // URL চেক - '#' বা খালি হলে
    if (!song.url || song.url === '#') {
      alert(`"${song.title}" এর ডাউনলোড লিংক এখনো যোগ করা হয়নি।`);
      return;
    }

    // ডাউনলোডিং স্টেট সেট
    setDownloadingId(song.id);

    try {
      // ফাইল ফেচ করো
      const response = await fetch(song.url);
      
      if (!response.ok) {
        throw new Error('ডাউনলোড করতে সমস্যা হয়েছে');
      }

      // ব্লব তৈরি
      const blob = await response.blob();
      
      // ডাউনলোড লিংক তৈরি
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // ফাইলের নাম সেট করো
      const fileName = `${song.title} - ${song.artist}.mp3`;
      link.download = fileName;
      
      // ক্লিক করে ডাউনলোড শুরু
      document.body.appendChild(link);
      link.click();
      
      // ক্লিনআপ
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      // ফেচ ব্যর্থ হলে সরাসরি লিংক দিয়ে চেষ্টা
      try {
        const link = document.createElement('a');
        link.href = song.url;
        link.download = `${song.title} - ${song.artist}.mp3`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        alert('ডাউনলোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।');
      }
    } finally {
      // ডাউনলোডিং স্টেট রিসেট
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">ধর্মীয় গান</h1>
        <p className="text-gray-600">পবিত্র ভজন ও আরতী সংগীত শুনুন</p>
      </div>

      {/* অডিও প্লেয়ার */}
      {currentSong && (
        <div className="rounded-2xl p-6 text-white sticky top-20 z-40 bg-gradient-to-r from-orange-600 to-red-600 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              {isPlaying ? (
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <div className="w-1 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                </div>
              ) : (
                <Music className="w-8 h-8" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{currentSong.title}</h3>
              <p className="text-orange-100 text-sm truncate">{currentSong.artist}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleSkipBack} title="আগের গান"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition active:scale-95">
                <SkipBack className="w-5 h-5" />
              </button>
              <button onClick={togglePlayPause} title={isPlaying ? 'পজ' : 'প্লে'}
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-orange-600 hover:scale-105 transition active:scale-95">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button onClick={handleSkipForward} title="পরের গান"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition active:scale-95">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* প্লেয়ারে ডাউনলোড বাটন */}
            <button 
              onClick={(e) => handleDownload(e, currentSong)} 
              title="এই গান ডাউনলোড করুন"
              className="hidden sm:flex w-10 h-10 bg-white/20 rounded-full items-center justify-center hover:bg-white/30 transition active:scale-95"
            >
              {downloadingId === currentSong.id ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>

            <div className="hidden md:flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              <input type="range" min="0" max="1" step="0.01" value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:rounded-full" />
            </div>
          </div>

          {/* প্রগ্রেস বার */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-orange-200 w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer group" onClick={handleProgressClick}>
              <div className="h-full bg-white rounded-full relative transition-all duration-100" style={{ width: `${progress}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
            <span className="text-xs text-orange-200 w-10">{formatTime(duration)}</span>
          </div>
          <div className="mt-2 text-center text-xs text-orange-200">
            গান {currentIndex + 1} / {filteredSongs.length}
          </div>
        </div>
      )}

      {/* ক্যাটাগরি ফিল্টার */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={cn("px-4 py-2 rounded-full text-sm font-medium transition",
              selectedCategory === cat ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-orange-50")}>
            {cat}
          </button>
        ))}
      </div>

      {/* গানের লিস্ট */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSongs.map((song, index) => (
          <div key={song.id} onClick={() => playSong(song, index)}
            className={cn("card-hover bg-white rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all",
              currentSong?.id === song.id && "ring-2 ring-orange-500 bg-orange-50")}>
            
            {/* গানের আইকন */}
            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center transition-all",
              currentSong?.id === song.id && isPlaying
                ? "bg-gradient-to-br from-orange-500 to-red-500"
                : "bg-gradient-to-br from-orange-100 to-orange-200")}>
              {currentSong?.id === song.id && isPlaying ? (
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <div className="w-1 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                </div>
              ) : (
                <Music className="w-6 h-6 text-orange-600" />
              )}
            </div>

            {/* গানের তথ্য */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{song.title}</h4>
              <p className="text-sm text-gray-500 truncate">{song.artist} • {song.category}</p>
            </div>

            {/* ডিউরেশন ও ডাউনলোড */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{song.duration}</span>
              
              {/* ✅ ফিক্সড ডাউনলোড বাটন */}
              <button 
                onClick={(e) => handleDownload(e, song)}
                disabled={downloadingId === song.id}
                title={`"${song.title}" ডাউনলোড করুন`}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition",
                  downloadingId === song.id
                    ? "bg-green-100 text-green-600 cursor-wait"
                    : "bg-orange-100 text-orange-600 hover:bg-orange-200 active:scale-95"
                )}
              >
                {downloadingId === song.id ? (
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">এই ক্যাটাগরিতে কোনো গান পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
}
function PDFPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['সব', 'পূজা ফর্দ', 'বিবাহ', 'শ্রাদ্ধ'];
  const filteredFiles = selectedCategory === 'all' || selectedCategory === 'সব'
    ? pdfFiles : pdfFiles.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">PDF ডাউনলোড</h1>
        <p className="text-gray-600">প্রয়োজনীয় সকল ফাইল ডাউনলোড করুন</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={cn("px-4 py-2 rounded-full text-sm font-medium transition",
              selectedCategory === cat ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-orange-50")}>
            {cat}
          </button>
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
            <a href={file.url} download
              className="flex items-center justify-center gap-2 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
              <Download className="w-4 h-4" />ডাউনলোড
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveTVPage() {
  const [activeChannel, setActiveChannel] = useState<LiveChannel>(liveChannels[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ============================================
  // HLS স্ট্রিম লোড করা
  // ============================================
  useEffect(() => {
    const loadStream = async () => {
      const video = videoRef.current;
      if (!video) return;

      // আগের স্ট্রিম বন্ধ করো
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');

      const streamUrl = activeChannel.streamUrl;

      // চেক করো URL আছে কিনা
      if (!streamUrl || streamUrl === '#') {
        setHasError(true);
        setErrorMessage('এই চ্যানেলের স্ট্রিম URL পাওয়া যায়নি');
        setIsLoading(false);
        return;
      }

      try {
        // HLS.js ডায়নামিক ইম্পোর্ট
        const Hls = (await import('hls.js')).default;

        if (Hls.isSupported()) {
          // HLS.js সাপোর্ট করলে
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            startLevel: -1, // অটো কোয়ালিটি
            debug: false,
          });

          hlsRef.current = hls;

          hls.loadSource(streamUrl);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false);
            setHasError(false);
            video.play().catch(() => {
              // অটোপ্লে ব্লক হলে মিউটেড প্লে
              video.muted = true;
              setIsMuted(true);
              video.play().catch(() => {});
            });
          });

          hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  setErrorMessage('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করা হচ্ছে...');
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  setErrorMessage('মিডিয়া এরর। রিকভার করা হচ্ছে...');
                  hls.recoverMediaError();
                  break;
                default:
                  setHasError(true);
                  setErrorMessage('এই চ্যানেলটি এখন চলছে না। অন্য চ্যানেল ট্রাই করুন।');
                  setIsLoading(false);
                  hls.destroy();
                  break;
              }
            }
          });

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari/iOS - নেটিভ HLS সাপোর্ট
          video.src = streamUrl;
          video.addEventListener('loadedmetadata', () => {
            setIsLoading(false);
            video.play().catch(() => {
              video.muted = true;
              setIsMuted(true);
              video.play().catch(() => {});
            });
          });
          video.addEventListener('error', () => {
            setHasError(true);
            setErrorMessage('চ্যানেল লোড করতে সমস্যা হয়েছে।');
            setIsLoading(false);
          });
        } else {
          setHasError(true);
          setErrorMessage('আপনার ব্রাউজার HLS স্ট্রিমিং সাপোর্ট করে না।');
          setIsLoading(false);
        }
      } catch (error) {
        setHasError(true);
        setErrorMessage('প্লেয়ার লোড করতে সমস্যা হয়েছে।');
        setIsLoading(false);
      }
    };

    loadStream();

    // ক্লিনআপ
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeChannel]);

  // ভলিউম আপডেট
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // ============================================
  // কন্ট্রোল ফাংশন
  // ============================================
  const handleRetry = () => {
    // রিলোড করো
    const currentChannel = activeChannel;
    setActiveChannel({ ...currentChannel });
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleChannelChange = (channel: LiveChannel) => {
    if (channel.id === activeChannel.id) return;
    setActiveChannel(channel);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">লাইভ TV</h1>
        <p className="text-gray-600">ধর্মীয় চ্যানেল লাইভ দেখুন</p>
      </div>

      {/* ভিডিও প্লেয়ার */}
      <div 
        ref={containerRef}
        className="bg-black rounded-2xl overflow-hidden relative group"
      >
        {/* ভিডিও এলিমেন্ট */}
        <div className="aspect-video relative">
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            playsInline
            autoPlay
          />

          {/* লোডিং স্পিনার */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium">{activeChannel.name}</p>
                <p className="text-sm text-gray-400 mt-2">লোড হচ্ছে, অপেক্ষা করুন...</p>
              </div>
            </div>
          )}

          {/* এরর মেসেজ */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90">
              <div className="text-center text-white max-w-md px-6">
                <div className="text-5xl mb-4">📡</div>
                <p className="text-lg font-medium mb-2">চ্যানেল পাওয়া যাচ্ছে না</p>
                <p className="text-sm text-gray-400 mb-6">{errorMessage}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleRetry}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition active:scale-95"
                  >
                    🔄 আবার চেষ্টা করুন
                  </button>
                  <button
                    onClick={() => {
                      const nextIndex = liveChannels.findIndex(c => c.id === activeChannel.id) + 1;
                      if (nextIndex < liveChannels.length) {
                        handleChannelChange(liveChannels[nextIndex]);
                      } else {
                        handleChannelChange(liveChannels[0]);
                      }
                    }}
                    className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition active:scale-95"
                  >
                    ⏭️ পরের চ্যানেল
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* চ্যানেল নাম ওভারলে */}
          {!isLoading && !hasError && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE • {activeChannel.name}
            </div>
          )}

          {/* কন্ট্রোল বার */}
          {!isLoading && !hasError && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* মিউট/আনমিউট */}
                  <button
                    onClick={handleMuteToggle}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
                    title={isMuted ? 'আনমিউট' : 'মিউট'}
                  >
                    {isMuted ? (
                      <span className="text-lg">🔇</span>
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>

                  {/* ভলিউম স্লাইডার */}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setVolume(val);
                      if (val > 0) setIsMuted(false);
                    }}
                    className="w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:rounded-full"
                  />

                  {/* চ্যানেল নাম */}
                  <span className="text-white text-sm ml-2">
                    {activeChannel.logo} {activeChannel.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* রিফ্রেশ */}
                  <button
                    onClick={handleRetry}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
                    title="রিফ্রেশ"
                  >
                    🔄
                  </button>

                  {/* ফুলস্ক্রিন */}
                  <button
                    onClick={handleFullscreen}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
                    title="ফুলস্ক্রিন"
                  >
                    {isFullscreen ? '⬜' : '⛶'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* চ্যানেল সিলেক্টর */}
      <div>
        <h3 className="text-lg font-bold mb-4">চ্যানেল সিলেক্ট করুন</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {liveChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => handleChannelChange(channel)}
              className={cn(
                "relative p-4 rounded-xl text-center transition-all active:scale-95",
                activeChannel.id === channel.id
                  ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200"
                  : "bg-white hover:bg-orange-50 hover:shadow-md"
              )}
            >
              {/* লাইভ ইন্ডিকেটর */}
              {activeChannel.id === channel.id && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs font-bold">LIVE</span>
                </div>
              )}
              <div className="text-3xl mb-2">{channel.logo}</div>
              <p className="font-medium text-sm">{channel.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* কাস্টম চ্যানেল URL */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4 gradient-text">কাস্টম চ্যানেল যোগ করুন</h3>
        <p className="text-sm text-gray-500 mb-4">
          m3u8 বা m3u স্ট্রিমিং URL দিয়ে যেকোনো চ্যানেল দেখুন
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="m3u8 URL পেস্ট করুন..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                const url = input.value.trim();
                if (url) {
                  setActiveChannel({
                    id: 'custom',
                    name: 'কাস্টম চ্যানেল',
                    logo: '📡',
                    streamUrl: url
                  });
                  input.value = '';
                }
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder*="m3u8"]') as HTMLInputElement;
              if (input && input.value.trim()) {
                setActiveChannel({
                  id: 'custom',
                  name: 'কাস্টম চ্যানেল',
                  logo: '📡',
                  streamUrl: input.value.trim()
                });
                input.value = '';
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:opacity-90 transition active:scale-95"
          >
            ▶ চালান
          </button>
        </div>
      </div>

      {/* সাহায্য */}
      <div className="bg-orange-50 rounded-2xl p-6">
        <h3 className="font-bold mb-3">❓ চ্যানেল না চললে কী করবেন?</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">১.</span>
            <span>"আবার চেষ্টা করুন" বাটনে ক্লিক করুন</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">২.</span>
            <span>অন্য চ্যানেল সিলেক্ট করে দেখুন</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">৩.</span>
            <span>ইন্টারনেট সংযোগ চেক করুন</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">৪.</span>
            <span>VPN চালু থাকলে বন্ধ করে দেখুন</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">৫.</span>
            <span>Chrome বা Firefox ব্রাউজার ব্যবহার করুন</span>
          </li>
        </ul>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 gradient-text">যোগাযোগের ঠিকানা</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">📍</div>
              <div><p className="font-medium">ঠিকানা</p><p className="text-gray-600 text-sm">কলম, সিংড়া, নাটোর, রাজশাহী, বাংলাদেশ</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">📞</div>
              <div><p className="font-medium">ফোন</p><p className="text-gray-600 text-sm">০১৭৩৩১১৮৩১৩</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">✉️</div>
              <div><p className="font-medium">ইমেইল</p><p className="text-gray-600 text-sm">durgapuja12@gmail.com</p></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 gradient-text">সোশ্যাল মিডিয়া</h3>
          <div className="space-y-4">
            <a href="https://facebook.com/KHDS3" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition">
              <Facebook className="w-8 h-8 text-blue-600" />
              <div><p className="font-medium">ফেসবুক পেজ</p><p className="text-sm text-gray-600">@KHDS3</p></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ফিক্সড লগইন পেজ - ভ্যালিডেশন সহ
// ============================================
function LoginPage() {
  const [loginType, setLoginType] = useState<'general' | 'accounts'>('general');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'members' | 'contacts' | 'invitation' | 'accounts'>('members');

  // ফর্ম ইনপুট স্টেট
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // এরর ও লোডিং স্টেট
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // GitHub থেকে লোড করা লগইন ডেটা
  const [loginData, setLoginData] = useState(DEMO_LOGIN_DATA);
  const [dataSource, setDataSource] = useState<'local' | 'github'>('local');

  // সিলেক্টেড মেম্বর/কন্টাক্ট
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactPerson | null>(null);

  // ============================================
  // GitHub থেকে লগইন ডেটা লোড করা
  // ============================================
  useEffect(() => {
    const fetchLoginData = async () => {
      try {
        const response = await fetch(GITHUB_LOGIN_URL, {
          cache: 'no-cache', // সবসময় নতুন ডেটা আনবে
        });

        if (!response.ok) {
          throw new Error('GitHub থেকে ডেটা লোড করতে ব্যর্থ');
        }

        const data = await response.json();

        // ডেটা ভ্যালিডেশন
        if (data.normalMembers && Array.isArray(data.normalMembers) &&
            data.accountsMembers && Array.isArray(data.accountsMembers)) {
          setLoginData(data);
          setDataSource('github');
          console.log('✅ GitHub থেকে লগইন ডেটা লোড হয়েছে');
          console.log(`📊 সাধারণ সদস্য: ${data.normalMembers.length} জন`);
          console.log(`📊 হিসাব সদস্য: ${data.accountsMembers.length} জন`);
        } else {
          throw new Error('ডেটা ফরম্যাট সঠিক নয়');
        }
      } catch (error) {
        console.log('⚠️ GitHub থেকে লোড ব্যর্থ, লোকাল ডেটা ব্যবহার হচ্ছে:', error);
        setLoginData(DEMO_LOGIN_DATA);
        setDataSource('local');
      }
    };

    fetchLoginData();
  }, []);

  // ============================================
  // লগইন ভ্যালিডেশন ফাংশন
  // ============================================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // ১. খালি ফিল্ড চেক
    if (!usernameInput.trim()) {
      setLoginError('মোবাইল নম্বর বা ইমেইল দিন');
      return;
    }
    if (!passwordInput.trim()) {
      setLoginError('পাসওয়ার্ড দিন');
      return;
    }

    // ২. মোবাইল নম্বর ভ্যালিডেশন
    const isMobile = /^[0-9]+$/.test(usernameInput.trim());
    if (isMobile && usernameInput.trim().length !== 11) {
      setLoginError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }

    // ৩. ইমেইল ভ্যালিডেশন
    const isEmail = usernameInput.includes('@');
    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameInput.trim())) {
      setLoginError('সঠিক ইমেইল ঠিকানা দিন');
      return;
    }

    // ৪. পাসওয়ার্ড দৈর্ঘ্য চেক
    if (passwordInput.trim().length < 4) {
      setLoginError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে');
      return;
    }

    // ৫. লগইন ডেটা থেকে মিলান
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUsername = usernameInput.trim().toLowerCase();
      const trimmedPassword = passwordInput.trim();

      let foundUser: { mobile: string; email: string; password: string; name: string } | undefined;

      if (loginType === 'general') {
        // সাধারণ সদস্য চেক
        foundUser = loginData.normalMembers.find(
          member =>
            (member.mobile === trimmedUsername || member.email.toLowerCase() === trimmedUsername) &&
            member.password === trimmedPassword
        );
      } else {
        // হিসাব দেখা চেক
        foundUser = loginData.accountsMembers.find(
          member =>
            (member.mobile === trimmedUsername || member.email.toLowerCase() === trimmedUsername) &&
            member.password === trimmedPassword
        );

        // হিসাব দেখায় না পেলে সাধারণ সদস্যেও চেক
        if (!foundUser) {
          foundUser = loginData.normalMembers.find(
            member =>
              (member.mobile === trimmedUsername || member.email.toLowerCase() === trimmedUsername) &&
              member.password === trimmedPassword
          );
          if (foundUser) {
            setLoginError('আপনার হিসাব দেখার অনুমোদন নেই। সাধারণ সদস্য হিসেবে লগইন করুন।');
            setIsLoading(false);
            return;
          }
        }
      }

      if (foundUser) {
        setIsLoggedIn(true);
        setLoggedInUser(foundUser.name);
        setLoginError('');
        setUsernameInput('');
        setPasswordInput('');
      } else {
        setLoginError('ভুল মোবাইল/ইমেইল অথবা পাসওয়ার্ড। আবার চেষ্টা করুন।');
      }

      setIsLoading(false);
    }, 800);
  };

  // ============================================
  // লগইন ফর্ম
  // ============================================
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">মেম্বর লগইন</h1>
          <p className="text-gray-600">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {/* ডেটা সোর্স ইন্ডিকেটর */}
          <div className={cn(
            "mb-4 px-3 py-2 rounded-lg text-xs flex items-center gap-2",
            dataSource === 'github' 
              ? "bg-green-50 text-green-600" 
              : "bg-yellow-50 text-yellow-600"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              dataSource === 'github' ? "bg-green-500" : "bg-yellow-500"
            )} />
            {dataSource === 'github' 
              ? `✓ GitHub থেকে ${loginData.normalMembers.length + loginData.accountsMembers.length} জন সদস্যের ডেটা লোড হয়েছে` 
              : '⚠ লোকাল ডেটা ব্যবহার হচ্ছে (GitHub কানেক্ট হয়নি)'}
          </div>

          {/* লগইন টাইপ সিলেক্টর */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setLoginType('general'); setLoginError(''); }}
              className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition",
                loginType === 'general' ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700")}>
              সাধারণ সদস্য
            </button>
            <button
              onClick={() => { setLoginType('accounts'); setLoginError(''); }}
              className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition",
                loginType === 'accounts' ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700")}>
              হিসাব দেখুন
            </button>
          </div>

          {/* এরর মেসেজ */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{loginError}</p>
            </div>
          )}

          {/* লগইন ফর্ম */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                মোবাইল নম্বর / ইমেইল <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => { setUsernameInput(e.target.value); setLoginError(''); }}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition",
                    loginError && !usernameInput.trim()
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  )}
                  placeholder="মোবাইল নম্বর বা ইমেইল দিন"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পাসওয়ার্ড <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setLoginError(''); }}
                  className={cn(
                    "w-full pl-10 pr-10 py-3 rounded-xl border outline-none transition",
                    loginError && !passwordInput.trim()
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  )}
                  placeholder="পাসওয়ার্ড দিন"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className={cn(
                "w-full py-3 rounded-xl font-medium transition flex items-center justify-center gap-2",
                isLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90"
              )}>
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

          {/* লগইন তথ্য */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-center text-sm text-blue-700">
              {loginType === 'general'
                ? '✓ সকল বিভাগ দেখতে পারবেন'
                : '✓ সকল বিভাগ দেখতে পারবেন হিসাব বিবরণ সহ'}
            </p>
          </div>

          {/* ডেমো লগইন তথ্য */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-bold text-yellow-700 mb-2">🔑 নিবন্ধন এর জন্য যোগাযোগ করুন: 01733118313 । 01612118313 </p>
           </div>
        </div>

        {/* ব্যবহার বিধি */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />ব্যবহার বিধি
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><span className="text-orange-500">১.</span><span>মোবাইল নম্বর বা ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন</span></li>
            <li className="flex items-start gap-2"><span className="text-orange-500">২.</span><span>মেম্বর ইনফরমেশন, প্রয়োজনীয় ফোন নম্বর, নিমন্ত্রণ লিস্ট দেখুন</span></li>
            <li className="flex items-start gap-2"><span className="text-orange-500">৩.</span><span>প্রতিটি লিস্টের জন্য একটি PDF ডাউনলোড করতে পারবেন</span></li>
            <li className="flex items-start gap-2"><span className="text-orange-500">৪.</span><span>হিসাব বিবরণ শুধু "হিসাব দেখুন" লগইনে দেখা যাবে</span></li>
          </ul>
        </div>
      </div>
    );
  }

  // ============================================
  // লগইনের পর ড্যাশবোর্ড (আগের মতোই)
  // ============================================
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">সদস্য এলাকা</h1>
          <p className="text-sm text-gray-500">
            স্বাগতম, <span className="font-bold text-orange-600">{loggedInUser}</span> •
            {loginType === 'general' ? ' সাধারণ সদস্য' : ' হিসাব দেখা অনুমোদিত'}
          </p>
        </div>
        <button onClick={() => { setIsLoggedIn(false); setLoggedInUser(''); setUsernameInput(''); setPasswordInput(''); }}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition">
          লগআউট
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg">✓</div>
        <div>
          <p className="font-medium text-green-700">সফলভাবে লগইন হয়েছে!</p>
          <p className="text-sm text-green-600">
            ডেটা সোর্স: {dataSource === 'github' ? '🌐 GitHub (অনলাইন)' : '💾 লোকাল (অফলাইন)'}
          </p>
        </div>
      </div>

      {/* ট্যাব নেভিগেশন */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'members', label: 'মেম্বর ইনফরমেশন', icon: Users },
          { id: 'contacts', label: 'প্রয়োজনীয় ফোন নম্বর', icon: Phone },
          { id: 'invitation', label: 'নিমন্ত্রণ লিস্ট', icon: FileText },
          ...(loginType === 'accounts' ? [{ id: 'accounts', label: 'হিসাব বিবরণী', icon: FileText }] : []),
        ].map((tab) => (
          <button key={tab.id}
            onClick={() => { setActiveTab(tab.id as typeof activeTab); setSelectedMember(null); setSelectedContact(null); }}
            className={cn("px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2",
              activeTab === tab.id ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-orange-50")}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {/* মেম্বর ইনফরমেশন ট্যাব */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white flex items-center justify-between">
            <div><h3 className="font-bold">সম্পূর্ণ মেম্বর লিস্ট</h3><p className="text-sm text-orange-100">সকল সদস্যের তথ্য একটি PDF এ</p></div>
            <a href="/pdfs/members-list-2025.pdf" download
              className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition">
              <Download className="w-4 h-4" />PDF ডাউনলোড
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <div key={member.id}
                onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
                className={cn("bg-white rounded-xl p-4 shadow-lg cursor-pointer transition-all",
                  selectedMember?.id === member.id ? "ring-2 ring-orange-500" : "hover:shadow-xl")}>
                <div className="flex items-center gap-4">
                  <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-orange-600 text-sm">{member.designation}</p>
                    <p className="text-gray-500 text-sm">{member.mobile}</p>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 text-gray-400 transition-transform",
                    selectedMember?.id === member.id && "rotate-90")} />
                </div>
                {selectedMember?.id === member.id && (
                  <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="text-gray-500">পিতা:</span> {member.fatherName}</p>
                      <p><span className="text-gray-500">মাতা:</span> {member.motherName}</p>
                      <p><span className="text-gray-500">জন্ম তারিখ:</span> {member.birthDate}</p>
                      <p><span className="text-gray-500">গোত্র:</span> {member.gotra}</p>
                      <p><span className="text-gray-500">পেশা:</span> {member.occupation}</p>
                      <p><span className="text-gray-500">ইমেইল:</span> {member.email}</p>
                    </div>
                    <p><span className="text-gray-500">বর্তমান ঠিকানা:</span> {member.address}</p>
                    <p><span className="text-gray-500">স্থায়ী ঠিকানা:</span> {member.permanentAddress}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* প্রয়োজনীয় ফোন নম্বর ট্যাব */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white flex items-center justify-between">
            <div><h3 className="font-bold">সম্পূর্ণ কন্টাক্ট লিস্ট</h3><p className="text-sm text-orange-100">সকলের তথ্য</p></div>
            <a href="/pdfs/contact-persons-list.pdf" download
              className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition">
              <Download className="w-4 h-4" />PDF ডাউনলোড
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactPersons.map((person) => (
              <div key={person.id}
                onClick={() => setSelectedContact(selectedContact?.id === person.id ? null : person)}
                className={cn("bg-white rounded-xl p-4 shadow-lg cursor-pointer transition-all",
                  selectedContact?.id === person.id ? "ring-2 ring-orange-500" : "hover:shadow-xl")}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                    <User className="w-7 h-7 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{person.name}</h3>
                    <p className="text-orange-600 text-sm">{person.occupation}</p>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 text-gray-400 transition-transform",
                    selectedContact?.id === person.id && "rotate-90")} />
                </div>
                {selectedContact?.id === person.id && (
                  <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                    <p><span className="text-gray-500">মোবাইল:</span> {person.mobile}</p>
                    <p><span className="text-gray-500">ঠিকানা:</span> {person.address}</p>
                    <p><span className="text-gray-500">পেশা:</span> {person.occupation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* নিমন্ত্রণ লিস্ট ট্যাব */}
      {activeTab === 'invitation' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white flex items-center justify-between">
            <div><h3 className="font-bold">সম্পূর্ণ নিমন্ত্রণ লিস্ট</h3><p className="text-sm text-orange-100">সকল পাড়ার তালিকা</p></div>
            <a href="/pdfs/invitation-list-all-areas.pdf" download
              className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition">
              <Download className="w-4 h-4" />PDF ডাউনলোড
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { area: 'হালদার পাড়া', count: 12 },
              { area: 'মধ্য পাড়া', count: 8 },
              { area: 'ভাটোপাড়া', count: 15 },
              { area: 'বাজার পাড়া', count: 10 },
              { area: 'পুন্ডরী', count: 7 },
              { area: 'কুমার পাড়া', count: 9 },
              { area: 'শীল পাড়া', count: 11 },
              { area: 'জগৎপুর/কামার পাড়া', count: 6 },
            ].map((area) => (
              <div key={area.area} className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-bold">{area.area}</h3><p className="text-sm text-gray-500">{area.count}টি পরিবার</p></div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold">{area.count}</div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <table className="w-full text-sm">
                    <thead><tr className="text-gray-500 text-xs"><th className="text-left py-1">নাম</th><th className="text-right py-1">সদস্য</th></tr></thead>
                    <tbody>
                      {invitationLists.filter(i => i.area === area.area).map((item) => (
                        <tr key={item.id} className="border-t"><td className="py-2">{item.personName}</td><td className="text-right py-2">{item.familyCount} জন</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* হিসাব বিবরণী ট্যাব */}
      {activeTab === 'accounts' && loginType === 'accounts' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-700 text-sm">✓ আপনি হিসাব বিবরণী দেখার অনুমোদন পেয়েছেন।</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(accountsPDFs).map(([key, data]) => (
              <div key={key} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-lg mb-4">{data.title}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(data.years).map(([year, url]) => (
                    <a key={year} href={url} download
                      className="flex items-center justify-center gap-2 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition">
                      <FileText className="w-4 h-4 text-orange-600" /><span className="text-sm font-medium">{year}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Main App
// ============================================
function App() {
  return (
    <Router>
      <div className="min-h-screen sacred-pattern">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/durga" element={<DurgaPujaPage />} />
            <Route path="/shyama" element={<ShyamaPujaPage />} />
            <Route path="/saraswati" element={<SaraswatiPujaPage />} />
            <Route path="/rath" element={<RathYatraPage />} />
            <Route path="/deities" element={<DeitiesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/pdf" element={<PDFPage />} />
            <Route path="/live" element={<LiveTVPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
