import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

interface Props {
  itemType: 'location' | 'article';
  itemId: number;
  label?: string;
  variant?: 'solid' | 'ghost';
}

export default function FavoriteButton({ itemType, itemId, label, variant = 'ghost' }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setFav(false);
      return;
    }
    let mounted = true;
    supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .maybeSingle()
      .then(({ data }) => {
        if (mounted) setFav(!!data);
      });
    return () => {
      mounted = false;
    };
  }, [user, itemType, itemId]);

  const toggle = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      if (fav) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_type', itemType)
          .eq('item_id', itemId);
        setFav(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, item_type: itemType, item_id: itemId });
        setFav(true);
      }
    } finally {
      setBusy(false);
    }
  };

  const base =
    variant === 'solid'
      ? 'px-4 py-2 rounded-md border transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5'
      : 'w-10 h-10 rounded-full border transition-colors cursor-pointer inline-flex items-center justify-center';

  const stateCls = fav
    ? 'border-primary-300 bg-primary-100 text-primary-600'
    : 'border-background-200 bg-background-50 text-foreground-600 hover:bg-background-100';

  return (
    <button onClick={toggle} className={`${base} ${stateCls}`} title={fav ? 'Bỏ yêu thích' : 'Yêu thích'} disabled={busy}>
      <i className={`${fav ? 'ri-heart-3-fill' : 'ri-heart-3-line'} ${variant === 'solid' ? 'text-base' : 'text-lg'}`}></i>
      {label && <span className="text-sm font-medium">{fav ? 'Đã lưu' : label}</span>}
    </button>
  );
}