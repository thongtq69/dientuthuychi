import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';

export function StickyActionBar({ product }) {
  const [visible, setVisible] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBuyNow = () => {
    addItem(product, 1, product.variant);
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    addItem(product, 1, product.variant);
  };

  const formatPrice = (p) => {
    if (typeof p === 'string') {
        const clean = p.replace(/\D/g, '');
        if (clean) return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(clean)).replace('₫', 'đ');
        return p;
    }
    if (!p) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p).replace('₫', 'đ');
  };

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-2 shadow-md transition-all animate-move-down hidden lg:block">
      <div className="mx-auto flex max-w-[1270px] items-center justify-between gap-6">
        {/* Left: Product Info in Breadcrumb Style */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white border border-slate-100 p-0.5">
            <Image src={product.image || product.primary_image} alt={product.name} fill className="object-contain" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="line-clamp-1 text-[14px] font-black text-slate-900 uppercase">{product.name}</div>
            <div className="text-[11px] font-bold text-slate-400">Tùy chọn: <span className="text-slate-600 capitalize">{product.variant || 'Mặc định'}</span></div>
          </div>
        </div>
        
        {/* Right: Price & Buttons */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex flex-col items-end">
             <div className="text-[18px] font-black text-red-600">{formatPrice(product.price)}</div>
             {product.originalPrice && (
                 <div className="flex items-center gap-2">
                    <span className="text-[12px] text-slate-400 line-through font-bold">{formatPrice(product.originalPrice)}</span>
                    <span className="text-[11px] text-red-600 font-black">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                 </div>
             )}
          </div>
          
          <div className="flex gap-2">
            <button 
                onClick={handleAddToCart}
                className="h-[44px] w-[44px] flex items-center justify-center rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-50 transition active:scale-95"
                title="Thêm vào giỏ hàng"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </button>
            <button 
                onClick={handleBuyNow}
                className="h-[44px] rounded-lg bg-red-600 px-8 text-[14px] font-black text-white hover:bg-red-700 transition active:scale-95 shadow-lg shadow-red-200"
            >
               MUA NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

