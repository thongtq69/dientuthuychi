'use client';

import Image from 'next/image';
import Link from 'next/link';
import { siteMeta } from '@/data/siteData';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white pt-10 pb-6 text-slate-800">
      <div className="mx-auto max-w-[1270px] px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Cột 1: Thông tin công ty */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-48">
                <Image
                  src="/brand-logo-real.jpg"
                  alt={siteMeta.name}
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <div className="text-[14px] leading-relaxed space-y-2">
              <p className="font-bold text-[#05030c]">{siteMeta.name}</p>
              <p><span className="font-semibold">Địa chỉ:</span> {siteMeta.address}</p>
              <p><span className="font-semibold">Hotline:</span> <span className="text-[#d70018] font-bold">{siteMeta.hotline}</span></p>
              <p><span className="font-semibold">Email:</span> {siteMeta.email || 'thuychi@gmail.com'}</p>
            </div>
            {/* Social Links Icons */}
            <div className="flex gap-3 pt-2">
               <div className="w-8 h-8 rounded-full bg-[#3b5998] flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition">f</div>
               <div className="w-8 h-8 rounded-full bg-[#ff0000] flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition">▶</div>
               <div className="w-8 h-8 rounded-full bg-[#000000] flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition">𝕏</div>
            </div>
          </div>

          {/* Cột 2: Chính sách */}
          <div>
            <h3 className="mb-4 text-[15px] font-bold text-[#05030c] uppercase">Chính Sách Chung</h3>
            <ul className="space-y-2 text-[14px]">
              {['Chính sách bảo hành', 'Chính sách đổi trả', 'Chính sách vận chuyển', 'Chính sách bảo mật', 'Điều khoản sử dụng'].map((item) => (
                <li key={item} className="hover:text-[#d70018] cursor-pointer transition">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h3 className="mb-4 text-[15px] font-bold text-[#05030c] uppercase">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-2 text-[14px]">
              {['Hướng dẫn mua hàng', 'Hướng dẫn thanh toán', 'Tra cứu đơn hàng', 'Quy định về trả góp', 'Câu hỏi thường gặp'].map((item) => (
                <li key={item} className="hover:text-[#d70018] cursor-pointer transition">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Tổng đài hỗ trợ Gear */}
          <div className="space-y-4">
            <h3 className="mb-4 text-[15px] font-bold text-[#05030c] uppercase">Tổng Đài Hỗ Trợ</h3>
            <div className="space-y-3">
               <div className="p-3 bg-slate-50 rounded border border-slate-100 italic">
                  <p className="text-[13px] font-bold">Mua hàng: <span className="text-[#d70018]">{siteMeta.hotline}</span></p>
                  <p className="text-[12px] text-slate-500">(08:30 - 21:00 mỗi ngày)</p>
               </div>
               <div className="p-3 bg-slate-50 rounded border border-slate-100 italic">
                  <p className="text-[13px] font-bold">Khiếu nại: <span className="text-[#d70018]">{siteMeta.hotline}</span></p>
                  <p className="text-[12px] text-slate-500">(09:00 - 18:00 mỗi ngày)</p>
               </div>
            </div>
            
            <div className="pt-2">
               <h3 className="mb-2 text-[13px] font-bold text-[#05030c] uppercase">Thanh toán an toàn</h3>
               <div className="flex flex-wrap gap-2 grayscale hover:grayscale-0 transition cursor-help">
                  <div className="bg-white border border-slate-200 rounded p-1 w-12 h-6 flex items-center justify-center text-[8px] font-bold">VISA</div>
                  <div className="bg-white border border-slate-200 rounded p-1 w-12 h-6 flex items-center justify-center text-[8px] font-bold">MASTERCARD</div>
                  <div className="bg-white border border-slate-200 rounded p-1 w-12 h-6 flex items-center justify-center text-[8px] font-bold">MOMO</div>
                  <div className="bg-white border border-slate-200 rounded p-1 w-12 h-6 flex items-center justify-center text-[8px] font-bold">VNPAY</div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-slate-100 pt-6 text-center text-[12px] text-slate-400">
          <p>© 2026 {siteMeta.name}. Thiết kế dựa trên cảm hứng Giá Kho Layout.</p>
        </div>
      </div>
    </footer>
  );
}
