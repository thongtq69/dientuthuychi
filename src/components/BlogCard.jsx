import Image from 'next/image';
import Link from 'next/link';

export function BlogCard({ post, compact = false }) {
  if (compact) {
    return (
      <article className="group grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white sm:grid-cols-[148px_1fr] sm:items-center">
        <Link href={`/tin-tuc/${post.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[4/3]">
          <Image src={post.image} alt={post.title} fill sizes="148px" className="object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <span>{post.category}</span>
            <span className="text-slate-300">•</span>
            <span>{post.date}</span>
          </div>
          <Link href={`/tin-tuc/${post.slug}`} className="mt-2 block text-base font-semibold text-slate-900 transition group-hover:text-sky-600">
            {post.title}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/tin-tuc/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          <span>{post.category}</span>
          <span className="text-slate-300">•</span>
          <span>{post.date}</span>
          <span className="text-slate-300">•</span>
          <span>{post.readTime}</span>
        </div>
        <Link href={`/tin-tuc/${post.slug}`} className="mt-3 block text-xl font-semibold leading-tight tracking-tight text-slate-950 transition group-hover:text-sky-600">
          {post.title}
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        <Link href={`/tin-tuc/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-sky-600">
          Đọc bài viết
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
