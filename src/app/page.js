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

const supportCards = [
  {
    title: 'Hotline',
    value: siteMeta.hotline,
    href: `tel:${siteMeta.hotline}`,
  },
  {
    title: 'Tra cứu đơn hàng',
    value: 'Kiểm tra đơn hàng',
    href: '#tra-cuu-don-hang',
  },
  {
    title: 'Hệ thống cửa hàng',
    value: 'Xem thông tin cửa hàng',
    href: '#he-thong-cua-hang',
  },
  {
    title: 'Thu cũ đổi mới',
    value: 'Lên đời iPhone, iPad',
    href: '/danh-muc/dien-thoai',
  },
];

const sidePromos = [
  {
    title: 'Thu cũ - đổi mới',
    href: '/danh-muc/dien-thoai',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/2banner_1.jpg?1768028836881',
  },
  {
    title: 'Phụ kiện - linh kiện',
    href: '/danh-muc/phu-kien',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/2banner_2.jpg?1768028836881',
  },
];

export default function Home() {
  const posts = getLatestBlogPosts();
  const [featuredPost, ...secondaryPosts] = posts;

  return (
    <div className="min-h-screen bg-[#f3f5f7] text-slate-900">
      <Header />

      <main className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-4 sm:px-4 lg:gap-5 lg:px-6 lg:py-5 xl:px-8">
        <section className="grid gap-3 xl:grid-cols-[238px_minmax(0,1fr)_286px]">
          <aside className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:block">
            <div className="border-b border-slate-200 bg-[#1b66d2] px-4 py-3 text-sm font-semibold text-white">
              Danh mục sản phẩm
            </div>
            <div className="py-1">
              {featuredCategories.slice(0, 10).map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  <span>{category.title}</span>
                  <span className="text-slate-300">›</span>
                </Link>
              ))}
            </div>
          </aside>

          <HeroCarousel slides={heroSlides} />

          <div className="grid gap-3">
            {sidePromos.map((promo) => (
              <a
                key={promo.title}
                href={promo.href}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/8] xl:aspect-[286/180]">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    sizes="(max-width: 1279px) 100vw, 286px"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {supportCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-slate-300"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{card.title}</div>
              <div className="mt-2 text-sm font-semibold text-slate-950 sm:text-base">{card.value}</div>
            </a>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">Danh mục nổi bật</h2>
            <Link href="/danh-muc/dien-thoai" className="text-sm font-semibold text-[#1b66d2]">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10">
            {featuredCategories.slice(0, 10).map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group rounded-2xl border border-slate-200 bg-white p-3 text-center transition hover:shadow-md"
              >
                <div className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20">
                  <Image src={category.image} alt={category.title} fill sizes="80px" className="object-contain" />
                </div>
                <h3 className="mt-2 text-xs font-medium leading-5 text-slate-800">{category.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        {productSections.map((section) => (
          <ProductCarouselSection key={section.id} section={section} />
        ))}

        <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
          {storeBenefits.map((benefit) => (
            <div key={benefit} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              {benefit}
            </div>
          ))}
        </section>

        <section id="tin-tuc" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">Tin tức mới nhất</h2>
            <Link href="/tin-tuc" className="text-sm font-semibold text-[#1b66d2]">
              Xem toàn bộ tin tức
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <Link href={`/tin-tuc/${featuredPost.slug}`} className="relative block aspect-[16/9]">
                <Image src={featuredPost.image} alt={featuredPost.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </Link>
              <div className="space-y-2 p-4">
                <div className="text-sm text-slate-500">
                  Ngày đăng: <span className="font-medium text-slate-700">{featuredPost.date}</span>
                </div>
                <Link href={`/tin-tuc/${featuredPost.slug}`} className="block text-lg font-semibold leading-tight text-slate-950 transition hover:text-[#1b66d2] sm:text-xl">
                  {featuredPost.title}
                </Link>
                <p className="text-sm leading-6 text-slate-600">{featuredPost.excerpt}</p>
              </div>
            </article>

            <div className="grid gap-3">
              {secondaryPosts.map((post) => (
                <BlogCard key={post.slug} post={post} compact />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">Hỗ trợ khách hàng</h2>
            <Link href="/tin-tuc" className="text-sm font-semibold text-[#1b66d2]">
              Xem thêm
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {trustBadges.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
