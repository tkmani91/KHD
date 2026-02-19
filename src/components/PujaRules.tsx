const rulesData = [
  {
    step: "০১",
    title: "পূজার প্রস্তুতি",
    emoji: "🛁",
    color: "bg-pink-100 text-pink-700 border-pink-200",
    dotColor: "bg-pink-500",
    items: [
      "পূজার আগে স্নান করে শুদ্ধ বস্ত্র পরিধান করুন",
      "পূজার স্থান পরিষ্কার করুন",
      "ফুল, বেলপাতা, ধূপ, দীপ, পঞ্চামৃত প্রস্তুত রাখুন",
      "কুমড়ো, কলা, নারকেল, মিষ্টি, ভোগ তৈরি রাখুন",
    ],
  },
  {
    step: "০২",
    title: "আসন গ্রহণ ও আচমন",
    emoji: "🧘",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    dotColor: "bg-orange-500",
    items: [
      "পূর্বমুখে বা উত্তরমুখে বসুন",
      "আচমন করুন — তিনবার জল স্পর্শ করে ওম বিষ্ণু উচ্চারণ করুন",
      "প্রাণায়াম করুন",
      "সংকল্প নিন — পূজার উদ্দেশ্য মনে মনে ঠিক করুন",
    ],
  },
  {
    step: "০৩",
    title: "গণেশ পূজা",
    emoji: "🐘",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dotColor: "bg-yellow-500",
    items: [
      "যেকোনো পূজার আগে গণেশ পূজা করুন",
      "মন্ত্র: 'ওঁ গং গণপতয়ে নমঃ'",
      "দুর্বাঘাস, মোদক, সিঁদুর নিবেদন করুন",
      "গণেশের প্রতিমা বা ছবিতে ফুল দিন",
    ],
  },
  {
    step: "০৪",
    title: "দেবী দুর্গার আবাহন",
    emoji: "🌺",
    color: "bg-red-100 text-red-700 border-red-200",
    dotColor: "bg-red-500",
    items: [
      "ষোড়শোপচারে দেবীর পূজা করুন",
      "ধূপ, দীপ, নৈবেদ্য নিবেদন করুন",
      "পুষ্পাঞ্জলি দিন — ফুল হাতে মন্ত্র পাঠ করুন",
      "প্রণাম মন্ত্র: 'ওঁ সর্বমঙ্গলমঙ্গল্যে...'",
    ],
  },
  {
    step: "০৫",
    title: "ভোগ নিবেদন",
    emoji: "🍚",
    color: "bg-green-100 text-green-700 border-green-200",
    dotColor: "bg-green-500",
    items: [
      "খিচুড়ি, লুচি, সন্দেশ, ফল নিবেদন করুন",
      "ভোগের পাত্র দেবীর সামনে রাখুন",
      "ভোগ মন্ত্র পাঠ করুন",
      "আরতি করে ভোগ প্রসাদ হিসেবে বিতরণ করুন",
    ],
  },
  {
    step: "০৬",
    title: "আরতি ও বিদায়",
    emoji: "🪔",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
    items: [
      "পঞ্চপ্রদীপ দিয়ে আরতি করুন",
      "ঢাক-ঢোল বাজান, শঙ্খ দিন",
      "উলুধ্বনি দিন",
      "দশমীতে বিসর্জন মন্ত্র পড়ে মাকে বিদায় দিন",
    ],
  },
];

const materials = [
  { name: "লাল জবা ফুল", emoji: "🌺", must: true },
  { name: "বেলপাতা", emoji: "🍃", must: true },
  { name: "ধূপ/অগরবাতি", emoji: "🕯️", must: true },
  { name: "পঞ্চামৃত", emoji: "🥛", must: true },
  { name: "নারকেল", emoji: "🥥", must: true },
  { name: "কলার মোচা", emoji: "🍌", must: false },
  { name: "হলুদ", emoji: "🟡", must: false },
  { name: "সিঁদুর", emoji: "🔴", must: true },
  { name: "পান-সুপারি", emoji: "🌿", must: false },
  { name: "দধি-মধু", emoji: "🍯", must: true },
];

export function PujaRules() {
  return (
    <section id="rules" className="py-14 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 rounded-full px-4 py-2 text-sm font-hind mb-4">
            🏠 ঘরে পূজার বিধি
          </div>
          <h2 className="font-bengali text-3xl md:text-4xl font-bold text-red-800 mb-3">
            ঘরে দুর্গাপূজার সম্পূর্ণ নিয়ম
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 font-hind text-sm max-w-2xl mx-auto">
            ঘরে বসেই মায়ের পূজা করুন — ধাপে ধাপে সহজ নিয়মে
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Steps */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-5">
              {rulesData.map((rule, i) => (
                <div key={i} className={`card-hover bg-white rounded-2xl border ${rule.color.split(' ')[2]} shadow-sm overflow-hidden`}>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${rule.color}`}>
                        {rule.emoji}
                      </div>
                      <div>
                        <span className={`text-xs font-bold font-hind ${rule.color.split(' ')[1]}`}>ধাপ {rule.step}</span>
                        <h3 className="font-bengali text-base font-bold text-gray-800 leading-tight">{rule.title}</h3>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {rule.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600 font-hind">
                          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${rule.dotColor}`}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Materials */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden">
              <div className="animated-gradient p-4 text-white text-center">
                <h3 className="font-bengali text-lg font-bold">পূজার উপকরণ তালিকা</h3>
                <p className="font-hind text-xs text-orange-100 mt-1">পূজার আগে এই জিনিসগুলো সংগ্রহ করুন</p>
              </div>
              <div className="p-4 space-y-2">
                {materials.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.emoji}</span>
                      <span className="font-hind text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full font-hind ${item.must ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                      {item.must ? "আবশ্যিক" : "ঐচ্ছিক"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-orange-200 p-5">
              <h3 className="font-bengali text-lg font-bold text-red-800 mb-4">💡 বিশেষ পরামর্শ</h3>
              <ul className="space-y-3">
                {[
                  "পূজার সময় মনে শুদ্ধ ভাব রাখুন",
                  "সংস্কৃত মন্ত্র না জানলে বাংলায় প্রার্থনা করুন",
                  "পরিবারের সকলে মিলে পূজা করুন",
                  "পূজার পর প্রসাদ সকলকে বিতরণ করুন",
                  "দশমীতে মাকে ভালোবেসে বিদায় দিন",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 font-hind text-sm text-gray-700">
                    <span className="text-orange-500 font-bold shrink-0">✓</span>
                    {tip}
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
