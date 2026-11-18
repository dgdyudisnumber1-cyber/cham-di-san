# Backend hiện tại có dùng được từ frontend ngoài Readdy không?

Ngày kiểm tra: 2026-11-03. Chỉ đọc, không thay đổi gì trên hệ thống.

Tài liệu này **không khẳng định** Backend chạy được hay không chạy được bên ngoài Readdy, vì môi trường kiểm tra không gửi được request HTTP ra ngoài. Những gì dưới đây chia rõ 4 mức: đã xác minh / chưa xác minh / không được hỗ trợ / phải hỏi Readdy.

---

## 1. Backend đang là gì

| Thành phần | Giá trị thực tế |
|---|---|
| Loại | Readdy Backend quản lý (không phải project Supabase do bạn tự tạo) |
| Địa chỉ API | đọc từ `VITE_PUBLIC_SUPABASE_URL` trong `.env` — host dạng `https://<mã>.<...>.helloreaddy.com/` |
| Khóa phía client | `VITE_PUBLIC_SUPABASE_ANON_KEY`, tiền tố `sb_publishable_` — đây là khóa **công khai**, thiết kế để nhúng vào frontend |
| Thư viện dùng | `@supabase/supabase-js`, khởi tạo một lần trong `src/lib/supabase.ts` |
| Bảng dữ liệu | 17 bảng trong schema `public` |
| Edge Functions | **0** — không có function nào |
| Storage | 2 bucket (`public`, `private`), **0 object**, mã nguồn **không** upload file |
| Bí mật máy chủ | Không có. Không có khóa dịch vụ nào được dùng trong dự án |

Hệ quả quan trọng: **toàn bộ chức năng dữ liệu của website chỉ là đọc/ghi bảng qua REST API + Authentication.** Không có logic máy chủ riêng, không có webhook, không có thanh toán, không có gửi email. Đây là dạng phụ thuộc backend nhẹ nhất có thể, nên khả năng chuyển đi cũng cao nhất.

---

## 2. Đã xác minh

| Nội dung | Bằng chứng |
|---|---|
| Database đang sống và trả dữ liệu | Truy vấn trực tiếp được 17 bảng, đếm được 54 dòng dữ liệu công khai |
| Schema đầy đủ, RLS đã bật trên cả 17 bảng | Kiểm tra `information_schema` + `pg_policies` |
| Không có Edge Function, không có trigger nghiệp vụ | Danh sách function rỗng, chỉ có trigger nội bộ của `storage` |
| Không có bí mật máy chủ nào cần chuyển | Không function nào dùng `Deno.env`; `.env` chỉ có URL + khóa publishable |
| Mã nguồn dùng đúng mẫu Supabase tiêu chuẩn | `src/lib/supabase.ts` chỉ gọi `createClient(url, anonKey)` với `flowType: 'pkce'` |
| Frontend không hard-code URL backend | Chỉ đọc từ biến môi trường, nên đổi backend = đổi `.env` |

---

## 3. Chưa xác minh (phải tự kiểm tra)

Đây là những điểm **quyết định** việc chạy ngoài Readdy có được hay không. Tôi không có bằng chứng cho bất kỳ điểm nào, nên không kết luận.

### 3.1. CORS — backend có chấp nhận origin lạ không?

Chưa xác minh. Cách tự kiểm tra trong 1 phút, chạy trên máy bạn:

```bash
curl -i -X OPTIONS "https://<VITE_PUBLIC_SUPABASE_URL>/rest/v1/locations?select=id&limit=1" \
  -H "Origin: https://your-github-domain.example" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: apikey,authorization"
```

Đọc kết quả:
- Có `Access-Control-Allow-Origin: *` hoặc đúng domain bạn gửi → nhiều khả năng chạy được.
- Không có header đó, hoặc trả 4xx → trình duyệt sẽ chặn, **không** chạy được nếu không được Readdy cho phép thêm domain.

Kiểm tra thêm bằng DevTools: mở frontend mới, xem tab Network, nếu request tới `/rest/v1/...` báo lỗi `CORS policy` thì kết luận là bị chặn.

### 3.2. Backend có tiếp tục chạy khi ngừng xuất bản trên Readdy?

Chưa xác minh. Tài liệu Readdy không nêu. Không được giả định là còn.

Cách xác minh:
1. Giữ nguyên bản đang xuất bản, không đụng vào.
2. Dựng frontend mới trên GitHub, trỏ vào backend này.
3. Nếu vẫn chạy, ghi nhận đây là **rủi ro chưa biết thời hạn**, không phải "đã an toàn".

### 3.3. Có thời hạn dùng / điều kiện khiến backend ngừng?

Chưa xác minh. Không có thông tin trong tài liệu công khai. **Phải hỏi hỗ trợ Readdy** bằng câu hỏi cụ thể:

> "Nếu tôi ngừng xuất bản (unpublish) project, Backend của project đó còn truy cập được bằng URL + publishable key trong bao lâu? Có giới hạn origin/CORS không? Có thể thêm domain ngoài vào allowlist không?"

### 3.4. Giới hạn tải / rate limit

Chưa xác minh. Với lưu lượng nhỏ (15–30 ngày, vài chục lượt/ngày) rủi ro thấp, nhưng không có số liệu.

---

## 4. Không được Readdy hỗ trợ (theo tài liệu tra được)

| Nội dung | Kết luận |
|---|---|
| Cấu hình CORS / allowlist domain | Tài liệu Readdy không có mục này → coi như **không có giao diện cấu hình cho người dùng** |
| Xuất Backend ra project Supabase của riêng bạn | Không có tính năng này. Muốn có backend riêng thì phải dựng Supabase mới và import dữ liệu |
| Chạy frontend ngoài Readdy nhưng vẫn dùng domain Readdy | Không hỗ trợ |

---

## 5. Nếu quyết định thử phương án A (frontend ngoài + Backend hiện tại)

Cấu hình tối thiểu, không cần sửa logic:

1. Tạo file `.env` (hoặc `.env.production`) trong frontend mới, với đúng 2 biến:
   ```
   VITE_PUBLIC_SUPABASE_URL=<URL backend hiện tại>
   VITE_PUBLIC_SUPABASE_ANON_KEY=<khóa publishable hiện tại>
   ```
   Lấy giá trị từ `.env` của dự án hiện tại. Không gửi các giá trị này qua chat, không commit `.env` lên GitHub — chỉ commit `.env.example` với tên biến.

2. Giữ nguyên `src/lib/supabase.ts`, không đổi tên biến.

3. Đặt `BASE_PATH=/` khi build (GitHub Pages dưới thư mục con thì dùng `/ten-repo/`, vì mã nguồn đã dùng `__BASE_PATH__` cho router và cho URL callback đăng nhập).

4. Thêm domain mới vào **Redirect URLs** của Authentication. Nếu không thêm, đăng nhập/khôi phục mật khẩu sẽ gãy dù API đọc dữ liệu vẫn chạy. Chi tiết ở `auth_config.md`.

5. Bật HTTPS. `flowType: 'pkce'` và `detectSessionInUrl: false` yêu cầu origin ổn định.

6. Trước khi tin tưởng: chạy phép thử CORS ở mục 3.1 và một vòng đăng nhập thật.

---

## 6. Chức năng nào bắt buộc phải có backend riêng?

Với mã nguồn hiện tại: **không có chức năng nào bắt buộc phải có backend riêng**, vì không có xử lý phía máy chủ. Nhưng nếu Backend Readdy ngừng hoạt động, các chức năng sau mất ngay lập tức:

| Chức năng | Phụ thuộc gì | Nếu backend chết |
|---|---|---|
| Danh sách/chi tiết địa điểm, bài viết, câu chuyện, nghệ nhân | `SELECT` trên 5 bảng | Trang trắng hoặc rỗng |
| Tìm kiếm | `SELECT` + `ilike` | Không tìm được |
| Đăng ký / đăng nhập / quên mật khẩu | Authentication | Không đăng nhập được |
| Yêu thích | bảng `favorites` | Mất |
| Gửi đóng góp | `INSERT` vào `contributions` | Không gửi được |
| Liên hệ nghệ nhân | `INSERT` vào `contact_requests` | Không gửi được |
| Hộp thư hỗ trợ trong trang tài khoản | bảng `messages` | Không dùng được |
| Khối "Điểm di sản nổi bật" ở trang chủ | `src/mocks/locations.ts` (hard-code) | **Vẫn hiển thị** |

Khối trang chủ là điểm sáng: nó dùng dữ liệu tĩnh trong mã nguồn, nên trang chủ vẫn còn nội dung và ảnh dù backend chết. Đây là lý do nên chuyển toàn bộ ảnh sang local trước tiên.

---

## 7. Kết luận có điều kiện

- Nếu phép thử CORS ở 3.1 trả về `Access-Control-Allow-Origin` phù hợp **và** Readdy xác nhận backend không bị tắt khi unpublish → phương án A khả thi về mặt kỹ thuật trong 15–30 ngày.
- Nếu CORS bị chặn hoặc không có câu trả lời từ Readdy → phải dùng phương án B (Supabase mới), vì không có cách nào vượt CORS từ phía trình duyệt mà vẫn an toàn.
- Trong cả hai trường hợp, **không nên** coi backend hiện tại là nơi lưu dữ liệu lâu dài cho website mới. Hãy coi nó là cầu tạm và chuẩn bị sẵn đường sang Supabase mới.