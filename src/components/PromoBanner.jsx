import Image from 'next/image';

export function PromoBanner({ banner }) {
  const isDark = banner.tone === 'dark';

  return (
    <a
      href={banner.href}
      className={`group relative overflow-hidden rounded-[2rem] border shadow-sm ${
        isDark ? 'border-slate-900 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-950'
      }`}
    >
      <div className="absolute inset-0 opacity-30">
        <Image src={banner.image} alt={banner.title} fill sizes="100vw" className="object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className={`absolute inset-0 ${isDark ? 'bg-slate-950/65' : 'bg-white/75'}`} />
      <div className="relative z-10 grid gap-4 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="max-w-2xl">
          <p className={`text-xs font-semibold uppercase tracking-[0.26em] ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>Ưu đãi & dịch vụ</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{banner.title}</h3>
          <p className={`mt-3 max-w-xl text-sm leading-6 ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>{banner.description}</p>
        </div>
        <span className={`inline-flex w-fit items-center rounded-full px-5 py-3 text-sm font-semibold ${isDark ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'}`}>
          Xem thêm →
        </span>
      </div>
    </a>
  );
}
