import { assetUrl } from '@/lib/asset-url';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen flex bg-background-50">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={assetUrl("https://readdy.ai/api/search-image?query=Atmospheric%20heritage%20scene%20of%20ancient%20Vietnamese%20temple%20gate%20with%20weathered%20terracotta%20red%20walls%20and%20golden%20curved%20roof%2C%20soft%20morning%20mist%2C%20warm%20amber%20and%20earthy%20muted%20tones%2C%20cinematic%20architectural%20photography%2C%20painterly%20nostalgic%20light%2C%20editorial%20magazine%20quality&width=1200&height=1600&seq=auth-panel-01&orientation=portrait")}
          alt="Di sản văn hóa Việt Nam"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/85 via-foreground-950/40 to-foreground-950/20"></div>

        <div className="relative z-10 flex flex-col justify-between w-full p-10">
          <Link to="/" className="inline-flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-background-50">
              <i className="ri-map-pin-line text-xl"></i>
            </div>
            <div className="leading-tight">
              <div className="font-pacifico text-xl text-background-50">Chạm Di Sản</div>
              <div className="text-[10px] tracking-widest uppercase text-background-100/90">Heritage Map · Việt Nam</div>
            </div>
          </Link>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-50/15 backdrop-blur border border-background-50/20 text-background-50 text-xs tracking-widest uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400"></span>
              Bảo tồn & Giao thương bản địa
            </div>
            <h2 className="font-heading text-3xl md:text-4xl text-background-50 font-semibold leading-tight">
              Góp một tay giữ gìn ký ức của làng, của núi, của người.
            </h2>
            <p className="mt-4 text-background-200 leading-relaxed">
              Tạo tài khoản để lưu lại những điểm di sản yêu thích, đóng góp tư liệu
              và kết nối trực tiếp với nghệ nhân bản địa.
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-10 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8 cursor-pointer">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-500 text-background-50">
              <i className="ri-map-pin-line text-lg"></i>
            </div>
            <span className="font-pacifico text-lg text-primary-600">Chạm Di Sản</span>
          </Link>

          <h1 className="font-heading text-3xl md:text-4xl text-foreground-950 font-semibold">{title}</h1>
          <p className="mt-3 text-foreground-600 leading-relaxed">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-8">{footer}</div>}
        </div>
      </div>
    </div>
  );
}