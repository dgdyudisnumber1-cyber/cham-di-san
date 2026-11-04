import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'

const root = createRoot(document.getElementById('root')!)

const backendUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL?.trim()
const backendKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY?.trim()
const hasBackendConfig =
  Boolean(backendUrl && backendKey) &&
  !backendUrl.includes('YOUR-') &&
  !backendKey.includes('YOUR-')

if (!hasBackendConfig) {
  root.render(
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background: '#faf8f4',
        color: '#292524',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <section style={{ width: '100%', maxWidth: 600, lineHeight: 1.7 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          Chạm Di Sản — Chưa cấu hình Backend
        </h1>
        <p>
          Mã nguồn đã chạy, nhưng ứng dụng chưa có địa chỉ và khóa công khai để
          kết nối Supabase. Đây là lý do giao diện chưa hiển thị.
        </p>
        <p>
          Trong Codespaces, tạo file <code>.env</code> ở thư mục gốc, sau đó điền
          hai giá trị thực từ file <code>.env</code> của dự án Readdy:
        </p>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
            padding: 16,
            borderRadius: 8,
            background: '#eee7dc',
            fontSize: 13,
          }}
        >{`VITE_PUBLIC_SUPABASE_URL=https://...
VITE_PUBLIC_SUPABASE_ANON_KEY=...`}</pre>
        <p>
          Lưu file, khởi động lại <code>npm run dev</code> và tải lại trang.
          Không đưa file <code>.env</code> lên GitHub.
        </p>
      </section>
    </main>,
  )
} else {
  import('./App.tsx')
    .then(({ default: App }) => {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      )
    })
    .catch((error) => {
      console.error('Chạm Di Sản failed to start:', error)
      root.render(
        <main style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
          <h1>Không thể khởi động Chạm Di Sản</h1>
          <p>Vui lòng mở Console của trình duyệt để xem lỗi chi tiết.</p>
        </main>,
      )
    })
}
