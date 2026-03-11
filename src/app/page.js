import Image from 'next/image';

import { CategoryCard } from '@/components/CategoryCard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCarouselSection } from '@/components/ProductCarouselSection';
import { SectionHeading } from '@/components/SectionHeading';
import {
  editorialSections,
  featuredCategories,
  heroSlides,
  productSections,
} from '@/data/siteData';

export default function Home() {
  const [featuredPost, ...secondaryPosts] = editorialSections.posts;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <HeroCarousel slides={heroSlides} />

        <section id="foundation" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              eyebrow="Detected patterns"
              title="Responsive storefront foundation"
              description="Mirror cho thấy homepage chia thành: mega header, slider danh mục, banner ngang, nhiều khối product carousel, blog/video grid và footer giàu CTA."
              actionLabel="Blueprint chi tiết"
            />
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              {[
                'Header desktop + mobile menu toggle',
                'Hero/marketing banners xen giữa product blocks',
                'Swiper-heavy product rails với breakpoints 1–5 cột',
                'Khối blog lớn + danh sách bài nhỏ',
                'Footer nhiều cột + chính sách + hotline',
                'Sẵn sàng thay seed data bằng CMS hoặc API',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3">{item}</div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {heroSlides.slice(0, 2).map((slide) => (
              <div key={slide.title} className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
                <div className="absolute inset-0 opacity-30">
                  <Image src={slide.image} alt={slide.title} fill sizes="50vw" className="object-cover" />
                </div>
                <div className="relative z-10 max-w-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Promo block</p>
                  <h3 className="mt-3 text-2xl font-semibold">{slide.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {productSections.map((section) => (
          <ProductCarouselSection key={section.id} section={section} />
        ))}

        <section id="tin-tuc" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <SectionHeading
            eyebrow="Tin tức mới nhất"
            title="Editorial section tách biệt để giữ SEO và khả năng cập nhật nội dung"
            description="Homepage gốc dùng một bài nổi bật lớn ở trái và danh sách bài nhỏ ở phải. Bản rebuild tái hiện pattern đó bằng grid linh hoạt trên mobile và desktop."
            actionLabel="Xem toàn bộ tin tức"
          />

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
              <div className="relative aspect-[16/10]">
                <Image src={featuredPost.image} alt={featuredPost.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
              <div className="space-y-3 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{featuredPost.date}</div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{featuredPost.title}</h3>
                <p className="text-sm leading-6 text-slate-600">{featuredPost.excerpt}</p>
              </div>
            </article>

            <div className="grid gap-4">
              {secondaryPosts.map((post) => (
                <article key={post.title} className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[140px_1fr] sm:items-center">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[4/3]">
                    <Image src={post.image} alt={post.title} fill sizes="140px" className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">{post.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <SectionHeading
            eyebrow="Hướng dẫn & video"
            title="Card grid cho nội dung thủ thuật / video"
            description="Mirror có một hàng card ngang cho chuyên mục hướng dẫn. Bản nền tảng này chuyển thành responsive grid 1–4 cột."
            actionLabel="Xem toàn bộ video"
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {editorialSections.videos.map((video) => (
              <article key={video.title} className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={video.image} alt={video.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg">▶</div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-slate-900">{video.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
