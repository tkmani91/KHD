import { useState } from "react";
import { BookOpen, Calendar, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-react";

interface PujaData {
  year: number;
  date: string;
  day: string;
  startTime: string;
  pushpanjali: string;
  aarti: string;
  prasad: string;
  location: string;
  specialEvent: string;
}

const pujaData: PujaData[] = [
  {
    year: 2025,
    date: "২ ফেব্রুয়ারি",
    day: "রবিবার",
    startTime: "সকাল ৮:০০",
    pushpanjali: "দুপুর ১২:০০",
    aarti: "দুপুর ১২:৩০",
    prasad: "দুপুর ১:০০",
    location: "কলম হিন্দু ধর্মসভা মন্দির",
    specialEvent: "ছাত্র-ছাত্রীদের হাতেখড়ি অনুষ্ঠান",
  },
  {
    year: 2024,
    date: "১৪ ফেব্রুয়ারি",
    day: "বুধবার",
    startTime: "সকাল ৮:০০",
    pushpanjali: "দুপুর ১২:০০",
    aarti: "দুপুর ১২:৩০",
    prasad: "দুপুর ১:০০",
    location: "কলম হিন্দু ধর্মসভা মন্দির",
    specialEvent: "ছাত্র-ছাত্রীদের হাতেখড়ি অনুষ্ঠান",
  },
  {
    year: 2023,
    date: "২৬ জানুয়ারি",
    day: "বৃহস্পতিবার",
    startTime: "সকাল ৮:০০",
    pushpanjali: "দুপুর ১২:০০",
    aarti: "দুপুর ১২:৩০",
    prasad: "দুপুর ১:০০",
    location: "কলম হিন্দু ধর্মসভা মন্দির",
    specialEvent: "ছাত্র-ছাত্রীদের হাতেখড়ি অনুষ্ঠান",
  },
];

export function SaraswatiPuja() {
  const [expandedYear, setExpandedYear] = useState<number | null>(2025);
  const [filterYear, setFilterYear] = useState<string>("all");

  const filteredData = filterYear === "all" 
    ? pujaData 
    : pujaData.filter(p => p.year.toString() === filterYear);

  const years = Array.from({ length: 20 }, (_, i) => 2007 + i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">সরস্বতী পূজা</h1>
          <p className="mt-2 text-gray-600">তারিখ ও সময়সূচি (২০০৭ - ২০২৬)</p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full rounded-lg border border-yellow-200 bg-white px-4 py-2 text-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
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
                className="flex w-full items-center justify-between bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 text-white"
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

                  <div className="mb-4 rounded-lg bg-yellow-50 p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-700">{puja.date}</div>
                      <div className="text-lg text-yellow-600">{puja.day}</div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between rounded-lg border border-yellow-100 bg-white p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium text-gray-700">পূজা শুরু</span>
                      </div>
                      <span className="font-bold text-yellow-700">{puja.startTime}</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-yellow-100 bg-white p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium text-gray-700">পুষ্পাঞ্জলি</span>
                      </div>
                      <span className="font-bold text-yellow-700">{puja.pushpanjali}</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-yellow-100 bg-white p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium text-gray-700">আরতি</span>
                      </div>
                      <span className="font-bold text-yellow-700">{puja.aarti}</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-yellow-100 bg-white p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium text-gray-700">প্রসাদ বিতরণ</span>
                      </div>
                      <span className="font-bold text-yellow-700">{puja.prasad}</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                    <strong>বিশেষ অনুষ্ঠান:</strong> {puja.specialEvent}
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
