'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ToretBull from './ToretBull' // Importing the central, reusable logo

export default function Footer() {
  const pathname = usePathname()

  // Hide the footer completely on focus-heavy pages like Login
  if (pathname === '/login') {
    return null
  }

  return (
    <footer className="bg-[#132600] px-6 lg:px-8 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Partners Section */}
        <div className="border-b border-[#FAFAF7]/10 pb-10 mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C9963E] mb-6">
            In partnership with
          </p>
          <div className="flex flex-wrap gap-2.5 items-center">
            {[
              'Città di Torino',
              'Regione Piemonte',
              'Università di Torino',
              'Politecnico di Torino',
              'Edisu Piemonte',
            ].map((p) => (
              <span
                key={p}
                className="text-xs font-semibold text-[#FAFAF7]/50 border border-[#FAFAF7]/15 rounded-full px-4 py-2 whitespace-nowrap hover:bg-[#FAFAF7]/5 transition cursor-default"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Section (Logo & Links) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            {/* Using the central ToretBull with the explicit color for the dark background */}
            <ToretBull className="w-8 h-8 text-[#FAFAF7] opacity-90" />
            <span
              className="text-xl font-bold text-[#FAFAF7]"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              Toro
            </span>
            <span className="text-xs font-medium text-[#FAFAF7]/30 ml-2 hidden sm:inline-block">
              © {new Date().getFullYear()} · Torino, Piemonte
            </span>
          </div>

          {/* Mobile-only copyright */}
          <span className="text-[10px] font-medium text-[#FAFAF7]/30 sm:hidden">
             © {new Date().getFullYear()} · Torino, Piemonte
          </span>

          {/* Legal Links */}
          <div className="flex gap-6">
            <Link href="#" className="text-xs font-medium text-[#FAFAF7]/50 hover:text-[#FAFAF7] transition">
              Privacy
            </Link>
            <Link href="#" className="text-xs font-medium text-[#FAFAF7]/50 hover:text-[#FAFAF7] transition">
              Terms
            </Link>
            <Link href="#" className="text-xs font-medium text-[#FAFAF7]/50 hover:text-[#FAFAF7] transition">
              Contacts
            </Link>
          </div>
          
        </div>
      </div>
    </footer>
  )
}