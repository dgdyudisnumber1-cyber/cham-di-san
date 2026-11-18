-- =====================================================================
-- Chạm Di Sản — RLS, POLICY và GRANT (bản xuất nguyên trạng)
-- Ngày kiểm tra: 2026-11-03
-- Phần 1–2: hiện trạng đang chạy, tái lập được trên Supabase mới.
-- Phần 4: bản vá bảo mật ĐỀ XUẤT — không tự chạy nếu chưa quyết định.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Bật RLS cho 17 bảng (hiện trạng: tất cả đều đã bật, không FORCE)
-- ---------------------------------------------------------------------

ALTER TABLE public.locations              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heritage_content       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heritage_stories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_skus           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_custom_fields  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_custom_values  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_headers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items            ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 2. TOÀN BỘ POLICY HIỆN HÀNH (24 policy, vai trò public)
-- Sao chép đúng định nghĩa đã đọc từ pg_policies.
-- ---------------------------------------------------------------------

-- Nội dung công khai (đúng ý đồ: ai cũng đọc được)
CREATE POLICY articles_public_read ON public.articles
  FOR SELECT TO public USING (true);

CREATE POLICY heritage_content_public_read ON public.heritage_content
  FOR SELECT TO public USING (true);

CREATE POLICY "public read heritage_stories" ON public.heritage_stories
  FOR SELECT TO public USING (true);

CREATE POLICY locations_public_read ON public.locations
  FOR SELECT TO public USING (true);

CREATE POLICY sellers_public_read ON public.sellers
  FOR SELECT TO public USING (true);

-- Danh mục sản phẩm: chỉ đọc
CREATE POLICY product_categories_select ON public.product_categories
  FOR SELECT TO public USING (true);

CREATE POLICY product_items_select ON public.product_items
  FOR SELECT TO public USING (true);

CREATE POLICY product_variants_select ON public.product_variants
  FOR SELECT TO public USING (true);

CREATE POLICY product_skus_select ON public.product_skus
  FOR SELECT TO public USING (true);

CREATE POLICY product_custom_fields_select ON public.product_custom_fields
  FOR SELECT TO public USING (true);

CREATE POLICY product_custom_values_select ON public.product_custom_values
  FOR SELECT TO public USING (true);

-- Yêu thích: chỉ chủ sở hữu
CREATE POLICY favorites_select_own ON public.favorites
  FOR SELECT TO public USING (auth.uid() = user_id);

CREATE POLICY favorites_insert_own ON public.favorites
  FOR INSERT TO public WITH CHECK (auth.uid() = user_id);

CREATE POLICY favorites_delete_own ON public.favorites
  FOR DELETE TO public USING (auth.uid() = user_id);

-- Tin nhắn hỗ trợ: chỉ chủ sở hữu đọc, gửi thì phải đúng user
CREATE POLICY messages_select_own ON public.messages
  FOR SELECT TO public USING (auth.uid() = user_id);

CREATE POLICY messages_insert_own ON public.messages
  FOR INSERT TO public WITH CHECK (auth.uid() = user_id);

-- Đơn hàng
CREATE POLICY order_headers_customer_select ON public.order_headers
  FOR SELECT TO public USING (true);

CREATE POLICY order_headers_customer_insert ON public.order_headers
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY order_headers_customer_update ON public.order_headers
  FOR UPDATE TO public USING (true);

CREATE POLICY order_items_customer_select ON public.order_items
  FOR SELECT TO public USING (true);

CREATE POLICY order_items_customer_insert ON public.order_items
  FOR INSERT TO public WITH CHECK (true);

-- Đóng góp & liên hệ (2 policy dưới đây là nguồn rủi ro — xem phần 3)
CREATE POLICY contributions_public_read ON public.contributions
  FOR SELECT TO public USING (true);

CREATE POLICY contributions_public_insert ON public.contributions
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY contact_requests_insert_public ON public.contact_requests
  FOR INSERT TO public WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 3. GRANT hiện hành
-- Hiện trạng: anon + authenticated có SELECT/INSERT/UPDATE/DELETE trên
-- CẢ 17 bảng. RLS là lớp chặn duy nhất còn lại.
-- ---------------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =====================================================================
-- 4. BẢN VÁ BẢO MẬT ĐỀ XUẤT (chưa áp dụng)
-- Chạy phần này trên project MỚI sau khi đã import xong dữ liệu.
-- Mục tiêu: thu quyền về mức tối thiểu, bịt 3 lỗ hổng đã phát hiện.
-- =====================================================================

-- 4.1. contributions: dữ liệu cá nhân (email, phone) không được đọc công khai.
--      Giữ quyền gửi (INSERT) cho khách, bỏ quyền đọc.
--      Admin đọc bằng service_role (dashboard/Edge Function có kiểm tra quyền).
DROP POLICY IF EXISTS contributions_public_read ON public.contributions;
REVOKE SELECT ON public.contributions FROM anon, authenticated;

-- 4.2. contact_requests: khách chỉ được gửi, không đọc, không sửa, không xoá.
REVOKE SELECT, UPDATE, DELETE ON public.contact_requests FROM anon, authenticated;

-- 4.3. order_headers: chặn sửa đơn của người khác.
--      Đơn khách vãng lai (customer_id IS NULL) chỉ được tạo, không sửa.
DROP POLICY IF EXISTS order_headers_customer_update ON public.order_headers;
CREATE POLICY order_headers_customer_update ON public.order_headers
  FOR UPDATE TO authenticated
  USING (customer_id = auth.uid()::text)
  WITH CHECK (customer_id = auth.uid()::text);

-- 4.4. Đơn hàng: chỉ đọc đơn của mình (khách vãng lai đọc qua session id
--      do backend giữ, không đọc bằng anon).
DROP POLICY IF EXISTS order_headers_customer_select ON public.order_headers;
CREATE POLICY order_headers_customer_select ON public.order_headers
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid()::text);

DROP POLICY IF EXISTS order_items_customer_select ON public.order_items;
CREATE POLICY order_items_customer_select ON public.order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.order_headers h
      WHERE h.id = order_items.order_id
        AND h.customer_id = auth.uid()::text
    )
  );

-- 4.5. Nội dung chỉ đọc: thu quyền ghi còn lại.
REVOKE INSERT, UPDATE, DELETE ON
  public.locations, public.heritage_content, public.articles,
  public.heritage_stories, public.sellers,
  public.product_categories, public.product_items, public.product_variants,
  public.product_skus, public.product_custom_fields, public.product_custom_values
FROM anon, authenticated;

-- 4.6. favorites / messages: giữ đúng 3 + 2 quyền như policy cho phép.
REVOKE UPDATE ON public.favorites FROM anon, authenticated;
REVOKE DELETE, UPDATE ON public.messages FROM anon, authenticated;

-- 4.7. Dọn policy rỗng không dùng (order insert của khách vẫn cần giữ).

-- ---------------------------------------------------------------------
-- 5. STORAGE (hiện trạng)
-- Bucket: public (public=true), private (public=false). 0 object.
-- Policy đang áp dụng trên storage.objects:
--   • INSERT bucket_id = 'public'   → anon, authenticated
--   • INSERT bucket_id = 'private'  → anon, authenticated
--   • SELECT bucket_id = 'public'   → anon, authenticated
-- Không có policy UPDATE/DELETE ⇒ không ai sửa/xoá được object.
-- Lưu ý: INSERT vào bucket 'private' đang mở cho anon — nên siết lại
-- (chỉ authenticated, hoặc own_path) trước khi dùng cho dữ liệu thật.
-- Chi tiết và phương án xuất file: xem 04-storage-assets.md
-- ---------------------------------------------------------------------