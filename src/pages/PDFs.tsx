import { FileText, Download, Calendar, File, BookOpen } from "lucide-react";

interface PDFItem {
  id: number;
  title: string;
  category: string;
  size: string;
  date: string;
  icon: typeof FileText;
}

const pdfs: PDFItem[] = [
  {
    id: 1,
    title: "দুর্গাপূজা ২০২৫ সময়সূচি",
    category: "পূজা তালিকা",
    size: "২.৫ MB",
    date: "২০২৫-০১-১৫",
    icon: Calendar,
  },
  {
    id: 2,
    title: "শ্যামাপূজা নিয়মাবলী",
    category: "নিয়মাবলী",
    size: "১.৮ MB",
    date: "২০২৪-১০-২০",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "সরস্বতী পূজা মন্ত্র সংগ্রহ",
    category: "মন্ত্র",
    size: "৩.২ MB",
    date: "২০২৪-০১-১০",
    icon: FileText,
  },
  {
    id: 4,
    title: "সদস্য ফরম ২০২৫",
    category: "ফরম",
    size: "৫০০ KB",
    date: "২০২৫-০১-০১",
    icon: File,
  },
  {
    id: 5,
    title: "বার্ষিক রিপোর্ট ২০২৪",
    category: "রিপোর্ট",
    size: "৫.১ MB",
    date: "২০২৪-১২-৩১",
    icon: FileText,
  },
  {
    id: 6,
    title: "পূজা উদযাপন কমিটি তালিকা",
    category: "তালিকা",
    size: "১.২ MB",
    date: "২০২৪-০৯-০১",
    icon: File,
  },
  {
    id: 7,
    title: "দান অনুদান রসিদ",
    category: "রসিদ",
    size: "৩০০ KB",
    date: "২০২৪-০১-০১",
    icon: FileText,
  },
  {
    id: 8,
    title: "ধর্মীয় গ্রন্থ তালিকা",
    category: "গ্রন্থ",
    size: "২.০ MB",
    date: "২০২৪-০৬-১৫",
    icon: BookOpen,
  },
];

const categories = ["সব", "পূজা তালিকা", "নিয়মাবলী", "মন্ত্র", "ফরম", "রিপোর্ট", "তালিকা", "রসিদ", "গ্রন্থ"];

import { useState } from "react";

export function PDFs() {
  const [filter, setFilter] = useState("সব");

  const filteredPDFs = filter === "সব" ? pdfs : pdfs.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">PDF ডাউনলোড</h1>
          <p className="mt-2 text-gray-600">প্রয়োজনীয় সকল ফাইল ডাউনলোড করুন</p>
        </div>

        {/* Categories */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === cat
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PDF List */}
        <div className="space-y-3">
          {filteredPDFs.map((pdf) => (
            <div
              key={pdf.id}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <pdf.icon className="h-6 w-6" />
              </div>
              
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-gray-800">{pdf.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                    {pdf.category}
                  </span>
                  <span>{pdf.size}</span>
                  <span>{pdf.date}</span>
                </div>
              </div>

              <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">ডাউনলোড</span>
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPDFs.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <p className="text-gray-500">এই বিভাগে কোনো PDF ফাইল পাওয়া যায়নি</p>
          </div>
        )}

        {/* Note */}
        <div className="mt-8 rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-800">
          <strong>বিঃদ্রঃ</strong> PDF ফাইলগুলো Adobe Acrobat Reader দিয়ে খুলুন
        </div>
      </div>
    </div>
  );
}
