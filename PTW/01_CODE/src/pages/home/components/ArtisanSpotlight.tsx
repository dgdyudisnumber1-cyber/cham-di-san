import { assetUrl } from '@/lib/asset-url';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ContactModal from '@/components/feature/ContactModal';
import { supabase } from '@/lib/supabase';
import type { Seller, HeritageLocation } from '@/types/heritage';

export default function ArtisanSpotlight() {
  const [artisans, setArtisans] = useState<Seller[]>([]);
  const [locations, setLocations] = useState<Record<number, HeritageLocation>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contact, setContact] = useState<{ id: number; name: string } | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: sellers, error: sErr } = await supabase
        .from('sellers')
        .select('*')
        .order('id', { ascending: true });
      if (sErr) throw sErr;

      const { data: locs, error: lErr } = await supabase
        .from('locations')
        .select('id, name, province');
      if (lErr) throw lErr;

      const map: Record<number, HeritageLocation> = {};
      (locs ?? []).forEach((l) => {
        map[l.id] = l as HeritageLocation;
      });

      setArtisans((sellers as Seller[]) ?? []);
      setLocations(map);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const placeOf = (s: Seller): string => {
    if (s.location_id && locations[s.location_id]) {
      const loc = locations[s.location_id];
      return `${loc.name}, ${loc.province}`;
    }
    return '';
  };

  return (
    <section id="artisans" className="py-16 md:py-24 bg-secondary-950 relative overflow-hidden">
      <img
        src={assetUrl("https://readdy.ai/api/search-image?query=Subtle%20abstract%20textured%20background%20of%20aged%20handwoven%20natural%20hemp%20fabric%20in%20deep%20dark%20forest%20green%20and%20warm%20terracotta%20tones%2C%20soft%20fibers%20close%20up%2C%20cinematic%20moody%20lighting%2C%20muted%20heritage%20palette%2C%20editorial%20texture%20photography&width=1800&height=1000&seq=artisan-bg-texture-01&orientation=landscape")}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center opacity-15"
      />
      <div className="relative w-full px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-800 text-secondary-100 text-xs tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400"></span>
              Chân dung nghệ nhân
            </div>
            <h2 className="font-heading text-3xl md:text-5xl text-background-50 font-semibold max-w-2xl">
              Những đôi tay giữ lửa
            </h2>
            <p className="mt-4 text-background-200 max-w-2xl">
              Gặp gỡ những nghệ nhân có thật - bằng danh hiệu, tiểu sử và thành tích được ghi nhận - đang ngày đêm giữ gìn nghề thủ công Việt.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-background-200">
            <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-sm">Đang tải chân dung nghệ nhân...</div>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <i className="ri-error-warning-line text-5xl text-background-300 block mb-4"></i>
            <h3 className="font-heading text-2xl text-background-50 mb-2">Có lỗi khi tải nghệ nhân</h3>
            <p className="text-background-300 text-sm mb-6">{error}</p>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent-500 hover:bg-accent-400 text-foreground-950 text-sm font-medium cursor-pointer transition-colors"
            >
              <i className="ri-refresh-line"></i> Thử lại
            </button>
          </div>
        ) : artisans.length === 0 ? (
          <div className="py-20 text-center text-background-300">
            <i className="ri-user-heart-line text-5xl block mb-4"></i>
            <p className="text-sm">Chưa có chân dung nghệ nhân nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisans.map((a) => (
              <article key={a.id} className="group rounded-2xl overflow-hidden bg-background-50">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={assetUrl(a.avatar)}
                    alt={a.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {a.title && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-background-50/95 text-foreground-900 text-[11px] font-medium">
                      {a.title}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {a.craft && (
                    <div className="text-[11px] tracking-widest uppercase text-primary-600 mb-1">{a.craft}</div>
                  )}
                  <Link to={`/artisan/${a.id}`} className="block group">
                    <h3 className="font-heading text-xl text-foreground-950 mb-1 group-hover:text-primary-600 transition-colors">{a.name}</h3>
                  </Link>
                  {placeOf(a) && (
                    <div className="text-xs text-foreground-500 mb-3">
                      <i className="ri-map-pin-line mr-1"></i>{placeOf(a)}
                    </div>
                  )}
                  {a.bio && (
                    <p className="text-sm text-foreground-700 italic leading-relaxed border-l-2 border-accent-500 pl-3 mb-4">
                      {a.bio}
                    </p>
                  )}
                  {a.achievements && a.achievements.length > 0 && (
                    <ul className="space-y-1.5 mb-4">
                      {a.achievements.slice(0, 2).map((ach, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground-600">
                          <i className="ri-award-line text-accent-500 mt-0.5"></i>
                          <span className="leading-relaxed">{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="space-y-2.5">
                    <Link
                      to={`/artisan/${a.id}`}
                      className="w-full py-2.5 rounded-md border border-background-300 hover:border-primary-400 hover:bg-primary-100/50 text-foreground-800 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <i className="ri-user-star-line"></i> Xem đầy đủ tiểu sử & thành tích
                    </Link>
                    <button
                      onClick={() => setContact({ id: a.id, name: a.name })}
                      className="w-full py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <i className="ri-mail-send-line"></i> Để lại thông tin liên hệ
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {contact && (
        <ContactModal
          sellerName={contact.name}
          sellerId={contact.id}
          onClose={() => setContact(null)}
        />
      )}
    </section>
  );
}