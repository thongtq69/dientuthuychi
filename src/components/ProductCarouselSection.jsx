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
    <section id={section.id} className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <SectionHeading
          eyebrow="Danh mục sản phẩm"
          title={section.title}
          description={section.description}
          actionLabel="Xem tất cả"
          actionHref={section.actionHref}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {section.tabs.map((tab, index) => (
          <span key={tab} className={`rounded-full px-4 py-2 text-sm ${index === 0 ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-slate-50 text-slate-600'}`}>
            {tab}
          </span>
        ))}
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          560: { slidesPerView: 2.1 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
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
