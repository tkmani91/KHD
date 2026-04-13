import { useState, useEffect } from 'react';
import { X, Download, Sparkles, Smartphone } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show prompt after 10 seconds
      setTimeout(() => {
        setShowPrompt(true);
        // Trigger entrance animation
        setTimeout(() => setIsVisible(true), 50);
      }, 10000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted install');
    }

    setDeferredPrompt(null);
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShowPrompt(false), 400);
  };

  const handleDismiss = () => {
    handleClose();
    localStorage.setItem('install-prompt-dismissed', Date.now().toString());
  };

  // Check if already dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    if (dismissed) {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      if (parseInt(dismissed) > oneDayAgo) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[49] transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleDismiss}
      />

      {/* Main prompt container */}
      <div
        className={`fixed bottom-4 left-3 right-3 md:left-auto md:right-6 md:bottom-6 md:w-[420px] z-50 transition-all duration-500 ease-out ${
          isVisible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-full opacity-0 scale-95'
        }`}
      >
        {/* Floating sparkles decoration */}
        <div className="absolute -top-3 -right-2 animate-bounce">
          <Sparkles className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
        </div>
        <div
          className="absolute -top-2 left-8 animate-bounce"
          style={{ animationDelay: '0.3s' }}
        >
          <Sparkles className="w-4 h-4 text-orange-300 drop-shadow-lg" />
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/20">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 animate-gradient-shift" />

          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div
            className="absolute -bottom-8 -left-8 w-32 h-32 bg-yellow-300/10 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />

          {/* Floating particles */}
          <div className="absolute top-6 right-16 w-2 h-2 bg-white/30 rounded-full animate-float" />
          <div
            className="absolute top-16 right-8 w-1.5 h-1.5 bg-yellow-200/40 rounded-full animate-float"
            style={{ animationDelay: '0.5s' }}
          />
          <div
            className="absolute bottom-12 left-6 w-1.5 h-1.5 bg-white/25 rounded-full animate-float"
            style={{ animationDelay: '1.2s' }}
          />

          {/* Content */}
          <div className="relative p-5 md:p-6">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110 group"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
            </button>

            {/* Top section with icon and title */}
            <div className="flex items-center gap-4 mb-4">
              {/* App icon with glow effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-white/40 rounded-2xl blur-lg animate-pulse" />
                <div
                  className="relative w-16 h-16 md:w-[72px] md:h-[72px] bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <img
                    src="https://i.ibb.co.com/XZT93Lxq/KHDS.png"
                    alt="App Icon"
                    className={`w-12 h-12 md:w-14 md:h-14 object-contain transition-transform duration-500 ${
                      isHovering ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
                    }`}
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full animate-shine" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-extrabold text-white text-lg md:text-xl tracking-tight">
                    অ্যাপ ইনস্টল করুন
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>হোম স্ক্রিনে যোগ করুন</span>
                </div>
              </div>
            </div>

            {/* Description with frosted glass card */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3.5 mb-5 border border-white/10">
              <p className="text-sm text-white/95 leading-relaxed">
                📱 আপনার ফোনে ইনস্টল করে{' '}
                <span className="font-semibold text-yellow-200">
                  দ্রুত অ্যাক্সেস
                </span>{' '}
                করুন।
                <br />
                ⚡ অফলাইনেও কিছু ফিচার কাজ করবে!
              </p>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {['⚡ দ্রুত লোড', '📴 অফলাইন সাপোর্ট', '🔔 নোটিফিকেশন'].map(
                (feature, i) => (
                  <span
                    key={i}
                    className="text-[11px] md:text-xs bg-white/15 backdrop-blur-sm text-white/90 px-2.5 py-1 rounded-full border border-white/10 animate-fadeInUp"
                    style={{ animationDelay: `${0.6 + i * 0.15}s` }}
                  >
                    {feature}
                  </span>
                )
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleInstall}
                className="flex-1 relative overflow-hidden bg-white text-orange-600 py-3 px-5 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-100/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Download className="w-5 h-5 relative z-10 group-hover:animate-bounce" />
                <span className="relative z-10 text-[15px]">ইনস্টল করুন</span>
              </button>
              <button
                onClick={handleDismiss}
                className="px-5 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl font-medium transition-all duration-300 text-white/90 hover:text-white border border-white/10 hover:border-white/25 hover:scale-[1.02] active:scale-[0.98] text-[15px]"
              >
                পরে
              </button>
            </div>
          </div>

          {/* Bottom progress/accent bar */}
          <div className="h-1 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 animate-gradient-x" />
        </div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-12px) scale(1.2); opacity: 0.6; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(15deg); }
          100% { transform: translateX(200%) rotate(15deg); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradient-x {
          0% { background-size: 200% 100%; background-position: 0% 0%; }
          50% { background-size: 200% 100%; background-position: 100% 0%; }
          100% { background-size: 200% 100%; background-position: 0% 0%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out both;
        }
      `}</style>
    </>
  );
}
