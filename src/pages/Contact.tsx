import { useState } from "react";
import { Phone, Mail, MapPin, Send, Facebook, Youtube, MessageCircle } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600">
            <Phone className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">যোগাযোগ</h1>
          <p className="mt-2 text-gray-600">আমাদের সাথে যোগাযোগ করুন</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-800">যোগাযোগের তথ্য</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">ঠিকানা</h3>
                    <p className="text-sm text-gray-600">
                      কলম হিন্দু ধর্মসভা<br />
                      কলম, চট্টগ্রাম<br />
                      বাংলাদেশ
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">ফোন</h3>
                    <p className="text-sm text-gray-600">+৮৮০ ১৮XXXXXXXXX</p>
                    <p className="text-sm text-gray-600">+৮৮০ ১৬XXXXXXXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">ইমেইল</h3>
                    <p className="text-sm text-gray-600">info@kolomhindu.org</p>
                    <p className="text-sm text-gray-600">contact@kolomhindu.org</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-800">সোশ্যাল মিডিয়া</h2>
              <div className="flex gap-3">
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:scale-110">
                  <Facebook className="h-6 w-6" />
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-all hover:scale-110">
                  <Youtube className="h-6 w-6" />
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white transition-all hover:scale-110">
                  <MessageCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Office Hours */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-800">অফিস সময়</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">শনিবার - বৃহস্পতিবার</span>
                  <span className="font-medium text-gray-800">সকাল ৯:০০ - বিকাল ৫:০০</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">শুক্রবার</span>
                  <span className="font-medium text-gray-800">বন্ধ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">পূজার দিন</span>
                  <span className="font-medium text-gray-800">সকাল ৬:০০ - রাত ১০:০০</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">বার্তা পাঠান</h2>
            
            {submitted ? (
              <div className="rounded-lg bg-green-50 p-4 text-center text-green-700">
                আপনার বার্তা সফলভাবে পাঠানো হয়েছে!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">নাম</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="আপনার নাম"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">ইমেইল</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="আপনার ইমেইল"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">ফোন</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="আপনার ফোন নম্বর"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">বার্তা</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="আপনার বার্তা লিখুন"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 py-3 font-medium text-white transition-all hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                  বার্তা পাঠান
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
