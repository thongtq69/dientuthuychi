'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { categoryRailItems, navItems, siteMeta, utilityLinks } from '@/data/siteData';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#f3f5f7]">
      {/* Top Banner - slim strip */}
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

      {/* Main Header Bar - Black */}
      <div className="bg-[#05030c] text-white">
        <div className="mx-auto flex max-w-[1270px] items-center gap-4 px-3 py-3 lg:gap-6">
          {/* Mobile hamburger */}
          <button
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-white/20 text-white lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className="text-xl">☰</span>
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <div className="relative h-[48px] w-[180px]">
              <Image
                src="/brand-logo-real.jpg"
                alt={siteMeta.name}
                fill
                priority
                sizes="180px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Category Button (Giá Kho Style: Yellow button) */}
          <div className="hidden lg:flex items-center justify-center bg-[#fdd100] text-black font-bold text-[14px] px-4 py-2 rounded shrink-0 h-[44px] cursor-pointer hover:bg-yellow-400 transition">
             <span className="mr-2 text-lg">☰</span> DANH MỤC
          </div>

          {/* Search bar */}
          <form className="hidden sm:flex h-[44px] min-w-0 flex-1 items-center overflow-hidden rounded bg-white relative">
            <input
              type="text"
              placeholder="Bạn muốn tìm gì ..."
              className="h-full w-full min-w-0 border-0 px-4 text-[14px] text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button type="button" className="absolute right-0 flex h-full shrink-0 items-center px-4 text-slate-600 bg-transparent hover:bg-slate-100 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </form>

          {/* Action blocks (desktop) */}
          <div className="hidden shrink-0 lg:flex lg:items-center lg:gap-4">
            <a href={`tel:${siteMeta.hotline}`} className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#fdd100] font-semibold">Gọi mua hàng</span>
                <span className="text-[13px] font-bold text-white whitespace-nowrap">{siteMeta.hotline}</span>
              </div>
            </a>
            
            <a href="/he-thong-cua-hang" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 font-semibold">Hệ thống</span>
                <span className="text-[13px] font-bold text-white">Showroom</span>
              </div>
            </a>
            
            <a href="/cart" className="flex items-center gap-2 hover:opacity-80 transition relative">
             <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 font-semibold">Giỏ</span>
                <span className="text-[13px] font-bold text-white">hàng</span>
              </div>
              <span className="absolute top-0 right-10 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">0</span>
            </a>
          </div>
        </div>
      </div>

       {/* USP Bar (Giá Kho Style) - Yellow */}
       <div className="hidden lg:block bg-[#fdd100] border-b border-black/5">
        <div className="mx-auto flex max-w-[1270px] items-center justify-between px-3 py-2 text-[13px] font-bold text-black uppercase">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>Chính hãng - Xuất VAT đầy đủ</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            <span>Thu cũ lên đời - Trả góp 0%</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span>Giao nhanh - Freeship đơn 500K</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.13 15.57a10 10 0 1 0 3.8-11.83l-3.23 3.86"></path></svg>
            <span>45 ngày miễn phí 1 đổi 1</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-[280px] bg-white text-slate-900 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <span className="font-bold text-lg">Menu</span>
              <button className="text-2xl text-slate-500" onClick={() => setMobileOpen(false)}>
                &times;
              </button>
            </div>
            <nav className="flex flex-col py-2">
              {categoryRailItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.title === 'Trang chủ' ? '/' : item.href}
                  className="px-4 py-3 text-[15px] font-medium border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
