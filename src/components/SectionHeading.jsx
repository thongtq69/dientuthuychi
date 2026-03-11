import Link from 'next/link';

export function SectionHeading({ eyebrow, title, description, actionLabel = 'Xem thêm', actionHref = '#' }) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1b66d2]">{eyebrow}</p> : null}
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <Link href={actionHref} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-[#1b66d2]">
        {actionLabel}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
