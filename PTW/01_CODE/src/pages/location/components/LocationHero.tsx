import { assetUrl } from '@/lib/asset-url';
import { categoryMeta } from '@/lib/heritage-ui';
import type { HeritageLocation } from '@/types/heritage';
import FavoriteButton from '@/components/feature/FavoriteButton';

interface Props {
  location: HeritageLocation;
}

export default function LocationHero({ location }: Props) {
  const meta = categoryMeta[location.category];

  return (
    <section className="relative">
      <div className="relative h-[380px] md:h-[520px] overflow-hidden">
        <img
          src={assetUrl(location.image)}
          alt={location.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/90 via-foreground-950/40 to-foreground-950/10"></div>
      </div>

      <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="relative -mt-40 md:-mt-52 pb-10">
          <div className="rounded-2xl bg-background-50 border border-background-200 p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${meta.badge}`}>
                <i className={meta.icon}></i>
                {meta.label}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-background-100 text-foreground-700">
                <i className="ri-map-pin-line"></i>
                {location.province}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h1 className="font-heading text-3xl md:text-5xl text-foreground-950 font-semibold leading-tight">
                {location.name}
              </h1>
              <FavoriteButton itemType="location" itemId={location.id} />
            </div>

            <p className="mt-4 text-foreground-700 leading-relaxed max-w-3xl">
              {location.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {location.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary-100 text-secondary-800 whitespace-nowrap"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md">
              <div className="rounded-xl bg-background-100 border border-background-200 p-4">
                <div className="text-xs text-foreground-500">Nội dung số</div>
                <div className="font-heading text-2xl text-primary-600">{location.content_count}</div>
              </div>
              <div className="rounded-xl bg-background-100 border border-background-200 p-4">
                <div className="text-xs text-foreground-500">Sản phẩm</div>
                <div className="font-heading text-2xl text-secondary-700">{location.product_count}</div>
              </div>
              <div className="rounded-xl bg-background-100 border border-background-200 p-4 sm:col-span-2 md:col-span-1">
                <div className="text-xs text-foreground-500">Khu vực</div>
                <div className="font-heading text-2xl text-accent-700 capitalize">
                  {location.region === 'north' ? 'Miền Bắc' : location.region === 'central' ? 'Miền Trung' : 'Miền Nam'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}