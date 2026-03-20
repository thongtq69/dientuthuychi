'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { useSiteContent } from '@/components/SiteContentProvider';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const DEFAULT_SITE_META = {
  name: 'Điện tử Thủy Chi',
  hotline: '0899.918.668',
  searchPlaceholder: 'Bạn muốn tìm gì ...',
  logo: '/logo-thuychi.jpg',
};

const DEFAULT_CATEGORY_RAIL_ITEMS = [
  { title: 'Điện Thoại', href: '/danh-muc/dien-thoai' },
  { title: 'Tablet', href: '/danh-muc/tablet' },
  { title: 'Thu Cũ Đổi Mới', href: '/thu-cu-doi-moi' },
  { title: 'Phụ Kiện', href: '/danh-muc/phu-kien' },
  { title: 'Tin Tức', href: '/tin-tuc' },
];

const subscribe = () => () => {};

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCategoryOpen, setDesktopCategoryOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState(null);
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const siteContent = useSiteContent();

  const { user, setShowAuthModal, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const siteMeta = siteContent?.siteMeta || DEFAULT_SITE_META;
  const categoryRailItems = siteContent?.categoryRailItems || DEFAULT_CATEGORY_RAIL_ITEMS;
  const resolvedLogo = siteMeta?.logo || '/logo-thuychi.jpg';
  const searchPlaceholder = siteContent?.searchPlaceholder || siteMeta.searchPlaceholder || 'Ban muon tim gi ...';
  const topBarText = siteContent?.topBarText || '';
  const uspItems = siteContent?.uspItems?.length ? siteContent.uspItems : [
    'Chinh hang - Xuat VAT day du',
    'Thu cu len doi - Tra gop 0%',
    'Giao nhanh - Freeship don 500K',
    '45 ngay mien phi 1 doi 1',
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#f3f5f7]">
      {topBarText ? (
        <div className="bg-[#fdd100] text-center text-[11px] font-bold uppercase tracking-[0.16em] text-black">
          <div className="mx-auto max-w-[1270px] px-3 py-2">{topBarText}</div>
        </div>
      ) : null}

      {/* Main Header Bar - Black */}
      <div className="bg-[#05030c] text-white">
        <div className="mx-auto flex max-w-[1270px] items-center gap-4 px-3 py-3 lg:gap-6">
          {/* Mobile hamburger */}
          <button
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-white/20 text-white lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className="text-xl">☰</span>
          </button>

          {/* Logo */}
          <Link 
            href="/" 
            className="shrink-0 p-1"
            style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Image
              src={logoSrc || resolvedLogo}
              alt={siteMeta.name}
              width={64}
              height={64}
              priority
              style={{ height: '64px', width: 'auto', display: 'block', maxHeight: '64px' }}
              className="object-contain object-center transition-all duration-300 hover:brightness-110 active:scale-95"
              onError={() => setLogoSrc('/logo-thuychi.jpg')}
            />
          </Link>

          {/* Category Button (Giá Kho Style: Yellow button) */}
          <div className="relative hidden lg:block shrink-0">
            <button
              type="button"
              onClick={() => setDesktopCategoryOpen((value) => !value)}
              className="flex h-[44px] items-center justify-center rounded bg-[#fdd100] px-4 py-2 text-[14px] font-bold text-black transition hover:bg-yellow-400"
              aria-expanded={desktopCategoryOpen}
              aria-label="Mở danh mục"
            >
              <span className="mr-2 text-lg">☰</span> DANH MỤC
            </button>

            {desktopCategoryOpen ? (
              <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
                <div className="max-h-[70vh] overflow-y-auto py-2">
                  {categoryRailItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-[14px] font-medium transition hover:bg-slate-50"
                      onClick={() => setDesktopCategoryOpen(false)}
                    >
                      {item.icon ? (
                        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-slate-50">
                          <Image src={item.icon} alt={item.title} fill sizes="28px" className="object-contain p-1" />
                        </div>
                      ) : null}
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Search bar */}
          <form className="hidden sm:flex h-[44px] min-w-0 flex-1 items-center overflow-hidden rounded bg-white relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="h-full w-full min-w-0 border-0 px-4 text-[14px] text-slate-900 outline-none placeholder:text-slate-400"
              />
            <button type="button" className="absolute right-0 flex h-full shrink-0 items-center px-4 text-slate-600 bg-transparent hover:bg-slate-100 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </form>

          {/* Action blocks (desktop) */}
          <div className="hidden shrink-0 lg:flex lg:items-center lg:gap-4">
            <a href={`tel:${siteMeta.hotline}`} className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#fdd100] font-semibold">Gọi mua hàng</span>
                <span className="text-[13px] font-bold text-white whitespace-nowrap">{siteMeta.hotline}</span>
              </div>
            </a>

            <Link href="/tra-cuu-don-hang" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] text-slate-400 font-semibold">Theo dõi</span>
                <span className="text-[13px] font-bold text-white">đơn hàng</span>
              </div>
            </Link>

            {/* Account Block */}
            <div className="relative group">
              {user ? (
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition py-2">
                  <div className="w-10 h-10 rounded-full border border-[#fdd100] flex items-center justify-center bg-[#fdd100]/10 overflow-hidden">
                    <span className="text-sm font-bold text-[#fdd100]">{user.fullName?.[0]}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-400 font-semibold truncate max-w-[80px]">Xin chào,</span>
                    <span className="text-[13px] font-bold text-white truncate max-w-[80px]">{user.fullName.split(' ').pop()}</span>
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-0 w-48 bg-white rounded-xl shadow-2xl py-2 text-slate-900 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] border border-slate-100">
                    <Link href="/tai-khoan" className="block px-4 py-2 hover:bg-slate-50 text-[14px]">Trang cá nhân</Link>
                    <Link href="/tai-khoan/don-hang" className="block px-4 py-2 hover:bg-slate-50 text-[14px]">Đơn hàng của tôi</Link>
                    <hr className="my-1 border-slate-100" />
                    <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[14px] text-red-600 font-medium">Đăng xuất</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] text-slate-400 font-semibold">Đăng nhập</span>
                    <span className="text-[13px] font-bold text-white">Tài khoản</span>
                  </div>
                </button>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 hover:opacity-80 transition relative"
            >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[11px] text-slate-400 font-semibold">Giỏ</span>
                <span className="text-[13px] font-bold text-white">hàng</span>
              </div>
              {hasMounted && totalCount > 0 && (
                <span className="absolute top-0 right-10 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white transition-all scale-110">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>



      {/* USP Bar (Giá Kho Style) - Yellow */}
      <div className="hidden lg:block bg-[#fdd100] border-b border-black/5">
        <div className="mx-auto flex max-w-[1270px] items-center justify-between px-3 py-2 text-[13px] font-bold text-black uppercase">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>{uspItems[0] || 'Chinh hang - Xuat VAT day du'}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            <span>{uspItems[1] || 'Thu cu len doi - Tra gop 0%'}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span>{uspItems[2] || 'Giao nhanh - Freeship don 500K'}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.13 15.57a10 10 0 1 0 3.8-11.83l-3.23 3.86"></path></svg>
            <span>{uspItems[3] || '45 ngay mien phi 1 doi 1'}</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-[280px] bg-white text-slate-900 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <span className="font-bold text-lg">Menu</span>
              <button className="text-2xl text-slate-500" onClick={() => setMobileOpen(false)}>
                &times;
              </button>
            </div>
            <nav className="flex flex-col py-2">
              {categoryRailItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.title === 'Trang chủ' ? '/' : item.href}
                  className="px-4 py-3 text-[15px] font-medium border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              <Link
                href="/tra-cuu-don-hang"
                className="px-4 py-3 text-[15px] font-bold text-red-600 border-b border-slate-100 hover:bg-slate-50 transition"
                onClick={() => setMobileOpen(false)}
              >
                TRA CỨU ĐƠN HÀNG
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
