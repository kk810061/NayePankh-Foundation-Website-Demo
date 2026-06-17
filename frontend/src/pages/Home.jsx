import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="font-sans">
      {/* Hero Section */}
      <section className="relative">
        {/* Dark overlay that covers most of the section and fades to transparent at the bottom edge */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/70 to-transparent via-80%"></div>
        
        <div className="relative z-10 mx-auto max-w-5xl px-4 pb-48 pt-16 text-center">
          <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
            Giving Wings to Uplift Society
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-slate-300">
            We are a 100% youth-led initiative fighting hunger, promoting hygiene, and empowering communities across India. <span className="font-semibold text-emerald-400 italic">Badalte Bharat Ki Nayi Tasveer!</span>
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/volunteer/dashboard"
              className="rounded-full bg-emerald-600 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-900/50 transition-all hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-emerald-900/80"
            >
              Become a Volunteer
            </Link>
            <Link
              to="/programs"
              className="rounded-full border-2 border-stone-600 bg-stone-900/50 px-8 py-4 font-bold text-stone-200 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-stone-400 hover:bg-stone-800"
            >
              Explore Programs
            </Link>
          </div>

          <div className="mx-auto mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
            <p className="mb-6 text-sm font-semibold tracking-widest text-stone-400 uppercase">
              All initiatives are managed through our unified volunteer dashboard
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {['Food Support', 'Education Drives', 'Health & Hygiene Camps'].map((item) => (
                <div key={item} className="group flex items-center justify-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-emerald-500/10 cursor-default">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                  <p className="text-lg font-bold text-white transition-colors group-hover:text-emerald-400">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section - What We Do Grid */}
      <section className="relative z-20 mx-auto max-w-6xl px-4 py-10 pb-20">
        <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-500">
              Our Mission
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">What We Do</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-8 transition-colors hover:bg-white/10">
              <h3 className="mb-3 text-xl font-bold text-emerald-400">Pandemic Roots</h3>
              <p className="leading-relaxed text-stone-400">
                Started during the tough times of COVID, we've expanded our vision to provide holistic help to those in need across society.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-8 transition-colors hover:bg-white/10">
              <h3 className="mb-3 text-xl font-bold text-emerald-400">Women's Hygiene</h3>
              <p className="leading-relaxed text-stone-400">
                Breaking the stigma. We create awareness campaigns among women and youths about personal hygiene and provide sanitary napkins.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-8 transition-colors hover:bg-white/10">
              <h3 className="mb-3 text-xl font-bold text-emerald-400">Fighting Hunger</h3>
              <p className="leading-relaxed text-stone-400">
                In our endeavor to fight hunger, we distribute food not only to underprivileged communities but also to stray animals.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-8 transition-colors hover:bg-white/10">
              <h3 className="mb-3 text-xl font-bold text-emerald-400">Essential Support</h3>
              <p className="leading-relaxed text-stone-400">
                Providing clothes to poor families and educating the underprivileged sectors of our society for a better, brighter future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
          <Stat number="2 Lakhs+" label="People Helped" />
          <Stat number="100%" label="Youth Led Organization" />
          <Stat number="12A & 80G" label="Certified NGO" />
        </div>
      </section>
    </main>
  )
}

function Stat({ number, label }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center transition-all hover:-translate-y-2 hover:bg-white/10 backdrop-blur-md">
      <p className="text-4xl font-bold text-emerald-400 md:text-5xl">{number}</p>
      <p className="mt-3 font-medium tracking-wide text-stone-400 uppercase text-sm">{label}</p>
    </div>
  )
}

export default Home
