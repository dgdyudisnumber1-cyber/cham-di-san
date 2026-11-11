import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getAuthRedirectUrl } from '@/lib/auth-utils';
import { trackEvent } from '@/lib/analytics';
import AuthLayout from './components/AuthLayout';

type Step = 'form' | 'code';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getAuthRedirectUrl(),
          data: { full_name: name },
        },
      });
      if (err) throw err;
      // Session returned = already confirmed, otherwise show code entry
      if (data.session) {
        trackEvent('sign_up', { method: 'email' });
        navigate('/', { replace: true });
      } else {
        setStep('code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup',
      });
      if (err) throw err;
      trackEvent('sign_up', { method: 'email' });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mã xác nhận không đúng.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResending(true);
    setError('');
    try {
      const { error: err } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: getAuthRedirectUrl() },
      });
      if (err) throw err;
      setError('Đã gửi lại mã xác nhận, vui lòng kiểm tra email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi lại mã.');
    } finally {
      setResending(false);
    }
  };

  if (step === 'code') {
    return (
      <AuthLayout
        title="Nhập mã xác nhận"
        subtitle={`Mã gồm 6 chữ số đã được gửi tới ${email}. Nhập mã để hoàn tất đăng ký.`}
      >
        <form onSubmit={verifyCode} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground-800 mb-1.5">Mã xác nhận</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              autoComplete="one-time-code"
              placeholder="000000"
              className="w-full px-4 py-4 rounded-md bg-background-100 border border-background-200 text-center text-2xl tracking-[0.5em] font-semibold text-foreground-900 placeholder:text-foreground-300 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          {error && (
            <div className="rounded-md bg-primary-100 text-primary-700 text-sm px-4 py-3">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-3 rounded-md bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-background-50 border-t-transparent rounded-full animate-spin"></span>
                Đang xác nhận...
              </>
            ) : (
              'Xác nhận & hoàn tất'
            )}
          </button>

          <div className="text-center text-sm text-foreground-600">
            Không nhận được mã?{' '}
            <button
              type="button"
              onClick={resend}
              disabled={resending}
              className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer disabled:opacity-60"
            >
              {resending ? 'Đang gửi...' : 'Gửi lại mã'}
            </button>
          </div>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Tham gia cộng đồng gìn giữ di sản văn hóa Việt Nam."
      footer={
        <div className="text-center text-sm text-foreground-600">
          Đã có tài khoản?{' '}
          <Link to="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
            Đăng nhập
          </Link>
        </div>
      }
    >
      <form onSubmit={submitForm} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground-800 mb-1.5">Họ và tên</label>
          <div className="relative">
            <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground-400 text-sm"></i>
            <input
              type="text"
              name="full_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              className="w-full pl-11 pr-4 py-3 rounded-md bg-background-100 border border-background-200 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground-800 mb-1.5">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Ít nhất 6 ký tự"
              className="w-full px-4 py-3 rounded-md bg-background-100 border border-background-200 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-800 mb-1.5">Xác nhận</label>
            <input
              type="password"
              name="confirm_password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              className="w-full px-4 py-3 rounded-md bg-background-100 border border-background-200 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
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
              Đang tạo tài khoản...
            </>
          ) : (
            'Tạo tài khoản'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
