'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-ivory px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="font-serif text-3xl font-bold text-charcoal-800 mb-4">
          Something went wrong
        </h1>
        
        <p className="text-charcoal-600 mb-8">
          We&apos;re sorry, but there was an error loading this page. 
          Your safety is important—use the Quick Exit button if needed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="border-forge-500 text-forge-600 hover:bg-forge-50 transition-all">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          
          <Button asChild className="bg-forge-600 hover:bg-forge-700 text-white shadow-warm hover:shadow-warm-lg transition-all">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
