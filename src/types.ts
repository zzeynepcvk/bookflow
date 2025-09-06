export type Book = {
  id: string
  title: string
  author: string
  pages?: number
  readPages: number
  notes?: string
  quotes?: string[]
  coverUrl?: string
  addedAt: string
  ownerId?: string 
}