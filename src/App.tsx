import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Countdown } from "./components/Countdown";
import { DeviMahatmya } from "./components/DeviMahatmya";
import { MantraSection } from "./components/MantraSection";
import { CalendarSection } from "./components/CalendarSection";
import { PujaRules } from "./components/PujaRules";
import { AratiSection } from "./components/AratiSection";
import { ShyamaPuja } from "./components/ShyamaPuja";
import { SaraswatiPuja } from "./components/SaraswatiPuja";
import { PDFDownloads } from "./components/PDFDownloads";
import { PhotoGallery } from "./components/PhotoGallery";
import { ReligiousSongs } from "./components/ReligiousSongs";
import { Footer } from "./components/Footer";

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 animated-gradient text-white rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center text-xl"
      title="উপরে যান"
    >
      ↑
    </button>
  );
}

export function App() {
  return (
    <div className="min-h-screen bg-[#fdf6ec]">
      <Navbar />
      <Hero />
      
      {/* কাউন্টডাউন টাইমার */}
      <Countdown />

      {/* দুর্গাপূজা বিভাগ */}
      <DeviMahatmya />
      <MantraSection />
      <CalendarSection />
      <PujaRules />
      <AratiSection />

      {/* শ্যামাপূজা বিভাগ */}
      <ShyamaPuja />

      {/* সরস্বতী পূজা বিভাগ */}
      <SaraswatiPuja />

      {/* PDF ডাউনলোড */}
      <PDFDownloads />

      {/* ফটো গ্যালারি */}
      <PhotoGallery />

      {/* ধর্মীয় গান */}
      <ReligiousSongs />

      {/* যোগাযোগ */}
      <section id="contact" className="py-14 bg-orange-50 pattern-bg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 rounded-full px-4 py-2 text-sm font-hind mb-4">
              📬 যোগাযোগ
            </div>
            <h2 className="font-bengali text-3xl md:text-4xl font-bold text-red-800 mb-3">কলম হিন্দু ধর্মসভার সাথে যোগাযোগ</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 font-hind text-sm">
              পূজার তথ্য, গান, ছবি পাঠানো বা যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Info */}
              <div className="space-y-5">
                <h3 className="font-bengali text-xl font-bold text-red-800 pb-3 border-b border-orange-100">যোগাযোগের তথ্য</h3>
                {[
                  { icon: "📧", label: "ইমেইল", value: "durgapuja12@gmail.com" },
                  { icon: "📘", label: "ফেসবুক", value: "facebook.com/durgapuja12" },
                  { icon: "🌐", label: "ব্লগ", value: "durgapuja12.blogspot.com" },
                  { icon: "📍", label: "ঠিকানা", value: "কলম, বাংলাদেশ" },
                ].map((info) => (
                  <div key={info.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <p className="font-hind text-xs text-gray-400">{info.label}</p>
                      <p className="font-hind text-sm font-medium text-gray-700">{info.value}</p>
                    </div>
                  </div>
                ))}

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-200">
                  <p className="font-bengali text-base font-bold text-red-800 mb-2">🛕 কলম হিন্দু ধর্মসভা</p>
                  <p className="font-bengali text-sm text-gray-700 leading-relaxed">
                    ২০১৮ সাল থেকে প্রতি বছর দুর্গাপূজা, শ্যামাপূজা ও সরস্বতী পূজা আয়োজন করে আসছি।<br />
                    আপনারও অংশগ্রহণ আমন্ত্রণ রইল। 🙏
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <h3 className="font-bengali text-xl font-bold text-red-800 pb-3 border-b border-orange-100">মেসেজ পাঠান</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-hind text-gray-500 mb-1.5">নাম</label>
                    <input
                      type="text"
                      placeholder="আপনার নাম"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-hind text-gray-700 focus:outline-none focus:border-orange-400 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-hind text-gray-500 mb-1.5">ফোন/ইমেইল</label>
                    <input
                      type="text"
                      placeholder="যোগাযোগ"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-hind text-gray-700 focus:outline-none focus:border-orange-400 bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-hind text-gray-500 mb-1.5">বিষয়</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-hind text-gray-700 focus:outline-none focus:border-orange-400 bg-gray-50">
                    <option>দুর্গাপূজা সম্পর্কিত</option>
                    <option>শ্যামাপূজা সম্পর্কিত</option>
                    <option>সরস্বতী পূজা সম্পর্কিত</option>
                    <option>ফটো পাঠাতে চাই</option>
                    <option>গান ডাউনলোড</option>
                    <option>অন্যান্য</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-hind text-gray-500 mb-1.5">মেসেজ</label>
                  <textarea
                    rows={4}
                    placeholder="আপনার প্রশ্ন বা মতামত লিখুন..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-hind text-gray-700 focus:outline-none focus:border-orange-400 bg-gray-50 resize-none"
                  ></textarea>
                </div>
                <button className="w-full animated-gradient text-white font-bold py-3 rounded-xl font-hind shadow-lg hover:opacity-90 transition-opacity">
                  📨 মেসেজ পাঠান
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
