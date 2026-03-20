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
  locations: [DEFAULT_SITE_META.address],
};

const DEFAULT_SOCIAL_LINKS = [
  { title: 'Facebook', href: '#', image: '/images/footer-assets/facebook.png' },
  { title: 'Instagram', href: '#', image: '/images/footer-assets/instagram.png' },
  { title: 'Youtube', href: '#', image: '/images/footer-assets/youtube.png' },
];

const DEFAULT_PAYMENT_BADGES = [
  { title: 'Visa', image: '/images/footer-assets/visa.svg' },
  { title: 'Mastercard', image: '/images/footer-assets/mastercard.svg' },
  { title: 'Momo', image: '/images/footer-assets/momo.webp' },
];

export function Footer() {
  const context = useSiteContent();
  const chrome = context?.chrome || context || {};
  const [activeTab, setActiveTab] = useState(0);

  const siteData = chrome.siteMeta || DEFAULT_SITE_META;
  const contactInfo = chrome.footerContactInfo || DEFAULT_FOOTER_CONTACT_INFO;
  const policyLinks = chrome.footerPolicyLinks || DEFAULT_FOOTER_POLICY_LINKS;
  const serviceLinks = chrome.footerServiceLinks || DEFAULT_FOOTER_SERVICE_LINKS;
  const showrooms = chrome.footerShowrooms || DEFAULT_FOOTER_SHOWROOMS;
  const social = chrome.socialLinks || DEFAULT_SOCIAL_LINKS;
  const payments = chrome.paymentBadges || DEFAULT_PAYMENT_BADGES;

  return (
    <footer className="mt-8 border-t border-slate-200 bg-white pt-10">
      <div className="mx-auto max-w-[1270px] px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-8">
          {/* Brand and Services */}
          <div className="space-y-6">
            <div className="relative h-12 w-48">
              <Image src={siteData.logo || '/logo-thuychi.jpg'} alt={siteData.name} fill className="object-contain object-left" />
            </div>
            <div className="space-y-3">
              <h4 className="text-[15px] font-black uppercase text-slate-800">Dịch vụ cá nhân</h4>
              <ul className="space-y-2 text-[13px] font-medium text-slate-500">
                {serviceLinks.map((link) => (
                  <li key={typeof link === 'string' ? link : link.title} className="hover:text-[#d70018]">
                    <Link href={typeof link === 'string' ? '#' : link.href || '#'}>{typeof link === 'string' ? link : link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-3">
            <h4 className="text-[15px] font-black uppercase text-slate-800">Chính sách & Hướng dẫn</h4>
            <ul className="space-y-2 text-[13px] font-medium text-slate-500">
              {policyLinks.map((link) => (
                <li key={typeof link === 'string' ? link : link.title} className="hover:text-[#d70018]">
                  <Link href={typeof link === 'string' ? '#' : link.href || '#'}>{typeof link === 'string' ? link : link.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-[15px] font-black uppercase text-slate-800">Thông tin liên hệ</h4>
            <ul className="space-y-3">
              {contactInfo.map((info) => (
                <li key={info.label} className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-bold uppercase text-slate-400">{info.label}</span>
                  <span className="text-[13.5px] font-bold text-slate-700">{info.value}</span>
                  {info.note && <span className="text-[11px] font-medium italic text-slate-400">{info.note}</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Showrooms and Social */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-[15px] font-black uppercase text-slate-800">{showrooms.title || 'Hệ thống cửa hàng'}</h4>
              <ul className="space-y-2 text-[13px] font-medium text-slate-500">
                {showrooms.locations?.map((loc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 text-red-500">📍</span>
                    <span>{loc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[15px] font-black uppercase text-slate-800">Kết nối với chúng tôi</h4>
              <div className="flex gap-2">
                {social.map((item) => (
                  <a key={item.title} href={item.href || '#'} target="_blank" rel="noopener noreferrer" className="relative h-9 w-9 overflow-hidden rounded-lg bg-slate-50 border border-slate-100 p-1.5 transition hover:shadow-md hover:border-blue-100">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 py-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="text-[12px] font-bold uppercase text-slate-400">Thanh toán an toàn:</span>
              <div className="flex gap-2.5">
                {payments.map((p) => (
                  <div key={p.title} className="relative h-6 w-10 overflow-hidden rounded bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] grayscale hover:grayscale-0 transition duration-300">
                    <Image src={p.image} alt={p.title} fill className="object-contain p-1" />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-[12px] font-medium text-slate-400 lg:text-right">
              © 2026 {siteData.name}. Mọi quyền được bảo lưu. <br className="sm:hidden" />
              Thiết kế và phát triển bởi Đội ngũ Công nghệ Thủy Chi.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
