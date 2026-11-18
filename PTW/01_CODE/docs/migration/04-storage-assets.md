# 04 — Storage và tài sản hình ảnh / âm thanh

## 1. Hiện trạng đã kiểm tra

| Mục | Kết quả thật |
|---|---|
| Bucket | `public` (public = true), `private` (public = false) |
| Số object | **0** ở cả hai bucket |
| Tổng dung lượng | **0 byte** |
| Policy đọc | `storage.objects` SELECT khi `bucket_id = 'public'` cho `anon`, `authenticated` |
| Policy ghi | INSERT khi `bucket_id = 'public'` **và** `'private'` cho `anon`, `authenticated` |
| Policy sửa/xoá | Không có (nên không ai UPDATE/DELETE được object) |

➡️ **Kết luận quan trọng: không có file nào của dự án nằm trong Storage.**
Vì vậy không có gì để "xuất kho" theo nghĩa bucket/object.

## 2. Vậy hình ảnh thật đang ở đâu?

Toàn bộ ảnh trong website là **URL sinh bởi Readdy**, không phải file bạn upload:

| Nguồn dữ liệu | Host | Số dòng |
|---|---|---|
| `locations.image` | `readdy.ai/api/search-image` | 11 |
| `locations.image` | `i.pinimg.com` | 1 |
| `heritage_stories.cover_image` | `readdy.ai/api/search-image` | 8 |
| `heritage_stories.cover_image` | `i.pinimg.com` | 1 |
| `articles.cover_image` | `readdy.ai/api/search-image` | 9 |
| `articles.audio_url` / `heritage_stories.audio_url` | (không có dữ liệu) | 0 |

Tổng: **31 ảnh** tham chiếu ra ngoài, 28 trong số đó thuộc hệ thống sinh ảnh của Readdy.

Đây là điểm quan trọng nhất khi rời nền tảng: **các URL này không phải tài sản số
của bạn trong Storage**, chúng là link CDN do Readdy sinh. Chúng có thể tiếp tục
hoạt động, nhưng bạn không kiểm soát được vòng đời của chúng, và nếu Readdy thay đổi
hoặc giới hạn endpoint thì ảnh sẽ chết trên site mới.

## 3. Phương án đưa ảnh về độc lập (khuyến nghị)

Bước 1 — Tập hợp danh sách URL cần tải (chạy trên backend hiện tại, chỉ đọc):

```sql
SELECT 'locations' AS tbl, id, slug AS ref, image AS url FROM public.locations WHERE image IS NOT NULL
UNION ALL
SELECT 'heritage_stories', id, slug, cover_image FROM public.heritage_stories WHERE cover_image IS NOT NULL
UNION ALL
SELECT 'articles', id, slug, cover_image FROM public.articles WHERE cover_image IS NOT NULL
UNION ALL
SELECT 'sellers', id, name, avatar FROM public.sellers WHERE avatar IS NOT NULL;
```

Bước 2 — Tải file về máy. Có thể dùng script chạy trên máy bạn (không phải trên Readdy):

```bash
# Lưu ý: cần đặt tên file không dấu, không khoảng trắng, chữ thường
mkdir -p assets/locations assets/stories assets/articles assets/sellers
# Với mỗi URL trong danh sách, tải về và đặt tên theo quy ước:
#   assets/locations/<slug>.jpg
#   assets/stories/<slug>.jpg
#   assets/articles/<slug>.jpg
curl -L "<url>" -o assets/locations/<slug>.jpg
```

Bước 3 — Upload lên Supabase Storage của project mới (bucket `public`, thư mục theo
loại: `locations/`, `stories/`, `articles/`, `sellers/`). Quy tắc đặt tên của backend:
1–63 ký tự, chữ thường, không dấu cách, chỉ `a-z 0-9 . _ -`.

Bước 4 — Cập nhật lại cột ảnh bằng URL mới:

```sql
-- Ví dụ mẫu, thay <PROJECT_URL> bằng URL project Supabase mới của bạn
UPDATE public.locations
SET image = '<PROJECT_URL>/storage/v1/object/public/public/locations/' || slug || '.jpg'
WHERE image IS NOT NULL;
```

Bước 5 — Sau khi đã đổi hết URL, rà lại xem còn link `readdy.ai` nào không:

```sql
SELECT count(*) FROM public.locations WHERE image LIKE '%readdy.ai%';
SELECT count(*) FROM public.articles WHERE cover_image LIKE '%readdy.ai%';
SELECT count(*) FROM public.heritage_stories WHERE cover_image LIKE '%readdy.ai%';
```

## 4. Ảnh hard-code trong mã nguồn (đừng bỏ qua)

Ngoài dữ liệu, ảnh còn nằm rải trong code, ví dụ:
`src/pages/about/page.tsx`, `src/pages/artisan/page.tsx`,
`src/pages/auth/components/AuthLayout.tsx`, `src/mocks/locations.ts`.

Cần tìm toàn bộ trong repo sau khi chuyển:

```bash
grep -rn "readdy.ai/api/search-image" src/
```

Mỗi kết quả phải được thay bằng đường dẫn ảnh mới (tải về rồi trỏ vào Storage của
bạn, hoặc để trong `public/` của repo).

## 5. Âm thanh

`articles.audio_url`, `heritage_stories.audio_url`, `heritage_content.audio_url`,
`contributions.audio_path` hiện **không có dữ liệu** (0 dòng có giá trị).
Khi đưa tính năng nghe lên project mới, nên dùng bucket riêng `audio` (private hoặc
public tuỳ chính sách) và trả signed URL khi phát.

## 6. Về policy Storage đang khá mở

Hiện `anon` được INSERT vào bucket `private`. Với project mới nên đặt:

```sql
-- Chỉ người đã đăng nhập mới được ghi vào bucket private, và chỉ trong thư mục của mình
-- (thực hiện ở Storage > Policies trên dashboard Supabase, không sửa bằng SQL tuỳ tiện)
-- Điều kiện: bucket_id = 'private' AND (storage.foldername(name))[1] = auth.uid()::text
```

Bucket `public` giữ nguyên: ai cũng đọc, chỉ service_role ghi.