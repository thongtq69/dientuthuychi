'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderTrackingPage() {
  const [orderCode, setOrderCode] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // Find order by code and phone
      const res = await fetch(`/api/orders?where[orderCode][equals]=${orderCode.trim()}&where[shippingAddress.phone][equals]=${phone.trim()}`);
      if (!res.ok) throw new Error('Không thể kết nối máy chủ');
      
      const data = await res.json();
      if (data.docs && data.docs.length > 0) {
        setOrder(data.docs[0]);
      } else {
        setError('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại.');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

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
    const labels = {
        'pending': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'shipping': 'Đang giao hàng',
        'delivered': 'Đã giao thành công',
        'cancelled': 'Đã hủy'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="mx-auto max-w-[1260px] px-4 py-12">
        <div className="flex flex-col items-center">
            <h1 className="text-[28px] font-black text-slate-900 mb-2 uppercase italic tracking-tight">TRA CỨU ĐƠN HÀNG</h1>
            <p className="text-slate-500 mb-8 text-center max-w-md">Nhập mã đơn hàng và số điện thoại của bạn để theo dõi tình trạng xử lý và vận chuyển.</p>

            <div className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <form onSubmit={handleTrack} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-2">Mã đơn hàng</label>
                        <input 
                            required
                            type="text"
                            value={orderCode}
                            onChange={(e) => setOrderCode(e.target.value)}
                            placeholder="VD: DH-20260315-001"
                            className="w-full h-14 rounded-2xl border border-slate-200 px-5 text-[15px] font-bold outline-none focus:border-[#fdd100] transition uppercase"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-2">Số điện thoại</label>
                        <input 
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Nhập số điện thoại đặt hàng"
                            className="w-full h-14 rounded-2xl border border-slate-200 px-5 text-[15px] font-bold outline-none focus:border-[#fdd100] transition"
                        />
                    </div>
                    
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[13px] font-bold rounded-2xl animate-shake">
                           ⚠️ {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-2xl bg-[#fdd100] text-black font-black hover:bg-yellow-400 transition active:scale-95 shadow-lg shadow-yellow-100 uppercase tracking-wider"
                    >
                        {loading ? 'ĐANG TRA CỨU...' : 'TRA CỨU NGAY'}
                    </button>
                </form>
            </div>

            {order && (
                <div className="w-full max-w-3xl mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
                        <div className="bg-slate-900 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái đơn hàng</span>
                                <div className="mt-1 flex items-center gap-3">
                                    <h2 className="text-[18px] font-black text-white">#{order.orderCode}</h2>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ngày đặt hàng</span>
                                <p className="text-white font-bold">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Order Items */}
                            <div className="space-y-4 mb-8">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                                            <Image src={item.image || '/placeholder-product.jpg'} alt={item.productName} fill className="object-contain p-2" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[14px] font-black text-slate-900 uppercase line-clamp-1">{item.productName}</h4>
                                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase italic">{item.variant || 'Mặc định'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[14px] font-black text-slate-900">{item.price.toLocaleString('vi-VN')}₫</p>
                                            <p className="text-[11px] font-bold text-slate-400">x {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                                <div className="space-y-4">
                                    <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest italic">Người nhận hàng</h3>
                                    <div className="space-y-1">
                                        <p className="text-[14px] font-black text-slate-900 uppercase">{order.shippingAddress.fullName}</p>
                                        <p className="text-[14px] font-bold text-slate-600">{order.shippingAddress.phone}</p>
                                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                            {order.shippingAddress.address}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest italic">Tóm tắt thanh toán</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Tạm tính:</span>
                                            <span className="font-bold">{order.total.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Vận chuyển:</span>
                                            <span className="text-green-600 font-bold uppercase">Miễn phí</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
                                            <span className="text-[15px] font-black text-slate-900 uppercase">Tổng tiền:</span>
                                            <span className="text-[20px] font-black text-red-600">{order.total.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {order.adminNote && (
                                <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                                    <p className="text-[11px] font-black text-amber-900 uppercase mb-1">Cập nhật từ cửa hàng:</p>
                                    <p className="text-[13px] text-amber-800 font-medium italic">"{order.adminNote}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                        <button 
                            onClick={() => window.print()} 
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition font-bold text-xs uppercase"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                            In thông tin đơn hàng
                        </button>
                    </div>
                </div>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
