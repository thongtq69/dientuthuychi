import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { CartProvider } from '@/components/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { SiteContentProvider } from '@/components/SiteContentProvider';
import { getSiteChromeData } from '@/lib/api/content';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam-pro',
});

export async function generateMetadata() {
  const siteContent = await getSiteChromeData();
  const siteMeta = siteContent?.siteMeta || {};
  
  return {
    title: {
      default: siteMeta.name || 'Điện tử Thuỷ Chi | Điện thoại, linh kiện và phụ kiện công nghệ',
      template: `%s | ${siteMeta.name || 'Điện tử Thuỷ Chi'}`
    },
    description: siteMeta.tagline || 'Điện tử Thuỷ Chi chuyên điện thoại, linh kiện sửa chữa và phụ kiện công nghệ với hỗ trợ tư vấn nhanh, giao hàng nội thành và nhiều sản phẩm bán chạy.',
    icons: {
      icon: '/logo-thuychi.jpg',
      apple: '/logo-thuychi.jpg',
    },
  };
}

export default async function RootLayout({ children }) {
  const siteContent = await getSiteChromeData();

  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        <SiteContentProvider value={siteContent}>
          <AuthProvider>
            <CartProvider>
              <AuthModal />
              <CartDrawer />
              {children}
            </CartProvider>
          </AuthProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}
