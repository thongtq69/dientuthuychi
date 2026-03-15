'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  footerCertification,
  footerPartner,
  footerServiceLinks,
  paymentBadges,
  siteMeta,
  socialLinks,
} from '@/data/siteData';

function FooterSectionTitle({ children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[18px] font-black uppercase tracking-tight text-slate-900 sm:text-[20px]">{children}</h3>
      <div className="h-1 w-24 rounded-full bg-[#f4cf16]" />
    </div>
  );
}

function PaymentBadge({ item }) {
  if (item.image) {
    return (
      <div className="relative h-14 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Image src={item.image} alt={item.title} fill sizes="140px" className="object-contain p-2" />
      </div>
    );
  }

  const label = item.label || item.title;
  const styles = {
    Visa: 'text-[#1a66b3]',
    Mastercard: 'text-[#202020]',
    ATM: 'text-[#202020]',
    mPOS: 'text-[#d26a13]',
    MegaPay: 'text-[#ef7d22]',
  };

  return (
    <div className="flex h-14 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
      <span className={`text-[16px] font-black ${styles[item.title] || 'text-slate-800'}`}>{label}</span>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white pt-10 pb-6 text-slate-800">
      <div className="mx-auto max-w-[1270px] space-y-10 px-4">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div className="space-y-5">
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

            <div className="space-y-2 text-[14px] leading-relaxed text-slate-600">
              <p className="font-bold text-slate-900">{siteMeta.name}</p>
              <p><span className="font-semibold text-slate-900">Địa chỉ:</span> {siteMeta.address}</p>
              <p><span className="font-semibold text-slate-900">Hotline:</span> <span className="font-bold text-[#d70018]">{siteMeta.hotline}</span></p>
              <p><span className="font-semibold text-slate-900">Email:</span> {siteMeta.email || 'thuychi@gmail.com'}</p>
            </div>

            <div className="space-y-3 pt-2">
              <FooterSectionTitle>Dịch vụ & Thông tin khác</FooterSectionTitle>
              <ul className="space-y-3 text-[15px] font-medium text-slate-600">
                {footerServiceLinks.map((item) => (
                  <li key={item}>
                    <Link href="#" className="transition hover:text-[#d70018]">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <FooterSectionTitle>Đối tác sửa chữa & Bảo hành</FooterSectionTitle>
              <Link href="#" className="block max-w-[480px]">
                <div className="relative aspect-[9/2] w-full overflow-hidden rounded-2xl shadow-sm">
                  <Image src={footerPartner.image} alt={footerPartner.title} fill sizes="480px" className="object-cover" />
                </div>
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <FooterSectionTitle>Kết nối với chúng tôi</FooterSectionTitle>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group"
                  title={item.title}
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-md">
                    <Image src={item.image} alt={item.title} fill sizes="64px" className="object-contain p-2" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <FooterSectionTitle>Phương thức thanh toán</FooterSectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {paymentBadges.map((item) => (
                <PaymentBadge key={item.title} item={item} />
              ))}
            </div>

            <div className="pt-4">
              <Link href="#" className="inline-block">
                <div className="relative h-20 w-[300px] max-w-full overflow-hidden">
                  <Image
                    src={footerCertification.image}
                    alt={footerCertification.title}
                    fill
                    sizes="300px"
                    className="object-contain object-left"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 text-center text-[12px] text-slate-400">
          <p>© 2026 {siteMeta.name}. Nội dung footer tham chiếu từ dienthoaigiakho.vn và đã điều chỉnh cho phù hợp giao diện dự án.</p>
        </div>
      </div>
    </footer>
  );
}
