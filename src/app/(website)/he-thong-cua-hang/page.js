import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { siteMeta, storeLocations } from '@/data/siteData';

export default function StoreSystemPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Hệ thống cửa hàng</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Trang showroom hiện dùng nội dung hard-code để giữ luồng điều hướng ổn định trong lúc chưa bổ sung module quản lý chi nhánh.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {storeLocations.map((location) => (
              <div key={location} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Điểm bán</div>
                <div className="mt-2 text-base font-medium text-slate-900">{location}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-slate-950 px-5 py-4 text-sm text-white">
            Tư vấn nhanh: {siteMeta.hotline} - {siteMeta.supportHours}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
