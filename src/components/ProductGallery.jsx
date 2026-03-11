'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ProductGallery({ images = [], alt }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        {activeImage ? <Image src={activeImage} alt={alt} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-contain p-6" /> : null}
      </div>
      <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 lg:grid-cols-5">
        {images.map((image) => {
          const isActive = image === activeImage;
          return (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`relative aspect-square overflow-hidden rounded-2xl border bg-white ${isActive ? 'border-sky-500 shadow-md' : 'border-slate-200'}`}
            >
              <Image src={image} alt={alt} fill sizes="120px" className="object-contain p-2" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
