import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics';

interface Props {
  variant?: 'hero' | 'plain';
}

export default function SearchBar({ variant = 'hero' }: Props) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    // Do not send the query: it can contain personal information.
    trackEvent('heritage_search');
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  if (variant === 'plain') {
    return (
      <form
        onSubmit={submit}
        className="flex items-center gap-2 w-full max-w-2xl rounded-full border border-background-300 bg-background-50 p-1.5 pl-5 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition"
      >
        <i className="ri-search-line text-lg text-foreground-500"></i>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm điểm di sản, bài viết, nghệ nhân..."
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground-900 focus:outline-none placeholder:text-foreground-400"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
        >
          Tìm kiếm
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-2xl mx-auto flex items-center gap-2 rounded-full bg-background-50/95 backdrop-blur border border-background-50/40 shadow-lg p-2 pl-6"
    >
      <i className="ri-search-line text-xl text-foreground-500"></i>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm điểm di sản, bài viết, nghệ nhân..."
        className="min-w-0 flex-1 bg-transparent text-sm md:text-base text-foreground-900 focus:outline-none placeholder:text-foreground-400"
      />
      <button
        type="submit"
        className="px-5 md:px-7 py-2.5 md:py-3 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 text-sm md:text-base font-medium cursor-pointer transition-colors whitespace-nowrap inline-flex items-center gap-2"
      >
        Tìm kiếm
        <i className="ri-arrow-right-line"></i>
      </button>
    </form>
  );
}
