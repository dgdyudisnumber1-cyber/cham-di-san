# Chạm Di Sản - Nền tảng Bản đồ Di sản Văn hóa & Thương mại P2P

## 1. Project Description
Nền tảng bản đồ số kết hợp bảo tồn di sản văn hóa Việt Nam và thương mại điện tử P2P. Người dùng khám phá di tích, làng nghề, khu vực dân tộc thiểu số qua bản đồ tương tác; nghe/đọc nội dung văn hóa (dữ liệu xác thực & dân gian); và kết nối trực tiếp với nghệ nhân bản địa để mua sản phẩm thủ công qua Zalo/Messenger/SĐT.

## 2. Page Structure
- `/` - Trang chủ (bản đồ Việt Nam tương tác + bộ lọc)
- `/location/:slug` - Chi tiết điểm định vị (Tab: Kho lưu trữ số | Bản đồ & địa chỉ | Không gian giao thương)
- `/stories` - Tạp chí di sản (danh sách bài viết, lọc theo danh mục)
- `/story/:slug` - Chi tiết bài viết + audio đọc
- `/heritage-stories` - Câu chuyện di sản (kho truyền thuyết/sự tích, audio kể chuyện)
- `/heritage-story/:slug` - Chi tiết câu chuyện di sản + nghe kể
- `/about` - Giới thiệu dự án
- `/contribute` - Form đóng góp tài liệu/âm thanh (nối bảng contributions)
- `/search` - Tìm kiếm toàn diện (điểm di sản / bài viết / nghệ nhân)
- `/account` - Tài khoản cá nhân (danh sách yêu thích + tin nhắn liên hệ đội ngũ)
- `/product/:id` - Chi tiết sản phẩm thủ công
- `/seller/:id` - Hồ sơ nghệ nhân/người bán
- `/seller/dashboard` - Bảng điều khiển người bán (đăng sản phẩm)
- `/admin` - Bảng duyệt của quản trị viên
- `/auth/login`, `/auth/register`, `/auth/reset-password`, `/auth/callback` - Xác thực người dùng (Supabase Auth + PKCE)

## 3. Core Features
- [x] Bản đồ tương tác Việt Nam với marker phân loại (Làng nghề / Di tích / Khu vực bản địa)
- [x] Bộ lọc theo vùng/tỉnh và danh mục
- [x] Trang chi tiết điểm với Tab "Dữ liệu xác thực" và "Văn hóa dân gian"
- [x] Trình phát audio kèm văn bản
- [x] Bản đồ Google phóng to + địa chỉ + chỉ đường cho từng điểm di sản
- [x] Tạp chí di sản (danh sách & chi tiết bài viết + audio)
- [x] Câu chuyện di sản (kho truyền thuyết/sự tích + audio kể chuyện)
- [x] Form đóng góp tài liệu/âm thanh (nối bảng contributions)
- [x] Đăng ký/đăng nhập người dùng (Supabase Auth, mã xác nhận email)
- [x] Danh sách yêu thích (lưu điểm di sản & bài viết)
- [x] Hộp tin nhắn liên hệ đội ngũ dự án
- [x] Thanh tìm kiếm toàn diện ở trang chủ
- [x] Để lại thông tin liên hệ cho nghệ nhân (thay Zalo/Gọi)
- [x] Tiểu sử & thành tích nghệ nhân có thật (danh hiệu, tiểu sử, thành tích đã được ghi nhận)
- [ ] Danh sách & chi tiết sản phẩm thủ công theo điểm
- [ ] Hồ sơ người bán + nút Zalo/Messenger/Phone
- [ ] Dashboard người bán đăng sản phẩm
- [ ] Trang duyệt sản phẩm/đóng góp của admin
- [ ] Đa ngôn ngữ VI/EN

## 4. Data Model Design
Đã kết nối Readdy Backend. Các bảng đã tạo:
- `locations` - điểm di sản (slug, name, province, region, category, x/y toạ độ bản đồ, summary, image, tags, product_count, content_count, **address**, **lat**, **lng**)
- `heritage_content` - nội dung văn hóa (location_id, content_type: authentic/folklore, title, body, source, author, audio_url)
- `articles` - bài viết tạp chí (slug, location_id, title, excerpt, body, cover_image, category, author, read_minutes, audio_url, published_at)
- `heritage_stories` - câu chuyện di sản (slug, location_id, title, storyteller, excerpt, body, cover_image, region, duration_minutes, audio_url, is_featured, published_at)
- `sellers` - hồ sơ nghệ nhân (location_id, name, **title**, **craft**, avatar, bio, **biography**, **achievements**, zalo, messenger, phone)
- `contributions` - đóng góp tư liệu (contributor_name, email, phone, location_id, content_type: text/audio, text_content, audio_path, status: pending/approved/rejected)
- `favorites` - mục yêu thích (user_id, item_type: location/article, item_id)
- `messages` - tin nhắn liên hệ đội ngũ (user_id, body, is_team_reply)
- `contact_requests` - khách để lại thông tin cho nghệ nhân (seller_id, seller_name, name, phone, email, message)
- Bảng sản phẩm & đơn hàng dùng sẵn: product_categories, product_items, product_variants, product_skus, order_headers, order_items

RLS đã bật: đọc công khai (locations, heritage_content, articles, sellers, contributions); đóng góp mới (INSERT) công khai.

## 5. Backend / Third-party Integration
- Database: **Readdy Backend đã kết nối** - đã tạo bảng + nạp 12 điểm di sản mẫu
- Payment: **không** - dùng liên hệ trực tiếp Zalo/Messenger/Phone
- i18n: VI/EN

## 6. Development Phase Plan

### Phase 1: Trang chủ với bản đồ tương tác (Ưu tiên)
- Mục tiêu: Xây trang chủ với bản đồ Việt Nam, marker phân loại, bộ lọc theo vùng/danh mục, danh sách điểm nổi bật, header/footer
- Kết quả: Người dùng có thể xem bản đồ và lọc điểm di sản

### Phase 2: Trang chi tiết điểm định vị
- Tab "Dữ liệu xác thực" & "Văn hóa dân gian" + trình phát audio kèm văn bản
- Danh sách sản phẩm thủ công tại điểm

### Phase 3: Sản phẩm & Hồ sơ người bán
- Chi tiết sản phẩm, hồ sơ nghệ nhân với nút Zalo/Messenger/SĐT

### Phase 4: Form Đóng góp cộng đồng
- Form gửi tài liệu văn bản/file âm thanh

### Phase 5: Xác thực & Dashboard người bán + Admin duyệt
- Login/register, đăng sản phẩm, duyệt bởi admin (cần kết nối database)

### Phase 6: Đa ngôn ngữ VI/EN & hoàn thiện
- i18n toàn site + polish animations