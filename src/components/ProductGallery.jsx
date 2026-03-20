'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ProductGallery({ images = [], alt }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex = images[activeIndex] ? activeIndex : 0;
  const activeImage = images[safeActiveIndex] || '';

  const handleNext = () => {
    const nextIdx = (safeActiveIndex + 1) % images.length;
    setActiveIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (safeActiveIndex - 1 + images.length) % images.length;
    setActiveIndex(prevIdx);
  };

  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="group relative aspect-square w-full items-center justify-center overflow-hidden rounded-3xl bg-white transition-all duration-500">
        {activeImage ? (
          <div className="relative h-full w-full p-4 lg:p-10 flex items-center justify-center">
            <Image 
              src={activeImage} 
              alt={alt} 
              fill 
              sizes="(max-width: 640px) 100vw, 600px" 
              priority
              className={`object-contain transition-all duration-700 group-hover:scale-110 ${imageError ? 'opacity-0' : 'opacity-100'}`}
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
            {imageError && (
              <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300 flex-col gap-2">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span className="text-xs font-bold uppercase tracking-widest">Image Unavailable</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
             No Image Available
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
            <>
                <button 
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button 
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
                </button>
            </>
        )}
        
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 px-10 flex-wrap pointer-events-none">
           {images.slice(0, 20).map((_, i) => (
               <div 
                 key={i} 
                 className={`h-1.5 rounded-full transition-all duration-300 ${i === safeActiveIndex ? 'w-6 bg-slate-900 shadow-sm' : 'w-1.5 bg-slate-200/80'}`}
                />
            ))}
        </div>
      </div>
      
      {/* Thumbnails Tray */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {images.map((image, idx) => {
          const isActive = idx === safeActiveIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setImageError(false);
                setActiveIndex(idx);
              }}
              className={`relative h-16 w-16 lg:h-20 lg:w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                  isActive 
                  ? 'border-yellow-400 bg-white ring-2 ring-yellow-400/20' 
                  : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              <Image 
                src={image} 
                alt={`${alt} - ${idx}`} 
                fill 
                sizes="80px" 
                className="object-contain p-1 lg:p-2" 
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
