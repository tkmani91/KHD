import { useState, useRef, useEffect } from "react";

// ============================================================
// 🎵 গান যোগ করতে: audioUrl এ আপনার MP3 লিংক বসান
// উদাহরণ: audioUrl: "https://archive.org/download/xxx/song.mp3"
// অথবা Google Drive: audioUrl: "https://drive.google.com/uc?export=download&id=FILE_ID"
// ============================================================
const songs = [
  {
    id: 1,
    title: "মহিষাসুরমর্দিনী",
    artist: "বীরেন্দ্রকৃষ্ণ ভদ্র",
    category: "দুর্গাপূজা",
    duration: "42:02",
    audioUrl: "https://mr-jat.in/siteuploads/generaltheme/files/sfd2/607/Mahalaya%20Montro%20By%20Birendra%20Krishna%20Bhadra-(Mr-Jat.in).mp3", // ← এখানে আপনার MP3 লিংক বসান
    description: "মহালয়ার ভোরে বাজানো অমর সংগীত — প্রতি বছর আশ্বিন মাসে ভোর চারটায় প্রচারিত",
    emoji: "🎵",
    color: "from-red-500 to-orange-500",
    lyrics: "আগমনী গান — চণ্ডীপাঠ ও সংগীতের মিশেলে অনন্য রচনা",
    featured: true,
  },
  {
    id: 2,
    title: "জয় মা দুর্গা আরতি",
    artist: "ঐতিহ্যবাহী",
    category: "দুর্গাপূজা",
    duration: "05:30",
    audioUrl: "", // ← এখানে আপনার MP3 লিংক বসান
    description: "দুর্গামায়ের মহাআরতি — সন্ধ্যায় মণ্ডপে বাজানো হয়",
    emoji: "🪔",
    color: "from-orange-500 to-yellow-500",
    lyrics: "জয় জয় দেবী চরাচর সারে, কুচযুগশোভিত মুক্তাহারে...",
    featured: false,
  },
  {
    id: 3,
    title: "ওঁ জয় জগদীশ হরে",
    artist: "ঐতিহ্যবাহী",
    category: "সাধারণ আরতি",
    duration: "05:50",
    audioUrl: "https://cdnsongs.com/dren/music/data/Bhakti_Sangeet/201403/Aarti__Vol_5/128/Om_Jai_Jagdish_Hare_8.mp3/Om%20Jai%20Jagdish%20Hare%208.mp3", // ← এখানে আপনার MP3 লিংক বসান
    description: "বিষ্ণু আরতি — প্রতিটি পূজায় গাওয়া হয়",
    emoji: "🙏",
    color: "from-yellow-500 to-amber-500",
    lyrics: "ওঁ জয় জগদীশ হরে, স্বামী জয় জগদীশ হরে...",
    featured: false,
  },
  {
    id: 4,
    title: "কালী কালী মহাকালী — শ্যামাসংগীত",
    artist: "রামপ্রসাদী",
    category: "শ্যামাপূজা",
    duration: "06:00",
    audioUrl: "", // ← এখানে আপনার MP3 লিংক বসান
    description: "মা কালীর শ্যামাসংগীত — রামপ্রসাদ সেনের রচনা অবলম্বনে",
    emoji: "🌑",
    color: "from-purple-600 to-indigo-700",
    lyrics: "মন রে কৃষিকাজ জানো না, এমন মানব জমিন রইল পতিত...",
    featured: true,
  },
  {
    id: 5,
    title: "আমার সোনার বাংলা",
    artist: "রবীন্দ্রনাথ ঠাকুর",
    category: "দেশাত্মবোধক",
    duration: "03:30",
    audioUrl: "", // ← এখানে আপনার MP3 লিংক বসান
    description: "বাংলাদেশের জাতীয় সংগীত — উৎসবের শুরুতে গাওয়া হয়",
    emoji: "🏳️",
    color: "from-green-500 to-teal-500",
    lyrics: "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি...",
    featured: false,
  },
  {
    id: 6,
    title: "বাজলো তোমার আলোর বেণু",
    artist: "রবীন্দ্রনাথ ঠাকুর",
    category: "সরস্বতী পূজা",
    duration: "04:45",
    audioUrl: "", // ← এখানে আপনার MP3 লিংক বসান
    description: "বসন্তপঞ্চমীর বিশেষ সংগীত",
    emoji: "🎵",
    color: "from-indigo-400 to-purple-500",
    lyrics: "বাজলো তোমার আলোর বেণু মাতলো রে ভুবন...",
    featured: false,
  },
  {
    id: 7,
    title: "দুর্গে দুর্গে দুর্গতিনাশিনী",
    artist: "ঐতিহ্যবাহী ভজন",
    category: "দুর্গাপূজা",
    duration: "05:15",
    audioUrl: "", // ← এখানে আপনার MP3 লিংক বসান
    description: "মায়ের স্তুতি ভজন — পূজার আসরে বাজানো হয়",
    emoji: "🌺",
    color: "from-red-600 to-pink-600",
    lyrics: "দুর্গে দুর্গে দুর্গতিনাশিনী মাগো তোমায় ডাকি...",
    featured: false,
  },
  {
    id: 8,
    title: "শ্যামা মায়ের পায়ের তলে",
    artist: "রামপ্রসাদী গান",
    category: "শ্যামাপূজা",
    duration: "05:30",
    audioUrl: "", // ← এখানে আপনার MP3 লিংক বসান
    description: "মা কালীর ভক্তিমূলক গান — কালীপূজার রাতে বিশেষভাবে গাওয়া হয়",
    emoji: "🌑",
    color: "from-violet-600 to-purple-700",
    lyrics: "শ্যামা মায়ের পায়ের তলে, ভক্তেরা সব ডুবে গেলে...",
    featured: false,
  },
  {
    id: 9,
    title: "সরস্বতী মা — বিদ্যার দেবী বন্দনা",
    artist: "ঐতিহ্যবাহী",
    category: "সরস্বতী পূজা",
    duration: "04:00",
    audioUrl: "", // ← এখানে আপনার MP3 লিংক বসান
    description: "সরস্বতী পূজার বিশেষ বন্দনাগীত",
    emoji: "🎵",
    color: "from-yellow-400 to-amber-500",
    lyrics: "সরস্বতী মা বিদ্যার দেবী, জ্ঞানের আলো দাও...",
    featured: false,
  },
  {
    id: 10,
    title: "আগমনী — মা আসছেন",
    artist: "সনাতন ধর্মীয় সংগীত",
    category: "দুর্গাপূজা",
    duration: "06:30",
    audioUrl: "", // ← এখানে আপনার MP3 লিংক বসান
    description: "দুর্গামায়ের আগমনের গান — উমার পৃথিবীতে আসার গল্প",
    emoji: "🏡",
    color: "from-amber-400 to-orange-500",
    lyrics: "আশ্বিনের শারদ প্রাতে বেজেছে আলোর বেণু...",
    featured: false,
  },
  {
    id: 11,
    title: "গণেশ বন্দনা",
    artist: "ঐতিহ্যবাহী",
    category: "সাধারণ পূজা",
    duration: "03:30",
    audioUrl: "", // ← এখানে আপনার MP3 লিংক বসান
    description: "যেকোনো পূজার শুরুতে গণেশ বন্দনা",
    emoji: "🐘",
    color: "from-orange-400 to-yellow-500",
    lyrics: "ওঁ গং গণপতয়ে নমঃ — গণেশ গণেশ মহাগণেশ...",
    featured: false,
  },
  {
    id: 12,
    title: "বিসর্জনের গান — মা যাচ্ছেন",
    artist: "ঐতিহ্যবাহী",
    category: "দুর্গাপূজা",
    duration: "05:00",
    audioUrl: "", // ← এখানে আপনার MP3 লিংক বসান
    description: "দশমীতে বিসর্জনের মুহূর্তে গাওয়া বিদায়ের গান",
    emoji: "💧",
    color: "from-blue-400 to-indigo-500",
    lyrics: "যাও মা যাও, আবার এসো মা আসছে বছর...",
    featured: false,
  },
];

const categories = ["সব", "দুর্গাপূজা", "শ্যামাপূজা", "সরস্বতী পূজা", "সাধারণ আরতি", "দেশাত্মবোধক", "সাধারণ পূজা"];

const categoryColors: Record<string, string> = {
  "দুর্গাপূজা": "bg-red-100 text-red-700",
  "শ্যামাপূজা": "bg-purple-100 text-purple-700",
  "সরস্বতী পূজা": "bg-indigo-100 text-indigo-700",
  "সাধারণ আরতি": "bg-yellow-100 text-yellow-700",
  "দেশাত্মবোধক": "bg-green-100 text-green-700",
  "সাধারণ পূজা": "bg-orange-100 text-orange-700",
};

// Seconds to mm:ss

// Seconds to mm:ss
function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ReligiousSongs() {
  const [selectedCategory, setSelectedCategory] = useState("সব");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ✅ Audio control functions
  const handlePlay = (song: typeof songs[0]) => {
    if (song.audioUrl) {
      if (playingId === song.id) {
        // Pause current song
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setPlayingId(null);
      } else {
        // Stop previous and play new
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(song.audioUrl);
        audioRef.current = audio;
        
        audio.onloadedmetadata = () => {
          setDuration(audio.duration);
        };
        
        audio.ontimeupdate = () => {
          setCurrentTime(audio.currentTime);
        };
        
        audio.onended = () => {
          setPlayingId(null);
          setCurrentTime(0);
        };
        
        audio.play();
        setPlayingId(song.id);
        setCurrentTime(0);
      }
    } else {
      alert("এই গানের অডিও লিংক এখনো যোগ করা হয়নি। অনুগ্রহ করে যোগাযোগ করুন।");
    }
  };

  // ✅ Seek function - ফরওয়ার্ড/ব্যাকওয়ার্ড করা যাবে
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Skip forward/backward 10 seconds
  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds));
    }
  };

  const handleDownload = (song: typeof songs[0]) => {
    if (song.audioUrl) {
      const a = document.createElement("a");
      a.href = song.audioUrl;
      a.download = song.title + ".mp3";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("এই গানের ডাউনলোড লিংক এখনো যোগ করা হয়নি। যোগাযোগ করুন।");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const filtered = selectedCategory === "সব" ? songs : songs.filter(s => s.category === selectedCategory);
  const featured = songs.filter(s => s.featured);
  const playingSong = songs.find(s => s.id === playingId);

  return (
    <section id="songs" className="py-14 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-5 py-2 text-sm font-hind mb-4 border border-white/20">
            🎵 ধর্মীয় গান
          </div>
          <h2 className="font-bengali text-3xl md:text-5xl font-black text-white mb-3">
            ভক্তিমূলক <span className="text-yellow-400">গান ও সংগীত</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 font-hind text-sm max-w-2xl mx-auto">
            দুর্গাপূজা, শ্যামাপূজা ও সরস্বতী পূজার ধর্মীয় গান — শুনুন, পড়ুন ও ডাউনলোড করুন
          </p>
        </div>

        {/* ✅ Now Playing Bar - Fixed at top when playing */}
        {playingId && playingSong && (
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-4 mb-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
                {playingSong.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bengali text-white font-bold truncate">{playingSong.title}</p>
                <p className="font-hind text-xs text-white/70">{playingSong.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Equalizer animation */}
                <div className="flex gap-0.5 items-end h-6">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-yellow-300 rounded-full"
                      style={{
                        height: `${Math.random() * 100}%`,
                        animation: `equalizer 0.5s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* ✅ Progress bar with seek functionality */}
            <div className="flex items-center gap-3">
              <span className="font-hind text-xs text-white/80 w-12 text-right">{formatTime(currentTime)}</span>
              
              {/* Skip back 10s */}
              <button onClick={() => handleSkip(-10)} className="text-white/80 hover:text-white text-lg" title="১০ সেকেন্ড পিছনে">
                ⏪
              </button>
              
              {/* ✅ Seekable range input */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-2 bg-white/30 rounded-full appearance-none cursor-pointer 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                  [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-lg"
              />
              
              {/* Skip forward 10s */}
              <button onClick={() => handleSkip(10)} className="text-white/80 hover:text-white text-lg" title="১০ সেকেন্ড সামনে">
                ⏩
              </button>
              
              <span className="font-hind text-xs text-white/80 w-12">{formatTime(duration)}</span>
            </div>
            
            {/* Control buttons */}
            <div className="flex justify-center gap-4 mt-3">
              <button
                onClick={() => handlePlay(playingSong)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-hind text-sm font-bold transition-all"
              >
                ⏸ বিরতি
              </button>
              <button
                onClick={() => handleDownload(playingSong)}
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-2 rounded-full font-hind text-sm font-bold transition-all"
              >
                ⬇️ ডাউনলোড
              </button>
            </div>
          </div>
        )}

        {/* Featured Songs */}
        <div className="mb-10">
          <h3 className="font-bengali text-xl font-bold text-yellow-300 mb-5 flex items-center gap-2">
            ⭐ বিশেষ নির্বাচিত গান
          </h3>
          <div className="grid md:grid-cols-2 gap-5">
            {featured.map(song => (
              <div
                key={song.id}
                className={`rounded-3xl overflow-hidden bg-gradient-to-br ${song.color} text-white shadow-2xl p-6 card-hover ${playingId === song.id ? 'ring-4 ring-yellow-400' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl shrink-0 float-anim">
                    {song.emoji}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-hind">{song.category}</span>
                    <h4 className="font-bengali text-lg font-bold mt-1 leading-snug">{song.title}</h4>
                    <p className="font-hind text-xs text-white/70 mt-1">{song.artist} · {song.duration}</p>
                    <p className="font-hind text-xs text-white/60 mt-2 leading-relaxed">{song.description}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handlePlay(song)}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 rounded-xl font-hind text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {playingId === song.id ? "⏸ বিরতি" : "▶ শুনুন"}
                  </button>
                  <button 
                    onClick={() => handleDownload(song)} 
                    className="flex-1 bg-white text-gray-800 font-bold py-2.5 rounded-xl font-hind text-sm hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2"
                  >
                    ⬇️ ডাউনলোড
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-hind text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Song List */}
        <div className="space-y-3">
          {filtered.map((song, index) => (
            <div
              key={song.id}
              className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all ${playingId === song.id ? 'ring-2 ring-orange-500' : ''}`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Number */}
                <div className="w-8 text-center font-hind text-sm text-gray-500 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Emoji */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${song.color} flex items-center justify-center text-2xl shrink-0`}>
                  {playingId === song.id ? "🎵" : song.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bengali text-sm font-bold text-white leading-snug">{song.title}</h4>
                    {song.featured && (
                      <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full font-hind border border-yellow-400/30">
                        ⭐ ফিচারড
                      </span>
                    )}
                    {playingId === song.id && (
                      <span className="text-xs bg-green-400/20 text-green-300 px-2 py-0.5 rounded-full font-hind animate-pulse">
                        🔊 বাজছে
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="font-hind text-xs text-gray-400">{song.artist}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-hind ${categoryColors[song.category] || "bg-gray-100 text-gray-700"}`}>
                      {song.category}
                    </span>
                    <span className="font-hind text-xs text-gray-500">⏱ {song.duration}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setExpandedId(expandedId === song.id ? null : song.id)}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-gray-300 transition-colors text-xs"
                    title="লিরিক্স দেখুন"
                  >
                    📄
                  </button>
                  <button
                    onClick={() => handlePlay(song)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all ${
                      playingId === song.id
                        ? `bg-gradient-to-br ${song.color} shadow-lg`
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {playingId === song.id ? "⏸" : "▶"}
                  </button>
                  <button 
                    onClick={() => handleDownload(song)} 
                    className="w-10 h-10 bg-orange-500/20 hover:bg-orange-500/40 rounded-xl flex items-center justify-center text-orange-300 transition-colors" 
                    title="ডাউনলোড"
                  >
                    ⬇️
                  </button>
                </div>
              </div>

              {/* Expanded - Lyrics */}
              {expandedId === song.id && (
                <div className="border-t border-white/10 px-4 pb-4 pt-3">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-orange-400 font-hind font-bold mb-2">📝 গানের লাইন:</p>
                    <p className="font-bengali text-sm text-gray-300 leading-relaxed italic">"{song.lyrics}"</p>
                    <p className="font-hind text-xs text-gray-500 mt-2">{song.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Download All Note */}
        <div className="mt-10 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🎶</div>
          <h3 className="font-bengali text-xl font-bold text-white mb-2">সব গান ডাউনলোড করুন</h3>
          <p className="font-hind text-sm text-gray-400 mb-4">
            সম্পূর্ণ ধর্মীয় গানের সংগ্রহ একসাথে ডাউনলোড করতে আমাদের সাথে যোগাযোগ করুন
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-6 py-2.5 rounded-full font-hind text-sm hover:opacity-90 transition-opacity">
              📥 সব গান ডাউনলোড
            </button>
            <a href="#contact" className="bg-white/10 border border-white/20 text-white font-bold px-6 py-2.5 rounded-full font-hind text-sm hover:bg-white/20 transition-colors">
              📨 যোগাযোগ করুন
            </a>
          </div>
        </div>
      </div>

      {/* CSS for equalizer animation */}
      <style>{`
        @keyframes equalizer {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
    </section>
  );
}
