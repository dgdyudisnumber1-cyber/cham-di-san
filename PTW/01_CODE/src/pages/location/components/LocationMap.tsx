import type { HeritageLocation } from '@/types/heritage';
import MapEmbed from '@/components/feature/MapEmbed';

interface Props {
  location: HeritageLocation;
}

export default function LocationMap({ location }: Props) {
  const directionsUrl =
    location.lat != null && location.lng != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;

  return (
    <section className="py-14 md:py-20 bg-background-50">
      <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-800 text-xs tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
            Bản đồ & địa chỉ
          </div>
          <h2 className="font-heading text-2xl md:text-4xl text-foreground-950 font-semibold">
            {location.name} nằm ở đâu?
          </h2>
          <p className="mt-3 text-foreground-700 max-w-2xl">
            Xem vị trí chính xác và tìm đường đến điểm di sản trên bản đồ Google.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-background-200 h-[360px] md:h-[480px]">
            <MapEmbed
              lat={location.lat}
              lng={location.lng}
              name={location.name}
              address={location.address}
            />
          </div>

          <div className="rounded-2xl bg-background-100 border border-background-200 p-6 flex flex-col">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-11 h-11 flex-shrink-0 rounded-full bg-primary-500 text-background-50 flex items-center justify-center">
                <i className="ri-map-pin-line text-xl"></i>
              </div>
              <div>
                <div className="text-xs tracking-widest uppercase text-foreground-500 mb-1">Địa chỉ</div>
                <div className="font-heading text-lg text-foreground-950 leading-snug">{location.address}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-5">
              <div className="w-11 h-11 flex-shrink-0 rounded-full bg-accent-500 text-foreground-950 flex items-center justify-center">
                <i className="ri-map-pin-2-line text-xl"></i>
              </div>
              <div>
                <div className="text-xs tracking-widest uppercase text-foreground-500 mb-1">Tỉnh thành</div>
                <div className="font-medium text-foreground-900">{location.province}</div>
              </div>
            </div>

            {location.lat != null && location.lng != null && (
              <div className="flex items-start gap-3 mb-6">
                <div className="w-11 h-11 flex-shrink-0 rounded-full bg-secondary-500 text-background-50 flex items-center justify-center">
                  <i className="ri-focus-3-line text-xl"></i>
                </div>
                <div>
                  <div className="text-xs tracking-widest uppercase text-foreground-500 mb-1">Tọa độ</div>
                  <div className="font-mono text-sm text-foreground-800">
                    {Number(location.lat).toFixed(4)}, {Number(location.lng).toFixed(4)}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto space-y-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
              >
                <i className="ri-navigation-line"></i>
                Chỉ đường đến đây
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + ' ' + location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-md bg-background-50 border border-background-200 hover:bg-background-100 text-foreground-800 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
              >
                <i className="ri-external-link-line"></i>
                Mở Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}