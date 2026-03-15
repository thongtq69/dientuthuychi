DIENTHOAIGIAKHO PRODUCT PAGE DATA README

Muc dich
- File nay giai thich cho agent khac biet du lieu nao can mo neu muon thiet ke lai trang chi tiet san pham cua `dienthoaigiakho.vn`.
- Day la README danh rieng cho PRODUCT DETAIL PAGE, khong phai cho catalog chung.

THU MUC QUAN TRONG NHAT
- `data/dienthoaigiakho_full_output/pages/`
  - Moi file JSON trong thu muc nay la 1 trang da crawl.
  - Bao gom ca trang chi tiet san pham, trang danh muc, trang noi dung, trang homepage.
  - Neu can dung lai UI trang chi tiet san pham, day la nguon du lieu goc quan trong nhat.

- `data/dienthoaigiakho_full_output/pages.csv`
  - File index de map `url` -> `page_json`.
  - Dung de tim file JSON tu URL san pham goc.

- `data/dienthoaigiakho_full_output/pages.jsonl`
  - Toan bo page gop chung theo dang JSON Lines.
  - Hop cho pipeline xu ly hang loat, nhung neu agent can doc ky 1 san pham thi nen mo truc tiep file trong `pages/`.

- `data/dienthoaigiakho_full_output/images/`
  - Thu muc chua anh da tai ve local.

- `data/dienthoaigiakho_full_output/images_index.csv`
  - Map giua `page_url`, `image_url` va file local.
  - Dung khi muon lien ket anh tren trang voi file local phuc vu clone.

CAU TRUC 1 FILE SAN PHAM
- Vi du: `data/dienthoaigiakho_full_output/pages/iphone-15-pro-128gb-activated-1729590048.json`

Ben trong 1 file san pham thuong co cac truong sau:
- `url`
  - URL goc cua trang san pham.

- `status_code`
  - Ma HTTP khi crawl.

- `title`
  - Tieu de SEO/page title.

- `h1`
  - Tieu de hien thi chinh tren trang san pham.

- `meta_description`
  - Mo ta SEO.

- `canonical`
  - Canonical URL.

- `text`
  - Toan bo noi dung text boc tach tu trang.
  - Day la noi quan trong nhat neu can lay noi dung de clone trang chi tiet san pham.
  - Trong `text` co the chua:
    - ten san pham
    - gia hien tai
    - gia goc
    - uu dai
    - mo ta dai
    - dac diem noi bat
    - cau hoi thuong gap
    - bang thong so ky thuat
    - thong tin pin, man hinh, camera, chip, ket noi, kich thuoc, trong luong
  - Luu y: hien tai thong tin nay dang o dang text tho, chua parse thanh field JSON rieng.

- `images`
  - Danh sach tat ca image URL tim thay trong trang.
  - Bao gom:
    - anh san pham
    - anh gallery
    - icon SVG
    - sub-banner
    - anh thong tin/noi dung
  - Neu clone gallery san pham thi can loc chon them, khong nen dung toan bo array nay mot cach may moc.

- `structured_data`
  - Danh sach chuoi JSON-LD lay tu trang.
  - Day la nguon quan trong nhat cho du lieu co cau truc.
  - Thuong co:
    - `ProductGroup`
    - `Product`
    - `BreadcrumbList`
    - `FAQPage`

THONG TIN NAO NAM O DAU

1) BIEN THE / VARIANT
- Nam chu yeu trong `structured_data`.
- Can tim object `@type = ProductGroup`.
- Trong do, `hasVariant` thuong chua:
  - `sku`
  - `name`
  - `color`
  - `image`
  - `offers.price`
  - `offers.availability`
  - `offers.itemCondition`

2) ANH SAN PHAM
- Nam trong:
  - `structured_data.hasVariant[].image`
  - `images`
- Neu can anh chuan theo bien the, uu tien lay tu `structured_data` truoc.

3) NOI DUNG CHI TIET / DAI
- Nam trong `text`.
- Day la noi co the thay cac khoi nhu:
  - `Đặc điểm nổi bật`
  - doan mo ta marketing
  - bang gia
  - giai thich tung tinh nang
  - FAQ
  - thong so ky thuat

4) THONG SO KY THUAT
- Hien tai chu yeu nam trong `text`.
- Chua duoc tach thanh cac field rieng nhu:
  - `display`
  - `rearCamera`
  - `frontCamera`
  - `cpu`
  - `storage`
  - `battery`
  - `design`
  - `connectivity`
- Neu can clone trang chi tiet dung chuan, agent se phai parse lai `text` de tach thong so.

5) FAQ
- Thuong nam trong `structured_data` voi `@type = FAQPage`.
- Neu co, day la nguon de render block hoi dap rat tot.

6) BREADCRUMB
- Nam trong `structured_data` voi `@type = BreadcrumbList`.

FILE NEN MO TRUOC KHI THIET KE LAI TRANG SAN PHAM
- B1: mo `data/dienthoaigiakho_full_output/pages.csv`
  - tim URL san pham can dung.

- B2: mo file JSON tuong ung trong `data/dienthoaigiakho_full_output/pages/`
  - doc `h1`, `text`, `images`, `structured_data`.

- B3: neu can anh local
  - mo `data/dienthoaigiakho_full_output/images_index.csv`
  - doi chieu `page_url` va `image_url`.

VI DU THUC TE
- File: `data/dienthoaigiakho_full_output/pages/iphone-15-pro-128gb-activated-1729590048.json`
- Trong file do:
  - `structured_data` cho biet cac mau Titan, SKU, gia, tinh trang hang
  - `text` chua mo ta dai, uu dai, FAQ, noi dung gioi thieu va cac thong tin bo sung
  - `images` chua gallery, anh noi dung, sub-banner, icon

NHUNG GI DATA HIEN CHUA CO SAN O DANG CHUAN
- Khong co HTML goc cua tung trang.
- Khong co DOM tree goc.
- Khong co CSS/component structure.
- Khong co `specifications.json` rieng cho tung san pham.
- Nghia la du lieu noi dung da co, nhung agent van can parse va tai cau truc lai de clone frontend dep va chuan.

KHUYEN NGHI CHO AGENT MUON CLONE PRODUCT PAGE
- Khong dung file catalog rut gon de dung trang chi tiet.
- Uu tien dung file trong `data/dienthoaigiakho_full_output/pages/`.
- Lay variant/gia/sku tu `structured_data`.
- Lay noi dung dai va thong so tu `text`.
- Lay gallery tu `structured_data.image` ket hop `images`.
- Neu can UI chuan hon, nen tao them mot lop transform JSON trung gian gom:
  - `basicInfo`
  - `variants`
  - `gallery`
  - `highlights`
  - `longDescription`
  - `faq`
  - `specifications`

KET LUAN
- Neu hoi "du lieu chi tiet tung san pham nam o dau?" thi cau tra loi ngan gon la:
  - `data/dienthoaigiakho_full_output/pages/*.json`
- Neu hoi "variant, gia, sku nam o dau?" thi:
  - `structured_data`
- Neu hoi "mo ta dai, dac diem noi bat, thong so ky thuat nam o dau?" thi:
  - `text`
