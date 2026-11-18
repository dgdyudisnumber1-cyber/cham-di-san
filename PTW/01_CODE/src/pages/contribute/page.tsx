import { useEffect, useState, type FormEvent } from 'react';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import { supabase } from '@/lib/supabase';
import type { HeritageLocation } from '@/types/heritage';

type ContentType = 'text' | 'audio';

export default function Contribute() {
  const [locations, setLocations] = useState<HeritageLocation[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [locationId, setLocationId] = useState('');
  const [contentType, setContentType] = useState<ContentType>('text');
  const [textContent, setTextContent] = useState('');
  const [audioPath, setAudioPath] = useState('');
  const [hp, setHp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('locations')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) return;
        setLocations((data as HeritageLocation[]) ?? []);
      });
    return () => {
      active = false;
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (hp.trim()) {
      setStatus({ type: 'success', msg: 'Cảm ơn bạn! Đóng góp của bạn đã được ghi nhận.' });
      return;
    }
    if (!locationId) {
      setStatus({ type: 'error', msg: 'Vui lòng chọn điểm di sản.' });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        contributor_name: name,
        email,
        phone,
        location_id: Number(locationId),
        content_type: contentType,
        text_content: contentType === 'text' ? textContent : null,
        audio_path: contentType === 'audio' ? audioPath : null,
        status: 'pending',
      };
      const { error } = await supabase.from('contributions').insert(payload);
      if (error) throw error;
      setStatus({ type: 'success', msg: 'Cảm ơn bạn! Đóng góp của bạn đã được gửi và đang chờ quản trị viên duyệt.' });
      setName('');
      setEmail('');
      setPhone('');
      setLocationId('');
      setTextContent('');
      setAudioPath('');
    } catch (err) {
      setStatus({ type: 'error', msg: err instanceof Error ? err.message : 'Gửi đóng góp thất bại.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-background-50 overflow-x-hidden">
      <Header />

      <section className="relative pt-24 pb-10 bg-background-100">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
            Đóng góp cộng đồng
          </div>
          <h1 className="font-heading text-3xl md:text-5xl text-foreground-950 font-semibold max-w-3xl mx-auto">
            Góp một câu chuyện chưa được kể
          </h1>
          <p className="mt-4 text-foreground-700 max-w-2xl mx-auto">
            Gửi tư liệu văn bản hoặc bản ghi âm về làng, về ông bà, về lễ hội mà bạn nhớ. Quản trị viên sẽ duyệt trước khi xuất bản.
          </p>
        </div>
      </section>

      <main className="py-12 md:py-16">
        <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={submit} className="rounded-2xl bg-background-50 border border-background-200 p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground-800 mb-1.5">Họ và tên</label>
                    <input
                      type="text"
                      name="contributor_name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-md bg-background-100 border border-background-200 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground-800 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="ban@example.com"
                      className="w-full px-4 py-3 rounded-md bg-background-100 border border-background-200 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-1.5">Điểm di sản liên quan</label>
                  <select
                    name="location_id"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-md bg-background-100 border border-background-200 text-sm text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
                  >
                    <option value="">Chọn điểm di sản...</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} — {l.province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground-800 mb-2">Loại tư liệu</label>
                  <div className="inline-flex gap-2 p-1 bg-background-100 rounded-full">
                    <button
                      type="button"
                      onClick={() => setContentType('text')}
                      className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                        contentType === 'text' ? 'bg-primary-500 text-background-50' : 'text-foreground-700 hover:bg-background-200'
                      }`}
                    >
                      <i className="ri-file-text-line mr-1"></i> Văn bản
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentType('audio')}
                      className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                        contentType === 'audio' ? 'bg-accent-500 text-foreground-950' : 'text-foreground-700 hover:bg-background-200'
                      }`}
                    >
                      <i className="ri-mic-line mr-1"></i> Ghi âm
                    </button>
                  </div>
                </div>

                {contentType === 'text' ? (
                  <div>
                    <label className="block text-sm font-medium text-foreground-800 mb-1.5">Nội dung tư liệu</label>
                    <textarea
                      name="text_content"
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      required
                      maxLength={500}
                      rows={6}
                      placeholder="Hãy kể lại câu chuyện, ký ức hoặc thông tin bạn muốn chia sẻ..."
                      className="w-full px-4 py-3 rounded-md bg-background-100 border border-background-200 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                    />
                    <div className="mt-1 text-xs text-foreground-500 text-right">{textContent.length}/500</div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-foreground-800 mb-1.5">Đường dẫn file ghi âm</label>
                    <input
                      type="url"
                      name="audio_path"
                      value={audioPath}
                      onChange={(e) => setAudioPath(e.target.value)}
                      required
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-md bg-background-100 border border-background-200 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                    <p className="mt-2 text-xs text-foreground-500">
                      Dán đường dẫn đến file ghi âm (mp3, wav) trên Google Drive, SoundCloud hoặc dịch vụ lưu trữ khác.
                    </p>
                  </div>
                )}

                {/* Honeypot */}
                <input
                  type="text"
                  name="phone_alt"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  readOnly
                  className="hp-alt-field"
                />

                {status && (
                  <div
                    className={`rounded-md text-sm px-4 py-3 ${
                      status.type === 'success' ? 'bg-secondary-100 text-secondary-800' : 'bg-primary-100 text-primary-700'
                    }`}
                  >
                    {status.msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-md bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-background-50 border-t-transparent rounded-full animate-spin"></span>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line"></i> Gửi tư liệu
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info sidebar */}
            <div className="space-y-5">
              {[
                {
                  icon: 'ri-shield-check-line',
                  title: 'Kiểm duyệt trước khi đăng',
                  desc: 'Mọi đóng góp đều được quản trị viên xem xét và phân loại "Xác thực" hay "Dân gian" trước khi xuất bản.',
                },
                {
                  icon: 'ri-archive-line',
                  title: 'Ghi rõ nguồn gốc',
                  desc: 'Nếu có nguồn sử liệu chính thống, hãy ghi rõ để chúng tôi phân loại chính xác.',
                },
                {
                  icon: 'ri-award-line',
                  title: 'Được ghi tên đóng góp',
                  desc: 'Người đóng góp sẽ xuất hiện trong danh sách ghi nhận của điểm di sản tương ứng.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-background-100 border border-background-200 p-5 flex gap-4">
                  <div className="w-11 h-11 flex-shrink-0 rounded-full bg-secondary-500 text-background-50 flex items-center justify-center">
                    <i className={`${item.icon} text-lg`}></i>
                  </div>
                  <div>
                    <h3 className="font-heading text-base text-foreground-950">{item.title}</h3>
                    <p className="mt-1 text-sm text-foreground-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}