import { BlogCard } from '@/components/BlogCard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SectionHeading } from '@/components/SectionHeading';
import { getLatestBlogPosts } from '@/data/siteData';

export const metadata = {
  title: 'Tin tức | Điện tử Thuỷ Chi',
  description: 'Trang danh sách tin tức và tư vấn công nghệ theo phong cách storefront của Điện tử Thuỷ Chi.',
};

export default function BlogListingPage() {
  const posts = getLatestBlogPosts();
  const [featuredPost, ...otherPosts] = posts;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:gap-8 lg:py-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <SectionHeading
            eyebrow="Tin tức & tư vấn"
            title="Blog listing foundation để homepage không còn là ngõ cụt"
            description="Trang danh sách này bám logic editorial của storefront: 1 bài nổi bật, lưới bài còn lại rõ ràng, metadata ngắn gọn và cảm giác gần một chuyên mục thật hơn là blog demo."
            actionLabel="Về trang chủ"
            actionHref="/"
          />

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <BlogCard post={featuredPost} />
            <div className="grid gap-4">
              {otherPosts.map((post) => (
                <BlogCard key={post.slug} post={post} compact />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
