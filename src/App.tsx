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
  { id: '12', title: 'বল মা আমি দাঁড়াই কোথা', artist: 'গুরুজিৎ সিং', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/q9of4f.webm', duration: '4:48' },
  { id: '13', title: 'ডাক দেখি মন', artist: 'অর্পণা চক্রবর্তী', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/xpxdq7.webm', duration: '3:16' },
  { id: '14', title: 'দোষ কারো নয় গো', artist: 'সৃজন চ্যাটার্জী', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/0gsfj5.webm', duration: '4:45' },
  { id: '15', title: 'ডুব দে রে মন কালী বলে', artist: 'অর্পিতা দে', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/03wm3l.webm', duration: '5:58' },
  { id: '16', title: 'একবার নাচো মা', artist: 'কালিকাপ্রসাদ', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/kmiive.webm', duration: '5:39' },
  { id: '17', title: 'কালী কালী বল রসনা', artist: 'সোহিনী মুখার্জি', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/6sktoa.webm', duration: '4:46' },
  { id: '18', title: 'কালো মেয়ের পায়ের তলায়', artist: 'শুভঙ্কর', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/bms14y.webm', duration: '4:31' },
  { id: '19', title: 'মা গো তোর কৃপা', artist: 'সৌরভ মুখার্জি', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/ybmbw2.webm', duration: '5:06' },
  { id: '20', title: 'মায়ের মূর্তি গড়াতে চাই', artist: 'সোহিনী মুখার্জি', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/hbb5il.webm', duration: '3:41' },
  { id: '21', title: 'মায়ের পায়ের জবা', artist: 'অভিক মুখার্জি', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/9fefj5.webm', duration: '3:31' },
  { id: '22', title: 'মন রে কৃষিকাজ', artist: 'অরিজিৎ চক্রবর্তী', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/mu6tpm.webm', duration: '4:03' },
  { id: '23', title: 'মন তোরে তাই বলি বলি', artist: 'বিভবেন্দু ভট্টাচার্য', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/svrhp5.webm', duration: '5:33' },
  { id: '24', title: 'সদানন্দময়ী কালী', artist: 'অমৃতা দত্ত', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/sn28p5.webm', duration: '4:20' },
  { id: '25', title: 'সকলই তোমারই ইচ্ছা', artist: 'শুভঙ্কর - রামদুলাল নন্দী', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/dkmn3u.webm', duration: '3:00' },
  { id: '26', title: 'শ্যামা মা কি আমার', artist: 'অমৃতা', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/2f9fxp.webm', duration: '4:09' },
  { id: '27', title: 'সুরের প্রেমাঞ্জলী', artist: 'অপরাজিতা চক্রবর্তী', category: 'শ্যামা সংগীত', url: 'https://files.catbox.moe/u9x41k.webm', duration: '3:59' },
  { id: '28', title: 'হরে কৃষ্ণ হরে কৃষ্ণ', artist: 'চৈতন্য মহাপ্রভু', category: 'মহামন্ত্র', url: 'https://ia903208.us.archive.org/29/items/hare-krishna-hare-rama/Hare%20Krishna%20Hare%20Rama.webm', duration: '15:59' },
  { id: '29', title: 'হরি হরয়ে নমঃ কৃষ্ণ', artist: 'সনাতন গোস্বামী', category: 'ভজন', url: 'https://ia903208.us.archive.org/29/items/hare-krishna-hare-rama/Hari%20Haraye%20Namaha%20Krishna.webm', duration: '7:00' },
  { id: '30', title: 'জগন্নাথ স্বামী নয়ন পথগামী', artist: 'শ্রী জগন্নাথ অষ্টকম্', category: 'ভজন', url: 'https://ia903208.us.archive.org/29/items/hare-krishna-hare-rama/Jagannaath%20Ashtakam.webm', duration: '8:59' },
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

const contactPersons: ContactPerson[] = [
  { id: '1', name: 'গৌর', mobile: '01753838412', address: 'রাখালগাছা সিংড়া', occupation: 'ঢাকওয়ালা', pdfUrl: '/pdfs/contact-persons-list.pdf' },
  { id: '2', name: 'আনোয়ার সরদার', mobile: '01757909116', address: 'বড় সাঐল বুদা বাজার', occupation: 'নৌকাওয়ালা', pdfUrl: '/pdfs/contact-persons-list.pdf' },
  { id: '3', name: 'সমর চক্রবর্তি', mobile: '01724982790', address: 'কুমার পাড়া', occupation: 'পুরোহিত', pdfUrl: '/pdfs/contact-persons-list.pdf' },
];

const invitationLists: InvitationList[] = [
  { id: '1', area: 'হালদার পাড়া', personName: 'রামেশ্বর হালদার', familyCount: 5, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
  { id: '2', area: 'মধ্য পাড়া', personName: 'গোপাল চন্দ্র', familyCount: 4, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
  { id: '3', area: 'ভাটোপাড়া', personName: 'নীলকণ্ঠ ভট্টাচার্য', familyCount: 6, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
  { id: '4', area: 'বাজার পাড়া', personName: 'কালীপদ দাস', familyCount: 3, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
  { id: '5', area: 'পুন্ডরী', personName: 'বিষ্ণু পুন্ডরিক', familyCount: 5, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
  { id: '6', area: 'কুমার পাড়া', personName: 'শ্যাম কুমার', familyCount: 4, pdfUrl: '/pdfs/invitation-list-all-areas.pdf' },
];

const accountsPDFs = {
  durgaPuja: {
    title: 'দূর্গাপূজা হিসাব',
    years: {
      2024: '/pdfs/accounts/durga-puja-2024.pdf',
      2023: '/pdfs/accounts/durga-puja-2023.pdf',
      2022: '/pdfs/accounts/durga-puja-2022.pdf',
    }
  },
  shyamaPuja: {
    title: 'শ্যামাপূজা হিসাব',
    years: {
      2024: '/pdfs/accounts/shyama-puja-2024.pdf',
      2023: '/pdfs/accounts/shyama-puja-2023.pdf',
    }
  },
  saraswatiPuja: {
    title: 'সরস্বতী পূজা হিসাব',
    years: {
      2024: '/pdfs/accounts/saraswati-puja-2024.pdf',
      2023: '/pdfs/accounts/saraswati-puja-2023.pdf',
    }
  },
  rathYatra: {
    title: 'রথযাত্রা হিসাব',
    years: {
      2024: '/pdfs/accounts/rath-yatra-2024.pdf',
      2023: '/pdfs/accounts/rath-yatra-2023.pdf',
    }
  }
};

const notices = [
  '🙏 সকলকে দূর্গাপূজার আন্তরিক শুভেচ্ছা!',
  '📢 আগামী ১৫ জানুয়ারি মাসিক সভা সকাল ১০টায়।',
  '🎉 সরস্বতী পূজা ২০২৫ এর প্রস্তুতি সভা ২০ জানুয়ারি।',
  '📱 আমাদের ফেসবুক পেজে লাইক দিন!'
];

// Hooks
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
              <li><Link to="/gallery" className="hover:text-white">ফটো গ্যালারি</Link></li>
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

// Pages
function HomePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600"></div>
        <div className="absolute inset-0 sacred-pattern opacity-30"></div>
        <div className="relative px-6 py-16 text-center text-white">
          <div className="text-6xl mb-4">🕉️</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">কলম হিন্দু ধর্মসভা</h1>
          <p className="text-lg md:text-xl text-orange-100 mb-2">কলম, সিংড়া, নাটোর, রাজশাহী</p>
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
                    {new Date(puja.date).toLocaleDateString('bn-BD')}
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
    { day: 'ষষ্ঠী', date: '১৭ অক্টোবর', event: 'দেবীর বোধন' },
    { day: 'সপ্তমী', date: '১৮ অক্টোবর', event: 'সপ্তমী পূজা' },
    { day: 'অষ্টমী', date: '১৯ অক্টোবর', event: 'অষ্টমী পূজা' },
    { day: 'নবমী', date: '২০ অক্টোবর', event: 'নবমী পূজা' },
    { day: 'দশমী', date: '২১ অক্টোবর', event: 'বিজয়া দশমী' },
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
              দূর্গাপূজা হলো হিন্দু ধর্মাবলম্বীদের সবচেয়ে বড় উৎসব। দুর্গা মা অসুরদমনী, মহিষাসুরমর্দিনী - শক্তির প্রতীক।
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

function ShyamaPujaPage() {
  const puja = pujaData.find(p => p.id === 'shyama')!;
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
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 gradient-text">পূজার তাৎপর্য</h2>
        <p className="text-gray-700 leading-relaxed">
          শ্যামা পূজা বা কালীপূজা কার্তিক অমাবস্যায় অনুষ্ঠিত হয়। শ্যামা মা হলেন কালীর অন্য রূপ।
        </p>
      </div>
    </div>
  );
}

function SaraswatiPujaPage() {
  const puja = pujaData.find(p => p.id === 'saraswati')!;
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
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 gradient-text">পূজার তাৎপর্য</h2>
        <p className="text-gray-700 leading-relaxed">
          সরস্বতী পূজা মাঘ মাসের শুক্লা পঞ্চমী তিথিতে অনুষ্ঠিত হয়। সরস্বতী মা বিদ্যাদেবী।
        </p>
      </div>
    </div>
  );
}

function RathYatraPage() {
  const puja = pujaData.find(p => p.id === 'rath')!;
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
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 gradient-text">পূজার তাৎপর্য</h2>
        <p className="text-gray-700 leading-relaxed">
          রথযাত্রা হলো জগন্নাথ দেবের বার্ষিক উৎসব।
        </p>
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
// GalleryPage - শুধু একটি ভার্সন
function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedPuja, setSelectedPuja] = useState<string>('সব');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,2016,2015,2014,2013,2011,2010,2009,2008];
  const pujaTypes = ['সব', 'দূর্গাপূজা', 'শ্যামাপূজা', 'সরস্বতী পূজা', 'রথযাত্রা'];

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
      } catch {
        setError('ছবি লোড করতে সমস্যা হয়েছে।');
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
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">পূজার ধরন</label>
            <select
              value={selectedPuja}
              onChange={(e) => setSelectedPuja(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 outline-none"
            >
              {pujaTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
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
          <p className="text-red-500 text-lg mb-2">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            🔄 আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {filteredImages.length > 0 && (
            <p className="text-sm text-gray-500 text-right">মোট {filteredImages.length}টি ছবি</p>
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
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=ছবি+নেই';
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

          {filteredImages.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">🖼️</div>
              <p className="text-gray-500 text-lg">এই সালের ছবি এখনো যুক্ত হয়নি</p>
            </div>
          )}
        </>
      )}

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
              <p className="text-gray-400 text-sm">{selectedImage.pujaType} • {selectedImage.year}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// MusicPage - Fixed useEffect
function MusicPage() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('সব');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const categories = ['সব', 'দূর্গা পূজা স্পেশাল', 'শ্যামা সংগীত', 'ভজন', 'মহামন্ত্র'];

  const filteredSongs = selectedCategory === 'সব'
    ? songs
    : songs.filter(s => s.category === selectedCategory);

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
      const nextIndex = currentIndex + 1 >= filteredSongs.length ? 0 : currentIndex + 1;
      const nextSong = filteredSongs[nextIndex];
      if (nextSong && audioRef.current) {
        setCurrentSong(nextSong);
        setCurrentIndex(nextIndex);
        audioRef.current.src = nextSong.url;
        audioRef.current.load();
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
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
  }, [filteredSongs, currentIndex]);

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
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = async (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    if (!song.url || song.url === '#') {
      alert('ডাউনলোড লিংক নেই');
      return;
    }
    setDownloadingId(song.id);
    try {
      const link = document.createElement('a');
      link.href = song.url;
      link.download = `${song.title} - ${song.artist}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('ডাউনলোড করতে সমস্যা হয়েছে');
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
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
              {isPlaying ? (
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
              <button onClick={handleSkipBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                <SkipBack className="w-5 h-5" />
              </button>
              <button onClick={togglePlayPause} className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-orange-600">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button onClick={handleSkipForward} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              <input type="range" min="0" max="1" step="0.01" value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-orange-200 w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer" onClick={handleProgressClick}>
              <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-orange-200 w-10">{formatTime(duration)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={cn("px-4 py-2 rounded-full text-sm font-medium transition",
              selectedCategory === cat ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-orange-50")}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSongs.map((song, index) => (
          <div key={song.id} onClick={() => playSong(song, index)}
            className={cn("card-hover bg-white rounded-xl p-4 flex items-center gap-4 cursor-pointer",
              currentSong?.id === song.id && "ring-2 ring-orange-500 bg-orange-50")}>
            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center",
              currentSong?.id === song.id && isPlaying ? "bg-gradient-to-br from-orange-500 to-red-500" : "bg-orange-100")}>
              {currentSong?.id === song.id && isPlaying ? (
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-4 bg-white rounded-full animate-bounce" />
                  <div className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                </div>
              ) : (
                <Music className="w-6 h-6 text-orange-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{song.title}</h4>
              <p className="text-sm text-gray-500 truncate">{song.artist}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{song.duration}</span>
              <button onClick={(e) => handleDownload(e, song)}
                disabled={downloadingId === song.id}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100 text-orange-600 hover:bg-orange-200">
                {downloadingId === song.id ? (
                  <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
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
          <p className="text-gray-500">এই ক্যাটাগরিতে গান নেই</p>
        </div>
      )}
    </div>
  );
}

function PDFPage() {
  const [selectedCategory, setSelectedCategory] = useState('সব');
  const categories = ['সব', 'পূজা ফর্দ', 'বিবাহ', 'শ্রাদ্ধ'];
  const filteredFiles = selectedCategory === 'সব'
    ? pdfFiles : pdfFiles.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">PDF ডাউনলোড</h1>
        <p className="text-gray-600">প্রয়োজনীয় ফাইল</p>
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
              className="flex items-center justify-center gap-2 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<any>(null);

  useEffect(() => {
    const loadStream = async () => {
      const video = videoRef.current;
      if (!video) return;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      setIsLoading(true);
      setHasError(false);

      try {
        const Hls = (await import('hls.js')).default;

        if (Hls.isSupported()) {
          const hls = new Hls();
          hlsRef.current = hls;
          hls.loadSource(activeChannel.streamUrl);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false);
            video.play().catch(() => {
              video.muted = true;
              video.play().catch(() => {});
            });
          });

          hls.on(Hls.Events.ERROR, (_: any, data: any) => {
            if (data.fatal) {
              setHasError(true);
              setIsLoading(false);
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = activeChannel.streamUrl;
          video.addEventListener('loadedmetadata', () => {
            setIsLoading(false);
            video.play().catch(() => {});
          });
        }
      } catch {
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadStream();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [activeChannel]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">লাইভ TV</h1>
        <p className="text-gray-600">ধর্মীয় চ্যানেল</p>
      </div>

      <div className="bg-black rounded-2xl overflow-hidden relative">
        <div className="aspect-video relative">
          <video ref={videoRef} className="w-full h-full object-contain bg-black" playsInline autoPlay controls />
          
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p>লোড হচ্ছে...</p>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90">
              <div className="text-center text-white">
                <p className="text-xl mb-4">📡 চ্যানেল পাওয়া যাচ্ছে না</p>
                <button onClick={() => setActiveChannel({...activeChannel})}
                  className="px-6 py-2 bg-orange-500 rounded-lg">
                  আবার চেষ্টা করুন
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {liveChannels.map((channel) => (
          <button key={channel.id} onClick={() => setActiveChannel(channel)}
            className={cn("p-4 rounded-xl text-center transition-all",
              activeChannel.id === channel.id
                ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                : "bg-white hover:bg-orange-50")}>
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
          <a href="https://facebook.com/KHDS3" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100">
            <Facebook className="w-8 h-8 text-blue-600" />
            <div><p className="font-medium">ফেসবুক পেজ</p><p className="text-sm text-gray-600">@KHDS3</p></div>
          </a>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const [loginType, setLoginType] = useState<'general' | 'accounts'>('general');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'members' | 'contacts' | 'invitation' | 'accounts'>('members');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState(DEMO_LOGIN_DATA);
  const [dataSource, setDataSource] = useState<'local' | 'github'>('local');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactPerson | null>(null);

  useEffect(() => {
    const fetchLoginData = async () => {
      try {
        const response = await fetch(GITHUB_LOGIN_URL, { cache: 'no-cache' });
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        if (data.normalMembers && data.accountsMembers) {
          setLoginData(data);
          setDataSource('github');
        }
      } catch {
        setLoginData(DEMO_LOGIN_DATA);
        setDataSource('local');
      }
    };
    fetchLoginData();
  }, []);

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

    setIsLoading(true);

    setTimeout(() => {
      const trimmedUsername = usernameInput.trim().toLowerCase();
      const trimmedPassword = passwordInput.trim();

      let foundUser: { mobile: string; email: string; password: string; name: string } | undefined;

      if (loginType === 'general') {
        foundUser = loginData.normalMembers.find(
          m => (m.mobile === trimmedUsername || m.email.toLowerCase() === trimmedUsername) && m.password === trimmedPassword
        );
      } else {
        foundUser = loginData.accountsMembers.find(
          m => (m.mobile === trimmedUsername || m.email.toLowerCase() === trimmedUsername) && m.password === trimmedPassword
        );
      }

      if (foundUser) {
        setIsLoggedIn(true);
        setLoggedInUser(foundUser.name);
        setUsernameInput('');
        setPasswordInput('');
      } else {
        setLoginError('ভুল তথ্য দিয়েছেন');
      }
      setIsLoading(false);
    }, 800);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">মেম্বর লগইন</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className={cn("mb-4 px-3 py-2 rounded-lg text-xs flex items-center gap-2",
            dataSource === 'github' ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600")}>
            <div className={cn("w-2 h-2 rounded-full", dataSource === 'github' ? "bg-green-500" : "bg-yellow-500")} />
            {dataSource === 'github' ? '✓ GitHub থেকে ডেটা লোড হয়েছে' : '⚠ লোকাল ডেটা'}
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={() => { setLoginType('general'); setLoginError(''); }}
              className={cn("flex-1 py-2 rounded-lg text-sm font-medium",
                loginType === 'general' ? "bg-orange-500 text-white" : "bg-gray-100")}>
              সাধারণ সদস্য
            </button>
            <button onClick={() => { setLoginType('accounts'); setLoginError(''); }}
              className={cn("flex-1 py-2 rounded-lg text-sm font-medium",
                loginType === 'accounts' ? "bg-orange-500 text-white" : "bg-gray-100")}>
              হিসাব দেখুন
            </button>
          </div>

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
                <input type="text" value={usernameInput}
                  onChange={(e) => { setUsernameInput(e.target.value); setLoginError(''); }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none"
                  placeholder="মোবাইল বা ইমেইল" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setLoginError(''); }}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none"
                  placeholder="পাসওয়ার্ড" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className={cn("w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2",
                isLoading ? "bg-gray-400 text-white" : "bg-gradient-to-r from-orange-500 to-red-500 text-white")}>
              {isLoading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />যাচাই করা হচ্ছে...</>
              ) : (
                <><LogIn className="w-5 h-5" />লগইন</>
              )}
            </button>
          </form>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700">🔑 নিবন্ধনের জন্য যোগাযোগ: 01733118313</p>
          </div>
        </div>
      </div>
    );
  }

  // Logged in view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">সদস্য এলাকা</h1>
          <p className="text-sm text-gray-500">স্বাগতম, <span className="font-bold text-orange-600">{loggedInUser}</span></p>
        </div>
        <button onClick={() => { setIsLoggedIn(false); setLoggedInUser(''); }}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium">
          লগআউট
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'members', label: 'মেম্বর ইনফো', icon: Users },
          { id: 'contacts', label: 'ফোন নম্বর', icon: Phone },
          { id: 'invitation', label: 'নিমন্ত্রণ', icon: FileText },
          ...(loginType === 'accounts' ? [{ id: 'accounts', label: 'হিসাব', icon: FileText }] : []),
        ].map((tab) => (
          <button key={tab.id}
            onClick={() => { setActiveTab(tab.id as typeof activeTab); setSelectedMember(null); setSelectedContact(null); }}
            className={cn("px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2",
              activeTab === tab.id ? "bg-orange-500 text-white" : "bg-white text-gray-700")}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member) => (
            <div key={member.id} onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
              className={cn("bg-white rounded-xl p-4 shadow-lg cursor-pointer",
                selectedMember?.id === member.id && "ring-2 ring-orange-500")}>
              <div className="flex items-center gap-4">
                <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-orange-600 text-sm">{member.designation}</p>
                  <p className="text-gray-500 text-sm">{member.mobile}</p>
                </div>
                <ChevronRight className={cn("w-5 h-5 text-gray-400", selectedMember?.id === member.id && "rotate-90")} />
              </div>
              {selectedMember?.id === member.id && (
                <div className="mt-4 pt-4 border-t text-sm space-y-2">
                  <p><span className="text-gray-500">পিতা:</span> {member.fatherName}</p>
                  <p><span className="text-gray-500">ঠিকানা:</span> {member.address}</p>
                  <p><span className="text-gray-500">পেশা:</span> {member.occupation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactPersons.map((person) => (
            <div key={person.id} onClick={() => setSelectedContact(selectedContact?.id === person.id ? null : person)}
              className={cn("bg-white rounded-xl p-4 shadow-lg cursor-pointer",
                selectedContact?.id === person.id && "ring-2 ring-orange-500")}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{person.name}</h3>
                  <p className="text-orange-600 text-sm">{person.occupation}</p>
                </div>
                <ChevronRight className={cn("w-5 h-5 text-gray-400", selectedContact?.id === person.id && "rotate-90")} />
              </div>
              {selectedContact?.id === person.id && (
                <div className="mt-4 pt-4 border-t text-sm space-y-2">
                  <p><span className="text-gray-500">মোবাইল:</span> {person.mobile}</p>
                  <p><span className="text-gray-500">ঠিকানা:</span> {person.address}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'invitation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invitationLists.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{item.area}</h3>
                  <p className="text-sm text-gray-500">{item.personName}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold">
                  {item.familyCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'accounts' && loginType === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(accountsPDFs).map(([key, data]) => (
            <div key={key} className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4">{data.title}</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(data.years).map(([year, url]) => (
                  <a key={year} href={url} download
                    className="flex items-center justify-center gap-2 p-3 bg-orange-50 rounded-lg hover:bg-orange-100">
                    <FileText className="w-4 h-4 text-orange-600" /><span className="text-sm">{year}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main App
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
