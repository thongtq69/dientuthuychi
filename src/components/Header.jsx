'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { categoryRailItems, featuredCategories, navItems, siteMeta, utilityLinks } from '@/data/siteData';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="hidden bg-[#05030c] text-white md:block">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 xl:px-8">
          <Link href="/" className="block">
            <div className="relative aspect-[1270/33] w-full">
              <Image
                src="https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner_top.jpg?1768028836881"
                alt="Banner top"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1270px"
                className="object-cover"
              />
            </div>
          </Link>
        </div>
      </div>

      <div className="border-b border-slate-900 bg-[#05030c] text-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-3 py-2 sm:px-4 lg:grid-cols-[205px_132px_minmax(0,1fr)_500px] lg:items-center lg:px-6 xl:px-8">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              <span className="text-lg">☰</span>
            </button>

            <Link href="/" className="inline-flex min-w-0 items-center gap-3">
              <div className="relative h-[48px] w-[185px] overflow-hidden rounded-sm bg-[#05030c] sm:h-[52px] sm:w-[210px]">
                <Image
                  src="/brand-logo-real.jpg"
                  alt={siteMeta.name}
                  fill
                  priority
                  sizes="210px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="flex h-10 items-center gap-2 rounded-sm bg-[#151515] px-3 text-sm font-medium text-white shadow-sm border border-white/10">
              <span className="text-base leading-none">☰</span>
              <span className="whitespace-nowrap">Danh mục</span>
            </div>
          </div>

          <form className="flex h-10 items-center overflow-hidden rounded-sm border border-white/10 bg-white">
            <input
              type="text"
              placeholder={siteMeta.searchPlaceholder}
              className="h-full w-full border-0 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button type="button" className="h-full bg-white px-4 text-sm font-semibold text-slate-900 sm:px-5">
              🔍
            </button>
          </form>

          <div className="hidden lg:grid lg:grid-cols-[124px_1fr_1fr_1fr_0.9fr] lg:gap-1">
            <a href={`tel:${siteMeta.hotline}`} className="rounded-sm border border-white/10 bg-[#151515] px-2 py-1.5 text-center shadow-sm">
              <div className="text-[9px] uppercase leading-3 text-slate-400">Hotline</div>
              <div className="text-[13px] font-bold leading-4 tracking-[-0.01em] text-white">{siteMeta.hotline}</div>
            </a>
            <a href="/he-thong-cua-hang-hoang-kien" className="rounded-sm border border-white/10 bg-[#151515] px-2 py-1.5 text-center text-[10px] font-medium leading-4 text-white shadow-sm">
              Hệ thống<br/>cửa hàng
            </a>
            <a href="/apps/kiem-tra-don-hang" className="rounded-sm border border-white/10 bg-[#151515] px-2 py-1.5 text-center text-[10px] font-medium leading-4 text-white shadow-sm">
              Tra cứu<br/>đơn hàng
            </a>
            <a href="/cart" className="rounded-sm border border-white/10 bg-[#151515] px-2 py-1.5 text-center text-[10px] font-medium leading-4 text-white shadow-sm">
              Giỏ hàng
              <div className="text-[9px] leading-3 text-slate-400">Sản phẩm 0</div>
            </a>
            <a href="#" className="rounded-sm border border-white/10 bg-[#151515] px-2 py-1.5 text-center text-[10px] font-medium leading-4 text-white shadow-sm">
              Thông tin
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto hidden max-w-7xl grid-cols-[220px_minmax(0,1fr)_260px] items-center gap-4 px-4 py-1.5 lg:grid lg:px-6 xl:px-8">
          <div className="group relative">
            <div className="flex h-9 items-center justify-between rounded-sm bg-[#1b66d2] px-3 text-sm font-semibold text-white">
              <span>Danh mục sản phẩm</span>
              <span>☰</span>
            </div>
            <div className="pointer-events-none absolute left-0 top-full z-30 mt-1 hidden w-full opacity-0 transition group-hover:pointer-events-auto group-hover:block group-hover:opacity-100 xl:block">
              <div className="overflow-hidden rounded-b-2xl border border-slate-200 bg-white shadow-xl">
                {categoryRailItems.map((category) => (
                  <Link
                    key={category.title}
                    href={category.href}
                    className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                  >
                    <span>{category.title}</span>
                    <span className="text-slate-300">›</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-medium text-slate-700">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-[#1b66d2]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4 text-sm text-slate-600">
            {utilityLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition hover:text-[#1b66d2]">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="px-3 py-4 sm:px-4">
            <form className="mb-4 flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <input type="text" placeholder={siteMeta.searchPlaceholder} className="h-11 w-full bg-transparent px-4 text-sm outline-none placeholder:text-slate-400" />
            </form>

            <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">Danh mục sản phẩm</div>
              <div className="py-1">
                {categoryRailItems.map((category) => (
                  <Link key={category.title} href={category.href} className="block border-b border-slate-100 px-4 py-3 text-sm text-slate-700">
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>

            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 grid gap-2">
              <a href={`tel:${siteMeta.hotline}`} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                Hotline: {siteMeta.hotline}
              </a>
              {utilityLinks.map((link) => (
                <a key={link.label} href={link.href} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
