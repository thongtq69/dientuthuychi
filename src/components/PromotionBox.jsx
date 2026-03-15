'use client';

import { useState } from 'react';

export function PromotionBox({ promotions = [], coupons = [] }) {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const defaultPromotions = [
    { text: 'Ưu đãi Học sinh - Sinh viên - Giảng viên: Giảm thêm 200K' },
    { text: 'Giảm 100.000đ khi mua kèm Tai nghe Samsung' },
    { text: 'Giảm 100.000đ khi mua kèm Tai nghe & Đồng Hồ Xiaomi' },
    { text: 'Phụ kiện mua 1 giảm 10% , mua từ 3 giảm 20% khi mua kèm máy' },
    { text: 'Giảm 10% quạt AOSIMAX khi mua kèm máy' },
    { text: 'Bảo hành 1 đổi 1 đến 12 tháng' },
    { text: 'Tặng Voucher phụ kiện 150K khi mua bảo hành VIP' }
  ];

  const defaultCoupons = [
    { code: 'AND50', description: 'Giảm 50.000đ', hsd: '31/03/2026' }
  ];

  const displayPromotions = promotions.length > 0 ? promotions : defaultPromotions;
  const displayCoupons = coupons.length > 0 ? coupons : defaultCoupons;

  return (
    <div className="space-y-4">
      {/* Coupon area */}
      {displayCoupons.map((coupon, idx) => (
        <div key={idx} className="rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/30 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
               <div className="flex items-center gap-2">
                  <span className="text-[14px] font-black text-slate-800">Mã ưu đãi:</span>
                  <span className="text-[14px] font-black text-orange-600">Nhập mã: {coupon.code}</span>
               </div>
               <div className="text-[18px] font-black text-slate-900 mt-1">{coupon.description}</div>
               <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">HSD: {coupon.hsd}</div>
            </div>
            <button 
                onClick={() => copyToClipboard(coupon.code)}
                className={`flex h-10 w-28 shrink-0 items-center justify-center rounded-lg text-[13px] font-black uppercase transition-all shadow-md ${
                    copied === coupon.code 
                    ? 'bg-green-600 text-white' 
                    : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                }`}
            >
                {copied === coupon.code ? 'Đã chép' : 'Sao chép'}
            </button>
          </div>
        </div>
      ))}

      {/* Special Offers List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-red-600 px-4 py-3 flex items-center gap-3">
          <span className="text-xl">🎁</span>
          <h3 className="text-[14px] font-black text-white uppercase tracking-wide">Ưu đãi đặc biệt</h3>
        </div>
        <div className="p-4 bg-slate-50/30">
           <ul className="space-y-3">
             {displayPromotions.map((item, idx) => (
               <li key={idx} className="flex items-start gap-3">
                 <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white">
                   {idx + 1}
                 </div>
                 <p className="text-[14px] font-bold text-slate-700 leading-tight">{item.text || item}</p>
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
  );
}
