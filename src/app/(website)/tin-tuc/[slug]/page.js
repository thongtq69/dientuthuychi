import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BlogCard } from '@/components/BlogCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { getBlogPostBySlug, getLatestBlogPosts } from '@/data/siteData';

export function generateStaticParams() {
  return getLatestBlogPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = getLatestBlogPosts().filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:gap-8 lg:py-8">
        <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-[16/7] min-h-[280px] bg-slate-100">
            <Image src={post.image} alt={post.title} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
              <Breadcrumbs
                invert
                items={[
                  { label: 'Trang chủ', href: '/' },
                  { label: 'Tin tức', href: '/tin-tuc' },
                  { label: post.title },
                ]}
              />
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                <span>{post.category}</span>
                <span className="text-white/35">•</span>
                <span>{post.date}</span>
                <span className="text-white/35">•</span>
                <span>{post.readTime}</span>
              </div>
              <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{post.title}</h1>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10">
            <div className="max-w-3xl">
              <p className="text-lg leading-8 text-slate-700">{post.intro}</p>

              <div className="mt-8 space-y-8">
                {post.sections.map((section) => (
                  <section key={section.heading} className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{section.heading}</h2>
                    <div className="space-y-4 text-base leading-8 text-slate-700">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <aside className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 h-fit lg:sticky lg:top-28">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Chuyên mục</div>
                <div className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Tin tức Điện tử Thuỷ Chi</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">Sidebar này giúp article page bớt trống trên desktop, gần hơn với cảm giác đọc nội dung trong một storefront thật.</p>
              </div>
              <div className="grid gap-3 text-sm text-slate-700">
                <Link href="/tin-tuc" className="rounded-2xl bg-white px-4 py-3 font-semibold">Xem tất cả bài viết</Link>
                <Link href="/danh-muc/dien-thoai" className="rounded-2xl bg-white px-4 py-3 font-semibold">Xem điện thoại nổi bật</Link>
                <Link href="/danh-muc/phu-kien" className="rounded-2xl bg-white px-4 py-3 font-semibold">Xem phụ kiện bán chạy</Link>
              </div>
            </aside>
          </div>
        </article>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Đọc tiếp</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Bài viết liên quan</h2>
            </div>
            <Link href="/tin-tuc" className="text-sm font-semibold text-slate-900">Xem tất cả →</Link>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {relatedPosts.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
