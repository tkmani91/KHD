const posts = [
  {
    id: 1,
    category: "দেবী মাহাত্ম্য",
    catColor: "bg-red-100 text-red-700",
    emoji: "👸",
    title: "মা দুর্গার আবির্ভাব — মহিষাসুর বধের পৌরাণিক কাহিনী",
    excerpt:
      "দেবাসুরের ভয়ংকর যুদ্ধে যখন দেবতারা পরাজিত হলেন, তখন ব্রহ্মা, বিষ্ণু ও মহেশ্বর মিলে তাঁদের তেজ থেকে সৃষ্টি করলেন মহাশক্তি দুর্গাকে। দেবী দুর্গা দশ হাতে দশটি অস্ত্র ধারণ করে মহিষাসুরকে বধ করেন। এই পৌরাণিক কাহিনীই দুর্গাপূজার মূল ভিত্তি।",
    date: "১ অক্টোবর ২০২৫",
    readTime: "৮ মিনিট",
    bgGradient: "from-red-500 to-orange-600",
    featured: true,
  },
  {
    id: 2,
    category: "পৌরাণিক",
    catColor: "bg-orange-100 text-orange-700",
    emoji: "📜",
    title: "দেবীর দশটি হাত — প্রতিটি অস্ত্রের অর্থ ও তাৎপর্য",
    excerpt:
      "মা দুর্গার দশটি হাতে দশটি ভিন্ন অস্ত্র রয়েছে। প্রতিটি অস্ত্র একটি বিশেষ শক্তির প্রতীক। ত্রিশূল, চক্র, তলোয়ার, ধনুক — প্রতিটি দেবতার দেওয়া বিশেষ উপহার।",
    date: "২ অক্টোবর ২০২৫",
    readTime: "৬ মিনিট",
    bgGradient: "from-orange-500 to-yellow-500",
  },
  {
    id: 3,
    category: "সংস্কৃতি",
    catColor: "bg-yellow-100 text-yellow-700",
    emoji: "🏺",
    title: "বাংলায় দুর্গাপূজার ইতিহাস — কবে শুরু হয়েছিল এই উৎসব?",
    excerpt:
      "বাংলায় দুর্গাপূজার ইতিহাস অনেক প্রাচীন। কথিত আছে রামচন্দ্র অকালে (শরৎকালে) দেবীকে জাগ্রত করে পূজা করেছিলেন। এই অকালবোধনই আজকের শারদীয় দুর্গোৎসবের ভিত্তি।",
    date: "৩ অক্টোবর ২০২৫",
    readTime: "১০ মিনিট",
    bgGradient: "from-yellow-500 to-red-500",
  },
];

const recentPosts = [
  { emoji: "🌺", title: "দেবী দুর্গার ১০৮ নাম ও তাদের অর্থ", category: "মাহাত্ম্য", date: "৪ অক্টোবর ২০২৫" },
  { emoji: "📖", title: "শ্রী শ্রী চণ্ডীপাঠের নিয়ম ও ফল", category: "মন্ত্র", date: "৫ অক্টোবর ২০২৫" },
  { emoji: "🪔", title: "মহিষাসুরমর্দিনী — বীরেন্দ্রকৃষ্ণ ভদ্রের অমর রচনা", category: "সংগীত", date: "৬ অক্টোবর ২০২৫" },
  { emoji: "🏺", title: "কুমারী পূজার তাৎপর্য ও বিধান", category: "বিধি", date: "৭ অক্টোবর ২০২৫" },
  { emoji: "🌸", title: "দেবী দুর্গার বিভিন্ন রূপ — কালী, চামুণ্ডা, দশভুজা", category: "মাহাত্ম্য", date: "৮ অক্টোবর ২০২৫" },
];

export function DeviMahatmya() {
  return (
    <section id="mahatmya" className="py-14 max-w-7xl mx-auto px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 rounded-full px-4 py-2 text-sm font-hind mb-4">
          👸 দেবী মাহাত্ম্য
        </div>
        <h2 className="font-bengali text-3xl md:text-4xl font-bold text-red-800 mb-3">
          মা দুর্গার কথা ও পৌরাণিক কাহিনী
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Posts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured */}
          <div className="card-hover rounded-3xl overflow-hidden bg-white shadow-md border border-orange-100">
            <div className={`h-52 bg-gradient-to-br ${posts[0].bgGradient} flex items-center justify-center relative overflow-hidden`}>
              <div className="text-9xl float-anim">{posts[0].emoji}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-400 text-red-900 font-bold text-xs px-3 py-1.5 rounded-full font-hind">
                  ⭐ ফিচারড
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full font-hind ${posts[0].catColor}`}>
                  {posts[0].category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-gray-400 font-hind">{posts[0].date}</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-400 font-hind">⏱ {posts[0].readTime}</span>
              </div>
              <h3 className="font-bengali text-xl font-bold text-gray-800 mb-3 hover:text-red-700 cursor-pointer leading-snug">
                {posts[0].title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-hind mb-4">{posts[0].excerpt}</p>
              <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-sm px-5 py-2 rounded-full font-hind hover:opacity-90 transition-opacity">
                বিস্তারিত পড়ুন →
              </button>
            </div>
          </div>

          {/* Two Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {posts.slice(1).map((post) => (
              <div key={post.id} className="card-hover rounded-2xl overflow-hidden bg-white shadow-md border border-orange-100">
                <div className={`h-36 bg-gradient-to-br ${post.bgGradient} flex items-center justify-center relative`}>
                  <div className="text-6xl">{post.emoji}</div>
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full font-hind ${post.catColor}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 font-hind mb-2">{post.date} · ⏱ {post.readTime}</p>
                  <h3 className="font-bengali text-base font-bold text-gray-800 mb-2 hover:text-red-700 cursor-pointer leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-hind mb-3 line-clamp-3">{post.excerpt}</p>
                  <button className="text-orange-600 font-bold text-xs hover:text-red-700 font-hind">
                    আরও পড়ুন →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Posts */}
          <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6">
            <h3 className="font-bengali text-xl font-bold text-red-800 mb-5 flex items-center gap-2 pb-3 border-b border-orange-100">
              🔥 সাম্প্রতিক পোস্ট
            </h3>
            <div className="space-y-4">
              {recentPosts.map((post, i) => (
                <div key={i} className="flex gap-3 items-start group cursor-pointer pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg shrink-0">
                    {post.emoji}
                  </div>
                  <div>
                    <p className="font-hind text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors leading-snug mb-1">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-orange-500 font-hind">{post.category}</span>
                      <span className="text-gray-300 text-xs">|</span>
                      <span className="text-xs text-gray-400 font-hind">{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About Blog */}
          <div className="bg-gradient-to-br from-red-700 to-orange-600 rounded-2xl p-6 text-white">
            <div className="text-4xl text-center mb-3">🪔</div>
            <h3 className="font-bengali text-lg font-bold text-center text-yellow-200 mb-3">এই ব্লগ সম্পর্কে</h3>
            <p className="font-hind text-sm text-orange-100 leading-relaxed text-center">
              Durgapuja12.blogspot.com হলো দুর্গাপূজার সম্পূর্ণ তথ্যভান্ডার। এখানে পাবেন মন্ত্র, বিধান, পৌরাণিক কাহিনী ও উৎসবের সম্পূর্ণ গাইড।
            </p>
            <button className="mt-4 w-full bg-yellow-400 text-red-900 font-bold py-2 rounded-xl font-hind text-sm hover:bg-yellow-300 transition-colors">
              আরও জানুন
            </button>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6">
            <h3 className="font-bengali text-lg font-bold text-red-800 mb-4 pb-3 border-b border-orange-100">🏷️ বিষয়ভিত্তিক ট্যাগ</h3>
            <div className="flex flex-wrap gap-2">
              {["দুর্গাপূজা", "মন্ত্র", "স্তোত্র", "মহিষাসুর", "মহালয়া", "চণ্ডীপাঠ", "অষ্টমী", "সন্ধিপূজা", "বিসর্জন", "সিঁদুরখেলা", "আরতি", "প্রসাদ", "ভোগ", "নবমী"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full cursor-pointer transition-colors font-hind border border-orange-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
