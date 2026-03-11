'use client';

import { useState } from 'react';

export function ProductInfoTabs({ product }) {
  const tabs = [
    { id: 'chi-tiet', label: 'Chi tiết', content: product.description },
    { id: 'thong-so', label: 'Thông số kỹ thuật', content: product.specs },
    {
      id: 'bao-hanh',
      label: 'Bảo hành & hỗ trợ',
      content: [
        'Hỗ trợ kỹ thuật và tư vấn tương thích theo từng nhóm máy.',
        'Có thể thay bằng dữ liệu thật hoặc nội dung CMS ở các pass sau.',
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tabs.map((tab) => {
          if (tab.id !== activeTab) return null;

          if (tab.id === 'thong-so') {
            return (
              <div key={tab.id} className="grid gap-3 sm:grid-cols-2">
                {tab.content.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="text-sm text-slate-500">{label}</div>
                    <div className="mt-1 text-base font-semibold text-slate-950">{value}</div>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div key={tab.id} className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
              {tab.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
