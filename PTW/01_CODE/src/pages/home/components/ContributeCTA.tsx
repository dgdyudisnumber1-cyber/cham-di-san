import { assetUrl } from '@/lib/asset-url';
import { Link } from 'react-router-dom';

export default function ContributeCTA() {
  return (
    <section id="contribute" className="py-16 md:py-24 bg-background-50">
      <div className="w-full px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-background-200">
          <img
            src={assetUrl("https://readdy.ai/api/search-image?query=Old%20handwritten%20Vietnamese%20cultural%20heritage%20manuscript%20pages%20with%20traditional%20calligraphy%20ink%20brush%20and%20aged%20paper%20texture%20on%20wooden%20desk%2C%20warm%20cream%20and%20amber%20tones%2C%20soft%20natural%20window%20light%2C%20muted%20earthy%20heritage%20palette%2C%20editorial%20archival%20photography%2C%20cinematic%20nostalgic%20atmosphere&width=1600&height=800&seq=contribute-cta-bg-01&orientation=landscape")}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground-950/85 via-foreground-950/70 to-foreground-950/40"></div>

          <div className="relative p-8 md:p-16 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-50/15 backdrop-blur border border-background-50/20 text-background-50 text-xs tracking-widest uppercase mb-6">
              Phân hệ đóng góp cộng đồng
            </div>
            <h2 className="font-heading text-3xl md:text-5xl text-background-50 font-semibold leading-tight">
              Bạn có một câu chuyện chưa được kể?
            </h2>
            <p className="mt-5 text-background-100 leading-relaxed">
              Nhà nghiên cứu, sinh viên, người con xa quê - hãy gửi tư liệu văn bản hoặc bản ghi âm về làng, về ông bà,
              về lễ hội mà bạn nhớ. Quản trị viên sẽ duyệt và đưa lên bản đồ.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-background-100">
              {[
                'Chấp nhận văn bản, ảnh tư liệu và file ghi âm (mp3, wav)',
                'Ghi rõ nguồn để phân loại "Xác thực" hay "Dân gian"',
                'Được ghi tên trong danh sách người đóng góp của điểm di sản',
              ].map((li) => (
                <li key={li} className="flex items-start gap-2">
                  <i className="ri-check-line text-accent-400 mt-0.5"></i>
                  {li}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/contribute"
                className="px-6 py-3 rounded-md bg-accent-500 hover:bg-accent-600 text-foreground-950 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center gap-2"
              >
                <i className="ri-upload-cloud-2-line"></i>
                Gửi tư liệu của bạn
              </Link>
              <Link
                to="/contribute"
                className="px-6 py-3 rounded-md bg-background-50/10 hover:bg-background-50/20 border border-background-50/30 text-background-50 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors inline-flex items-center gap-2"
              >
                Hướng dẫn đóng góp
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}