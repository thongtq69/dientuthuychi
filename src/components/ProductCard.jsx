"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartContext';

export function ProductCard({ product }) {
   const { addItem, setIsCartOpen } = useCart();
   const fallbackImage = 'https://cdn.dienthoaigiakho.vn/photos/1731313707122-Samsung-Galaxy-S25-Ultra-Den.jpg';
   const initialImage = useMemo(() => product.thumbnail || product.image || product.primary_image || fallbackImage, [product]);
   const [imageSrc, setImageSrc] = useState(initialImage);
   const brandLabel = product.brand && product.brand !== 'Khác' ? product.brand : product.category;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: initialImage
    });
    setIsCartOpen(true);
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price).replace('₫', 'đ');
  };

  const discount = product.originalPrice && product.price < product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/san-pham/${product.slug}`} className="group block h-full">
      <article className="relative flex h-full min-h-[22.5rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#fdd100] hover:shadow-xl">
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
          <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
            {discount > 0 && (
              <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
                -{discount}%
              </span>
            )}
            {brandLabel ? (
              <span className="rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 backdrop-blur">
                {brandLabel}
              </span>
            ) : null}
          </div>

          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 18vw"
            className="object-contain p-3 transition duration-500 group-hover:scale-105"
            onError={() => setImageSrc(fallbackImage)}
          />

          {/* Quick Add Button on Hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full p-2 transition-transform duration-300 group-hover:translate-y-0 z-20">
            <button 
                onClick={handleAddToCart}
                className="w-full h-10 rounded-lg bg-red-600 text-white font-bold text-[12px] flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                THÊM GIỎ HÀNG
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
          <h3 className="line-clamp-3 min-h-[3.8rem] text-[15px] font-extrabold leading-[1.28] text-slate-900 transition-colors group-hover:text-red-600">
            {product.name}
          </h3>

          <div className="flex min-h-[3.9rem] flex-col justify-start gap-1">
            <div className="text-[15px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Giá bán
            </div>
            <div className="text-[20px] font-black leading-none text-red-600">{formatPrice(product.price)}</div>
            {discount > 0 && (
               <div className="text-[13px] font-semibold text-slate-400 line-through">{formatPrice(product.originalPrice)}</div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
             <div className="flex items-center gap-2">
               <div className="flex text-[10px] text-amber-400">★★★★★</div>
               <span className="text-[11px] font-semibold text-slate-400">100+ đã bán</span>
             </div>
             <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
               {product.status || 'Sẵn hàng'}
             </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

