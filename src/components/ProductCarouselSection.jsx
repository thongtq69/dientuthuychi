'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';

import { ProductCard } from '@/components/ProductCard';
import { getProductsBySlugs } from '@/data/siteData';

export function ProductCarouselSection({ section }) {
  const items = getProductsBySlugs(section.products);

  if (!items.length) return null;

  return (
    <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="border-l-4 border-[#1b66d2] pl-3 text-xl font-black uppercase tracking-tight text-slate-950 sm:text-[22px]">
          {section.title}
        </h2>
        <Link
          href={section.actionHref}
          className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#1b66d2] hover:text-[#1b66d2]"
        >
          {section.actionLabel} →
        </Link>
      </div>

      {section.tabs && section.tabs.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {section.tabs.map((tab, i) => (
            <button
              key={tab}
              className={`rounded-sm px-3 py-1.5 text-[13px] font-bold transition ${
                i === 0
                  ? 'bg-[#1b66d2] text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-[#1b66d2] hover:text-[#1b66d2]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={1.3}
        breakpoints={{
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {items.map((product) => (
          <SwiperSlide key={product.slug}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
