import { Link } from "react-router-dom";
import { Announcement } from "../components/Announcement";
import { Countdown } from "../components/Countdown";
import { Flame, Moon, BookOpen, Image, Music, FileText, Phone, Tv } from "lucide-react";

const features = [
  { path: "/durga-puja", label: "দুর্গাপূজা", icon: Flame, color: "from-red-500 to-orange-600", desc: "তারিখ ও সময়" },
  { path: "/shyama-puja", label: "শ্যামাপূজা", icon: Moon, color: "from-purple-500 to-indigo-600", desc: "তারিখ ও সময়" },
  { path: "/saraswati-puja", label: "সরস্বতী পূজা", icon: BookOpen, color: "from-yellow-400 to-orange-500", desc: "তারিখ ও সময়" },
  { path: "/gallery", label: "গ্যালারি", icon: Image, color: "from-green-500 to-emerald-600", desc: "২০০৭-২০২৬" },
  { path: "/music", label: "ধর্মীয় গান", icon: Music, color: "from-pink-500 to-rose-600", desc: "ভজন ও গান" },
  { path: "/pdfs", label: "PDF ফাইল", icon: FileText, color: "from-blue-500 to-cyan-600", desc: "ডাউনলোড" },
  { path: "/live-tv", label: "লাইভ টিভি", icon: Tv, color: "from-violet-500 to-purple-600", desc: "ধর্মীয় চ্যানেল" },
  { path: "/contact", label: "যোগাযোগ", icon: Phone, color: "from-teal-500 to-cyan-600", desc: "আমাদের সাথে" },
];

export function Home() {
  return (
    <div>
      {/* Announcement Bar */}
      <Announcement />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 py-16 text-white sm:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Flame className="h-10 w-10 text-yellow-300" />
          </div>
          <h1 className="mb-4 text-3xl font-bold sm:text-5xl">
            কলম হিন্দু ধর্মসভা
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-orange-100 sm:text-xl">
            ২০০৭ সাল থেকে ধর্মীয় অনুষ্ঠান ও পূজা উৎসব পালন করে আসছি। 
            আমাদের সাথে যুক্ত হোন এবং আধ্যাত্মিকতার পথে এগিয়ে চলুন।
          </p>
        </div>
      </div>

      {/* Countdown Section */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Countdown />
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
          আমাদের সেবাসমূহ
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-800 group-hover:text-orange-600">
                {feature.label}
              </h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-orange-900">আমাদের সম্পর্কে</h2>
          <p className="mb-4 text-gray-700">
            কলম হিন্দু ধর্মসভা ২০০৭ সালে প্রতিষ্ঠিত হয়। আমরা প্রতি বছর দুর্গাপূজা, 
            শ্যামাপূজা (কালীপূজা), এবং সরস্বতী পূজা উৎসব পালন করে থাকি। 
            আমাদের লক্ষ্য হিন্দু ধর্মের প্রচার এবং সংস্কৃতির সংরক্ষণ।
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-4 text-center shadow">
              <div className="text-3xl font-bold text-orange-600">২০০৭</div>
              <div className="text-sm text-gray-600">প্রতিষ্ঠার সাল</div>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow">
              <div className="text-3xl font-bold text-orange-600">৩+</div>
              <div className="text-sm text-gray-600">বার্ষিক পূজা</div>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow">
              <div className="text-3xl font-bold text-orange-600">২০০০+</div>
              <div className="text-sm text-gray-600">সদস্য</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
