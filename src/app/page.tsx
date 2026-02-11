import { ArrowRight, Sparkles, Target, Brain, TrendingUp, Users, BarChart3, MessageCircle, Shield, Zap, CheckCircle, Star, GraduationCap, Briefcase, Award, BookOpen, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'

import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation handled by LayoutWrapper */}

      {/* Hero Section - Modern Split Layout */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-100/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-200/30 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-700 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Career Operating System untuk Gen Z</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                Bangun Karier
                <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Tanpa Kebingungan
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Platform <strong className="text-indigo-600">all-in-one</strong> yang membantu Gen Z Makassar
                menemukan karier impian dengan <strong className="text-indigo-600">skill mapping</strong>,
                <strong className="text-indigo-600"> AI insights</strong>, dan
                <strong className="text-indigo-600"> mental health support</strong>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
                >
                  Mulai Perjalananmu
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-300"
                >
                  Lihat Cara Kerja
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>100% Gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <span>Data Aman</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>Setup 2 Menit</span>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative lg:pl-8">
              <div className="relative">
                {/* Main Image */}
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20">
                  <Image
                    src="/hero-image.png"
                    alt="Profesional muda sukses dengan CareerPath.id"
                    width={600}
                    height={500}
                    className="w-full h-auto"
                    priority
                  />
                </div>

                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">85%</p>
                      <p className="text-sm text-gray-500">Skill Match</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 z-20 bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white" />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 border-2 border-white" />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 border-2 border-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">500+ Users</span>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -z-10 top-8 right-8 w-full h-full rounded-3xl bg-gradient-to-br from-indigo-200 to-cyan-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-3 text-gray-400">
              <Award className="w-8 h-8" />
              <div>
                <p className="font-bold text-gray-700">PKM 2026</p>
                <p className="text-xs">Didanai Dikti</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <GraduationCap className="w-8 h-8" />
              <div>
                <p className="font-bold text-gray-700">5+ Universitas</p>
                <p className="text-xs">Mitra Kampus</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Users className="w-8 h-8" />
              <div>
                <p className="font-bold text-gray-700">500+ Users</p>
                <p className="text-xs">Aktif Belajar</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <MapPin className="w-8 h-8" />
              <div>
                <p className="font-bold text-gray-700">Makassar</p>
                <p className="text-xs">Fokus Lokal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4">
              KENAPA CAREERPATH.ID?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              3 Pilar Sukses untuk
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Masa Depan Kariermu
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Kami menggabungkan teknologi AI dengan pendekatan holistik untuk membantu
              kamu meraih karier impian tanpa mengorbankan kesehatan mental.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Value Prop 1: Skill Gap Analysis */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Skill Gap Analysis</h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  AI kami menganalisis skill yang kamu miliki vs skill yang dibutuhkan
                  untuk karier impianmu. Dapatkan roadmap personal untuk menutup gap tersebut.
                </p>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>Identifikasi skill yang perlu dikembangkan</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>Rekomendasi learning path personal</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>Track progress real-time</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Value Prop 2: Mentor Virtual */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute -top-3 -right-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold shadow-lg">
                  <Star className="w-3 h-3" /> POPULER
                </span>
              </div>

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mentor Virtual AI</h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Konsultasi kapan saja dengan AI Career Coach kami. Jawaban instan
                  untuk pertanyaan seputar karier, skill, dan pengembangan diri.
                </p>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0" />
                    <span>Available 24/7, tanpa antri</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0" />
                    <span>Personalized career advice</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0" />
                    <span>CV & interview tips</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Value Prop 3: Mental Health Support */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mental Health Support</h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Kami paham perjalanan karier bisa stressful. Fitur wellness kami
                  membantu menjaga kesehatan mentalmu sepanjang perjalanan.
                </p>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-purple-500 shrink-0" />
                    <span>Daily mood & anxiety tracker</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-purple-500 shrink-0" />
                    <span>Guided breathing & mindfulness</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-purple-500 shrink-0" />
                    <span>Konsultasi psikolog terintegrasi</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold mb-4">
              CARA KERJA
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Mulai dalam 4 Langkah Mudah
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Daftar Gratis', desc: 'Buat akun dalam hitungan detik', icon: Users, color: 'indigo' },
              { step: '02', title: 'Pilih Karier Impian', desc: 'Tentukan tujuan kariermu', icon: Target, color: 'cyan' },
              { step: '03', title: 'Analisis Skill Gap', desc: 'AI identifikasi skill yang perlu dikembangkan', icon: BarChart3, color: 'purple' },
              { step: '04', title: 'Mulai Belajar', desc: 'Ikuti roadmap personal untuk sukses', icon: TrendingUp, color: 'amber' },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                )}
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm font-bold text-indigo-600 mb-2 block">{item.step}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Gen Z Users' },
              { number: '20+', label: 'Career Paths' },
              { number: '50+', label: 'Skills Database' },
              { number: '95%', label: 'User Satisfaction' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-black text-white mb-2">{stat.number}</p>
                <p className="text-indigo-200 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
              TESTIMONI
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cerita Sukses Mereka
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Bergabung dengan ratusan Gen Z yang sudah menemukan arah karier mereka
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Andi Pratama',
                role: 'Mahasiswa Teknik Informatika',
                university: 'Universitas Hasanuddin',
                quote: 'CareerPath.id membantuku menemukan skill gap yang perlu dikembangkan untuk jadi Frontend Developer. Sekarang aku lebih percaya diri!',
                image: '/testimonials/andi.jpg'
              },
              {
                name: 'Sari Dewi',
                role: 'Fresh Graduate',
                university: 'Universitas Negeri Makassar',
                quote: 'Fitur mental health support-nya sangat membantu. Aku jadi bisa manage anxiety saat apply kerja. Highly recommended!',
                image: '/testimonials/sari.jpg'
              },
              {
                name: 'Budi Santoso',
                role: 'Mahasiswa Manajemen',
                university: 'STIE Nobel',
                quote: 'Mentor virtual AI-nya keren! Bisa konsultasi kapan aja tentang career path tanpa harus booking sesi mahal.',
                image: '/testimonials/budi.jpg'
              }
            ].map((testimonial, index) => (
              <div key={index} className="group p-6 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-xs text-indigo-600">{testimonial.university}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths Preview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
              KARIER POPULER
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Temukan Karier Impianmu
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Jelajahi berbagai jalur karier yang sesuai dengan minat dan kemampuanmu
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'UI/UX Designer', salary: '6-25 Juta', demand: 'Very High', icon: '🎨', color: 'from-violet-500 to-purple-500' },
              { title: 'Frontend Developer', salary: '7-30 Juta', demand: 'Very High', icon: '💻', color: 'from-blue-500 to-cyan-500' },
              { title: 'Data Analyst', salary: '7-28 Juta', demand: 'Very High', icon: '📊', color: 'from-emerald-500 to-teal-500' },
              { title: 'Digital Marketer', salary: '6-25 Juta', demand: 'Very High', icon: '📈', color: 'from-orange-500 to-amber-500' },
            ].map((career, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${career.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {career.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{career.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">💰 Rp {career.salary}</span>
                </div>
                <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  {career.demand}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Lihat Semua Karier
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-600/20 to-transparent rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Jangan Biarkan Kebingungan
            <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text">
              Menghentikan Langkahmu
            </span>
          </h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
            Bergabung dengan ratusan Gen Z Indonesia yang sudah memulai perjalanan
            menuju karier impian mereka. Gratis selamanya untuk fitur dasar.
          </p>
          <Link
            href="/register"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
          >
            Mulai Sekarang — Gratis!
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="text-indigo-300 text-sm mt-6">
            ✨ No credit card required • Setup dalam 2 menit
          </p>
        </div>
      </section>

      {/* Footer handled by LayoutWrapper */}

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp phoneNumber="6281934415371" />
    </div>
  )
}
