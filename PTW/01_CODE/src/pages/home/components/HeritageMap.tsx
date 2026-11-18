import { assetUrl } from '@/lib/asset-url';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories, regions } from '@/mocks/locations';
import { supabase } from '@/lib/supabase';
import type { HeritageLocation, LocationCategory } from '@/types/heritage';

const categoryStyles: Record<LocationCategory, { bg: string; ring: string; text: string; label: string; icon: string }> = {
  'craft-village': {
    bg: 'bg-primary-500',
    ring: 'ring-primary-300',
    text: 'text-primary-600',
    label: 'Làng nghề',
    icon: 'ri-hammer-line',
  },
  monument: {
    bg: 'bg-accent-500',
    ring: 'ring-accent-300',
    text: 'text-accent-700',
    label: 'Di tích',
    icon: 'ri-ancient-gate-line',
  },
  'ethnic-region': {
    bg: 'bg-secondary-500',
    ring: 'ring-secondary-300',
    text: 'text-secondary-700',
    label: 'Khu vực bản địa',
    icon: 'ri-community-line',
  },
};

interface ImageBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default function HeritageMap() {
  const [locations, setLocations] = useState<HeritageLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | LocationCategory>('all');
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [hovered, setHovered] = useState<HeritageLocation | null>(null);
  const [selected, setSelected] = useState<HeritageLocation | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgBox, setImgBox] = useState<ImageBox | null>(null);

  // Đo đúng vùng hiển thị của ảnh bản đồ (object-contain) để ghim luôn nằm
  // chính xác trên bản đồ, không bị "trôi" ra vùng trắng hai bên.
  const measureImageBox = useCallback(() => {
    const c = containerRef.current;
    const im = imgRef.current;
    if (!c || !im || !im.naturalWidth || !im.naturalHeight) return;
    const cw = c.clientWidth;
    const ch = c.clientHeight;
    if (!cw || !ch) return;
    const imageRatio = im.naturalWidth / im.naturalHeight;
    const containerRatio = cw / ch;
    let width = cw;
    let height = ch;
    if (imageRatio > containerRatio) {
      height = cw / imageRatio;
    } else {
      width = ch * imageRatio;
    }
    setImgBox({
      left: (cw - width) / 2,
      top: (ch - height) / 2,
      width,
      height,
    });
  }, []);

  useEffect(() => {
    measureImageBox();
    const c = containerRef.current;
    let ro: ResizeObserver | undefined;
    if (c && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measureImageBox());
      ro.observe(c);
    } else {
      window.addEventListener('resize', measureImageBox);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', measureImageBox);
    };
  }, [measureImageBox]);

  const load = () => {
    setLoading(true);
    setLoadError('');
    supabase
      .from('locations')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setLoadError(error.message);
          return;
        }
        setLocations((data as HeritageLocation[]) ?? []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return locations.filter((l) => {
      if (activeCategory !== 'all' && l.category !== activeCategory) return false;
      if (activeRegion !== 'all' && l.region !== activeRegion) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          l.name.toLowerCase().includes(q) ||
          l.province.toLowerCase().includes(q) ||
          (l.tags || []).some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [locations, activeCategory, activeRegion, query]);

  return (
    <section id="map" className="relative py-16 md:py-24 bg-background-50">
      <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
            Bản đồ tương tác
          </div>
          <h2 className="font-heading text-3xl md:text-5xl text-foreground-950 font-semibold">
            Chọn một điểm trên đất Việt
          </h2>
          <p className="mt-4 text-foreground-700 max-w-2xl mx-auto">
            Mỗi điểm định vị mở ra một câu chuyện, một thanh âm và một gian hàng thủ công của người bản địa.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2 p-1 bg-background-100 rounded-2xl sm:rounded-full">
            {categories.map((c) => {
              const active = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id as 'all' | LocationCategory)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap cursor-pointer transition-all inline-flex items-center gap-2 ${
                    active
                      ? c.id === 'craft-village'
                        ? 'bg-primary-500 text-background-50'
                        : c.id === 'monument'
                          ? 'bg-accent-500 text-foreground-950'
                          : c.id === 'ethnic-region'
                            ? 'bg-secondary-500 text-background-50'
                            : 'bg-foreground-900 text-background-50'
                      : 'text-foreground-700 hover:bg-background-200'
                  }`}
                >
                  <i className={c.icon}></i>
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 p-1 bg-background-100 rounded-2xl sm:rounded-full">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRegion(r.id)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                  activeRegion === r.id
                    ? 'bg-foreground-900 text-background-50'
                    : 'text-foreground-700 hover:bg-background-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex-1 relative min-w-[240px]">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground-500 text-sm"></i>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên làng, tỉnh, hoặc di sản..."
              className="w-full pl-10 pr-4 py-3 rounded-full bg-background-100 border border-background-200 text-sm text-foreground-800 placeholder:text-foreground-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div
              ref={containerRef}
              className="relative rounded-2xl overflow-hidden border border-background-200 bg-background-100 h-[420px] sm:h-[520px] md:h-[680px]"
            >
              <img
                ref={imgRef}
                onLoad={measureImageBox}
                src={assetUrl("https://public.readdy.ai/ai/img_res/edited_6cd5f474705cea5ccadd6e0c922415cd_7911b5b3.jpg")}
                alt="Bản đồ Việt Nam"
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain object-center select-none"
              />

              {/* Markers — nested inside the measured image box so they always
                  align with the map and never spill into the empty margins */}
              <div
                className="absolute"
                style={
                  imgBox
                    ? { left: imgBox.left, top: imgBox.top, width: imgBox.width, height: imgBox.height }
                    : { inset: 0 }
                }
              >
                {filtered.map((loc) => {
                  const style = categoryStyles[loc.category];
                  const isHovered = hovered?.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      style={{ left: `${Number(loc.x)}%`, top: `${Number(loc.y)}%` }}
                      onMouseEnter={() => setHovered(loc)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(loc)}
                      aria-label={loc.name}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    >
                      <span
                        className={`relative block w-3 h-3 rounded-full ${style.bg} ring-2 ring-background-50 shadow transition-transform group-hover:scale-125`}
                      >
                        <span className={`pin-pulse absolute inset-0 rounded-full ${style.text}`}></span>
                      </span>
                      {isHovered && (
                        <span
                          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-full -mt-2.5 whitespace-nowrap text-[11px] font-medium px-2 py-1 rounded-md ${style.bg} text-background-50 z-20`}
                        >
                          {loc.name}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Loading / error overlay */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background-50/60 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-foreground-600">
                    <span className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
                    Đang tải điểm di sản...
                  </div>
                </div>
              )}
              {!loading && loadError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background-50/80">
                  <i className="ri-error-warning-line text-4xl text-foreground-400 mb-2"></i>
                  <div className="text-sm text-foreground-600 mb-4">Không tải được dữ liệu bản đồ</div>
                  <button
                    onClick={load}
                    className="px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm cursor-pointer"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {/* Compass — chỉ hiện trên màn hình lớn, đặt ở vùng trống nên không che bản đồ */}
              <div className="hidden md:flex absolute top-4 right-4 w-12 h-12 items-center justify-center rounded-full bg-background-50/95 backdrop-blur border border-background-200 text-primary-600">
                <i className="ri-compass-3-line text-xl"></i>
              </div>
            </div>

            {/* Legend — đặt bên dưới bản đồ để không che tên khu vực (Hoàng Sa, Phú Quốc...) */}
            <div className="rounded-xl border border-background-200 bg-background-50 p-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="text-[11px] tracking-widest uppercase text-foreground-500">Chú thích</div>
              {(['craft-village', 'monument', 'ethnic-region'] as LocationCategory[]).map((c) => (
                <div key={c} className="flex items-center gap-2 text-xs text-foreground-800">
                  <span className={`w-3 h-3 rounded-full ${categoryStyles[c].bg}`}></span>
                  {categoryStyles[c].label}
                </div>
              ))}
              <div className="sm:ml-auto text-xs text-foreground-600">
                Đang hiển thị <span className="font-semibold text-primary-600">{filtered.length}</span> điểm di sản
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="rounded-2xl border border-background-200 bg-background-100 p-5 h-[520px] md:h-[680px] overflow-y-auto">
            {selected ? (
              <div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-xs text-foreground-600 hover:text-primary-600 inline-flex items-center gap-1 cursor-pointer mb-3"
                >
                  <i className="ri-arrow-left-line"></i> Quay lại danh sách
                </button>
                <div className="relative rounded-xl overflow-hidden h-48 mb-4">
                  <img src={assetUrl(selected.image)} alt={selected.name} className="w-full h-full object-cover object-top" />
                  <span className={`absolute top-3 left-3 px-2 py-1 rounded-md text-[11px] font-medium ${categoryStyles[selected.category].bg} text-background-50`}>
                    {categoryStyles[selected.category].label}
                  </span>
                </div>
                <div className="text-xs tracking-widest uppercase text-foreground-500 mb-1">{selected.province}</div>
                <h3 className="font-heading text-2xl text-foreground-950 mb-2">{selected.name}</h3>

                {selected.address && (
                  <div className="flex items-start gap-2 text-sm text-foreground-700 mb-3">
                    <i className="ri-map-pin-line text-primary-600 mt-0.5"></i>
                    <span>{selected.address}</span>
                  </div>
                )}

                <p className="text-sm text-foreground-700 leading-relaxed mb-4">{selected.summary}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selected.tags.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-secondary-100 text-secondary-800">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-lg bg-background-50 border border-background-200 p-3">
                    <div className="text-xs text-foreground-500">Nội dung số</div>
                    <div className="font-heading text-2xl text-primary-600">{selected.content_count}</div>
                  </div>
                  <div className="rounded-lg bg-background-50 border border-background-200 p-3">
                    <div className="text-xs text-foreground-500">Sản phẩm</div>
                    <div className="font-heading text-2xl text-secondary-700">{selected.product_count}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    to={`/location/${selected.slug}`}
                    className="w-full py-3 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Khám phá điểm này
                    <i className="ri-arrow-right-line"></i>
                  </Link>
                  {(selected.lat != null || selected.address) && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.address || selected.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-md bg-background-50 border border-background-200 hover:bg-background-100 text-foreground-800 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <i className="ri-map-pin-2-line"></i>
                      Xem trên Google Maps
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs tracking-widest uppercase text-foreground-500 mb-3">
                  {filtered.length} điểm hiển thị
                </div>
                <div className="space-y-3">
                  {filtered.map((loc) => {
                    const style = categoryStyles[loc.category];
                    return (
                      <button
                        key={loc.id}
                        onClick={() => setSelected(loc)}
                        className="w-full text-left rounded-xl bg-background-50 border border-background-200 hover:border-primary-300 p-3 flex gap-3 cursor-pointer transition-colors group"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <img src={assetUrl(loc.image)} alt={loc.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[10px] tracking-widest uppercase ${style.text} mb-0.5`}>
                            <i className={`${style.icon} mr-1`}></i>{style.label}
                          </div>
                          <div className="font-medium text-sm text-foreground-950 truncate group-hover:text-primary-600 transition-colors">
                            {loc.name}
                          </div>
                          <div className="text-xs text-foreground-500 truncate">{loc.address || loc.province}</div>
                          <div className="mt-1 flex items-center gap-3 text-[11px] text-foreground-600">
                            <span><i className="ri-file-text-line mr-1"></i>{loc.content_count}</span>
                            <span><i className="ri-shopping-bag-3-line mr-1"></i>{loc.product_count}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {filtered.length === 0 && !loading && (
                    <div className="text-center py-16 text-foreground-500 text-sm">
                      <i className="ri-search-eye-line text-4xl block mb-3 text-foreground-400"></i>
                      Không tìm thấy điểm di sản phù hợp.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}