import { useState } from "react";

const navLinks = [
  { label: "হোম", href: "#home", icon: "🏠" },
  { label: " দুর্গাপূজা", href: "#mahatmya", icon: "🛕", subtitle: "শারদীয় উৎসব" },
  { label: " শ্যামাপূজা", href: "#shyama", icon: "🌑", subtitle: "কালীপূজা" },
  { label: " সরস্বতী পূজা", href: "#saraswati", icon: "🎵", subtitle: "বিদ্যার দেবী" },
  { label: " ফটো গ্যালারি", href: "#gallery", icon: "📷", subtitle: "প্রতি বছরের ছবি" },
  { label: " ধর্মীয় গান", href: "#songs", icon: "🎶" },
  { label: " PDF ফর্দ", href: "#pdf", icon: "📥" },
  { label: " যোগাযোগ", href: "#contact", icon: "📞" },
];

// ✅ Smooth scroll function
const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const targetId = href.replace("#", "");
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  }
  // Update URL without reload
  window.history.pushState(null, "", href);
};

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    smoothScroll(e, href);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Top Ticker */}
      <div className="bg-red-900 text-white text-xs py-1.5 px-4 flex items-center gap-3 overflow-hidden">
        <span className="bg-yellow-400 text-red-900 font-bold text-xs px-3 py-0.5 rounded-full shrink-0 font-hind">🔴 বিজ্ঞপ্তি</span>
        <div className="ticker-wrap flex-1">
          <span className="ticker-move text-sm font-hind">
            🌸 শুভ শারদীয় দুর্গোৎসব ২০২৫ — কলম হিন্দু ধর্মসভা &nbsp;|&nbsp; 🪔 শ্যামাপূজা ও সরস্বতী পূজার তথ্য পাওয়া যাচ্ছে &nbsp;|&nbsp; 🎵 ধর্মীয় গান শুনুন ও ডাউনলোড করুন &nbsp;|&nbsp; 📷 প্রতি বছরের ফটো গ্যালারি দেখুন &nbsp;|&nbsp; 🙏 মা দুর্গার কৃপায় সকলের জীবন সুখময় হোক &nbsp;|&nbsp;
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div id="home" className="animated-gradient py-5 px-4 text-center text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-400/30 border-2 border-yellow-400 flex items-center justify-center text-3xl diya-glow float-anim">
              🛕
            </div>
            <div className="text-left">
              <h1 className="font-bengali text-2xl md:text-3xl font-black text-yellow-200 leading-tight">
                কলম হিন্দু ধর্মসভা
              </h1>
              <p className="font-hind text-xs text-orange-100 tracking-wide">
                কলম হিন্দু ধর্মসভা — পূজা, ধর্ম ও সংস্কৃতির আলোকে
              </p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {["দুর্গাপূজা", "শ্যামাপূজা", "সরস্বতী পূজা"].map(t => (
                  <span key={t} className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-hind text-yellow-100">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end text-right">
            <p className="font-bengali text-sm text-yellow-200">জয় মা দুর্গা! 🙏</p>
            <p className="font-hind text-xs text-orange-200">সর্বমঙ্গলা মঙ্গল্যে শিবে সর্বার্থসাধিকে</p>
            <p className="font-hind text-xs text-orange-200">শরণ্যে ত্র্যম্বকে গৌরি নারায়ণি নমোস্তুতে</p>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="group px-4 py-4 text-sm font-medium text-gray-700 hover:bg-orange-500 hover:text-white transition-all font-hind border-r border-gray-100 first:border-l relative"
              >
                <span className="flex items-center gap-1">
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </span>
                {link.subtitle && (
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {link.subtitle}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 py-2 ml-auto lg:ml-0">
            <div className="hidden md:flex items-center bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 gap-2">
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
              </svg>
              <input
                type="text"
                placeholder="পূজার তথ্য খুঁজুন..."
                className="bg-transparent text-sm text-gray-600 outline-none w-36 font-hind"
              />
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg bg-orange-50 text-orange-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-orange-100 px-4 py-3 shadow-lg">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all font-hind"
                >
                  <span className="text-lg">{link.icon}</span>
                  <div>
                    <span className="block">{link.label}</span>
                    {link.subtitle && (
                      <span className="block text-xs text-gray-400">{link.subtitle}</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
