import { assetUrl } from '@/lib/asset-url';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { categoryMeta } from '@/lib/heritage-ui';
import type { Article, Favorite, HeritageLocation } from '@/types/heritage';

export default function FavoritesTab() {
  const { user } = useAuth();
  const [locations, setLocations] = useState<HeritageLocation[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const { data: favs, error: favErr } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (favErr) throw favErr;
      const list = (favs as Favorite[]) ?? [];

      const locIds = list.filter((f) => f.item_type === 'location').map((f) => f.item_id);
      const artIds = list.filter((f) => f.item_type === 'article').map((f) => f.item_id);

      let locList: HeritageLocation[] = [];
      let artList: Article[] = [];

      if (locIds.length) {
        const { data, error } = await supabase.from('locations').select('*').in('id', locIds);
        if (error) throw error;
        locList = (data as HeritageLocation[]) ?? [];
      }
      if (artIds.length) {
        const { data, error } = await supabase.from('articles').select('*').in('id', artIds);
        if (error) throw error;
        artList = (data as Article[]) ?? [];
      }

      setLocations(locList);
      setArticles(artList);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const removeLocation = async (id: number) => {
    if (!user) return;
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_type', 'location').eq('item_id', id);
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const removeArticle = async (id: number) => {
    if (!user) return;
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_type', 'article').eq('item_id', id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-foreground-500">
        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <i className="ri-error-warning-line text-5xl text-foreground-400 block mb-4"></i>
        <p className="text-foreground-600 text-sm mb-6">{error}</p>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors"
        >
          <i className="ri-refresh-line"></i> Thử lại
        </button>
      </div>
    );
  }

  if (locations.length === 0 && articles.length === 0) {
    return (
      <div className="py-20 text-center text-foreground-500">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-100 text-foreground-400 flex items-center justify-center">
          <i className="ri-heart-3-line text-3xl"></i>
        </div>
        <h3 className="font-heading text-xl text-foreground-900 mb-2">Chưa có mục yêu thích</h3>
        <p className="text-sm mb-6">Bấm vào biểu tượng trái tim trên trang điểm di sản hoặc bài viết để lưu lại.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors"
        >
          <i className="ri-map-pin-line"></i> Khám phá di sản
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {locations.length > 0 && (
        <section>
          <h2 className="font-heading text-xl text-foreground-950 font-semibold mb-6 flex items-center gap-2">
            <i className="ri-map-pin-line text-primary-600"></i> Điểm di sản ({locations.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((l) => {
              const meta = categoryMeta[l.category];
              return (
                <div key={l.id} className="group rounded-2xl overflow-hidden border border-background-200 bg-background-50">
                  <Link to={`/location/${l.slug}`} className="relative block h-44 overflow-hidden cursor-pointer">
                    <img src={assetUrl(l.image)} alt={l.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                    <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${meta.badge}`}>
                      <i className={meta.icon}></i> {meta.label}
                    </span>
                  </Link>
                  <div className="p-5">
                    <Link to={`/location/${l.slug}`} className="cursor-pointer">
                      <h3 className="font-heading text-lg text-foreground-950 leading-snug group-hover:text-primary-600 transition-colors">{l.name}</h3>
                    </Link>
                    <div className="mt-2 text-xs text-foreground-500">
                      <i className="ri-map-pin-line mr-1"></i>{l.province}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Link to={`/location/${l.slug}`} className="text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer inline-flex items-center gap-1">
                        Xem chi tiết <i className="ri-arrow-right-line"></i>
                      </Link>
                      <button
                        onClick={() => removeLocation(l.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-foreground-400 hover:text-primary-600 hover:bg-primary-100 cursor-pointer transition-colors"
                        title="Bỏ yêu thích"
                      >
                        <i className="ri-heart-3-fill text-primary-500"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section>
          <h2 className="font-heading text-xl text-foreground-950 font-semibold mb-6 flex items-center gap-2">
            <i className="ri-article-line text-accent-600"></i> Bài viết ({articles.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <div key={a.id} className="group rounded-2xl overflow-hidden border border-background-200 bg-background-50">
                <Link to={`/story/${a.slug}`} className="relative block h-44 overflow-hidden cursor-pointer">
                  <img src={assetUrl(a.cover_image)} alt={a.title} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-background-50/95 text-foreground-900 text-[11px] font-medium">{a.category}</span>
                </Link>
                <div className="p-5">
                  <Link to={`/story/${a.slug}`} className="cursor-pointer">
                    <h3 className="font-heading text-lg text-foreground-950 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">{a.title}</h3>
                  </Link>
                  <p className="mt-2 text-sm text-foreground-600 leading-relaxed line-clamp-2">{a.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link to={`/story/${a.slug}`} className="text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer inline-flex items-center gap-1">
                      Đọc tiếp <i className="ri-arrow-right-line"></i>
                    </Link>
                    <button
                      onClick={() => removeArticle(a.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-foreground-400 hover:text-primary-600 hover:bg-primary-100 cursor-pointer transition-colors"
                      title="Bỏ yêu thích"
                    >
                      <i className="ri-heart-3-fill text-primary-500"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}