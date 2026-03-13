'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export function HeroCarousel({ slides }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <a
              href={slide.ctaHref}
              className="relative block w-full"
              title={slide.title}
              style={{ aspectRatio: '1184 / 476' }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 58vw, 760px"
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
