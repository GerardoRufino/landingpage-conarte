'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      scrolled 
        ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-black/5' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mx-32 xl:mx-40 2xl:mx-auto">
        <div className="flex justify-between items-center h-20 lg:h-12 xl:h-12 2xl:h-20">
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/images/conarte-logo.png" 
                alt="Conarte Logo" 
                width={120}
                height={120}
                className="object-contain lg:w-16 lg:h-16 xl:w-16 xl:h-16 2xl:w-[120px] 2xl:h-[120px]"
              />
            </Link>
          </div>
          
          <div className="hidden lg:flex lg:items-center lg:space-x-4 xl:space-x-4 2xl:space-x-8">
            <a 
              href="#inicio" 
              className={`transition-all duration-500 font-medium lg:text-xs xl:text-xs 2xl:text-base ${
                scrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-[#9A1D25] dark:hover:text-[#ff6b6b]'
                  : 'text-white hover:text-white/80'
              }`}
            >
              <span className='font-bold'>
                Inicio
              </span>
            </a>
            <a 
              href="#nosotros" 
              className={`transition-all duration-500 font-medium lg:text-xs xl:text-xs 2xl:text-base ${
                scrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-[#9A1D25] dark:hover:text-[#ff6b6b]'
                  : 'text-white hover:text-white/80'
              }`}
            >
              <span className='font-bold'>
                Nosotros
              </span>
            </a>
            <a 
              href="#servicios" 
              className={`transition-all duration-500 font-medium lg:text-xs xl:text-xs 2xl:text-base ${
                scrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-[#9A1D25] dark:hover:text-[#ff6b6b]'
                  : 'text-white hover:text-white/80'
              }`}
            >
              <span className='font-bold'>
                Servicios
              </span>
            </a>
            <a 
              href="#proyectos" 
              className={`transition-all duration-500 font-medium lg:text-xs xl:text-xs 2xl:text-base ${
                scrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-[#9A1D25] dark:hover:text-[#ff6b6b]'
                  : 'text-white hover:text-white/80'
              }`}
            >
              <span className='font-bold'>
                Proyectos
              </span>
            </a>
            <a 
              href="#equipo" 
              className={`transition-all duration-500 font-medium lg:text-xs xl:text-xs 2xl:text-base ${
                scrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-[#9A1D25] dark:hover:text-[#ff6b6b]'
                  : 'text-white hover:text-white/80'
              }`}
            >
              <span className='font-bold'>
                Equipo
              </span>
            </a>
            <a 
              href="#contacto" 
              className="bg-[#9A1D25] hover:bg-[#7A1519] text-white font-bold px-6 py-2.5 lg:px-3 lg:py-1.5 lg:text-xs xl:px-3 xl:py-1.5 xl:text-xs 2xl:px-6 2xl:py-2.5 2xl:text-base rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Contacto
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className={`transition-all duration-500 ${
                scrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:text-[#9A1D25] dark:hover:text-[#ff6b6b]'
                  : 'text-white hover:text-white/80'
              }`}
              aria-label="Menú"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
