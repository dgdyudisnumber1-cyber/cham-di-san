import { assetUrl } from '@/lib/asset-url';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import { supabase } from '@/lib/supabase';
import type { HeritageStory } from '@/types/heritage';

export default function HeritageStories() {
  const [stories, setStories] = useState<HeritageStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('heritage_stories')
        .select('*')
        .order('published_at', { ascending: false });
      if (err) throw err;
      setStories((data as HeritageStory[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const featured = useMemo(
    () => stories.find((s) => s.is_featured) ?? stories[0],
    [stories],
  );
  const rest = useMemo(
    () => stories.filter((s) => s.id !== featured?.id),
    [stories, featured],
  );

  return (
    <div className="w-full bg-background-50 overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-background-100">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-800 text-xs tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
            Câu chuyện di sản
          </div>
          <h1 className="font-heading text-3xl md:text-5xl text-foreground-950 font-semibold max-w-3xl mx-auto">
            Kho tàng truyện kể của cha ông
          </h1>
          <p className="mt-4 text-foreground-700 max-w-2xl mx-auto">
            Những truyền thuyết, sự tích được truyền miệng qua bao thế hệ - nay được kể lại bằng lời, để bạn nghe và cảm nhận hồn cốt dân tộc.
          </p>
        </div>
      </section>

      <main className="py-12 md:py-16">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-foreground-500">
              <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-sm">Đang tải câu chuyện...</div>
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <i className="ri-error-warning-line text-5xl text-foreground-400 block mb-4"></i>
              <h2 className="font-heading text-2xl text-foreground-950 mb-2">Có lỗi khi tải câu chuyện</h2>
              <p className="text-foreground-600 text-sm mb-6">{error}</p>
              <button
                onClick={load}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors"
              >
                <i className="ri-refresh-line"></i> Thử lại
              </button>
            </div>
          ) : stories.length === 0 ? (
            <div className="py-24 text-center text-foreground-500">
              <i className="ri-book-open-line text-5xl text-foreground-300 block mb-4"></i>
              <p className="text-sm">Chưa có câu chuyện di sản nào.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link
                  to={`/heritage-story/${featured.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-background-200 bg-background-50 cursor-pointer mb-10"
                >
                  <div className="relative h-72 lg:h-[420px] overflow-hidden">
                    <img
                      src={assetUrl(featured.cover_image)}
                      alt={featured.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-50/95 text-foreground-900 text-xs font-medium">
                      <i className="ri-mic-line text-accent-600"></i> {featured.duration_minutes} phút nghe
                    </div>
                  </div>
                  <div className="p-6 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs text-foreground-500 mb-4">
                      <span className="px-2 py-1 rounded-full bg-accent-100 text-accent-800 font-medium">
                        Truyện kể
                      </span>
                      {featured.storyteller && <span>{featured.storyteller}</span>}
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl text-foreground-950 font-semibold group-hover:text-primary-600 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="mt-4 text-foreground-700 leading-relaxed">{featured.excerpt}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600">
                      <i className="ri-play-circle-line text-xl"></i> Nghe kể chuyện
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((s) => (
                  <Link
                    key={s.id}
                    to={`/heritage-story/${s.slug}`}
                    className="group rounded-2xl overflow-hidden border border-background-200 bg-background-50 cursor-pointer transition-transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={assetUrl(s.cover_image)}
                        alt={s.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-background-50/95 text-foreground-900 text-[11px] font-medium">
                        <i className="ri-mic-line text-accent-600"></i> {s.duration_minutes} phút
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg text-foreground-950 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                        {s.title}
                      </h3>
                      {s.storyteller && (
                        <div className="mt-1.5 text-xs text-foreground-500">{s.storyteller}</div>
                      )}
                      <p className="mt-2 text-sm text-foreground-600 leading-relaxed line-clamp-2">{s.excerpt}</p>
                      <div className="mt-4 pt-4 border-t border-background-200 flex items-center justify-between text-xs text-foreground-500">
                        <span className="inline-flex items-center gap-1.5 text-primary-600 font-medium">
                          <i className="ri-play-circle-line text-base"></i> Nghe kể
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <i className="ri-time-line"></i> {s.duration_minutes} phút
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}