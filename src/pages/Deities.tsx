import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Info,
  Flower2,
  Flame,
  BookOpen,
  Heart
} from 'lucide-react';

interface Deity {
  id: string;
  name: string;
  bengaliName: string;
  title: string;
  description: string;
  significance: string[];
  mantras: string[];
  festivals: string[];
  offerings: string[];
  images: string[];
  color: string;
}

const deities: Deity[] = [
  {
    id: 'durga',
    name: 'Durga',
    bengaliName: 'দুর্গা মা',
    title: 'অসুরদমনী, মহিষাসুরমর্দিনী',
    description: 'দুর্গা মা হলেন শক্তির অবতার, যিনি অসুর রাজা মহিষাসুরকে বধ করেছিলেন। তিনি দশভুজা, ত্রিনয়না দেবী যার প্রতিটি হাতে বিভিন্ন অস্ত্র রয়েছে। তিনি সিংহবাহিনী এবং শক্তি, শক্তি ও সুরক্ষার প্রতীক।',
    significance: [
      'অসত্যের উপর সত্যের বিজয় প্রতীক',
      'মাতৃশক্তির প্রতীক',
      'ধর্ম রক্ষাকারী',
      'অন্যায়ের বিরুদ্ধে লড়াইয়ের প্রেরণা'
    ],
    mantras: [
      'ॐ दुं दुर्गायै नमः',
      'সর্বমঙ্গল মাঙ্গল্যে শিবে সর্বার্থসাধিকে',
      'শরণ্যে ত্র্যম্বকে গৌরি নারায়ণি নমোঃস্তুতে'
    ],
    festivals: ['দুর্গাপূজা', 'নবরাত্রি', 'দুর্গাষ্টমী'],
    offerings: ['বেলপাতা', 'ফুল', 'নারকেল', 'মিষ্টি'],
    images: [
      'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800',
      'https://images.unsplash.com/photo-1596263576921-2c0895853ce8?w=800',
      'https://images.unsplash.com/photo-1606293459339-fed7f6d4c6c0?w=800'
    ],
    color: 'from-red-500 to-orange-600'
  },
  {
    id: 'kali',
    name: 'Kali',
    bengaliName: 'কালী মা',
    title: 'মহাকালী, কালিকা',
    description: 'কালী মা হলেন সময়ের দেবী, যিনি সমস্ত অসুরিশক্তি ধ্বংস করেন। তিনি কালো বর্ণের, চার হাতে অস্ত্রধারিণী, মুণ্ডমালা পরিহিতা। তিনি মোক্ষদায়িনী এবং ভক্তদের রক্ষাকারিণী।',
    significance: [
      'অহংকার ধ্বংসকারিণী',
      'মোক্ষদায়িনী',
      'ভয় নিবারিণী',
      'অন্ধকার দূরকারিণী'
    ],
    mantras: [
      'ॐ क्रीं कालिकायै नमः',
      'কৃপাং কুরু কৃপাং কুরু কৃপাং কুরু কালিকে',
      'শ্রীং হ্রীং ক্লীং আদ্যা কালিকা পরমেশ্বরি'
    ],
    festivals: ['কালীপূজা', 'দীপাবলি', 'অমাবস্যা'],
    offerings: ['মাংস', 'মদ্য', 'মাছ', 'মুদ্রা', 'মৈথুন'],
    images: [
      'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800',
      'https://images.unsplash.com/photo-1609602644879-8c7d3a6e2c8f?w=800',
      'https://images.unsplash.com/photo-1599749833208-5e0c5c3b0f5e?w=800'
    ],
    color: 'from-purple-600 to-indigo-700'
  },
  {
    id: 'shyama',
    name: 'Shyama',
    bengaliName: 'শ্যামা মা',
    title: 'কালীর অন্য রূপ, কৃষ্ণবর্ণা',
    description: 'শ্যামা মা হলেন কালীর অন্য রূপ, কৃষ্ণবর্ণা দেবী। তিনি ভক্তদের প্রতি অত্যন্ত দয়ালু এবং সকল মনোকামনা পূর্ণ করেন। বাংলায় শ্যামাপূজা অত্যন্ত জনপ্রিয়।',
    significance: [
      'ভক্তবৎসলা',
      'মনোকামনা পূর্ণকারিণী',
      'অন্ধকার থেকে আলোর পথ দেখান',
      'শান্তির দেবী'
    ],
    mantras: [
      'ॐ श्यामायै नमः',
      'শ্যামা শ্যামা শ্যামা তুমি শ্যামা মা',
      'কৃষ্ণবর্ণে কালিকে দেবী নমঃস্তুতে'
    ],
    festivals: ['শ্যামাপূজা', 'দীপাবলি', 'কালীপূজা'],
    offerings: ['নারকেল', 'খেজুর', 'মিষ্টি', 'ফুল'],
    images: [
      'https://images.unsplash.com/photo-1606293459339-fed7f6d4c6c0?w=800',
      'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800',
      'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800'
    ],
    color: 'from-blue-600 to-purple-600'
  },
  {
    id: 'saraswati',
    name: 'Saraswati',
    bengaliName: 'সরস্বতী মা',
    title: 'বিদ্যাদেবী, বাণীদেবী',
    description: 'সরস্বতী মা হলেন জ্ঞান, বিদ্যা, সংগীত ও শিল্পকলার দেবী। তিনি সাদা বসনা, বীণাধারিণী, হংসবাহিনী। শিক্ষার্থীরা তাঁর আশীর্বাদ চান।',
    significance: [
      'জ্ঞান ও বিদ্যার দেবী',
      'সংগীত ও শিল্পকলার অধিষ্ঠাত্রী',
      'বাকশক্তির দেবী',
      'সৃজনশীলতার প্রতীক'
    ],
    mantras: [
      'ॐ ऐं सरस्वत्यै नमः',
      'সরস্বতী মহাভাগে বিদ্যে কামললোচনে',
      'যা কুন্দেন্দু তুষারহার ধবলা'
    ],
    festivals: ['সরস্বতী পূজা', 'বসন্ত পঞ্চমী', 'শ্রীপঞ্চমী'],
    offerings: ['বই', 'কলম', 'ফুল', 'বরণ', 'পায়েস'],
    images: [
      'https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=800',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
    ],
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'jagannath',
    name: 'Jagannath',
    bengaliName: 'জগন্নাথ দেব',
    title: 'বিশ্বনাথ, পুরীধাম',
    description: 'জগন্নাথ দেব হলেন বিষ্ণুর অন্য রূপ, যিনি পুরীধামে রথযাত্রার মাধ্যমে ভক্তদের দর্শন দেন। তিনি ভক্তদের সকল কষ্ট দূর করেন এবং মোক্ষ প্রদান করেন।',
    significance: [
      'বিশ্বের নাথ',
      'রথযাত্রার প্রভু',
      'ভক্তদের কষ্টহর্তা',
      'মোক্ষদাতা'
    ],
    mantras: [
      'ॐ जगन्नाथाय नमः',
      'জয় জগন্নাথ স্বামী নয়নপথগামী ভবতুমে',
      'কলৌ সংকীর্তনাদ্ধ্যায় জগন্নাথো হরিঃ পরঃ'
    ],
    festivals: ['রথযাত্রা', 'জগন্নাথ পূজা', 'নীলাদ্রি বিজয়'],
    offerings: ['মহাপ্রসাদ', 'খিচুড়ি', 'পিঠা', 'মিষ্টি'],
    images: [
      'https://images.unsplash.com/photo-1561361058-4e7e1b5e9c0e?w=800',
      'https://images.unsplash.com/photo-1599749833208-5e0c5c3b0f5e?w=800',
      'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800'
    ],
    color: 'from-green-500 to-teal-600'
  }
];

const Deities = () => {
  const [selectedDeity, setSelectedDeity] = useState<Deity>(deities[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'mantras' | 'festivals'>('info');

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedDeity.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedDeity.images.length - 1 ? 0 : prev + 1
    );
  };

  const selectDeity = (deity: Deity) => {
    setSelectedDeity(deity);
    setCurrentImageIndex(0);
    setActiveTab('info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-2">🙏 দেব-দেবী</h1>
          <p className="text-gray-600">আমাদের পূজিত দেবতাদের পরিচিতি ও তথ্য</p>
        </div>

        {/* Deity Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {deities.map((deity) => (
            <button
              key={deity.id}
              onClick={() => selectDeity(deity)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedDeity.id === deity.id
                  ? `bg-gradient-to-r ${deity.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 hover:bg-orange-50 shadow-md'
              }`}
            >
              {deity.bengaliName}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`h-96 bg-gradient-to-br ${selectedDeity.color} relative`}>
              <img
                src={selectedDeity.images[currentImageIndex]}
                alt={selectedDeity.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {selectedDeity.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedDeity.bengaliName}</h2>
              <p className="text-orange-600 font-medium">{selectedDeity.title}</p>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
              {[
                { id: 'info', label: 'তথ্য', icon: Info },
                { id: 'mantras', label: 'মন্ত্র', icon: BookOpen },
                { id: 'festivals', label: 'পূজা ও উৎসব', icon: Flame },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Info className="w-5 h-5 text-orange-600" />
                      পরিচিতি
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{selectedDeity.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      গুরুত্ব ও তাৎপর্য
                    </h3>
                    <ul className="space-y-2">
                      {selectedDeity.significance.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="text-orange-500 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Flower2 className="w-5 h-5 text-pink-500" />
                      নৈবেদ্য ও উপচার
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDeity.offerings.map((offering, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                        >
                          {offering}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'mantras' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">পবিত্র মন্ত্রসমূহ</h3>
                  {selectedDeity.mantras.map((mantra, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-l-4 border-orange-500"
                    >
                      <p className="text-lg font-medium text-gray-800 mb-1">{mantra}</p>
                      <p className="text-sm text-gray-500">মন্ত্র {index + 1}</p>
                    </div>
                  ))}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💡 পরামর্শ: এই মন্ত্রগুলি প্রতিদিন জপ করলে মনোশান্তি ও আশীর্বাদ লাভ হয়।
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'festivals' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-600" />
                      প্রধান উৎসবসমূহ
                    </h3>
                    <div className="space-y-3">
                      {selectedDeity.festivals.map((festival, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                            <Flame className="w-5 h-5 text-orange-600" />
                          </div>
                          <span className="font-medium text-gray-800">{festival}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">📅 পূজার সময়</h4>
                    <p className="text-gray-600 text-sm">
                      এই দেবতার পূজা বিশেষত বিশেষ তিথিতে অত্যন্ত ফলদায়ক। 
                      নির্দিষ্ট তারিখের জন্য পূজা পাতা দেখুন।
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section - All Deities Quick View */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">সকল দেব-দেবী</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {deities.map((deity) => (
              <button
                key={deity.id}
                onClick={() => selectDeity(deity)}
                className={`p-4 rounded-xl transition-all ${
                  selectedDeity.id === deity.id
                    ? 'bg-gradient-to-br ' + deity.color + ' text-white shadow-lg scale-105'
                    : 'bg-white hover:shadow-md'
                }`}
              >
                <img
                  src={deity.images[0]}
                  alt={deity.name}
                  className="w-full h-24 object-cover rounded-lg mb-3"
                />
                <p className={`font-semibold ${selectedDeity.id === deity.id ? 'text-white' : 'text-gray-800'}`}>
                  {deity.bengaliName}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deities;