import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-semibold tracking-normal text-slate-950">Giỏ hàng đang ở chế độ demo</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Chức năng thanh toán chưa nối dữ liệu thật. Tạm thời giữ trang cứng để khách vẫn thao tác và quay lại mua sắm mà không gặp lỗi 404.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/danh-muc/dien-thoai" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
              Xem điện thoại
            </Link>
            <Link href="/danh-muc/phu-kien" className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700">
              Xem phụ kiện
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
