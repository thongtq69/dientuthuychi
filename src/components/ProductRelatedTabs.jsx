'use client';

import { useState } from 'react';
import { ProductRail } from '@/components/ProductRail';

export function ProductRelatedTabs({ related = [], accessories = [] }) {
  const [activeTab, setActiveTab] = useState('related');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab('accessories')}
          className={`px-6 py-2.5 font-black uppercase text-[12px] rounded-lg transition shadow-sm ${
            activeTab === 'accessories' ? 'bg-[#fdd100] text-black' : 'bg-white text-slate-500 hover:bg-slate-50'
          }`}
        >
          Sản phẩm mua kèm
        </button>
        <button 
          onClick={() => setActiveTab('related')}
          className={`px-6 py-2.5 font-black uppercase text-[12px] rounded-lg transition shadow-sm ${
            activeTab === 'related' ? 'bg-[#d5e3ff] text-slate-700' : 'bg-white text-slate-500 hover:bg-slate-50'
          }`}
        >
          Sản phẩm tương tự
        </button>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm min-h-[400px]">
        {activeTab === 'related' ? (
          <ProductRail products={related.slice(0, 5)} />
        ) : (
          <ProductRail products={accessories.slice(0, 5)} />
        )}
      </div>
    </div>
  );
}
