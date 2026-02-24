import { useState } from "react";
import { Flame, Calendar, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-react";

interface PujaData {
  year: number;
  startDate: string;
  endDate: string;
  mahalaya: string;
  mahaSasthi: { date: string; time: string };
  mahaSaptami: { date: string; time: string };
  mahaAstami: { date: string; time: string };
  mahaNabami: { date: string; time: string };
  bijoyaDashami: { date: string; time: string };
  location: string;
}

const pujaData: PujaData[] = [
  {
    year: 2025,
    startDate: "২৮ সেপ্টেম্বর",
    endDate: "২ অক্টোবর",
    mahalaya: "২১ সেপ্টেম্বর",
    mahaSasthi: { date: "২৮ সেপ্টেম্বর", time: "সকাল ৭:০০" },
    mahaSaptami: { date: "২৯ সেপ্টেম্বর", time: "সকাল ৬:০০" },
    mahaAstami: { date: "৩০ সেপ্টেম্বর", time: "সকাল ৬:০০" },
    mahaNabami: { date: "১ অক্টোবর", time: "সকাল ৬:০০" },
    bijoyaDashami: { date: "২ অক্টোবর", time: "সকাল ৮:০০" },
    location: "কলম হিন্দু ধর্মসভা মন্দির",
  },
  {
    year: 2024,
    startDate: "৯ অক্টোবর",
    endDate: "১৩ অক্টোবর",
    mahalaya: "২ অক্টোবর",
    mahaSasthi: { date: "৯ অক্টোবর", time: "সকাল ৭:০০" },
    mahaSaptami: { date: "১০ অক্টোবর", time: "সকাল ৬:০০" },
    mahaAstami: { date: "১১ অক্টোবর", time: "সকাল ৬:০০" },
    mahaNabami: { date: "১২ অক্টোবর", time: "সকাল ৬:০০" },
    bijoyaDashami: { date: "১৩ অক্টোবর", time: "সকাল ৮:০০" },
    location: "কলম হিন্দু ধর্মসভা মন্দির",
  },
  {
    year: 2023,
    startDate: "২০ অক্টোবর",
    endDate: "২৪ অক্টোবর",
    mahalaya: "১৪ অক্টোবর",
    mahaSasthi: { date: "২০ অক্টোবর", time: "সকাল ৭:০০" },
    mahaSaptami: { date: "২১ অক্টোবর", time: "সকাল ৬:০০" },
    mahaAstami: { date: "২২ অক্টোবর", time: "সকাল ৬:০০" },
    mahaNabami: { date: "২৩ অক্টোবর", time: "সকাল ৬:০০" },
    bijoyaDashami: { date: "২৪ অক্টোবর", time: "সকাল ৮:০০" },
    location: "কলম হিন্দু ধর্মসভা মন্দির",
  },
];

export function DurgaPuja() {
  const [expandedYear, setExpandedYear] = useState<number | null>(2025);
  const [filterYear, setFilterYear] = useState<string>("all");

  const filteredData = filterYear === "all" 
    ? pujaData 
    : pujaData.filter(p => p.year.toString() === filterYear);

  const years = Array.from({ length: 20 }, (_, i) => 2007 + i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-600">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">দুর্গাপূজা</h1>
          <p className="mt-2 text-gray-600">তারিখ ও সময়সূচি (২০০৭ - ২০২৬)</p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full rounded-lg border border-orange-200 bg-white px-4 py-2 text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <option value="all">সব সাল</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>

        {/* Puja Cards */}
        <div className="space-y-4">
          {filteredData.map((puja) => (
            <div
              key={puja.year}
              className="overflow-hidden rounded-xl bg-white shadow-lg"
            >
              <button
                onClick={() => setExpandedYear(expandedYear === puja.year ? null : puja.year)}
                className="flex w-full items-center justify-between bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 text-white"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" />
                  <span className="text-lg font-bold">{puja.year} সাল</span>
                </div>
                {expandedYear === puja.year ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>

              {expandedYear === puja.year && (
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    {puja.location}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-orange-50 p-4">
                      <div className="mb-2 text-sm font-medium text-orange-600">মহালয়া</div>
                      <div className="text-lg font-bold text-gray-800">{puja.mahalaya}</div>
                    </div>

                    <div className="rounded-lg bg-red-50 p-4">
                      <div className="mb-2 text-sm font-medium text-red-600">মহা ষষ্ঠী</div>
                      <div className="text-lg font-bold text-gray-800">{puja.mahaSasthi.date}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {puja.mahaSasthi.time}
                      </div>
                    </div>

                    <div className="rounded-lg bg-pink-50 p-4">
                      <div className="mb-2 text-sm font-medium text-pink-600">মহা সপ্তমী</div>
                      <div className="text-lg font-bold text-gray-800">{puja.mahaSaptami.date}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {puja.mahaSaptami.time}
                      </div>
                    </div>

                    <div className="rounded-lg bg-purple-50 p-4">
                      <div className="mb-2 text-sm font-medium text-purple-600">মহা অষ্টমী</div>
                      <div className="text-lg font-bold text-gray-800">{puja.mahaAstami.date}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {puja.mahaAstami.time}
                      </div>
                    </div>

                    <div className="rounded-lg bg-indigo-50 p-4">
                      <div className="mb-2 text-sm font-medium text-indigo-600">মহা নবমী</div>
                      <div className="text-lg font-bold text-gray-800">{puja.mahaNabami.date}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {puja.mahaNabami.time}
                      </div>
                    </div>

                    <div className="rounded-lg bg-amber-50 p-4">
                      <div className="mb-2 text-sm font-medium text-amber-600">বিজয়া দশমী</div>
                      <div className="text-lg font-bold text-gray-800">{puja.bijoyaDashami.date}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {puja.bijoyaDashami.time}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-800">
          <strong>বিঃদ্রঃ</strong> সময়সূচি পরিবর্তন হতে পারে। সর্বশেষ তথ্যের জন্য যোগাযোগ করুন।
        </div>
      </div>
    </div>
  );
}
