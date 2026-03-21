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
        rootMargin: '50px', // Load 50px before visible
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
      // Force show after 3 seconds even if not loaded
      setHasError(true);
    }, 5000);

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
  }, [isVisible, src]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0">
          {/* Skeleton */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          
          {/* Loading Spinner */}
          {isVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-500">লোড হচ্ছে...</span>
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
          className="w-full h-full object-cover animate-fadeIn"
        />
      )}
      
      {/* Error State */}
      {hasError && !isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500">
          <span className="text-3xl mb-2">🖼️</span>
          <span className="text-xs text-center px-2">ছবি লোড হয়নি</span>
          <button 
            onClick={() => {
              setHasError(false);
              setIsVisible(true);
            }}
            className="mt-2 text-xs text-orange-600 hover:underline"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}
    </div>
  );
}
