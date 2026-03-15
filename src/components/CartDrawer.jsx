'use client';

import React from 'react';
import { useCart } from './CartContext';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-black uppercase">Giỏ hàng</h2>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fdd100] text-[11px] font-bold text-black">
              {cartItems.length}
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-slate-50 p-6">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </div>
              <p className="text-sm font-medium text-slate-500">Giỏ hàng của bạn đang trống</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-sm font-bold text-[#e00000] hover:underline"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-slate-50 pb-4 last:border-0">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
                    <Image 
                      src={item.image || '/placeholder-product.jpg'} 
                      alt={item.name} 
                      fill 
                      className="object-cover p-1" 
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="line-clamp-2 text-[14px] font-bold text-slate-900 leading-snug">{item.name}</h3>
                      {item.variant && (
                        <p className="mt-1 text-[12px] font-medium text-slate-500">Phân loại: {item.variant} </p>
                      )}
                      <p className="mt-1 text-[14px] font-bold text-[#e00000]">
                        {item.price.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-[13px] font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded bg-[#fdd100] text-black hover:bg-yellow-400 transition"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[12px] font-medium text-slate-400 hover:text-red-600 transition"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Tổng cộng:</span>
              <span className="text-xl font-black text-[#e00000]">{totalPrice.toLocaleString('vi-VN')}₫</span>
            </div>
            
            <Link 
              href="/cart"
              onClick={() => setIsCartOpen(false)}
              className="block w-full rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              XEM GIỎ HÀNG
            </Link>
            
            <Link 
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full rounded-xl bg-[#e00000] py-4 text-center text-sm font-black text-white hover:bg-red-700 transition active:scale-95 shadow-lg shadow-red-200 uppercase tracking-wider"
            >
              Tiến hành thanh toán
            </Link>

            <div className="flex items-center justify-center gap-4 pt-2">
               <Image src="/images/footer-assets/mpos.png" width={40} height={20} alt="mPOS" className="h-4 w-auto grayscale opacity-50" />
               <Image src="/images/footer-assets/kredivo.png" width={40} height={20} alt="Kredivo" className="h-4 w-auto grayscale opacity-50" />
               <Image src="/images/footer-assets/vnpay.png" width={40} height={20} alt="VNPay" className="h-4 w-auto grayscale opacity-50" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
