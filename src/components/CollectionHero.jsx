import Image from 'next/image';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export function CollectionHero({ collection, count }) {
  const breadcrumbItems = collection.breadcrumb.map((label, index) => ({
    label,
    href: index === 0 ? '/' : undefined,
  }));

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">{collection.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{collection.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{collection.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">{count} sản phẩm mẫu</div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700">Template category responsive</div>
          </div>
        </div>

        <div className="relative min-h-[240px] overflow-hidden rounded-[1.75rem] bg-slate-100">
          <Image src={collection.heroImage} alt={collection.title} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
