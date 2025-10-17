const Header = () => {
  return (
    <header className="relative flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-gradient-to-r from-[#4A3F71] to-[#5E507F] z-10">
      <div className="absolute inset-0 opacity-5 mix-blend-overlay"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="flex items-center relative">
        <div className="absolute -left-2 sm:-left-3 top-1/2 transform -translate-y-1/2 w-1 h-5 sm:w-1.5 sm:h-6 bg-teal-400 rounded-full opacity-80"></div>
        <span className="font-semibold text-white text-lg sm:text-xl md:text-2xl tracking-tight">
          Perplexity
        </span>
      </div>
    </header>
  );
};

export default Header;
