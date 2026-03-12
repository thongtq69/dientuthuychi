import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Điện tử Thuỷ Chi | Điện thoại, linh kiện và phụ kiện công nghệ',
  description: 'Điện tử Thuỷ Chi chuyên điện thoại, linh kiện sửa chữa và phụ kiện công nghệ với hỗ trợ tư vấn nhanh, giao hàng nội thành và nhiều sản phẩm bán chạy.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
