'use client';

import { useEffect } from 'react';

export default function ExtensionHandler() {
  useEffect(() => {
    // Prevent browser extension conflicts
    const handleError = (e: ErrorEvent) => {
      if (e.message && (e.message.includes('window.solana') || e.message.includes('extension'))) {
        console.log('Browser extension conflict detected and handled');
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);

    // Prevent extension script injection hydration issues
    const handleDOMContentLoaded = () => {
      const extensionScripts = document.querySelectorAll('script[data-extension-id]');
      extensionScripts.forEach((script) => {
        script.setAttribute('data-hydration-ignore', 'true');
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    } else {
      handleDOMContentLoaded();
    }

    return () => {
      window.removeEventListener('error', handleError);
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
    };
  }, []);

  return null;
}
