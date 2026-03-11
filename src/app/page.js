import Image from 'next/image';
import Link from 'next/link';

import { BlogCard } from '@/components/BlogCard';
import { CategoryCard } from '@/components/CategoryCard';
import { CommerceShell } from '@/components/CommerceShell';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { HomeFeatureStrip } from '@/components/HomeFeatureStrip';
import { ProductCarouselSection } from '@/components/ProductCarouselSection';
import { PromoBanner } from '@/components/PromoBanner';
import { SectionHeading } from '@/components/SectionHeading';
import {
  editorialSections,
  featuredCategories,
  getLatestBlogPosts,
  heroSlides,
  promoBanners,
  productSections,
} from '@/data/siteData';

export default function Home() {
  const posts = getLatestBlogPosts();
  const [featuredPost, ...secondaryPosts] = posts;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:gap-10 lg:py-8">
        <CommerceShell />

        <section className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm xl:block">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">Danh mục nổi bật</div>
            <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Lối vào nhanh</div>
            <div className="mt-5 space-y-3">
              {featuredCategories.map((category) => (
                <CategoryCard key={category.title} category={category} />
              ))}
            </div>
          </aside>

          <HeroCarousel slides={heroSlides} />
        </section>

        <HomeFeatureStrip />

        <section id="foundation" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:hidden">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading
              eyebrow="Commerce direction"
              title="Homepage được kéo gần hơn nhịp storefront thật thay vì một landing demo đẹp vừa vừa"
              description="Pass này giảm bớt text tự sự về rebuild và thay bằng những tín hiệu mua sắm dễ hiểu hơn: shell thương mại ở đầu trang, nhịp category rõ, section sản phẩm chắc tay hơn và khối editorial có lối ra thật."
              actionLabel="Xem danh mục điện thoại"
              actionHref="/danh-muc/dien-thoai"
            />
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              {[
                'Header có utility strip đầy đủ hơn và menu dropdown dày hơn',
                'Thêm commerce shell dưới header để đỡ hụt nhịp đầu trang',
                'Homepage bớt cảm giác ghi chú nội bộ, nhiều CTA thật hơn',
                'Khối tin tức dẫn vào listing và article page riêng',
                'Footer rõ tín hiệu hotline, hậu mãi và lối vào nội dung',
                'Responsive được làm chắc hơn ở mobile menu và section density',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {promoBanners.map((banner) => (
              <PromoBanner key={banner.title} banner={banner} />
            ))}
          </div>
        </section>

        {productSections.map((section, index) => (
          <div key={section.id} className="space-y-8">
            <ProductCarouselSection section={section} />
            {promoBanners[index % promoBanners.length] ? <PromoBanner banner={promoBanners[index % promoBanners.length]} /> : null}
          </div>
        ))}

        <section id="tin-tuc" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <SectionHeading
            eyebrow="Tin tức mới nhất"
            title="Editorial section giờ có chuyên mục thật, card rõ hơn và ít cảm giác blog demo hơn"
            description="Homepage vẫn giữ pattern 1 bài lớn + danh sách nhỏ, nhưng tất cả đã trỏ vào listing/article page để mạch nội dung liền hơn với phần còn lại của storefront."
            actionLabel="Xem toàn bộ tin tức"
            actionHref="/tin-tuc"
          />

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
              <Link href={`/tin-tuc/${featuredPost.slug}`} className="relative block aspect-[16/10]">
                <Image src={featuredPost.image} alt={featuredPost.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </Link>
              <div className="space-y-3 p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                  <span>{featuredPost.date}</span>
                  <span className="text-slate-300">•</span>
                  <span>Tin công nghệ</span>
                </div>
                <Link href={`/tin-tuc/${featuredPost.slug}`} className="block text-2xl font-semibold tracking-tight text-slate-950 transition hover:text-sky-600">
                  {featuredPost.title}
                </Link>
                <p className="text-sm leading-6 text-slate-600">{featuredPost.excerpt}</p>
                <Link href={`/tin-tuc/${featuredPost.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-sky-600">
                  Đọc bài viết
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            <div className="grid gap-4">
              {secondaryPosts.map((post) => (
                <BlogCard key={post.slug} post={post} compact />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <SectionHeading
            eyebrow="Hướng dẫn & video"
            title="Grid video giữ vai trò lấp nhịp cuối homepage, nhưng đã được siết lại để bớt thô"
            description="Khối này vẫn cần nguồn dữ liệu live tốt hơn, nhưng spacing, hierarchy và hover đã ổn hơn nhiều so với kiểu card demo rời rạc."
            actionLabel="Xem toàn bộ video"
            actionHref="/tin-tuc"
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
