import Image from 'next/image';
import Link from 'next/link';

export function CategoryCard({ category }) {
  return (
    <Link
      href={category.href}
      className="group flex h-full items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-50">
        <Image src={category.image} alt={category.title} fill sizes="80px" className="object-contain p-3" />
      </div>
      <div className="min-w-0">
        <div className="text-base font-semibold text-slate-900">{category.title}</div>
        <div className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{category.description}</div>
        <div className="mt-2 text-sm font-medium text-sky-600 transition group-hover:text-sky-700">Xem danh mục →</div>
      </div>
    </Link>
  );
}
