import { trustBadges } from '@/data/siteData';

export function HomeFeatureStrip() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {trustBadges.map((item, index) => (
        <div key={item.title} className={`rounded-[1.5rem] border p-5 shadow-sm ${index === 0 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white'}`}>
          <div className={`text-base font-semibold ${index === 0 ? 'text-white' : 'text-slate-950'}`}>{item.title}</div>
          <p className={`mt-2 text-sm leading-6 ${index === 0 ? 'text-slate-300' : 'text-slate-600'}`}>{item.text}</p>
        </div>
      ))}
    </section>
  );
}
