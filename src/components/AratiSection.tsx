const aratis = [
  {
    title: "মহাআরতি — জয় জয় দেবী",
    type: "সন্ধ্যা আরতি",
    emoji: "🪔",
    color: "from-red-500 to-orange-500",
    lyrics: [
      "জয় জয় দেবী চরাচর সারে,",
      "কুচযুগশোভিত মুক্তাহারে।",
      "বীণারঞ্জিত পুস্তক হস্তে,",
      "ভগবতী ভারতী দেবী নমস্তে।।",
      "",
      "নমো নমো নমো নমো নারায়ণী,",
      "অষ্টাদশভুজে মহাশক্তি রূপিণী।",
    ],
  },
  {
    title: "দুর্গামায়ের আরতি",
    type: "প্রাতঃ আরতি",
    emoji: "🌅",
    color: "from-orange-500 to-yellow-500",
    lyrics: [
      "ও জগতজননী মা দুর্গে,",
      "তোমারি চরণে লুটিয়ে পড়ি।",
      "দশভুজা তুমি মা দশপ্রহরণী,",
      "সিংহবাহিনী মহিষমর্দিনী।।",
      "",
      "তোমার পায়ের ধূলো মাথায় নিয়ে,",
      "ধন্য করো মা আমায় তুমি দেখি।",
    ],
  },
  {
    title: "ধূপ আরতি মন্ত্র",
    type: "ধূপ আরতি",
    emoji: "🕯️",
    color: "from-amber-500 to-red-500",
    lyrics: [
      "এষ ধূপঃ ওঁ দুর্গায়ৈ নমঃ।",
      "এষ দীপঃ ওঁ দুর্গায়ৈ নমঃ।",
      "",
      "ওঁ নমশ্চণ্ডিকায়ৈ।",
      "ওঁ নমো ভগবতে মহামায়ায়ৈ,",
      "নমো নারায়ণ্যৈ নমঃ।।",
    ],
  },
];

const stotras = [
  {
    title: "দেবী সূক্ত",
    shloka: "অহং রুদ্রেভির্বসুভিশ্চরাম্যহমাদিত্যৈরুত বিশ্বদেবৈঃ।\nঅহং মিত্রাবরুণোভা বিভর্ম্যহমিন্দ্রাগ্নী অহমশ্বিনোভা॥",
    meaning: "আমি রুদ্র ও বসুগণের সাথে চলি, আমি আদিত্য ও বিশ্বদেবগণের সাথে থাকি।",
    emoji: "📿",
  },
  {
    title: "মহিষাসুরমর্দিনী স্তোত্র",
    shloka: "অয়ি গিরিনন্দিনি নন্দিতমেদিনি বিশ্ববিনোদিনি নন্দনুতে।\nগিরিবরবিন্ধ্যশিরোধিনিবাসিনি বিষ্ণুবিলাসিনি জিষ্ণুনুতে॥",
    meaning: "হে গিরিনন্দিনী! হে পৃথিবীর আনন্দদায়িনী! হে বিন্ধ্যশিখরনিবাসিনী! আপনাকে প্রণাম।",
    emoji: "🎵",
  },
  {
    title: "দুর্গাষ্টোত্তর শতনামাবলী (অংশ)",
    shloka: "দুর্গা শিবা মহালক্ষ্মী মহাগৌরী চ চণ্ডিকা।\nসর্বজ্ঞা সর্বলোকেশী সর্বকর্মফলপ্রদা॥",
    meaning: "দুর্গা, শিবা, মহালক্ষ্মী, মহাগৌরী, চণ্ডিকা — তিনি সর্বজ্ঞ ও সর্বলোকের ঈশ্বরী।",
    emoji: "📖",
  },
];

export function AratiSection() {
  return (
    <section id="arati" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 rounded-full px-4 py-2 text-sm font-hind mb-4">
            🪔 আরতি ও স্তব
          </div>
          <h2 className="font-bengali text-3xl md:text-4xl font-bold text-red-800 mb-3">
            দুর্গামায়ের আরতি, স্তোত্র ও স্তব
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 font-hind text-sm">মায়ের আরতি ও স্তোত্র পাঠ করুন ভক্তিভরে</p>
        </div>

        {/* Arati Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {aratis.map((arati, i) => (
            <div key={i} className="card-hover bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden">
              <div className={`bg-gradient-to-r ${arati.color} p-4`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    {arati.emoji}
                  </div>
                  <div>
                    <span className="text-xs font-hind text-white/70">{arati.type}</span>
                    <h3 className="font-bengali text-base font-bold text-white leading-tight">{arati.title}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 p-5 border-b border-orange-100">
                <div className="space-y-1">
                  {arati.lyrics.map((line, j) => (
                    <p key={j} className={`font-bengali text-sm leading-relaxed ${line === "" ? "h-2" : "text-gray-800"}`}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <button className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold py-2.5 rounded-xl font-hind text-sm border border-orange-200 transition-colors">
                  📖 সম্পূর্ণ আরতি পড়ুন
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stotras */}
        <div className="mb-6">
          <h3 className="font-bengali text-2xl font-bold text-red-800 mb-6 text-center">📿 দেবীর স্তোত্র ও শ্লোক</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {stotras.map((stotra, i) => (
              <div key={i} className="card-hover bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-700 to-orange-600 p-4 flex items-center gap-3">
                  <span className="text-2xl">{stotra.emoji}</span>
                  <h4 className="font-bengali text-sm font-bold text-white">{stotra.title}</h4>
                </div>
                <div className="bg-amber-50 p-4 border-b border-orange-100">
                  <p className="font-bengali text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                    {stotra.shloka}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 font-hind leading-relaxed">
                    <span className="text-orange-600 font-bold">অর্থ: </span>{stotra.meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Note */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🎵</div>
          <h3 className="font-bengali text-xl font-bold text-red-800 mb-2">মহিষাসুরমর্দিনী</h3>
          <p className="font-hind text-sm text-gray-600 max-w-xl mx-auto">
            বীরেন্দ্রকৃষ্ণ ভদ্রের কণ্ঠে মহালয়ার ভোরে প্রচারিত 'মহিষাসুরমর্দিনী' — প্রতি বছর আশ্বিন মাসে মহালয়ার ভোর চারটায় অল ইন্ডিয়া রেডিওতে প্রচারিত হয় এই অনন্য সৃষ্টি।
          </p>
        </div>
      </div>
    </section>
  );
}
