'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export function HeroCarousel({ slides }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Swiper modules={[Pagination, Autoplay]} pagination={{ clickable: true }} autoplay={{ delay: 5000 }} loop>
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <a href={slide.ctaHref} className="relative block min-h-[220px] sm:min-h-[260px] lg:min-h-[320px]">
              <Image src={slide.image} alt={slide.title} fill sizes="100vw" className="object-cover" priority />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
