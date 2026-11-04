# Dữ liệu đã thay đổi kể từ lần xuất trước chưa?

Ngày kiểm tra: 2026-11-03. Chỉ đọc.

## Kết luận trước, giải thích sau

**Không thể xác minh có thay đổi hay không, và tôi không tạo `database_changes.sql`.**

Lý do: trong dự án hiện tại **không tồn tại bản xuất dữ liệu cũ nào để so sánh**. Thư mục `docs/migration/` chỉ có DDL (`01-schema.sql` — đã kiểm tra, không có câu `INSERT INTO` nào), RLS/policy và tài liệu hướng dẫn. File export "62 bản ghi" mà bạn nhắc tới nằm ngoài dự án này, tôi không đọc được nên không thể đối chiếu nội dung.

Tạo `database_changes.sql` lúc này sẽ chỉ là phỏng đoán — đúng điều bạn yêu cầu không làm.

---

## 1. Số liệu thực tế tại thời điểm kiểm tra

| Bảng | Số dòng | Mốc thời gian mới nhất | Ghi chú |
|---|---|---|---|
| `locations` | 12 | 2026-08-30 05:34 (`updated_at`) | Ổn định gần 3 tháng |
| `heritage_content` | 14 | 2026-08-30 05:39 (`updated_at`) | Ổn định |
| `sellers` | 6 | 2026-09-18 14:00 (`updated_at`) | Ổn định |
| `contributions` | 1 | 2026-09-18 13:38 (`updated_at`) | 1 bản ghi duy nhất |
| `contact_requests` | 1 | 2026-09-18 15:23 (`created_at`) | 1 bản ghi duy nhất |
| `articles` | 9 | **2026-10-21 06:43** (`created_at`) | Bảng **có thể đã đổi** sau lần xuất cũ |
| `heritage_stories` | 9 | **2026-10-21 06:44** (`created_at`) | Bảng **có thể đã đổi** sau lần xuất cũ |
| `favorites` | 0 | — | Trống |
| `messages` | 0 | — | Trống |
| `product_items` | 1 | — | 1 sản phẩm, trạng thái không hoạt động |
| `product_categories` | 1 | — | |
| `product_variants` / `product_skus` / `product_custom_fields` / `product_custom_values` | 0 | — | Trống |
| `order_headers` / `order_items` | 0 | — | Chưa từng phát sinh đơn |
| `auth.users` | 4 | — | Tất cả provider `email`, đã xác thực |
| `storage.objects` | 0 | — | Không có file |

Tổng dữ liệu công khai: **54 dòng** (khớp với `00-README.md` đã lập trước đó trong cùng ngày).

### Hai điểm cần lưu ý về cột thời gian

- `articles` và `heritage_stories` **chỉ có `created_at`, không có `updated_at`**. Vì vậy nếu ai đó sửa nội dung một bài cũ, mốc thời gian sẽ **không đổi** và cách phát hiện duy nhất là so sánh nội dung từng dòng.
- Với 7 bảng còn lại, `updated_at` là công cụ so sánh đáng tin.

---

## 2. Cách xác minh dứt điểm (làm được ngay, ~5 phút)

Chạy các câu dưới đây trong phần Backend của Readdy, hoặc nhờ AI tiếp nhận chạy trên project mới. Mỗi câu trả về một **dấu vân tay** (md5 của toàn bộ nội dung bảng). Nếu dấu vân tay trùng với lần xuất trước thì dữ liệu không đổi.

### 2.1. Dấu vân tay toàn bộ bảng

```sql
-- Chạy cho từng bảng cần kiểm tra
SELECT
  'articles' AS bang,
  count(*) AS so_dong,
  md5(string_agg(md5(to_jsonb(t)::text), '' ORDER BY t.id)) AS dau_van_tay
FROM public.articles t;
```

Lặp lại với `heritage_stories`, `locations`, `sellers`, `heritage_content`, `contributions`, `contact_requests`.

### 2.2. So sánh từng dòng khi cần biết chính xác dòng nào đổi

```sql
SELECT id, slug, md5(to_jsonb(t)::text) AS row_hash, created_at
FROM public.articles t
ORDER BY id;
```

```sql
SELECT id, slug, md5(to_jsonb(t)::text) AS row_hash, created_at
FROM public.heritage_stories t
ORDER BY id;
```

Nếu bạn còn bản xuất cũ: chạy đúng hai câu này trên bản cũ (hoặc trên project Supabase mới sau khi import) rồi so `row_hash` theo `id`. Dòng nào lệch là dòng đã đổi.

### 2.3. Xuất lại toàn bộ nội dung để mang đi (khi cần)

```sql
SELECT jsonb_pretty(jsonb_agg(to_jsonb(t) ORDER BY t.id))
FROM public.articles t;
```

Đổi tên bảng cho từng bảng. Với 9–14 dòng mỗi bảng, kết quả vẫn ở mức đọc và sao chép được. Nếu cần chuyển sang Supabase mới, cách sạch hơn là dùng `INSERT` sinh từ JSON này, không phải chép tay.

---

## 3. Khi nào mới nên tạo `database_changes.sql`

Chỉ tạo khi có **đủ hai** điều kiện:

1. Có bản xuất cũ (file thật, không phải ký ức về số 62).
2. Đã chạy phép so `row_hash` ở 2.2 và biết chính xác những `id` nào khác nhau.

Khi đó file cần chứa:
- `UPDATE` theo `id` cho từng dòng lệch, chỉ rõ cột thay đổi;
- `INSERT` cho dòng mới;
- **không** chứa `DELETE` trừ khi bạn chủ động muốn xoá, và phải ghi rõ.

Nếu bản xuất cũ đã cũ hơn ngày 2026-10-21, giả định an toàn nhất là: **`articles` và `heritage_stories` có thay đổi**. Hãy xuất lại nguyên hai bảng đó thay vì cố tìm phần lệch.

---

## 4. Điều không nằm trong file SQL nào

- Mật khẩu người dùng: không xuất được dưới mọi hình thức.
- Cấu hình Auth (Site URL, redirect, SMTP, template): thuộc panel, xem `auth_config.md`.
- Cấu hình trợ lý AI: thuộc Readdy, xem `readdy_ai_config.md`.
- File trong Storage: 0 object, không có gì để xuất.