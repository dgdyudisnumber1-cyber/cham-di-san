interface Props {
  lat: number | null;
  lng: number | null;
  name?: string;
  address?: string;
  zoom?: number;
  className?: string;
}

export default function MapEmbed({ lat, lng, name, address, zoom = 15, className }: Props) {
  const query =
    lat != null && lng != null ? `${lat},${lng}` : address || name || '';
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=vi&z=${zoom}&output=embed`;

  return (
    <iframe
      src={src}
      title={name ? `Bản đồ ${name}` : 'Bản đồ'}
      className={className || 'w-full h-full'}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}