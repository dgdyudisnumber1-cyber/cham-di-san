import { assetUrl } from '@/lib/asset-url';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import { supabase } from '@/lib/supabase';
import type { HeritageStory } from '@/types/heritage';
import AudioPlayer from '@/pages/location/components/AudioPlayer';

export default function HeritageStoryDetail() {
  const { slug } = useParams();
  const [story, setStory] = useState<HeritageStory | null>(null);
  const [related, setRelated] = useState<HeritageStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data: st, error: stErr } = await supabase
        .from('heritage_stories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (stErr) throw stErr;
      if (!st) {
        setError('not_found');
        return;
      }

      const s = st as HeritageStory;
      setStory(s);

      const { data: rel } = await supabase
        .from('heritage_stories')
        .select('*')
        .neq('id', s.id)
        .order('published_at', { ascending: false })
        .limit(3);
      setRelated((rel as HeritageStory[]) ?? []);
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
          <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-sm">Đang tải câu chuyện...</div>
        </div>
      ) : error === 'not_found' ? (
        <div className="pt-24 py-32 text-center">
          <i className="ri-emotion-sad-line text-5xl text-foreground-400 block mb-4"></i>
          <h1 className="font-heading text-2xl text-foreground-950 mb-2">Không tìm thấy câu chuyện</h1>
          <p className="text-foreground-600 text-sm mb-6">Câu chuyện bạn tìm có thể đã bị gỡ hoặc không tồn tại.</p>
          <Link
            to="/heritage-stories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-line"></i> Quay lại kho truyện
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
      ) : story ? (
        <main>
          {/* Cover */}
          <section className="relative pt-24">
            <div className="relative h-[420px] md:h-[520px] overflow-hidden">
              <img
                src={assetUrl(story.cover_image)}
                alt={story.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/85 via-foreground-950/30 to-foreground-950/10"></div>
            </div>
          </section>

          <article className="relative -mt-40 md:-mt-56 pb-16">
            <div className="w-full px-4 md:px-10 max-w-4xl mx-auto">
              <div className="rounded-2xl bg-background-50 border border-background-200 p-6 md:p-12">
                <nav className="flex items-center gap-2 text-sm text-foreground-500 mb-6">
                  <Link to="/" className="hover:text-primary-600 cursor-pointer">Trang chủ</Link>
                  <i className="ri-arrow-right-s-line"></i>
                  <Link to="/heritage-stories" className="hover:text-primary-600 cursor-pointer">Câu chuyện di sản</Link>
                  <i className="ri-arrow-right-s-line"></i>
                  <span className="text-foreground-900 font-medium truncate">{story.title}</span>
                </nav>

                <div className="flex items-center gap-3 text-xs text-foreground-500 mb-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-100 text-accent-800 font-medium">
                    <i className="ri-book-open-line"></i> Truyện kể
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <i className="ri-time-line"></i> {story.duration_minutes} phút nghe
                  </span>
                </div>

                <h1 className="font-heading text-3xl md:text-4xl text-foreground-950 font-semibold leading-tight">
                  {story.title}
                </h1>

                {story.storyteller && (
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center">
                      <i className="ri-mic-line text-lg"></i>
                    </div>
                    <div>
                      <div className="font-medium text-foreground-900 text-sm">Người kể</div>
                      <div className="text-xs text-foreground-500">{story.storyteller}</div>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <AudioPlayer text={story.body} title={story.title} audioUrl={story.audio_url} />
                </div>

                <div className="mt-8">
                  {story.body.split('\n\n').map((p, i) => (
                    <p key={i} className="text-foreground-700 leading-relaxed mb-5 text-base md:text-lg">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Related */}
          {related.length > 0 && (
            <section className="pb-20 bg-background-100">
              <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
                <h2 className="font-heading text-2xl md:text-3xl text-foreground-950 font-semibold mb-8">
                  Câu chuyện khác
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((s) => (
                    <Link
                      key={s.id}
                      to={`/heritage-story/${s.slug}`}
                      className="group rounded-2xl overflow-hidden border border-background-200 bg-background-50 cursor-pointer transition-transform hover:-translate-y-1"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={assetUrl(s.cover_image)}
                          alt={s.title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading text-base text-foreground-950 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                          {s.title}
                        </h3>
                        <div className="mt-3 text-xs text-foreground-500">
                          <i className="ri-time-line mr-1"></i> {s.duration_minutes} phút nghe
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