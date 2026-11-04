import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { validateOrdinaryPostAuthNext } from '@/lib/auth-utils';

export default function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const code = searchParams.get('code');
    const next = searchParams.get('next');

    if (!code) {
      navigate(validateOrdinaryPostAuthNext(next), { replace: true });
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err) {
          setError(err.message);
          return;
        }
        const redirectType = (data as unknown as { redirectType?: string } | null)?.redirectType;
        if (redirectType === 'recovery') {
          navigate('/auth/reset-password', { replace: true });
          return;
        }
        navigate(validateOrdinaryPostAuthNext(next), { replace: true });
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra.');
      });

    return () => {
      active = false;
    };
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-50 px-4">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-5"></div>
        <h1 className="font-heading text-2xl text-foreground-950 font-semibold mb-2">
          Đang xử lý đăng nhập...
        </h1>
        <p className="text-sm text-foreground-600">Vui lòng chờ trong giây lát.</p>
        {error && (
          <div className="mt-6 rounded-md bg-primary-100 text-primary-700 text-sm px-4 py-3 max-w-sm mx-auto">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}