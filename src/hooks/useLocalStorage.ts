import { useCallback, useState } from 'react'

const STORAGE_KEY = 'asset-statistics-moments'

export function useLocalStorage<T>(key: string = STORAGE_KEY) {
  const [stored, setStored] = useState<T | null>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : null
    } catch {
      return null
    }
  })

  const setValue = useCallback(
    (value: T | null) => {
      try {
        if (value === null) {
          window.localStorage.removeItem(key)
        } else {
          window.localStorage.setItem(key, JSON.stringify(value))
        }
        setStored(value)
      } catch (e) {
        console.error('localStorage set error', e)
      }
    },
    [key],
  )

  return [stored, setValue] as const
}
