'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { BlogCard } from '@/components/BlogCard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCarouselSection } from '@/components/ProductCarouselSection';
import {
  categoryRailItems,
  editorialSections,
  featuredCategories,
  getLatestBlogPosts,
  heroSlides,
  midPageBanners,
  productSections,
  siteMeta,
  socialLinks,
  storeBenefits,
} from '@/data/siteData';

const sidePromos = [
  {
    title: 'Mua lại',
    href: '/mua-lai',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/2banner_1.jpg?1768028836881',
  },
  {
    title: 'Trade-in lên đời',
    href: '/cam-ket-chat-luong',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/2banner_2.jpg?1768028836881',
  },
];

export default function Home() {
  const posts = getLatestBlogPosts();
  const [featuredPost, ...secondaryPosts] = posts;
  const guideVideos = editorialSections.videos || [];

  return (
    <div className="min-h-screen bg-[#f3f5f7] text-slate-900">
      <Header />

      <main className="mx-auto max-w-[1270px] px-3 py-3 sm:px-4 lg:py-4">
        {/* ============= HERO SECTION ============= */}
        <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Center slider */}
          <HeroCarousel slides={heroSlides} />

          {/* Right side promos */}
          <div className="hidden gap-3 lg:flex lg:flex-col">
            {sidePromos.map((promo) => (
              <a
                key={promo.title}
                href={promo.href}
                className="group relative flex-1 block overflow-hidden rounded border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative h-full min-h-[200px]">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    sizes="280px"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Mobile-only side promos */}
        <div className="mt-3 grid grid-cols-2 gap-3 lg:hidden">
          {sidePromos.map((promo) => (
            <a
              key={promo.title}
              href={promo.href}
              className="group relative block overflow-hidden rounded border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  sizes="50vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </a>
          ))}
        </div>

        {/* ============= FEATURED CATEGORIES ============= */}
        <section className="mt-3 rounded border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="border-l-4 border-[#1b66d2] pl-3 text-[18px] font-black uppercase text-slate-900">Danh mục nổi bật</h2>
            <Link href="/danh-muc/dien-thoai" className="text-[12px] font-bold uppercase text-[#1b66d2] hover:underline">
              Xem tất cả →
            </Link>
          </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 3000 }}
            spaceBetween={16}
            slidesPerView={3}
            breakpoints={{
              640: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 8 },
            }}
          >
            {featuredCategories.map((cat) => (
              <SwiperSlide key={cat.title}>
                <Link href={cat.href} className="group flex flex-col items-center">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-slate-100 bg-white transition group-hover:border-[#1b66d2] group-hover:shadow-md">
                    <Image src={cat.image} alt={cat.title} fill sizes="80px" className="object-contain p-2 transition duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="mt-2 text-center text-[11px] font-bold leading-tight text-slate-700 transition group-hover:text-[#1b66d2]">
                    {cat.title}
                  </h3>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* ============= PRODUCT SECTIONS ============= */}
        {productSections.map((section, index) => (
          <div key={section.id} className="mt-3 space-y-3">
            {index === 1 && midPageBanners[0] && (
              <a href={midPageBanners[0].href} className="group relative block overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-[1170/210]">
                  <Image
                    src={midPageBanners[0].image}
                    alt={midPageBanners[0].title}
                    fill
                    sizes="100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.01]"
                  />
                </div>
              </a>
            )}
            <ProductCarouselSection section={section} />
          </div>
        ))}

        {/* ============= STORE BENEFITS ============= */}
        <section className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {storeBenefits.map((benefit) => (
            <div key={benefit} className="rounded border border-slate-200 bg-white px-4 py-3 text-[13px] font-bold text-slate-700 shadow-sm">
              ✅ {benefit}
            </div>
          ))}
        </section>

        {/* ============= NEWS SECTION ============= */}
        <section id="tin-tuc" className="mt-3 rounded border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="border-l-4 border-[#1b66d2] pl-3 text-[18px] font-black uppercase text-slate-900">Tin tức mới nhất</h2>
            <Link href="/tin-tuc" className="text-[12px] font-bold uppercase text-[#1b66d2] hover:underline">
              Xem toàn bộ →
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <article className="overflow-hidden rounded border border-slate-200 bg-slate-50 lg:col-span-2">
              <Link href={`/tin-tuc/${featuredPost.slug}`} className="relative block aspect-[16/9]">
                <Image src={featuredPost.image} alt={featuredPost.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </Link>
              <div className="space-y-2 p-4">
                <div className="text-[10px] font-bold uppercase text-[#1b66d2]">{featuredPost.date}</div>
                <Link href={`/tin-tuc/${featuredPost.slug}`} className="block text-[16px] font-black leading-snug text-slate-950 transition hover:text-[#1b66d2]">
                  {featuredPost.title}
                </Link>
                <p className="text-[13px] leading-6 text-slate-600">{featuredPost.excerpt}</p>
              </div>
            </article>

            <div className="grid gap-3 lg:col-span-2 lg:grid-cols-2">
              {secondaryPosts.map((post) => (
                <BlogCard key={post.slug} post={post} compact />
              ))}
            </div>
          </div>
        </section>

        {/* ============= GUIDE VIDEOS ============= */}
        {guideVideos.length > 0 && (
          <section className="mt-3 rounded border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="border-l-4 border-[#1b66d2] pl-3 text-[18px] font-black uppercase text-slate-900">Hướng Dẫn Thủ Thuật</h2>
              <Link href="/tin-tuc" className="rounded border border-slate-300 px-3 py-1.5 text-[12px] font-bold text-slate-600 transition hover:border-[#1b66d2] hover:text-[#1b66d2]">
                Xem toàn bộ video →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {guideVideos.map((video) => (
                <article key={video.title} className="group">
                  <div className="relative aspect-[16/10] overflow-hidden rounded border border-slate-200 bg-slate-100">
                    <Image src={video.image} alt={video.title} fill sizes="240px" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="mt-2 line-clamp-2 text-[13px] font-bold leading-5 text-slate-900">{video.title}</div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ============= NEWSLETTER + SOCIAL ============= */}
        <section className="mt-3 overflow-hidden rounded bg-black text-white">
          <div className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <form className="flex w-full max-w-xl overflow-hidden rounded bg-white">
              <input type="email" placeholder="Nhập email nhận tin khuyến mãi" className="h-10 w-full border-0 px-3 text-sm text-slate-800 outline-none" />
              <button type="button" className="shrink-0 bg-[#d70018] px-5 text-[13px] font-black text-white">ĐĂNG KÝ</button>
            </form>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold">Kết nối với chúng tôi:</span>
              <div className="flex gap-2">
                {socialLinks.map((item) => (
                  item.href && item.href !== '#' ? (
                    <a key={item.title} href={item.href} className="relative h-8 w-8 overflow-hidden rounded bg-white" title={item.title}>
                      <Image src={item.image} alt={item.title} fill sizes="32px" className="object-contain" />
                    </a>
                  ) : (
                    <div key={item.title} className="relative h-8 w-8 overflow-hidden rounded bg-white" title={item.title}>
                      <Image src={item.image} alt={item.title} fill sizes="32px" className="object-contain" />
                    </div>
                  )
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
