# Dashboard Chạm Di Sản

**[Mở Dashboard trực tuyến trên GitHub Pages](https://dgdyudisnumber1-cyber.github.io/cham-di-san-dashboard/)**

Dashboard tổng hợp hiệu quả của Website, Facebook và TikTok trong chiến dịch Chạm Di Sản, đồng thời đối chiếu kết quả với các mục tiêu đã đăng ký. Giảng viên có thể mở liên kết trên trong trình duyệt mà không cần đăng nhập hoặc chạy Docker, PostgreSQL hay Metabase.

| Tab | Nội dung |
| --- | --- |
| Tổng quan | Lưu lượng Website, lượt xem nội dung TikTok, tương tác mạng xã hội và so sánh các nền tảng. |
| Website | Phiên, lượt xem trang, người dùng hoạt động theo ngày, nguồn truy cập và các bảng tổng hợp lịch sử. |
| Facebook | Lượt xem, lượt nhấp liên kết và tương tác của các bài đăng trong kỳ báo cáo. |
| TikTok | Hiệu quả của 8 video và 1 bài ảnh. Toàn bộ nội dung có 3.825 lượt xem, trong đó video có 3.820 lượt xem. |
| Đánh giá KPI | Đối chiếu 9 KPI với mục tiêu gốc và mục tiêu hiệu chỉnh sau kỳ báo cáo. |

Chuỗi Website gồm số liệu từ báo cáo GA4 đã lưu đến 17/11 và số liệu từ GA4 Data API kể từ 18/11. Bộ lọc áp dụng cho các chỉ số Website theo ngày. Các chỉ số Facebook, TikTok và thống kê tổng kỳ dùng phạm vi ghi trên từng thẻ.

GitHub Actions của [kho Dashboard nguồn](https://github.com/dgdyudisnumber1-cyber/cham-di-san-dashboard) được lên lịch lúc **09:00 giờ Việt Nam** hằng ngày để lấy bù ngày thiếu, rà soát số liệu gần nhất và triển khai lên GitHub Pages.

Thư mục này chứa **bản chụp nộp bài đến hết 24/11/2026**. Tải ZIP của kho mã nguồn, giải nén và mở [index.html](index.html) bằng trình duyệt. Biểu đồ và dữ liệu có sẵn trong thư mục. Bản trực tuyến cập nhật theo lịch GitHub Actions.

[TAI_LIEU_BAO_CAO_CU](TAI_LIEU_BAO_CAO_CU/) lưu ba báo cáo trước đây để đối chiếu.


### Kỳ đánh giá KPI đến 24/11/2026

Chuỗi Website có 51 ngày, từ 05/10 đến 24/11/2026. Các ngày 20–24/11 lấy trực tiếp từ GA4 Data API. Truy vấn riêng từng ngày xác nhận 21–24/11 có 0 sự kiện. Kỳ chốt bỏ ngày 25/11. Dashboard trực tuyến tiếp tục cập nhật GA4 theo lịch. Bảng KPI giữ phạm vi kỳ chốt.

Mục tiêu hiệu chỉnh được xác định sau kỳ báo cáo để đối chiếu với ngưỡng 90%. Bảng giữ mục tiêu gốc và kết quả quan sát. Có 7 KPI đạt ngưỡng, 1 KPI chưa đạt và 1 KPI chưa xác minh. Chuỗi Website có 3.184 người dùng-ngày. API chỉ còn 5 ngày dữ liệu theo ngày trong giai đoạn GA4 lịch sử, nên WEB01 chưa có số người dùng duy nhất đại diện toàn kỳ và giữ mục tiêu gốc. Chỉ số Facebook và TikTok sử dụng kết quả đã ghi nhận đến 17/11.
