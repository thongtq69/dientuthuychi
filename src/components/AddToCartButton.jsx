'use client';

import React, { useState } from 'react';
import { useCart } from './CartContext';

export function AddToCartButton({ product, variant, quantity = 1, className = "", children }) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity, variant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`relative overflow-hidden transition-all active:scale-95 ${className}`}
      disabled={isAdded}
    >
      <span className={`inline-flex items-center justify-center gap-2 transition-transform duration-300 ${isAdded ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        {children || (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            THÊM VÀO GIỎ
          </>
        )}
      </span>
      
      {isAdded && (
        <span className="absolute inset-0 flex items-center justify-center gap-2 animate-in slide-in-from-bottom duration-300">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span className="text-[12px] font-bold text-green-600 uppercase">ĐÃ THÊM!</span>
        </span>
      )}
    </button>
  );
}
