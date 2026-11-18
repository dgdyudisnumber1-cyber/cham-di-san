# Hướng dẫn lấy 45 ảnh của Chạm Di Sản

- Manifest hiện có **45 URL duy nhất**, xuất hiện ở **57 vị trí** trong mã nguồn và dữ liệu.
- Chưa có ảnh nhị phân tải về trong bộ BTL vì môi trường xử lý không truy cập được DNS `readdy.ai`.
- Không bắt buộc chạy script nếu bạn đã có ảnh: gửi ZIP ảnh gốc, tôi sẽ đối chiếu theo manifest.
- Nếu muốn tải tự động, mở Codespaces `cham-di-san`, chạy trong Terminal:

```bash
cd /workspaces/cham-di-san
python3 scripts/backup_assets.py --download
```

- Sau khi chạy, kiểm tra `docs/migration/assets-download-report.json`: trường `assets_local` là số ảnh tải thành công.
- Ảnh nằm ở `public/assets/`; bảng ánh xạ URL ở `src/lib/downloaded-asset-map.json`.
- Nén `public/assets/` cùng báo cáo tải ảnh và gửi lại nếu muốn cập nhật vào bộ BTL.
- Nếu URL cũ ngừng hoạt động, script không thể tái tạo ảnh gốc; cần ảnh đã sao lưu, không được coi ảnh tạo mới là ảnh gốc.

Để **trình bày hệ sinh thái bằng 5 slide**, bản CSV/JSON và manifest đã đủ. Để chứng minh **đã tải hết ảnh**, cần đủ file ảnh thật, không chỉ URL.
