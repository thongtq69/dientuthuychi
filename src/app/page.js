import Image from 'next/image';
import Link from 'next/link';

import { BlogCard } from '@/components/BlogCard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCarouselSection } from '@/components/ProductCarouselSection';
import {
  featuredCategories,
  getLatestBlogPosts,
  heroSlides,
  productSections,
  siteMeta,
  storeBenefits,
  trustBadges,
} from '@/data/siteData';

const quickLinks = [
  { label: 'Thu cũ - Đổi mới', href: '/danh-muc/dien-thoai' },
  { label: 'Chính sách bảo hành', href: '/tin-tuc' },
  { label: 'Tra cứu đơn hàng', href: '#tra-cuu-don-hang' },
  { label: 'Hệ thống cửa hàng', href: '#he-thong-cua-hang' },
];

const sidePromos = [
  {
    title: 'Thu cũ - lên đời iPhone nhanh',
    href: '/danh-muc/dien-thoai',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/2banner_1.jpg?1768028836881',
  },
  {
    title: 'Bảo hành rõ ràng - hỗ trợ tận tâm',
    href: '/tin-tuc',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/2banner_2.jpg?1768028836881',
  },
];

const serviceCards = [
  {
    title: 'Tư vấn mua hàng',
    value: siteMeta.hotline,
    href: `tel:${siteMeta.hotline}`,
    description: 'Hỗ trợ chọn máy, báo giá nhanh và chốt đơn mỗi ngày.',
  },
  {
    title: 'Tra cứu đơn hàng',
    value: 'Kiểm tra nhanh',
    href: '#tra-cuu-don-hang',
    description: 'Theo dõi đơn và tình trạng xử lý thuận tiện hơn.',
  },
  {
    title: 'Tìm chi nhánh',
    value: 'Hệ thống Hoàng Kiên',
    href: '#he-thong-cua-hang',
    description: 'Xem điểm bán, tiếp nhận bảo hành và hỗ trợ kỹ thuật.',
  },
];

export default function Home() {
  const posts = getLatestBlogPosts();
  const [featuredPost, ...secondaryPosts] = posts;

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <Header />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:gap-8 lg:py-6">
        <section className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
          <aside className="hidden overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm xl:block">
            <div className="bg-slate-950 px-5 py-4 text-white">
              <div className="text-sm font-semibold">Danh mục</div>
            </div>
            <div className="p-2">
              {featuredCategories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  <span>{category.title}</span>
                  <span className="text-slate-300">›</span>
                </Link>
              ))}
            </div>
          </aside>

          <HeroCarousel slides={heroSlides} />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            {sidePromos.map((promo) => (
              <a
                key={promo.title}
                href={promo.href}
                className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/9] md:aspect-[7/3] xl:aspect-[5/3]">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    sizes="(max-width: 1279px) 50vw, 320px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white hover:text-slate-950"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Danh mục nổi bật</h2>
            <Link href="/danh-muc/dien-thoai" className="text-sm font-semibold text-sky-700">
              Xem tất cả
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featuredCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                <div className="relative mx-auto h-28 w-28">
                  <Image src={category.image} alt={category.title} fill sizes="112px" className="object-contain" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-950">{category.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {sidePromos.map((promo) => (
            <a
              key={`bottom-${promo.title}`}
              href={promo.href}
              className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[21/8]">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </a>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {serviceCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.title}</div>
              <div className="mt-2 text-xl font-semibold text-slate-950">{card.value}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
            </a>
          ))}
        </section>

        {productSections.map((section) => (
          <ProductCarouselSection key={section.id} section={section} />
        ))}

        <section className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
          {storeBenefits.map((benefit) => (
            <div key={benefit} className="rounded-[1.25rem] bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
              {benefit}
            </div>
          ))}
        </section>

        <section id="tin-tuc" className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Tin tức mới nhất</h2>
            <Link href="/tin-tuc" className="text-sm font-semibold text-sky-700">
              Xem toàn bộ tin tức
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
              <Link href={`/tin-tuc/${featuredPost.slug}`} className="relative block aspect-[16/10]">
                <Image src={featuredPost.image} alt={featuredPost.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </Link>
              <div className="space-y-3 p-5">
                <div className="text-sm text-slate-500">
                  Ngày đăng: <span className="font-medium text-slate-700">{featuredPost.date}</span>
                </div>
                <Link href={`/tin-tuc/${featuredPost.slug}`} className="block text-xl font-semibold leading-tight text-slate-950 transition hover:text-sky-700 sm:text-2xl">
                  {featuredPost.title}
                </Link>
                <p className="text-sm leading-6 text-slate-600">{featuredPost.excerpt}</p>
              </div>
            </article>

            <div className="grid gap-4">
              {secondaryPosts.map((post) => (
                <BlogCard key={post.slug} post={post} compact />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Hướng dẫn thủ thuật</h2>
            <Link href="/tin-tuc" className="text-sm font-semibold text-sky-700">
              Xem thêm
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {trustBadges.map((item) => (
              <div key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
                <div className="text-base font-semibold text-slate-950">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
