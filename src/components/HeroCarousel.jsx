'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export function HeroCarousel({ slides }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const safeSlides = Array.isArray(slides) ? slides.filter((slide) => slide?.image) : [];
  const fallbackSlide = safeSlides[0] || null;

  if (!fallbackSlide) {
    return null;
  }

  if (!hasMounted || safeSlides.length === 1) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <a
          href={fallbackSlide.ctaHref}
          className="relative block w-full"
          title={fallbackSlide.title}
          style={{ aspectRatio: '1184 / 476' }}
        >
          <Image
            src={fallbackSlide.image}
            alt={fallbackSlide.title}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 58vw, 760px"
            className="object-cover"
            priority
          />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="w-full [&_.swiper-slide]:!w-full [&_.swiper-slide]:shrink-0 [&_.swiper-wrapper]:items-stretch"
      >
        {safeSlides.map((slide, index) => (
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
