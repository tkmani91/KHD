import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function OptimizedImage({ src, alt, className = '' }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    // Preload image
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* Loading Skeleton - Better Animation */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
      
      {/* Actual Image */}
      {isLoaded && !hasError && (
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover animate-fadeIn"
          style={{ animationDuration: '0.3s' }}
        />
      )}
      
      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500">
          <span className="text-3xl mb-2">🖼️</span>
          <span className="text-xs">ছবি লোড হয়নি</span>
        </div>
      )}
    </div>
  );
}
