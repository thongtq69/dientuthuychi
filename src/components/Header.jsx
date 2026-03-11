'use client';

import Link from 'next/link';
import { useState } from 'react';
import { navItems, siteMeta, utilityLinks } from '@/data/siteData';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/96 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="border-b border-slate-200 bg-slate-950 text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>{siteMeta.supportHours}</span>
            <span className="hidden text-slate-500 sm:inline">•</span>
            <span>{siteMeta.address}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {utilityLinks.slice(0, 3).map((link) => (
              <a key={link.label} href={link.href} className="transition hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)_auto] lg:items-center lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <span className="text-xl">☰</span>
          </button>

          <Link href="/" className="inline-flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-lg">
              HK
            </div>
            <div className="min-w-0">
              <div className="truncate text-xl font-semibold tracking-tight text-slate-950">{siteMeta.name}</div>
              <div className="truncate text-xs text-slate-500">Apple devices · accessories · repair parts</div>
            </div>
          </Link>
        </div>

        <div className="hidden lg:block">
          <form className="flex h-13 items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-inner">
            <div className="px-5 text-slate-400">⌕</div>
            <input
              type="text"
              placeholder={siteMeta.searchPlaceholder}
              className="h-full w-full border-0 bg-transparent px-0 text-sm outline-none placeholder:text-slate-400"
            />
            <button type="button" className="mr-2 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white">
              Tìm kiếm
            </button>
          </form>
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <a href={`tel:${siteMeta.hotline}`} className="rounded-[1.25rem] border border-slate-200 px-4 py-3 text-right shadow-sm transition hover:border-sky-200 hover:bg-sky-50">
            <div className="text-xs text-slate-500">Hotline</div>
            <div className="font-semibold text-slate-950">{siteMeta.hotline}</div>
          </a>
          <a href="#he-thong-cua-hang" className="rounded-[1.25rem] border border-slate-200 px-4 py-3 text-right shadow-sm transition hover:border-sky-200 hover:bg-sky-50">
            <div className="text-xs text-slate-500">Cửa hàng</div>
            <div className="font-semibold text-slate-950">Bản đồ & tra cứu</div>
          </a>
          <a href="#tra-cuu-don-hang" className="rounded-[1.25rem] border border-slate-200 px-4 py-3 text-right shadow-sm transition hover:border-sky-200 hover:bg-sky-50">
            <div className="text-xs text-slate-500">Đơn hàng</div>
            <div className="font-semibold text-slate-950">Tra cứu nhanh</div>
          </a>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto hidden max-w-7xl grid-cols-[220px_minmax(0,1fr)] gap-6 px-6 py-4 lg:grid xl:px-8">
          <div className="rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white shadow-lg">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Danh mục</div>
            <div className="mt-2 text-lg font-semibold">Sản phẩm nổi bật</div>
          </div>

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-700">
            {navItems.map((item) => (
              <div key={item.label} className="group relative">
                <a href={item.href} className="font-medium transition hover:text-sky-600">
                  {item.label}
                </a>
                {item.children ? (
                  <div className="invisible absolute left-0 top-full mt-4 w-72 rounded-3xl border border-slate-200 bg-white p-4 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Danh mục con</div>
                    <div className="space-y-2">
                      {item.children.map((child) => (
                        <a key={child} href={item.href} className="block rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                          {child}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="px-4 py-4 sm:px-6">
            <form className="mb-4 flex items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              <div className="px-4 text-slate-400">⌕</div>
              <input type="text" placeholder={siteMeta.searchPlaceholder} className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
            </form>

            <nav className="space-y-3">
              {navItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 p-3">
                  <a href={item.href} className="font-semibold text-slate-900">
                    {item.label}
                  </a>
                  {item.children ? (
                    <div className="mt-2 grid gap-2 text-sm text-slate-600">
                      {item.children.map((child) => (
                        <a key={child} href={item.href} className="rounded-xl bg-slate-50 px-3 py-2">
                          {child}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a href={`tel:${siteMeta.hotline}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                Hotline: {siteMeta.hotline}
              </a>
              <a href="#tra-cuu-don-hang" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                Tra cứu đơn hàng
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
