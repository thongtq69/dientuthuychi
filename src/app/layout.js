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
  title: 'Hoàng Kiên | iPhone, linh kiện và phụ kiện Apple',
  description: 'Hoàng Kiên chuyên iPhone, linh kiện sửa chữa và phụ kiện Apple với hỗ trợ tư vấn nhanh, giao hàng nội thành và nhiều sản phẩm bán chạy.',
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
