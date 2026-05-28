'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * Autosave hook for content editing
 * 
 * Usage:
 * const { isSaving, lastSaved } = useAutosave(content, saveFunction, 3000)
 */

export function useAutosave<T>(
  data: T,
  save: (data: T) => Promise<void>,
  delay: number = 3000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<Date | null>(null)
  const isSavingRef = useRef(false)

  const triggerSave = useCallback(async () => {
    if (isSavingRef.current) return
    
    isSavingRef.current = true
    try {
      await save(data)
      lastSavedRef.current = new Date()
    } catch (err) {
      console.error('Autosave failed:', err)
    } finally {
      isSavingRef.current = false
    }
  }, [data, save])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      triggerSave()
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, triggerSave])

  // Save on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // Final save attempt
      if (!isSavingRef.current && lastSavedRef.current) {
        triggerSave()
      }
    }
  }, [triggerSave])

  return {
    isSaving: isSavingRef.current,
    lastSaved: lastSavedRef.current,
    saveNow: triggerSave,
  }
}

/**
 * Simple debounce hook for form inputs
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

import { useState } from 'react'
