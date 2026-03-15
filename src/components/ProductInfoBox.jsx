'use client';

export function ProductInfoBox({ warranty, condition, stock }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left: Product Info */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-[15px] font-black uppercase text-slate-800">
          Thông tin sản phẩm
        </h3>
        <div className="space-y-4 text-[14px]">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-slate-900">📍</span>
            <div>
              <div className="font-bold text-slate-900">Chế độ bảo hành:</div>
              <div className="font-black text-blue-700 uppercase">{warranty || 'BẢO HÀNH TIÊU CHUẨN (4512)'}</div>
              <ul className="mt-1 space-y-0.5 text-slate-600 font-medium">
                <li>- 45 ngày 1 đổi 1</li>
                <li>- Bảo hành phần cứng 12 tháng</li>
                <li>- Bảo hành nhanh chỉ với số điện thoại</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start gap-3 border-t border-slate-50 pt-4">
            <span className="mt-0.5 text-slate-900">📋</span>
            <div>
              <div className="font-bold text-slate-900">Tình trạng quy cách sản phẩm:</div>
              <ul className="mt-1 space-y-0.5 text-slate-600 font-medium">
                <li>• Máy mới đầy đủ hộp và phụ kiện</li>
                <li>• Sản phẩm bao gồm: máy, cáp sạc, que chọc sim, sách hướng dẫn</li>
                <li>• Chưa kích hoạt</li>
                <li>• Giá bán đã bao gồm VAT</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Stock Info */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-[15px] font-black uppercase text-green-600">
                <span className="text-xl">🚛</span> Còn hàng: <span className="text-slate-900 lowercase font-bold">Xem danh sách cửa hàng</span>
            </h3>
            <span className="text-slate-400">▼</span>
        </div>
        
        <div className="space-y-4 text-[14px]">
          <div className="flex items-center justify-between font-bold text-slate-700">
            <span className="flex items-center gap-2">📞 Mua Online Giá Tốt <b className="text-red-600">1900 8922</b></span>
            <span className="text-green-600">Còn Hàng</span>
          </div>

          <div className="space-y-3 border-t border-slate-50 pt-4">
             {[
               '947 Quang Trung, P. An Hội Tây, TP.HCM',
               '1247 Đường 3 Tháng 2, P. Minh Phụng, TP.HCM',
               '121 Chu Văn An, P. Bình Thạnh, TP.HCM'
             ].map((address, i) => (
                <div key={i} className="flex items-start gap-3">
                   <span className="mt-0.5 text-slate-300">📍</span>
                   <span className="font-medium text-slate-600">{address}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
