'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login({ email, password });
      } else {
        result = await register({ email, password, fullName, phone });
      }

      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowAuthModal(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button 
          onClick={() => setShowAuthModal(false)}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
        >
          &times;
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${
              isLogin ? 'text-black border-b-2 border-[#fdd100]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            ĐĂNG NHẬP
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${
              !isLogin ? 'text-black border-b-2 border-[#fdd100]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            ĐĂNG KÝ
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                ⚠️ {error}
              </div>
            )}

            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700 uppercase">Họ và tên</label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#fdd100] transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700 uppercase">Số điện thoại</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0123456789"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#fdd100] transition"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-700 uppercase">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#fdd100] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-slate-700 uppercase">Mật khẩu</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#fdd100] transition"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-semibold text-slate-500 hover:text-black">
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg bg-[#fdd100] py-3 text-sm font-bold text-black transition hover:bg-[#eec500] active:scale-95 disabled:opacity-50 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  ĐANG XỬ LÝ...
                </span>
              ) : (
                isLogin ? 'ĐĂNG NHẬP NGAY' : 'TẠO TÀI KHOẢN'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 leading-relaxed">
            {isLogin ? (
              <>
                Chưa có tài khoản?{' '}
                <button onClick={() => setIsLogin(false)} className="font-bold text-black hover:underline">
                  Đăng ký ngay
                </button>
              </>
            ) : (
              <>
                Đã có tài khoản?{' '}
                <button onClick={() => setIsLogin(true)} className="font-bold text-black hover:underline">
                  Đăng nhập tại đây
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
