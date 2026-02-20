export function SaraswatiPuja() {
  return (
    <section id="saraswati" className="py-14 bg-gradient-to-b from-yellow-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 rounded-full px-5 py-2 text-sm font-hind mb-4 border border-yellow-300">
            🎵 সরস্বতী পূজা
          </div>
          <h2 className="font-bengali text-3xl md:text-5xl font-black text-indigo-800 mb-3">
            বিদ্যার দেবী <span className="text-yellow-500">মা সরস্বতী</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 font-hind text-sm max-w-2xl mx-auto">
            মাঘ মাসের শুক্লা পঞ্চমীতে বিদ্যার দেবী মা সরস্বতীর আরাধনা। কলম হিন্দু ধর্মসভায় প্রতি বছর বিশেষ উৎসাহে পালিত হয়।
          </p>
        </div>

        {/* Hero Banner */}
        <div
          className="rounded-3xl p-8 md:p-12 text-white mb-10 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 40%, #7c3aed 70%, #f59e0b 100%)" }}
        >
          <div className="absolute inset-0 opacity-5 pattern-bg"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="font-bengali text-2xl md:text-3xl font-bold text-yellow-200 mb-3">
                সরস্বতী বন্দনা
              </h3>
              <p className="font-bengali text-base leading-relaxed text-white/90">
                "নমস্তে শারদে দেবি কাশ্মীরপুরবাসিনি।<br />
                ত্বামহং প্রার্থয়े নিত্যং বিদ্যাদানং চ দেহি মে।।"
              </p>
              <p className="font-hind text-sm text-yellow-200 mt-3">
                হে শারদ দেবী! তোমাকে প্রণাম। আমাকে বিদ্যা দান করো।
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: "📚", title: "বিদ্যার দেবী", sub: "জ্ঞান ও প্রজ্ঞার আধার" },
                { emoji: "🎸", title: "সংগীতের দেবী", sub: "বীণাপাণি মা সরস্বতী" },
                { emoji: "🌸", title: "বসন্তপঞ্চমী", sub: "মাঘ মাসে পূজা" },
                { emoji: "📿", title: "শ্বেতবর্ণা", sub: "পবিত্রতার প্রতীক" },
              ].map((item) => (
                <div key={item.title} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <p className="font-bengali text-sm font-bold text-yellow-200">{item.title}</p>
                  <p className="font-hind text-xs text-white/60 mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Puja Details */}
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                {
                  emoji: "🗓️",
                  title: "সরস্বতী পূজা ২০২৬",
                  color: "bg-indigo-50 border-indigo-200",
                  titleColor: "text-indigo-800",
                  items: [
                    { label: "তারিখ", value: "২ ফেব্রুয়ারি ২০২৬" },
                    { label: "তিথি", value: "মাঘ শুক্লা পঞ্চমী" },
                    { label: "পূজার সময়", value: "সকাল ৭:০০ – ১১:০০" },
                    { label: "প্রসাদ বিতরণ", value: "দুপুর ১২:০০" },
                  ]
                },
                {
                  emoji: "🌸",
                  title: "পূজার উপকরণ",
                  color: "bg-yellow-50 border-yellow-200",
                  titleColor: "text-yellow-800",
                  items: [
                    { label: "ফুল", value: "সাদা ফুল, পদ্ম" },
                    { label: "প্রসাদ", value: "খিচুড়ি, বাসন্তী হালুয়া" },
                    { label: "বিশেষ", value: "বই ও কলম রাখতে হয়" },
                    { label: "পোশাক", value: "হলুদ/সাদা শাড়ি-পাঞ্জাবি" },
                  ]
                }
              ].map((card, i) => (
                <div key={i} className={`rounded-2xl border ${card.color} p-5 card-hover`}>
                  <h4 className={`font-bengali text-lg font-bold ${card.titleColor} mb-4 flex items-center gap-2`}>
                    <span>{card.emoji}</span> {card.title}
                  </h4>
                  <div className="space-y-3">
                    {card.items.map((item, j) => (
                      <div key={j} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <span className="font-hind text-sm text-gray-500">{item.label}</span>
                        <span className="font-hind text-sm font-bold text-gray-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mantra Cards */}
            <div>
              <h3 className="font-bengali text-2xl font-bold text-indigo-800 mb-5 flex items-center gap-2">
                📿 সরস্বতী পূজার মন্ত্র
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "ধ্যানমন্ত্র",
                    skt: "ওঁ সরস্বত্যৈ নমঃ\nওঁ শ্বেতপদ্মাসনা দেবী শ্বেতপুষ্পোপশোভিতা\nশ্বেতাম্বরধরা নিত্যা শ্বেতাগন্ধানুলেপনা।।",
                    color: "from-indigo-500 to-purple-500"
                  },
                  {
                    title: "পুষ্পাঞ্জলি মন্ত্র",
                    skt: "নমো সরস্বত্যৈ মহাবিদ্যায়ৈ\nব্রহ্মাণ্যৈ ব্রহ্মণঃ প্রিয়ায়ৈ\nবাগীশ্বর্যৈ নমো নিত্যং\nসর্বকল্যাণকারিণ্যৈ।।",
                    color: "from-yellow-500 to-orange-500"
                  },
                  {
                    title: "বরদা মন্ত্র",
                    skt: "সরস্বতি মহাভাগে বিদ্যে কমললোচনে।\nবিদ্যারূপে বিশালাক্ষি বিদ্যাং দেহি নমোস্তুতে।।",
                    color: "from-pink-500 to-rose-500"
                  },
                  {
                    title: "প্রণাম মন্ত্র",
                    skt: "ওঁ যা কুন্দেন্দুতুষারহারধবলা\nযা শুভ্রবস্ত্রাবৃতা।\nযা বীণাবরদণ্ডমণ্ডিতকরা\nযা শ্বেতপদ্মাসনা।।",
                    color: "from-teal-500 to-cyan-500"
                  }
                ].map((m, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden shadow-md border border-gray-100 card-hover">
                    <div className={`bg-gradient-to-r ${m.color} px-4 py-3`}>
                      <h4 className="font-bengali text-sm font-bold text-white">{m.title}</h4>
                    </div>
                    <div className="bg-yellow-50 p-4">
                      <p className="font-bengali text-sm text-gray-800 leading-relaxed whitespace-pre-line">{m.skt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About */}
            <div className="bg-gradient-to-br from-indigo-700 to-purple-700 rounded-2xl p-6 text-white">
              <div className="text-4xl text-center mb-3">🎵</div>
              <h3 className="font-bengali text-lg font-bold text-center text-yellow-200 mb-3">মা সরস্বতী সম্পর্কে</h3>
              <p className="font-hind text-sm text-indigo-100 leading-relaxed">
                মা সরস্বতী হলেন বিদ্যা, বুদ্ধি, সংগীত ও শিল্পকলার দেবী। তিনি শ্বেতবর্ণা, শ্বেতপদ্মে আসীন এবং হাতে বীণা, বেদ, জপমালা ও কমণ্ডলু ধারণ করেন।
              </p>
            </div>

            {/* Traditions */}
            <div className="bg-white rounded-2xl shadow-md border border-yellow-100 p-5">
              <h3 className="font-bengali text-lg font-bold text-indigo-800 mb-4 border-b border-yellow-100 pb-3">
                📖 পূজার রীতি ও ঐতিহ্য
              </h3>
              <div className="space-y-3">
                {[
                  { emoji: "📚", text: "ছাত্রছাত্রীরা বই-খাতা পূজায় রাখে" },
                  { emoji: "🚫", text: "পূজার দিন পড়াশোনা নিষিদ্ধ" },
                  { emoji: "🍚", text: "খিচুড়ি ভোগ বিশেষ প্রচলন" },
                  { emoji: "🌸", text: "বাসন্তী রঙের শাড়ি পরার রেওয়াজ" },
                  { emoji: "🎵", text: "সংগীত প্রতিযোগিতা ও অনুষ্ঠান" },
                  { emoji: "🦢", text: "হাঁস মা সরস্বতীর বাহন" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center">{item.emoji}</span>
                    <p className="font-hind text-sm text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Club Celebration */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-5">
              <h3 className="font-bengali text-lg font-bold text-orange-800 mb-3">🛕 ধর্মসভার আয়োজন</h3>
              <ul className="space-y-2">
                {[
                  "বিশেষ পুষ্পাঞ্জলি সকাল ৯টায়",
                  "সাংস্কৃতিক অনুষ্ঠান দুপুরে",
                  "রচনা ও চিত্রাঙ্কন প্রতিযোগিতা",
                  "ছাত্রছাত্রীদের মেধা পুরস্কার",
                  "সন্ধ্যায় আলোচনা সভা"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 font-hind text-sm text-gray-700">
                    <span className="text-yellow-500 font-bold mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
