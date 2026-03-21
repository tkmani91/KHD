import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function OptimizedImage({ src, alt, className = '' }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Load 100px before visible
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Load image when visible
  useEffect(() => {
    if (!isVisible) return;

    const img = new Image();
    img.src = src;
    
    const timeout = setTimeout(() => {
      // Force error state after 8 seconds
      if (!isLoaded) {
        setHasError(true);
      }
    }, 8000);

    img.onload = () => {
      clearTimeout(timeout);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      setHasError(true);
    };

    return () => {
      clearTimeout(timeout);
      img.onload = null;
      img.onerror = null;
    };
  }, [isVisible, src, isLoaded]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0">
          {/* Skeleton Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" 
                 style={{ backgroundSize: '200% 100%' }} />
          </div>
          
          {/* Loading Spinner (only when image is being fetched) */}
          {isVisible && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-600 font-medium">লোড হচ্ছে...</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Loaded Image */}
      {isLoaded && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover animate-fadeInImage"
        />
      )}
      
      {/* Error State */}
      {hasError && !isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600">
          <div className="text-4xl mb-2 opacity-50">🖼️</div>
          <span className="text-xs font-medium mb-2">ছবি লোড হয়নি</span>
          <button 
            onClick={() => {
              setHasError(false);
              setIsLoaded(false);
              setIsVisible(false);
              // Trigger reload
              setTimeout(() => setIsVisible(true), 100);
            }}
            className="text-xs text-orange-600 hover:text-orange-700 hover:underline font-medium"
          >
            🔄 আবার চেষ্টা করুন
          </button>
        </div>
      )}
    </div>
  );
}
