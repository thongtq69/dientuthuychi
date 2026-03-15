'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderHistoryPage() {
  const { user, status } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/orders?where[customer][equals]=${user.id}&sort=-createdAt`);
        const data = await res.json();
        if (res.ok) {
           // Payload returns { docs: [...] }
           setOrders(data.docs || []);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
        fetchOrders();
    } else if (status === 'unauthenticated') {
        setLoading(false);
    }
  }, [user, status]);

  if (status === 'unauthenticated') {
     return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <h1 className="text-2xl font-black text-slate-900 mb-4">VUI LÒNG ĐĂNG NHẬP</h1>
                <p className="text-slate-500 mb-8 max-w-sm">Bạn cần đăng nhập để xem lịch sử đơn hàng của mình.</p>
            </div>
            <Footer />
        </div>
     );
  }

  const getStatusStyle = (status) => {
    switch (status) {
        case 'pending': return 'bg-amber-100 text-amber-700';
        case 'confirmed': return 'bg-blue-100 text-blue-700';
        case 'shipping': return 'bg-indigo-100 text-indigo-700';
        case 'delivered': return 'bg-green-100 text-green-700';
        case 'cancelled': return 'bg-red-100 text-red-700';
        default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
        case 'pending': return 'Chờ xác nhận';
        case 'confirmed': return 'Đã xác nhận';
        case 'shipping': return 'Đang giao';
        case 'delivered': return 'Đã giao';
        case 'cancelled': return 'Đã hủy';
        default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="mx-auto max-w-[1260px] px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar (Optional) */}
            <aside className="w-full md:w-64 space-y-2">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 mb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-black text-lg">
                            {user?.fullName?.[0]}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[12px] text-slate-400 font-bold uppercase">Tài khoản</p>
                            <p className="text-[15px] font-black text-slate-900 truncate">{user?.fullName}</p>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        <Link href="/tai-khoan" className="block px-4 py-2.5 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition">Thông tin cá nhân</Link>
                        <Link href="/tai-khoan/don-hang" className="block px-4 py-2.5 rounded-xl text-[14px] font-bold text-red-600 bg-red-50 transition">Đơn hàng của tôi</Link>
                        <Link href="/tai-khoan/yeu-thich" className="block px-4 py-2.5 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition">Sản phẩm yêu thích</Link>
                    </nav>
                </div>
            </aside>

            {/* Order Content */}
            <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50">
                        <h1 className="text-[20px] font-black text-slate-900 uppercase">Lịch sử mua hàng</h1>
                    </div>

                    {loading ? (
                        <div className="p-20 flex justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" /></div>
                    ) : orders.length === 0 ? (
                        <div className="p-20 text-center">
                            <p className="text-slate-400 font-medium mb-6">Bạn chưa có đơn hàng nào.</p>
                            <Link href="/" className="inline-block bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition">MUA SẮM NGAY</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {orders.map((order) => (
                                <Link 
                                    key={order.id} 
                                    href={`/tai-khoan/don-hang/${order.id}`}
                                    className="block p-6 hover:bg-slate-50/80 transition"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[16px] font-black text-slate-900">#{order.orderCode}</span>
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <span className="text-sm text-slate-400 font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>

                                    <div className="flex gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {order.items.slice(0, 4).map((item, idx) => (
                                            <div key={idx} className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-white">
                                                <Image src={item.image || '/placeholder-product.jpg'} alt={item.productName} fill className="object-contain" />
                                            </div>
                                        ))}
                                        {order.items.length > 4 && (
                                            <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-[12px] font-bold text-slate-500">
                                                +{order.items.length - 4}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                        <div className="text-sm text-slate-500 font-medium">
                                            {order.items.length} sản phẩm
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-400 font-medium">Tổng cộng:</span>
                                            <span className="text-lg font-black text-red-600">{order.total.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
