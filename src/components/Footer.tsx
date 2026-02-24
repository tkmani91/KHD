import { Flame, MapPin, Phone, Mail, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-800 via-red-800 to-pink-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Flame className="h-6 w-6 text-yellow-400" />
              <h3 className="text-lg font-bold">কলম হিন্দু ধর্মসভা</h3>
            </div>
            <p className="text-sm text-orange-100">
              ২০০৭ সাল থেকে আমরা ধর্মীয় অনুষ্ঠান ও পূজা উৎসব পালন করে আসছি। 
              আমাদের লক্ষ্য হিন্দু ধর্মের প্রচার ও সংস্কৃতির সংরক্ষণ।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">দ্রুত লিংক</h3>
            <ul className="space-y-2 text-sm text-orange-100">
              <li>দুর্গাপূজা কাউন্টডাউন</li>
              <li>পূজা তালিকা</li>
              <li>গ্যালারি</li>
              <li>ধর্মীয় গান</li>
              <li>যোগাযোগ</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold">যোগাযোগ</h3>
            <ul className="space-y-3 text-sm text-orange-100">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                কলম, চট্টগ্রাম, বাংলাদেশ
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +৮৮০ ১৮XXXXXXXXX
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@kolomhindu.org
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30">
                <Youtube className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-4 text-center text-sm text-orange-200">
          © ২০০৭ - ২০২৬ কলম হিন্দু ধর্মসভা। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}
