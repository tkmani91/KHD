import { useState } from "react";

// ============================================================
// 📄 PDF যোগ করার নিয়ম:
// 1. Google Drive এ PDF আপলোড করুন
// 2. Share → Anyone with link → Viewer
// 3. File ID কপি করুন (লিংকের /d/ এর পরে /view এর আগের অংশ)
// 4. নিচে url এ বসান: https://drive.google.com/uc?export=download&id=FILE_ID
// 
// অথবা অন্য হোস্টিং থেকে সরাসরি PDF লিংক বসান
// ============================================================

const pdfCategories = [
  { id: "all", label: "সব", emoji: "📚" },
  { id: "durga", label: "দুর্গাপূজা", emoji: "🪔" },
  { id: "kali", label: "শ্যামাপূজা", emoji: "🌑" },
  { id: "saraswati", label: "সরস্বতী পূজা", emoji: "🎵" },
  { id: "others", label: "অন্যান্য পূজা", emoji: "🛕" },
];

const pdfList = [
  // ============ দুর্গাপূজার PDF ============
  {
    id: 1,
    title: "দুর্গাপূজার সম্পূর্ণ ফর্দ ও তালিকা",
    description: "মহাষষ্ঠী থেকে বিজয়াদশমী — প্রতিদিনের উপকরণ, মন্ত্র ও নিয়মকানুন",
    category: "durga",
    pages: "১২ পৃষ্ঠা",
    size: "2.5 MB",
    emoji: "📋",
    color: "from-red-500 to-orange-500",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: true,
  },
  {
    id: 2,
    title: "দুর্গাপূজার মন্ত্র সংকলন",
    description: "ধ্যানমন্ত্র, পুষ্পাঞ্জলি, প্রণাম মন্ত্র — সংস্কৃত ও বাংলা অর্থসহ",
    category: "durga",
    pages: "২০ পৃষ্ঠা",
    size: "3.2 MB",
    emoji: "📿",
    color: "from-orange-500 to-yellow-500",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: true,
  },
  {
    id: 3,
    title: "চণ্ডীপাঠ — সম্পূর্ণ",
    description: "শ্রী শ্রী চণ্ডী পাঠ — ১৩ অধ্যায় বাংলা অনুবাদসহ",
    category: "durga",
    pages: "৬৫ পৃষ্ঠা",
    size: "8.5 MB",
    emoji: "📖",
    color: "from-red-600 to-pink-600",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: false,
  },
  {
    id: 4,
    title: "পুষ্পাঞ্জলির নিয়ম ও মন্ত্র",
    description: "সঠিকভাবে পুষ্পাঞ্জলি দেওয়ার সম্পূর্ণ পদ্ধতি",
    category: "durga",
    pages: "৮ পৃষ্ঠা",
    size: "1.5 MB",
    emoji: "🌺",
    color: "from-pink-500 to-rose-500",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: false,
  },
  {
    id: 5,
    title: "দুর্গাপূজার উপকরণ তালিকা",
    description: "পূজায় যা যা লাগবে — সম্পূর্ণ চেকলিস্ট",
    category: "durga",
    pages: "৪ পৃষ্ঠা",
    size: "800 KB",
    emoji: "✅",
    color: "from-green-500 to-teal-500",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: false,
  },

  // ============ শ্যামাপূজার PDF ============
  {
    id: 6,
    title: "কালীপূজার সম্পূর্ণ বিধান",
    description: "অমাবস্যায় মা কালীর পূজার নিয়ম, মন্ত্র ও উপকরণ",
    category: "kali",
    pages: "১৫ পৃষ্ঠা",
    size: "2.8 MB",
    emoji: "🌑",
    color: "from-purple-600 to-indigo-700",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: true,
  },
  {
    id: 7,
    title: "কালী মন্ত্র ও কবচ",
    description: "কালীকবচ, কালীস্তোত্র ও জপমন্ত্র সংকলন",
    category: "kali",
    pages: "১০ পৃষ্ঠা",
    size: "1.8 MB",
    emoji: "📿",
    color: "from-violet-600 to-purple-700",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: false,
  },
  {
    id: 8,
    title: "শ্যামাসংগীত — রামপ্রসাদী গান",
    description: "রামপ্রসাদ সেনের বিখ্যাত শ্যামাসংগীতের সংকলন",
    category: "kali",
    pages: "২৫ পৃষ্ঠা",
    size: "3.5 MB",
    emoji: "🎵",
    color: "from-indigo-600 to-blue-700",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: false,
  },

  // ============ সরস্বতী পূজার PDF ============
  {
    id: 9,
    title: "সরস্বতী পূজার সম্পূর্ণ বিধান",
    description: "বসন্তপঞ্চমীতে বিদ্যার দেবীর পূজার নিয়ম ও মন্ত্র",
    category: "saraswati",
    pages: "১২ পৃষ্ঠা",
    size: "2.2 MB",
    emoji: "📚",
    color: "from-indigo-500 to-purple-500",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: true,
  },
  {
    id: 10,
    title: "সরস্বতী বন্দনা ও স্তোত্র",
    description: "সরস্বতী মন্ত্র, প্রণাম ও স্তুতি সংকলন",
    category: "saraswati",
    pages: "৮ পৃষ্ঠা",
    size: "1.5 MB",
    emoji: "🎵",
    color: "from-yellow-500 to-amber-500",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: false,
  },

  // ============ অন্যান্য পূজার PDF ============
  {
    id: 11,
    title: "গণেশ পূজার বিধান",
    description: "যেকোনো শুভ কাজের আগে গণেশ পূজার নিয়ম",
    category: "others",
    pages: "৬ পৃষ্ঠা",
    size: "1.2 MB",
    emoji: "🐘",
    color: "from-orange-500 to-red-500",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: false,
  },
  {
    id: 12,
    title: "লক্ষ্মী পূজার বিধান",
    description: "কোজাগরী লক্ষ্মীপূজা ও সাপ্তাহিক লক্ষ্মীবার পূজা",
    category: "others",
    pages: "১০ পৃষ্ঠা",
    size: "1.8 MB",
    emoji: "🌸",
    color: "from-pink-500 to-red-500",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: false,
  },
  {
    id: 13,
    title: "শিব পূজার বিধান",
    description: "শিবরাত্রি ও প্রদোষ ব্রতের নিয়ম ও মন্ত্র",
    category: "others",
    pages: "৮ পৃষ্ঠা",
    size: "1.4 MB",
    emoji: "🔱",
    color: "from-teal-500 to-cyan-600",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: false,
  },
  {
    id: 14,
    title: "সত্যনারায়ণ ব্রতকথা",
    description: "সত্যনারায়ণ পূজার সম্পূর্ণ কথা ও বিধান",
    category: "others",
    pages: "১৮ পৃষ্ঠা",
    size: "2.5 MB",
    emoji: "🙏",
    color: "from-amber-500 to-orange-500",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: false,
  },
  {
    id: 15,
    title: "হিন্দু পঞ্জিকা ২০২৫",
    description: "সম্পূর্ণ বছরের তিথি, পূজার তারিখ ও শুভ মুহূর্ত",
    category: "others",
    pages: "৩০ পৃষ্ঠা",
    size: "4.5 MB",
    emoji: "📅",
    color: "from-blue-500 to-indigo-500",
    url: "", // ← এখানে আপনার PDF লিংক বসান
    featured: true,
  },
];

const categoryColors: Record<string, string> = {
  durga: "bg-red-100 text-red-700",
  kali: "bg-purple-100 text-purple-700",
  saraswati: "bg-indigo-100 text-indigo-700",
  others: "bg-orange-100 text-orange-700",
};

const categoryLabels: Record<string, string> = {
  durga: "দুর্গাপূজা",
  kali: "শ্যামাপূজা",
  saraswati: "সরস্বতী পূজা",
  others: "অন্যান্য",
};

export function PDFDownloads() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPDFs = selectedCategory === "all" 
    ? pdfList 
    : pdfList.filter(pdf => pdf.category === selectedCategory);

  const featuredPDFs = pdfList.filter(pdf => pdf.featured);

  const handleDownload = (pdf: typeof pdfList[0]) => {
    if (pdf.url) {
      window.open(pdf.url, "_blank");
    } else {
      alert(`"${pdf.title}" এর PDF লিংক এখনো যোগ করা হয়নি।\n\nযোগাযোগ করুন অথবা GitHub এ PDFDownloads.tsx ফাইলে url যোগ করুন।`);
    }
  };

  return (
    <section id="pdf" className="py-14 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 rounded-full px-5 py-2 text-sm font-hind mb-4 border border-orange-200">
            📥 PDF ডাউনলোড
          </div>
          <h2 className="font-bengali text-3xl md:text-4xl font-bold text-red-800 mb-3">
            পূজার ফর্দ ও <span className="text-orange-600">PDF সংগ্রহ</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 font-hind text-sm max-w-2xl mx-auto">
            দুর্গাপূজা, শ্যামাপূজা, সরস্বতী পূজাসহ বিভিন্ন পূজার ফর্দ, মন্ত্র ও নিয়মকানুন — বিনামূল্যে ডাউনলোড করুন
          </p>
        </div>

        {/* Featured PDFs */}
        <div className="mb-10">
          <h3 className="font-bengali text-xl font-bold text-red-800 mb-5 flex items-center gap-2">
            ⭐ জনপ্রিয় PDF
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredPDFs.map((pdf) => (
              <div
                key={pdf.id}
                className={`rounded-2xl overflow-hidden bg-gradient-to-br ${pdf.color} text-white shadow-lg card-hover cursor-pointer`}
                onClick={() => handleDownload(pdf)}
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {pdf.emoji}
                    </div>
                    <div>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-hind">
                        {categoryLabels[pdf.category]}
                      </span>
                      <h4 className="font-bengali text-sm font-bold mt-1 leading-snug">
                        {pdf.title}
                      </h4>
                    </div>
                  </div>
                  <p className="font-hind text-xs text-white/80 mt-3 line-clamp-2">
                    {pdf.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
                    <div className="flex gap-3">
                      <span className="font-hind text-xs text-white/70">📄 {pdf.pages}</span>
                      <span className="font-hind text-xs text-white/70">💾 {pdf.size}</span>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1.5 rounded-lg font-hind text-xs transition-colors">
                      ⬇️ ডাউনলোড
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {pdfCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-hind text-sm font-bold transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* PDF Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPDFs.map((pdf) => (
            <div
              key={pdf.id}
              className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden card-hover"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${pdf.color} p-4 flex items-center gap-3`}>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                  {pdf.emoji}
                </div>
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full font-hind ${categoryColors[pdf.category]}`}>
                    {categoryLabels[pdf.category]}
                  </span>
                  {pdf.featured && (
                    <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-hind font-bold">
                      ⭐ জনপ্রিয়
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h4 className="font-bengali text-base font-bold text-gray-800 mb-2 leading-snug">
                  {pdf.title}
                </h4>
                <p className="font-hind text-sm text-gray-600 mb-4 line-clamp-2">
                  {pdf.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-4 text-gray-500">
                  <span className="font-hind text-xs flex items-center gap-1">
                    📄 {pdf.pages}
                  </span>
                  <span className="font-hind text-xs flex items-center gap-1">
                    💾 {pdf.size}
                  </span>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(pdf)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-2.5 rounded-xl font-hind text-sm transition-all flex items-center justify-center gap-2"
                >
                  ⬇️ বিনামূল্যে ডাউনলোড
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Request PDF */}
        <div className="mt-10 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-3xl p-8 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="font-bengali text-2xl font-bold text-red-800 mb-3">
            আপনার প্রয়োজনীয় PDF নেই?
          </h3>
          <p className="font-hind text-sm text-gray-600 max-w-xl mx-auto mb-5">
            যদি কোনো বিশেষ পূজার ফর্দ, মন্ত্র বা নিয়মকানুনের PDF দরকার হয় — আমাদের জানান। আমরা যোগ করার চেষ্টা করব।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#contact"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-full font-hind text-sm transition-all"
            >
              📨 অনুরোধ পাঠান
            </a>
            <a
              href="mailto:durgapuja12@gmail.com"
              className="bg-white hover:bg-orange-50 text-orange-700 font-bold px-6 py-2.5 rounded-full font-hind text-sm border border-orange-300 transition-colors"
            >
              📧 ইমেইল করুন
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: "১৫+", label: "PDF ফাইল", emoji: "📄" },
            { num: "২০০+", label: "মোট পৃষ্ঠা", emoji: "📚" },
            { num: "৫০+", label: "মন্ত্র", emoji: "📿" },
            { num: "১০০%", label: "বিনামূল্যে", emoji: "🎁" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <p className="font-bengali text-2xl font-bold text-orange-600">{stat.num}</p>
              <p className="font-hind text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
