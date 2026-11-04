# 07 — Thứ tự chuyển nhà từng bước

Làm đúng thứ tự này để không phải làm lại. Thời gian ước tính: 2–4 giờ.

## Giai đoạn 0 — Chuẩn bị (trước khi động vào bất cứ thứ gì)

- [ ] Tạo project Supabase mới, ghi lại URL + anon key + service_role key
      (service_role chỉ lưu nơi an toàn, không vào mã frontend).
- [ ] Xuất file dump dữ liệu gốc từ Readdy (bạn đã có) và **kiểm tra lại số dòng**:
      54 public + 4 auth + 0 object. Ban dump cu co 62 dong: 54 public + 4 auth.users + 4 auth.identities.
      Hai bucket storage khong phai dong du lieu duoc xuat.
- [ ] Chép tay cấu hình Auth vào một tệp ghi chú riêng (không gửi qua chat).
- [ ] Chép tay prompt trợ lý AI nếu muốn giữ.

## Giai đoạn 1 — Dựng cấu trúc (15 phút)

- [ ] Chạy `01-schema.sql` trên SQL Editor của project mới.
- [ ] Kiểm tra: `SELECT table_name FROM information_schema.tables WHERE table_schema='public';`
      phải trả về 17 bảng.
- [ ] Chạy `02-rls-grants.sql` **mục 1 và 2** (bật RLS + policy gốc).
      Chưa chạy mục 4.

## Giai đoạn 2 — Nạp dữ liệu (30–60 phút)

- [ ] Import theo đúng thứ tự trong `03-restore-guide.md` mục 1.
- [ ] Nếu import có kèm id: chạy toàn bộ khối `setval` trong `03` mục 3.
- [ ] Chạy lại `product_items` sequence về `100033` nếu muốn giữ quy ước id.
- [ ] Chạy các câu đếm và kiểm tra mồ côi trong `03` mục 4.
- [ ] Nhập riêng 1 dòng `contributions` và 1 dòng `contact_requests`
      (chứa dữ liệu cá nhân — nhập trực tiếp, không qua kênh khác).

## Giai đoạn 3 — Siết bảo mật (10 phút) ⚠️ Đừng bỏ qua

- [ ] Chạy `02-rls-grants.sql` mục 4 (4.1 → 4.7).
- [ ] Kiểm tra bằng anon key rằng `contributions` và `contact_requests`
      **không** đọc được.
- [ ] Kiểm tra anon không sửa được `order_headers`.

## Giai đoạn 4 — Tài sản hình ảnh (45–90 phút)

- [ ] Lay danh sach 45 URL duy nhat trong `assets_manifest.json` (57 vi tri tham chieu).
- [ ] Tải về, đặt tên chuẩn hoá, upload lên bucket `public` của project mới.
- [ ] Cập nhật cột `image`, `cover_image`, `avatar` bằng URL mới.
- [ ] Chạy lại các câu `LIKE '%readdy.ai%'` — phải ra 0.
- [ ] Thay ảnh hard-code trong `src/` (`grep -rn "readdy.ai/api/search-image" src/`).
- [ ] Chạy lại `LIKE '%i.pinimg.com%'` — 2 ảnh pinimg cũng nên tải về để không
      phụ thuộc Pinterest.

## Giai đoạn 5 — Tài khoản (30 phút)

- [ ] Cấu hình Site URL + Redirect URLs trên project mới.
- [ ] Cấu hình SMTP riêng (Resend/SendGrid) và gửi thử 1 email test.
- [ ] Migrate 4 user (xem `05` mục 2) hoặc tạo lại + gửi email đặt lại mật khẩu.
- [ ] Chỉnh mẫu email tiếng Việt cho khớp nội dung website.
- [ ] Test: đăng ký → xác thực → đăng nhập → quên mật khẩu → đăng xuất.

## Giai đoạn 6 — Chỉnh mã nguồn (30 phút)

- [ ] Cập nhật `VITE_PUBLIC_SUPABASE_URL` và `VITE_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Rà lại mọi chỗ còn gọi endpoint cũ của Readdy.
- [ ] Rà ảnh và font tải từ CDN Readdy (xem `index.html`).
- [ ] Xử lý trợ lý AI: giữ script Readdy, hoặc thay bằng giải pháp khác (`06` mục 2).
- [ ] Nếu có CSP trong `index.html` / `index.css`, cập nhật domain mới vào đúng
      directive, nếu không script và ảnh sẽ bị chặn.

## Giai đoạn 7 — Deploy & kiểm thử (30 phút)

- [ ] Deploy (Vercel/Netlify/Cloudflare) với rewrite về `index.html`.
- [ ] Test 8 luồng chính: trang chủ, danh sách địa danh, chi tiết địa danh,
      bài viết, câu chuyện di sản, danh sách nghệ nhân, gửi đóng góp, gửi liên hệ.
- [ ] Test trên điện thoại thật (không chỉ thu nhỏ cửa sổ trình duyệt).
- [ ] Đo tốc độ: Lighthouse mobile; kiểm tra ảnh có bị chậm do dung lượng lớn.

## Giai đoạn 8 — Chuyển domain (15 phút)

- [ ] Trỏ DNS về host mới.
- [ ] Xác nhận SSL hoạt động.
- [ ] Thêm domain mới vào Redirect URLs (nếu quên, đăng nhập email sẽ lỗi).
- [ ] Theo dõi 24–48 giờ, sau đó mới để project Readdy cũ hết hạn.

---

## Ba lỗi hay gặp nhất khi làm theo gói này

1. **Quên `setval`** → import xong tưởng ổn, đến lần thêm bài viết mới thì báo
   trùng khóa chính. Xử lý ở `03` mục 3.
2. **Quên đổi ảnh trong code** → dữ liệu đã đổi URL nhưng trang chủ / trang giới thiệu
   vẫn trỏ `readdy.ai`, sau vài tháng ảnh mất mà không rõ nguyên nhân. Xử lý ở `04` mục 4.
3. **Chạy bản vá mục 4 trước khi import** → mất quyền ghi, import bị chặn giữa đường.
   Luôn import xong rồi mới siết bảo mật.