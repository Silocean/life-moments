import { useCallback } from 'react'
import type { Moment, MomentsStorage } from '../types/moment'
import { useLocalStorage } from './useLocalStorage'

function generateId(): string {
  return crypto.randomUUID()
}

export function useMoments() {
  const [data, setData] = useLocalStorage<MomentsStorage>()

  const moments = data?.moments ?? []

  const addMoment = useCallback(
    (moment: Omit<Moment, 'id' | 'createdAt'>) => {
      const newMoment: Moment = {
        ...moment,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }
      setData({ moments: [...moments, newMoment] })
      return newMoment.id
    },
    [moments, setData],
  )

  const updateMoment = useCallback(
    (id: string, updates: Partial<Pick<Moment, 'name' | 'date' | 'description' | 'category'>>) => {
      setData({
        moments: moments.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      })
    },
    [moments, setData],
  )

  const deleteMoment = useCallback(
    (id: string) => {
      setData({ moments: moments.filter((m) => m.id !== id) })
    },
    [moments, setData],
  )

  const exportData = useCallback(() => {
    return JSON.stringify({ moments }, null, 2)
  }, [moments])

  const importData = useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json) as MomentsStorage
        if (Array.isArray(parsed?.moments)) {
          const valid = parsed.moments.filter(
            (m): m is Moment =>
              typeof m?.id === 'string' &&
              typeof m?.name === 'string' &&
              typeof m?.date === 'string' &&
              typeof m?.createdAt === 'string',
          )
          setData({ moments: valid })
          return true
        }
      } catch {
        // invalid JSON
      }
      return false
    },
    [setData],
  )

  return { moments, addMoment, updateMoment, deleteMoment, exportData, importData }
}
