'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, status } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data);
        } else {
          router.push('/tai-khoan/don-hang');
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') fetchOrder();
    else if (status === 'unauthenticated') router.push('/');
  }, [params.id, status, router]);

  const getStatusLabel = (status) => {
    const labels = {
        'pending': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'shipping': 'Đang giao hàng',
        'delivered': 'Đã giao thành công',
        'cancelled': 'Đã hủy'
    };
    return labels[status] || status;
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center py-40">
           <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="mx-auto max-w-[1000px] px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
            <Link href="/tai-khoan/don-hang" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                QUAY LẠI DANH SÁCH
            </Link>
            <div className="px-4 py-1.5 bg-red-600 text-white rounded-full text-[12px] font-black uppercase tracking-wider">
                {getStatusLabel(order.status)}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: General Info */}
            <div className="lg:col-span-2 space-y-6">
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 leading-none">CHI TIẾT ĐƠN HÀNG</h1>
                            <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-wide">Mã: #{order.orderCode}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-400 font-medium">Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                                <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border border-slate-100 bg-white">
                                    <Image src={item.image || '/placeholder-product.jpg'} alt={item.productName} fill className="object-contain p-2" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[15px] font-black text-slate-900 line-clamp-2 leading-tight uppercase">{item.productName}</h4>
                                    <p className="text-[12px] font-bold text-slate-400 mt-1 uppercase italic">{item.variant || 'Mặc định'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[15px] font-black text-slate-900">{item.price.toLocaleString('vi-VN')}₫</p>
                                    <p className="text-[12px] font-bold text-slate-400 mt-1">x {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
                        <div className="flex justify-between text-sm text-slate-500 font-bold uppercase">
                            <span>Tạm tính</span>
                            <span className="text-slate-900">{order.total.toLocaleString('vi-VN')}₫</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500 font-bold uppercase">
                            <span>Phí vận chuyển</span>
                            <span className="text-green-600">MIỄN PHÍ</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-dashed border-slate-200">
                            <span className="text-lg font-black text-slate-900 uppercase">TỔNG CỘNG</span>
                            <span className="text-2xl font-black text-red-600 tracking-tight">{order.total.toLocaleString('vi-VN')}₫</span>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 italic">Ghi chú từ cửa hàng</h3>
                    <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 text-sm font-medium leading-relaxed">
                        {order.adminNote || 'Chưa có ghi chú nào từ nhân viên CSKH.'}
                    </div>
                </section>
            </div>

            {/* Right: Customer & Delivery */}
            <div className="space-y-6">
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 italic">Thông tin nhận hàng</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Người nhận</p>
                            <p className="text-[14px] font-black text-slate-900 uppercase italic leading-tight">{order.shippingAddress.fullName}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Số điện thoại</p>
                            <p className="text-[14px] font-black text-slate-900">{order.shippingAddress.phone}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Địa chỉ</p>
                            <p className="text-[14px] font-bold text-slate-700 leading-snug">
                                {order.shippingAddress.address}<br />
                                {order.shippingAddress.ward}, {order.shippingAddress.district}<br />
                                {order.shippingAddress.city}
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Thanh toán</p>
                            <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-[12px] font-black text-slate-600 uppercase">
                                {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : order.paymentMethod === 'bank' ? 'Chuyển khoản' : 'Trả góp'}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                    <h4 className="text-[13px] font-black text-amber-900 uppercase">Lưu ý quan trọng</h4>
                    <p className="text-[12px] text-amber-800/80 mt-2 font-medium leading-relaxed">
                        Quý khách vui lòng kiểm tra sản phẩm khi nhận hàng. Nếu có bất kỳ vấn đề gì, vui lòng liên hệ Hotline <span className="font-bold">0899.918.668</span> ngay lập tức.
                    </p>
                </div>
            </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
