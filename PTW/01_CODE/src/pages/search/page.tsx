import { assetUrl } from '@/lib/asset-url';
import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import SearchBar from '@/components/feature/SearchBar';
import { supabase } from '@/lib/supabase';
import { categoryMeta } from '@/lib/heritage-ui';
import type { Article, HeritageLocation, Seller } from '@/types/heritage';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';

  const [locations, setLocations] = useState<HeritageLocation[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [locationSlugs, setLocationSlugs] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = useCallback(async (query: string) => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const pattern = `%${query}%`;
      const [lRes, aRes, sRes, allLocs] = await Promise.all([
        supabase
          .from('locations')
          .select('*')
          .or(`name.ilike.${pattern},province.ilike.${pattern},summary.ilike.${pattern}`)
          .limit(20),
        supabase
          .from('articles')
          .select('*')
          .or(`title.ilike.${pattern},excerpt.ilike.${pattern}`)
          .limit(20),
        supabase
          .from('sellers')
          .select('*')
          .or(`name.ilike.${pattern},bio.ilike.${pattern}`)
          .limit(20),
        supabase.from('locations').select('id,slug'),
      ]);

      if (lRes.error) throw lRes.error;
      if (aRes.error) throw aRes.error;
      if (sRes.error) throw sRes.error;
      if (allLocs.error) throw allLocs.error;

      setLocations((lRes.data as HeritageLocation[]) ?? []);
      setArticles((aRes.data as Article[]) ?? []);
      setSellers((sRes.data as Seller[]) ?? []);

      const map: Record<number, string> = {};
      ((allLocs.data as { id: number; slug: string }[]) ?? []).forEach((l) => {
        map[l.id] = l.slug;
      });
      setLocationSlugs(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    run(q);
  }, [q, run]);

  const total = locations.length + articles.length + sellers.length;

  return (
    <div className="w-full bg-background-50 overflow-x-hidden">
      <Header />

      <section className="pt-24 pb-10 bg-background-100">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto text-center">
          <h1 className="font-heading text-3xl md:text-4xl text-foreground-950 font-semibold">Tìm kiếm di sản</h1>
          <p className="mt-3 text-foreground-600 text-sm md:text-base">
            Tìm điểm di sản, bài viết và nghệ nhân khắp Việt Nam.
          </p>
          <div className="mt-6 flex justify-center">
            <SearchBar variant="plain" />
          </div>
          {q && !loading && (
            <p className="mt-5 text-sm text-foreground-600">
              Kết quả cho “<span className="font-medium text-foreground-900">{q}</span>” ·{' '}
              <span className="font-medium text-primary-600">{total}</span> kết quả
            </p>
          )}
        </div>
      </section>

      <main className="py-12 md:py-16">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-foreground-500">
              <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-sm">Đang tìm kiếm...</div>
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <i className="ri-error-warning-line text-5xl text-foreground-400 block mb-4"></i>
              <h2 className="font-heading text-2xl text-foreground-950 mb-2">Có lỗi khi tìm kiếm</h2>
              <p className="text-foreground-600 text-sm mb-6">{error}</p>
            </div>
          ) : !q ? (
            <div className="py-20 text-center text-foreground-500">
              <i className="ri-search-line text-5xl text-foreground-300 block mb-4"></i>
              <p className="text-sm">Nhập từ khóa để bắt đầu tìm kiếm.</p>
            </div>
          ) : total === 0 ? (
            <div className="py-24 text-center text-foreground-500">
              <i className="ri-emotion-sad-line text-5xl text-foreground-300 block mb-4"></i>
              <p className="text-sm">Không tìm thấy kết quả nào cho từ khóa này. Thử từ khóa khác nhé!</p>
            </div>
          ) : (
            <div className="space-y-14">
              {locations.length > 0 && (
                <section>
                  <h2 className="font-heading text-xl md:text-2xl text-foreground-950 font-semibold mb-6 flex items-center gap-2">
                    <i className="ri-map-pin-line text-primary-600"></i> Điểm di sản ({locations.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map((l) => {
                      const meta = categoryMeta[l.category];
                      return (
                        <Link
                          key={l.id}
                          to={`/location/${l.slug}`}
                          className="group rounded-2xl overflow-hidden border border-background-200 bg-background-50 cursor-pointer transition-transform hover:-translate-y-1"
                        >
                          <div className="relative h-44 overflow-hidden">
                            <img src={assetUrl(l.image)} alt={l.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                            <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${meta.badge}`}>
                              <i className={meta.icon}></i> {meta.label}
                            </span>
                          </div>
                          <div className="p-5">
                            <h3 className="font-heading text-lg text-foreground-950 leading-snug group-hover:text-primary-600 transition-colors">{l.name}</h3>
                            <div className="mt-2 text-xs text-foreground-500">
                              <i className="ri-map-pin-line mr-1"></i>{l.province}
                            </div>
                            <p className="mt-3 text-sm text-foreground-600 leading-relaxed line-clamp-2">{l.summary}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {articles.length > 0 && (
                <section>
                  <h2 className="font-heading text-xl md:text-2xl text-foreground-950 font-semibold mb-6 flex items-center gap-2">
                    <i className="ri-article-line text-accent-600"></i> Bài viết ({articles.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((a) => (
                      <Link
                        key={a.id}
                        to={`/story/${a.slug}`}
                        className="group rounded-2xl overflow-hidden border border-background-200 bg-background-50 cursor-pointer transition-transform hover:-translate-y-1"
                      >
                        <div className="relative h-44 overflow-hidden">
                          <img src={assetUrl(a.cover_image)} alt={a.title} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                          <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-background-50/95 text-foreground-900 text-[11px] font-medium">{a.category}</span>
                        </div>
                        <div className="p-5">
                          <h3 className="font-heading text-lg text-foreground-950 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">{a.title}</h3>
                          <p className="mt-2 text-sm text-foreground-600 leading-relaxed line-clamp-2">{a.excerpt}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {sellers.length > 0 && (
                <section>
                  <h2 className="font-heading text-xl md:text-2xl text-foreground-950 font-semibold mb-6 flex items-center gap-2">
                    <i className="ri-user-star-line text-secondary-600"></i> Nghệ nhân ({sellers.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sellers.map((s) => {
                      const slug = s.location_id != null ? locationSlugs[s.location_id] : undefined;
                      return (
                        <div key={s.id} className="rounded-2xl border border-background-200 bg-background-50 p-5 flex flex-col">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 flex-shrink-0 rounded-full overflow-hidden border-2 border-background-200">
                              <img src={assetUrl(s.avatar)} alt={s.name} className="w-full h-full object-cover object-top" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-heading text-lg text-foreground-950 leading-tight">{s.name}</h3>
                              <div className="text-xs text-foreground-500 mt-0.5">
                                <i className="ri-verified-badge-line text-primary-500 mr-1"></i>Nghệ nhân bản địa
                              </div>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-foreground-600 leading-relaxed flex-1 line-clamp-3">{s.bio}</p>
                          {slug && (
                            <Link
                              to={`/location/${slug}`}
                              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
                            >
                              Xem điểm di sản <i className="ri-arrow-right-line"></i>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}