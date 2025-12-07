'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['concreto', 'familias', 'empresas', 'acero', 'proyectos', 'estructuras'];
  
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);
  
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );
  
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

  // Efecto para animar elementos al hacer scroll
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Si el elemento está en el viewport
        if (rect.top <= windowHeight * 0.85) {
          element.classList.add('animate__animated');
          const animations = element.getAttribute('data-animation') || 'animate__fadeInUp';
          // Dividir las clases de animación si hay múltiples
          animations.split(' ').forEach(cls => {
            if (cls.trim()) {
              element.classList.add(cls.trim());
            }
          });

          // Si es la sección de Process, animar el timeline después
          if (element.id === 'process-section') {
            const timelineLine = document.getElementById('timeline-line');
            if (timelineLine) {
              setTimeout(() => {
                timelineLine.style.animation = 'fadeInTimeline 0.5s ease-out forwards';
                const timelinePath = timelineLine.querySelector('path');
                if (timelinePath) {
                  setTimeout(() => {
                    (timelinePath as HTMLElement).style.animation = 'lineDropDown 2s ease-out forwards, snakeWave 6s ease-in-out 2s infinite';
                  }, 500);
                }
              }, 1000); // Delay de 1s después de que termine la animación de la sección
            }
          }
        }
      });
    };

    // Ejecutar al cargar y al hacer scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

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
      <section id="inicio" className="h-screen relative overflow-hidden flex items-center justify-center animate-on-scroll" data-animation="animate__fadeIn">
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
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-20 max-w-6xl">
          
          {/* Simple Badge */}
          <div className="mb-8 sm:mb-12 lg:mb-8">
            <span className="px-3 2xl:px-4 lg:px-2 xl:px-4 py-2 lg:py-0.5 xl:py-1.5 border border-white/40 rounded-full text-white/90 text-xs lg:text-[10px] xl:text-xs 2xl:text-base  font-medium tracking-wide backdrop-blur-sm">
              CONARTE • Puebla, México
            </span>
          </div>
          
          {/* Beautiful Title with Rotating Text */}
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-6xl text-white mb-8 sm:mb-10 lg:mb-6 leading-[1.1] tracking-tight">
            <span className="block text-3xl sm:text-4xl md:text-6xl lg:text-5xl xl:text-5xl 2xl:text-7xl font-extrabold mb-2 lg:mb-1">Construimos sueños de</span>
            <span className="block font-black text-3xl sm:text-4xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-8xl drop-shadow-lg">
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
          <div className="mb-8 mt-16 lg:mt-0 sm:mb-12 lg:mb-8 max-w-3xl lg:max-w-xl 2xl:max-w-2xl mx-auto px-4">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-base xl:text-xl 2xl:text-3xl text-white mb-4 lg:mb-3 font-light leading-relaxed" style={{
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
            <p className="text-base 2xl:text-2xl sm:text-lg md:text-xl lg:text-sm text-white/90 font-light leading-relaxed" style={{
              textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,1)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)'
            }}>
              Más de una década transformando Puebla con arquitectura que trasciende el tiempo
            </p>
          </div>
          
          {/* Clean CTA */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-2 justify-center px-4">
            <button className="w-full sm:w-auto group relative bg-linear-to-r from-[#9A1D25] to-[#C02530] hover:from-[#7A1519] hover:to-[#9A1D25] text-white font-bold py-4 sm:py-5 lg:py-2 xl:py-3 px-8 sm:px-10 lg:px-5 xl:px-7 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg overflow-hidden">
              <span className="relative z-10 flex items-center gap-2 lg:gap-1 lg:text-xs 2xl:text-lg">
                Ver proyectos
                <svg className="w-5 h-5 lg:w-3 lg:h-3 2xl:w-6 2xl:h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            <button className="w-full sm:w-auto group relative border-2 border-white/80 hover:border-white bg-white/10 hover:bg-white/20 text-white font-bold py-4 sm:py-5 lg:py-2 xl:py-3 px-8 sm:px-10 lg:px-5 xl:px-7 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-md shadow-lg hover:shadow-2xl">
              <span className="flex items-center gap-2 lg:gap-1 lg:text-xs 2xl:text-lg">
                Contactar
                <svg className="w-5 h-5 lg:w-3 lg:h-3 2xl:w-6 2xl:h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            </button>
          </div>
          
        </div>
      </section>

      {/* Stats Section - ¿Por qué elegirnos? */}  
      <section id="nosotros" className="bg-white dark:bg-gray-900 py-12 sm:py-16 md:py-20 lg:py-6 max-w-7xl mx-auto stats-section scroll-mt-16 animate-on-scroll xl:mt-20" data-animation="animate__slideInUp">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-12 lg:mb-4 animate__animated animate__fadeIn">
            <span className="text-[#9A1D25] font-bold text-[10px] md:text-xs 2xl:text-sm lg:text-[8px] xl:text-xs uppercase tracking-wider px-4 lg:px-1.5 xl:px-3 py-2 lg:py-0.5 xl:py-1.5 rounded-full border-2 border-[#9A1D25]/70">¿Por qué elegirnos?</span>
            <h2 className="text-3xl sm:text-4xl md:text-3xl lg:text-xl xl:text-3xl 2xl:text-5xl font-black text-gray-900 dark:text-white mt-4 md:mt-3 lg:mt-1.5 mb-4 md:mb-3 lg:mb-1.5 2xl:mt-5">Nuestra Experiencia</h2>
            <p className="text-base sm:text-lg md:text-base lg:text-xs 2xl:text-xl text-gray-600 dark:text-gray-300 max-w-3xl md:max-w-5xl lg:max-w-lg 2xl:max-w-4xl 2xl:mt-5 2xl:pb-5 mx-auto px-4">
              Con más de dos décadas de experiencia, ofrecemos soluciones innovadoras en construcción y desarrollo urbano, 
              respaldadas por un equipo multidisciplinario de profesionales comprometidos con la excelencia y la satisfacción de nuestros clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-6 lg:gap-2 md:mx-4 xl:mx-32 lg:mx-40">
            {/* Experiencia Comprobada */}
            <div className="bg-linear-to-br from-gray-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl sm:rounded-3xl md:rounded-2xl lg:rounded-md p-6 sm:p-8 md:p-5 lg:p-2 xl:p-4 2xl:p-8 border border-gray-200 dark:border-gray-700 animate__animated animate__fadeInLeft md:order-1 lg:row-span-2">
              <div className="flex justify-center mb-4 sm:mb-6 md:mb-4 lg:mb-1 xl:mb-2 2xl:mb-6">
                <svg className="w-16 h-16 md:w-12 md:h-12 lg:w-6 lg:h-6 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-lg lg:text-xs xl:text-base 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-3 lg:mb-0.5 xl:mb-2 2xl:mb-4 text-center">Experiencia Comprobada</h3>
              <p className="text-sm sm:text-base md:text-sm lg:text-[10px] xl:text-xs 2xl:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-4 lg:mb-1.5 xl:mb-3 2xl:mb-6 text-center">
                Más de 24 años de experiencia en el sector de la construcción y desarrollo urbano desde el año 2000.
              </p>
              <div className="grid grid-cols-2 gap-4 md:gap-3 lg:gap-1 xl:gap-2 2xl:gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-lg lg:rounded p-4 md:p-3 lg:p-1 xl:p-2 2xl:p-4 text-center">
                  <div className="text-3xl md:text-2xl lg:text-sm xl:text-xl 2xl:text-3xl font-black text-[#8B1E2D] mb-1 lg:mb-0">{counters.years}+</div>
                  <div className="text-sm md:text-xs lg:text-[8px] xl:text-[10px] 2xl:text-sm text-gray-600 dark:text-gray-400">Años de experiencia</div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-lg lg:rounded p-4 md:p-3 lg:p-1 xl:p-2 2xl:p-4 text-center">
                  <div className="text-3xl md:text-2xl lg:text-sm xl:text-xl 2xl:text-3xl font-black text-[#8B1E2D] mb-1 lg:mb-0">{counters.projects}+</div>
                  <div className="text-sm md:text-xs lg:text-[8px] xl:text-[10px] 2xl:text-sm text-gray-600 dark:text-gray-400">Proyectos realizados</div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-lg lg:rounded p-4 md:p-3 lg:p-1 xl:p-2 2xl:p-4 text-center">
                  <div className="text-3xl md:text-2xl lg:text-sm xl:text-xl 2xl:text-3xl font-black text-[#8B1E2D] mb-1 lg:mb-0">{counters.specialties}+</div>
                  <div className="text-sm md:text-xs lg:text-[8px] xl:text-[10px] 2xl:text-sm text-gray-600 dark:text-gray-400">Especialidades</div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-lg lg:rounded p-4 md:p-3 lg:p-1 xl:p-2 2xl:p-4 text-center">
                  <div className="text-3xl md:text-2xl lg:text-sm xl:text-xl 2xl:text-3xl font-black text-[#8B1E2D] mb-1 lg:mb-0">{counters.satisfaction}%</div>
                  <div className="text-sm md:text-xs lg:text-[8px] xl:text-[10px] 2xl:text-sm text-gray-600 dark:text-gray-400">Satisfacción</div>
                </div>
              </div>
            </div>

            {/* Equipo Profesional */}
            <div className="bg-linear-to-br from-gray-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl sm:rounded-3xl md:rounded-2xl lg:rounded-md p-6 sm:p-8 md:p-5 lg:p-2 xl:p-4 2xl:p-8 border border-gray-200 dark:border-gray-700 animate__animated animate__fadeInUp md:order-3 lg:order-2">
              <div className="flex justify-center mb-4 sm:mb-6 md:mb-4 lg:mb-1 xl:mb-2 2xl:mb-6">
                <svg className="w-16 h-16 md:w-12 md:h-12 lg:w-6 lg:h-6 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-lg lg:text-xs xl:text-base 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-3 lg:mb-0.5 xl:mb-2 2xl:mb-4 text-center">Equipo Profesional</h3>
              <p className="text-sm sm:text-base md:text-sm lg:text-[10px] xl:text-xs 2xl:text-base text-gray-600 dark:text-gray-300 text-center">
                Personal multidisciplinario especializado en arquitectura, ingeniería civil, diseño urbano y ecología.
              </p>
            </div>

            {/* Certificaciones */}
            <div className="bg-linear-to-br from-gray-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl sm:rounded-3xl md:rounded-2xl lg:rounded-md p-6 sm:p-8 md:p-5 lg:p-2 xl:p-4 2xl:p-8 border border-gray-200 dark:border-gray-700 animate__animated animate__fadeInUp md:order-4 lg:order-3 lg:col-start-2 lg:row-start-2">
              <div className="flex justify-center mb-4 sm:mb-6 md:mb-4 lg:mb-1 xl:mb-2 2xl:mb-6">
                <svg className="w-16 h-16 md:w-12 md:h-12 lg:w-6 lg:h-6 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-lg lg:text-xs xl:text-base 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-3 lg:mb-0.5 xl:mb-2 2xl:mb-4 text-center">Certificaciones</h3>
              <p className="text-sm sm:text-base md:text-sm lg:text-[10px] xl:text-xs 2xl:text-base text-gray-600 dark:text-gray-300 text-center">
                Registro en el Padrón de Contratistas del Municipio de Puebla con múltiples especialidades autorizadas.
              </p>
            </div>

            {/* Servicios Integrales */}
            <div className="bg-linear-to-br from-gray-50 to-stone-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl sm:rounded-3xl md:rounded-2xl lg:rounded-md p-6 sm:p-8 md:p-5 lg:p-2 xl:p-4 2xl:p-8 border border-gray-200 dark:border-gray-700 animate__animated animate__fadeInRight md:order-2 lg:order-4 lg:row-span-2">
              <div className="flex justify-center mb-4 sm:mb-6 lg:mb-1 xl:mb-2 2xl:mb-6">
                <svg className="w-16 h-16 lg:w-6 lg:h-6 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-xs xl:text-base 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-0.5 xl:mb-2 2xl:mb-4 text-center">Servicios Integrales</h3>
              <p className="text-sm sm:text-base lg:text-[10px] xl:text-xs 2xl:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 lg:mb-1.5 xl:mb-3 2xl:mb-6 text-center">
                Ofrecemos soluciones completas para tu proyecto de construcción y desarrollo urbano.
              </p>
              <ul className="space-y-3 lg:space-y-1 xl:space-y-1.5 2xl:space-y-3 lg:mx-5 xl:mx-0">
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 lg:w-2.5 lg:h-2.5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-[#8B1E2D] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm lg:text-[10px] xl:text-xs 2xl:text-sm">Proyectos arquitectónicos y urbanos</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 lg:w-2.5 lg:h-2.5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-[#8B1E2D] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm lg:text-[10px] xl:text-xs 2xl:text-sm">Edificaciones residenciales y comerciales</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 lg:w-2.5 lg:h-2.5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-[#8B1E2D] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm lg:text-[10px] xl:text-xs 2xl:text-sm">Estudios de impacto ambiental y urbano</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 lg:w-2.5 lg:h-2.5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-[#8B1E2D] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm lg:text-[10px] xl:text-xs 2xl:text-sm">Urbanización y pavimentación</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 lg:w-2.5 lg:h-2.5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-[#8B1E2D] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm lg:text-[10px] xl:text-xs 2xl:text-sm">Supervisión y consultoría especializada</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Scroll Section - Nuestros Servicios */}
      <section id="servicios" className="relative lg:h-[300vh] bg-white dark:bg-gray-900 scroll-mt-20 lg:scroll-mt-12 xl:mx-32 animate-on-scroll" data-sticky-section data-animation="animate__fadeInRight">
        <div className="lg:sticky top-0 lg:h-screen flex items-center overflow-hidden pt-16 sm:pt-16 lg:pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-3">
            {/* Título y subtítulo sticky */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-6 xl:mb-6">
              <span className="text-[#9A1D25] font-bold text-[10px] 2xl:text-sm lg:text-[8px] lg:px-3 lg:py-1.5 xl:text-xs uppercase tracking-wider px-4 xl:px-3 py-2 xl:py-1.5 rounded-full border-2 border-[#9A1D25]/70">Nuestros Servicios</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-xl xl:text-2xl 2xl:text-5xl font-black text-gray-900 dark:text-white mt-4 lg:mt-3 xl:mt-3 mb-4 lg:mb-3 xl:mb-2">
                Lo que Hacemos
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-xs xl:text-sm 2xl:text-xl text-gray-600 dark:text-gray-300 max-w-3xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl mx-auto px-4 lg:px-3">
                Transformamos tu visión en realidad con soluciones integrales de construcción y desarrollo urbano. Más de 24 años de experiencia nos respaldan para entregar proyectos de excelencia que superan expectativas.
              </p>
            </div>

            {/* Vista móvil y tablet - Tarjetas */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
              {/* Tarjeta 1: Proyectos Arquitectónicos */}
              <div className="bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border-2 border-[#9A1D25]/20">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src="/images/productos/1.jpg"
                    alt="Proyectos Arquitectónicos"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-full flex items-center justify-center shadow-lg -mt-10 relative z-10">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    Proyectos Arquitectónicos y Urbanos
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                    Diseño y desarrollo integral de espacios residenciales y comerciales
                  </p>
                  <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-xl p-4 text-white">
                    <h4 className="text-sm font-bold mb-3 text-center">Incluye:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Proyectos ejecutivos residenciales</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Proyectos comerciales</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Diseño urbano y ambiental</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Planeación urbana</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Edificaciones */}
              <div className="bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border-2 border-amber-500/20">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src="/images/productos/2.jpg"
                    alt="Edificaciones"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-linear-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg -mt-10 relative z-10">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    Edificaciones
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                    Construcción y mantenimiento de espacios residenciales y comerciales
                  </p>
                  <div className="bg-linear-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
                    <h4 className="text-sm font-bold mb-3 text-center">Incluye:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Edificaciones residenciales</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Edificaciones comerciales</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Mantenimiento integral</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Remodelaciones</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tarjeta 3: Obra Civil */}
              <div className="bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border-2 border-stone-500/20">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src="/images/productos/3.avif"
                    alt="Obra Civil"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-linear-to-br from-stone-500 to-stone-600 rounded-full flex items-center justify-center shadow-lg -mt-10 relative z-10">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    Obra Civil e Instalaciones
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                    Soluciones integrales en infraestructura e instalaciones especializadas
                  </p>
                  <div className="bg-linear-to-br from-stone-500 to-stone-600 rounded-xl p-4 text-white">
                    <h4 className="text-sm font-bold mb-3 text-center">Incluye:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Obra civil hidráulica y sanitaria</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Instalaciones eléctricas media tensión</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Estructuras metálicas</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Instalaciones telefónicas y datos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tarjeta 4: Urbanización */}
              <div className="bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border-2 border-blue-500/20">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src="/images/productos/4.avif"
                    alt="Urbanización"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg -mt-10 relative z-10">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    Urbanización
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                    Desarrollo integral de infraestructura urbana y vialidades
                  </p>
                  <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                    <h4 className="text-sm font-bold mb-3 text-center">Incluye:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Terracerías y pavimentación</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Banquetas y guarniciones</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Alumbrado público</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Caminos rurales</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tarjeta 5: Estudios y Consultoría */}
              <div className="bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border-2 border-purple-500/20">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src="/images/productos/5.jpg"
                    alt="Estudios y Consultoría"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg -mt-10 relative z-10">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    Estudios y Consultoría
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                    Análisis especializado en impacto ambiental, vial y desarrollo urbano
                  </p>
                  <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                    <h4 className="text-sm font-bold mb-3 text-center">Incluye:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Estudios de impacto ambiental</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Estudios de impacto vial</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Estudios de desarrollo urbano</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Impacto urbano territorial</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tarjeta 6: Supervisión y Asesoría */}
              <div className="bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border-2 border-green-500/20">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src="/images/productos/6.jpg"
                    alt="Supervisión y Asesoría"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg -mt-10 relative z-10">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    Supervisión y Asesoría
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                    Acompañamiento profesional en todas las fases de tu proyecto
                  </p>
                  <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <h4 className="text-sm font-bold mb-3 text-center">Incluye:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Supervisión de obra civil</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Asesoría en planeación urbana</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Conservación del patrimonio edificado</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Topografía</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Vista desktop - Grid sticky (solo lg+) */}
            <div className="hidden lg:grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-6 xl:gap-6 2xl:gap-12 items-center">
              {/* Contenido que cambia */}
              <div className="space-y-6 lg:space-y-4 xl:space-y-4 2xl:space-y-6">
                {activeSection === 0 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-4 sm:mb-6 lg:mb-1 xl:mb-3 2xl:mb-6">
                      <svg className="w-12 h-12 sm:w-16 sm:h-16 lg:w-6 lg:h-6 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-base xl:text-xl 2xl:text-4xl font-black text-gray-900 dark:text-white text-center mb-3 sm:mb-4 lg:mb-2 xl:mb-2 2xl:mb-4 lg:mx-28">
                      Proyectos Arquitectónicos y Urbanos
                    </h2>
                    <p className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-4 sm:mb-6 lg:mb-3 xl:mb-3 2xl:mb-6 px-4 lg:px-2">
                      Diseño y desarrollo integral de espacios residenciales y comerciales
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl lg:rounded-xl p-8 lg:p-5 xl:p-5 2xl:p-8 text-white max-w-md lg:max-w-md mx-auto">
                      <h3 className="text-xl lg:text-xs xl:text-base 2xl:text-xl font-bold mb-6 lg:mb-2 xl:mb-3 2xl:mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3 lg:space-y-2.5 xl:space-y-2 2xl:space-y-3">
                        <li className="flex items-center gap-2 sm:gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Proyectos ejecutivos residenciales</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Proyectos comerciales</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Diseño urbano y ambiental</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Planeación urbana</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 1 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-6 lg:mb-0.5 xl:mb-3 2xl:mb-6">
                      <svg className="w-16 h-16 lg:w-4 lg:h-4 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-base xl:text-xl 2xl:text-4xl font-black text-gray-900 dark:text-white text-center mb-4 lg:mb-2 xl:mb-2 2xl:mb-4 lg:mx-28">
                      Edificaciones
                    </h2>
                    <p className="text-base lg:text-xs xl:text-xs 2xl:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6 lg:mb-3 xl:mb-3 2xl:mb-6 px-4 lg:px-2">
                      Construcción y mantenimiento de espacios residenciales y comerciales
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl lg:rounded-xl p-8 lg:p-5 xl:p-5 2xl:p-8 text-white max-w-md lg:max-w-md mx-auto">
                      <h3 className="text-xl lg:text-xs xl:text-base 2xl:text-xl font-bold mb-6 lg:mb-2 xl:mb-3 2xl:mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3 lg:space-y-2.5 xl:space-y-2 2xl:space-y-3">
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Edificaciones residenciales</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Edificaciones comerciales</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Mantenimiento integral</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Remodelaciones</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 2 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-6 lg:mb-0.5 xl:mb-3 2xl:mb-6">
                      <svg className="w-16 h-16 lg:w-4 lg:h-4 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-base xl:text-xl 2xl:text-4xl font-black text-gray-900 dark:text-white text-center mb-4 lg:mb-2 xl:mb-2 2xl:mb-4 lg:mx-40">
                      Obra Civil e Instalaciones
                    </h2>
                    <p className="text-base lg:text-xs xl:text-xs 2xl:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6 lg:mb-3 xl:mb-3 2xl:mb-6 px-4 lg:px-2">
                      Soluciones integrales en infraestructura e instalaciones especializadas
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl lg:rounded-xl p-8 lg:p-5 xl:p-5 2xl:p-8 text-white max-w-md lg:max-w-md mx-auto">
                      <h3 className="text-xl lg:text-xs xl:text-base 2xl:text-xl font-bold mb-6 lg:mb-2 xl:mb-3 2xl:mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3 lg:space-y-0.5 xl:space-y-2 2xl:space-y-3">
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Obra civil hidráulica y sanitaria</span>
                        </li>
                        <li className="flex items-center gap-3 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Instalaciones eléctricas media tensión</span>
                        </li>
                        <li className="flex items-center gap-3 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Estructuras metálicas</span>
                        </li>
                        <li className="flex items-center gap-3 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Instalaciones telefónicas y datos</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 3 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-6 lg:mb-1 xl:mb-3 2xl:mb-6">
                      <svg className="w-16 h-16 lg:w-6 lg:h-6 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-base xl:text-xl 2xl:text-4xl font-black text-gray-900 dark:text-white text-center mb-4 lg:mb-2 xl:mb-2 2xl:mb-4 lg:mx-28">
                      Urbanización
                    </h2>
                    <p className="text-base lg:text-xs xl:text-xs 2xl:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6 lg:mb-3 xl:mb-3 2xl:mb-6 px-4 lg:px-2">
                      Desarrollo integral de infraestructura urbana y vialidades
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl lg:rounded-xl p-8 lg:p-5 xl:p-5 2xl:p-8 text-white max-w-md lg:max-w-md mx-auto">
                      <h3 className="text-xl lg:text-xs xl:text-base 2xl:text-xl font-bold mb-6 lg:mb-2 xl:mb-3 2xl:mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3 lg:space-y-2.5 xl:space-y-2 2xl:space-y-3">
                        <li className="flex items-center gap-3 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Terracerías y pavimentación</span>
                        </li>
                        <li className="flex items-center gap-3 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Banquetas y guarniciones</span>
                        </li>
                        <li className="flex items-center gap-3 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Alumbrado público</span>
                        </li>
                        <li className="flex items-center gap-3 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Caminos rurales</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 4 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-6 lg:mb-0.5 xl:mb-3 2xl:mb-6">
                      <svg className="w-16 h-16 lg:w-6 lg:h-6 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-base lg:mx-28 xl:text-xl 2xl:text-4xl font-black text-gray-900 dark:text-white text-center mb-4 lg:mb-0.5 xl:mb-2 2xl:mb-4">
                      Estudios y Consultoría
                    </h2>
                    <p className="text-base lg:text-xs lg:px-2 xl:text-xs 2xl:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6 lg:mb-1 xl:mb-3 2xl:mb-6">
                      Análisis especializado en impacto ambiental, vial y desarrollo urbano
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl lg:rounded-xl lg:p-5 p-8 xl:p-5 2xl:p-8 text-white max-w-md lg:max-w-md mx-auto">
                      <h3 className="text-xl lg:text-xs lg:mb-2 xl:text-base 2xl:text-xl font-bold mb-6 xl:mb-3 2xl:mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3 lg:space-y-2.5 xl:space-y-2 2xl:space-y-3">
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Estudios de impacto ambiental</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Estudios de impacto vial</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Estudios de desarrollo urbano</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Impacto urbano territorial</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 5 && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="flex justify-center mb-6 lg:mb-0.5 xl:mb-3 2xl:mb-6">
                      <svg className="w-16 h-16 lg:w-6 lg:h-6 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-[#8B1E2D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-base lg:mx-28 xl:text-xl 2xl:text-4xl font-black text-gray-900 dark:text-white text-center mb-4 lg:mb-0.5 xl:mb-2 2xl:mb-4">
                      Supervisión y Asesoría
                    </h2>
                    <p className="text-base lg:text-xs lg:px-2 xl:text-xs 2xl:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6 lg:mb-1 xl:mb-3 2xl:mb-6">
                      Acompañamiento profesional en todas las fases de tu proyecto
                    </p>
                    
                    {/* Tarjeta de "Incluye" */}
                    <div className="bg-linear-to-br from-[#C1272D] to-[#8B1E2D] rounded-2xl lg:rounded-xl lg:p-5 p-8 xl:p-5 2xl:p-8 text-white max-w-md lg:max-w-md mx-auto">
                      <h3 className="text-xl lg:text-xs lg:mb-2 xl:text-base 2xl:text-xl font-bold mb-6 xl:mb-3 2xl:mb-6 text-center">Incluye:</h3>
                      <ul className="space-y-3 lg:space-y-2.5 xl:space-y-2 2xl:space-y-3">
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Supervisión de obra civil</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Asesoría en planeación urbana</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Conservación del patrimonio edificado</span>
                        </li>
                        <li className="flex items-center gap-3 lg:gap-2 xl:gap-2 2xl:gap-3">
                          <svg className="w-5 h-5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base lg:text-xs xl:text-xs 2xl:text-base">Topografía</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Imagen fija del lado derecho */}
              <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[200px] xl:h-[300px] 2xl:h-[380px] rounded-3xl lg:rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-br from-[#8B1E2D]/20 to-transparent z-10"></div>
                <Image 
                  src={
                    activeSection === 0 ? "/images/productos/1.jpg" :
                    activeSection === 1 ? "/images/productos/2.jpg" :
                    activeSection === 2 ? "/images/productos/3.avif" :
                    activeSection === 3 ? "/images/productos/4.avif" :
                    activeSection === 4 ? "/images/productos/5.jpg" :
                    "/images/productos/6.jpg"
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
      <section id="proyectos" className="bg-gray-100 dark:bg-gray-800 py-20 scroll-mt-16 animate-on-scroll" data-animation="animate__fadeInUp">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#9A1D25] font-bold text-[10px] 2xl:text-sm lg:text-[8px] xl:text-xs uppercase tracking-wider px-4 lg:px-3 xl:px-3 py-2 lg:py-1.5 xl:py-1.5 rounded-full border-2 border-[#9A1D25]/70">Portfolio</span>
            <h2 className="text-3xl md:text-5xl lg:text-2xl xl:text-2xl 2xl:text-5xl font-black text-gray-900 dark:text-white mt-4 lg:mt-3 xl:mt-3 mb-4 lg:mb-3 xl:mb-3">Proyectos Destacados</h2>
            <p className="text-xl lg:text-sm xl:text-sm 2xl:text-xl text-gray-600 dark:text-gray-300 max-w-3xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl mx-auto">
              Conoce algunos de los proyectos que hemos realizado con éxito
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 lg:mx-16 xl:mx-32">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group relative overflow-hidden rounded-2xl lg:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gray-300 dark:bg-gray-700 aspect-4/3 animate-on-scroll" data-animation="animate__zoomIn">
                <Image
                  src={`/images/proyectos/${item === 1 ? '1.webp' : `${item}.jpg`}`}
                  alt={`Proyecto ${item}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 lg:p-4 xl:p-4 2xl:p-6 z-10">
                  <div>
                    <h3 className="text-white font-bold text-xl lg:text-base xl:text-base 2xl:text-xl mb-2 lg:mb-1 xl:mb-1 2xl:mb-2">Proyecto {item}</h3>
                    <p className="text-white/90 text-sm lg:text-xs xl:text-xs 2xl:text-sm">Construcción residencial en Puebla</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Proceso de Trabajo */}
      <section id="process-section" className="bg-white dark:bg-gray-900 py-20 animate-on-scroll" data-animation="animate__fadeInLeft">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#9A1D25] font-bold text-[10px] 2xl:text-sm lg:text-xs xl:text-xs uppercase tracking-wider px-4 lg:px-3 xl:px-3 py-2 lg:py-1.5 xl:py-1.5 rounded-full border-2 border-[#9A1D25]/70">Nuestro Proceso</span>
            <h2 className="text-3xl md:text-5xl lg:text-2xl xl:text-2xl 2xl:text-5xl font-black text-gray-900 dark:text-white mt-4 lg:mt-3 xl:mt-3 mb-4 lg:mb-3 xl:mb-3">Cómo Trabajamos</h2>
            <p className="text-xl lg:text-sm xl:text-sm 2xl:text-xl text-gray-600 dark:text-gray-300 max-w-3xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl mx-auto">
              Un proceso claro y transparente para llevar tu proyecto del concepto a la realidad
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div 
              id="timeline-line"
              className="hidden md:block absolute left-1/2 h-full opacity-0" 
              style={{ 
                width: '100px', 
                marginLeft: '-50px'
              }}
            >
              <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#9A1D25" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <path 
                  d="M50,0 Q10,100 50,200 T50,400 T50,600 T50,800 T50,1000"
                  stroke="url(#lineGradient)" 
                  strokeWidth="4" 
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    clipPath: 'inset(0 0 100% 0)'
                  }}
                />
              </svg>
            </div>

            <div className="space-y-12 lg:space-y-10">
              {/* Step 1 */}
              <div 
                className="flex flex-col md:flex-row items-center gap-8 lg:gap-6 opacity-0"
                style={{
                  animation: 'slideInFromLeft 0.8s ease-out forwards',
                  animationDelay: '0.2s'
                }}
              >
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <h3 className="text-2xl lg:text-lg xl:text-lg 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-2 xl:mb-2 2xl:mb-3">1. Consulta Inicial</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base lg:text-sm xl:text-sm 2xl:text-base lg:ml-40 xl:ml-60">
                    Nos reunimos contigo para entender tus necesidades, objetivos y presupuesto. Realizamos un análisis detallado del sitio y te brindamos asesoría profesional.
                  </p>
                </div>
                <div className="relative z-10 hidden md:flex">
                  <div className="w-16 h-16 lg:w-14 lg:h-14 bg-linear-to-br from-[#9A1D25] to-[#C02530] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2 hidden md:block"></div>
              </div>

              {/* Step 2 */}
              <div 
                className="flex flex-col md:flex-row items-center gap-8 opacity-0"
                style={{
                  animation: 'slideInFromRight 0.8s ease-out forwards',
                  animationDelay: '0.4s'
                }}
              >
                <div className="md:w-1/2 hidden md:block"></div>
                <div className="relative z-10 hidden md:flex">
                  <div className="w-16 h-16 lg:w-14 lg:h-14 bg-linear-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-2xl lg:text-lg xl:text-lg 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-2 xl:mb-2 2xl:mb-3">2. Diseño y Planificación</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base lg:text-sm xl:text-sm 2xl:text-base lg:mr-40 xl:mr-60">
                    Desarrollamos planos arquitectónicos detallados, renders 3D y toda la documentación técnica necesaria para tu aprobación.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div 
                className="flex flex-col md:flex-row items-center gap-8 lg:gap-6 opacity-0"
                style={{
                  animation: 'slideInFromLeft 0.8s ease-out forwards',
                  animationDelay: '0.6s'
                }}
              >
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <h3 className="text-2xl lg:text-lg xl:text-lg 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-2 xl:mb-2 2xl:mb-3">3. Construcción</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base lg:text-sm xl:text-sm 2xl:text-base lg:ml-40 xl:ml-60">
                    Ejecutamos el proyecto con supervisión constante, utilizando materiales de primera calidad y cumpliendo con los estándares más altos de seguridad.
                  </p>
                </div>
                <div className="relative z-10 hidden md:flex">
                  <div className="w-16 h-16 lg:w-14 lg:h-14 bg-linear-to-br from-stone-500 to-stone-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2 hidden md:block"></div>
              </div>

              {/* Step 4 */}
              <div 
                className="flex flex-col md:flex-row items-center gap-8 lg:gap-6 opacity-0"
                style={{
                  animation: 'slideInFromRight 0.8s ease-out forwards',
                  animationDelay: '0.8s'
                }}
              >
                <div className="md:w-1/2 hidden md:block"></div>
                <div className="relative z-10 hidden md:flex">
                  <div className="w-16 h-16 lg:w-14 lg:h-14 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-2xl lg:text-lg xl:text-lg 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-2 xl:mb-2 2xl:mb-3">4. Entrega y Seguimiento</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base lg:text-sm xl:text-sm 2xl:text-base lg:mr-40 xl:mr-60">
                    Realizamos la entrega oficial del proyecto, asegurando tu total satisfacción. Ofrecemos garantía y seguimiento post-construcción.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="bg-linear-to-br from-gray-50 to-red-50 dark:from-gray-800 dark:to-gray-700 py-20 relative overflow-hidden scroll-mt-20 animate-on-scroll" data-animation="animate__fadeInUp">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#9A1D25] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#9A1D25] font-bold text-[10px] 2xl:text-smlg:text-xs xl:text-xs uppercase tracking-wider px-4 lg:px-3 xl:px-3 py-2 lg:py-1.5 xl:py-1.5 rounded-full border-2 border-[#9A1D25]/70">Testimonios</span>
            <h2 className="text-3xl md:text-5xl lg:text-2xl xl:text-2xl 2xl:text-5xl font-black text-gray-900 dark:text-white mt-4 lg:mt-3 xl:mt-3 mb-4 lg:mb-3 xl:mb-3">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-xl lg:text-sm xl:text-sm 2xl:text-xl text-gray-600 dark:text-gray-300 max-w-3xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl mx-auto">
              La satisfacción de nuestros clientes es nuestro mayor logro
            </p>
          </div>

          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/3">
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 xl:p-4 2xl:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border-2 border-transparent hover:border-[#9A1D25] overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-[#9A1D25]/10 to-transparent rounded-bl-full"></div>
                  
                  {/* Quote icon */}
                  <div className="absolute top-6 right-6 xl:top-3 xl:right-3 2xl:top-6 2xl:right-6 text-[#9A1D25]/10 group-hover:text-[#9A1D25]/20 transition-colors">
                    <svg className="w-12 h-12 xl:w-7 xl:h-7 2xl:w-12 2xl:h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>

                  <div className="flex items-center mb-6 gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8 xl:mb-4 2xl:mb-8 leading-relaxed text-base xl:text-[11px] xl:leading-tight 2xl:text-base relative z-10">
                    &quot;Excelente trabajo, cumplieron con los tiempos establecidos y la calidad de construcción superó nuestras expectativas. Muy profesionales.&quot;
                  </p>
                  
                  <div className="flex items-center gap-4 xl:gap-2 2xl:gap-4 mt-auto">
                    <div className="relative w-14 h-14 xl:w-9 xl:h-9 2xl:w-14 2xl:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-[#9A1D25]">
                      <Image
                        src="/images/testimonios/h.png"
                        alt="Juan Martínez"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg xl:text-sm 2xl:text-lg font-bold text-gray-900 dark:text-white">Juan Martínez</h4>
                      <p className="text-sm xl:text-[10px] 2xl:text-sm text-gray-500 dark:text-gray-400">Propietario de Casa</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Testimonial 2 */}
              <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/3 ">
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 xl:p-4 2xl:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border-2 border-transparent hover:border-amber-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-amber-500/10 to-transparent rounded-bl-full"></div>
                  
                  <div className="absolute top-6 right-6 xl:top-3 xl:right-3 2xl:top-6 2xl:right-6 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
                    <svg className="w-12 h-12 xl:w-7 xl:h-7 2xl:w-12 2xl:h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>

                  <div className="flex items-center mb-6 xl:mb-3 2xl:mb-6 gap-1 xl:gap-0.5 2xl:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8 xl:mb-4 2xl:mb-8 leading-relaxed text-base xl:text-[11px] xl:leading-tight 2xl:text-base relative z-10">
                    &quot;Construyeron nuestra plaza comercial con gran profesionalismo. El equipo estuvo siempre disponible y atento a nuestras necesidades.&quot;
                  </p>
                  
                  <div className="flex items-center gap-4 xl:gap-2 2xl:gap-4 mt-auto">
                    <div className="relative w-14 h-14 xl:w-9 xl:h-9 2xl:w-14 2xl:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-amber-500">
                      <Image
                        src="/images/testimonios/m.webp"
                        alt="María López"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg xl:text-sm 2xl:text-lg font-bold text-gray-900 dark:text-white">María López</h4>
                      <p className="text-sm xl:text-[10px] 2xl:text-sm text-gray-500 dark:text-gray-400">Empresaria</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Testimonial 3 */}
              <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/3">
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 xl:p-4 2xl:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border-2 border-transparent hover:border-stone-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-stone-500/10 to-transparent rounded-bl-full"></div>
                  
                  <div className="absolute top-6 right-6 xl:top-3 xl:right-3 2xl:top-6 2xl:right-6 text-stone-500/10 group-hover:text-stone-500/20 transition-colors">
                    <svg className="w-12 h-12 xl:w-7 xl:h-7 2xl:w-12 2xl:h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>

                  <div className="flex items-center mb-6 xl:mb-3 2xl:mb-6 gap-1 xl:gap-0.5 2xl:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8 xl:mb-4 2xl:mb-8 leading-relaxed text-base xl:text-[11px] xl:leading-tight 2xl:text-base relative z-10">
                    &quot;El fraccionamiento quedó espectacular. Conarte manejó todo el proceso con transparencia y los resultados hablan por sí solos.&quot;
                  </p>
                  
                  <div className="flex items-center gap-4 xl:gap-2 2xl:gap-4 mt-auto">
                    <div className="relative w-14 h-14 xl:w-9 xl:h-9 2xl:w-14 2xl:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-stone-500">
                      <Image
                        src="/images/testimonios/h.png"
                        alt="Roberto García"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg xl:text-sm 2xl:text-lg font-bold text-gray-900 dark:text-white">Roberto García</h4>
                      <p className="text-sm xl:text-[10px] 2xl:text-sm text-gray-500 dark:text-gray-400">Desarrollador</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Testimonial 4 */}
              <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/3">
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 xl:p-4 2xl:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border-2 border-transparent hover:border-blue-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
                  
                  <div className="absolute top-6 right-6 xl:top-3 xl:right-3 2xl:top-6 2xl:right-6 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                    <svg className="w-12 h-12 xl:w-7 xl:h-7 2xl:w-12 2xl:h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>

                  <div className="flex items-center mb-6 xl:mb-3 2xl:mb-6 gap-1 xl:gap-0.5 2xl:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8 xl:mb-4 2xl:mb-8 leading-relaxed text-base xl:text-[11px] xl:leading-tight 2xl:text-base relative z-10">
                    &quot;Supervisaron nuestra obra con excelencia. Su experiencia nos permitió evitar problemas y optimizar recursos. Totalmente recomendables.&quot;
                  </p>
                  
                  <div className="flex items-center gap-4 xl:gap-2 2xl:gap-4 mt-auto">
                    <div className="relative w-14 h-14 xl:w-9 xl:h-9 2xl:w-14 2xl:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-blue-500">
                      <Image
                        src="/images/testimonios/m.webp"
                        alt="Ana Sánchez"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg xl:text-sm 2xl:text-lg font-bold text-gray-900 dark:text-white">Ana Sánchez</h4>
                      <p className="text-sm xl:text-[10px] 2xl:text-sm text-gray-500 dark:text-gray-400">Ingeniera Civil</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Testimonial 5 */}
              <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/3">
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 xl:p-4 2xl:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border-2 border-transparent hover:border-green-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
                  
                  <div className="absolute top-6 right-6 xl:top-3 xl:right-3 2xl:top-6 2xl:right-6 text-green-500/10 group-hover:text-green-500/20 transition-colors">
                    <svg className="w-12 h-12 xl:w-7 xl:h-7 2xl:w-12 2xl:h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>

                  <div className="flex items-center mb-6 xl:mb-3 2xl:mb-6 gap-1 xl:gap-0.5 2xl:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8 xl:mb-4 2xl:mb-8 leading-relaxed text-base xl:text-[11px] xl:leading-tight 2xl:text-base relative z-10">
                    &quot;El proyecto de urbanización fue impecable. Desde la planificación hasta la entrega, todo fue manejado con profesionalismo absoluto.&quot;
                  </p>
                  
                  <div className="flex items-center gap-4 xl:gap-2 2xl:gap-4 mt-auto">
                    <div className="relative w-14 h-14 xl:w-9 xl:h-9 2xl:w-14 2xl:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-green-500">
                      <Image
                        src="/images/testimonios/h.png"
                        alt="Carlos Fernández"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg xl:text-sm 2xl:text-lg font-bold text-gray-900 dark:text-white">Carlos Fernández</h4>
                      <p className="text-sm xl:text-[10px] 2xl:text-sm text-gray-500 dark:text-gray-400">Director de Proyecto</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Testimonial 6 */}
              <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/3">
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 xl:p-4 2xl:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border-2 border-transparent hover:border-purple-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
                  
                  <div className="absolute top-6 right-6 xl:top-3 xl:right-3 2xl:top-6 2xl:right-6 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                    <svg className="w-12 h-12 xl:w-7 xl:h-7 2xl:w-12 2xl:h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>

                  <div className="flex items-center mb-6 xl:mb-3 2xl:mb-6 gap-1 xl:gap-0.5 2xl:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8 xl:mb-4 2xl:mb-8 leading-relaxed text-base xl:text-[11px] xl:leading-tight 2xl:text-base relative z-10">
                    &quot;Los estudios de impacto ambiental fueron muy completos. Su equipo técnico demostró un alto nivel de conocimiento y compromiso.&quot;
                  </p>
                  
                  <div className="flex items-center gap-4 xl:gap-2 2xl:gap-4 mt-auto">
                    <div className="relative w-14 h-14 xl:w-9 xl:h-9 2xl:w-14 2xl:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-purple-500">
                      <Image
                        src="/images/testimonios/m.webp"
                        alt="Laura Ramírez"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg xl:text-sm 2xl:text-lg font-bold text-gray-900 dark:text-white">Laura Ramírez</h4>
                      <p className="text-sm xl:text-[10px] 2xl:text-sm text-gray-500 dark:text-gray-400">Consultora Ambiental</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Testimonial 7 */}
              <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/3">
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 xl:p-4 2xl:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border-2 border-transparent hover:border-pink-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-pink-500/10 to-transparent rounded-bl-full"></div>
                  
                  <div className="absolute top-6 right-6 xl:top-3 xl:right-3 2xl:top-6 2xl:right-6 text-pink-500/10 group-hover:text-pink-500/20 transition-colors">
                    <svg className="w-12 h-12 xl:w-7 xl:h-7 2xl:w-12 2xl:h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>

                  <div className="flex items-center mb-6 xl:mb-3 2xl:mb-6 gap-1 xl:gap-0.5 2xl:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8 xl:mb-4 2xl:mb-8 leading-relaxed text-base xl:text-[11px] xl:leading-tight 2xl:text-base relative z-10">
                    &quot;La remodelación de nuestras oficinas quedó perfecta. El acabado es de primer nivel y respetaron completamente nuestro presupuesto.&quot;
                  </p>
                  
                  <div className="flex items-center gap-4 xl:gap-2 2xl:gap-4 mt-auto">
                    <div className="relative w-14 h-14 xl:w-9 xl:h-9 2xl:w-14 2xl:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-pink-500">
                      <Image
                        src="/images/testimonios/h.png"
                        alt="Daniel Torres"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg xl:text-sm 2xl:text-lg font-bold text-gray-900 dark:text-white">Daniel Torres</h4>
                      <p className="text-sm xl:text-[10px] 2xl:text-sm text-gray-500 dark:text-gray-400">Gerente General</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Testimonial 8 */}
              <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/3">
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 xl:p-4 2xl:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border-2 border-transparent hover:border-indigo-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-indigo-500/10 to-transparent rounded-bl-full"></div>
                  
                  <div className="absolute top-6 right-6 xl:top-3 xl:right-3 2xl:top-6 2xl:right-6 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
                    <svg className="w-12 h-12 xl:w-7 xl:h-7 2xl:w-12 2xl:h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>

                  <div className="flex items-center mb-6 xl:mb-3 2xl:mb-6 gap-1 xl:gap-0.5 2xl:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8 xl:mb-4 2xl:mb-8 leading-relaxed text-base xl:text-[11px] xl:leading-tight 2xl:text-base relative z-10">
                    &quot;Las instalaciones eléctricas fueron realizadas con los más altos estándares de seguridad. Un trabajo impecable y muy profesional.&quot;
                  </p>
                  
                  <div className="flex items-center gap-4 xl:gap-2 2xl:gap-4 mt-auto">
                    <div className="relative w-14 h-14 xl:w-9 xl:h-9 2xl:w-14 2xl:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-indigo-500">
                      <Image
                        src="/images/testimonios/m.webp"
                        alt="Patricia Morales"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg xl:text-sm 2xl:text-lg font-bold text-gray-900 dark:text-white">Patricia Morales</h4>
                      <p className="text-sm xl:text-[10px] 2xl:text-sm text-gray-500 dark:text-gray-400">Administradora</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certificaciones" className="bg-white dark:bg-gray-900 py-24 relative overflow-hidden scroll-mt-20 mx-auto animate-on-scroll" data-animation="animate__fadeInRight">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#9A1D25] font-bold text-[10px] 2xl:text-sm lg:text-xs xl:text-xs uppercase tracking-wider px-4 lg:px-3 xl:px-3 py-2 lg:py-1.5 xl:py-1.5 rounded-full border-2 border-[#9A1D25]/20">Confianza y Calidad</span>
            <h2 className="text-3xl md:text-5xl lg:text-2xl xl:text-2xl 2xl:text-5xl font-black text-gray-900 dark:text-white mt-4 lg:mt-3 xl:mt-3 mb-4 lg:mb-3 xl:mb-3">
              Certificaciones y
              <br />
              <span className="text-[#9A1D25] text-3xl md:text-5xl lg:text-2xl xl:text-2xl 2xl:text-5xl font-bold">Reconocimientos</span>
            </h2>
            <p className="text-xl lg:text-sm xl:text-sm 2xl:text-xl text-gray-600 dark:text-gray-300 max-w-3xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl mx-auto">
              Respaldados por los más altos estándares <br className="hidden md:block" /> internacionales de la industria de construcción
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 max-w-7xl mx-auto lg:max-w-5xl xl:max-w-3xl 2xl:max-w-5xl">
            {/* ISO 9001 */}
            <div className="group relative h-full animate-on-scroll" data-animation="animate__flipInY">
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl lg:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl lg:rounded-2xl p-12 lg:p-8 xl:p-6 2xl:p-12 border border-gray-200 dark:border-gray-800 group-hover:border-[#9A1D25]/30 transition-all duration-500 h-full flex flex-col">
                <div className="mb-8 lg:mb-6 xl:mb-4 2xl:mb-8">
                  <div className="relative w-24 h-24 lg:w-20 lg:h-20 xl:w-16 xl:h-16 2xl:w-24 2xl:h-24 border-2 border-[#9A1D25] dark:border-[#8B7355]/60 group-hover:border-[#9A1D25] rounded-2xl lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 mx-auto">
                    <div className="absolute inset-0 bg-[#8B7355] opacity-20 blur-xl rounded-2xl lg:rounded-xl transition-opacity duration-500 group-hover:opacity-30"></div>
                    <svg className="relative w-12 h-12 lg:w-10 lg:h-10 xl:w-8 xl:h-8 2xl:w-12 2xl:h-12 dark:text-[#A0876D] text-[#9A1D25] transition-colors duration-500 drop-shadow-[0_0_8px_rgba(139,115,85,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl lg:text-lg xl:text-base 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-2 xl:mb-2 2xl:mb-3">
                    ISO 9001:2015
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base lg:text-sm xl:text-xs 2xl:text-base">
                    Sistema de Gestión de Calidad certificado internacionalmente
                  </p>
                </div>
              </div>
            </div>

            {/* ISO 14001 */}
            <div className="group relative h-full animate-on-scroll" data-animation="animate__flipInY">
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl lg:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl lg:rounded-2xl p-12 lg:p-8 xl:p-6 2xl:p-12 border border-gray-200 dark:border-gray-800 group-hover:border-[#9A1D25]/30 transition-all duration-500 h-full flex flex-col">
                <div className="mb-8 lg:mb-6 xl:mb-4 2xl:mb-8">
                  <div className="relative w-24 h-24 lg:w-20 lg:h-20 xl:w-16 xl:h-16 2xl:w-24 2xl:h-24 border-2 border-[#9A1D25] dark:border-[#8B7355]/60 rounded-2xl lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 mx-auto">
                    <div className="absolute inset-0 bg-[#8B7355] opacity-20 blur-xl rounded-2xl lg:rounded-xl transition-opacity duration-500 group-hover:opacity-30"></div>
                    <svg className="relative w-12 h-12 lg:w-10 lg:h-10 xl:w-8 xl:h-8 2xl:w-12 2xl:h-12 dark:text-[#A0876D text-[#9A1D25] transition-colors duration-500 drop-shadow-[0_0_8px_rgba(139,115,85,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl lg:text-lg xl:text-base 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-2 xl:mb-2 2xl:mb-3">
                    ISO 14001:2015
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base lg:text-sm xl:text-xs 2xl:text-base">
                    Gestión Ambiental y compromiso sustentable
                  </p>
                </div>
              </div>
            </div>

            {/* ISO 45001 */}
            <div className="group relative h-full animate-on-scroll" data-animation="animate__flipInY">
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl lg:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl lg:rounded-2xl p-12 lg:p-8 xl:p-6 2xl:p-12 border border-gray-200 dark:border-gray-800 group-hover:border-[#9A1D25]/30 transition-all duration-500 h-full flex flex-col">
                <div className="mb-8 lg:mb-6 xl:mb-4 2xl:mb-8">
                  <div className="relative w-24 h-24 lg:w-20 lg:h-20 xl:w-16 xl:h-16 2xl:w-24 2xl:h-24 border-2 border-[#9A1D25] dark:border-[#8B7355]/60 group-hover:border-[#9A1D25] rounded-2xl lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 mx-auto">
                    <div className="absolute inset-0 bg-[#8B7355] opacity-20 blur-xl rounded-2xl lg:rounded-xl transition-opacity duration-500 group-hover:opacity-30"></div>
                    <svg className="relative w-12 h-12 lg:w-10 lg:h-10 xl:w-8 xl:h-8 2xl:w-12 2xl:h-12 dark:text-[#A0876D] text-[#9A1D25] transition-colors duration-500 drop-shadow-[0_0_8px_rgba(139,115,85,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl lg:text-lg xl:text-base 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-2 xl:mb-2 2xl:mb-3">
                    ISO 45001:2018
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base lg:text-sm xl:text-xs 2xl:text-base">
                    Seguridad y Salud Ocupacional en el trabajo
                  </p>
                </div>
              </div>
            </div>

            {/* LEED */}
            <div className="group relative h-full animate-on-scroll" data-animation="animate__flipInY">
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl lg:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl lg:rounded-2xl p-12 lg:p-8 xl:p-6 2xl:p-12 border border-gray-200 dark:border-gray-800 group-hover:border-[#9A1D25]/30 transition-all duration-500 h-full flex flex-col">
                <div className="mb-8 lg:mb-6 xl:mb-4 2xl:mb-8">
                  <div className="relative w-24 h-24 lg:w-20 lg:h-20 xl:w-16 xl:h-16 2xl:w-24 2xl:h-24 border-2 border-[#9A1D25] dark:border-[#8B7355]/60 group-hover:border-[#9A1D25] rounded-2xl lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 mx-auto">
                    <div className="absolute inset-0 bg-[#8B7355] opacity-20 blur-xl rounded-2xl lg:rounded-xl transition-opacity duration-500 group-hover:opacity-30"></div>
                    <svg className="relative w-12 h-12 xl:w-8 xl:h-8 2xl:w-12 2xl:h-12 dark:text-[#A0876D] text-[#9A1D25] transition-colors duration-500 drop-shadow-[0_0_8px_rgba(139,115,85,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl lg:text-lg xl:text-base 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-2 xl:mb-2 2xl:mb-3">
                    LEED Certified
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base lg:text-sm xl:text-xs 2xl:text-base">
                    Liderazgo en Construcción Sustentable
                  </p>
                </div>
              </div>
            </div>

            {/* NOM-001-SEDE */}
            <div className="group relative h-full animate-on-scroll" data-animation="animate__flipInY">
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl lg:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl lg:rounded-2xl p-12 lg:p-8 xl:p-6 2xl:p-12 border border-gray-200 dark:border-gray-800 group-hover:border-[#9A1D25]/30 transition-all duration-500 h-full flex flex-col">
                <div className="mb-8 lg:mb-6 xl:mb-4 2xl:mb-8">
                  <div className="relative w-24 h-24 lg:w-20 lg:h-20 xl:w-16 xl:h-16 2xl:w-24 2xl:h-24 border-2 border-[#9A1D25] dark:border-[#8B7355]/60 group-hover:border-[#9A1D25] rounded-2xl lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 mx-auto">
                    <div className="absolute inset-0 bg-[#8B7355] opacity-20 blur-xl rounded-2xl lg:rounded-xl transition-opacity duration-500 group-hover:opacity-30"></div>
                    <svg className="relative w-12 h-12 xl:w-8 xl:h-8 2xl:w-12 2xl:h-12 dark:text-[#A0876D] text-[#9A1D25] transition-colors duration-500 drop-shadow-[0_0_8px_rgba(139,115,85,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl lg:text-lg xl:text-base 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-2 xl:mb-2 2xl:mb-3">
                    NOM-001-SEDE
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base lg:text-sm xl:text-xs 2xl:text-base">
                    Normativa de Instalaciones Eléctricas
                  </p>
                </div>
              </div>
            </div>

            

            {/* CMIC */}
            <div className="group relative h-full animate-on-scroll" data-animation="animate__flipInY">
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl lg:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl lg:rounded-2xl p-12 lg:p-8 xl:p-6 2xl:p-12 border border-gray-200 dark:border-gray-800 group-hover:border-[#9A1D25]/30 transition-all duration-500 h-full flex flex-col">
                <div className="mb-8 lg:mb-6 xl:mb-4 2xl:mb-8">
                  <div className="relative w-24 h-24 lg:w-20 lg:h-20 xl:w-16 xl:h-16 2xl:w-24 2xl:h-24 border-2 border-[#9A1D25] dark:border-[#8B7355]/60 group-hover:border-[#9A1D25] rounded-2xl lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 mx-auto">
                    <div className="absolute inset-0 bg-[#8B7355] opacity-20 blur-xl rounded-2xl lg:rounded-xl transition-opacity duration-500 group-hover:opacity-30"></div>
                    <svg className="relative w-12 h-12 lg:w-10 lg:h-10 xl:w-8 xl:h-8 2xl:w-12 2xl:h-12 dark:text-[#A0876D] text-[#9A1D25] transition-colors duration-500 drop-shadow-[0_0_8px_rgba(139,115,85,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl lg:text-lg xl:text-base 2xl:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-2 xl:mb-2 2xl:mb-3">
                    CMIC
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base lg:text-sm xl:text-xs 2xl:text-base">
                    Cámara Mexicana de la Industria
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="bg-white dark:bg-gray-900 pt-5 relative overflow-hidden mb-20 scroll-mt-28 animate-on-scroll" data-animation="animate__fadeInLeft">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#9A1D25] font-bold text-[10px] 2xl:text-sm lg:text-xs xl:text-xs uppercase tracking-wider px-4 lg:px-3 xl:px-3 py-2 lg:py-1.5 xl:py-1.5 rounded-full border-2 border-[#9A1D25]/20">Nuestro Equipo</span>
            <h2 className="text-3xl md:text-5xl lg:text-2xl xl:text-2xl 2xl:text-5xl font-black text-gray-900 dark:text-white mt-4 lg:mt-3 xl:mt-3 mb-4 lg:mb-3 xl:mb-3">
              Expertos en
              <br />
              <span className="text-[#9A1D25] text-3xl md:text-5xl lg:text-2xl xl:text-2xl 2xl:text-5xl font-bold">Construcción</span>
            </h2>
            <p className="text-xl lg:text-sm xl:text-sm 2xl:text-xl text-gray-600 dark:text-gray-300 max-w-3xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl mx-auto">
              Profesionales comprometidos con la <br className='hidden md:block' /> excelencia y la innovación en cada proyecto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 max-w-6xl xl:max-w-3xl mx-auto auto-rows-fr lg:mx-32 xl:mx-auto">
            {/* Team Member 1 */}
            <div className="group relative h-full w-full max-w-xs md:mx-auto lg:col-span-2 animate-on-scroll" data-animation="animate__bounceInLeft">
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl lg:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl lg:rounded-2xl p-8 lg:p-4 xl:p-5 2xl:p-8 border border-gray-200 dark:border-gray-800 group-hover:border-[#9A1D25]/30 transition-all duration-500 h-full flex flex-col">
                <div className="mb-6 lg:mb-3 xl:mb-4 2xl:mb-6">
                  <div className="w-32 h-32 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-32 2xl:h-32 mx-auto bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl lg:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <svg className="w-16 h-16 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center grow flex flex-col">
                  <h3 className="text-xl lg:text-base xl:text-base 2xl:text-xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-1 xl:mb-1 2xl:mb-2 lg:mx-2">
                    Urb. Liliana Olmos Cruz
                  </h3>
                  <p className="text-[#9A1D25] font-semibold mb-3 lg:mb-1 xl:mb-2 2xl:mb-3 text-base lg:text-sm xl:text-sm 2xl:text-base">Dirección General</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-[12px] xl:text-xs 2xl:text-sm leading-relaxed">
                    Especialista en planeación territorial y desarrollo urbano
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="group relative h-full w-full max-w-xs md:mx-auto lg:col-span-2 animate-on-scroll" data-animation="animate__bounceInUp">
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl lg:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl lg:rounded-2xl p-8 lg:p-4 xl:p-5 2xl:p-8 border border-gray-200 dark:border-gray-800 group-hover:border-[#9A1D25]/30 transition-all duration-500 h-full flex flex-col">
                <div className="mb-6 lg:mb-3 xl:mb-4 2xl:mb-6">
                  <div className="w-32 h-32 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-32 2xl:h-32 mx-auto bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl lg:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <svg className="w-16 h-16 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center grow flex flex-col">
                  <h3 className="text-xl lg:text-base xl:text-base 2xl:text-xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-1 xl:mb-1 2xl:mb-2 lg:mx-2">
                    Ing. Antonio Carrera Morales
                  </h3>
                  <p className="text-[#9A1D25] font-semibold mb-3 lg:mb-1 xl:mb-2 2xl:mb-3 text-base lg:text-sm xl:text-sm 2xl:text-base">Supervisor</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-[12px] xl:text-xs 2xl:text-sm leading-relaxed">
                    Experto en supervisión y control de calidad en obra
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="group relative h-full w-full max-w-xs md:mx-auto lg:col-span-2 animate-on-scroll" data-animation="animate__bounceInRight">
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl lg:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl lg:rounded-2xl p-8 lg:p-4 xl:p-5 2xl:p-8 border border-gray-200 dark:border-gray-800 group-hover:border-[#9A1D25]/30 transition-all duration-500 h-full flex flex-col">
                <div className="mb-6 lg:mb-3 xl:mb-4 2xl:mb-6">
                  <div className="w-32 h-32 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-32 2xl:h-32 mx-auto bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl lg:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <svg className="w-16 h-16 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center grow flex flex-col">
                  <h3 className="text-xl lg:text-base xl:text-base 2xl:text-xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-1 xl:mb-1 2xl:mb-2 lg:mx-2">
                    Arq. Andrés Claudio Ramos
                  </h3>
                  <p className="text-[#9A1D25] font-semibold mb-3 lg:mb-1 xl:mb-2 2xl:mb-3 text-base lg:text-sm xl:text-sm 2xl:text-base">Director de Proyectos</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-[12px] xl:text-xs 2xl:text-sm leading-relaxed">
                    Especialista en proyectos arquitectónicos
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="group relative h-full w-full max-w-xs md:mx-auto lg:col-span-2 lg:col-start-2 animate-on-scroll" data-animation="animate__bounceInLeft">
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl lg:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl lg:rounded-2xl p-8 lg:p-4 xl:p-5 2xl:p-8 border border-gray-200 dark:border-gray-800 group-hover:border-[#9A1D25]/30 transition-all duration-500 h-full flex flex-col">
                <div className="mb-6 lg:mb-3 xl:mb-4 2xl:mb-6">
                  <div className="w-32 h-32 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-32 2xl:h-32 mx-auto bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl lg:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <svg className="w-16 h-16 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center grow flex flex-col">
                  <h3 className="text-xl lg:text-base xl:text-base 2xl:text-xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-1 xl:mb-1 2xl:mb-2 lg:mx-2">
                    Luis Tochihuitl Rojas
                  </h3>
                  <p className="text-[#9A1D25] font-semibold mb-3 lg:mb-1 xl:mb-2 2xl:mb-3 text-base lg:text-sm xl:text-sm 2xl:text-base">Gestor de Licencias</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-[12px] xl:text-xs 2xl:text-sm leading-relaxed">
                    Gestor de licencias y permisos de construcción
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member 5 - Centered in third row */}
            <div className="group relative h-full w-full max-w-xs md:col-span-2 md:col-start-1 lg:col-span-2 mx-auto animate-on-scroll" data-animation="animate__bounceInUp">
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl lg:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl lg:rounded-2xl p-8 lg:p-4 xl:p-5 2xl:p-8 border border-gray-200 dark:border-gray-800 group-hover:border-[#9A1D25]/30 transition-all duration-500 h-full flex flex-col">
                <div className="mb-6 lg:mb-3 xl:mb-4 2xl:mb-6">
                  <div className="w-32 h-32 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-32 2xl:h-32 mx-auto bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl lg:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <svg className="w-16 h-16 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-16 2xl:h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center grow flex flex-col">
                  <h3 className="text-xl lg:text-base xl:text-base 2xl:text-xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-1 xl:mb-1 2xl:mb-2 lg:mx-2">
                    Eugenio Gerardo Mendoza Gasca
                  </h3>
                  <p className="text-[#9A1D25] font-semibold mb-3 lg:mb-1 xl:mb-2 2xl:mb-3 text-base lg:text-sm xl:text-sm 2xl:text-base">Director de Planeación</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-[12px] xl:text-xs 2xl:text-sm leading-relaxed">
                    Dirección de planeación territorial y desarrollo urbano
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="contacto" className="relative bg-linear-to-br from-[#9A1D25] to-[#7A1519] py-20 overflow-hidden scroll-mt-20 animate-on-scroll" data-animation="animate__zoomIn">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: false,
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                enable: false,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "out",
                },
                random: true,
                speed: 0.5,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 150,
              },
              opacity: {
                value: { min: 0.1, max: 0.8 },
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0.1,
                  sync: false,
                },
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 4 },
              },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 z-0"
        />
        
        <div className="container mx-auto px-6 text-center relative z-10">
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
    </div>
  );
}
