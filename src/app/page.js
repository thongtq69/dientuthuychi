import Image from 'next/image';
import Link from 'next/link';

import { BlogCard } from '@/components/BlogCard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCarouselSection } from '@/components/ProductCarouselSection';
import {
  categoryRailItems,
  featuredCategories,
  getLatestBlogPosts,
  heroSlides,
  productSections,
  siteMeta,
  socialLinks,
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
    title: 'Hệ thống cửa hàng',
    value: 'Hệ thống cửa hàng',
    href: '#he-thong-cua-hang',
  },
  {
    title: 'Tra cứu đơn hàng',
    value: 'Tra cứu đơn hàng',
    href: '#tra-cuu-don-hang',
  },
  {
    title: 'Giỏ hàng',
    value: 'Sản phẩm 0',
    href: '#',
  },
];

const sidePromos = [
  {
    title: 'Mua lại',
    href: '/danh-muc/dien-thoai',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/2banner_1.jpg?1768028836881',
  },
  {
    title: 'Trade-in lên đời',
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

      <main className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-4 lg:gap-4 lg:px-6 lg:py-4 xl:px-8">
        <section className="grid gap-3 xl:grid-cols-[220px_minmax(0,1fr)_270px]">
          <aside className="hidden overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm xl:block">
            <div className="border-b border-slate-200 bg-[#1b66d2] px-4 py-3 text-sm font-semibold text-white">
              Danh mục sản phẩm
            </div>
            <div className="py-1">
              {categoryRailItems.map((category) => (
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
                className="group relative overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm"
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
              className="rounded-sm border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{card.title}</div>
              <div className="mt-1 text-sm font-semibold text-slate-950 sm:text-[15px]">{card.value}</div>
            </a>
          ))}
        </section>

        <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">Danh mục nổi bật</h2>
            <Link href="/danh-muc/dien-thoai" className="text-sm font-semibold text-[#1b66d2]">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8">
            {featuredCategories.slice(0, 8).map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group rounded-xl border border-slate-200 bg-white p-4 text-center transition hover:shadow-md"
              >
                <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
                  <Image src={category.image} alt={category.title} fill sizes="96px" className="object-contain" />
                </div>
                <h3 className="mt-3 text-[13px] font-medium leading-5 text-slate-800">{category.title}</h3>
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

        <section id="tin-tuc" className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">Tin tức mới nhất</h2>
            <Link href="/tin-tuc" className="text-sm font-semibold text-[#1b66d2]">
              Xem toàn bộ tin tức
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <article className="overflow-hidden rounded-sm border border-slate-200 bg-slate-50 lg:col-span-2">
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

            <div className="grid gap-3 lg:col-span-2 lg:grid-cols-2">
              {secondaryPosts.map((post) => (
                <BlogCard key={post.slug} post={post} compact />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="border-l-4 border-[#1b66d2] pl-3 text-lg font-extrabold uppercase text-slate-950 sm:text-[30px] sm:leading-none">Hướng Dẫn Thủ Thuật</h2>
            <Link href="/tin-tuc" className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#1b66d2] hover:text-[#1b66d2]">
              Xem toàn bộ video →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {secondaryPosts.map((post) => (
              <BlogCard key={`guide-${post.slug}`} post={post} compact />
            ))}
          </div>
        </section>

        <div className="h-12 rounded-sm border border-slate-200 bg-white" />

        <section className="border-t border-black bg-black text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-4 lg:flex-row lg:items-center lg:justify-between lg:px-6 xl:px-8">
            <form className="flex w-full max-w-xl overflow-hidden rounded-sm border border-slate-700 bg-white">
              <input type="email" placeholder="Nhập email nhận tin khuyến mãi" className="h-10 w-full border-0 px-3 text-sm text-slate-800 outline-none" />
              <button type="button" className="bg-[#d70018] px-5 text-sm font-bold text-white">ĐĂNG KÝ</button>
            </form>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium">Kết nối với chúng tôi:</span>
              <div className="flex gap-2">
                {socialLinks.map((item) => (
                  <a key={item.title} href={item.href} className="relative h-8 w-8 overflow-hidden rounded-sm bg-white" title={item.title}>
                    <Image src={item.image} alt={item.title} fill sizes="32px" className="object-contain" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
