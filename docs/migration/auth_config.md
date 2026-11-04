# Cấu hình Authentication cần thiết để đăng nhập tiếp tục chạy

Ngày kiểm tra: 2026-11-03. Tài liệu chỉ mô tả **hành vi thật của mã nguồn** và **những thiết lập phải có**; không chứa email, mật khẩu, token hay khóa bí mật.

---

## 1. Luồng đăng nhập thực tế trong mã nguồn

Đọc trực tiếp từ `src/pages/auth/*` và `src/lib/auth-utils.ts`.

| Chức năng | Cách mã nguồn làm |
|---|---|
| Đăng nhập | `signInWithPassword({ email, password })`, sau đó điều hướng tới `?next=` đã kiểm tra hợp lệ |
| Đăng ký | `signUp({ email, password, options: { emailRedirectTo, data: { full_name } } })` |
| Xác thực email | Màn hình nhập **mã OTP 6 chữ số** → `verifyOtp({ email, token, type: 'signup' })` |
| Gửi lại mã | `resend({ type: 'signup', email, options: { emailRedirectTo } })` |
| Quên mật khẩu | `resetPasswordForEmail(email, { redirectTo })` → nhập OTP → `verifyOtp({ type: 'recovery' })` → `updateUser({ password })` |
| Callback | `exchangeCodeForSession(code)`, nếu phiên là `recovery` thì chuyển `/auth/reset-password` |
| Phiên | `persistSession: true`, `autoRefreshToken: true`, `flowType: 'pkce'`, `detectSessionInUrl: false` |
| Độ dài mật khẩu | Tối thiểu **6 ký tự** (chặn ở phía client) |
| Provider bên ngoài | **Không có**. Không có Google/Facebook/GitHub trong mã nguồn |

Tài khoản hiện tại (đếm từ `auth`, không lấy email): **4 user**, cả 4 đã xác thực email, cả 4 đã từng đăng nhập. Provider duy nhất: `email`.

---

## 2. URL phải khai báo

Mã nguồn tự dựng URL callback:

```
getAuthRedirectUrl() = window.location.origin + BASE_PATH + "/auth/callback"
```

Với base path mặc định `/`, callback là:

```
https://<domain-mới>/auth/callback
```

Khi khôi phục mật khẩu, mã nguồn nối thêm:

```
https://<domain-mới>/auth/callback?next=/auth/reset-password
```

Vì código dùng `__BASE_PATH__`, nếu deploy trên GitHub Pages dưới thư mục con (`https://user.github.io/cham-di-san/`) thì callback thành:

```
https://user.github.io/cham-di-san/auth/callback
```

Phải khai báo **cả hai dạng** (có và không có thư mục con) để tránh gãy khi đổi cách deploy.

### Danh sách cần nhập vào Authentication → URL Configuration

**Site URL**
```
https://<domain-mới>
```

**Redirect URLs** (thêm từng dòng)
```
https://<domain-mới>/auth/callback
https://<domain-mới>/auth/callback?next=/auth/reset-password
https://<domain-mới>/**
https://<domain-mới>/cham-di-san/auth/callback
https://<domain-mới>/cham-di-san/auth/callback?next=/auth/reset-password
```

Nếu thiếu, triệu chứng cụ thể: đăng nhập bằng mật khẩu vẫn được, nhưng email xác thực và email khôi phục mật khẩu sẽ trỏ về domain cũ hoặc bị từ chối.

---

## 3. Những thiết lập phải kiểm tra trong panel Authentication

Không đọc được từ database, nên đây là danh sách **phải mở panel đối chiếu**:

| Thiết lập | Giá trị cần đặt | Vì sao |
|---|---|---|
| Email provider | Bật | Toàn bộ đăng ký/khôi phục dựa vào email |
| Confirm email | **Bật** | Mã nguồn có màn hình nhập OTP sau khi đăng ký; nếu tắt, `signUp` trả session ngay và bỏ qua bước này |
| Mật khẩu tối thiểu | 6 | Khớp kiểm tra phía client |
| **Template email xác thực có `{{ .Token }}`** | **Bắt buộc** | Mã nguồn dùng `verifyOtp` với mã 6 số. Template mặc định chỉ có `{{ .ConfirmationURL }}`, khi đó **không có mã nào trong email** và người dùng không thể xác thực. Phải thêm dòng mã 6 số, ví dụ: `Mã xác nhận của bạn: {{ .Token }}` |
| **Template email khôi phục có `{{ .Token }}`** | **Bắt buộc** | Cùng lý do, cho luồng `type: 'recovery'` |
| Thời hạn OTP | ≥ 10 phút | Mã 6 số hết hạn quá nhanh sẽ gây báo lỗi khó hiểu |
| SMTP riêng | **Nên bật** | SMTP mặc định bị giới hạn số lượng và dễ vào spam. Với website thật, dùng nhà cung cấp riêng (Resend, SendGrid, Gmail SMTP…) |
| JWT expiry | 3600s (mặc định) | Không cần đổi; client có `autoRefreshToken` |
| Refresh token rotation | Bật | Mặc định, phù hợp |
| Providers ngoài | Tắt hết | Mã nguồn không có nút đăng nhập mạng xã hội |

> Điểm dễ sai nhất: **template thiếu `{{ .Token }}`**. Đây là lỗi im lặng — đăng ký "thành công" nhưng email không có mã. Hãy gửi thử một email thật để xác nhận trước khi coi là xong.

---

## 4. Điều kiện để đăng nhập chạy trên domain mới

1. Domain mới phải **HTTPS**. PKCE + cookie/localStorage cần origin ổn định.
2. Domain mới phải nằm trong Redirect URLs (mục 2).
3. `VITE_PUBLIC_SUPABASE_URL` và `VITE_PUBLIC_SUPABASE_ANON_KEY` phải trỏ đúng backend đang có 4 tài khoản.
4. `BASE_PATH` khi build phải khớp đường dẫn thật, nếu không callback sẽ 404 dù domain đã khai báo.
5. Không đổi `flowType` khỏi `pkce` — `/auth/callback` được viết riêng cho luồng code exchange.

---

## 5. Chuyển tài khoản sang Supabase mới: giới hạn thật

| Dữ liệu | Chuyển được? | Cách làm |
|---|---|---|
| Email | Có | `auth.users.email` |
| Trạng thái đã xác thực | Có | `email_confirmed_at` |
| Hash mật khẩu (bcrypt) | Có, có điều kiện | `auth.users.encrypted_password`. Phải import bằng quyền service role trực tiếp vào schema `auth`, **không** dùng API đăng ký thường (sẽ tạo hash mới). Dùng đúng định dạng `$2a$`/`$2b$`, nếu sai người dùng không đăng nhập được và không có thông báo rõ ràng |
| `raw_user_meta_data` (họ tên) | Có | Cột JSONB tương ứng |
| `auth.identities` | Có, phải tạo lại | provider `email`, `provider_id` = user id, `identity_data` chứa email |
| Phiên đăng nhập đang mở | **Không** | Refresh token gắn với cấu hình cũ; mọi người sẽ phải đăng nhập lại một lần |
| Mật khẩu dạng chữ thường | **Không bao giờ** | Không tồn tại ở bất kỳ đâu |
| Tùy chọn: bắt mọi người đặt lại mật khẩu | Có | Đơn giản hơn nhiều so với chuyển hash. Chấp nhận được với 4 tài khoản |

**Khuyến nghị cho 4 tài khoản:** vì chỉ có 4, phương án ít rủi ro nhất là tạo lại tài khoản trên Supabase mới rồi gửi email đặt lại mật khẩu. Chuyển hash bcrypt tiết kiệm một bước nhưng dễ sai định dạng và khó phát hiện.

---

## 6. Checklist kiểm thử sau khi đổi domain (làm thật, không đoán)

- [ ] Đăng ký email mới → nhận được email **có mã 6 số**
- [ ] Nhập mã → vào được trang chủ, không có lỗi
- [ ] Đăng xuất → đăng nhập lại bằng mật khẩu
- [ ] Quên mật khẩu → nhận mã → đặt mật khẩu mới → đăng nhập được
- [ ] Mở email xác thực bằng **điện thoại** (bấm link trực tiếp) → về đúng `/auth/callback` trên domain mới, không phải domain Readdy
- [ ] Tải lại trang khi đang đăng nhập → phiên còn (nhờ `persistSession`)
- [ ] Vào `/account` → dữ liệu yêu thích/tin nhắn đọc được (kiểm tra RLS theo `user_id`)

Nếu bước 1 hoặc 5 gãy: gần như chắc chắn do template thiếu `{{ .Token }}` hoặc domain chưa có trong Redirect URLs.