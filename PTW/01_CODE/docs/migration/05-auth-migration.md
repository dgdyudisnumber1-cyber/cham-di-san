# 05 — Chuyển phần đăng nhập / tài khoản

## 1. Hiện trạng đã kiểm tra

| Mục | Kết quả thật |
|---|---|
| Số tài khoản | 4 |
| Đã xác thực email | 4 / 4 |
| Chưa xác thực | 0 |
| Provider | `email` (100%, không có Google/Facebook) |
| Hash mật khẩu | Không thể đọc, không thể xuất bằng bất kỳ câu SQL nào |

Mật khẩu được lưu dưới dạng hash có muối trong `auth.users.encrypted_password`.
Đây là dữ liệu mà **không công cụ nào đọc ra được**, kể cả admin. Vì vậy không có
"tệp mật khẩu" để bàn giao — điều này là bình thường và đúng thiết kế bảo mật.

## 2. Ba lựa chọn khi chuyển

### Lựa chọn A — Giữ nguyên mật khẩu (nên làm nếu chuyển sang Supabase)
Supabase có công cụ chính thức chuyển user kèm hash, người dùng **không phải đổi mật khẩu**.

1. Panel Readdy → Backend → Authentication, kiểm tra mục export/migrate users.
2. Xuất tệp gồm các trường: `id, email, encrypted_password, email_confirmed_at,
   created_at, raw_user_meta_data, raw_app_meta_data, aud, role`.
3. Trên Supabase mới: Authentication → Users → **Migrate users** (hoặc công cụ
   migration chính thức), chọn đúng định dạng hash của Supabase.
4. Chỉ sau khi migrate xong mới được tạo user mới, để tránh trùng email.

Nếu bạn không tìm thấy công cụ migrate: dùng script Python chạy trên máy bạn với
`service_role` key của project **mới**, gọi Admin API `createUser` cho từng tài khoản
với `email_confirm: true`. Cách này gửi email đặt lại mật khẩu cho 4 người — chấp nhận
được vì chỉ có 4 tài khoản.

### Lựa chọn B — Giữ người dùng nhưng buộc đặt lại mật khẩu
Tạo lại 4 tài khoản với email đã xác thực, rồi gửi email "đặt lại mật khẩu".
Đơn giản, ít rủi ro kỹ thuật, nhưng 4 người phải thao tác một lần.

### Lựa chọn C — Bỏ toàn bộ tài khoản cũ
Chỉ hợp lý nếu 4 tài khoản đều là tài khoản thử nghiệm của chính bạn.

## 3. Cấu hình Auth — phải chép tay

Các mục sau **không nằm trong database**, không đọc được qua SQL, phải mở panel
Authentication của Readdy và đối chiếu từng dòng rồi nhập lại vào Supabase:

- [ ] Site URL
- [ ] Redirect URLs (danh sách đầy đủ, có cả domain tạm và domain thật)
- [ ] Bật/tắt xác thực email (hiện 4/4 đã xác thực, nhiều khả năng đang bật)
- [ ] Độ dài mật khẩu tối thiểu
- [ ] JWT expiry
- [ ] Refresh token rotation
- [ ] SMTP: host, port, user, mật khẩu, tên người gửi, email người gửi
      → Nếu đang dùng SMTP mặc định của Readdy thì **bắt buộc** phải cấu hình SMTP
      riêng (Resend / SendGrid / Gmail app password) trước khi go-live, nếu không
      email xác thực và email đặt lại mật khẩu sẽ không gửi được.
- [ ] Mẫu email: xác nhận đăng ký, đặt lại mật khẩu, mời, đổi email

## 4. Đối chiếu mã nguồn sau khi chuyển

Các tệp có liên quan trực tiếp tới auth trong dự án:

```
src/pages/auth/page.tsx
src/pages/auth/components/AuthLayout.tsx
src/pages/auth/components/LoginForm.tsx
src/pages/auth/components/RegisterForm.tsx
src/pages/auth/components/AuthSidePanel.tsx
src/hooks/useAuth.ts              (nếu có logic session/profile)
.env                              (VITE_PUBLIC_SUPABASE_URL, VITE_PUBLIC_SUPABASE_ANON_KEY)
```

Việc cần làm:
1. Đổi `VITE_PUBLIC_SUPABASE_URL` và `VITE_PUBLIC_SUPABASE_ANON_KEY` sang project mới.
2. Cập nhật danh sách Redirect URL cho đúng domain mới.
3. Kiểm tra luồng `signUp` → xác thực email → `signIn`.
4. Kiểm tra `onAuthStateChange` chỉ cập nhật state, không `await` truy vấn bảng
   trong callback (nếu `await` dễ gây treo trang).
5. Test lại: đăng ký mới, đăng nhập, đăng xuất, quên mật khẩu, refresh trang khi
   đang đăng nhập.

## 5. Rủi ro cần biết

- Nếu đổi `VITE_PUBLIC_SUPABASE_ANON_KEY` mà quên đổi URL (hoặc ngược lại), toàn bộ
  truy vấn dữ liệu sẽ trả về rỗng chứ không báo lỗi rõ ràng.
- 4 tài khoản hiện tại có `user_id` chưa xuất hiện trong `favorites` và `messages`
  (0 dòng), nên rủi ro mồ côi dữ liệu khi đổi `user.id` là **rất thấp**.