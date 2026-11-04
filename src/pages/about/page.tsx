import { assetUrl } from '@/lib/asset-url';
import { Link } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';

const values = [
  {
    icon: 'ri-shield-check-line',
    tone: 'primary',
    title: 'Xác thực & Minh bạch',
    desc: 'Tách bạch rõ ràng giữa dữ liệu sử liệu xác thực và văn hóa dân gian truyền miệng, để người dùng tự mình phân biệt.',
  },
  {
    icon: 'ri-hand-heart-line',
    tone: 'accent',
    title: 'Lợi ích về đúng tay',
    desc: 'Không trung gian, không đại lý. Nghệ nhân bản địa nhận trọn giá trị lao động từ chính bàn tay họ làm ra.',
  },
  {
    icon: 'ri-community-line',
    tone: 'secondary',
    title: 'Cộng đồng cùng giữ lửa',
    desc: 'Bất kỳ ai cũng có thể đóng góp tư liệu, câu chuyện và ký ức về làng quê, dưới sự kiểm duyệt của quản trị viên.',
  },
];

const stats = [
  { n: '340+', l: 'Điểm di sản' },
  { n: '54', l: 'Dân tộc anh em' },
  { n: '1.2k', l: 'Nghệ nhân' },
  { n: '8.5k', l: 'Sản phẩm thủ công' },
];

export default function About() {
  return (
    <div className="w-full bg-background-50 overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-24">
        <div className="relative h-[360px] md:h-[460px] overflow-hidden">
          <img
            src={assetUrl("https://readdy.ai/api/search-image?query=Panoramic%20aerial%20view%20of%20Vietnamese%20heritage%20landscape%20with%20ancient%20temple%2C%20terraced%20rice%20fields%20and%20misty%20mountains%20at%20golden%20hour%2C%20warm%20amber%20and%20terracotta%20earth%20tones%2C%20soft%20atmospheric%20fog%2C%20cinematic%20cultural%20landscape%20photography%2C%20muted%20painterly%20palette%2C%20editorial%20magazine%20quality&width=1800&height=900&seq=about-hero-01&orientation=landscape")}
            alt="Cảnh quan di sản Việt Nam"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/85 via-foreground-950/40 to-foreground-950/20"></div>
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto pb-12">
              <h1 className="font-heading text-4xl md:text-6xl text-background-50 font-semibold">
                Về Chạm Di Sản
              </h1>
              <p className="mt-4 text-background-200 max-w-2xl">
                Nền tảng phi lợi nhuận số hóa di sản văn hóa Việt Nam và kết nối trực tiếp nghệ nhân bản địa với người tiêu dùng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 bg-background-50">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs tracking-widest uppercase mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Sứ mệnh của chúng tôi
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground-950 font-semibold leading-tight">
                Vì một ký ức Việt được giữ gìn — và một sinh kế bền vững cho cộng đồng.
              </h2>
              <p className="mt-6 text-foreground-700 leading-relaxed">
                Mỗi làng nghề, mỗi di tích, mỗi bản làng đều mang trong mình những câu chuyện
                được kể qua bao thế hệ. Nhưng nhiều câu chuyện đang dần mai một theo thời gian,
                theo những đôi tay già đi mỗi ngày.
              </p>
              <p className="mt-4 text-foreground-700 leading-relaxed">
                Chạm Di Sản ra đời để ghi lại những ký ức ấy bằng chữ, bằng tiếng, bằng hình ảnh —
                và quan trọng hơn, tạo ra một cầu nối trực tiếp để người làm nghề có thể sống
                được bằng chính nghề của mình.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-background-200 h-[420px]">
              <img
                src={assetUrl("https://readdy.ai/api/search-image?query=Close%20up%20of%20elderly%20Vietnamese%20artisan%20hands%20weaving%20traditional%20bamboo%20basket%20with%20warm%20natural%20window%20light%2C%20weathered%20hands%20with%20stories%2C%20muted%20earthy%20heritage%20palette%2C%20documentary%20cultural%20photography%2C%20cinematic%20warm%20atmosphere%2C%20shallow%20depth%20of%20field&width=900&height=1100&seq=about-mission-01&orientation=portrait")}
                alt="Đôi tay nghệ nhân Việt Nam"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-primary-950">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="font-heading text-3xl md:text-4xl text-accent-300">{s.n}</div>
                <div className="mt-1 text-xs tracking-widest uppercase text-background-200/80">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-background-100">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-100 text-secondary-800 text-xs tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-500"></span>
              Giá trị cốt lõi
            </div>
            <h2 className="font-heading text-3xl md:text-5xl text-foreground-950 font-semibold">
              Điều chúng tôi theo đuổi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => {
              const toneMap: Record<string, { bg: string; ring: string }> = {
                primary: { bg: 'bg-primary-500', ring: 'ring-primary-200' },
                accent: { bg: 'bg-accent-500', ring: 'ring-accent-200' },
                secondary: { bg: 'bg-secondary-500', ring: 'ring-secondary-200' },
              };
              const t = toneMap[v.tone];
              return (
                <div key={v.title} className="rounded-2xl bg-background-50 border border-background-200 p-7">
                  <div className={`w-14 h-14 flex items-center justify-center rounded-full ${t.bg} text-background-50 ring-8 ${t.ring} mb-5`}>
                    <i className={`${v.icon} text-2xl`}></i>
                  </div>
                  <h3 className="font-heading text-xl text-foreground-950 mb-3">{v.title}</h3>
                  <p className="text-sm text-foreground-700 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background-50">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground-950 font-semibold">
            Sẵn sàng chạm vào ký ức?
          </h2>
          <p className="mt-4 text-foreground-700 max-w-xl mx-auto">
            Bắt đầu khám phá bản đồ di sản, hoặc góp một tay gìn giữ ký ức của làng quê bạn.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="px-6 py-3 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center gap-2"
            >
              <i className="ri-map-2-line"></i> Mở bản đồ di sản
            </Link>
            <Link
              to="/contribute"
              className="px-6 py-3 rounded-md bg-background-100 hover:bg-background-200 text-foreground-800 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center gap-2"
            >
              <i className="ri-quill-pen-line"></i> Đóng góp tư liệu
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-background-200">
            <div className="text-[11px] tracking-widest uppercase text-foreground-500 mb-4">
              Theo dõi hành trình của chúng tôi
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61594814327595"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-background-100 border border-background-200 text-foreground-800 text-xs hover:bg-secondary-500 hover:text-background-50 hover:border-secondary-500 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-facebook-circle-fill text-base"></i>
                <span>Facebook · Chạm Di Sản</span>
                <i className="ri-arrow-right-up-line text-xs opacity-70"></i>
              </a>
              <a
                href="https://www.tiktok.com/@chamdisan?_r=1&_t=ZS-9AXJKpoIJXw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-background-100 border border-background-200 text-foreground-800 text-xs hover:bg-secondary-500 hover:text-background-50 hover:border-secondary-500 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-tiktok-fill text-base"></i>
                <span>TikTok · @chamdisan</span>
                <i className="ri-arrow-right-up-line text-xs opacity-70"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}