import Link from 'next/link';
import { footerColumns, siteMeta, storeBenefits, storeLocations } from '@/data/siteData';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white text-slate-700">
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4 lg:px-6 xl:px-8">
        <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-4">
          {storeBenefits.map((benefit) => (
            <div key={benefit} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium">
              {benefit}
            </div>
          ))}
        </div>

        <div id="he-thong-cua-hang" className="mt-8 grid gap-8 border-t border-slate-200 pt-8 xl:grid-cols-[1.25fr_repeat(4,1fr)]">
          <div>
            <div className="text-2xl font-bold text-slate-950">{siteMeta.name}</div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">{siteMeta.address}</p>
            <p className="mt-2 text-sm text-slate-600">Hotline: {siteMeta.hotline}</p>

            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              {storeLocations.map((location) => (
                <div key={location} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  {location}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`tel:${siteMeta.hotline}`} className="inline-flex rounded-lg bg-[#1b66d2] px-4 py-2.5 text-sm font-semibold text-white">
                Hotline {siteMeta.hotline}
              </a>
              <Link href="/tin-tuc" className="inline-flex rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900">
                Tin tức
              </Link>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{column.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-[#1b66d2]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 lg:flex lg:items-center lg:justify-between lg:gap-4">
          <div>Chuyên iPhone, iPad, linh kiện và phụ kiện Apple.</div>
          <div>Mua hàng nhanh qua hotline, giao nội thành và hỗ trợ bảo hành rõ ràng.</div>
        </div>
      </div>
    </footer>
  );
}
