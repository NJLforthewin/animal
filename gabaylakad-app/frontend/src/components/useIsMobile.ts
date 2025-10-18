import { useState, useEffect } from 'react';

// Returns true if window width <= 430px (mobile)
export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 430 : false
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 430);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
