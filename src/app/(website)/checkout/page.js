'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Hồ Chí Minh',
    district: '',
    ward: '',
    paymentMethod: 'cod',
    note: ''
  });

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'Hồ Chí Minh',
        district: user.district || '',
        ward: user.ward || ''
      }));
    }
  }, [user]);

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
             </div>
             <h1 className="text-2xl font-black text-slate-900 mb-2">GIỎ HÀNG ĐANG TRỐNG</h1>
             <p className="text-slate-500 mb-8 max-w-sm">Vui lòng chọn thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.</p>
             <button onClick={() => router.push('/')} className="bg-[#e00000] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition">QUAY LẠI CỬA HÀNG</button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        customer: user?.id || null, // Optional for guest
        items: cartItems.map(item => ({
          productSlug: item.slug,
          productName: item.name,
          variant: item.variant,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: totalPrice,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          ward: formData.ward
        },
        paymentMethod: formData.paymentMethod,
        note: formData.note,
        status: 'pending'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        router.push(`/checkout/success/${data.doc.id}`);
      } else {
        setError(data.errors?.[0]?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Lỗi kết nối server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      
      <main className="mx-auto max-w-[1260px] px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Shipping Form */}
          <div className="flex-1 space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fdd100] text-[14px]">1</span>
                THÔNG TIN GIAO HÀNG
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase">Họ và tên người nhận</label>
                    <input 
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nhập họ và tên"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#fdd100] outline-none transition"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase">Số điện thoại</label>
                    <input 
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Nhập số điện thoại"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#fdd100] outline-none transition"
                    />
                 </div>
                 <div className="md:col-span-2 space-y-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase">Địa chỉ nhận hàng</label>
                    <input 
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Số nhà, tên đường..."
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#fdd100] outline-none transition"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase">Tỉnh / Thành phố</label>
                    <select 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#fdd100] outline-none bg-white transition"
                    >
                        <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        {/* More cities can be added */}
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase">Quận / Huyện</label>
                    <input 
                        required
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="Nhập quận huyện"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#fdd100] outline-none transition"
                    />
                 </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fdd100] text-[14px]">2</span>
                HÌNH THỨC THANH TOÁN
              </h2>
              
              <div className="space-y-3">
                 {[
                    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '🚚' },
                    { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
                    { id: 'installment', label: 'Trả góp 0% qua thẻ / App', icon: '💳' }
                 ].map(method => (
                    <label 
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.paymentMethod === method.id 
                            ? 'border-red-600 bg-red-50/50 shadow-sm' 
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                    >
                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-red-600"
                        />
                        <span className="text-xl">{method.icon}</span>
                        <span className="text-[14px] font-bold text-slate-700">{method.label}</span>
                    </label>
                 ))}
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-8 space-y-6">
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-[16px] font-black text-slate-900 mb-6 uppercase">Đơn hàng của bạn</h2>
                    
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-slate-100">
                                    <Image src={item.image || '/placeholder-product.jpg'} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[13px] font-bold text-slate-800 line-clamp-2">{item.name}</h4>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-[12px] text-slate-500 font-medium">SL: {item.quantity}</span>
                                        <span className="text-[13px] font-bold text-red-600">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-3">
                        <div className="flex justify-between text-sm text-slate-600 font-medium">
                            <span>Tạm tính</span>
                            <span className="text-slate-900">{totalPrice.toLocaleString('vi-VN')}₫</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600 font-medium">
                            <span>Phí vận chuyển</span>
                            <span className="text-green-600">Miễn phí</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                            <span className="text-[14px] font-bold text-slate-900 uppercase">Tổng cộng</span>
                            <span className="text-[20px] font-black text-[#e00000]">{totalPrice.toLocaleString('vi-VN')}₫</span>
                        </div>
                    </div>
                </section>

                <div className="space-y-4">
                    {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-shake">⚠️ {error}</div>}
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full h-14 rounded-2xl bg-[#e00000] text-white font-black hover:bg-red-700 transition active:scale-95 shadow-xl shadow-red-200 uppercase tracking-widest ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                             <span className="flex items-center justify-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ĐANG GỬI...
                             </span>
                        ) : 'GỬI ĐƠN HÀNG NGAY'}
                    </button>
                    <p className="text-[11px] text-center text-slate-400 font-medium px-4">Bằng việc đặt hàng, bạn đồng ý với các <a href="#" className="underline">điều khoản & điều kiện</a> của Điện Tử Thuỷ Chi.</p>
                </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
