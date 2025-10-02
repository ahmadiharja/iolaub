'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// List of images in cardpic directory
const galleryImages = [
  { src: '/assets/cardpic/a.jpg', alt: 'Relief effort photo A' },
  { src: '/assets/cardpic/b.JPG', alt: 'Relief effort photo B' },
  { src: '/assets/cardpic/c.jpg', alt: 'Relief effort photo C' },
  { src: '/assets/cardpic/d.jpg', alt: 'Relief effort photo D' },
  { src: '/assets/cardpic/e.JPG', alt: 'Relief effort photo E' },
  { src: '/assets/cardpic/f.JPG', alt: 'Relief effort photo F' },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAlt, setSelectedAlt] = useState<string>('');
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const openModal = (src: string, alt: string) => {
    setImageLoading(true);
    setSelectedImage(src);
    setSelectedAlt(alt);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedAlt('');
    setImageLoading(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // handleKeyDown moved inside useEffect to fix dependency warning

  // Add event listener for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Cleanup: restore body scroll if component unmounts with modal open
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryImages.map((image, index) => (
          <div 
            key={index} 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden rounded-lg relative aspect-square"
            onClick={() => openModal(image.src, image.alt)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center rounded-lg">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                <div className="bg-white/95 backdrop-blur-sm text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  View Full Size
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-60 text-white hover:bg-white/20"
            onClick={closeModal}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Modal content */}
          <div 
            className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                src={selectedImage}
                alt={selectedAlt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                onLoadingComplete={() => setImageLoading(false)}
              />
            </div>
          </div>

        </div>
      )}
    </>
  );
}
