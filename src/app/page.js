import Image from 'next/image';

import { CategoryCard } from '@/components/CategoryCard';
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
  heroSlides,
  promoBanners,
  productSections,
} from '@/data/siteData';

export default function Home() {
  const [featuredPost, ...secondaryPosts] = editorialSections.posts;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:gap-10 lg:py-8">
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

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              eyebrow="Mirror-driven refinement"
              title="Homepage được làm dày hơn để gần nhịp thương mại điện tử gốc"
              description="Pass này giảm cảm giác template rỗng bằng header nhiều tiện ích hơn, home có nhịp banner xen kẽ, product rails gắn route thật, card giá rõ và footer nhiều tín hiệu tin cậy hơn."
              actionLabel="Xem danh mục điện thoại"
              actionHref="/danh-muc/dien-thoai"
            />
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              {[
                'Header có utility strip, search và cụm hotline/store/order lookup',
                'Hero có stats chips thay vì copy mô tả chung chung',
                'Category entry rõ ràng hơn trên desktop và mobile',
                'Các block sản phẩm trỏ sang category/PDP thật',
                'Banner xen giữa section để giữ nhịp storefront giống mirror',
                'Footer thêm thông tin cửa hàng và CTA hỗ trợ',
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
            title="Editorial section giữ pattern 1 lớn + danh sách nhỏ giống storefront gốc"
            description="Khối nội dung được siết nhịp hơn: ảnh lớn, typography đậm hơn và các card nhỏ đồng đều để tránh section này trông như blog demo rời rạc."
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
            title="Grid video giữ vai trò lấp nhịp cuối homepage, tránh rơi cảm giác landing quá ngắn"
            description="Mirror gốc có hàng card nội dung hướng dẫn khá rõ. Ở bản rebuild, phần này được giữ lại nhưng siết spacing và hover để nhìn bớt thô."
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
