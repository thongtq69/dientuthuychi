'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { ProductCard } from '@/components/ProductCard';
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
  products,
  siteMeta,
  socialLinks,
  storeBenefits,
} from '@/data/siteData';

const sidePromos = [
  {
    title: 'iPhone 17 Pre-order',
    href: '/danh-muc/dien-thoai',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1771985295667-390x490_Top-collection-banner-ip17-PM.jpg',
  },
  {
    title: 'Máy Cũ Giá Rẻ',
    href: '/danh-muc/hang-cu',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1772792984416-top-colection-may-cu-1.jpg',
  },
];

export default function Home() {
  const posts = getLatestBlogPosts();
  const [featuredPost, ...secondaryPosts] = posts;
  const guideVideos = editorialSections.videos || [];

  return (
    <div className="min-h-screen bg-[#f3f5f7] text-slate-900">
      {/* Sky Banners - Exact Gia Kho Banners */}
      <div className="fixed left-0 top-[150px] hidden 2xl:block z-10 w-[160px] px-2 transition-all">
         <div className="relative aspect-[1/4] w-full">
            <Image 
              src="https://cdn.dienthoaigiakho.vn/photos/1773105631169-roll-banner-tuan-le-vangjpg.jpg" 
              alt="Sky Left" 
              fill 
              className="object-contain"
            />
         </div>
      </div>
      <div className="fixed right-0 top-[150px] hidden 2xl:block z-10 w-[160px] px-2 transition-all">
         <div className="relative aspect-[1/5] w-full">
            <Image 
              src="https://cdn.dienthoaigiakho.vn/photos/1773022062519-s26-pre-roll-1.jpg" 
              alt="Sky Right" 
              fill 
              className="object-contain"
            />
         </div>
      </div>

      <Header />

      <main className="mx-auto max-w-[1270px] px-3 py-3 sm:px-4 lg:py-4">
        
        {/* ============= HERO SECTION ============= */}
        <section className="grid gap-3 lg:grid-cols-[250px_minmax(0,1fr)_182px] xl:grid-cols-[250px_minmax(0,1fr)_182px]">
          
          {/* Left Category Sidebar */}
          <div className="hidden lg:block bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="flex flex-col">
                {categoryRailItems.map((cat) => (
                  <Link
                    key={cat.title}
                    href={cat.href}
                    className="group flex items-center gap-3 border-b border-slate-50 last:border-0 px-4 py-[10px] text-[13.5px] font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    {cat.icon && (
                      <div className="relative h-6 w-6 shrink-0">
                        <Image src={cat.icon} alt={cat.title} fill className="object-contain" />
                      </div>
                    )}
                    <span className="truncate group-hover:text-[#d70018]">{cat.title}</span>
                    {cat.title === 'Thu Cũ Đổi Mới' && (
                       <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white animate-pulse">HOT</span>
                    )}
                  </Link>
                ))}
            </div>
          </div>

          {/* Center slider */}
          <div className="relative z-0 w-full min-w-0">
             <HeroCarousel slides={heroSlides} />
           </div>

           {/* Right side promo (Standard Vertical S26 Promo) */}
           <div className="relative hidden lg:block">
             <Link href="/danh-muc/dien-thoai" className="group block overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="relative w-full" style={{ aspectRatio: '182 / 476' }}>
                <Image
                  src="https://cdn.dienthoaigiakho.vn/photos/1773022062519-s26-pre-roll-1.jpg"
                  alt="Side Promo"
                  fill
                  sizes="182px"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                </div>
             </Link>
           </div>
        </section>

        {/* ============= CATEGORY ICON BAR ============= */}
        <section className="mt-5 rounded-xl border border-slate-50 bg-white p-4 shadow-sm">
           <div className="grid grid-cols-5 gap-y-6 gap-x-2 sm:grid-cols-10">
              {categoryRailItems.map((item) => (
                 <Link key={item.title} href={item.href} className="group flex flex-col items-center gap-2">
                    <div className="relative h-[60px] w-[60px] overflow-hidden rounded-full bg-slate-50 transition group-hover:shadow-md">
                       <Image src={item.icon || ''} alt={item.title} fill className="object-contain p-3 transition duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-center text-[12px] font-bold text-slate-800 leading-tight line-clamp-2 h-7 flex items-center">{item.title}</span>
                 </Link>
              ))}
           </div>
        </section>

        {/* ============= TOP COLLECTIONS ============= */}
        <section className="mt-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[22px] font-black tracking-tight text-[#05030c] uppercase">Top Collection</h2>
            <Link href="/danh-muc/dien-thoai" className="text-[14px] font-bold text-slate-400 hover:text-[#d70018] flex items-center gap-1 transition-colors">
              Xem tất cả <span className="text-[18px]">›</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 xl:gap-4">
            {featuredCategories.map((cat) => (
              <Link key={cat.title} href={cat.href} className="group block overflow-hidden rounded-lg">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
                    <p className="text-[14px] font-bold text-white line-clamp-1">{cat.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        
        {/* ============= IPHONE PRODUCTS ============= */}
        <section className="mt-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[22px] font-black tracking-tight text-[#05030c] uppercase">Điện Thoại Giá Kho</h2>
            <Link href="/danh-muc/dien-thoai" className="text-[14px] font-bold text-slate-400 hover:text-[#d70018] flex items-center gap-1 transition-colors">
              Xem tất cả <span className="text-[18px]">›</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-5">
            {products.slice(0, 10).map((product, idx) => (
               <ProductCard key={`${product.id}-${idx}`} product={product} /> 
            ))}
          </div>
        </section>

        {/* ============= TABLET ============= */}
        <section className="mt-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[22px] font-black tracking-tight text-[#05030c] uppercase">Máy Tính Bảng / iPad</h2>
            <Link href="/danh-muc/tablet" className="text-[14px] font-bold text-slate-400 hover:text-[#d70018] flex items-center gap-1 transition-colors">
              Xem tất cả <span className="text-[18px]">›</span>
            </Link>
          </div>

          {/* 2 Mid-page Horizontal Banners */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link href="/danh-muc/tablet" className="group block overflow-hidden rounded-xl border border-slate-50 shadow-sm">
                <div className="relative aspect-[595/214] w-full">
                    <Image
                        src="https://cdn.dienthoaigiakho.vn/photos/1770690260094-Android-Adapt-xiaomi-reedmi-pad-2-pro-1.jpg"
                        alt="Left Mid Banner"
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                </div>
            </Link>
            <Link href="/danh-muc/tablet" className="group block overflow-hidden rounded-xl border border-slate-50 shadow-sm">
                <div className="relative aspect-[595/214] w-full">
                    <Image
                        src="https://cdn.dienthoaigiakho.vn/photos/1770626742764-595x214_Section-Banner-Macbook.jpg"
                        alt="Right Mid Banner"
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-5">
            {products.filter(p => (p.category || '').toLowerCase().includes('tablet')).slice(0, 10).map((product, idx) => (
               <ProductCard key={`${product.id}-${idx}`} product={product} /> 
            ))}
          </div>
        </section>

        {/* ============= PHỤ KIỆN ============= */}
        <section className="mt-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[22px] font-black tracking-tight text-[#05030c] uppercase">Phụ Kiện Công Nghệ</h2>
            <Link href="/danh-muc/phu-kien" className="text-[14px] font-bold text-slate-400 hover:text-[#d70018] flex items-center gap-1 transition-colors">
              Xem tất cả <span className="text-[18px]">›</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-5">
            {products.filter(p => (p.category || '').toLowerCase().includes('phụ kiện')).slice(0, 10).map((product, idx) => (
               <ProductCard key={`${product.id}-${idx}`} product={product} /> 
            ))}
          </div>
        </section>

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
