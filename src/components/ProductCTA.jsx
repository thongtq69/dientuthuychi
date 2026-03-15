'use client';

import React from 'react';
import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';
import { AddToCartButton } from './AddToCartButton';

export function ProductCTA({ product, variant }) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    addItem(product, 1, variant);
    router.push('/checkout');
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-5 gap-3">
        <AddToCartButton 
          product={product} 
          variant={variant}
          className="col-span-2 h-[56px] rounded-xl border-2 border-red-600 bg-white text-red-600 font-black text-[14px] hover:bg-red-50 flex items-center justify-center gap-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <span className="hidden sm:inline">THÊM GIỎ</span>
        </AddToCartButton>

        <button 
          onClick={handleBuyNow}
          className="col-span-3 h-[56px] rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-black text-[16px] shadow-lg shadow-red-200 active:scale-[0.98] uppercase tracking-wide flex flex-col items-center justify-center"
        >
          <span>MUA NGAY</span>
          <span className="text-[10px] font-medium opacity-80">(Giao nhanh từ 2 giờ)</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="h-14 rounded-xl bg-slate-900 text-white font-bold text-[13px] hover:bg-black transition shadow-sm flex flex-col items-center justify-center border border-slate-800">
          <span className="uppercase">TRẢ GÓP 0%</span>
          <span className="text-[10px] font-medium opacity-70">Duyệt hồ sơ 5 phút</span>
        </button>
        <button className="h-14 rounded-xl border border-emerald-600 bg-emerald-50/50 text-emerald-700 font-bold text-[13px] hover:bg-emerald-100 transition shadow-sm flex flex-col items-center justify-center">
          <span className="uppercase">THU CŨ QUY ĐỔI</span>
          <span className="text-[10px] font-medium opacity-70">Trợ giá đến 2 triệu</span>
        </button>
      </div>
    </div>
  );
}
