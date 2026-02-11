import Link from 'next/link'
import { Compass, Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Heart, Briefcase } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-white">CareerPath</span>
                                <span className="text-[10px] text-gray-500 -mt-1 tracking-wider">.id</span>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Career Operating System untuk Gen Z Indonesia. Rencanakan kariermu,
                            tingkatkan skillmu, dan jaga kesehatan mentalmu dalam satu platform.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Navigasi</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/features" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                    Fitur
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                    Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/faq" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                    Pusat Bantuan & FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                    Kebijakan Privasi
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                    Syarat & Ketentuan
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                                    Kebijakan Cookie
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Hubungi Kami</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-400">
                                    Makassar, Sulawesi Selatan<br />Indonesia
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-cyan-500 shrink-0" />
                                <a href="mailto:hello@careerpath.id" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                                    hello@careerpath.id
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-cyan-500 shrink-0" />
                                <a href="tel:+6281234567890" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                                    +62 812 3456 7890
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">
                            © {currentYear} CareerPath.id. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            Dibuat dengan <Heart className="w-4 h-4 text-rose-500 animate-pulse" /> di Makassar
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
