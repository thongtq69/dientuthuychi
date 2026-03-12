import Image from 'next/image';
import {
  footerColumns,
  marketplaceLinks,
  paymentBadges,
  siteMeta,
  storeBenefits,
  storeLocations,
  supportPanels,
} from '@/data/siteData';

const benefitIcons = {
  'Thanh toán khi nhận hàng': (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7h18v10H3z" />
      <path d="M7 11h10" />
      <path d="M7 15h4" />
      <path d="M16 4l-2 3" />
    </svg>
  ),
  'Cam kết uy tín hàng chính hãng': (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
      <path d="m9.5 12 1.7 1.7L14.8 10" />
    </svg>
  ),
  'Giao hàng miễn phí 2h': (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7h11v8H3z" />
      <path d="M14 10h3l3 3v2h-6z" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  'Bảo hành lỗi 1 đổi 1': (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21c4.4 0 8-3.6 8-8V7l-8-4-8 4v6c0 4.4 3.6 8 8 8z" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  ),
};

const panelIcons = ['?', '☎', '⌖'];

export function Footer() {
  return (
    <footer className="mt-10 bg-white text-slate-700">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 lg:px-6 xl:px-8">
        <section className="rounded-sm bg-[#f3f3f3] px-4 py-5 sm:px-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {storeBenefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-[#c8a63d]">
                  <div className="flex h-11 w-11 items-center justify-center">{benefitIcons[benefit]}</div>
                  <div className="text-sm font-semibold leading-5 text-[#2058aa]">{benefit}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3 sm:items-start">
              {supportPanels.map((panel, index) => (
                <div key={panel.title} className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#2058aa]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2058aa] text-xs text-white">{panelIcons[index]}</span>
                    <span className="truncate">{panel.title}</span>
                  </div>
                  <div className="flex min-h-[56px] items-center justify-center rounded-sm bg-[#0d63d8] px-3 py-2 text-center text-sm font-bold text-white">{panel.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[15px] font-extrabold uppercase text-[#2058aa]">{column.title}</h3>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-7 text-slate-800">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-[#0d63d8]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[1.35fr_1fr_0.75fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-48 overflow-hidden rounded-sm bg-white">
                <Image src="/brand-logo-real.jpg" alt={siteMeta.name} fill sizes="192px" className="object-contain object-left" />
              </div>
            </div>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-800">
              Hệ thống bán lẻ điện thoại chính hãng với giá tốt, có trả góp, giao hàng nhanh miễn phí.
            </p>
            <div className="mt-3 space-y-1.5 text-[15px] leading-7 text-slate-800">
              <p><span className="font-bold text-[#2058aa]">Địa chỉ:</span> {storeLocations.join(' ')}</p>
              <p><span className="font-bold text-[#2058aa]">Điện thoại:</span> {siteMeta.hotline}</p>
              <p><span className="font-bold text-[#2058aa]">Email:</span> hotro@thuychi.vn</p>
            </div>
          </div>

          <div>
            <h3 className="text-[15px] font-extrabold uppercase text-[#2058aa]">TỔNG ĐÀI HỖ TRỢ</h3>
            <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-800">
              <div>
                <div className="font-bold">MUA ONLINE (09:00 - 21:00 mỗi ngày)</div>
                <div className="font-extrabold text-[#2058aa]">{siteMeta.hotline}</div>
                <div>Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</div>
              </div>
              <div>
                <div className="font-bold">GÓP Ý & KHIẾU NẠI (09:00 - 21:00)</div>
                <div className="font-extrabold text-[#2058aa]">{siteMeta.hotline}</div>
                <div>Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-[15px] font-extrabold uppercase text-[#2058aa]">LIÊN KẾT SÀN</h3>
              <div className="mt-4 flex gap-2">
                {marketplaceLinks.map((item) => (
                  <div key={item.title} className="relative h-8 w-8 overflow-hidden rounded-sm bg-white" title={item.title}>
                    <Image src={item.image} alt={item.title} fill sizes="32px" className="object-contain" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[15px] font-extrabold uppercase text-[#2058aa]">HÌNH THỨC THANH TOÁN</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {paymentBadges.map((item) => (
                  <div key={item.title} className="relative h-[35px] w-[57px] overflow-hidden rounded-sm bg-white">
                    <Image src={item.image} alt={item.title} fill sizes="57px" className="object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}
