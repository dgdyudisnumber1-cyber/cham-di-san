const channels = [
  {
    key: 'facebook',
    label: 'Facebook',
    handle: 'Chạm Di Sản',
    icon: 'ri-facebook-circle-fill',
    href: 'https://www.facebook.com/profile.php?id=61594814327595',
    brand: 'bg-[#1877F2] border-[#1877F2] hover:bg-[#0f62d0] hover:border-[#0f62d0]',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    handle: '@chamdisan',
    icon: 'ri-tiktok-fill',
    href: 'https://www.tiktok.com/@chamdisan?_r=1&_t=ZS-9AXJKpoIJXw',
    brand: 'bg-[#010101] border-[#010101] hover:bg-[#25F4EE] hover:border-[#25F4EE] hover:text-[#010101]',
  },
];

export default function SocialDock() {
  return (
    <div className="fixed left-3 md:left-5 bottom-4 md:bottom-6 z-[95] flex flex-col gap-2.5">
      {channels.map((c) => (
        <a
          key={c.key}
          href={c.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${c.label} — ${c.handle}`}
          className="group relative inline-flex items-center"
        >
          <span
            className={`w-11 h-11 flex items-center justify-center rounded-full border text-background-50 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${c.brand}`}
          >
            <i className={`${c.icon} text-lg`}></i>
          </span>
          <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-foreground-950 text-background-50 text-xs px-2.5 py-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
            {c.label} · {c.handle}
          </span>
        </a>
      ))}

      <div className="w-11 flex justify-center pt-0.5">
        <span className="w-1 h-1 rounded-full bg-foreground-400"></span>
      </div>
    </div>
  );
}