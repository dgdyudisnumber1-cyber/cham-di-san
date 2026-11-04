import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import { useAuth } from '@/lib/auth';
import FavoritesTab from './components/FavoritesTab';
import ChatTab from './components/ChatTab';

export default function Account() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<'favorites' | 'chat'>('favorites');

  if (loading) {
    return (
      <div className="w-full bg-background-50 overflow-x-hidden">
        <Header />
        <div className="py-40 flex flex-col items-center justify-center text-foreground-500">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) || user.email?.split('@')[0] || 'Bạn';

  return (
    <div className="w-full bg-background-50 overflow-x-hidden">
      <Header />

      {/* Profile banner */}
      <section className="pt-24 pb-10 bg-background-100 border-b border-background-200">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-primary-500 text-background-50 flex items-center justify-center flex-shrink-0">
              <span className="font-heading text-3xl">{displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-2xl md:text-3xl text-foreground-950 font-semibold">{displayName}</h1>
              <div className="mt-1 text-sm text-foreground-600 flex items-center gap-1.5">
                <i className="ri-mail-line"></i> {user.email}
              </div>
            </div>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap inline-flex items-center gap-2 self-start"
            >
              <i className="ri-map-pin-line"></i> Khám phá di sản
            </Link>
          </div>
        </div>
      </section>

      <main className="py-10 md:py-14">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-background-100 rounded-full w-fit mb-10">
            <button
              onClick={() => setTab('favorites')}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all inline-flex items-center gap-2 ${
                tab === 'favorites' ? 'bg-primary-500 text-background-50' : 'text-foreground-700 hover:bg-background-200'
              }`}
            >
              <i className="ri-heart-3-line"></i> Yêu thích
            </button>
            <button
              onClick={() => setTab('chat')}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all inline-flex items-center gap-2 ${
                tab === 'chat' ? 'bg-primary-500 text-background-50' : 'text-foreground-700 hover:bg-background-200'
              }`}
            >
              <i className="ri-chat-3-line"></i> Tin nhắn
            </button>
          </div>

          {tab === 'favorites' ? <FavoritesTab /> : <ChatTab />}
        </div>
      </main>

      <Footer />
    </div>
  );
}