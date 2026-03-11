import Link from 'next/link';

export function Breadcrumbs({ items = [], invert = false }) {
  const baseText = invert ? 'text-white/70' : 'text-slate-500';
  const dividerText = invert ? 'text-white/30' : 'text-slate-300';
  const currentText = invert ? 'text-white' : 'text-slate-900';
  const hoverText = invert ? 'hover:text-white' : 'hover:text-sky-600';

  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${baseText}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 ? <span className={dividerText}>/</span> : null}
              {isLast ? (
                <span className={`font-medium ${currentText}`}>{item.label}</span>
              ) : (
                <Link href={item.href || '#'} className={`transition ${hoverText}`}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
