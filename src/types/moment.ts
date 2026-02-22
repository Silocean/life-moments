export interface Moment {
  id: string
  name: string
  date: string
  description?: string
  category?: string
  createdAt: string
}

export interface MomentsStorage {
  moments: Moment[]
}
