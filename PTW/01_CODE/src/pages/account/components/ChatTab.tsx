import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { Message } from '@/types/heritage';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'numeric',
  });
}

export default function ChatTab() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sendError, setSendError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (err) throw err;
      setMessages((data as Message[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || !user) return;
    setSending(true);
    setSendError('');
    try {
      const { error: err } = await supabase.from('messages').insert({
        user_id: user.id,
        sender_name: (user.user_metadata?.full_name as string | undefined) || null,
        sender_email: user.email || null,
        body: trimmed,
        is_team_reply: false,
      });
      if (err) throw err;
      setBody('');
      await load();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Không gửi được tin nhắn, vui lòng thử lại.');
    } finally {
      setSending(false);
    }
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

  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-background-200 bg-background-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-500 text-background-50 flex items-center justify-center">
            <i className="ri-customer-service-2-line text-lg"></i>
          </div>
          <div>
            <div className="font-heading text-foreground-950">Đội ngũ Chạm Di Sản</div>
            <div className="text-xs text-foreground-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-500"></span> Sẵn sàng hỗ trợ
            </div>
          </div>
        </div>

        {/* Thread */}
        <div className="px-6 py-6 space-y-4 max-h-[420px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="py-12 text-center text-foreground-500">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-background-100 text-foreground-400 flex items-center justify-center">
                <i className="ri-chat-3-line text-2xl"></i>
              </div>
              <p className="text-sm">Gửi tin nhắn đầu tiên để liên hệ với đội ngũ dự án nhé!</p>
            </div>
          ) : (
            messages.map((m) =>
              m.is_team_reply ? (
                <div key={m.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 flex-shrink-0 rounded-full bg-primary-500 text-background-50 flex items-center justify-center">
                    <i className="ri-customer-service-2-line"></i>
                  </div>
                  <div>
                    <div className="rounded-2xl rounded-tl-sm bg-background-100 border border-background-200 px-4 py-2.5 max-w-md">
                      <p className="text-sm text-foreground-800 leading-relaxed whitespace-pre-wrap">{m.body}</p>
                    </div>
                    <div className="mt-1 text-[11px] text-foreground-400">Đội ngũ · {formatTime(m.created_at)}</div>
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex items-start gap-3 justify-end">
                  <div className="text-right">
                    <div className="rounded-2xl rounded-tr-sm bg-primary-500 text-background-50 px-4 py-2.5 max-w-md ml-auto">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.body}</p>
                    </div>
                    <div className="mt-1 text-[11px] text-foreground-400">{formatTime(m.created_at)}</div>
                  </div>
                </div>
              )
            )
          )}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <form onSubmit={send} className="px-4 py-3 border-t border-background-200 bg-background-50 flex items-end gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, 1000))}
            rows={1}
            maxLength={1000}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-background-300 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form) form.requestSubmit();
              }
            }}
          ></textarea>
          <button
            type="submit"
            disabled={sending || !body.trim()}
            className="px-4 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap inline-flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? (
              <span className="w-4 h-4 border-2 border-background-50 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <i className="ri-send-plane-line"></i>
            )}
          </button>
        </form>
      </div>

      {sendError && (
        <div className="mt-3 text-sm text-primary-600 bg-primary-100 rounded-md px-4 py-2.5">{sendError}</div>
      )}
    </div>
  );
}