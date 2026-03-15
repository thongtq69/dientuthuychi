'use client';

import { useState } from 'react';

export function FAQAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const defaultFaqs = [
    {
      question: "Samsung Galaxy A36 có 5G và NFC không?",
      answer: "Câu trả lời là CÓ. Galaxy A36 5G không chỉ hỗ trợ NFC mà còn đi kèm nhiều công nghệ kết nối hiện đại như Wi-Fi 6E, Bluetooth 5.3, SIM kép, mạng 5G và cổng USB-C."
    },
    {
      question: "Samsung Galaxy A36 chơi game mượt không?",
      answer: "Máy sở hữu vi xử lý Snapdragon 6 Gen 3, màn hình Super AMOLED 6.7” 120 Hz, cùng hệ thống tản nhiệt buồng hơi lớn mang đến trải nghiệm chơi game mượt mà."
    },
    {
      question: "Samsung Galaxy A36 có sạc không dây không?",
      answer: "Không. Galaxy A36 5G không hỗ trợ sạc không dây; bạn chỉ có thể sạc qua cổng USB-C với công nghệ 45 W sạc nhanh."
    },
    {
      question: "Samsung Galaxy A36 có chống nước không?",
      answer: "Có, máy đạt chuẩn IP67 — kháng bụi và chống nước ở mức độ nhẹ (ngâm trong 1m nước trong 30 phút)."
    }
  ];

  const items = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <h2 className="mb-6 text-center text-2xl font-black text-slate-900">Câu hỏi thường gặp</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-100"
            >
              <span className="text-[15px] font-black text-slate-800">{item.question || item.name}</span>
              <span className={`text-xl transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 9l-7 7-7-7"></path></svg>
              </span>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4 pt-0 text-[14px] font-medium leading-relaxed text-slate-600 border-t border-white">
                {item.answer || item.acceptedAnswer?.text || item.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
