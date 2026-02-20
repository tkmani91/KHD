import { useState } from "react";

const years = ["২০২৫", "২০২৪", "২০২৩", "২০২২", "২০২১", "২০২০", "২০১৯", "২০১৮"];

// ============================================================
// 📸 ছবি যোগ করতে: প্রতিটি object এ image: "আপনার ছবির লিংক" যোগ করুন
// উদাহরণ: image: "https://i.ibb.co/xxxxx/photo.jpg"
// ImgBB: imgbb.com | Google Drive: drive.google.com
// ============================================================
const galleryData: Record<string, { id: number; image: string; emoji: string; caption: string; event: string; color: string }[]> = {
  "২০২৫": [
    { id: 1, image: "", emoji: "🪔", caption: "মহাষষ্ঠীর বোধন — ২০২৫", event: "দুর্গাপূজা", color: "from-red-400 to-orange-500" },
    { id: 2, image: "", emoji: "🌺", caption: "পুষ্পাঞ্জলি — মহাঅষ্টমী", event: "দুর্গাপূজা", color: "from-orange-400 to-yellow-500" },
    { id: 3, image: "", emoji: "🥁", caption: "ঢাকের বাদ্য — সন্ধিপূজা", event: "দুর্গাপূজা", color: "from-yellow-500 to-red-500" },
    { id: 4, image: "", emoji: "💧", caption: "বিসর্জনের মুহূর্ত — দশমী", event: "দুর্গাপূজা", color: "from-blue-400 to-indigo-500" },
    { id: 5, image: "", emoji: "🌑", caption: "কালীপূজার আলোকসজ্জা", event: "শ্যামাপূজা", color: "from-purple-600 to-indigo-700" },
    { id: 6, image: "", emoji: "🎵", caption: "সরস্বতী পূজার পুষ্পাঞ্জলি", event: "সরস্বতী পূজা", color: "from-indigo-400 to-purple-500" },
  ],
  "২০২৪": [
    { id: 7, image: "", emoji: "🛕", caption: "মণ্ডপ সজ্জা — দুর্গাপূজা ২০২৪", event: "দুর্গাপূজা", color: "from-red-500 to-pink-500" },
    { id: 8, image: "", emoji: "🙏", caption: "মহাআরতি — সপ্তমী রাতে", event: "দুর্গাপূজা", color: "from-orange-500 to-red-600" },
    { id: 9, image: "", emoji: "👸", caption: "দেবী দুর্গার মূর্তি — ২০২৪", event: "দুর্গাপূজা", color: "from-yellow-400 to-orange-500" },
    { id: 10, image: "", emoji: "🎭", caption: "সাংস্কৃতিক অনুষ্ঠান", event: "বিশেষ", color: "from-teal-400 to-cyan-500" },
    { id: 11, image: "", emoji: "🔥", caption: "হোম যজ্ঞ — নবমী", event: "দুর্গাপূজা", color: "from-red-600 to-orange-700" },
    { id: 12, image: "", emoji: "🎊", caption: "বিজয়া উৎসব ২০২৪", event: "দুর্গাপূজা", color: "from-pink-500 to-rose-600" },
  ],
  "২০২৩": [
    { id: 13, image: "", emoji: "🪔", caption: "বোধনের প্রদীপ — ২০২৩", event: "দুর্গাপূজা", color: "from-amber-400 to-orange-500" },
    { id: 14, image: "", emoji: "🌸", caption: "নবপত্রিকা স্নান", event: "দুর্গাপূজা", color: "from-green-400 to-teal-500" },
    { id: 15, image: "", emoji: "🌑", caption: "শ্যামাপূজার রাত — ২০২৩", event: "শ্যামাপূজা", color: "from-violet-600 to-purple-700" },
    { id: 16, image: "", emoji: "🎵", caption: "বসন্তপঞ্চমী উৎসব", event: "সরস্বতী পূজা", color: "from-yellow-400 to-amber-500" },
    { id: 17, image: "", emoji: "👨‍👩‍👧‍👦", caption: "ক্লাবের সদস্যগণ — ২০২৩", event: "ক্লাব", color: "from-blue-400 to-indigo-500" },
    { id: 18, image: "", emoji: "🍚", caption: "মহাভোগ বিতরণ", event: "দুর্গাপূজা", color: "from-orange-400 to-yellow-500" },
  ],
  "২০২২": [
    { id: 19, image: "", emoji: "🛕", caption: "মণ্ডপ নির্মাণ — ২০২২", event: "দুর্গাপূজা", color: "from-red-400 to-orange-500" },
    { id: 20, image: "", emoji: "🎺", caption: "শঙ্খধ্বনি ও আরতি", event: "দুর্গাপূজা", color: "from-yellow-500 to-red-500" },
    { id: 21, image: "", emoji: "🌺", caption: "ফুলের সাজসজ্জা", event: "বিশেষ", color: "from-pink-400 to-rose-500" },
    { id: 22, image: "", emoji: "🌑", caption: "দীপাবলির আলো — ২০২২", event: "শ্যামাপূজা", color: "from-purple-500 to-indigo-600" },
    { id: 23, image: "", emoji: "📚", caption: "সরস্বতী পূজার বই রাখা", event: "সরস্বতী পূজা", color: "from-indigo-400 to-blue-500" },
    { id: 24, image: "", emoji: "🎊", caption: "বিজয়া সম্মিলনী ২০২২", event: "বিশেষ", color: "from-teal-400 to-emerald-500" },
  ],
  "২০২১": [
    { id: 25, image: "", emoji: "😷", caption: "কোভিড পরবর্তী পূজা — ২০২১", event: "দুর্গাপূজা", color: "from-gray-400 to-blue-500" },
    { id: 26, image: "", emoji: "🪔", caption: "ছোট পরিসরে বোধন", event: "দুর্গাপূজা", color: "from-orange-400 to-yellow-500" },
    { id: 27, image: "", emoji: "🙏", caption: "বিশেষ প্রার্থনা — ২০২১", event: "বিশেষ", color: "from-red-400 to-pink-500" },
    { id: 28, image: "", emoji: "🌑", caption: "শ্যামাপূজা ২০২১", event: "শ্যামাপূজা", color: "from-purple-600 to-violet-700" },
  ],
  "২০২০": [
    { id: 29, image: "", emoji: "🏠", caption: "গৃহ দুর্গোৎসব — ২০২০", event: "দুর্গাপূজা", color: "from-green-400 to-teal-500" },
    { id: 30, image: "", emoji: "📱", caption: "অনলাইন পূজা দর্শন", event: "বিশেষ", color: "from-blue-400 to-cyan-500" },
    { id: 31, image: "", emoji: "🎵", caption: "সরস্বতী পূজা ২০২০", event: "সরস্বতী পূজা", color: "from-yellow-400 to-orange-500" },
  ],
  "২০১৯": [
    { id: 32, image: "", emoji: "🎊", caption: "বড় উৎসব — দুর্গাপূজা ২০১৯", event: "দুর্গাপূজা", color: "from-red-500 to-orange-600" },
    { id: 33, image: "", emoji: "🥁", caption: "ঢাকিদের সাথে উৎসব", event: "দুর্গাপূজা", color: "from-orange-500 to-yellow-500" },
    { id: 34, image: "", emoji: "👸", caption: "প্রতিমা দর্শন — ২০১৯", event: "দুর্গাপূজা", color: "from-yellow-500 to-red-500" },
    { id: 35, image: "", emoji: "🌑", caption: "শ্যামাপূজার প্রদীপ", event: "শ্যামাপূজা", color: "from-violet-500 to-purple-600" },
    { id: 36, image: "", emoji: "🎵", caption: "বসন্তপঞ্চমী — ২০১৯", event: "সরস্বতী পূজা", color: "from-indigo-400 to-blue-500" },
    { id: 37, image: "", emoji: "🏆", caption: "পুরস্কার বিতরণী অনুষ্ঠান", event: "বিশেষ", color: "from-amber-400 to-yellow-500" },
  ],
  "২০১৮": [
    { id: 38, image: "", emoji: "🛕", caption: "প্রথম বছরের পূজা — ২০১৮", event: "দুর্গাপূজা", color: "from-red-400 to-orange-500" },
    { id: 39, image: "", emoji: "🙏", caption: "প্রতিষ্ঠাতাদের সাথে — ২০১৮", event: "ক্লাব", color: "from-blue-400 to-indigo-500" },
    { id: 40, image: "", emoji: "🌺", caption: "মহাপুষ্পাঞ্জলি ২০১৮", event: "দুর্গাপূজা", color: "from-pink-400 to-rose-500" },
    { id: 41, image: "", emoji: "🎊", caption: "উদ্বোধনী অনুষ্ঠান", event: "বিশেষ", color: "from-teal-400 to-cyan-500" },
  ],
};

const eventColors: Record<string, string> = {
  "দুর্গাপূজা": "bg-red-100 text-red-700",
  "শ্যামাপূজা": "bg-purple-100 text-purple-700",
  "সরস্বতী পূজা": "bg-indigo-100 text-indigo-700",
  "বিশেষ": "bg-orange-100 text-orange-700",
  "ক্লাব": "bg-green-100 text-green-700",
};

export function PhotoGallery() {
  const [selectedYear, setSelectedYear] = useState("২০২৫");
  const [selectedPhoto, setSelectedPhoto] = useState<null | typeof galleryData["২০২৫"][0]>(null);

  const photos = galleryData[selectedYear] || [];

  // ✅ ডাউনলোড ফাংশন — কাজ করবে
  const handleDownload = (photo: typeof galleryData["২০২৫"][0]) => {
    if (photo.image) {
      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = photo.image;
      link.download = `kalama-dharmasabha-${photo.id}.jpg`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("এই ছবির ডাউনলোড লিংক এখনো যোগ করা হয়নি। অনুগ্রহ করে যোগাযোগ করুন।");
    }
  };

  return (
    <section id="gallery" className="py-14 bg-gray-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #ff6b35 0%, transparent 50%), radial-gradient(circle at 75% 75%, #7c3aed 0%, transparent 50%)" }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-5 py-2 text-sm font-hind mb-4 border border-white/20">
            📷 ফটো গ্যালারি
          </div>
          <h2 className="font-bengali text-3xl md:text-5xl font-black text-white mb-3">
            কলম হিন্দু ধর্মসভার <span className="text-yellow-400">স্মৃতির পাতা</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 font-hind text-sm max-w-2xl mx-auto">
            ২০১৮ সাল থেকে প্রতি বছর দুর্গাপূজা, শ্যামাপূজা ও সরস্বতী পূজার স্মরণীয় মুহূর্তগুলো
          </p>
        </div>

        {/* Year Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-5 py-2 rounded-full font-hind text-sm font-bold transition-all ${
                selectedYear === year
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30 scale-105"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Stats for year */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          {(["দুর্গাপূজা", "শ্যামাপূজা", "সরস্বতী পূজা", "বিশেষ"] as string[]).map(event => {
            const count = photos.filter(p => p.event === event).length;
            if (count === 0) return null;
            return (
              <div key={event} className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-hind ${eventColors[event]}`}>{event}</span>
                <span className="text-gray-400 text-xs font-hind">{count}টি ছবি</span>
              </div>
            );
          })}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-10">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer card-hover"
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Photo placeholder */}
              <div className={`h-48 md:h-56 bg-gradient-to-br ${photo.color} flex flex-col items-center justify-center relative overflow-hidden`}>
                {photo.image ? (
                  <img src={photo.image} alt={photo.caption} className="w-full h-full object-cover absolute inset-0" />
                ) : (
                  <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">{photo.emoji}</div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur rounded-full px-4 py-2 text-white font-hind text-xs font-bold">
                      🔍 বড় করুন
                    </div>
                  </div>
                </div>
                {/* Event Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full font-hind ${eventColors[photo.event] || "bg-gray-100 text-gray-700"}`}>
                    {photo.event}
                  </span>
                </div>
              </div>
              {/* Caption */}
              <div className="bg-gray-900 border border-white/10 p-3">
                <p className="font-hind text-sm text-gray-200 leading-snug">{photo.caption}</p>
                <p className="font-hind text-xs text-gray-500 mt-1">কলম হিন্দু ধর্মসভা — {selectedYear}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Note */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">📸</div>
          <h3 className="font-bengali text-xl font-bold text-white mb-2">আপনার ছবি শেয়ার করুন</h3>
          <p className="font-hind text-sm text-gray-400 mb-4">
            পূজার কোনো স্মৃতির ছবি থাকলে আমাদের কাছে পাঠান — গ্যালারিতে যোগ করা হবে
          </p>
          <a
            href="#contact"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-6 py-2.5 rounded-full font-hind text-sm hover:opacity-90 transition-opacity"
          >
            📨 ছবি পাঠান
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-gray-900 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`h-64 md:h-80 bg-gradient-to-br ${selectedPhoto.color} flex items-center justify-center relative overflow-hidden`}>
              {selectedPhoto.image ? (
                <img src={selectedPhoto.image} alt={selectedPhoto.caption} className="w-full h-full object-cover absolute inset-0" />
              ) : (
                <span className="text-8xl">{selectedPhoto.emoji}</span>
              )}
            </div>
            <div className="p-6">
              <span className={`text-xs font-bold px-3 py-1 rounded-full font-hind ${eventColors[selectedPhoto.event]}`}>
                {selectedPhoto.event}
              </span>
              <h3 className="font-bengali text-xl font-bold text-white mt-3 mb-2">{selectedPhoto.caption}</h3>
              <p className="font-hind text-sm text-gray-400">কলম হিন্দু ধর্মসভা — {selectedYear}</p>
              <div className="flex gap-3 mt-5">
                <button 
                  onClick={() => handleDownload(selectedPhoto)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl font-hind text-sm transition-colors"
                >
                  ⬇️ ডাউনলোড
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 rounded-xl font-hind text-sm transition-colors"
                >
                  ✕ বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
