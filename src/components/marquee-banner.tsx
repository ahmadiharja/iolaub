'use client';

export default function MarqueeBanner() {
  const marqueeItems = Array(20).fill('#SaveLives'); // Repeat untuk seamless loop

  return (
    <div className="relative w-full overflow-hidden bg-red-500 dark:bg-yellow-500 py-3">
      {/* Gradient fade overlay - sama seperti hero carousel */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-1/6 bg-gradient-to-r from-background to-transparent"></div>
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-1/6 bg-gradient-to-l from-background to-transparent"></div>
      </div>

      {/* Marquee content */}
      <div className="flex animate-marquee whitespace-nowrap">
        {marqueeItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="text-white font-bold text-lg mx-8">
              {item}
            </span>
            {/* Police line separator */}
            <div className="flex items-center mx-4">
              <div className="w-8 h-0.5 bg-white/60"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full mx-1"></div>
              <div className="w-8 h-0.5 bg-white/60"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
