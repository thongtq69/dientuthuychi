import { footerColumns, siteMeta, storeBenefits, storeLocations } from '@/data/siteData';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[2rem] bg-white/5 p-6 sm:grid-cols-2 xl:grid-cols-4">
          {storeBenefits.map((benefit) => (
            <div key={benefit} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium">
              {benefit}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <div className="text-2xl font-semibold text-white">{siteMeta.name}</div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">{siteMeta.address}</p>
            <p className="mt-2 text-sm text-slate-500">Hotline hỗ trợ: {siteMeta.hotline}</p>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              {storeLocations.map((location) => (
                <div key={location} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  {location}
                </div>
              ))}
            </div>

            <a href={`tel:${siteMeta.hotline}`} className="mt-5 inline-flex rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white">
              Hotline {siteMeta.hotline}
            </a>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{column.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-400 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div>Rebuild storefront foundation for hoangkien.com · Next.js + Tailwind + Swiper.</div>
          <a href="#" className="rounded-full border border-white/10 px-4 py-2 text-center font-semibold text-white">
            Chính sách bảo hành
          </a>
          <a href="#" className="rounded-full border border-white/10 px-4 py-2 text-center font-semibold text-white">
            Hướng dẫn mua hàng
          </a>
        </div>
      </div>
    </footer>
  );
}
