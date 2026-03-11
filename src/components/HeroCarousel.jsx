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
            <div className="relative min-h-[240px] sm:min-h-[300px] lg:min-h-[360px]">
              <Image src={slide.image} alt={slide.title} fill sizes="100vw" className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/35 to-transparent" />

              <div className="relative z-10 flex min-h-[240px] max-w-[62%] flex-col justify-center px-5 py-6 text-white sm:min-h-[300px] sm:px-7 lg:min-h-[360px] lg:px-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">{slide.eyebrow}</p>
                <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">{slide.title}</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-100 sm:text-base">{slide.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <a href={slide.ctaHref} className="inline-flex rounded-lg bg-[#1b66d2] px-4 py-2.5 text-sm font-semibold text-white">
                    {slide.ctaLabel}
                  </a>
                  <a href="#iphone" className="inline-flex rounded-lg bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm">
                    Xem sản phẩm
                  </a>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {slide.stats?.map((stat) => (
                    <div key={stat} className="rounded-lg bg-white/12 px-3 py-1.5 text-xs text-white">
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
