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
            <div className="relative min-h-[220px] sm:min-h-[260px] lg:min-h-[320px]">
              <Image src={slide.image} alt={slide.title} fill sizes="100vw" className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/58 via-slate-950/22 to-transparent" />

              <div className="relative z-10 flex min-h-[220px] max-w-[76%] flex-col justify-center px-4 py-5 text-white sm:min-h-[260px] sm:px-6 lg:min-h-[320px] lg:px-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-100">{slide.eyebrow}</p>
                <h1 className="mt-2 text-xl font-bold leading-tight sm:text-2xl lg:text-[30px]">{slide.title}</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-100">{slide.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={slide.ctaHref} className="inline-flex rounded-lg bg-[#1b66d2] px-4 py-2.5 text-sm font-semibold text-white">
                    {slide.ctaLabel}
                  </a>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {slide.stats?.map((stat) => (
                    <div key={stat} className="rounded-md bg-white/12 px-3 py-1.5 text-xs text-white">
                      {stat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
