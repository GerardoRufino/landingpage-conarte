'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['concreto', 'familias', 'empresas', 'acero', 'proyectos', 'estructuras'];
  
  // Estado para los contadores animados
  const [counters, setCounters] = useState({
    years: 0,
    projects: 0,
    specialties: 0,
    satisfaction: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Estado para el scroll sticky con cambio de contenido
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(e => console.error('Error playing video:', e));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Primero aplicar animación de salida
      const currentElement = document.querySelector('.rotating-word');
      if (currentElement) {
        currentElement.classList.remove('animate__fadeInDown');
        currentElement.classList.add('animate__fadeOutUp');
        
        // Después de la animación de salida, cambiar la palabra
        setTimeout(() => {
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 400);
      }
    }, 2500); // Cambia cada 2.5 segundos

    return () => clearInterval(interval);
  }, [words.length]);

  // Efecto para animar los contadores cuando la sección sea visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Animar años (24)
            let yearsCount = 0;
            const yearsInterval = setInterval(() => {
              yearsCount += 1;
              setCounters(prev => ({ ...prev, years: yearsCount }));
              if (yearsCount >= 24) clearInterval(yearsInterval);
            }, 50);
            
            // Animar proyectos (500)
            let projectsCount = 0;
            const projectsInterval = setInterval(() => {
              projectsCount += 10;
              setCounters(prev => ({ ...prev, projects: projectsCount }));
              if (projectsCount >= 500) {
                setCounters(prev => ({ ...prev, projects: 500 }));
                clearInterval(projectsInterval);
              }
            }, 15);
            
            // Animar especialidades (15)
            let specialtiesCount = 0;
            const specialtiesInterval = setInterval(() => {
              specialtiesCount += 1;
              setCounters(prev => ({ ...prev, specialties: specialtiesCount }));
              if (specialtiesCount >= 15) clearInterval(specialtiesInterval);
            }, 70);
            
            // Animar satisfacción (100)
            let satisfactionCount = 0;
            const satisfactionInterval = setInterval(() => {
              satisfactionCount += 2;
              setCounters(prev => ({ ...prev, satisfaction: satisfactionCount }));
              if (satisfactionCount >= 100) {
                setCounters(prev => ({ ...prev, satisfaction: 100 }));
                clearInterval(satisfactionInterval);
              }
            }, 20);
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => {
      if (statsSection) observer.unobserve(statsSection);
    };
  }, [hasAnimated]);

  // Efecto para escuchar el scroll de la sección sticky
  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector('[data-sticky-section]');
      if (!section) return;
      
      const rect = section.getBoundingClientRect();
      const scrollProgress = -rect.top / (rect.height - window.innerHeight);
      const newSection = Math.min(5, Math.max(0, Math.floor(scrollProgress * 6)));
      
      setActiveSection(newSection);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Hero Section - Elegant & Clean */}
      <section className="h-screen relative overflow-hidden flex items-center justify-center">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ filter: 'blur(2px)' }}
        >
          <source src="/video/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Elegant Dark Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/55 to-black/80 z-10"></div>
        
        {/* Hero Content - Minimalist */}
        <div className="container mx-auto px-6 text-center relative z-20 max-w-6xl">
          
          {/* Simple Badge */}
          <div className="mb-12">
            <span className="px-6 py-2 border border-white/40 rounded-full text-white/90 text-sm font-medium tracking-wide backdrop-blur-sm">
              CONARTE • Puebla, México
            </span>
          </div>
          
          {/* Beautiful Title with Rotating Text */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-10 leading-[1.1] tracking-tight">
            <span className="block text-7xl font-extrabold mb-2">Construimos sueños de</span>
            <span className="block font-black text-4xl md:text-7xl lg:text-8xl drop-shadow-lg">
              <span 
                key={currentWordIndex}
                className="rotating-word inline-block animate__animated animate__fadeInDown animate__duration-500ms text-transparent bg-clip-text bg-linear-to-r from-white via-red-200 to-white"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {words[currentWordIndex]}
              </span>
            </span>
          </h1>
          
          {/* Poetic Description */}
          <div className="mb-12 max-w-3xl mx-auto">
            <p className="text-2xl md:text-3xl text-white mb-4 font-light leading-relaxed" style={{
              textShadow: '0 0 25px rgba(0,0,0,0.95), 0 0 50px rgba(0,0,0,0.8), 3px 3px 6px rgba(0,0,0,1)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)'
            }}>
              Donde la <span className="font-bold text-white italic" style={{
                textShadow: '0 0 20px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,1)',
                backdropFilter: 'blur(2px)'
              }}>visión</span> se encuentra con la <span className="font-bold text-white italic" style={{
                textShadow: '0 0 25px rgba(0,0,0,1), 3px 3px 6px rgba(0,0,0,1)'
              }}>realidad</span>
            </p>
            <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed" style={{
              textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,1)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)'
            }}>
              Más de una década transformando Puebla con arquitectura que trasciende el tiempo
            </p>
          </div>
          
          {/* Clean CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group relative bg-linear-to-r from-[#9A1D25] to-[#C02530] hover:from-[#7A1519] hover:to-[#9A1D25] text-white font-bold py-5 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Ver proyectos
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            <button className="group relative border-2 border-white/80 hover:border-white bg-white/10 hover:bg-white/20 text-white font-bold py-5 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-md shadow-lg hover:shadow-2xl">
              <span className="flex items-center gap-2">
                Contactar
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            </button>
          </div>
          
        </div>
      </section>

      {/* Stats Section - ¿Por qué elegirnos? */}  
      <section className="bg-white dark:bg-gray-900 py-20 max-w-7xl mx-auto stats-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate__animated animate__fadeIn">
            <span className="text-[#9A1D25] font-bold text-sm uppercase tracking-wider">¿Por qué elegirnos?</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-2 mb-4">Nuestra Experiencia</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Con más de dos décadas de experiencia, ofrecemos soluciones innovadoras en construcción y desarrollo urbano, 
              respaldadas por un equipo multidisciplinario de profesionales comprometidos con la excelencia y la satisfacción de nuestros clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Experiencia Comprobada */}
            <div className="bg-linear-to-br from-gray-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 animate__animated animate__fadeInLeft">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Experiencia Comprobada</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                Más de 24 años de experiencia en el sector de la construcción y desarrollo urbano desde el año 2000.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-[#8B1E2D] mb-1">{counters.years}+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Años de experiencia</div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-[#8B1E2D] mb-1">{counters.projects}+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Proyectos realizados</div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-[#8B1E2D] mb-1">{counters.specialties}+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Especialidades</div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-[#8B1E2D] mb-1">{counters.satisfaction}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Satisfacción</div>
                </div>
              </div>
            </div>

            {/* Columna 2: Equipo Profesional y Certificaciones */}
            <div className="space-y-8 animate__animated animate__fadeInUp">
              {/* Equipo Profesional */}
              <div className="bg-linear-to-br from-gray-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-center mb-6">
                  <svg className="w-16 h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Equipo Profesional</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Personal multidisciplinario especializado en arquitectura, ingeniería civil, diseño urbano y ecología.
                </p>
              </div>

              {/* Certificaciones */}
              <div className="bg-linear-to-br from-gray-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-center mb-6">
                  <svg className="w-16 h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Certificaciones</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Registro en el Padrón de Contratistas del Municipio de Puebla con múltiples especialidades autorizadas.
                </p>
              </div>
            </div>

            {/* Servicios Integrales */}
            <div className="bg-linear-to-br from-gray-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 animate__animated animate__fadeInRight">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Servicios Integrales</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                Ofrecemos soluciones completas para tu proyecto de construcción y desarrollo urbano.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-[#8B1E2D] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Proyectos arquitectónicos y urbanos</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-[#8B1E2D] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Edificaciones residenciales y comerciales</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-[#8B1E2D] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Estudios de impacto ambiental y urbano</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-[#8B1E2D] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Urbanización y pavimentación</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-[#8B1E2D] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Supervisión y consultoría especializada</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Servicios Principales */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-2 mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transformamos tu visión en realidad con soluciones integrales de construcción y desarrollo urbano. Más de 24 años de experiencia nos respaldan para entregar proyectos de excelencia que superan expectativas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Proyectos Arquitectónicos y Urbanos */}
            <div className="group bg-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Proyectos Arquitectónicos y Urbanos</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Diseño y desarrollo integral de espacios residenciales y comerciales
              </p>
            </div>

            {/* Edificaciones */}
            <div className="group bg-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Edificaciones</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Construcción y mantenimiento de espacios residenciales y comerciales
              </p>
            </div>

            {/* Obra Civil e Instalaciones */}
            <div className="group bg-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Obra Civil e Instalaciones</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Soluciones integrales en infraestructura e instalaciones especializadas
              </p>
            </div>

            {/* Urbanización */}
            <div className="group bg-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Urbanización</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Desarrollo integral de infraestructura urbana y vialidades
              </p>
            </div>

            {/* Estudios y Consultoría */}
            <div className="group bg-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Estudios y Consultoría</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Análisis especializado en impacto ambiental, vial y desarrollo urbano
              </p>
            </div>

            {/* Supervisión y Asesoría */}
            <div className="group bg-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Supervisión y Asesoría</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Acompañamiento profesional en todas las fases de tu proyecto
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Scroll Section - Nuestros Proyectos */}
      <section className="relative h-[600vh] bg-white dark:bg-gray-900" data-sticky-section>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Contenido que cambia */}
              <div className="space-y-6">
                {activeSection === 0 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-8">
                      <svg className="w-24 h-24 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                      </svg>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white text-center mb-6">
                      Proyectos Arquitectónicos y Urbanos
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-8">
                      Diseño y desarrollo integral de espacios residenciales y comerciales
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl p-8 text-white max-w-md mx-auto">
                      <h3 className="text-xl font-bold mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Proyectos ejecutivos residenciales</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Proyectos comerciales</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Diseño urbano y ambiental</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Planeación urbana</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 1 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-8">
                      <svg className="w-24 h-24 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white text-center mb-6">
                      Edificaciones
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-8">
                      Construcción y mantenimiento de espacios residenciales y comerciales
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl p-8 text-white max-w-md mx-auto">
                      <h3 className="text-xl font-bold mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Edificaciones residenciales</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Edificaciones comerciales</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Mantenimiento integral</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Remodelaciones</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 2 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-8">
                      <svg className="w-24 h-24 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                      </svg>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white text-center mb-6">
                      Obra Civil e Instalaciones
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-8">
                      Soluciones integrales en infraestructura e instalaciones especializadas
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl p-8 text-white max-w-md mx-auto">
                      <h3 className="text-xl font-bold mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Instalaciones hidráulicas</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Instalaciones eléctricas</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Obras de drenaje</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Infraestructura vial</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 3 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-8">
                      <svg className="w-24 h-24 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                      </svg>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white text-center mb-6">
                      Urbanización
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-8">
                      Desarrollo integral de infraestructura urbana y vialidades
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl p-8 text-white max-w-md mx-auto">
                      <h3 className="text-xl font-bold mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Pavimentación</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Terracerías</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Redes de agua potable</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Electrificación</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 4 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-8">
                      <svg className="w-24 h-24 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white text-center mb-6">
                      Estudios y Consultoría
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-8">
                      Análisis especializado en impacto ambiental, vial y desarrollo urbano
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl p-8 text-white max-w-md mx-auto">
                      <h3 className="text-xl font-bold mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Estudios de impacto ambiental</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Estudios de impacto vial</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Análisis de factibilidad</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Desarrollo urbano sostenible</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 5 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-8">
                      <svg className="w-24 h-24 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white text-center mb-6">
                      Supervisión y Asesoría
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-8">
                      Acompañamiento profesional en todas las fases de tu proyecto
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl p-8 text-white max-w-md mx-auto">
                      <h3 className="text-xl font-bold mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Supervisión de obra</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Control de calidad</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Asesoría técnica</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Gestión de proyectos</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Imagen fija del lado derecho */}
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-br from-[#8B1E2D]/20 to-transparent z-10"></div>
                <Image 
                  src={
                    activeSection === 0 ? "/images/productos/1.jpg" :
                    activeSection === 1 ? "/images/edificaciones.jpg" :
                    activeSection === 2 ? "/images/obra-civil.jpg" :
                    activeSection === 3 ? "/images/urbanizacion.jpg" :
                    activeSection === 4 ? "/images/estudios.jpg" :
                    "/images/supervision.jpg"
                  }
                  alt="Proyecto CONARTE"
                  fill
                  className="object-cover transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={activeSection === 0}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section - Proyectos Destacados */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#9A1D25] font-bold text-sm uppercase tracking-wider">Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-2 mb-4">Proyectos Destacados</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Conoce algunos de los proyectos que hemos realizado con éxito
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gray-300 dark:bg-gray-700 aspect-4/3">
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-2">Proyecto {item}</h3>
                    <p className="text-white/90 text-sm">Construcción residencial en Puebla</p>
                  </div>
                </div>
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-[#9A1D25] hover:bg-[#7A1519] text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              Ver Todos los Proyectos
            </button>
          </div>
        </div>
      </section>

      {/* Process Section - Proceso de Trabajo */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#9A1D25] font-bold text-sm uppercase tracking-wider">Nuestro Proceso</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-2 mb-4">Cómo Trabajamos</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Un proceso claro y transparente para llevar tu proyecto del concepto a la realidad
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-linear-to-b from-[#9A1D25] to-amber-500"></div>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">1. Consulta Inicial</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nos reunimos contigo para entender tus necesidades, objetivos y presupuesto. Realizamos un análisis detallado del sitio y te brindamos asesoría profesional.
                  </p>
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-linear-to-br from-[#9A1D25] to-[#C02530] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2"></div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">2. Diseño y Planificación</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Desarrollamos planos arquitectónicos detallados, renders 3D y toda la documentación técnica necesaria para tu aprobación.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">3. Construcción</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Ejecutamos el proyecto con supervisión constante, utilizando materiales de primera calidad y cumpliendo con los estándares más altos de seguridad.
                  </p>
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-linear-to-br from-stone-500 to-stone-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2"></div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">4. Entrega y Seguimiento</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Realizamos la entrega oficial del proyecto, asegurando tu total satisfacción. Ofrecemos garantía y seguimiento post-construcción.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-linear-to-br from-gray-50 to-red-50 dark:from-gray-800 dark:to-gray-700 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#9A1D25] font-bold text-sm uppercase tracking-wider">Testimonios</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-2 mb-4">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              La satisfacción de nuestros clientes es nuestro mayor logro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                &quot;Excelente trabajo, cumplieron con los tiempos establecidos y la calidad de construcción superó nuestras expectativas. Muy profesionales.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-[#9A1D25] to-[#C02530] rounded-full flex items-center justify-center text-white font-bold">
                  JM
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Juan Martínez</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Propietario de Casa</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                &quot;Construyeron nuestra plaza comercial con gran profesionalismo. El equipo estuvo siempre disponible y atento a nuestras necesidades.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                  ML
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">María López</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Empresaria</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                &ldquo;El fraccionamiento quedó espectacular. Conarte manejó todo el proceso con transparencia y los resultados hablan por sí solos.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-stone-500 to-stone-600 rounded-full flex items-center justify-center text-white font-bold">
                  RG
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Roberto García</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Desarrollador</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#9A1D25] font-bold text-sm uppercase tracking-wider">Confianza y Calidad</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-2 mb-4">Certificaciones y Reconocimientos</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Respaldados por las certificaciones más importantes de la industria
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((cert) => (
              <div key={cert} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 flex items-center justify-center hover:shadow-lg transition-all duration-300 aspect-square">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-[#9A1D25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-300 font-semibold">Certificación {cert}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-linear-to-br from-[#9A1D25] to-[#7A1519] py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            ¿Listo para Comenzar tu Proyecto?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Conversemos sobre tus ideas y hagamos realidad el proyecto de tus sueños. 
            Nuestro equipo de expertos está listo para asesorarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group bg-white hover:bg-gray-100 text-[#9A1D25] font-bold py-5 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl">
              <span className="flex items-center gap-2 justify-center">
                Solicitar Cotización Gratis
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            <button className="group border-2 border-white text-white hover:bg-white/10 font-bold py-5 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <span className="flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Llamar Ahora
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">

        {/* Comprehensive Services Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#9A1D25] to-[#7A1519] rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h4" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Servicios Integrales</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ofrecemos soluciones completas para tu proyecto de construcción y desarrollo urbano.
            </p>
          </div>
          
          <div className="bg-linear-to-br from-gray-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 md:p-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="shrink-0 w-8 h-8 bg-red-700 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Proyectos arquitectónicos y urbanos</h3>
                  <p className="text-gray-600 dark:text-gray-300">Diseño integral desde la conceptualización hasta la ejecución de proyectos arquitectónicos y de planificación urbana.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="shrink-0 w-8 h-8 bg-red-700 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Edificaciones residenciales y comerciales</h3>
                  <p className="text-gray-600 dark:text-gray-300">Construcción de viviendas, edificios residenciales y espacios comerciales con los más altos estándares de calidad.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="shrink-0 w-8 h-8 bg-red-700 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Estudios de impacto ambiental y urbano</h3>
                  <p className="text-gray-600 dark:text-gray-300">Análisis especializado para garantizar el desarrollo sostenible y el cumplimiento de normativas ambientales.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="shrink-0 w-8 h-8 bg-red-700 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Urbanización y pavimentación</h3>
                  <p className="text-gray-600 dark:text-gray-300">Desarrollo de infraestructura urbana incluyendo calles, banquetas, redes de servicios y espacios públicos.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="shrink-0 w-8 h-8 bg-red-700 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Supervisión y consultoría especializada</h3>
                  <p className="text-gray-600 dark:text-gray-300">Acompañamiento técnico profesional durante todas las fases del proyecto con supervisión continua.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-[#9A1D25]/10 dark:bg-[#9A1D25]/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#9A1D25] dark:text-[#9A1D25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Construcción</h3>
            <p className="text-gray-600 dark:text-gray-300">Ejecutamos proyectos de construcción con los más altos estándares de calidad, desde edificaciones residenciales hasta complejos comerciales.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-700 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Desarrollo Urbano</h3>
            <p className="text-gray-600 dark:text-gray-300">Planificamos y desarrollamos espacios urbanos integrales que mejoran la calidad de vida de las comunidades.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-stone-100 dark:bg-stone-700 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-stone-700 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Consultoría</h3>
            <p className="text-gray-600 dark:text-gray-300">Brindamos asesoría especializada en proyectos de ingeniería, arquitectura y desarrollo urbano sostenible.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-linear-to-br from-[#9A1D25]/5 to-amber-50 dark:from-gray-800 dark:to-gray-700 p-12 rounded-2xl shadow-xl border border-[#9A1D25]/20 dark:border-gray-600">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            ¿Listo para Construir tu Próximo Proyecto?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Con más de 10 años de experiencia en Puebla, México, transformamos tus ideas en realidades arquitectónicas excepcionales. 
            <span className="font-semibold text-[#9A1D25] dark:text-[#9A1D25]">Excelencia, Transparencia y Competitividad.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-[#9A1D25] hover:bg-[#7A1519] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              Solicitar Cotización
            </button>
            <button className="border-2 border-[#9A1D25] text-[#9A1D25] hover:bg-[#9A1D25] hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              Ver Proyectos
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
