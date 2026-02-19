export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="animated-gradient py-10 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="text-4xl mb-3">📬</div>
          <h3 className="font-bengali text-2xl font-bold mb-2">পূজার আপডেট পান সরাসরি ইনবক্সে</h3>
          <p className="font-hind text-sm text-orange-100 mb-5">
            দুর্গাপূজা, শ্যামাপূজা, সরস্বতী পূজার খবর ও গান সবার আগে পান
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="আপনার ইমেইল লিখুন..."
              className="flex-1 px-5 py-3 rounded-full text-gray-800 font-hind text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="bg-yellow-400 hover:bg-yellow-300 text-red-900 font-bold px-6 py-3 rounded-full font-hind text-sm transition-colors whitespace-nowrap">
              🔔 সাবস্ক্রাইব
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full diya-glow bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-3xl">
              🛕
            </div>
            <div>
              <h2 className="font-bengali text-xl font-bold text-white leading-tight">কলম হিন্দু ধর্মসভা</h2>
              <p className="text-xs text-orange-400 font-hind">Durgapuja12.blogspot.com</p>
            </div>
          </div>
          <p className="font-hind text-sm text-gray-400 leading-relaxed">
            কলম হিন্দু ধর্মসভা — দুর্গাপূজা, শ্যামাপূজা ও সরস্বতী পূজার সম্পূর্ণ তথ্যভান্ডার। মন্ত্র, গান, বিধি ও প্রতি বছরের ছবি।
          </p>
          <div className="flex gap-3 flex-wrap">
            {[
              { icon: "📘", label: "Facebook", color: "bg-blue-700" },
              { icon: "📷", label: "Instagram", color: "bg-pink-700" },
              { icon: "▶️", label: "YouTube", color: "bg-red-700" },
              { icon: "🌐", label: "Blog", color: "bg-orange-700" },
            ].map((social) => (
              <button
                key={social.label}
                title={social.label}
                className={`w-9 h-9 ${social.color} rounded-lg flex items-center justify-center text-sm hover:opacity-80 transition-opacity`}
              >
                {social.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bengali text-lg font-bold text-white mb-5 pb-2 border-b border-gray-700">দ্রুত লিংক</h3>
          <ul className="space-y-3">
            {[
              { label: "হোম", href: "#home" },
              { label: "দুর্গাপূজা", href: "#mahatmya" },
              { label: "শ্যামাপূজা", href: "#shyama" },
              { label: "সরস্বতী পূজা", href: "#saraswati" },
              { label: "পূজার মন্ত্র", href: "#mantra" },
              { label: "ফটো গ্যালারি", href: "#gallery" },
              { label: "ধর্মীয় গান", href: "#songs" },
              { label: "যোগাযোগ", href: "#contact" },
            ].map((item) => (
              <li key={item.label}>
                <a href={item.href} className="font-hind text-sm text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2">
                  <span className="text-orange-500">›</span> {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Puja Categories */}
        <div>
          <h3 className="font-bengali text-lg font-bold text-white mb-5 pb-2 border-b border-gray-700">পূজার বিভাগ</h3>
          <ul className="space-y-3">
            {[
              { label: "🪔 দুর্গাপূজা", count: "৩৮+" },
              { label: "🌑 শ্যামাপূজা", count: "১৫+" },
              { label: "🎵 সরস্বতী পূজা", count: "১২+" },
              { label: "📿 পূজার মন্ত্র", count: "৫০+" },
              { label: "🎶 ধর্মীয় গান", count: "১২+" },
              { label: "📷 ফটো গ্যালারি", count: "১৫০+" },
            ].map((cat) => (
              <li key={cat.label} className="flex items-center justify-between">
                <a href="#" className="font-hind text-sm text-gray-400 hover:text-orange-400 transition-colors">
                  {cat.label}
                </a>
                <span className="text-xs bg-gray-800 text-orange-400 px-2 py-0.5 rounded-full font-hind">
                  {cat.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-5">
          <div>
            <h3 className="font-bengali text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700">যোগাযোগ</h3>
            <ul className="space-y-3">
              {[
                { icon: "📧", text: "durgapuja12@gmail.com" },
                { icon: "📘", text: "facebook.com/KHDS3" },
                { icon: "🌐", text: "durgapuja12.blogspot.com" },
                { icon: "📍", text: "কলম,সিংড়া, নাটোর, বাংলাদেশ" },
              ].map((c) => (
                <li key={c.text} className="flex items-center gap-2 font-hind text-sm text-gray-400">
                  <span>{c.icon}</span> {c.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Daily Mantra */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="font-bengali text-xs text-yellow-400 font-bold mb-2">🕉️ দৈনিক মন্ত্র</p>
            <p className="font-bengali text-sm text-orange-200 leading-relaxed">
              "নমস্তস্যৈ নমস্তস্যৈ<br />
              নমস্তস্যৈ নমো নমঃ।।"
            </p>
          </div>

          {/* Puja Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: "৭+", label: "বছর" },
              { num: "৩টি", label: "পূজা" },
              { num: "১৫০+", label: "ছবি" },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-800 rounded-xl p-2 text-center border border-gray-700">
                <p className="font-bengali text-lg font-bold text-orange-400">{stat.num}</p>
                <p className="font-hind text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-hind text-xs text-gray-500 text-center">
            © ২০২৬ কলম হিন্দু ধর্মসভা | সর্বস্বত্ব সংরক্ষিত |
          </p>
          <p className="font-bengali text-xs text-gray-500 text-center">
            🙏 জয় মা দুর্গা | জয় মা কালী | জয় মা সরস্বতী
          </p>
        </div>
      </div>
    </footer>
  );
}
