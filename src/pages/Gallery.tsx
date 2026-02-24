import { useState } from "react";
import { Image, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface GalleryImage {
  id: number;
  year: number;
  pujaType: string;
  src: string;
  title: string;
}

const galleryData: GalleryImage[] = [
  // 2024 Images
  { id: 1, year: 2024, pujaType: "দুর্গাপূজা", src: "https://images.unsplash.com/photo-1567225591450-06036b3392a6?w=800", title: "দুর্গাপূজা ২০২৪ - প্রধান মণ্ডপ" },
  { id: 2, year: 2024, pujaType: "দুর্গাপূজা", src: "https://images.unsplash.com/photo-1606293459339-fed7f6d4c6c0?w=800", title: "দুর্গাপূজা ২০২৪ - প্রতিমা" },
  { id: 3, year: 2024, pujaType: "দুর্গাপূজা", src: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800", title: "দুর্গাপূজা ২০২৪ - ভক্তগণ" },
  { id: 4, year: 2024, pujaType: "শ্যামাপূজা", src: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800", title: "শ্যামাপূজা ২০২৪ - কালীপূজা" },
  { id: 5, year: 2024, pujaType: "সরস্বতী পূজা", src: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800", title: "সরস্বতী পূজা ২০২৪ - হাতেখড়ি" },
  
  // 2023 Images
  { id: 6, year: 2023, pujaType: "দুর্গাপূজা", src: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800", title: "দুর্গাপূজা ২০২৩" },
  { id: 7, year: 2023, pujaType: "শ্যামাপূজা", src: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800", title: "শ্যামাপূজা ২০২৩" },
  { id: 8, year: 2023, pujaType: "সরস্বতী পূজা", src: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800", title: "সরস্বতী পূজা ২০২৩" },
  
  // 2022 Images
  { id: 9, year: 2022, pujaType: "দুর্গাপূজা", src: "https://images.unsplash.com/photo-1567225591450-06036b3392a6?w=800", title: "দুর্গাপূজা ২০২২" },
  { id: 10, year: 2022, pujaType: "শ্যামাপূজা", src: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800", title: "শ্যামাপূজা ২০২২" },
  
  // 2021 Images
  { id: 11, year: 2021, pujaType: "দুর্গাপূজা", src: "https://images.unsplash.com/photo-1606293459339-fed7f6d4c6c0?w=800", title: "দুর্গাপূজা ২০২১" },
  { id: 12, year: 2021, pujaType: "সরস্বতী পূজা", src: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800", title: "সরস্বতী পূজা ২০২১" },
  
  // 2020 Images
  { id: 13, year: 2020, pujaType: "দুর্গাপূজা", src: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800", title: "দুর্গাপূজা ২০২০" },
  
  // 2019 Images
  { id: 14, year: 2019, pujaType: "দুর্গাপূজা", src: "https://images.unsplash.com/photo-1567225591450-06036b3392a6?w=800", title: "দুর্গাপূজা ২০১৯" },
  { id: 15, year: 2019, pujaType: "শ্যামাপূজা", src: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800", title: "শ্যামাপূজা ২০১৯" },
];

const pujaTypes = ["সব", "দুর্গাপূজা", "শ্যামাপূজা", "সরস্বতী পূজা"];
const years = Array.from({ length: 20 }, (_, i) => 2026 - i);

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterPuja, setFilterPuja] = useState<string>("সব");

  const filteredImages = galleryData.filter((img) => {
    const yearMatch = filterYear === "all" || img.year.toString() === filterYear;
    const pujaMatch = filterPuja === "সব" || img.pujaType === filterPuja;
    return yearMatch && pujaMatch;
  });

  const currentIndex = selectedImage 
    ? filteredImages.findIndex(img => img.id === selectedImage.id) 
    : -1;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
            <Image className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">গ্যালারি</h1>
          <p className="mt-2 text-gray-600">২০০৭ থেকে ২০২৬ সাল পর্যন্ত পূজার ছবি</p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">সাল নির্বাচন করুন</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full rounded-lg border border-green-200 bg-white px-4 py-2 text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="all">সব সাল</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">পূজার ধরন</label>
            <select
              value={filterPuja}
              onChange={(e) => setFilterPuja(e.target.value)}
              className="w-full rounded-lg border border-green-200 bg-white px-4 py-2 text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              {pujaTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-center text-sm text-gray-600">
          মোট {filteredImages.length}টি ছবি পাওয়া গেছে
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800">{image.title}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {image.year} সাল
                </div>
                <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                  {image.pujaType}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
            >
              <X className="h-6 w-6" />
            </button>
            
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="absolute left-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 disabled:opacity-30"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button
              onClick={goToNext}
              disabled={currentIndex === filteredImages.length - 1}
              className="absolute right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 disabled:opacity-30"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <div className="max-h-[90vh] max-w-[90vw]">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[80vh] max-w-full rounded-lg object-contain"
              />
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                <p className="text-gray-300">{selectedImage.year} সাল | {selectedImage.pujaType}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
