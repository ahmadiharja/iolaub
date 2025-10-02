'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
// CopyButton removed - using inline copy functionality

interface ProjectConfig {
  contract_address: string;
  pump_fun_address: string;
}

export default function ContractCard() {
  const { theme, systemTheme } = useTheme();
  const [config, setConfig] = useState<ProjectConfig | null>(null);
  const [mounted, setMounted] = useState(false);

  // Determine current theme
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  useEffect(() => {
    setMounted(true);
    
    // Fetch project config
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to fetch config:', err));
  }, []);

  if (!mounted) {
    return (
      <Card className="relative overflow-hidden p-6 h-fit">
        <div className="animate-pulse">
          <div className="h-12 bg-muted rounded w-20 mb-8"></div>
          <div className="h-6 bg-muted rounded w-full mb-2"></div>
          <div className="h-8 bg-muted rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  const contractAddress = config?.contract_address || '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1';

  return (
    <Card className="relative overflow-hidden p-0 h-fit group hover:scale-[1.01] transition-all duration-500 shadow-lg">
      {/* Modern Card Background */}
      <div className="absolute inset-0">
        {/* Premium gradient background */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        }`}>
        </div>
        
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0"
               style={{
                 backgroundImage: `
                   radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 1px, transparent 1px),
                   radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 1px, transparent 1px)
                 `,
                 backgroundSize: '40px 40px'
               }}>
          </div>
        </div>

        {/* Modern accent elements */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${
          isDark ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10' : 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
        } -translate-y-16 translate-x-16`}></div>
        
        <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full ${
          isDark ? 'bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10' : 'bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5'
        } translate-y-12 -translate-x-12`}></div>
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Background logovrl.svg in bottom-left corner */}
        <div className="absolute bottom-0 left-0 w-96 h-96">
          <img 
            src="/assets/logovrl.svg" 
            alt="" 
            className="w-full h-full object-contain transform -translate-x-16 translate-y-16 logo-watermark"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Top section with logo and hashtag */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-48 h-48 relative -mt-16 ml-2">
            <Image
              src={isDark ? '/assets/png/bualoi_dark.png' : '/assets/png/bualoi_light.png'}
              alt="BUALOI Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
            isDark ? 'bg-white/10 text-white/80 border border-white/10' : 'bg-black/5 text-black/70 border border-black/10'
          }`}>
            #SaveLives
          </div>
        </div>

        {/* Contract Address Section - moved up */}
        <div className="flex flex-col space-y-2 mb-16">
          <div className={`text-xs font-bold tracking-wider text-right ${
            isDark ? 'text-white/50' : 'text-black/50'
          }`}>
            CONTRACT ADDRESS
          </div>
          
          {/* Full address display with copy functionality */}
          <div className="relative group/address cursor-pointer" onClick={() => {
            navigator.clipboard.writeText(contractAddress);
          }}>
            <div className={`font-semibold text-right text-lg leading-relaxed break-all transition-all duration-300 contract-address ${
              isDark ? 'text-white' : 'text-black'
            } group-hover/address:blur-sm`}>
              {contractAddress.length > 20 
                ? `${contractAddress.slice(0, 10)}*****${contractAddress.slice(-10)}`
                : contractAddress
              }
            </div>
            
            {/* Blurry overlay with copy button */}
            <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover/address:opacity-100 transition-all duration-300 ${
              isDark ? 'bg-black/20' : 'bg-white/20'
            } backdrop-blur-sm`}>
              <div className={`flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-base font-semibold">Copy</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Powered by Solana - bigger logo */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2 opacity-70">
          <span className={`text-sm font-medium ${
            isDark ? 'text-white/50' : 'text-black/50'
          }`}>
            powered by
          </span>
          <svg className="w-8 h-8" viewBox="0 0 397.7 311.7" fill="none">
            <linearGradient id="solana-gradient" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#9945FF"/>
              <stop offset="1" stopColor="#14F195"/>
            </linearGradient>
            <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 237.9z" fill="url(#solana-gradient)"/>
            <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#solana-gradient)"/>
            <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#solana-gradient)"/>
          </svg>
        </div>
      </div>
    </Card>
  );
}
