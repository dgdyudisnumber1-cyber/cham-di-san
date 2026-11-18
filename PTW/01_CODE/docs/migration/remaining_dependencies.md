# Những thành phần KHÔNG có trong bất kỳ bản xuất nào

Danh sách dưới đây chỉ gồm thứ **thực sự không thể khôi phục từ mã nguồn + SQL + tài liệu đã có**. Xếp theo mức ảnh hưởng tới việc website có chạy được hay không.

Ngày kiểm tra: 2026-11-03.

---

## Mức 1 — Mất là website trắng hoặc hỏng ngay

### 1.1. Toàn bộ ảnh (45 tài nguyên)

| | |
|---|---|
| Có trong bản xuất? | **Không.** Không file ảnh nào nằm trong dự án hay trong Storage |
| Thực trạng | 42 ảnh là URL do Readdy sinh (`readdy.ai/api/search-image`, `public.readdy.ai`), 1 ảnh trên `storage.helloreaddy.io`, 1 ảnh Pinterest, phần còn lại là biến thể của cùng bộ |
| Storage | 2 bucket, **0 object** — không có gì để tải về từ Storage |
| Ảnh hưởng | Mọi trang đều có ảnh: hero trang chủ, 12 địa điểm, 9 bài viết, 9 câu chuyện, 6 nghệ nhân, trang giới thiệu, trang đăng nhập. Mất ảnh = website trông như bị lỗi, dù chữ vẫn còn |
| Khôi phục được? | Chỉ bằng cách tải từ chính các URL đó **trong lúc chúng còn sống** |
| Nỗ lực | ~1 giờ nếu URL còn truy cập; không khôi phục được nếu đã chết (phải tạo ảnh mới, và giao diện sẽ khác) |
| Chi tiết | `assets_manifest.json` — có đủ URL, vị trí dùng, tên file và đường dẫn đề xuất |

> Đây là việc **duy nhất** trong toàn bộ kế hoạch cần làm ngay hôm nay, vì nó là thứ có thể biến mất mà không báo trước.

### 1.2. Backend đang chứa dữ liệu và 4 tài khoản

| | |
|---|---|
| Có trong bản xuất? | Dữ liệu thì có (qua SQL); **khả năng truy cập thì không** |
| Thực trạng | Backend do Readdy quản lý. Không có cam kết nào về việc nó còn sống sau khi unpublish |
| Ảnh hưởng | Mất = mất địa điểm, bài viết, câu chuyện, nghệ nhân, đăng nhập, yêu thích, liên hệ |
| Khôi phục được? | Có, nhưng **chỉ khi còn truy cập được**. Vì vậy phải xuất dữ liệu ra file **trước** khi thử nghiệm bất cứ điều gì |
| Chi tiết | `backend_external_access.md`, `database_changes.md` |

### 1.3. Cấu hình Authentication

| | |
|---|---|
| Có trong bản xuất? | **Không.** Site URL, Redirect URLs, template email, SMTP, JWT expiry đều nằm ở cấu hình dịch vụ, không nằm trong database |
| Ảnh hưởng | Sai cấu hình = đăng ký không nhận được mã, link trong email trỏ về domain cũ, khôi phục mật khẩu gãy |
| Khôi phục được? | Không đọc ngược được. Phải mở panel và nhập lại theo `auth_config.md` |
| Rủi ro lớn nhất | Template email thiếu `{{ .Token }}` khiến email không có mã 6 số — lỗi im lặng, đăng ký "thành công" nhưng không ai xác thực được |

---

## Mức 2 — Mất là mất chức năng, nhưng website vẫn hiển thị

### 2.1. Trợ lý AI và toàn bộ cấu hình của nó

| | |
|---|---|
| Có trong bản xuất? | Chỉ có **thẻ script** trong `index.html` |
| Không có | Prompt hệ thống, knowledge base, kịch bản trả lời, giọng nói, cấu hình hành vi |
| Ảnh hưởng | Mất nút chat nổi. **Không** ảnh hưởng hộp thư hỗ trợ trong `/account` (dùng bảng `messages`, độc lập) |
| Khôi phục được? | Prompt thì **không**. Widget có chạy trên domain ngoài hay không: **chưa xác minh** |
| Chi tiết | `readdy_ai_config.md` |

### 2.2. Mật khẩu người dùng (dạng phiên đăng nhập)

| | |
|---|---|
| Có trong bản xuất? | Hash bcrypt thì có thể lấy từ `auth.users`; phiên đăng nhập thì không |
| Ảnh hưởng | 4 người dùng sẽ phải đăng nhập lại. Chấp nhận được |
| Khôi phục được? | Mật khẩu gốc thì không bao giờ. Đặt lại mật khẩu thì được |

### 2.3. Ảnh sản phẩm trong Shop

| | |
|---|---|
| Có trong bản xuất? | Chỉ có URL |
| Thực trạng | 1 sản phẩm, trạng thái **không hoạt động** → gần như không hiển thị với khách |
| Ảnh hưởng | Thấp. Nhưng khi bật bán hàng thì ảnh phải có thật |

### 2.4. Tài nguyên giao diện từ CDN

| Thành phần | Ảnh hưởng nếu mất |
|---|---|
| Remix Icon 4.5.0 (cdnjs) | **Toàn bộ icon biến mất** — dùng khắp nơi trong giao diện |
| Font Awesome 6.4.0 (cdnjs) | Một số icon biến mất |
| Google Fonts (Pacifico, Playfair Display, Inter) | Chữ đổi sang font hệ thống, thiết kế lệch nhưng không gãy |
| Google Maps embed (`output=embed`) | Bản đồ không tải. Không cần API key ở dạng này |

Khôi phục: dễ, chỉ cần giữ các thẻ `<link>` khi chuyển sang `index.html` mới. Rủi ro chỉ là CDN chặn theo vùng.

### 2.5. Favicon

`index.html` trỏ tới `/vite.svg` nhưng dự án **không có thư mục `public`** chứa file này. Favicon hiện có thể đang 404. Cần bổ sung một file favicon thật (logo Chạm Di Sản) hoặc bỏ thẻ link.

---

## Mức 3 — Thuộc nền tảng Readdy, không có trong bất kỳ bản xuất nào

| Thành phần | Có cách chuyển? |
|---|---|
| Domain `chamdisan.readdy.co` | Không. Phải dùng domain riêng hoặc domain miễn phí của GitHub Pages |
| SSL / chứng chỉ | Không cần chuyển — GitHub Pages tự cấp HTTPS |
| Analytics của Readdy | Không xuất được dữ liệu. Phải cài lại công cụ khác (Umami, GA4, Plausible) |
| Form builder của Readdy | Dự án **không dùng** form của Readdy. Form liên hệ tự ghi vào bảng `contact_requests`, form đóng góp ghi vào `contributions`. Nên không phụ thuộc |
| Booking / Calendar | Dự án **không dùng** |
| Lịch sử phiên bản, môi trường preview | Không chuyển được. Chỉ nằm trên Readdy |
| Quy trình xuất bản một cú nhấp | Mất. GitHub Pages cần workflow build |
| Cấu hình SEO của Readdy | Không xuất được. Nhưng toàn bộ thẻ meta đang nằm trong `index.html`, nên **vẫn giữ được** khi chuyển. Chỉ mất phần cấu hình riêng trên nền tảng (nếu có) |

---

## Mức 4 — Việc chưa hoàn tất, không phải thành phần bị thiếu

### Con số 62 so với 54

File export bạn có ghi **62 bản ghi**. Đếm trực tiếp hiện tại: **54 dòng dữ liệu công khai + 4 tài khoản auth + 2 bucket = 60**. Chênh **2**.

Ba khả năng, chưa xác định được khả năng nào:
1. File export tính thêm 2 dòng metadata/index.
2. Hai bản ghi đã bị xoá sau khi xuất.
3. File export tính 2 bucket như nhiều dòng hơn (ví dụ tính cả policy của bucket).

Cách xử lý: đừng cố đoán. Xuất lại toàn bộ 17 bảng, đối chiếu bằng `row_hash` theo hướng dẫn trong `database_changes.md`. Nếu bản export cũ có 2 dòng không tồn tại trong bản mới, đó là dữ liệu đã mất và cần biết là dòng nào.

---

## Tóm tắt một câu

Thứ duy nhất **không thể tái tạo bằng bất kỳ cách nào** là **45 file ảnh gốc** và **cấu hình trợ lý AI**. Mọi thứ khác — dữ liệu, schema, phân quyền, giao diện — đều đã có hoặc dựng lại được. Hãy tải ảnh trước, hỏi Readdy về trợ lý sau.