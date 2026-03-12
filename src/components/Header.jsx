'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { categoryRailItems, navItems, siteMeta, utilityLinks } from '@/data/siteData';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top Banner - slim strip like Hoang Kien */}
      <div className="hidden bg-[#05030c] md:block">
        <div className="mx-auto max-w-[1270px]">
          <Link href="/" className="block">
            <div className="relative h-[33px] w-full">
              <Image
                src="https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner_top.jpg?1768028836881"
                alt="Banner top"
                fill
                priority
                sizes="1270px"
                className="object-contain"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Main Header Bar - dark */}
      <div className="bg-[#05030c] text-white">
        <div className="mx-auto flex max-w-[1270px] items-center gap-2 px-3 py-2 sm:gap-3 lg:gap-4">
          {/* Mobile hamburger */}
          <button
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-white/20 text-white lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className="text-lg">☰</span>
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="relative h-[42px] w-[160px] sm:h-[48px] sm:w-[190px]">
              <Image
                src="/brand-logo-real.jpg"
                alt={siteMeta.name}
                fill
                priority
                sizes="190px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Danh mục button (desktop) */}
          <div className="hidden shrink-0 lg:block">
            <div className="flex h-10 items-center gap-2 rounded bg-[#1a1a1a] border border-white/10 px-3 text-sm font-bold text-white">
              <span>☰</span>
              <span>Danh mục</span>
            </div>
          </div>

          {/* Search bar */}
          <form className="flex h-10 min-w-0 flex-1 items-center overflow-hidden rounded bg-white">
            <input
              type="text"
              placeholder={siteMeta.searchPlaceholder}
              className="h-full w-full min-w-0 border-0 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button type="button" className="flex h-full shrink-0 items-center px-3 text-slate-600">
              🔍
            </button>
          </form>

          {/* Action blocks (desktop) */}
          <div className="hidden shrink-0 lg:flex lg:items-center lg:gap-1">
            <a
              href={`tel:${siteMeta.hotline}`}
              className="flex min-h-[56px] min-w-[140px] flex-col items-center justify-center rounded border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-center transition hover:bg-white/10"
            >
              <span className="text-[9px] uppercase text-slate-400 font-semibold">Hotline</span>
              <span className="text-[12px] font-black text-white whitespace-nowrap">{siteMeta.hotline}</span>
            </a>
            <a
              href="/he-thong-cua-hang"
              className="flex min-h-[56px] min-w-[140px] flex-col items-center justify-center rounded border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-center transition hover:bg-white/10"
            >
              <span className="text-[9px] text-slate-400 font-semibold">Hệ thống</span>
              <span className="text-[10px] font-bold text-white">cửa hàng</span>
            </a>
            <a
              href="/apps/kiem-tra-don-hang"
              className="flex min-h-[56px] min-w-[140px] flex-col items-center justify-center rounded border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-center transition hover:bg-white/10"
            >
              <span className="text-[9px] text-slate-400 font-semibold">Tra cứu</span>
              <span className="text-[10px] font-bold text-white">đơn hàng</span>
            </a>
            <a
              href="/cart"
              className="flex min-h-[56px] min-w-[140px] flex-col items-center justify-center rounded border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-center transition hover:bg-white/10"
            >
              <span className="text-[9px] text-slate-400 font-semibold">Giỏ hàng</span>
              <span className="text-[10px] font-bold text-white">Sản phẩm 0</span>
            </a>
            <a
              href="#"
              className="flex min-h-[56px] min-w-[140px] flex-col items-center justify-center rounded border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-center transition hover:bg-white/10"
            >
              <span className="text-[9px] text-slate-400 font-semibold">Xem thêm</span>
              <span className="text-[10px] font-bold text-white">Thông tin</span>
            </a>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar */}
      <div className="hidden border-b border-slate-200 bg-white lg:block">
        <div className="mx-auto flex max-w-[1270px] items-center gap-4 px-3">
          {/* Category dropdown trigger */}
          <div className="group relative w-[220px] shrink-0">
            <div className="flex h-9 items-center justify-between rounded-t bg-[#1b66d2] px-3 text-[13px] font-black text-white">
              <span>Danh mục sản phẩm</span>
              <span>☰</span>
            </div>
            <div className="pointer-events-none absolute left-0 top-full z-30 hidden w-full opacity-0 transition-all group-hover:pointer-events-auto group-hover:block group-hover:opacity-100">
              <div className="overflow-hidden border border-slate-200 bg-white shadow-lg">
                {categoryRailItems.map((cat) => (
                  <Link
                    key={cat.title}
                    href={cat.href}
                    className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 text-[13px] text-slate-700 transition hover:bg-slate-50 hover:text-[#1b66d2]"
                  >
                    <span>{cat.title}</span>
                    <span className="text-slate-300">›</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-wrap items-center gap-x-6 py-2 text-[14px] font-bold text-slate-700">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="py-1 transition hover:text-[#1b66d2]">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Utility links */}
          <div className="flex shrink-0 items-center gap-4 text-[13px] text-slate-500">
            {utilityLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition hover:text-[#1b66d2]">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="px-3 py-4">
            <div className="mb-4 overflow-hidden rounded border border-slate-200">
              <div className="bg-[#1b66d2] px-4 py-2.5 text-[13px] font-black text-white">Danh mục sản phẩm</div>
              {categoryRailItems.map((cat) => (
                <Link key={cat.title} href={cat.href} className="block border-b border-slate-100 px-4 py-2.5 text-[13px] text-slate-700">
                  {cat.title}
                </Link>
              ))}
            </div>
            <nav className="grid gap-1.5">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} className="rounded border border-slate-200 px-4 py-2.5 text-[13px] font-bold text-slate-900">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid gap-1.5">
              <a href={`tel:${siteMeta.hotline}`} className="rounded bg-[#1b66d2] px-4 py-3 text-center text-[13px] font-black text-white">
                📞 Hotline: {siteMeta.hotline}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
