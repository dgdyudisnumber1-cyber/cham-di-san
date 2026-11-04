# 06 — Trợ lý AI, Edge Functions, biến môi trường

## 1. Edge Functions: không có

Danh sách function của project đang **rỗng**. Không có function nào cần chuyển,
không có secret nghiệp vụ nào đang lưu trong function.

Lưu ý: khái niệm thanh toán (Stripe / Toss / PayPal / Square / Shopify) hiện **chưa
kết nối** — không có webhook, không có secret. Khi sang project mới mà vẫn muốn bán
hàng, phải cấu hình lại từ đầu.

## 2. Trợ lý AI (Built-in Agent) — thuộc Readdy, không xuất được

Cấu hình trợ lý AI (project, prompt hệ thống, giọng nói, knowledge base, giao diện
widget) nằm trong Readdy, không nằm trong database nên **không thể xuất thành tệp**.

Thứ duy nhất nằm trong mã nguồn là tham số nhúng. Kiểm tra tại:

```
index.html   → thẻ script nhúng agent (projectId)
src/         → grep "vapi" / "agent" / "projectId"
```

```bash
grep -rn "vapi\|projectId\|agent" src/ index.html
```

### Ba hướng khi rời Readdy

| Hướng | Việc phải làm | Đánh đổi |
|---|---|---|
| Giữ agent Readdy | Giữ nguyên script nhúng, chỉ đổi nơi host site | Vẫn phụ thuộc Readdy cho phần trợ lý |
| Dựng agent riêng (Vapi/Retell + LLM) | Tạo assistant mới, viết lại prompt từ đầu, nối knowledge base với dữ liệu trong Supabase | Tốn công, nhưng độc lập hoàn toàn |
| Bỏ trợ lý AI | Xoá script, thay bằng form liên hệ / Zalo / Messenger | Nhanh, mất tính năng |

Prompt hệ thống hiện tại **không** đọc được từ môi trường này. Nếu cần giữ nội dung
tương đương, phải chép tay từ panel Built-in Agent trước khi huỷ project.

## 3. Biến môi trường

Hiện có trong `.env` của dự án:

```
VITE_PUBLIC_SUPABASE_URL      → URL backend hiện tại
VITE_PUBLIC_SUPABASE_ANON_KEY → anon key hiện tại
```

Khi chuyển sang project Supabase riêng, chỉ cần thay đúng 2 biến trên bằng giá trị
của project mới (Project Settings → API). Không thêm biến lạ.

Quy tắc an toàn:
- Chỉ biến có tiền tố `VITE_PUBLIC_` mới được nhúng vào trình duyệt.
- `service_role` key **tuyệt đối không** đặt trong `.env` của frontend; chỉ dùng
  trong Edge Function (server side).
- Anon key là khoá công khai, nhưng an toàn dữ liệu phụ thuộc 100% vào RLS — xem
  `02-rls-grants.sql` mục 4.

## 4. Những thành phần thuộc nền tảng, phải thay thế khi rời đi

| Thành phần | Đang dùng | Cần làm |
|---|---|---|
| Biểu mẫu liên hệ / newsletter | Form của Readdy (nếu có) | Tạo bảng `contact_requests` (đã có) hoặc dùng Resend/Formspree |
| Lịch hẹn | Chưa cấu hình | Tự dựng hoặc dùng Cal.com |
| Email giao dịch | Chưa cấu hình SMTP | Resend / SendGrid + SMTP của Supabase |
| Phân tích truy cập | Analytics của Readdy | Google Analytics / Plausible |
| Tên miền & SSL | Do Readdy quản lý | Trỏ DNS về host mới, cấp lại SSL |
| Xuất bản | Nút Publish của Readdy | Vercel / Netlify / Cloudflare Pages |

### Ghi chú kỹ thuật khi tự host
Dự án là Vite + React (SPA). Khi deploy, cần cấu hình rewrite mọi đường dẫn về
`index.html`, nếu không các trang như `/locations/<slug>` sẽ 404 khi tải trực tiếp.

Ví dụ với Netlify (`_redirects`):
```
/*  /index.html  200
```
Ví dụ với Nginx:
```
location / { try_files $uri $uri/ /index.html; }
```

## 5. Checklist trước khi tắt project cũ

- [ ] Đã xuất đủ 54 dòng dữ liệu public + 4 tài khoản
- [ ] Đã tải về 31 ảnh và thay hết link `readdy.ai` trong dữ liệu **và** trong code
- [ ] Đã chép tay cấu hình Auth (Site URL, Redirect, SMTP)
- [ ] Đã chép tay prompt trợ lý AI (nếu muốn giữ)
- [ ] Đã chạy bản vá bảo mật ở `02-rls-grants.sql` mục 4
- [ ] Đã test đăng nhập, gửi đóng góp, gửi liên hệ trên bản mới
- [ ] Đã trỏ domain và xác nhận SSL
- [ ] Chỉ sau đó mới huỷ / để hết hạn project Readdy cũ