const pujaDays = [
  {
    day: "মহাষষ্ঠী",
    date: "১৭ অক্টোবর ২০২৬",
    tithi: "আশ্বিন শুক্লা ষষ্ঠী",
    events: ["দেবীর বোধন", "আমন্ত্রণ", "অধিবাস"],
    emoji: "🌸",
    color: "from-pink-500 to-rose-500",
    dayNum: "৬ষ্ঠ",
    special: "দেবীর জাগরণ",
  },
  {
    day: "মহাসপ্তমী",
    date: "১৮ অক্টোবর ২০২৬",
    tithi: "আশ্বিন শুক্লা সপ্তমী",
    events: ["নবপত্রিকা স্নান", "কলাবউ পূজা", "সপ্তমী পূজা"],
    emoji: "🌿",
    color: "from-green-500 to-teal-500",
    dayNum: "৭ম",
    special: "নবপত্রিকা",
  },
  {
    day: "মহাষ্টমী",
    date: "১৯ অক্টোবর ২০২৬",
    tithi: "আশ্বিন শুক্লা অষ্টমী",
    events: ["কুমারী পূজা", "সন্ধিপূজা", "অষ্টমী বলি"],
    emoji: "🪔",
    color: "from-orange-500 to-red-600",
    dayNum: "৮ম",
    special: "সবচেয়ে পবিত্র দিন",
    highlight: true,
  },
  {
    day: "মহানবমী",
    date: "২০ অক্টোবর ২০২৬",
    tithi: "আশ্বিন শুক্লা নবমী",
    events: ["হোম যজ্ঞ", "নবমী পূজা", "মহাভোগ নিবেদন"],
    emoji: "🥁",
    color: "from-red-600 to-orange-700",
    dayNum: "৯ম",
    special: "মহাযজ্ঞ",
  },
  {
    day: "বিজয়াদশমী",
    date: "২১ অক্টোবর ২০২৬",
    tithi: "আশ্বিন শুক্লা দশমী",
    events: ["সিঁদুরখেলা", "বিসর্জন", "বিজয়া কোলাকুলি"],
    emoji: "💧",
    color: "from-blue-500 to-indigo-600",
    dayNum: "১০ম",
    special: "বিদায়ের দিন",
  },
];

const importantTimes = [
  { event: "মহালয়া", date: "১০ অক্টোবর ২০২৬", time: "ভোর ৪:৩০", note: "দেবীপক্ষ শুরু" },
  { event: "ষষ্ঠীর বোধন", date: "১৭ অক্টোবর ২০২৬", time: "বিকাল ৫:১৫", note: "শুভ মুহূর্ত" },
  { event: "সপ্তমীর নবপত্রিকা", date: "১৮ অক্টোবর ২০২৬", time: "ভোর ৫:০০", note: "পুণ্য স্নান" },
  { event: "অষ্টমীর পুষ্পাঞ্জলি", date: "১৯ অক্টোবর ২০২৬", time: "সকাল ৯:৩০", note: "শুভ যোগ" },
  { event: "সন্ধিপূজা", date: "১৯ অক্টোবর ২০২৬", time: "রাত ১০:০০", note: "অষ্টমী-নবমী সন্ধি" },
  { event: "দশমীর বিসর্জন", date: "২১ অক্টোবর ২০২৬", time: "বিকাল ৩:০০", note: "বিজয়া শুরু" },
];

export function CalendarSection() {
  return (
    <section id="calendar" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 rounded-full px-4 py-2 text-sm font-hind mb-4">
            🗓️ তিথি ও সময়সূচি
          </div>
          <h2 className="font-bengali text-3xl md:text-4xl font-bold text-red-800 mb-3">
            দুর্গাপূজা ২০২৬ — তিথি ও ক্যালেন্ডার
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 font-hind text-sm">পূজার পাঁচ দিনের সম্পূর্ণ সময়সূচি ও গুরুত্বপূর্ণ মুহূর্তসমূহ</p>
        </div>

        {/* Puja Days */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {pujaDays.map((day, i) => (
            <div
              key={i}
              className={`card-hover rounded-2xl overflow-hidden shadow-md ${day.highlight ? "ring-2 ring-orange-500 ring-offset-2" : ""}`}
            >
              <div className={`bg-gradient-to-br ${day.color} p-5 text-white text-center relative`}>
                {day.highlight && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-red-900 text-xs font-bold px-2 py-0.5 rounded-full font-hind">
                    ✨ বিশেষ
                  </div>
                )}
                <div className="text-4xl mb-2">{day.emoji}</div>
                <div className="text-xs font-hind bg-white/20 rounded-full px-2 py-0.5 inline-block mb-2">{day.dayNum} দিন</div>
                <h3 className="font-bengali text-base font-bold leading-snug">{day.day}</h3>
              </div>
              <div className="bg-white p-4">
                <p className="text-xs text-orange-600 font-hind font-bold mb-1">{day.date}</p>
                <p className="text-xs text-gray-500 font-hind mb-3">{day.tithi}</p>
                <ul className="space-y-1 mb-3">
                  {day.events.map((ev, j) => (
                    <li key={j} className="flex items-center gap-1.5 text-xs text-gray-700 font-hind">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                      {ev}
                    </li>
                  ))}
                </ul>
                <div className="bg-orange-50 rounded-lg px-2 py-1 text-center">
                  <p className="text-xs text-orange-700 font-hind font-medium">{day.special}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Times Table */}
        <div className="bg-white rounded-3xl shadow-md border border-orange-100 overflow-hidden">
          <div className="animated-gradient p-5 text-white text-center">
            <h3 className="font-bengali text-xl font-bold">⏰ গুরুত্বপূর্ণ পূজার মুহূর্ত ও সময়</h3>
            <p className="font-hind text-sm text-orange-100 mt-1">শুভ মুহূর্তে পূজা করুন — বিশেষ ফল পান</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-50">
                <tr>
                  <th className="text-left px-6 py-3 font-bengali text-sm text-red-800">অনুষ্ঠান</th>
                  <th className="text-left px-6 py-3 font-bengali text-sm text-red-800">তারিখ</th>
                  <th className="text-left px-6 py-3 font-bengali text-sm text-red-800">সময়</th>
                  <th className="text-left px-6 py-3 font-bengali text-sm text-red-800">বিশেষ নোট</th>
                </tr>
              </thead>
              <tbody>
                {importantTimes.map((item, i) => (
                  <tr key={i} className={`border-t border-orange-50 ${i % 2 === 0 ? "bg-white" : "bg-orange-50/30"} hover:bg-orange-50 transition-colors`}>
                    <td className="px-6 py-4 font-bengali text-sm font-bold text-gray-800">{item.event}</td>
                    <td className="px-6 py-4 font-hind text-sm text-gray-700">{item.date}</td>
                    <td className="px-6 py-4">
                      <span className="bg-orange-100 text-orange-700 font-bold text-xs px-3 py-1 rounded-full font-hind">
                        {item.time}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-hind text-xs text-gray-500">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
