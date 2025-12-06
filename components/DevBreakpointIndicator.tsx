'use client';

export default function DevBreakpointIndicator() {
  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white px-4 py-2 rounded-full font-mono text-sm font-bold shadow-2xl backdrop-blur-sm border-2 border-white/20">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="block sm:hidden">XS</span>
        <span className="hidden sm:block md:hidden">SM</span>
        <span className="hidden md:block lg:hidden">MD</span>
        <span className="hidden lg:block xl:hidden">LG</span>
        <span className="hidden xl:block 2xl:hidden">XL</span>
        <span className="hidden 2xl:block">2XL</span>
      </div>
    </div>
  );
}
