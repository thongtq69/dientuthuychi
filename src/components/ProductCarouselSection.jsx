'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';
import { getProductsBySlugs } from '@/data/siteData';

export function ProductCarouselSection({ section }) {
  const products = getProductsBySlugs(section.products);

  return (
    <section id={section.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        actionLabel={section.actionLabel ?? 'Xem toàn bộ sản phẩm'}
        actionHref={section.actionHref}
        compact={section.title?.length > 18}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {section.tabs.map((tab, index) => (
          <span
            key={tab}
            className={`rounded-lg px-3 py-2 text-sm ${index === 0 ? 'bg-[#1b66d2] text-white' : 'border border-slate-200 bg-slate-50 text-slate-600'}`}
          >
            {tab}
          </span>
        ))}
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={12}
        breakpoints={{
          320: { slidesPerView: 2.1 },
          560: { slidesPerView: 2.6 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4.2 },
          1280: { slidesPerView: 5.2 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.slug} className="pb-2">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
