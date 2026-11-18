# Chạm Di Sản — Hồ sơ bàn giao & di chuyển khỏi Readdy

Tài liệu này được lập từ việc **kiểm tra trực tiếp backend đang chạy** (chỉ đọc).
Không có thay đổi nào được áp dụng lên website đang chạy.

Ngày kiểm tra: 2026-11-03

---

## 1. Tổng quan những gì đã xác minh được

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| Schema `public` | ✅ Xuất được | 17 bảng, đã có DDL đầy đủ ở `01-schema.sql` |
| RLS | ✅ Xuất được | Cả 17 bảng đều **đã bật RLS** (không forced) |
| Policies | ✅ Xuất được | 24 policy, đầy đủ ở `02-rls-grants.sql` |
| GRANT | ✅ Xuất được | `anon` + `authenticated` đang có **toàn quyền SELECT/INSERT/UPDATE/DELETE** trên cả 17 bảng (xem cảnh báo §4) |
| Function tự tạo | ✅ Không có | Chỉ có `dblink*`, `pg_stat_statements*` do nền tảng cài sẵn |
| Trigger nghiệp vụ | ✅ Không có | Chỉ có 4 trigger nội bộ của `storage` |
| Edge Functions | ✅ Không có | Danh sách function của project đang rỗng |
| Storage | ⚠️ Rỗng | Có 2 bucket `public` / `private` nhưng **0 object** |
| Tài khoản auth | ✅ 4 user | Tất cả provider `email`, cả 4 đã xác thực email |
| Cấu hình Auth (SMTP, Site URL, template) | ❌ Không đọc được từ DB | Phải đối chiếu ở panel Authentication |
| Cấu hình trợ lý AI | ❌ Không xuất được | Thuộc Readdy, chỉ có `projectId` trong `index.html` |

## 2. Số liệu thực tế (đếm trực tiếp)

```
locations              12      product_categories      1
heritage_content       14      product_items           1
articles                9      product_variants        0
heritage_stories        9      product_skus            0
sellers                 6      product_custom_fields   0
contributions           1      product_custom_values   0
contact_requests        1      order_headers           0
favorites               0      order_items             0
messages                0
------------------------------------------------------------
Tổng public: 54 bản ghi   |   auth.users: 4   |   storage.objects: 0
```

> Lưu ý: con số **62 bản ghi** trong file export bạn có không khớp với số đếm hiện tại
> (54 public + 4 auth + 2 bucket = 60). Có thể file export đã tính thêm dòng metadata
> hoặc được xuất ở thời điểm dữ liệu còn khác. Nên đối chiếu lại trước khi dùng làm bản gốc.

## 3. Danh sách tệp trong gói này

| Tệp | Nội dung |
|---|---|
| `01-schema.sql` | DDL 17 bảng, sequence, index, khóa ngoại — chạy được trên Supabase mới |
| `02-rls-grants.sql` | Bật RLS, toàn bộ 24 policy, GRANT hiện hành + bản vá bảo mật |
| `03-restore-guide.md` | Thứ tự nhập dữ liệu, xử lý sequence/FK, chuyển auth |
| `04-storage-assets.md` | Bucket, policy storage, kế hoạch xuất ảnh/audio |
| `05-auth-migration.md` | Checklist cấu hình Auth, mật khẩu, SMTP, callback |
| `06-agent-backend.md` | Trợ lý AI, biến môi trường, phần buộc phải thay thế |
| `07-cutover-checklist.md` | Thứ tự thao tác chuyển nhà từng bước |

### Bổ sung ngày 2026-11-03 (đợt hai)

| Tệp | Nội dung |
|---|---|
| `assets_manifest.json` | 45 tài nguyên duy nhất / 57 vị trí tham chiếu: URL đầy đủ, nơi dùng, tên file và đường dẫn đề xuất |
| `backend_external_access.md` | Backend có dùng được từ frontend ngoài Readdy: đã xác minh / chưa xác minh / phải hỏi Readdy |
| `auth_config.md` | Cấu hình OTP 6 số, callback `/auth/callback`, khôi phục mật khẩu, giới hạn khi đổi tài khoản |
| `readdy_ai_config.md` | Script trợ lý AI, ý nghĩa từng tham số, khả năng dùng trên domain khác (chưa xác minh) |
| `remaining_dependencies.md` | Những gì không có trong bản xuất nào và mức ảnh hưởng |
| `database_changes.md` | Không tạo được `database_changes.sql` vì không có bản xuất cũ để so sánh; kèm cách tự xác minh |

## 4. ⚠️ Ba vấn đề bảo mật phát hiện được (quan trọng)

Đây là hiện trạng thật của hệ thống, không phải suy đoán:

1. **`contributions` cho phép đọc công khai toàn bộ.**
   Policy `contributions_public_read` có điều kiện `USING (true)`.
   Bảng này chứa `contributor_name`, `email`, `phone`.
   → Bất kỳ ai có anon key (tức là ai mở web) đều đọc được email/số điện thoại
   của người đã gửi đóng góp. **Nên siết lại ngay.**

2. **`order_headers` cho phép UPDATE công khai.**
   Policy `order_headers_customer_update` có `USING (true)` và không có `WITH CHECK`.
   → Người lạ có thể sửa đơn hàng của người khác (đổi trạng thái, đổi recipient).
   Hiện bảng đang 0 dòng nên chưa thiệt hại, nhưng phải sửa trước khi bán hàng thật.

3. **GRANT quá rộng.**
   `anon` và `authenticated` được cấp DELETE/INSERT/UPDATE/SELECT trên mọi bảng.
   Với các bảng chỉ có policy SELECT, RLS vẫn chặn ghi — nhưng đây là cấu hình
   mong manh: chỉ cần một policy viết sai là hở ngay. Nguyên tắc đúng là
   cấp quyền tối thiểu ở cả hai lớp (GRANT và RLS).

Bản vá cho cả ba vấn đề nằm ở **mục 3 của `02-rls-grants.sql`** — chỉ chạy khi bạn
đã quyết định, không chạy tự động.

## 5. Những gì KHÔNG thể xuất từ môi trường này

- **Mật khẩu người dùng**: không bao giờ đọc được, dưới mọi hình thức. Chỉ chuyển
  được qua tính năng *migrate users* của Supabase (dùng `password_hash`), xem `05`.
- **Cấu hình Auth**: Site URL, Redirect URLs, SMTP, template email, JWT expiry — nằm ở
  cấu hình dịch vụ, không nằm trong database. Phải chép tay từ panel.
- **Cấu hình trợ lý AI Readdy**: project, prompt, giọng nói, knowledge base đều thuộc
  Readdy. Chỉ có tham số nhúng trong `index.html`.
- **File trong Storage**: hiện không có object nào, nên không có gì để tải.
- **Analytics, domain, SSL, form builder, booking**: thuộc nền tảng Readdy.
- **ZIP**: môi trường này không tạo được file nén. Bạn tải từng tệp ở tab Code,
  hoặc sao chép nội dung trực tiếp từng tệp.

## 6. Kết luận ngắn

Phần **dữ liệu và phân quyền** đã đủ để dựng lại trên Supabase riêng: schema, RLS,
policy, GRANT, thứ tự import đều có trong gói này.
Phần **phải làm tay** là: cấu hình Auth, tải lại ảnh (đang là link Readdy, không nằm
trong Storage), và thay trợ lý AI bằng giải pháp khác nếu rời hẳn Readdy.