'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export function HeroCarousel({ slides }) {
  return (
    <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
      <Swiper modules={[Pagination, Autoplay]} pagination={{ clickable: true }} autoplay={{ delay: 5000 }} loop>
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div className="grid min-h-[520px] gap-10 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-12">
              <div className="relative z-10 max-w-2xl self-center">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">{slide.eyebrow}</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{slide.title}</h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">{slide.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={slide.ctaHref} className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
                    {slide.ctaLabel}
                  </a>
                  <a href="#foundation" className="inline-flex rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">
                    Xem nền tảng rebuild
                  </a>
                </div>
              </div>

              <div className="relative h-[260px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 sm:h-[340px] lg:h-[420px]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
