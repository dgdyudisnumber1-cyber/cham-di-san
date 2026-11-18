# 03 — Khôi phục dữ liệu: thứ tự, sequence, khóa ngoại

Mục tiêu: dựng lại toàn bộ dữ liệu trên Supabase mới mà không vỡ khóa ngoại
và không hỏng sequence.

## 1. Thứ tự nhập (bắt buộc theo đúng thứ tự này)

```
1. locations                 ← không phụ thuộc ai
2. product_categories        ← không phụ thuộc ai
3. product_custom_fields     ← không phụ thuộc ai
4. heritage_content          → locations
5. sellers                   → locations
6. articles                  → locations
7. heritage_stories          → locations
8. contributions             → locations
9. contact_requests          → (seller_id không có FK, nhưng nên sau sellers)
10. product_items            → product_categories
11. product_variants         → product_items
12. product_skus             → product_items
13. product_custom_values    → product_items + product_custom_fields
14. order_headers            ← không phụ thuộc ai
15. order_items              → order_headers
16. favorites                → auth.users (user_id)
17. messages                 → auth.users (user_id)
```

Hai bảng cuối có `user_id` tham chiếu logic tới `auth.users`, **không có FK vật lý**
trong hệ thống hiện tại. Vì vậy hiện tại chúng vẫn import được kể cả khi chưa có user
(hệ thống đang có 0 dòng ở cả hai). Nếu bạn muốn chặt chẽ hơn ở project mới:

```sql
ALTER TABLE public.favorites
  ADD CONSTRAINT favorites_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

Chỉ thêm sau khi đã chuyển xong user, nếu không sẽ bị chặn.

## 2. Bật/tắt kiểm tra khóa ngoại khi import

Nếu bạn đã có file data.sql chứa đúng thứ tự trên, chạy thẳng.
Nếu thứ tự trong file không chắc, bọc lại:

```sql
BEGIN;
SET session_replication_role = replica;  -- tắt trigger kiểm tra FK (chỉ superuser/service)
-- \i data.sql
COMMIT;
SET session_replication_role = origin;
```

Chỉ dùng cách này khi thật sự cần. Cách sạch nhất vẫn là nhập đúng thứ tự ở mục 1.

## 3. Sequence — bước dễ sai nhất

Sau khi import dữ liệu **có kèm id cụ thể**, sequence vẫn đang ở 1. Lần insert tiếp
theo sẽ báo `duplicate key value violates unique constraint`.

Chạy đoạn sau trên project mới để đồng bộ sequence với dữ liệu thực tế
(an toàn, chỉ đọc max(id)):

```sql
SELECT setval(pg_get_serial_sequence('public.locations', 'id'),
              COALESCE((SELECT MAX(id) FROM public.locations), 1));
SELECT setval(pg_get_serial_sequence('public.heritage_content', 'id'),
              COALESCE((SELECT MAX(id) FROM public.heritage_content), 1));
SELECT setval(pg_get_serial_sequence('public.articles', 'id'),
              COALESCE((SELECT MAX(id) FROM public.articles), 1));
SELECT setval(pg_get_serial_sequence('public.heritage_stories', 'id'),
              COALESCE((SELECT MAX(id) FROM public.heritage_stories), 1));
SELECT setval(pg_get_serial_sequence('public.sellers', 'id'),
              COALESCE((SELECT MAX(id) FROM public.sellers), 1));
SELECT setval(pg_get_serial_sequence('public.contributions', 'id'),
              COALESCE((SELECT MAX(id) FROM public.contributions), 1));
SELECT setval(pg_get_serial_sequence('public.contact_requests', 'id'),
              COALESCE((SELECT MAX(id) FROM public.contact_requests), 1));
SELECT setval(pg_get_serial_sequence('public.messages', 'id'),
              COALESCE((SELECT MAX(id) FROM public.messages), 1));
SELECT setval(pg_get_serial_sequence('public.favorites', 'id'),
              COALESCE((SELECT MAX(id) FROM public.favorites), 1));
SELECT setval(pg_get_serial_sequence('public.product_categories', 'id'),
              COALESCE((SELECT MAX(id) FROM public.product_categories), 1));
SELECT setval(pg_get_serial_sequence('public.product_items', 'id'),
              COALESCE((SELECT MAX(id) FROM public.product_items), 1));
SELECT setval(pg_get_serial_sequence('public.product_variants', 'id'),
              COALESCE((SELECT MAX(id) FROM public.product_variants), 1));
SELECT setval(pg_get_serial_sequence('public.product_skus', 'id'),
              COALESCE((SELECT MAX(id) FROM public.product_skus), 1));
SELECT setval(pg_get_serial_sequence('public.product_custom_fields', 'id'),
              COALESCE((SELECT MAX(id) FROM public.product_custom_fields), 1));
SELECT setval(pg_get_serial_sequence('public.product_custom_values', 'id'),
              COALESCE((SELECT MAX(id) FROM public.product_custom_values), 1));
SELECT setval(pg_get_serial_sequence('public.order_headers', 'id'),
              COALESCE((SELECT MAX(id) FROM public.order_headers), 1));
SELECT setval(pg_get_serial_sequence('public.order_items', 'id'),
              COALESCE((SELECT MAX(id) FROM public.order_items), 1));
```

Với bảng `product_items`, hệ thống gốc khởi tạo id từ 100000
(sequence đang ở 100032). Nếu muốn giữ quy ước đó:

```sql
ALTER SEQUENCE public.product_items_id_seq RESTART WITH 100033;
```

## 4. Kiểm tra sau khi import

```sql
-- Đếm lại, phải khớp bảng số liệu trong 00-README.md
SELECT 'locations' t, count(*) FROM public.locations
UNION ALL SELECT 'heritage_content', count(*) FROM public.heritage_content
UNION ALL SELECT 'articles', count(*) FROM public.articles
UNION ALL SELECT 'heritage_stories', count(*) FROM public.heritage_stories
UNION ALL SELECT 'sellers', count(*) FROM public.sellers
UNION ALL SELECT 'contributions', count(*) FROM public.contributions
UNION ALL SELECT 'contact_requests', count(*) FROM public.contact_requests
UNION ALL SELECT 'product_categories', count(*) FROM public.product_categories
UNION ALL SELECT 'product_items', count(*) FROM public.product_items
UNION ALL SELECT 'auth_users', count(*) FROM auth.users;

-- Kiểm tra mồ côi (phải trả về 0 dòng)
SELECT a.id FROM public.articles a
LEFT JOIN public.locations l ON l.id = a.location_id
WHERE a.location_id IS NOT NULL AND l.id IS NULL;

SELECT h.id FROM public.heritage_content h
LEFT JOIN public.locations l ON l.id = h.location_id WHERE l.id IS NULL;
```

## 5. Về dữ liệu nhạy cảm

Hai bảng dưới đây chứa thông tin cá nhân thật, hiện mỗi bảng có 1 dòng:

- `contributions`: có `contributor_name`, `email`, `phone`
- `contact_requests`: có `name`, `phone`, `email`, `message`

Tôi **không** đưa nội dung hai dòng này vào bất kỳ tệp nào ở đây. Khi chuyển, hãy
xuất riêng hai bảng này từ file dump gốc của bạn và nhập trực tiếp vào project mới,
không gửi qua chat hay kênh không mã hoá. Sau khi nhập xong, chạy mục 4.1 và 4.2
trong `02-rls-grants.sql` để chúng không còn bị đọc công khai.