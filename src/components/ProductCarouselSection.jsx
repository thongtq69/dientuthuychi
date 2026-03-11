'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';

export function ProductCarouselSection({ section }) {
  return (
    <section id={section.id} className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <SectionHeading
        eyebrow="Danh mục nổi bật"
        title={section.title}
        description={section.description}
        actionLabel="Xem toàn bộ sản phẩm"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {section.tabs.map((tab) => (
          <span key={tab} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
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
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {section.products.map((product) => (
          <SwiperSlide key={product.name} className="pb-2">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
