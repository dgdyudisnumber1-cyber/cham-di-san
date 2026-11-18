import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getAuthRedirectUrl } from '@/lib/auth-utils';
import AuthLayout from './components/AuthLayout';

type Step = 'request' | 'code' | 'password';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If arriving from a recovery link, a recovery session already exists -> go straight to new password
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setStep('password');
    });
    return () => {
      active = false;
    };
  }, []);

  const requestReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const redirectTo = `${getAuthRedirectUrl()}?next=/auth/reset-password`;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (err) throw err;
      setStep('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi yêu cầu.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.verifyOtp({ email, token: code, type: 'recovery' });
      if (err) throw err;
      setStep('password');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mã xác nhận không đúng.');
    } finally {
      setLoading(false);
    }
  };

  const setNewPassword = async (e: FormEvent) => {
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
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      navigate('/auth/login', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="text-center text-sm text-foreground-600">
      Đã nhớ mật khẩu?{' '}
      <Link to="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
        Đăng nhập
      </Link>
    </div>
  );

  if (step === 'request') {
    return (
      <AuthLayout
        title="Khôi phục mật khẩu"
        subtitle="Nhập email của bạn, chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu."
        footer={footer}
      >
        <form onSubmit={requestReset} className="space-y-5">
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

          {error && <div className="rounded-md bg-primary-100 text-primary-700 text-sm px-4 py-3">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
          >
            {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
          </button>
        </form>
      </AuthLayout>
    );
  }

  if (step === 'code') {
    return (
      <AuthLayout
        title="Nhập mã xác nhận"
        subtitle={`Mã gồm 6 chữ số đã được gửi tới ${email}.`}
        footer={footer}
      >
        <form onSubmit={verifyCode} className="space-y-5">
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

          {error && <div className="rounded-md bg-primary-100 text-primary-700 text-sm px-4 py-3">{error}</div>}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-3 rounded-md bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors"
          >
            {loading ? 'Đang xác nhận...' : 'Xác nhận mã'}
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Đặt mật khẩu mới" subtitle="Nhập mật khẩu mới cho tài khoản của bạn." footer={footer}>
      <form onSubmit={setNewPassword} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground-800 mb-1.5">Mật khẩu mới</label>
          <input
            type="password"
            name="new_password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Ít nhất 6 ký tự"
            className="w-full px-4 py-3 rounded-md bg-background-100 border border-background-200 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-800 mb-1.5">Xác nhận mật khẩu</label>
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

        {error && <div className="rounded-md bg-primary-100 text-primary-700 text-sm px-4 py-3">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-md bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors"
        >
          {loading ? 'Đang cập nhật...' : 'Đặt mật khẩu mới'}
        </button>
      </form>
    </AuthLayout>
  );
}