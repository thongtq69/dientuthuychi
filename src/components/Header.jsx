'use client';

import { useState } from 'react';
import { navItems, siteMeta } from '@/data/siteData';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <span className="text-xl">☰</span>
        </button>

        <div className="min-w-0 flex-1">
          <a href="#" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
              HK
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-slate-950">{siteMeta.name}</div>
              <div className="text-xs text-slate-500">Apple devices · accessories · repair parts</div>
            </div>
          </a>
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <div className="rounded-2xl border border-slate-200 px-4 py-2 text-right">
            <div className="text-xs text-slate-500">Hotline</div>
            <a href={`tel:${siteMeta.hotline}`} className="font-semibold text-slate-950">
              {siteMeta.hotline}
            </a>
          </div>
          <div className="rounded-2xl border border-slate-200 px-4 py-2 text-right">
            <div className="text-xs text-slate-500">Cửa hàng</div>
            <div className="font-semibold text-slate-950">Tra cứu & bản đồ</div>
          </div>
        </div>
      </div>

      <div className="hidden border-t border-slate-200 lg:block">
        <nav className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-4 text-sm text-slate-700 xl:px-8">
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

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-6">
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
        </div>
      ) : null}
    </header>
  );
}
