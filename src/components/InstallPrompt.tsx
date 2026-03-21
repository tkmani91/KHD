import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 10 seconds
      setTimeout(() => {
        setShowPrompt(true);
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
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // Show again after 1 day
    localStorage.setItem('install-prompt-dismissed', Date.now().toString());
  };

  // Check if already dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    if (dismissed) {
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      if (parseInt(dismissed) > oneDayAgo) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-2xl p-5 z-50 animate-slideUp">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition"
        aria-label="বন্ধ করুন"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-3xl">🕉️</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">অ্যাপ ইনস্টল করুন</h3>
          <p className="text-sm opacity-95 mb-4 leading-relaxed">
            আপনার ফোনে ইনস্টল করে দ্রুত access করুন। অফলাইনেও কিছু ফিচার কাজ করবে।
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-white text-orange-600 py-2.5 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-orange-50 transition shadow-md"
            >
              <Download className="w-5 h-5" />
              ইনস্টল করুন
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition"
            >
              পরে
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
