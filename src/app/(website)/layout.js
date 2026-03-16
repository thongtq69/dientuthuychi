import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { CartProvider } from '@/components/CartContext';
import { CartDrawer } from '@/components/CartDrawer';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam-pro',
});

export const metadata = {
  title: 'Điện tử Thuỷ Chi | Điện thoại, linh kiện và phụ kiện công nghệ',
  description: 'Điện tử Thuỷ Chi chuyên điện thoại, linh kiện sửa chữa và phụ kiện công nghệ với hỗ trợ tư vấn nhanh, giao hàng nội thành và nhiều sản phẩm bán chạy.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <AuthModal />
            <CartDrawer />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
