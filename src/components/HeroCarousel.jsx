'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export function HeroCarousel({ slides }) {
  return (
    <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm h-full">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full"
        style={{ height: '100%' }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} style={{ height: '100%' }}>
            <a
              href={slide.ctaHref}
              className="relative block h-full min-h-[280px] sm:min-h-[360px] xl:min-h-0 xl:aspect-auto"
              title={slide.title}
              style={{ aspectRatio: '730/460' }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="(max-width: 1280px) 100vw, (max-width: 1024px) 70vw, 900px"
                className="object-cover"
                priority={index === 0}
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
