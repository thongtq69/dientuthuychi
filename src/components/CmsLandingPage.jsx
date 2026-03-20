import Image from 'next/image';
import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { PromoBanner } from '@/components/PromoBanner';
import { RichTextRenderer } from '@/components/RichTextRenderer';

function HtmlBlock({ html }) {
  if (!html) return null;

  return <div className="space-y-4 text-base leading-8 text-slate-700" dangerouslySetInnerHTML={{ __html: html }} />;
}

function ParagraphBlock({ paragraphs }) {
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) return null;

  return (
    <div className="space-y-4 text-base leading-8 text-slate-700">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

export function CmsLandingPage({ page }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:gap-8 lg:py-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{page.hero?.eyebrow || 'Noi dung tu CMS'}</div>
              <h1 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">{page.hero?.title || page.title}</h1>
              {page.hero?.description ? <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{page.hero.description}</p> : null}
              <div className="mt-8 flex flex-wrap gap-3">
                {page.hero?.primaryLabel && page.hero?.primaryHref ? (
                  <Link href={page.hero.primaryHref} className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
                    {page.hero.primaryLabel}
                  </Link>
                ) : null}
                {page.hero?.secondaryLabel && page.hero?.secondaryHref ? (
                  <Link href={page.hero.secondaryHref} className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-sky-200 hover:text-sky-700">
                    {page.hero.secondaryLabel}
                  </Link>
                ) : null}
              </div>
            </div>

            {page.hero?.image ? (
              <div className="relative min-h-[280px] bg-slate-100">
                <Image src={page.hero.image} alt={page.hero.title || page.title} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
              </div>
            ) : null}
          </div>
        </section>

        {(page.blocks || []).map((block) => {
          if (block.blockType === 'banner' && block.banner) {
            return <PromoBanner key={block.id} banner={block.banner} />;
          }

          return (
            <section key={block.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {block.title ? <h2 className="text-2xl font-semibold tracking-normal text-slate-950">{block.title}</h2> : null}
              <div className={block.title ? 'mt-5' : ''}>
                {block.content ? <RichTextRenderer content={block.content} /> : null}
                {!block.content && block.html ? <HtmlBlock html={block.html} /> : null}
                {!block.content && !block.html ? <ParagraphBlock paragraphs={block.paragraphs} /> : null}
                {block.image ? (
                  <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-[1.5rem] bg-slate-100">
                    <Image src={block.image} alt={block.title || page.title} fill sizes="100vw" className="object-cover" />
                  </div>
                ) : null}
                {block.ctaLabel && block.ctaHref ? (
                  <Link href={block.ctaHref} className="mt-6 inline-flex items-center text-sm font-semibold text-sky-700 hover:underline">
                    {block.ctaLabel} →
                  </Link>
                ) : null}
              </div>
            </section>
          );
        })}

        {page.supportNote ? (
          <section className="rounded-[1.75rem] bg-slate-950 px-6 py-5 text-sm font-medium text-white shadow-sm">{page.supportNote}</section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
