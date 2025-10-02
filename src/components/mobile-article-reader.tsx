'use client';

import { useState } from 'react';

interface MobileArticleReaderProps {
  children: React.ReactNode;
}

export default function MobileArticleReader({ children }: MobileArticleReaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="md:hidden relative">
      <div 
        className={`space-y-4 overflow-hidden transition-all duration-500 ${
          isExpanded ? '' : 'max-h-[400px]'
        }`}
      >
        {children}
      </div>
      
      {/* Fade overlay and Read More button */}
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end justify-center pb-4">
          <button 
            onClick={toggleExpanded}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            Read More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Read Less button when expanded */}
      {isExpanded && (
        <div className="flex justify-center mt-6">
          <button 
            onClick={toggleExpanded}
            className="bg-muted text-muted-foreground px-6 py-2 rounded-full font-medium hover:bg-muted/80 transition-colors flex items-center gap-2"
          >
            Read Less
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
