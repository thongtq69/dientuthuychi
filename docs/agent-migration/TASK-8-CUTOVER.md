# Task 8 Cutover Checklist

## Feature flag

- Server env: `PAYLOAD_DATA_MODE`
- Client env: `NEXT_PUBLIC_PAYLOAD_DATA_MODE`
- Supported values:
  - `fallback-local`: local data la nguon chinh, dung khi Task 5/6/7 chua cat xong.
  - `payload-first`: uu tien Payload, neu fetch loi thi fallback local.
  - `payload-only`: chi doc Payload, khong fallback local.

Mac dinh hien tai nen giu `fallback-local` cho den khi cac route public da di qua data layer chung.

## Rollout

1. Chay `npm run compare:payload` de doi soat count, slug, category breakdown, image/specs/variant parity.
2. Chay `npm run qa:report` de xem route nao con doc truc tiep `src/data/*`.
3. Chi bat `payload-first` sau khi cac mismatch quan trong duoc giai quyet hoac da co note chap nhan risk.
4. Smoke test cac route: `/`, `/danh-muc/dien-thoai`, `/san-pham/[slug]`, `/tin-tuc`, `/tin-tuc/[slug]`, `/thu-cu-doi-moi`, `/he-thong-cua-hang`.
5. Theo doi fetch loi, record count, va media mapping sau rollout.
6. Chi can nhac `payload-only` khi compare report sach va route audit khong con dependency truc tiep vao `src/data/*`.

## Rollback

1. Dat lai `PAYLOAD_DATA_MODE=fallback-local` va `NEXT_PUBLIC_PAYLOAD_DATA_MODE=fallback-local`.
2. Redeploy hoac restart app de dong bo mode moi.
3. Chay lai `npm run qa:report` va `npm run compare:payload` de ghi nhan trang thai sau rollback.
4. Khong xoa fallback local trong giai doan nay; fix du lieu/import/service layer truoc roi moi thu cutover lai.

## Risk con lai

- Task 2 van blocked nen compare products co the chenh count hoac thieu image/gallery mapping trong Payload.
- Task 4 chua import pages/posts/globals nen count pages/posts se chua khop local.
- Nhieu route public van import `@/data/siteData`, nen `payload-only` hien tai chua an toan.
