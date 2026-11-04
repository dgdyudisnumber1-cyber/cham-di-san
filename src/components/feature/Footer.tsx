import { useLocation, useNavigate, Link } from 'react-router-dom';

const socialChannels = [
  {
    key: 'facebook',
    label: 'Facebook',
    icon: 'ri-facebook-circle-fill',
    href: 'https://www.facebook.com/profile.php?id=61594814327595',
    handle: 'Chạm Di Sản',
    brand: 'bg-[#1877F2] border-[#1877F2] hover:bg-[#0f62d0] hover:border-[#0f62d0]',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    icon: 'ri-tiktok-fill',
    href: 'https://www.tiktok.com/@chamdisan?_r=1&_t=ZS-9AXJKpoIJXw',
    handle: '@chamdisan',
    brand: 'bg-[#010101] border-[#2a2a2a] hover:bg-[#25F4EE] hover:border-[#25F4EE] hover:text-[#010101]',
  },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = (hash: string) => {
    if (location.pathname === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: hash } });
    }
  };

  const sections = [
    { label: 'Bản đồ di sản', hash: 'map' },
    { label: 'Làng nghề nổi bật', hash: 'featured' },
    { label: 'Nghệ nhân', hash: 'artisans' },
    { label: 'Đóng góp tư liệu', hash: 'contribute' },
  ];

  return (
    <footer id="about" className="bg-primary-950 text-background-100 pt-16 pb-8">
      <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-background-50/10">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-500 text-foreground-950">
                <i className="ri-map-pin-line text-xl"></i>
              </div>
              <div>
                <div className="font-pacifico text-2xl text-background-50">Chạm Di Sản</div>
                <div className="text-[10px] tracking-widest uppercase text-background-200/70">Heritage Map · Việt Nam</div>
              </div>
            </div>
            <p className="text-sm text-background-200 max-w-md leading-relaxed">
              Nền tảng phi lợi nhuận số hóa di sản văn hóa và kết nối trực tiếp nghệ nhân bản địa với người tiêu dùng.
              Vì một ký ức Việt được giữ gìn - và một sinh kế bền vững cho cộng đồng.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialChannels.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} — ${s.handle}`}
                  title={`${s.label} — ${s.handle}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border text-background-50 transition-colors cursor-pointer ${s.brand}`}
                >
                  <i className={`${s.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Khám phá */}
          <div>
            <h4 className="font-heading text-background-50 mb-4">Khám phá</h4>
            <ul className="space-y-2 text-sm">
              {sections.map((l) => (
                <li key={l.hash}>
                  <button onClick={() => goToSection(l.hash)} className="hover:text-accent-400 cursor-pointer">
                    {l.label}
                  </button>
                </li>
              ))}
              <li>
                <Link to="/heritage-stories" className="hover:text-accent-400 cursor-pointer">
                  Câu chuyện di sản
                </Link>
              </li>
              <li>
                <Link to="/stories" className="hover:text-accent-400 cursor-pointer">
                  Tạp chí di sản
                </Link>
              </li>
            </ul>
          </div>

          {/* Dự án */}
          <div>
            <h4 className="font-heading text-background-50 mb-4">Dự án</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-accent-400 cursor-pointer">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="hover:text-accent-400 cursor-pointer">
                  Đóng góp tư liệu
                </Link>
              </li>
              <li>
                <Link to="/auth/login" className="hover:text-accent-400 cursor-pointer">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link to="/auth/register" className="hover:text-accent-400 cursor-pointer">
                  Trở thành nghệ nhân
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="font-heading text-background-50 mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><i className="ri-mail-line mt-0.5 text-accent-400"></i>hello@chamdisan.vn</li>
              <li className="flex items-start gap-2"><i className="ri-phone-line mt-0.5 text-accent-400"></i>+84 28 3822 0000</li>
              <li className="flex items-start gap-2"><i className="ri-map-pin-line mt-0.5 text-accent-400"></i>Số 15 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội</li>
            </ul>

            <div className="mt-5">
              <div className="text-[11px] tracking-widest uppercase text-background-200/60 mb-2.5">Theo dõi chúng tôi</div>
              <div className="flex flex-wrap items-center gap-2">
                {socialChannels.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-background-50 text-xs transition-colors cursor-pointer whitespace-nowrap ${s.brand}`}
                  >
                    <i className={`${s.icon} text-sm`}></i>
                    <span>{s.label}</span>
                    <i className="ri-arrow-right-up-line text-[11px] opacity-70"></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background-200/70">
          <div>© 2026 Chạm Di Sản. Bảo tồn di sản văn hóa Việt Nam.</div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-accent-400 cursor-pointer">Điều khoản</a>
            <a href="#" className="hover:text-accent-400 cursor-pointer">Bảo mật</a>
            <a href="#" className="hover:text-accent-400 cursor-pointer">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}