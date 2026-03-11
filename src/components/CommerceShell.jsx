import Link from 'next/link';
import { featuredCategories, siteMeta } from '@/data/siteData';

export function CommerceShell() {
  return (
    <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-950 px-5 py-4 text-white">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Danh mục sản phẩm</div>
          <div className="mt-2 text-lg font-semibold">Khung storefront</div>
        </div>
        <div className="space-y-1 p-3">
          {featuredCategories.map((category, index) => (
            <Link
              key={category.title}
              href={category.href}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <span>{category.title}</span>
              <span className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-semibold ${index === 0 ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>
                {index + 1}
              </span>
            </Link>
          ))}
        </div>
      </aside>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Hotline bán hàng</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{siteMeta.hotline}</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Tăng cảm giác cửa hàng thật bằng cụm hotline, tiếp nhận đơn và hỗ trợ nhanh ngay dưới header.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Giao hàng & hậu mãi</div>
          <div className="mt-2 text-lg font-semibold text-slate-950">Nội thành giao nhanh, kiểm tra hàng trước khi nhận</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Khối này thay cho các ô tiện ích hơi rời rạc trước đó và giúp homepage có chất commerce-shell rõ hơn.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Tin tức & tư vấn</div>
          <div className="mt-2 text-lg font-semibold">Có blog listing và article page riêng</div>
          <p className="mt-3 text-sm leading-6 text-slate-300">Section tin tức giờ không còn là khối chết — đã có đường dẫn thật để giữ người dùng trong hệ storefront.</p>
          <Link href="/tin-tuc" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
            Xem chuyên mục tin tức
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
