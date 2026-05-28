'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { quickEscape } from '@/lib/utils';
import { LogOut } from 'lucide-react';

/**
 * Quick Exit Component
 * 
 * A trauma-informed safety feature that allows users to quickly leave the site
 * and navigate to a neutral external page. This is critical for survivor safety.
 * 
 * Features:
 * - Keyboard shortcut (Escape key) for immediate exit
 * - Floating button always visible
 * - Clears browsing history/state when possible
 * - Redirects to weather.com or similar neutral site
 */
export function QuickExit() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Hide on admin routes - admin pages don't need the quick exit feature
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/login') || pathname?.startsWith('/unauthorized');
  if (isAdminRoute) return null;

  useEffect(() => {
    setIsMounted(true);
    
    // Show button after a short delay to not be jarring on initial load
    const timer = setTimeout(() => setIsVisible(true), 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut - Escape key triggers quick exit
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Exit on Escape key (with Ctrl/Command for safety against accidental presses)
    if (event.key === 'Escape' && (event.ctrlKey || event.metaKey)) {
      quickEscape();
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, isMounted]);

  const handleExit = () => {
    quickEscape();
  };

  // Don't render during SSR to avoid hydration mismatch
  if (!isMounted) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
      role="complementary"
      aria-label="Safety exit"
    >
      <Button
        onClick={handleExit}
        size="lg"
        variant="destructive"
        className="group border-0"
        aria-label="Quick Exit - Leave this site immediately"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? '#9D0208' : '#C1121F',
          color: '#ffffff',
          animation: isHovered ? 'none' : 'quickExitPulse 1.6s ease-in-out infinite',
          boxShadow: isHovered
            ? '0 12px 40px rgba(0,0,0,0.5)'
            : '0 8px 30px rgba(0,0,0,0.4)',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span className="font-semibold">Quick Exit</span>
        <span className="sr-only">
          Press to immediately leave this website and go to weather.com. 
          You can also press Ctrl+Escape to exit quickly.
        </span>
      </Button>
      
      {/* Tooltip for keyboard shortcut */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs text-[#B8A89A] bg-[#3A2A24] shadow-[0_4px_12px_rgba(0,0,0,0.3)] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Ctrl+Esc to exit
        </span>
      </div>
    </div>
  );
}
