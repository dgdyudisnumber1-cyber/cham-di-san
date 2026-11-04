import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const apply = () => {
      setIsCompact(mq.matches);
      if (!mq.matches) setMobileOpen(false);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const sections = [
    { label: 'Bản đồ di sản', hash: 'map' },
    { label: 'Làng nghề', hash: 'featured' },
    { label: 'Nghệ nhân', hash: 'artisans' },
    { label: 'Đóng góp', hash: 'contribute' },
  ];

  const pageLinks = [
    { label: 'Câu chuyện di sản', to: '/heritage-stories' },
    { label: 'Tạp chí di sản', to: '/stories' },
    { label: 'Về dự án', to: '/about' },
  ];

  const goToSection = (hash: string) => {
    setMobileOpen(false);
    if (location.pathname === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: hash } });
    }
  };

  const onHome = location.pathname === '/';
  // Trên màn hình nhỏ luôn dùng nền đặc để chữ và menu luôn rõ ràng.
  const solid = scrolled || !onHome || mobileOpen || isCompact;

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email?.split('@')[0] || 'Bạn';

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid ? 'bg-background-50/95 backdrop-blur border-b border-background-200' : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 md:px-10 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-background-50 flex-shrink-0">
            <i className="ri-map-pin-line text-xl"></i>
          </div>
          <div className="leading-tight">
            <div className={`font-pacifico text-xl ${solid ? 'text-primary-600' : 'text-background-50 drop-shadow'}`}>
              Chạm Di Sản
            </div>
            <div
              className={`text-[10px] tracking-widest uppercase ${
                solid ? 'text-foreground-500' : 'text-background-100/90'
              }`}
            >
              Heritage Map · Việt Nam
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {sections.map((n) => (
            <button
              key={n.label}
              onClick={() => goToSection(n.hash)}
              className={`text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                solid ? 'text-foreground-700 hover:text-primary-600' : 'text-background-50 hover:text-accent-300'
              }`}
            >
              {n.label}
            </button>
          ))}
          {pageLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                solid ? 'text-foreground-700 hover:text-primary-600' : 'text-background-50 hover:text-accent-300'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/search"
            aria-label="Tìm kiếm"
            className={`w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
              solid ? 'text-foreground-700 hover:bg-background-100' : 'text-background-50 hover:bg-background-50/10'
            }`}
          >
            <i className="ri-search-line text-lg"></i>
          </Link>
          {loading ? (
            <span className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
          ) : user ? (
            <>
              <Link
                to="/account"
                className={`text-sm font-medium whitespace-nowrap transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  solid ? 'text-foreground-700' : 'text-background-50'
                }`}
              >
                <i className="ri-user-3-line"></i>
                {displayName}
              </Link>
              <button
                onClick={handleSignOut}
                className={`text-sm px-4 py-2 rounded-md whitespace-nowrap cursor-pointer transition-colors border ${
                  solid
                    ? 'text-foreground-700 border-background-200 hover:bg-background-100'
                    : 'text-background-50 border-background-50/30 hover:bg-background-50/10'
                }`}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className={`text-sm px-3 py-2 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                  solid ? 'text-foreground-700 hover:bg-background-100' : 'text-background-50 hover:bg-background-50/10'
                }`}
              >
                Đăng nhập
              </Link>
              <Link
                to="/auth/register"
                className="text-sm px-4 py-2 rounded-md bg-primary-500 text-background-50 hover:bg-primary-600 whitespace-nowrap cursor-pointer transition-colors"
              >
                Trở thành nghệ nhân
              </Link>
            </>
          )}
        </div>

        <button
          className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-md cursor-pointer ${
            solid ? 'text-foreground-800' : 'text-background-50'
          }`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <i className={`text-2xl ${mobileOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background-50 border-t border-background-200 px-4 py-4 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          <div className="text-[11px] tracking-widest uppercase text-foreground-500 mb-3">Khám phá</div>
          <div className="space-y-1">
            <Link
              to="/search"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm text-foreground-800 hover:text-primary-600 cursor-pointer py-2"
            >
              <i className="ri-search-line"></i>
              Tìm kiếm
            </Link>
            {sections.map((n) => (
              <button
                key={n.label}
                onClick={() => goToSection(n.hash)}
                className="flex w-full items-center gap-2 text-left text-sm text-foreground-800 hover:text-primary-600 cursor-pointer py-2"
              >
                <i className="ri-arrow-right-s-line text-foreground-400"></i>
                {n.label}
              </button>
            ))}
            {pageLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm text-foreground-800 hover:text-primary-600 cursor-pointer py-2"
              >
                <i className="ri-arrow-right-s-line text-foreground-400"></i>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-background-200">
            <div className="text-[11px] tracking-widest uppercase text-foreground-500 mb-3">Tài khoản</div>
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <div className="text-sm text-foreground-700 mb-1">
                    Xin chào, <span className="font-medium text-foreground-950">{displayName}</span>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-sm px-4 py-2.5 rounded-md bg-primary-500 text-background-50 whitespace-nowrap cursor-pointer text-center"
                  >
                    Tài khoản của tôi
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-sm px-4 py-2.5 rounded-md border border-background-200 text-foreground-800 whitespace-nowrap cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-sm px-4 py-2.5 rounded-md border border-background-300 text-foreground-800 whitespace-nowrap cursor-pointer text-center"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-sm px-4 py-2.5 rounded-md bg-primary-500 text-background-50 whitespace-nowrap cursor-pointer text-center"
                  >
                    Trở thành nghệ nhân
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}