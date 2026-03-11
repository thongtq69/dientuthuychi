import Link from 'next/link';
import { featuredCategories, siteMeta } from '@/data/siteData';

export function CommerceShell() {
  return (
    <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-950 px-5 py-4 text-white">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Danh mục sản phẩm</div>
          <div className="mt-2 text-lg font-semibold">Mua nhanh theo nhóm</div>
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
          <p className="mt-3 text-sm leading-6 text-slate-600">Tư vấn chọn máy, báo giá nhanh, hỗ trợ đặt hàng và giải đáp sản phẩm mỗi ngày.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Giao hàng & hậu mãi</div>
          <div className="mt-2 text-lg font-semibold text-slate-950">Nội thành giao nhanh, hỗ trợ kiểm tra hàng trước khi nhận</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Ưu tiên trải nghiệm mua sắm rõ ràng, tư vấn kỹ trước khi chốt và hỗ trợ sau bán tốt hơn.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Tin tức & tư vấn</div>
          <div className="mt-2 text-lg font-semibold">Mẹo dùng iPhone, cập nhật iOS và kinh nghiệm mua máy</div>
          <p className="mt-3 text-sm leading-6 text-slate-300">Xem nhanh tin công nghệ, kinh nghiệm chọn iPhone cũ đẹp và nhiều nội dung hữu ích khác.</p>
          <Link href="/tin-tuc" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
            Xem chuyên mục tin tức
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
