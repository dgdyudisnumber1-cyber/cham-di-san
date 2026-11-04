const steps = [
  {
    icon: 'ri-map-pin-2-line',
    title: 'Khám phá trên bản đồ',
    desc: 'Chọn điểm định vị trên bản đồ Việt Nam để mở ra ký ức của một vùng đất, một cộng đồng.',
    tone: 'primary',
  },
  {
    icon: 'ri-book-open-line',
    title: 'Đọc & Nghe di sản',
    desc: 'Hai lớp nội dung: sử liệu xác thực và văn hóa dân gian, kèm bản ghi âm giọng bản địa.',
    tone: 'accent',
  },
  {
    icon: 'ri-hand-heart-line',
    title: 'Chạm tay nghệ nhân',
    desc: 'Xem hồ sơ, nhắn Zalo/Messenger hoặc gọi trực tiếp - không qua trung gian nào.',
    tone: 'secondary',
  },
  {
    icon: 'ri-quill-pen-line',
    title: 'Đóng góp cùng cộng đồng',
    desc: 'Gửi tư liệu, ảnh, file ghi âm để bổ sung ký ức. Quản trị viên duyệt trước khi xuất bản.',
    tone: 'primary',
  },
];

const toneMap: Record<string, { bg: string; text: string; ring: string }> = {
  primary: { bg: 'bg-primary-500', text: 'text-primary-700', ring: 'ring-primary-200' },
  accent: { bg: 'bg-accent-500', text: 'text-accent-700', ring: 'ring-accent-200' },
  secondary: { bg: 'bg-secondary-500', text: 'text-secondary-700', ring: 'ring-secondary-200' },
};

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-background-50">
      <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-100 text-secondary-800 text-xs tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-500"></span>
            Bốn nhịp trải nghiệm
          </div>
          <h2 className="font-heading text-3xl md:text-5xl text-foreground-950 font-semibold">
            Chạm Di Sản hoạt động thế nào?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => {
            const t = toneMap[s.tone];
            return (
              <div key={s.title} className="relative rounded-2xl bg-background-100 border border-background-200 p-6 hover:border-foreground-300 transition-colors">
                <div className={`w-14 h-14 flex items-center justify-center rounded-full ${t.bg} text-background-50 ring-8 ${t.ring} mb-5`}>
                  <i className={`${s.icon} text-2xl`}></i>
                </div>
                <div className={`font-heading text-4xl ${t.text} mb-2`}>0{i + 1}</div>
                <h3 className="font-heading text-lg text-foreground-950 mb-2">{s.title}</h3>
                <p className="text-sm text-foreground-700 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}