import { useState } from 'react';
import type { HeritageContent } from '@/types/heritage';
import AudioPlayer from './AudioPlayer';

interface Props {
  contents: HeritageContent[];
}

export default function ContentTabs({ contents }: Props) {
  const [tab, setTab] = useState<'authentic' | 'folk'>('authentic');

  const authentic = contents.filter((c) => c.content_type === 'authentic');
  const folk = contents.filter((c) => c.content_type === 'folk');

  const activeList = tab === 'authentic' ? authentic : folk;

  const tabs = [
    {
      id: 'authentic' as const,
      label: 'Dữ liệu xác thực',
      icon: 'ri-book-marked-line',
      desc: 'Tài liệu lịch sử, di tích, nhân vật & sự kiện có thật, có nguồn sử liệu chính thống.',
      count: authentic.length,
    },
    {
      id: 'folk' as const,
      label: 'Văn hóa dân gian',
      icon: 'ri-fire-line',
      desc: 'Truyền thuyết, giai thoại truyền miệng & tín ngưỡng dân gian - chưa xác thực bằng sử liệu.',
      count: folk.length,
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-background-50">
      <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
            Kho lưu trữ nội dung số
          </div>
          <h2 className="font-heading text-2xl md:text-4xl text-foreground-950 font-semibold">
            Chạm vào ký ức qua chữ và tiếng
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-col sm:inline-flex sm:flex-row gap-2 p-1 bg-background-100 rounded-2xl sm:rounded-full mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all inline-flex items-center gap-2 justify-center sm:justify-start ${
                tab === t.id
                  ? t.id === 'authentic'
                    ? 'bg-primary-500 text-background-50'
                    : 'bg-accent-500 text-foreground-950'
                  : 'text-foreground-700 hover:bg-background-200'
              }`}
            >
              <i className={t.icon}></i>
              {t.label}
              <span
                className={`text-xs px-1.5 rounded-full ${
                  tab === t.id ? 'bg-background-50/25' : 'bg-background-200'
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <p className="text-sm text-foreground-600 max-w-2xl mb-8">
          {tabs.find((t) => t.id === tab)?.desc}
        </p>

        {activeList.length === 0 ? (
          <div className="text-center py-16 text-foreground-500 text-sm">
            <i className="ri-inbox-line text-4xl block mb-3 text-foreground-400"></i>
            Chưa có nội dung nào trong nhóm này.
          </div>
        ) : (
          <div className="space-y-6">
            {activeList.map((c) => (
              <article
                key={c.id}
                className="rounded-2xl bg-background-100 border border-background-200 p-6 md:p-8"
              >
                <h3 className="font-heading text-xl md:text-2xl text-foreground-950 font-semibold">
                  {c.title}
                </h3>
                <p className="mt-3 text-foreground-700 leading-relaxed whitespace-pre-line">
                  {c.body}
                </p>

                <AudioPlayer text={c.body} title={c.title} audioUrl={c.audio_url} />

                <div className="mt-5 pt-4 border-t border-background-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-foreground-500">
                  {c.source && (
                    <span className="inline-flex items-center gap-1.5">
                      <i className="ri-archive-line"></i>
                      Nguồn: {c.source}
                    </span>
                  )}
                  {c.author && (
                    <span className="inline-flex items-center gap-1.5">
                      <i className="ri-user-line"></i>
                      {c.author}
                    </span>
                  )}
                  {tab === 'folk' && (
                    <span className="inline-flex items-center gap-1.5 text-accent-700">
                      <i className="ri-information-line"></i>
                      Chưa xác thực bằng sử liệu
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}