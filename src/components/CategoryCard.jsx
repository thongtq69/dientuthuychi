import Image from 'next/image';

export function CategoryCard({ category }) {
  return (
    <a
      href={category.href}
      className="group flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-50">
        <Image src={category.image} alt={category.title} fill sizes="80px" className="object-contain p-3" />
      </div>
      <div className="min-w-0">
        <div className="text-base font-semibold text-slate-900">{category.title}</div>
        <div className="mt-1 text-sm text-slate-500 transition group-hover:text-sky-600">Xem danh mục →</div>
      </div>
    </a>
  );
}
