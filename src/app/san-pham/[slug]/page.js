import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductRail } from '@/components/ProductRail';
import { PromotionBox } from '@/components/PromotionBox';
import { StickyActionBar } from '@/components/StickyActionBar';
import { SpecificationsTable } from '@/components/SpecificationsTable';
import { ProductInfoBox } from '@/components/ProductInfoBox';
import { FAQAccordion } from '@/components/FAQAccordion';
import { SmartImage } from '@/components/SmartImage';
import { accessoryProducts, getProductBySlug, getRelatedProducts, products } from '@/data/siteData';

/* ── Helpers ── */
function formatPrice(price) {
  if (typeof price === 'string') {
    const n = parseInt(price.replace(/\D/g, ''));
    if (n && n > 0) return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
    if (n === 0 || !price.trim()) return 'Liên hệ';
    return price;
  }
  if (!price || price <= 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

function getExtendedProductData(slug) {
  try {
    const pagesDir = '/Users/bephi/thuychi/pages-json/';
    const filePath = path.join(pagesDir, `${slug}.json`);
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const files = fs.readdirSync(pagesDir);
    const match = files.find(f => f.startsWith(slug) && f.endsWith('.json'));
    if (match) return JSON.parse(fs.readFileSync(path.join(pagesDir, match), 'utf8'));
  } catch (err) {}
  return null;
}

function extractPromotionsFromText(text) {
  if (!text) return { promotions: [], coupons: [] };
  const coupons = [];
  const promotions = [];
  const couponRegex = /Nhập mã:\s*([A-Z0-9]+)\s*Giảm\s*([\d.]+đ?k?)\s*HSD:\s*([\d/]+)/gi;
  let match;
  while ((match = couponRegex.exec(text)) !== null) {
    coupons.push({ code: match[1], description: `Giảm ${match[2]}`, hsd: match[3] });
  }
  const promoMatch = text.match(/Ưu đãi đặc biệt.*?(?:Quà tặng và ưu đãi khác|Thông tin sản phẩm|Còn hàng)/s);
  if (promoMatch) {
    const bullets = promoMatch[0].match(/•\s*.*?(?=•|$)/g);
    if (bullets) bullets.forEach(b => promotions.push({ text: b.replace('•', '').trim() }));
  }
  return { promotions, coupons };
}

function extractDetailsFromText(text) {
  if (!text) return [];
  const start = text.indexOf("Đặc điểm nổi bật");
  const review = text.indexOf("Review");
  const s = start !== -1 ? start + 16 : (review !== -1 ? review : 0);
  const e = text.lastIndexOf("Xem thêm") > s ? text.lastIndexOf("Xem thêm") : text.length;
  const meat = text.substring(s, e).trim();
  if (!meat || meat.toLowerCase().includes("đang cập nhật")) return [];
  const headings = ["Thiết kế", "Màn hình", "Chipset", "Hiệu năng", "Camera", "Pin", "AI", "S-Pen", "Bảo mật", "Snapdragon", "Dynamic AMOLED"];
  const sections = [];
  meat.split(/\n\n+/).forEach(p => {
    const c = p.trim();
    if (c.length < 20) return;
    const isH = (c.length < 70 && headings.some(h => c.includes(h))) || (c.length < 50 && c === c.toUpperCase());
    if (isH) sections.push({ heading: c, content: "" });
    else if (sections.length) sections[sections.length - 1].content += (sections[sections.length - 1].content ? "\n\n" : "") + c;
    else sections.push({ heading: "Giới thiệu", content: c });
  });
  return sections.filter(s => s.content.length > 30);
}

/* ── Image Filter ── */
const EXCLUDE = ['icon','logo','home-credit','kredivo','warranty','warehouse','banner','hero-badge','coupon','payment','he-thong','gio-hang','menu-bar','thong-tin','hot.svg','shield','badge','back-ground','u-u-dai','giakho','facebook','youtube','tiktok','zalo','messenger','instagram','authentic','instalment','fast-delivery','free-return','Subbaner','SUB-BANNER','align-price'];

function filterGallery(images, primary) {
  const filtered = (images || []).filter(img =>
    img && typeof img === 'string' &&
    !EXCLUDE.some(k => img.toLowerCase().includes(k.toLowerCase())) &&
    img.includes('cdn.dienthoaigiakho.vn') &&
    (img.endsWith('.jpg') || img.endsWith('.png') || img.endsWith('.jpeg') || img.endsWith('.webp'))
  );
  if (filtered.length > 0) return filtered.slice(0, 15);
  if (primary) return [primary];
  return [];
}

/* ── Metadata ── */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = getExtendedProductData(slug);
  if (!data) return { title: 'Sản phẩm' };
  return {
    title: data.title || data.h1,
    description: data.meta_description,
    alternates: { canonical: data.canonical },
    openGraph: { title: data.h1, description: data.meta_description, images: [data.normalized_product?.primary_image] }
  };
}

/* ── Page ── */
export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const baseProduct = getProductBySlug(slug);
  const extendedData = getExtendedProductData(slug);
  if (!baseProduct && !extendedData) notFound();

  const normalized = extendedData?.normalized_product || {};
  const product = {
    ...(baseProduct || {}),
    ...normalized,
    technical_specifications: extendedData?.technical_specifications || baseProduct?.technical_specifications,
    text_content: extendedData?.text || baseProduct?.text_content,
    images_list: extendedData?.images || baseProduct?.images_list,
    faqs: (() => {
      try {
        const sd = extendedData?.structured_data;
        if (!sd) return [];
        const faqStr = sd.find(s => s?.includes('FAQPage'));
        return faqStr ? JSON.parse(faqStr).mainEntity || [] : [];
      } catch { return []; }
    })(),
    featured_highlights: extendedData?.featured_highlights || normalized?.featured_highlights || []
  };

  const { promotions, coupons } = extractPromotionsFromText(product.text_content);
  const richSections = product.featured_highlights.length > 0
    ? product.featured_highlights
    : extractDetailsFromText(product.text_content);

  const gallery = filterGallery(product.images_list, product.primary_image || product.image);

  const breadcrumbItems = (product.breadcrumbs || ['Trang chủ', 'Sản phẩm', product.name]).map((label, i) => ({
    label,
    href: i === 0 ? '/' : undefined,
  }));

  const uiVariants = (product.variants || []).map(v => ({
    label: v.color || v.name?.split('-').pop().trim() || 'Mặc định',
    price: v.price,
    href: `/san-pham/${slug}?sku=${v.sku}`,
    slug: v.sku,
    image: v.image || product.primary_image || product.image,
  }));

  const price = parseInt(String(product.price || 0).replace(/\D/g, ''));
  const originalPrice = parseInt(String(product.originalPrice || 0).replace(/\D/g, ''));
  const discount = originalPrice > 0 && price > 0 && price < originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  const related = getRelatedProducts(product, 10);

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans antialiased">
      <Header />

      <main className="mx-auto max-w-[1260px] px-3 py-2 pb-24">
        <Breadcrumbs items={breadcrumbItems} />

        {/* ═══ TOP SECTION: Gallery + Sidebar ═══ */}
        <div className="mt-3 flex flex-col lg:flex-row gap-4 items-start">

          {/* LEFT: Gallery */}
          <div className="w-full lg:w-[58%]">
            <div className="rounded-xl bg-white p-3 sm:p-4 shadow-sm border border-slate-200/60">
              <ProductGallery
                images={gallery.length > 0 ? gallery : ["https://cdn.dienthoaigiakho.vn/photos/1731313707122-Samsung-Galaxy-S25-Ultra-Den.jpg"]}
                alt={product.name}
              />
            </div>
          </div>

          {/* RIGHT: Product Info Sidebar */}
          <div className="w-full lg:w-[42%]">
            <div className="lg:sticky lg:top-4 space-y-4">

              {/* Product Name */}
              <div className="rounded-xl bg-white p-4 sm:p-5 shadow-sm border border-slate-200/60">
                <h1 className="text-[18px] sm:text-[20px] font-extrabold leading-snug text-slate-900">
                  {product.name}
                </h1>
                <div className="mt-2 flex items-center gap-3 text-[13px] text-slate-400">
                  <div className="flex text-amber-400 text-[12px]">★★★★★</div>
                  <span className="font-semibold">(4 đánh giá)</span>
                  <span>|</span>
                  <span className="font-semibold">100+ đã bán</span>
                </div>

                {/* Price Box */}
                <div className="mt-4 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 p-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[26px] sm:text-[28px] font-black text-red-600 tracking-tight">
                      {formatPrice(price || product.price)}
                    </span>
                    {discount > 0 && (
                      <>
                        <span className="text-[14px] text-slate-400 line-through font-semibold">
                          {formatPrice(originalPrice)}
                        </span>
                        <span className="rounded bg-red-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                          -{discount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Variants */}
              {uiVariants.length > 0 && (
                <div className="rounded-xl bg-white p-4 sm:p-5 shadow-sm border border-slate-200/60">
                  <h3 className="text-[13px] font-bold text-slate-700 mb-3">Chọn màu để xem giá và tình trạng hàng</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {uiVariants.map(v => (
                      <Link
                        key={v.slug}
                        href={v.href}
                        className="flex items-center gap-2.5 rounded-lg border-2 border-slate-200 p-2.5 hover:border-red-400 transition-colors bg-white"
                      >
                        <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden bg-slate-50 border border-slate-100">
                          <Image src={v.image} alt={v.label} fill sizes="40px" className="object-contain p-0.5" />
                        </div>
                        <div>
                          <div className="text-[12px] font-bold text-slate-800">{v.label}</div>
                          <div className="text-[13px] font-extrabold text-red-600">{formatPrice(v.price)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Promotions */}
              <PromotionBox promotions={promotions} coupons={coupons} />

              {/* CTA Buttons */}
              <div className="space-y-2.5">
                <button className="w-full h-[52px] rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-bold text-[16px] shadow-md shadow-red-200/50 active:scale-[0.98]">
                  MUA NGAY
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="h-11 rounded-lg bg-sky-600 text-white font-bold text-[12px] hover:bg-sky-700 transition shadow-sm">
                    TRẢ GÓP 0%
                  </button>
                  <button className="h-11 rounded-lg bg-emerald-600 text-white font-bold text-[12px] hover:bg-emerald-700 transition shadow-sm">
                    THU CŨ ĐỔI MỚI
                  </button>
                </div>
                <p className="text-center text-[11px] text-slate-400 font-medium">
                  Gọi <span className="font-bold text-red-600">0899.918.668</span> để được tư vấn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MIDDLE SECTION: Info + Specs ═══ */}
        <div className="mt-4 flex flex-col lg:flex-row gap-4 items-start">

          {/* LEFT: Product Info + Highlights */}
          <div className="w-full lg:w-[58%] space-y-4">
            <ProductInfoBox />

            {/* Featured Highlights */}
            {richSections.length > 0 && (
              <div className="rounded-xl bg-white shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-[16px] sm:text-[18px] font-extrabold text-slate-900 flex items-center gap-3">
                    <span className="h-6 w-1 bg-red-600 rounded-full"></span>
                    Đặc điểm nổi bật
                  </h2>
                </div>

                <div className="p-4 sm:p-6 space-y-8 max-h-[600px] overflow-hidden relative" id="highlights-content">
                  {richSections.map((sec, i) => {
                    const sectionImages = sec.images?.filter(img => img && typeof img === 'string') || [];
                    return (
                      <div key={i} className="space-y-4">
                        {sec.heading && sec.heading !== "Giới thiệu" && (
                          <h3 className="text-[15px] sm:text-[16px] font-extrabold text-slate-800 leading-snug">
                            {sec.heading}
                          </h3>
                        )}
                        {sec.content && (
                          <div className="text-[14px] leading-relaxed text-slate-600 whitespace-pre-wrap">
                            {sec.content}
                          </div>
                        )}
                        {sectionImages.length > 0 && (
                          <div className={`grid gap-3 ${sectionImages.length >= 3 ? 'grid-cols-1 sm:grid-cols-3' : sectionImages.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                            {sectionImages.map((img, idx) => (
                              <div key={idx} className="rounded-lg overflow-hidden border border-slate-100 bg-white">
                                <SmartImage src={img} alt={`${sec.heading} - ${idx}`} className="w-full h-auto object-contain" hideOnError={true} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                </div>

                <div className="p-4 flex justify-center border-t border-slate-100">
                  <button className="flex items-center gap-2 rounded-lg border border-sky-500 bg-white px-8 py-2.5 text-[13px] font-bold text-sky-600 hover:bg-sky-50 transition">
                    Xem thêm
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                </div>
              </div>
            )}

            {/* FAQ */}
            <FAQAccordion faqs={product.faqs} />
          </div>

          {/* RIGHT: Specifications */}
          <div className="w-full lg:w-[42%]">
            <div className="lg:sticky lg:top-4">
              <div className="rounded-xl bg-white shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-[16px] sm:text-[18px] font-extrabold text-slate-900 flex items-center gap-3">
                    <span className="h-6 w-1 bg-sky-600 rounded-full"></span>
                    Thông số kỹ thuật
                  </h2>
                </div>
                <div className="p-3 sm:p-4">
                  <SpecificationsTable technical_specifications={product.technical_specifications} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM: Related Products ═══ */}
        <div className="mt-8">
          <ProductRail title="Sản phẩm tương tự" products={related} />
        </div>
      </main>

      <StickyActionBar product={product} />
      <Footer />
    </div>
  );
}
