import { assetUrl } from '@/lib/asset-url';
import { Link } from 'react-router-dom';
import { locations } from '@/mocks/locations';

export default function FeaturedLocations() {
  const featured = locations.slice(0, 6);

  return (
    <section id="featured" className="py-16 md:py-24 bg-background-100">
      <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-800 text-xs tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
              Điểm di sản nổi bật
            </div>
            <h2 className="font-heading text-3xl md:text-5xl text-foreground-950 font-semibold max-w-2xl">
              Nơi câu chuyện chưa bao giờ ngủ yên
            </h2>
          </div>
          <a href="#map" className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap">
            Xem toàn bộ bản đồ <i className="ri-arrow-right-line"></i>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((loc, idx) => (
            <Link
              key={loc.id}
              to={`/location/${loc.id}`}
              className={`group relative rounded-2xl overflow-hidden bg-background-50 border border-background-200 cursor-pointer transition-transform hover:-translate-y-1 block ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${idx === 0 ? 'h-96 lg:h-[560px]' : 'h-64'}`}>
                <img
                  src={assetUrl(loc.image)}
                  alt={loc.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/85 via-foreground-950/30 to-transparent"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2 py-1 rounded-md bg-background-50/95 text-foreground-900 text-[11px] font-medium">
                    {loc.province}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <div className="text-[11px] tracking-widest uppercase text-accent-300 mb-2">
                    {loc.tags[0]}
                  </div>
                  <h3 className={`font-heading text-background-50 font-semibold ${idx === 0 ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
                    {loc.name}
                  </h3>
                  <p className={`mt-2 text-background-100/90 leading-relaxed ${idx === 0 ? 'text-sm md:text-base line-clamp-3' : 'text-xs line-clamp-2'}`}>
                    {loc.summary}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-background-100">
                    <span><i className="ri-file-text-line mr-1"></i>{loc.contentCount} tư liệu</span>
                    <span><i className="ri-shopping-bag-3-line mr-1"></i>{loc.productCount} sản phẩm</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}