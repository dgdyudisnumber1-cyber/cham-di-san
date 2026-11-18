import { assetUrl } from '@/lib/asset-url';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Seller } from '@/types/heritage';
import ContactModal from '@/components/feature/ContactModal';

interface Props {
  sellers: Seller[];
}

export default function SellerCard({ sellers }: Props) {
  const [contact, setContact] = useState<{ id: number; name: string } | null>(null);

  if (sellers.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-background-100">
      <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-100 text-secondary-800 text-xs tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-500"></span>
            Không gian giao thương bản địa
          </div>
          <h2 className="font-heading text-2xl md:text-4xl text-foreground-950 font-semibold">
            Gặp gỡ nghệ nhân tại đây
          </h2>
          <p className="mt-3 text-foreground-700 max-w-2xl">
            Kết nối trực tiếp với người làm ra sản phẩm - không qua trung gian, lợi ích về đúng tay người lao động.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((s) => (
            <article
              key={s.id}
              className="rounded-2xl bg-background-50 border border-background-200 overflow-hidden flex flex-col"
            >
              <Link to={`/artisan/${s.id}`} className="flex items-start gap-4 p-5 group">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-background-200">
                  <img src={assetUrl(s.avatar)} alt={s.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg text-foreground-950 leading-tight group-hover:text-primary-600 transition-colors">
                    {s.name}
                  </h3>
                  {s.title && (
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-100 text-accent-800 text-[11px] font-medium">
                      <i className="ri-verified-badge-fill"></i>
                      {s.title}
                    </div>
                  )}
                  {s.craft && (
                    <div className="text-xs text-foreground-500 mt-1">{s.craft}</div>
                  )}
                </div>
              </Link>

              {s.bio && (
                <p className="px-5 text-sm text-foreground-700 leading-relaxed line-clamp-3">{s.bio}</p>
              )}

              {s.achievements && s.achievements.length > 0 && (
                <div className="px-5 mt-4 flex-1">
                  <div className="text-xs font-semibold tracking-widest uppercase text-accent-700 mb-2">
                    Thành tích nổi bật
                  </div>
                  <ul className="space-y-2">
                    {s.achievements.slice(0, 2).map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground-700">
                        <i className="ri-checkbox-circle-fill text-accent-500 mt-0.5"></i>
                        <span className="leading-relaxed line-clamp-2">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-5 mt-4 space-y-2.5">
                <Link
                  to={`/artisan/${s.id}`}
                  className="w-full py-2.5 rounded-md border border-background-300 hover:border-primary-400 hover:bg-primary-100/50 text-foreground-800 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
                >
                  <i className="ri-user-star-line"></i> Xem đầy đủ tiểu sử & thành tích
                </Link>
                <button
                  onClick={() => setContact({ id: s.id, name: s.name })}
                  className="w-full py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
                >
                  <i className="ri-mail-send-line"></i> Để lại thông tin liên hệ
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {contact && (
        <ContactModal
          sellerName={contact.name}
          sellerId={contact.id}
          onClose={() => setContact(null)}
        />
      )}
    </section>
  );
}