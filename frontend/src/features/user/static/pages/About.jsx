import React from 'react';
import { ArrowRight, Compass, Heart, Map, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: Compass,
    title: 'Khám phá có định hướng',
    description:
      'Tìm hiểu điểm đến, vùng miền và các lựa chọn tour để bắt đầu hành trình theo cách phù hợp với sở thích của bạn.',
  },
  {
    icon: Heart,
    title: 'Tôn trọng trải nghiệm riêng',
    description:
      'Mỗi chuyến đi có một lý do riêng. TravelTrail giúp bạn tham khảo thông tin và lựa chọn hành trình theo nhu cầu của mình.',
  },
  {
    icon: ShieldCheck,
    title: 'Thông tin rõ ràng',
    description:
      'Các nội dung về điểm đến và tour được trình bày để bạn dễ tìm hiểu trước khi đưa ra lựa chọn.',
  },
];

const benefits = [
  {
    icon: Map,
    title: 'Khám phá điểm đến',
    description:
      'Tìm hiểu đặc trưng vùng miền, mùa du lịch, hoạt động và những thông tin hữu ích cho chuyến đi.',
  },
  {
    icon: Compass,
    title: 'Tham khảo tour phù hợp',
    description:
      'Xem các tour, thời lượng và thông tin liên quan để cân nhắc lựa chọn cho hành trình của bạn.',
  },
  {
    icon: Sparkles,
    title: 'Bắt đầu lên kế hoạch',
    description:
      'Lưu lại điểm đến yêu thích, khám phá bộ sưu tập và tiếp tục tìm hiểu từng bước theo nhịp độ của riêng bạn.',
  },
];

export const About = () => {
  return (
    <div className="w-full bg-[#f8fafc] pt-[72px]">
      <section className="relative isolate overflow-hidden bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 px-4 py-20 text-white sm:py-28">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-50 backdrop-blur-sm">
            <Compass className="h-4 w-4" />
            Về TravelTrail
          </span>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Mỗi hành trình bắt đầu từ một điều bạn muốn khám phá
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-sky-50 sm:text-lg">
            TravelTrail là nền tảng giúp bạn khám phá điểm đến, tìm hiểu các lựa chọn tour
            và từng bước hình dung chuyến đi tiếp theo của mình.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/destinations"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-sky-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-50"
            >
              Khám phá điểm đến
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/collections"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Xem bộ sưu tập
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Giới thiệu
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Một nơi để chuyến đi trong tâm trí thành kế hoạch rõ ràng hơn
            </h2>
          </div>
          <div className="space-y-5 text-sm leading-7 text-slate-600 sm:text-base">
            <p>
              Từ việc chọn nơi muốn đến đến lúc cân nhắc một tour cụ thể, người đi du lịch
              thường cần xem nhiều thông tin trước khi quyết định. TravelTrail tập hợp các
              nội dung về điểm đến, vùng miền, bộ sưu tập và tour trong cùng một trải nghiệm
              trực tuyến.
            </p>
            <p>
              Chúng tôi hướng đến việc giúp bạn bắt đầu dễ dàng hơn: khám phá điều mình
              quan tâm, so sánh những lựa chọn đang có và tiếp tục tìm hiểu hành trình phù
              hợp với mình.
            </p>
          </div>
        </div>
      </section>

      <section id="mission" className="border-y border-sky-100 bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Sứ mệnh
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Giúp việc tìm cảm hứng du lịch trở nên gần gũi hơn
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              TravelTrail mong muốn kết nối cảm hứng khám phá với thông tin hữu ích, để
              mỗi người có thể tự tin tìm hiểu và lựa chọn cách đi phù hợp với mình.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-lg hover:shadow-sky-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Dành cho hành trình của bạn
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Khám phá theo cách của riêng bạn
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Dù bạn đã có điểm đến trong đầu hay vẫn đang tìm cảm hứng, TravelTrail mang
              đến những cách bắt đầu khác nhau.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article key={title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 px-6 py-10 text-center text-white shadow-lg shadow-sky-900/10 sm:px-12 sm:py-14">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Hành trình tiếp theo của bạn sẽ bắt đầu ở đâu?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-sky-50 sm:text-base">
            Dạo quanh các điểm đến và bộ sưu tập của TravelTrail để tìm ý tưởng cho chuyến
            đi mà bạn đang mong đợi.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/destinations"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-sky-700 transition hover:bg-sky-50"
            >
              Bắt đầu khám phá
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/collections"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Xem bộ sưu tập
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
