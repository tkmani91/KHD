import { Bell, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";

const announcements = [
  "🪔 দুর্গাপূজা ২০২৫: ২৮ সেপ্টেম্বর থেকে ২ অক্টোবর পর্যন্ত",
  "📢 সকল সদস্যকে পূজা উপলক্ষে স্বাগতম জানাই",
  "🎵 নতুন ভজন সংগ্রহ করা হয়েছে - গান পেজ দেখুন",
  "📸 ২০২৪ সালের পূজার ছবি গ্যালারিতে আপলোড করা হয়েছে",
  "🙏 আগামী কালীপূজার প্রস্তুতি চলছে",
];

export function Announcement() {
  const [isMuted, setIsMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
        <div className="flex shrink-0 items-center gap-2">
          <Bell className="h-4 w-4 animate-pulse" />
          <span className="hidden text-xs font-bold sm:block">জরুরি ঘোষণা:</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-sm">
            {announcements[currentIndex]}
          </div>
        </div>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="shrink-0 rounded-full p-1 hover:bg-white/20"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
