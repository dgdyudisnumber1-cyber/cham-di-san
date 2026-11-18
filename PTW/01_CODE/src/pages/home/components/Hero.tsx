import { assetUrl } from '@/lib/asset-url';
import SearchBar from '@/components/feature/SearchBar';

const stats = [
  { n: '340+', l: 'Điểm di sản' },
  { n: '54', l: 'Dân tộc' },
  { n: '1.2k', l: 'Nghệ nhân' },
  { n: '8.5k', l: 'Sản phẩm' },
];

export default function Hero() {
  return (
    <section className="relative w-full min-h-[720px] md:h-[800px] overflow-hidden flex">
      <img
        src={assetUrl("https://readdy.ai/api/search-image?query=Aerial%20cinematic%20view%20of%20misty%20terraced%20rice%20fields%20in%20northern%20Vietnam%20at%20golden%20hour%2C%20small%20traditional%20wooden%20stilt%20houses%20nestled%20in%20valley%2C%20warm%20amber%20and%20terracotta%20earth%20tones%2C%20soft%20fog%20drifting%20over%20mountains%2C%20heritage%20cultural%20landscape%20photography%2C%20muted%20painterly%20atmospheric%20light%2C%20editorial%20magazine%20quality&width=1800&height=1000&seq=hero-cham-di-san-01&orientation=landscape")}
        alt="Di sản văn hóa Việt Nam"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground-950/60 via-foreground-950/40 to-foreground-950/70"></div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 py-24 md:py-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background-50/15 backdrop-blur border border-background-50/20 text-background-50 text-xs tracking-widest uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-400"></span>
          Bản đồ số di sản văn hóa Việt Nam
        </div>
        <h1 className="font-heading text-background-50 text-4xl md:text-6xl lg:text-[calc(4.5rem_+_8px)] font-extrabold leading-tight max-w-4xl">
          Chạm vào ký ức
        </h1>
        <p className="mt-6 max-w-2xl text-background-100 text-base md:text-lg leading-relaxed">
          Khám phá làng nghề, di tích và bản làng của 54 dân tộc anh em qua bản đồ tương tác.
          Nghe truyền thuyết, đọc sử liệu, và mua trực tiếp sản phẩm thủ công từ chính bàn tay nghệ nhân bản địa.
        </p>

        <div className="mt-9 w-full px-4">
          <SearchBar />
        </div>

        <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
          <a
            href="#map"
            className="px-6 py-3 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center gap-2"
          >
            <i className="ri-map-2-line"></i>
            Mở bản đồ di sản
          </a>
          <a
            href="#contribute"
            className="px-6 py-3 rounded-md bg-background-50/10 hover:bg-background-50/20 backdrop-blur border border-background-50/30 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center gap-2"
          >
            <i className="ri-quill-pen-line"></i>
            Đóng góp tư liệu
          </a>
        </div>

        <div className="mt-10 md:mt-0 grid grid-cols-2 gap-x-8 gap-y-5 w-full max-w-md px-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-12 md:absolute md:bottom-8 md:left-0 md:right-0 md:max-w-none text-background-50">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-heading text-2xl md:text-3xl text-accent-300">{s.n}</div>
              <div className="text-[11px] md:text-xs tracking-widest uppercase text-background-100/90">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}