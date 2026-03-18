# Task 4 - Pages, Posts, Globals Migration

Doc truoc: `docs/agent-migration/RULES.md`

## Muc tieu

Chuyen content page, blog va global settings dang hard code sang Payload.

## Scope

- `scripts/import-pages.*`
- `scripts/import-posts.*`
- `scripts/import-globals.*`
- Helper mapping content trong `scripts/lib/*`

## Nguon du lieu

- `pages-json/**/*`
- Blog/page data local trong `src/data/*`
- Header/footer/site info dang hard code trong project

## Viec can lam

1. Migrate pages vao collection `pages`.
2. Migrate blog vao collection `posts`.
3. Migrate settings/promotion/site meta vao globals.
4. Giu slug, SEO fields va cac noi dung quan trong.
5. Tao report count va danh sach slug da import.

## Khong duoc lam

- Khong doi frontend route rendering.
- Khong sua service layer cua Task 5 tru khi da thong nhat.

## Ban giao

- Import scripts cho pages/posts/globals.
- Mapping note cho block/seo field.
- Danh sach content nao chua migrate duoc neu co.

## Cach verify

- Collection/global co du record mau.
- Slug va SEO data con nguyen ven.
