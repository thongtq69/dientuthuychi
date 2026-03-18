# Task 8 - QA, Compare, Cutover

Doc truoc: `docs/agent-migration/RULES.md`

## Muc tieu

Doi soat local va Payload, them feature flag cat chuyen, bao dam rollout an toan.

## Scope

- `scripts/compare-local-vs-payload.*`
- `scripts/qa-report.*`
- Config/flags cho `payload-first`, `fallback-local`, `payload-only` neu can

## Viec can lam

1. Tao script compare count local vs Payload.
2. Compare slug, category breakdown, image, specs, variant, banner/page/post count.
3. Tim route nao van doc truc tiep `src/data/*`.
4. Tao co che feature flag cho cutover an toan.
5. Viet checklist rollout va rollback ngan gon.

## Khong duoc lam

- Khong tu y xoa fallback local.
- Khong doi schema/import logic tru khi la fix nho co note ro.

## Ban giao

- Report doi soat.
- Checklist cutover.
- Danh sach risk con lai.

## Cach verify

- Co report chay duoc.
- Co cach bat `payload-first` ma app van on dinh.
- Neu tat Payload/fetch loi, fallback van bao toan luong chinh trong giai doan chuyen tiep.
