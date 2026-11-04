# Trợ lý AI Readdy — chính xác những gì có, những gì không

Ngày kiểm tra: 2026-11-03. Chỉ đọc.

---

## 1. Script nhúng thực tế trong `index.html`

Đây là toàn bộ những gì website có liên quan tới trợ lý AI — **một thẻ script duy nhất**, đặt ngay trước `</body>`:

```html
<script
  src="https://readdy.ai/api/public/assistant/widget?projectId=04f633d8-7909-4d8d-b4ba-f50a0ef43cfa"
  mode="hybrid"
  voice-show-transcript="true"
  theme="light"
  size="compact"
  accent-color="#B45309"
  button-base-color="#1C1917"
  button-accent-color="#FFFFFF"
  main-label="Talk with Us"
  empty-chat-message="Xin chào! Mình là trợ lý của Chạm Di Sản. Bạn muốn tìm hiểu về điểm di sản, nghệ nhân hay sản phẩm thủ công nào?"
  empty-voice-message="Nhấn nút để trò chuyện bằng giọng nói với trợ lý Chạm Di Sản."
  defer
></script>
```

Kiểm tra chéo: **không** có đoạn mã nào khác trong `src/` gọi trợ lý (không có `vapi`, không có `readdyAgent`, không có `voice-`, không có fetch tới assistant). Trợ lý hoàn toàn do script này tự dựng giao diện.

## 2. Giải nghĩa từng tham số

| Tham số | Giá trị | Ý nghĩa |
|---|---|---|
| `src` | `https://readdy.ai/api/public/assistant/widget` | Mã nguồn widget do Readdy phục vụ |
| `projectId` | `04f633d8-7909-4d8d-b4ba-f50a0ef43cfa` | Định danh project, là thứ nối widget với cấu hình trợ lý trên Readdy. **Đây là giá trị công khai** (ai xem HTML cũng thấy), không phải khóa bí mật |
| `mode` | `hybrid` | Cho phép cả chat và giọng nói |
| `voice-show-transcript` | `true` | Hiện bản chép lời khi nói |
| `theme` | `light` | Giao diện sáng |
| `size` | `compact` | Nút nhỏ gọn |
| `accent-color` | `#B45309` | Màu nhấn, khớp bảng màu di sản |
| `button-base-color` | `#1C1917` | Màu nền nút |
| `button-accent-color` | `#FFFFFF` | Màu chữ/icon trên nút |
| `main-label` | `Talk with Us` | Nhãn nút |
| `empty-chat-message` | câu chào tiếng Việt | Tin nhắn mở đầu khung chat |
| `empty-voice-message` | câu hướng dẫn tiếng Việt | Tin nhắn mở đầu chế độ giọng nói |

## 3. Bốn câu hỏi, trả lời đúng mức bằng chứng

### 3.1. Trợ lý có hoạt động khi frontend chạy trên domain ngoài Readdy không?

**Chưa xác minh.** Không có công cụ gửi request ra ngoài trong môi trường kiểm tra, nên không thể khẳng định.

Cách tự kiểm tra, mất khoảng 3 phút:
1. Dựng frontend mới trên domain thử nghiệm, giữ nguyên thẻ script.
2. Mở trang, xem có nút trợ lý xuất hiện không.
3. Bấm thử, xem Network có request bị 401/403/CORS không.
4. Kiểm tra Console có thông báo dạng "domain not allowed" / "invalid project" / "origin mismatch".

Ba khả năng và cách đọc kết quả:
- Nút hiện và trả lời được → dùng tạm được, nhưng vẫn là phụ thuộc ngoài.
- Nút hiện nhưng request bị chặn → nhiều khả năng widget kiểm tra origin theo project.
- Nút không hiện → script từ chối chạy trên domain lạ.

### 3.2. Có cần đăng ký / xác thực / cấu hình riêng không?

Với domain Readdy hiện tại: **không cần gì thêm** — chỉ cần thẻ script và `projectId` là đủ, chứng tỏ định danh đã gắn với project.

Với domain ngoài: **chưa rõ**. Không tìm thấy cơ chế cấp khóa riêng cho domain ngoài trong tài liệu. Nếu Readdy không có tính năng này thì không có cách cấu hình hợp lệ.

### 3.3. Có xuất được prompt hệ thống / nội dung hướng dẫn / cấu hình hành vi không?

**Không.** Prompt, knowledge base, giọng nói, kịch bản trả lời đều nằm trong cấu hình project trên Readdy, không nằm trong:
- mã nguồn (đã quét toàn bộ `src/` và `index.html`);
- database (không có bảng nào liên quan);
- file `.env` (chỉ có 2 biến backend).

Thứ duy nhất chép ra được là hai câu chào trong `index.html` — đó là nội dung hiển thị, không phải prompt hệ thống.

### 3.4. Có API chính thức để nối lại trợ lý không?

**Không tìm thấy** trong tài liệu Readdy mà tôi tra được. Không có mục nào mô tả API công khai cho widget trợ lý hay cách đăng ký domain ngoài.

Cần hỏi hỗ trợ Readdy bằng câu hỏi cụ thể:

> "Widget trợ lý (`readdy.ai/api/public/assistant/widget?projectId=...`) có chạy trên domain không phải Readdy không? Nếu có, cần thêm domain vào allowlist ở đâu? Prompt hệ thống và knowledge base có xuất được không?"

---

## 4. Điều quan trọng: trợ lý AI **không** phải chức năng cốt lõi

Website có **hai** thứ dễ bị nhầm là một:

| | Trợ lý AI (widget) | Hộp thư hỗ trợ (ChatTab) |
|---|---|---|
| Vị trí | Nút nổi, mọi trang | Tab "Tin nhắn" trong `/account` |
| Công nghệ | Script ngoài của Readdy | Bảng `messages` trong Backend, mã nguồn tự dựng |
| Cần đăng nhập | Không | Có |
| Nếu rời Readdy | Có thể mất | **Vẫn chạy bình thường** |

Nghĩa là: bỏ thẻ script **không** làm mất khả năng liên hệ với đội ngũ. ChatTab trong trang tài khoản vẫn hoạt động độc lập, dựa trên dữ liệu của chính bạn.

## 5. Nếu không chuyển được — cách xử lý sạch

Cách 1 — Bỏ hẳn (khuyến nghị, 1 phút):
1. Xoá nguyên thẻ `<script ... assistant/widget ...>` khỏi `index.html`.
2. Chạy build lại.
3. Không cần sửa gì trong `src/`.
4. Ghi rõ trong README của repo mới: "Trợ lý AI đã được gỡ vì phụ thuộc nền tảng Readdy."

Cách 2 — Giữ tạm: để nguyên thẻ script. Nếu widget chạy được thì tốt; nếu không, người dùng chỉ thấy một nút không phản hồi. Cần kiểm tra trước khi xuất bản, đừng để nút chết.

Cách 3 — Thay thế sau: dựng một Edge Function gọi mô hình ngôn ngữ với knowledge base tự soạn, rồi làm khung chat riêng. Đây là việc của 1–2 tuần, không phù hợp mục tiêu 15–30 ngày. Chỉ nên làm nếu trợ lý thực sự cần cho vận hành.

---

## 6. Các phụ thuộc ngoài khác cần kiểm tra cùng lúc

| Thành phần | Vị trí | Nếu mất thì sao |
|---|---|---|
| Google Fonts (Pacifico; Playfair Display; Inter) | `index.html`, `src/index.css` | Chữ về font hệ thống. Không gãy chức năng, chỉ lệch thiết kế |
| Font Awesome 6.4.0 (cdnjs) | `index.html` | Một số icon biến mất |
| Remix Icon 4.5.0 (cdnjs) | `index.html` | **Phần lớn icon biến mất** — website dùng Remix Icon khắp nơi |
| Google Maps embed | `src/components/feature/MapEmbed.tsx` | Bản đồ không tải. Không cần API key với dạng `output=embed` |
| Link Facebook / TikTok | `Footer.tsx`, `SocialDock.tsx` | Chỉ là link ngoài, không ảnh hưởng |

Không có Edge Function, webhook, hay API bí mật nào khác đang được website sử dụng. Danh sách function của project rỗng.