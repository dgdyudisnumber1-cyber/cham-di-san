import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  sellerName: string;
  sellerId?: number;
  onClose: () => void;
}

export default function ContactModal({ sellerName, sellerId, onClose }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const { error } = await supabase.from('contact_requests').insert({
        seller_id: sellerId ?? null,
        seller_name: sellerName,
        name: name.trim(),
        phone: phone.trim() || null,
        email: email.trim() || null,
        message: message.trim() || null,
      });
      if (error) throw error;
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-foreground-950/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-background-50 border border-background-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-background-200">
          <div>
            <h3 className="font-heading text-lg text-foreground-950">Để lại thông tin liên hệ</h3>
            <p className="text-xs text-foreground-500 mt-0.5">Gửi tới: {sellerName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-background-100 text-foreground-600 cursor-pointer"
            aria-label="Đóng"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {status === 'done' ? (
          <div className="px-6 py-10 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center">
              <i className="ri-check-line text-2xl"></i>
            </div>
            <h4 className="font-heading text-xl text-foreground-950 mb-2">Đã gửi thông tin thành công!</h4>
            <p className="text-sm text-foreground-600 leading-relaxed">
              Nghệ nhân {sellerName} sẽ liên hệ lại với bạn trong thời gian sớm nhất. Cảm ơn bạn đã quan tâm!
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
            >
              Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground-800 mb-1.5">Họ và tên <span className="text-primary-600">*</span></label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2.5 rounded-md border border-background-300 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-800 mb-1.5">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="w-full px-4 py-2.5 rounded-md border border-background-300 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-800 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@email.com"
                className="w-full px-4 py-2.5 rounded-md border border-background-300 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-800 mb-1.5">Lời nhắn</label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                rows={3}
                maxLength={500}
                placeholder="Tôi muốn tìm hiểu về sản phẩm..."
                className="w-full px-4 py-2.5 rounded-md border border-background-300 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
              ></textarea>
              <div className="text-right text-[11px] text-foreground-400 mt-1">{message.length}/500</div>
            </div>

            {/* Honeypot anti-spam */}
            <div className="hp-alt-field" aria-hidden="true">
              <input
                type="text"
                name="company_alt"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                readOnly
                className="w-full"
              />
            </div>

            {status === 'error' && (
              <div className="text-sm text-primary-600 bg-primary-100 rounded-md px-3 py-2">{errorMsg}</div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-5 py-3 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? (
                <>
                  <span className="w-4 h-4 border-2 border-background-50 border-t-transparent rounded-full animate-spin"></span>
                  Đang gửi...
                </>
              ) : (
                <>
                  <i className="ri-send-plane-line"></i> Gửi thông tin
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}