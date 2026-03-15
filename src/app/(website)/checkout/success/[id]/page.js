'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data);
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchOrder();
  }, [params.id]);

  if (loading) {
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
      
      <main className="mx-auto max-w-[1260px] px-4 py-16 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 text-center">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
             </div>
             
             <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tight">THANH TOÁN THÀNH CÔNG!</h1>
             <p className="text-lg font-bold text-slate-600 mb-8">Cảm ơn bạn đã tin tưởng Điện Tử Thuỷ Chi</p>
             
             {order && (
                <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 border border-slate-100">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                        <span className="text-sm font-bold text-slate-500 uppercase">Mã đơn hàng:</span>
                        <span className="text-[18px] font-black text-slate-900">#{order.orderCode}</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Người nhận:</span>
                            <span className="text-slate-900 font-black">{order.shippingAddress.fullName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Hình thức:</span>
                            <span className="text-slate-900 font-black">{order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : order.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' : 'Trả góp'}</span>
                        </div>
                        <div className="flex justify-between text-lg pt-2 border-t border-dashed border-slate-300">
                            <span className="text-slate-900 font-black uppercase">Tổng cộng:</span>
                            <span className="text-red-600 font-black">{order.total.toLocaleString('vi-VN')}₫</span>
                        </div>
                    </div>
                </div>
             )}

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                    href="/tai-khoan/don-hang"
                    className="h-14 rounded-2xl border-2 border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-50 transition uppercase text-sm"
                >
                    Theo dõi đơn hàng
                </Link>
                <Link 
                    href="/"
                    className="h-14 rounded-2xl bg-red-600 flex items-center justify-center font-bold text-white hover:bg-red-700 transition uppercase text-sm shadow-xl shadow-red-200"
                >
                    Tiếp tục mua sắm
                </Link>
             </div>
             
             <p className="mt-8 text-xs text-slate-400 font-medium">Nhân viên sẽ liên hệ với bạn trong vòng 15-30 phút để xác nhận đơn hàng.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
