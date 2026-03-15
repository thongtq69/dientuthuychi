'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function StickyActionBar({ product }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatPrice = (p) => {
    if (typeof p === 'string') {
        const clean = p.replace(/\D/g, '');
        if (clean) return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(clean)).replace('₫', 'đ');
        return p;
    }
    if (!p) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p).replace('₫', 'đ');
  };

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-2 shadow-md transition-all animate-move-down hidden lg:block">
      <div className="mx-auto flex max-w-[1270px] items-center justify-between gap-6">
        {/* Left: Product Info in Breadcrumb Style */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white border border-slate-100 p-0.5">
            <Image src={product.image || product.primary_image} alt={product.name} fill className="object-contain" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="line-clamp-1 text-[14px] font-black text-slate-900 uppercase">{product.name}</div>
            <div className="text-[11px] font-bold text-slate-400">Tùy chọn: <span className="text-slate-600 capitalize">{product.color || 'Mặc định'}</span></div>
          </div>
        </div>
        
        {/* Right: Price & Buttons */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex flex-col items-end">
             <div className="text-[18px] font-black text-red-600">{formatPrice(product.price)}</div>
             {product.originalPrice && (
                 <div className="flex items-center gap-2">
                    <span className="text-[12px] text-slate-400 line-through font-bold">{formatPrice(product.originalPrice)}</span>
                    <span className="text-[11px] text-red-600 font-black">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                 </div>
             )}
          </div>
          
          <div className="flex gap-2">
            <button className="h-[44px] rounded-lg bg-red-600 px-8 text-[14px] font-black text-white hover:bg-red-700 transition active:scale-95 shadow-lg shadow-red-200">
               MUA NGAY
            </button>
            <button className="h-[44px] rounded-lg bg-sky-600 px-6 text-[14px] font-black text-white hover:bg-sky-700 transition active:scale-95 shadow-lg shadow-sky-100 uppercase">
               Trả góp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
