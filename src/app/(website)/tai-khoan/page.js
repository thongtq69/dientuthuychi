'use client';

import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function AccountDashboard() {
  const { user, status, logout } = useAuth();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center py-40">
           <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-4 uppercase">BẠN CHƯA ĐĂNG NHẬP</h1>
            <p className="text-slate-500 mb-8 max-w-sm">Vui lòng đăng nhập để quản lý thông tin cá nhân và đơn hàng.</p>
            <Link href="/" className="bg-[#fdd100] text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition">QUAY LẠI TRANG CHỦ</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="mx-auto max-w-[1260px] px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-extrabold text-lg">
                            {user?.fullName?.[0]}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-400 font-bold uppercase">Chào mừng,</p>
                            <p className="text-[15px] font-black text-slate-900 truncate">{user?.fullName?.split(' ').pop()}</p>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        <Link href="/tai-khoan" className="block px-4 py-3 rounded-2xl text-[14px] font-bold text-red-600 bg-red-50 transition">Thông tin cá nhân</Link>
                        <Link href="/tai-khoan/don-hang" className="block px-4 py-3 rounded-2xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition">Đơn hàng của tôi</Link>
                        <Link href="/tai-khoan/yeu-thich" className="block px-4 py-3 rounded-2xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition">Sản phẩm yêu thích</Link>
                        <button onClick={logout} className="w-full text-left px-4 py-3 rounded-2xl text-[14px] font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 transition">Đăng xuất</button>
                    </nav>
                </div>
            </aside>

            {/* Content */}
            <div className="flex-1 space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <h1 className="text-[20px] font-black text-slate-900 uppercase mb-8 italic">Thông tin cá nhân</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Họ và tên</p>
                            <p className="text-[15px] font-black text-slate-900 uppercase">{user?.fullName}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Số điện thoại</p>
                            <p className="text-[15px] font-black text-slate-900">{user?.phone || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Email</p>
                            <p className="text-[15px] font-black text-slate-900">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Ngày tham gia</p>
                            <p className="text-[15px] font-black text-slate-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---'}</p>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-50 text-right">
                        <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition active:scale-95">CHỈNH SỬA THÔNG TIN</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/tai-khoan/don-hang" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition group">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        </div>
                        <div>
                            <p className="text-[16px] font-black text-slate-900">Đơn hàng</p>
                            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Xem lịch sử mua hàng</p>
                        </div>
                    </Link>
                    <Link href="/tai-khoan/bao-hanh" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition group">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <div>
                            <p className="text-[16px] font-black text-slate-900">Bảo hành</p>
                            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Tra cứu bảo hành</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
