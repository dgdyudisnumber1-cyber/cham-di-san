import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import { supabase } from '@/lib/supabase';
import type { HeritageContent, HeritageLocation, Seller } from '@/types/heritage';
import LocationHero from './components/LocationHero';
import ContentTabs from './components/ContentTabs';
import SellerCard from './components/SellerCard';
import LocationMap from './components/LocationMap';

export default function LocationDetail() {
  const { slug } = useParams();
  const [location, setLocation] = useState<HeritageLocation | null>(null);
  const [contents, setContents] = useState<HeritageContent[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data: loc, error: locErr } = await supabase
        .from('locations')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (locErr) throw locErr;
      if (!loc) {
        setError('not_found');
        return;
      }

      setLocation(loc as HeritageLocation);

      const [cRes, sRes] = await Promise.all([
        supabase
          .from('heritage_content')
          .select('*')
          .eq('location_id', (loc as HeritageLocation).id)
          .order('created_at', { ascending: true }),
        supabase
          .from('sellers')
          .select('*')
          .eq('location_id', (loc as HeritageLocation).id),
      ]);

      if (cRes.error) throw cRes.error;
      if (sRes.error) throw sRes.error;

      setContents((cRes.data as HeritageContent[]) ?? []);
      setSellers((sRes.data as Seller[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="w-full bg-background-50 overflow-x-hidden">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-24 px-4 md:px-10 max-w-[1440px] mx-auto">
        <nav className="flex items-center gap-2 text-sm text-foreground-500">
          <Link to="/" className="hover:text-primary-600 cursor-pointer inline-flex items-center gap-1">
            <i className="ri-home-4-line"></i>
            Trang chủ
          </Link>
          <i className="ri-arrow-right-s-line"></i>
          <Link to="/" state={{ scrollTo: 'map' }} className="hover:text-primary-600 cursor-pointer">
            Bản đồ di sản
          </Link>
          {location && (
            <>
              <i className="ri-arrow-right-s-line"></i>
              <span className="text-foreground-900 font-medium">{location.name}</span>
            </>
          )}
        </nav>
      </div>

      <main>
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-foreground-500">
            <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-sm">Đang tải điểm di sản...</div>
          </div>
        ) : error === 'not_found' ? (
          <div className="py-32 text-center">
            <i className="ri-emotion-sad-line text-5xl text-foreground-400 block mb-4"></i>
            <h1 className="font-heading text-2xl text-foreground-950 mb-2">Không tìm thấy điểm di sản</h1>
            <p className="text-foreground-600 text-sm mb-6">Điểm bạn tìm có thể đã bị di chuyển hoặc không tồn tại.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors"
            >
              <i className="ri-arrow-left-line"></i>
              Quay về trang chủ
            </Link>
          </div>
        ) : error ? (
          <div className="py-32 text-center">
            <i className="ri-error-warning-line text-5xl text-foreground-400 block mb-4"></i>
            <h1 className="font-heading text-2xl text-foreground-950 mb-2">Có lỗi khi tải dữ liệu</h1>
            <p className="text-foreground-600 text-sm mb-6">{error}</p>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors"
            >
              <i className="ri-refresh-line"></i>
              Thử lại
            </button>
          </div>
        ) : location ? (
          <>
            <LocationHero location={location} />
            <LocationMap location={location} />
            <ContentTabs contents={contents} />
            <SellerCard sellers={sellers} />
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}