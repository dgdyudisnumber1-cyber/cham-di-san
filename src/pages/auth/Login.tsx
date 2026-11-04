import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { validateOrdinaryPostAuthNext } from '@/lib/auth-utils';
import AuthLayout from './components/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const next = searchParams.get('next');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      navigate(validateOrdinaryPostAuthNext(next), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để tiếp tục hành trình khám phá và gìn giữ di sản."
      footer={
        <div className="text-center text-sm text-foreground-600">
          Chưa có tài khoản?{' '}
          <Link to="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
            Đăng ký ngay
          </Link>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground-800 mb-1.5">Email</label>
          <div className="relative">
            <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground-400 text-sm"></i>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="ban@example.com"
              className="w-full pl-11 pr-4 py-3 rounded-md bg-background-100 border border-background-200 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-foreground-800">Mật khẩu</label>
            <Link to="/auth/reset-password" className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground-400 text-sm"></i>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 rounded-md bg-background-100 border border-background-200 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-primary-100 text-primary-700 text-sm px-4 py-3">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-md bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-background-50 border-t-transparent rounded-full animate-spin"></span>
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}