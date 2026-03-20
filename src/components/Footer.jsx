'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useSiteContent } from '@/components/SiteContentProvider';

const DEFAULT_SITE_META = {
  name: 'Điện tử Thủy Chi',
  logo: '/logo-thuychi.jpg',
  address: 'Số 315 Đường Hoàng Mai, Phường Tương Mai, Thành phố Hà Nội',
  email: 'thuychi@gmail.com',
  hotline: '0899 918 668',
};

const DEFAULT_FOOTER_CONTACT_INFO = [
  { label: 'Địa chỉ', value: DEFAULT_SITE_META.address, note: '' },
  { label: 'Hotline', value: DEFAULT_SITE_META.hotline, note: '' },
  { label: 'Email', value: DEFAULT_SITE_META.email, note: '' },
  { label: 'Thời gian', value: 'Mở cửa: 08:00 - 22:00 mỗi ngày', note: '' },
];

const DEFAULT_FOOTER_POLICY_LINKS = ['Ưu đãi hội viên', 'Hướng dẫn mua hàng Online', 'Hướng dẫn thanh toán'];
const DEFAULT_FOOTER_SERVICE_LINKS = ['Khách hàng doanh nghiệp (B2B)', 'Tuyển dụng', 'Điều khoản sử dụng'];
const DEFAULT_FOOTER_SHOWROOMS = {
  title: 'Showroom Thủy Chi',
  hours: 'Giờ hoạt động Showroom: 8h30 - 21h30',
  locations: [DEFAULT_SITE_META.address],
};
const DEFAULT_PAYMENT_BADGES = [
  { title: 'Visa', image: '/images/footer-assets/visa.svg' },
  { title: 'Mastercard', image: '/images/footer-assets/mastercard.svg' },
  { title: 'ATM', image: '/images/footer-assets/atm.svg' },
];
const DEFAULT_SOCIAL_LINKS = [
  { title: 'Facebook', href: '#', image: '/images/footer-assets/facebook.png' },
  { title: 'TikTok', href: '#', image: '/images/footer-tiktok.svg' },
];
const DEFAULT_FOOTER_CERTIFICATION = {
  title: 'Đã thông báo Bộ Công Thương',
  image: '/images/footer-assets/bocongthuong.png',
};

function FooterSectionTitle({ children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[18px] font-black uppercase tracking-normal text-slate-900 sm:text-[20px]">{children}</h3>
      <div className="h-1 w-24 rounded-full bg-[#f4cf16]" />
    </div>
  );
}

function PaymentBadge({ item }) {
  return (
    <div className="relative h-[68px] overflow-hidden rounded-[10px] border border-slate-300 bg-white shadow-[0_2px_6px_rgba(15,23,42,0.06)]">
      <Image src={item.image} alt={item.title} fill sizes="160px" className="object-contain p-2.5" />
    </div>
  );
}

export function Footer() {
  const [logoSrc, setLogoSrc] = useState(null);
  const siteContent = useSiteContent();
  const footerCertification = siteContent?.footerCertification || DEFAULT_FOOTER_CERTIFICATION;
  const footerContactInfo = siteContent?.footerContactInfo || DEFAULT_FOOTER_CONTACT_INFO;
  const footerPolicyLinks = siteContent?.footerPolicyLinks || DEFAULT_FOOTER_POLICY_LINKS;
  const footerServiceLinks = siteContent?.footerServiceLinks || DEFAULT_FOOTER_SERVICE_LINKS;
  const footerShowrooms = siteContent?.footerShowrooms || DEFAULT_FOOTER_SHOWROOMS;
  const paymentBadges = siteContent?.paymentBadges || DEFAULT_PAYMENT_BADGES;
  const socialLinks = siteContent?.socialLinks || DEFAULT_SOCIAL_LINKS;
  const siteMeta = siteContent?.siteMeta || DEFAULT_SITE_META;
  const resolvedLogo = siteMeta?.logo || '/logo-thuychi.jpg';

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white pt-10 pb-6 text-slate-800">
      <div className="mx-auto max-w-[1270px] space-y-8 overflow-x-hidden px-4 sm:px-5 lg:px-6">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[1.15fr_0.95fr_0.85fr_1fr]">
          <div className="space-y-10">
            <div className="space-y-6">
              <Link href="/" className="inline-block">
                <div className="relative h-[80px] w-[80px] overflow-hidden rounded-2xl bg-[#05030c] p-2">
                  <Image 
                    src={logoSrc || resolvedLogo} 
                    alt={siteMeta.name} 
                    fill 
                    sizes="80px"
                    className="object-contain"
                    onError={() => setLogoSrc('/logo-thuychi.jpg')}
                  />
                </div>
              </Link>
              
              <div className="space-y-4">
                <FooterSectionTitle>Thông tin liên hệ</FooterSectionTitle>
                <div className="space-y-3 text-[15px] leading-relaxed text-slate-600 sm:text-[16px]">
                  {footerContactInfo.map((item) => (
                    <p key={item.label}>
                      <span className="font-bold text-slate-900">{item.label}:</span>{' '}
                      <span className={item.label === 'Hotline' ? 'font-extrabold text-[#d70018]' : item.label === 'Email' ? 'font-semibold text-[#1d4ed8]' : 'text-slate-600'}>{item.value}</span>{' '}
                      {item.note ? <span className="text-slate-500">{item.note}</span> : null}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <FooterSectionTitle>{footerShowrooms.title}</FooterSectionTitle>
              <div className="space-y-3 text-[15px] leading-relaxed text-slate-600 sm:text-[16px]">
                <p className="font-semibold text-slate-700">{footerShowrooms.hours}</p>
                {footerShowrooms.locations.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <FooterSectionTitle>Thông tin & Chính sách</FooterSectionTitle>
            <ul className="space-y-3 text-[15px] leading-relaxed text-slate-600 sm:text-[16px]">
              {footerPolicyLinks.map((item) => (
                <li key={item}>
                  <Link href="#" className="transition hover:text-[#d70018]">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <FooterSectionTitle>Dịch vụ & Thông tin khác</FooterSectionTitle>
              <ul className="space-y-3 text-[16px] font-medium leading-relaxed text-slate-600 sm:text-[17px]">
                {footerServiceLinks.map((item) => (
                  <li key={item}>
                    <Link href="#" className="transition hover:text-[#d70018]">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <FooterSectionTitle>Kết nối với chúng tôi</FooterSectionTitle>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group"
                    title={item.title}
                  >
                    <div className="relative h-[56px] w-[56px] overflow-hidden rounded-full bg-white transition duration-200 group-hover:-translate-y-1 sm:h-[60px] sm:w-[60px]">
                      <Image src={item.image} alt={item.title} fill sizes="60px" className="object-contain" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <FooterSectionTitle>Phương thức thanh toán</FooterSectionTitle>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {paymentBadges.map((item) => (
                  <PaymentBadge key={item.title} item={item} />
                ))}
              </div>

              <Link href="#" className="inline-block pt-3">
                <div className="relative h-[78px] w-[208px] max-w-full overflow-hidden sm:h-[90px] sm:w-[240px]">
                  <Image
                    src={footerCertification.image}
                    alt={footerCertification.title}
                    fill
                    sizes="240px"
                    className="object-contain object-left"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 text-[12px] leading-6 text-slate-500 sm:text-[13px]">
          <p>
            © Công ty TNHH Điện tử Thủy Chi | Địa chỉ: Số 315 Đường Hoàng Mai, Phường Tương Mai, Thành phố Hà Nội |
            Email hỗ trợ: <span className="font-semibold text-[#1d4ed8]">thuychi@gmail.com</span> | Gọi mua hàng:{' '}
            <span className="font-semibold text-[#1d4ed8]">0899 918 668</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
