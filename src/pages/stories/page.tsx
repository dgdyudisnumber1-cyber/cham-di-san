import { assetUrl } from '@/lib/asset-url';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/types/heritage';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Stories() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('all');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });
      if (err) throw err;
      setArticles((data as Article[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.category && set.add(a.category));
    return ['all', ...Array.from(set)];
  }, [articles]);

  const filtered = useMemo(() => {
    if (category === 'all') return articles;
    return articles.filter((a) => a.category === category);
  }, [articles, category]);

  const [featured, ...rest] = filtered;

  return (
    <div className="w-full bg-background-50 overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-background-100">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
            Tạp chí di sản
          </div>
          <h1 className="font-heading text-3xl md:text-5xl text-foreground-950 font-semibold max-w-3xl mx-auto">
            Những câu chuyện được kể bằng chữ, bằng tiếng
          </h1>
          <p className="mt-4 text-foreground-700 max-w-2xl mx-auto">
            Đọc bài viết chuyên sâu về làng nghề, di tích và văn hóa dân gian — và nghe chúng bằng giọng đọc tiếng Việt.
          </p>
        </div>
      </section>

      <main className="py-12 md:py-16">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 p-1 bg-background-100 rounded-full mb-10 w-fit">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                  category === c
                    ? 'bg-primary-500 text-background-50'
                    : 'text-foreground-700 hover:bg-background-200'
                }`}
              >
                {c === 'all' ? 'Tất cả' : c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-foreground-500">
              <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-sm">Đang tải bài viết...</div>
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <i className="ri-error-warning-line text-5xl text-foreground-400 block mb-4"></i>
              <h2 className="font-heading text-2xl text-foreground-950 mb-2">Có lỗi khi tải bài viết</h2>
              <p className="text-foreground-600 text-sm mb-6">{error}</p>
              <button
                onClick={load}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors"
              >
                <i className="ri-refresh-line"></i> Thử lại
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center text-foreground-500">
              <i className="ri-article-line text-5xl text-foreground-300 block mb-4"></i>
              <p className="text-sm">Chưa có bài viết nào trong nhóm này.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link
                  to={`/story/${featured.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-background-200 bg-background-50 cursor-pointer mb-10"
                >
                  <div className="relative h-72 lg:h-[420px] overflow-hidden">
                    <img
                      src={assetUrl(featured.cover_image)}
                      alt={featured.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs text-foreground-500 mb-4">
                      <span className="px-2 py-1 rounded-full bg-accent-100 text-accent-800 font-medium">
                        {featured.category}
                      </span>
                      <span>{featured.read_minutes} phút đọc</span>
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl text-foreground-950 font-semibold group-hover:text-primary-600 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="mt-4 text-foreground-700 leading-relaxed">{featured.excerpt}</p>
                    <div className="mt-6 flex items-center gap-3 text-sm text-foreground-600">
                      <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                        <i className="ri-user-line"></i>
                      </div>
                      <div>
                        <div className="font-medium text-foreground-900">{featured.author}</div>
                        <div className="text-xs text-foreground-500">{formatDate(featured.published_at)}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((a) => (
                  <Link
                    key={a.id}
                    to={`/story/${a.slug}`}
                    className="group rounded-2xl overflow-hidden border border-background-200 bg-background-50 cursor-pointer transition-transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={assetUrl(a.cover_image)}
                        alt={a.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-background-50/95 text-foreground-900 text-[11px] font-medium">
                        {a.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg text-foreground-950 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                      <p className="mt-2 text-sm text-foreground-600 leading-relaxed line-clamp-2">{a.excerpt}</p>
                      <div className="mt-4 pt-4 border-t border-background-200 flex items-center justify-between text-xs text-foreground-500">
                        <span className="inline-flex items-center gap-1">
                          <i className="ri-time-line"></i> {a.read_minutes} phút đọc
                        </span>
                        <span>{formatDate(a.published_at)}</span>
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