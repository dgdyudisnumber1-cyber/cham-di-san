import { assetUrl } from '@/lib/asset-url';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import { supabase } from '@/lib/supabase';
import type { Article, HeritageLocation } from '@/types/heritage';
import AudioPlayer from '@/pages/location/components/AudioPlayer';
import FavoriteButton from '@/components/feature/FavoriteButton';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function StoryDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [location, setLocation] = useState<HeritageLocation | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data: art, error: artErr } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (artErr) throw artErr;
      if (!art) {
        setError('not_found');
        return;
      }

      const a = art as Article;
      setArticle(a);

      if (a.location_id) {
        const { data: loc } = await supabase
          .from('locations')
          .select('*')
          .eq('id', a.location_id)
          .maybeSingle();
        if (loc) setLocation(loc as HeritageLocation);
      }

      const { data: rel } = await supabase
        .from('articles')
        .select('*')
        .neq('id', a.id)
        .order('published_at', { ascending: false })
        .limit(3);
      setRelated((rel as Article[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown');
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

      {loading ? (
        <div className="pt-24 py-32 flex flex-col items-center justify-center text-foreground-500">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-sm">Đang tải bài viết...</div>
        </div>
      ) : error === 'not_found' ? (
        <div className="pt-24 py-32 text-center">
          <i className="ri-emotion-sad-line text-5xl text-foreground-400 block mb-4"></i>
          <h1 className="font-heading text-2xl text-foreground-950 mb-2">Không tìm thấy bài viết</h1>
          <p className="text-foreground-600 text-sm mb-6">Bài viết bạn tìm có thể đã bị gỡ hoặc không tồn tại.</p>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-line"></i> Quay lại tạp chí
          </Link>
        </div>
      ) : error ? (
        <div className="pt-24 py-32 text-center">
          <i className="ri-error-warning-line text-5xl text-foreground-400 block mb-4"></i>
          <h1 className="font-heading text-2xl text-foreground-950 mb-2">Có lỗi khi tải dữ liệu</h1>
          <p className="text-foreground-600 text-sm mb-6">{error}</p>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors"
          >
            <i className="ri-refresh-line"></i> Thử lại
          </button>
        </div>
      ) : article ? (
        <main>
          {/* Cover */}
          <section className="relative pt-24">
            <div className="relative h-[420px] md:h-[520px] overflow-hidden">
              <img
                src={assetUrl(article.cover_image)}
                alt={article.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/85 via-foreground-950/30 to-foreground-950/10"></div>
            </div>
          </section>

          <article className="relative -mt-40 md:-mt-56 pb-16">
            <div className="w-full px-4 md:px-10 max-w-4xl mx-auto">
              <div className="rounded-2xl bg-background-50 border border-background-200 p-6 md:p-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-foreground-500 mb-6">
                  <Link to="/" className="hover:text-primary-600 cursor-pointer">Trang chủ</Link>
                  <i className="ri-arrow-right-s-line"></i>
                  <Link to="/stories" className="hover:text-primary-600 cursor-pointer">Tạp chí di sản</Link>
                  <i className="ri-arrow-right-s-line"></i>
                  <span className="text-foreground-900 font-medium truncate">{article.category}</span>
                </nav>

                <div className="flex items-center gap-3 text-xs text-foreground-500 mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-accent-100 text-accent-800 font-medium">
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <i className="ri-time-line"></i> {article.read_minutes} phút đọc
                  </span>
                  <span>{formatDate(article.published_at)}</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h1 className="font-heading text-3xl md:text-4xl text-foreground-950 font-semibold leading-tight">
                    {article.title}
                  </h1>
                  <FavoriteButton itemType="article" itemId={article.id} />
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    <i className="ri-user-line text-lg"></i>
                  </div>
                  <div>
                    <div className="font-medium text-foreground-900 text-sm">{article.author}</div>
                    <div className="text-xs text-foreground-500">Nhóm biên tập Chạm Di Sản</div>
                  </div>
                </div>

                <div className="mt-8">
                  {article.body.split('\n\n').map((p, i) => (
                    <p key={i} className="text-foreground-700 leading-relaxed mb-5 text-base md:text-lg">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="mt-6">
                  <AudioPlayer text={article.body} title={article.title} audioUrl={article.audio_url} />
                </div>

                {location && (
                  <div className="mt-10 rounded-xl bg-background-100 border border-background-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary-500 text-background-50 flex items-center justify-center">
                      <i className="ri-map-pin-line text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-foreground-500 mb-0.5">Câu chuyện gắn với</div>
                      <div className="font-heading text-lg text-foreground-950">{location.name}</div>
                      <div className="text-xs text-foreground-500 mt-0.5">{location.province}</div>
                    </div>
                    <Link
                      to={`/location/${location.slug}`}
                      className="px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center gap-1.5"
                    >
                      Khám phá điểm này <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Related */}
          {related.length > 0 && (
            <section className="pb-20 bg-background-100">
              <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
                <h2 className="font-heading text-2xl md:text-3xl text-foreground-950 font-semibold mb-8">
                  Bài viết liên quan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((a) => (
                    <Link
                      key={a.id}
                      to={`/story/${a.slug}`}
                      className="group rounded-2xl overflow-hidden border border-background-200 bg-background-50 cursor-pointer transition-transform hover:-translate-y-1"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={assetUrl(a.cover_image)}
                          alt={a.title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading text-base text-foreground-950 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                          {a.title}
                        </h3>
                        <div className="mt-3 text-xs text-foreground-500">
                          <i className="ri-time-line mr-1"></i> {a.read_minutes} phút đọc
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      ) : null}

      <Footer />
    </div>
  );
}