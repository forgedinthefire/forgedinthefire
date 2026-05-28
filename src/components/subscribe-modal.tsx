'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react'
import { 
  PREFERENCE_OPTIONS, 
  getDefaultPreferences,
  type SubscriptionFormData, 
  type EmailPreference,
  type SubscriberPreferences
} from '@/src/features/subscribers/types'
import { cn } from '@/lib/utils'

interface SubscribeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    email: '',
    phone: '',
    interest: 'general',
    preferences: getDefaultPreferences()
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        interest: 'general',
        preferences: getDefaultPreferences()
      })
      setResult(null)
      setErrors({})
    }
  }, [isOpen])
  
  // Update primary interest when preferences change
  const updatePreference = (key: keyof SubscriberPreferences, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }))
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsSubmitting(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name || undefined,
          phone: formData.phone || undefined,
          interest: 'general',
          preferences: formData.preferences,
          source: 'website'
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, message: data.error || 'Something went wrong' })
      }
    } catch {
      setResult({ success: false, message: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscribe-title"
          >
            <div className="bg-[#1E1714] border border-[#3A2A24] rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#1E6B73] to-[#4C9AA3] p-6 text-center">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 id="subscribe-title" className="font-playfair text-2xl font-bold text-white">
                  Stay Connected
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Stay connected with Forged in the Fire. Choose the updates you would like to receive.
                </p>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {result ? (
                  <div className="text-center py-4">
                    {result.success ? (
                      <>
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="font-semibold text-[#C8A46B] text-lg mb-2">Thank You!</h3>
                        <p className="text-[#CDBDAF]">{result.message}</p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="font-semibold text-red-400 text-lg mb-2">Something Went Wrong</h3>
                        <p className="text-[#CDBDAF]">{result.message}</p>
                      </>
                    )}
                    <Button
                      onClick={onClose}
                      className="mt-6 bg-[#1E6B73] hover:bg-[#4C9AA3] text-white"
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name" className="text-[#CDBDAF]">
                        Name <span className="text-[#8B5E3C]">(optional)</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="bg-[#181210] border-[#3A2A24] text-[#F6F0E8] placeholder:text-[#8B5E3C] focus:border-[#1E6B73] mt-1"
                      />
                    </div>
                    
                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-[#CDBDAF]">
                        Email <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className={cn(
                          "bg-[#181210] border-[#3A2A24] text-[#F6F0E8] placeholder:text-[#8B5E3C] focus:border-[#1E6B73] mt-1",
                          errors.email && "border-red-500"
                        )}
                        aria-invalid={errors.email ? 'true' : 'false'}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-[#CDBDAF]">
                        Phone <span className="text-[#8B5E3C]">(optional)</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="bg-[#181210] border-[#3A2A24] text-[#F6F0E8] placeholder:text-[#8B5E3C] focus:border-[#1E6B73] mt-1"
                      />
                    </div>
                    
                    {/* Email Preferences */}
                    <div>
                      <Label className="text-[#CDBDAF] mb-3 block">
                        Choose the updates you would like to receive:
                      </Label>
                      <div className="space-y-3">
                        {PREFERENCE_OPTIONS.map((option) => (
                          <label 
                            key={option.value} 
                            className="flex items-start gap-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={formData.preferences[option.value]}
                              onChange={(e) => updatePreference(option.value, e.target.checked)}
                              className="mt-1 w-4 h-4 rounded border-[#3A2A24] bg-[#181210] text-[#1E6B73] focus:ring-[#1E6B73] focus:ring-offset-0"
                            />
                            <div className="flex-1">
                              <span className="text-[#F6F0E8] text-sm font-medium group-hover:text-[#4C9AA3] transition-colors">
                                {option.label}
                              </span>
                              {option.default && (
                                <span className="text-[#4C9AA3] text-xs ml-2">(Recommended)</span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1E6B73] hover:bg-[#4C9AA3] text-white py-3 h-auto font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                    
                    <p className="text-xs text-[#8B5E3C] text-center">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
