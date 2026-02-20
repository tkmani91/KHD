import { useState, useEffect, useCallback } from "react";

// ============================================================
// 📅 দুর্গাপূজার তারিখ পরিবর্তন করতে এখানে এডিট করুন
// ফরম্যাট: new Date("YYYY-MM-DDTHH:MM:SS")
// ============================================================
const PUJA_DATE = "2026-10-17T05:00:00"; // মহাষষ্ঠী ২০২৬

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function Countdown() {
  // ✅ Calculate time left function
  const getTimeLeft = useCallback((): TimeLeft => {
    const now = new Date().getTime();
    const target = new Date(PUJA_DATE).getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      total: diff,
    };
  }, []);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);
  const [mounted, setMounted] = useState(false);

  // ✅ রিয়েল-টাইম কাউন্টডাউন — প্রতি সেকেন্ডে আপডেট
  useEffect(() => {
    setMounted(true);
    
    // প্রথমে একবার আপডেট করি
    setTimeLeft(getTimeLeft());
    
    // প্রতি ১ সেকেন্ডে আপডেট হবে
    const interval = setInterval(() => {
      const newTimeLeft = getTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    // cleanup
    return () => {
      clearInterval(interval);
    };
  }, [getTimeLeft]);

  const isPujaTime = timeLeft.total <= 0;

  const timeBlocks = [
    { value: timeLeft.days, label: "দিন", labelEn: "DAYS", emoji: "📅", color: "from-red-600 to-red-500" },
    { value: timeLeft.hours, label: "ঘণ্টা", labelEn: "HOURS", emoji: "⏰", color: "from-orange-600 to-orange-500" },
    { value: timeLeft.minutes, label: "মিনিট", labelEn: "MINUTES", emoji: "⏱️", color: "from-yellow-600 to-yellow-500" },
    { value: timeLeft.seconds, label: "সেকেন্ড", labelEn: "SECONDS", emoji: "⚡", color: "from-amber-600 to-amber-500" },
  ];

  return (
    <section id="countdown" className="py-12 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #7b1111 0%, #b71c1c 30%, #c62828 55%, #e65100 80%, #f57f17 100%)",
        }}
      />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 text-6xl opacity-20 animate-bounce">🪔</div>
        <div className="absolute top-1/3 right-10 text-6xl opacity-20 animate-pulse">🌺</div>
        <div className="absolute bottom-10 left-1/4 text-5xl opacity-20 animate-bounce" style={{ animationDelay: "0.5s" }}>🔔</div>
        <div className="absolute bottom-10 right-1/4 text-5xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}>🛕</div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-200 rounded-full px-6 py-2.5 text-sm font-hind mb-4 border border-yellow-400/30 animate-pulse">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
            ⏳ লাইভ কাউন্টডাউন
          </div>
          <h2 className="font-bengali text-3xl md:text-5xl font-black text-white mb-3">
            {isPujaTime ? (
              <>🎉 <span className="text-yellow-300">দুর্গাপূজা শুরু হয়ে গেছে!</span> 🎉</>
            ) : (
              <>দুর্গাপূজা <span className="text-yellow-300">২০২৬</span> আসতে বাকি</>
            )}
          </h2>
          <p className="font-hind text-base text-orange-200">
            মহাষষ্ঠী: ১৭ অক্টোবর ২০২৬ — বিজয়াদশমী: ২১ অক্টোবর ২০২৬
          </p>
        </div>

        {/* Countdown Blocks */}
        {!isPujaTime ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-10">
            {timeBlocks.map((block, index) => (
              <div
                key={block.label}
                className="relative group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card */}
                <div className={`bg-gradient-to-br ${block.color} rounded-2xl p-1 shadow-2xl transform hover:scale-105 transition-transform`}>
                  <div className="bg-gray-900/90 backdrop-blur rounded-xl p-5 md:p-6 text-center relative overflow-hidden">
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="text-3xl md:text-4xl mb-2">{block.emoji}</div>
                    
                    {/* Number - with key for re-render animation */}
                    <div 
                      key={`${block.label}-${block.value}`}
                      className="font-bengali text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 tabular-nums relative"
                      style={{ 
                        textShadow: "0 0 20px rgba(255,255,255,0.5)",
                        fontVariantNumeric: "tabular-nums"
                      }}
                    >
                      {mounted ? String(block.value).padStart(2, "0") : "--"}
                    </div>
                    
                    <div className="font-bengali text-sm md:text-base text-gray-300 font-bold">
                      {block.label}
                    </div>
                    <div className="font-hind text-xs text-gray-500 uppercase tracking-widest mt-1">
                      {block.labelEn}
                    </div>
                  </div>
                </div>
                
                {/* Pulse effect for seconds */}
                {block.label === "সেকেন্ড" && mounted && (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-red-500 rounded-2xl animate-ping opacity-20 pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mb-10">
            <div className="inline-block bg-yellow-400/20 border border-yellow-400/40 rounded-3xl p-10 backdrop-blur animate-pulse">
              <div className="text-8xl mb-4">🎊</div>
              <p className="font-bengali text-3xl text-yellow-300 font-bold">
                জয় মা দুর্গা!
              </p>
              <p className="font-hind text-base text-orange-200 mt-2">
                মায়ের আশীর্বাদ সকলের উপর বর্ষিত হোক
              </p>
            </div>
          </div>
        )}

        {/* Debug info - development only (hidden) */}
        {/* <div className="text-center text-white/50 text-xs mb-4">
          Last update: {new Date().toLocaleTimeString('bn-BD')}
        </div> */}

        {/* Event Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {[
            { day: "ষষ্ঠী", date: "১৭ অক্টো", emoji: "🌸", desc: "বোধন" },
            { day: "সপ্তমী", date: "১৮ অক্টো", emoji: "🌿", desc: "কলাবউ" },
            { day: "অষ্টমী", date: "১৯ অক্টো", emoji: "🪔", desc: "সন্ধিপূজা" },
            { day: "নবমী", date: "২০ অক্টো", emoji: "🥁", desc: "মহাভোগ" },
            { day: "দশমী", date: "২১ অক্টো", emoji: "💧", desc: "বিসর্জন" },
          ].map((item, idx) => (
            <div
              key={item.day}
              className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 hover:scale-105 transition-all cursor-pointer group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{item.emoji}</div>
              <p className="font-bengali text-base font-bold text-yellow-200">{item.day}</p>
              <p className="font-hind text-sm text-white/80">{item.date}</p>
              <p className="font-hind text-xs text-orange-300 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-10 text-center">
          <div className="inline-flex flex-wrap justify-center gap-4">
            <a
              href="#calendar"
              className="bg-yellow-400 hover:bg-yellow-300 text-red-900 font-bold px-6 py-3 rounded-full font-hind text-sm shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              📅 সম্পূর্ণ সূচি দেখুন
            </a>
            <a
              href="#mantra"
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-full font-hind text-sm border border-white/40 hover:-translate-y-1 transition-all"
            >
              📿 পূজার মন্ত্র
            </a>
            <a
              href="#pdf"
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-full font-hind text-sm border border-white/40 hover:-translate-y-1 transition-all"
            >
              📥 পূজার ফর্দ PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
