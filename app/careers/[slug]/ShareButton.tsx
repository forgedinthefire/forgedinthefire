'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)
  
  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  return (
    <Button 
      variant="outline" 
      className="w-full border-gold/50 text-gold hover:bg-gold/10"
      onClick={handleShare}
    >
      <Share2 className="w-4 h-4 mr-2" />
      {copied ? 'Link Copied!' : 'Copy Link'}
    </Button>
  )
}
