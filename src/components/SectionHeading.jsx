import Link from 'next/link';

export function SectionHeading({ eyebrow, title, description, actionLabel = 'Xem thêm', actionHref = '#' }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">{eyebrow}</p> : null}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
        {description ? <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{description}</p> : null}
      </div>
      <Link href={actionHref} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-sky-600">
        {actionLabel}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
