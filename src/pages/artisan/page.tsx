import { assetUrl } from '@/lib/asset-url';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Seller, HeritageLocation } from '@/types/heritage';
import ContactModal from '@/components/feature/ContactModal';

export default function ArtisanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [location, setLocation] = useState<HeritageLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contact, setContact] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (err) throw err;
      if (!data) {
        setError('Không tìm thấy nghệ nhân này.');
        setLoading(false);
        return;
      }
      const s = data as Seller;
      setSeller(s);

      if (s.location_id) {
        const { data: loc, error: lErr } = await supabase
          .from('locations')
          .select('*')
          .eq('id', s.location_id)
          .maybeSingle();
        if (!lErr && loc) setLocation(loc as HeritageLocation);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background-50">
        <div className="flex flex-col items-center text-foreground-600">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-sm">Đang tải hồ sơ nghệ nhân...</div>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background-50 px-4">
        <div className="text-center max-w-md">
          <i className="ri-user-unfollow-line text-6xl text-foreground-300 block mb-4"></i>
          <h1 className="font-heading text-2xl text-foreground-950 mb-2">Không tìm thấy nghệ nhân</h1>
          <p className="text-foreground-600 text-sm mb-6">{error || 'Nghệ nhân này không tồn tại hoặc đã bị gỡ.'}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
          >
            <i className="ri-home-line"></i> Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const achievements: string[] = Array.isArray(seller.achievements) ? seller.achievements : [];

  return (
    <div className="bg-background-50 min-h-screen">
      {/* Hero hồ sơ nghệ nhân */}
      <section className="relative bg-secondary-950 overflow-hidden">
        <img
          src={assetUrl("https://readdy.ai/api/search-image?query=Subtle%20abstract%20textured%20background%20of%20aged%20handwoven%20natural%20hemp%20fabric%20in%20deep%20dark%20forest%20green%20and%20warm%20terracotta%20tones%2C%20soft%20fibers%20close%20up%2C%20cinematic%20moody%20lighting%2C%20muted%20heritage%20palette%2C%20editorial%20texture%20photography&width=1800&height=900&seq=artisan-detail-bg-01&orientation=landscape")}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
        />
        <div className="relative w-full px-4 md:px-10 max-w-[1440px] mx-auto py-14 md:py-20">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-background-200 hover:text-background-50 text-sm cursor-pointer transition-colors mb-8"
          >
            <i className="ri-arrow-left-line"></i> Quay lại
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="relative w-32 h-32 md:w-44 md:h-44 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-background-50/20">
              <img src={assetUrl(seller.avatar)} alt={seller.name} className="w-full h-full object-cover object-top" />
            </div>
            <div className="min-w-0">
              {seller.title && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500 text-foreground-950 text-xs font-semibold mb-4">
                  <i className="ri-verified-badge-fill"></i>
                  {seller.title}
                </div>
              )}
              <h1 className="font-heading text-3xl md:text-5xl text-background-50 font-semibold">{seller.name}</h1>
              {seller.craft && (
                <div className="mt-3 inline-flex items-center gap-2 text-background-200 text-base">
                  <i className="ri-hammer-line"></i> {seller.craft}
                </div>
              )}
              {location && (
                <div className="mt-3 text-background-200 text-sm">
                  <i className="ri-map-pin-line mr-1"></i>
                  {location.name}, {location.province}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto py-10 md:py-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính */}
        <div className="lg:col-span-2 space-y-8">
          {seller.bio && (
            <section className="rounded-2xl bg-background-50 border border-background-200 p-6 md:p-8">
              <h2 className="font-heading text-xl text-foreground-950 mb-4 flex items-center gap-2">
                <i className="ri-double-quotes-l text-primary-500"></i> Đôi nét về nghệ nhân
              </h2>
              <p className="text-foreground-700 leading-relaxed">{seller.bio}</p>
            </section>
          )}

          {seller.biography && (
            <section className="rounded-2xl bg-background-50 border border-background-200 p-6 md:p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold tracking-widest uppercase mb-5">
                <i className="ri-book-open-line"></i> Tiểu sử đầy đủ
              </div>
              <div className="text-foreground-700 leading-relaxed whitespace-pre-line">{seller.biography}</div>
            </section>
          )}

          {achievements.length > 0 && (
            <section className="rounded-2xl bg-background-50 border border-background-200 p-6 md:p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-800 text-xs font-semibold tracking-widest uppercase mb-5">
                <i className="ri-award-line"></i> Thành tích & ghi nhận
              </div>
              <ul className="space-y-4">
                {achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-accent-500 text-foreground-950 flex items-center justify-center text-sm font-semibold">
                      {i + 1}
                    </div>
                    <p className="text-foreground-700 leading-relaxed pt-1">{a}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Cột phụ */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-secondary-950 p-6 sticky top-24">
            <h3 className="font-heading text-lg text-background-50 mb-2">Muốn kết nối với {seller.name}?</h3>
            <p className="text-background-200 text-sm mb-5 leading-relaxed">
              Để lại thông tin, nghệ nhân sẽ liên hệ trực tiếp với bạn để trao đổi về sản phẩm và câu chuyện nghề.
            </p>
            <button
              onClick={() => setContact(true)}
              className="w-full py-3 rounded-md bg-accent-500 hover:bg-accent-400 text-foreground-950 text-sm font-semibold cursor-pointer transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <i className="ri-mail-send-line"></i> Để lại thông tin liên hệ
            </button>
          </div>

          {location && (
            <Link
              to={`/location/${location.slug}`}
              className="block rounded-2xl bg-background-50 border border-background-200 p-6 hover:border-primary-300 transition-colors group"
            >
              <div className="text-xs font-semibold tracking-widest uppercase text-foreground-500 mb-3">Điểm di sản liên quan</div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={assetUrl(location.image)} alt={location.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <div className="font-heading text-foreground-950 group-hover:text-primary-600 transition-colors">{location.name}</div>
                  <div className="text-xs text-foreground-500 mt-1">{location.province}</div>
                </div>
              </div>
            </Link>
          )}
        </aside>
      </div>

      {contact && (
        <ContactModal
          sellerName={seller.name}
          sellerId={seller.id}
          onClose={() => setContact(false)}
        />
      )}
    </div>
  );
}