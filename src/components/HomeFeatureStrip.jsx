import { trustBadges } from '@/data/siteData';

export function HomeFeatureStrip() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {trustBadges.map((item) => (
        <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-base font-semibold text-slate-950">{item.title}</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
        </div>
      ))}
    </section>
  );
}
