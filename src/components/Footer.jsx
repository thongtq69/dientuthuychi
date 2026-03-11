import { footerColumns, siteMeta, storeBenefits } from '@/data/siteData';

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

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_repeat(4,1fr)]">
          <div>
            <div className="text-2xl font-semibold text-white">{siteMeta.name}</div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">{siteMeta.address}</p>
            <a href={`tel:${siteMeta.hotline}`} className="mt-4 inline-flex rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white">
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

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">
          Rebuild foundation for hoangkien.com · Next.js + Tailwind + Swiper.
        </div>
      </div>
    </footer>
  );
}
