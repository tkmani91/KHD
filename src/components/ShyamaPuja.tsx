export function ShyamaPuja() {
  return (
    <section id="shyama" className="py-14 bg-gradient-to-b from-gray-900 via-indigo-950 to-purple-950 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white shimmer"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-900/60 text-purple-300 rounded-full px-5 py-2 text-sm font-hind mb-4 border border-purple-700">
            🌑 শ্যামাপূজা / কালীপূজা
          </div>
          <h2 className="font-bengali text-3xl md:text-5xl font-black text-white mb-3">
            মা <span className="text-yellow-300">কালীর</span> পূজা
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-yellow-400 mx-auto rounded-full mb-4"></div>
          <p className="text-purple-200 font-hind text-sm max-w-2xl mx-auto">
            শ্যামাপূজা বা কালীপূজা — কার্তিক অমাবস্যায় মা কালীর আরাধনা। কলম হিন্দু ধর্মসভায় প্রতি বছর বিশেষ আয়োজনে পালিত হয়।
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kali Description */}
            <div className="bg-white/5 border border-purple-700/50 rounded-3xl p-6 md:p-8 backdrop-blur">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center text-5xl shrink-0 shadow-lg">
                  🌑
                </div>
                <div>
                  <h3 className="font-bengali text-2xl font-bold text-yellow-300 mb-3">মা কালীর মাহাত্ম্য</h3>
                  <p className="font-hind text-purple-100 leading-relaxed text-sm">
                    মা কালী হলেন আদিশক্তির সর্বোচ্চ রূপ। তিনি কাল অর্থাৎ সময়ের দেবী এবং মৃত্যু, পরিবর্তন ও ধ্বংসের প্রতীক।
                    কিন্তু তিনি একই সাথে মাতৃস্নেহের প্রতীক — যিনি তাঁর সন্তানদের সকল বিপদ থেকে রক্ষা করেন।
                    মহাকাল তাঁর পায়ের নিচে শায়িত — এর অর্থ হলো তিনি কালকেও জয় করেছেন।
                  </p>
                </div>
              </div>
            </div>

            {/* Puja Info Grid */}
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                {
                  emoji: "🗓️",
                  title: "কালীপূজার তিথি ২০২৫",
                  color: "from-purple-700 to-indigo-700",
                  items: [
                    "তারিখ: ২০ অক্টোবর ২০২৫",
                    "কার্তিক কৃষ্ণ অমাবস্যা",
                    "নিশীথ পূজার সময়: রাত ১১:৪৭ – ১২:৪৪",
                    "প্রদীপ প্রজ্বলন: সন্ধ্যা ৬:০০"
                  ]
                },
                {
                  emoji: "🙏",
                  title: "পূজার বিশেষ নিয়ম",
                  color: "from-indigo-700 to-purple-800",
                  items: [
                    "অমাবস্যার রাতে পূজা করতে হয়",
                    "লাল জবা ফুল দিয়ে পূজা",
                    "মিষ্টি, ফল ও মাছ নিবেদন",
                    "প্রদীপ জ্বালিয়ে আরতি"
                  ]
                },
                {
                  emoji: "📿",
                  title: "কালী মন্ত্র",
                  color: "from-violet-700 to-purple-700",
                  items: [
                    "ওঁ ক্রীং কালিকায়ৈ নমঃ",
                    "ওঁ কালি কালি মহাকালি কালিকে পরমেশ্বরি",
                    "জয় জয় কালী মা — ১০৮ বার জপ",
                    "নমস্তস্যৈ নমস্তস্যৈ নমো নমঃ"
                  ]
                },
                {
                  emoji: "🔥",
                  title: "কলম ধর্মসভার আয়োজন",
                  color: "from-red-800 to-purple-800",
                  items: [
                    "বিশেষ সন্ধ্যা আরতি ও ভোগ",
                    "মহা হোম ও যজ্ঞ",
                    "ভক্তিমূলক সংগীত সন্ধ্যা",
                    "প্রসাদ বিতরণ — রাত ১২টার পর"
                  ]
                }
              ].map((card, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white/5 border border-purple-700/40 backdrop-blur">
                  <div className={`bg-gradient-to-r ${card.color} p-4 flex items-center gap-3`}>
                    <span className="text-2xl">{card.emoji}</span>
                    <h4 className="font-bengali text-base font-bold text-white">{card.title}</h4>
                  </div>
                  <div className="p-4 space-y-2">
                    {card.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-yellow-400 text-xs mt-1">✦</span>
                        <p className="font-hind text-sm text-purple-100">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Kali Stotra */}
            <div className="bg-white/5 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur">
              <h3 className="font-bengali text-lg font-bold text-yellow-300 mb-4 flex items-center gap-2">
                ✨ কালীর স্তোত্র
              </h3>
              <div className="space-y-3">
                <div className="bg-purple-900/50 rounded-xl p-4">
                  <p className="font-bengali text-sm text-white leading-relaxed">
                    "ক্রীং ক্রীং ক্রীং হ্রীং হ্রীং হূং হূং<br />
                    দক্ষিণে কালিকে ক্রীং ক্রীং ক্রীং<br />
                    হ্রীং হ্রীং হূং হূং স্বাহা।।"
                  </p>
                  <p className="font-hind text-xs text-purple-300 mt-2">— কালীকবচ</p>
                </div>
                <div className="bg-purple-900/50 rounded-xl p-4">
                  <p className="font-bengali text-sm text-white leading-relaxed">
                    "কালি কালি মহাকালি<br />
                    কালিকে পরমেশ্বরি।<br />
                    সর্বানন্দকরি দেবি<br />
                    নারায়ণি নমোস্তুতে।।"
                  </p>
                </div>
              </div>
            </div>

            {/* 108 Names */}
            <div className="bg-white/5 border border-purple-700/40 rounded-2xl p-5 backdrop-blur">
              <h3 className="font-bengali text-lg font-bold text-yellow-300 mb-4">🌺 মা কালীর নামসমূহ</h3>
              <div className="flex flex-wrap gap-2">
                {["কালী", "মহাকালী", "ভদ্রকালী", "কালরাত্রি", "চামুণ্ডা", "চণ্ডী", "মুণ্ডমালিনী", "শ্মশানকালী", "দক্ষিণাকালী", "মহামায়া", "আদ্যাকালী", "তারা"].map(name => (
                  <span key={name} className="text-xs bg-purple-800/60 text-purple-200 px-2.5 py-1 rounded-full font-hind border border-purple-600/40">
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-2xl p-5">
              <div className="text-3xl text-center mb-3">🪔</div>
              <p className="font-bengali text-sm text-yellow-200 text-center leading-relaxed">
                "জয় মা কালী!<br />সকলের অন্ধকার দূর করো,<br />আলো দাও হে মা।"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
